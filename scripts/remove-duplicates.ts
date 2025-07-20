import { db } from "../lib/firebase.js"
import { collection, getDocs, deleteDoc, doc, query, orderBy, type DocumentData } from "firebase/firestore"

// Types for better type safety
interface Prediction {
  id: string
  medicationId: string
  municipalityId: string
  periodType: "weekly" | "monthly"
  weekNumber?: number
  monthNumber?: number
  createdAt: string
  y?: number
  predictedValue?: number
  date?: string
  confidence?: number
  label?: string
  weatherParams?: {
    temperature: number
    humidity: number
  }
}

interface DuplicateGroup {
  key: string
  predictions: Prediction[]
}

// Create a unique key for grouping duplicates
function createUniqueKey(prediction: Prediction): string {
  const { medicationId, municipalityId, periodType, weekNumber, monthNumber } = prediction

  if (periodType === "weekly" && weekNumber !== undefined) {
    return `${medicationId}_${municipalityId}_weekly_${weekNumber}`
  } else if (periodType === "monthly" && monthNumber !== undefined) {
    return `${medicationId}_${municipalityId}_monthly_${monthNumber}`
  }

  // Fallback for malformed data
  return `${medicationId}_${municipalityId}_${periodType}_unknown`
}

// Find duplicates in the predictions
function findDuplicates(predictions: Prediction[]): DuplicateGroup[] {
  const groups = new Map<string, Prediction[]>()

  // Group predictions by unique key
  predictions.forEach((prediction) => {
    const key = createUniqueKey(prediction)
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(prediction)
  })

  // Filter out groups with only one item (no duplicates)
  const duplicateGroups: DuplicateGroup[] = []
  groups.forEach((predictions, key) => {
    if (predictions.length > 1) {
      duplicateGroups.push({ key, predictions })
    }
  })

  return duplicateGroups
}

// Keep the most recent prediction (by createdAt) and mark others for deletion
function selectPredictionsToDelete(duplicateGroups: DuplicateGroup[]): string[] {
  const toDelete: string[] = []

  duplicateGroups.forEach((group) => {
    // Sort by createdAt descending (most recent first)
    const sorted = group.predictions.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    // Keep the first (most recent), delete the rest
    const [keep, ...deleteList] = sorted

    console.log(`Group ${group.key}:`)
    console.log(`  Keeping: ${keep.id} (created: ${keep.createdAt})`)
    console.log(`  Deleting: ${deleteList.length} duplicates`)

    toDelete.push(...deleteList.map((p) => p.id))
  })

  return toDelete
}

// Convert Firestore document to Prediction type
function documentToPrediction(id: string, data: DocumentData): Prediction {
  return {
    id,
    medicationId: data.medicationId || "",
    municipalityId: data.municipalityId || "",
    periodType: data.periodType || "weekly",
    weekNumber: data.weekNumber,
    monthNumber: data.monthNumber,
    createdAt: data.createdAt || new Date().toISOString(),
    y: data.y,
    predictedValue: data.predictedValue,
    date: data.date,
    confidence: data.confidence,
    label: data.label,
    weatherParams: data.weatherParams,
  }
}

// Main function to remove duplicates
async function removeDuplicatePredictions(): Promise<void> {
  try {
    console.log("🔍 Fetching all predictions from Firestore...")

    // Fetch all predictions
    const predictionsRef = collection(db, "predictions")
    const querySnapshot = await getDocs(query(predictionsRef, orderBy("createdAt", "desc")))

    const predictions: Prediction[] = []
    querySnapshot.forEach((docSnapshot) => {
      const prediction = documentToPrediction(docSnapshot.id, docSnapshot.data())
      predictions.push(prediction)
    })

    console.log(`📊 Found ${predictions.length} total predictions`)

    // Find duplicates
    console.log("🔍 Analyzing for duplicates...")
    const duplicateGroups = findDuplicates(predictions)

    if (duplicateGroups.length === 0) {
      console.log("✅ No duplicates found!")
      return
    }

    console.log(`🚨 Found ${duplicateGroups.length} groups with duplicates`)

    // Calculate total duplicates
    const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + (group.predictions.length - 1), 0)

    console.log(`📈 Total duplicates to remove: ${totalDuplicates}`)

    // Get IDs of predictions to delete
    const toDeleteIds = selectPredictionsToDelete(duplicateGroups)

    // Confirm before deletion
    console.log("\n⚠️  DELETION SUMMARY:")
    console.log(`   Total predictions: ${predictions.length}`)
    console.log(`   Duplicates to delete: ${toDeleteIds.length}`)
    console.log(`   Remaining after cleanup: ${predictions.length - toDeleteIds.length}`)

    console.log("\n🗑️  Starting deletion process...")

    // Delete duplicates in batches to avoid overwhelming Firestore
    const batchSize = 50
    let deletedCount = 0

    for (let i = 0; i < toDeleteIds.length; i += batchSize) {
      const batch = toDeleteIds.slice(i, i + batchSize)

      const deletePromises = batch.map(async (id: string): Promise<string | null> => {
        try {
          await deleteDoc(doc(db, "predictions", id))
          deletedCount++
          return id
        } catch (error) {
          console.error(`❌ Failed to delete ${id}:`, error)
          return null
        }
      })

      await Promise.all(deletePromises)

      console.log(
        `   Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(toDeleteIds.length / batchSize)} - Deleted: ${deletedCount}/${toDeleteIds.length}`,
      )
    }

    console.log(`\n✅ Cleanup completed!`)
    console.log(`   Successfully deleted: ${deletedCount} duplicates`)
    console.log(`   Failed deletions: ${toDeleteIds.length - deletedCount}`)

    // Verify the cleanup
    console.log("\n🔍 Verifying cleanup...")
    const verifySnapshot = await getDocs(predictionsRef)
    console.log(`📊 Remaining predictions: ${verifySnapshot.size}`)
  } catch (error) {
    console.error("💥 Error during duplicate removal:", error)
    throw error
  }
}

// Dry run function to preview what would be deleted without actually deleting
async function dryRunDuplicateRemoval(): Promise<void> {
  try {
    console.log("🔍 DRY RUN: Analyzing duplicates without deletion...")

    const predictionsRef = collection(db, "predictions")
    const querySnapshot = await getDocs(predictionsRef)

    const predictions: Prediction[] = []
    querySnapshot.forEach((docSnapshot) => {
      const prediction = documentToPrediction(docSnapshot.id, docSnapshot.data())
      predictions.push(prediction)
    })

    console.log(`📊 Found ${predictions.length} total predictions`)

    const duplicateGroups = findDuplicates(predictions)

    if (duplicateGroups.length === 0) {
      console.log("✅ No duplicates found!")
      return
    }

    console.log(`🚨 Found ${duplicateGroups.length} groups with duplicates`)

    // Show detailed breakdown
    duplicateGroups.forEach((group, index) => {
      console.log(`\nGroup ${index + 1}: ${group.key}`)
      console.log(`  Duplicates: ${group.predictions.length}`)
      group.predictions.forEach((pred, i) => {
        console.log(`    ${i + 1}. ID: ${pred.id} | Created: ${pred.createdAt}`)
      })
    })

    const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + (group.predictions.length - 1), 0)

    console.log(`\n📈 SUMMARY:`)
    console.log(`   Total predictions: ${predictions.length}`)
    console.log(`   Duplicate groups: ${duplicateGroups.length}`)
    console.log(`   Total duplicates to remove: ${totalDuplicates}`)
    console.log(`   Remaining after cleanup: ${predictions.length - totalDuplicates}`)
  } catch (error) {
    console.error("💥 Error during dry run:", error)
    throw error
  }
}

// Enhanced function with confirmation prompt
async function removeDuplicatesWithConfirmation(): Promise<void> {
  try {
    // First run dry run to show what will be deleted
    await dryRunDuplicateRemoval()

    // Check for confirmation flag
    const shouldProceed = process.argv.includes("--confirm")

    if (!shouldProceed) {
      console.log("\n⚠️  To proceed with deletion, run the script with --confirm flag:")
      console.log("   npx tsx scripts/remove-duplicates.ts remove-with-confirmation --confirm")
      return
    }

    console.log("\n🚀 Proceeding with duplicate removal...")
    await removeDuplicatePredictions()
  } catch (error) {
    console.error("💥 Error during confirmed removal:", error)
    throw error
  }
}

// Export functions for use in other modules
export { removeDuplicatePredictions, dryRunDuplicateRemoval, removeDuplicatesWithConfirmation }

// Main execution logic
async function main(): Promise<void> {
  console.log("🚀 Starting duplicate removal script...")

  const operation = process.argv[2] || "dry-run"

  try {
    switch (operation) {
      case "remove":
        await removeDuplicatePredictions()
        console.log("🎉 Script completed successfully!")
        break

      case "remove-with-confirmation":
        await removeDuplicatesWithConfirmation()
        console.log("🎉 Script completed successfully!")
        break

      case "dry-run":
      default:
        await dryRunDuplicateRemoval()
        console.log("🎉 Dry run completed!")
        console.log("💡 To actually remove duplicates, run:")
        console.log("   npx tsx scripts/remove-duplicates.ts remove")
        console.log("   or")
        console.log("   npx tsx scripts/remove-duplicates.ts remove-with-confirmation --confirm")
        break
    }

    process.exit(0)
  } catch (error) {
    console.log("💥 Script failed:", error)
    process.exit(1)
  }
}

// ES module way to check if this is the main module
const isMainModule = import.meta.url === `file://${process.argv[1]}`
if (isMainModule) {
  main()
}
