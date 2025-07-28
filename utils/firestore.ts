import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Medication, Prediction, Municipality } from "../types/medication";
import {
  isMedication,
  isPrediction,
  isMunicipality,
} from "../types/medication";

export async function fetchMedications(): Promise<Medication[]> {
  try {
    const snapshot = await getDocs(collection(db, "medications"));
    const medications: Medication[] = [];

    snapshot.docs.forEach((doc) => {
      const data: any = { id: doc.id, ...doc.data() }; // Use 'any' to avoid TS errors for missing props
      if (isMedication(data)) {
        medications.push(data);
      } else {
        // console.warn("Invalid medication data:", data);
        // Try to salvage the data by providing defaults
        if (typeof data.id === "string" && typeof data.name === "string") {
          medications.push({
            id: data.id,
            name: data.name,
            category:
              typeof data.category === "string"
                ? data.category
                : "Uncategorized",
            description:
              typeof data.description === "string"
                ? data.description
                : "No description available",
          });
        }
      }
    });

    return medications;
  } catch (error) {
    // console.error("Error fetching medications:", error);
    return [];
  }
}

export async function fetchPredictions(): Promise<Prediction[]> {
  try {
    const snapshot = await getDocs(collection(db, "predictions"));
    const predictions: Prediction[] = [];

    snapshot.docs.forEach((doc) => {
      const data: any = { id: doc.id, ...doc.data() }; 
     
    

      if (isPrediction(data)) {
        predictions.push(data);
      } else {
        // console.warn("Invalid prediction data:", data);
        // Try to salvage the data if it has the essential fields
        if (
          typeof data.id === "string" &&
          typeof data.medicationId === "string" &&
          typeof data.periodType === "string" &&
          (typeof data.y === "number" ||
            typeof data.predictedValue === "number")
        ) {
          const salvaged: Prediction = {
            id: data.id,
            medicationId: data.medicationId,
            periodType: data.periodType,
            y: data.y ?? data.predictedValue,
            predictedValue: data.predictedValue ?? data.y,
            weekNumber: data.weekNumber,
            monthNumber: data.monthNumber,
            date: data.date,
            confidence: data.confidence,
            createdAt: data.createdAt,
            label: data.label,
            municipalityId: data.municipalityId,
            weatherParams: data.weatherParams,
          };
          predictions.push(salvaged);
          // console.log("Salvaged prediction data:", salvaged);
        }
      }
    });

    // console.log(`Successfully fetched ${predictions.length} predictions`);
    return predictions;
  } catch (error) {
    // console.error("Error fetching predictions:", error);
    return [];
  }
}

export async function fetchMunicipalities(): Promise<Municipality[]> {
  try {
    const snapshot = await getDocs(collection(db, "municipalities"));
    const municipalities: Municipality[] = [];

    snapshot.docs.forEach((doc) => {
      const data: any = { id: doc.id, ...doc.data() }; // Use 'any' to avoid TS errors for missing props
      if (isMunicipality(data)) {
        municipalities.push(data);
      } else {
        // console.warn("Invalid municipality data:", data);
        // Try to salvage the data by providing defaults
        if (typeof data.id === "string" && typeof data.name === "string") {
          municipalities.push({
            id: data.id,
            name: data.name,
            region: typeof data.region === "string" ? data.region : "",
          });
        }
      }
    });

    return municipalities;
  } catch (error) {
    // console.error("Error fetching municipalities:", error);
    return [];
  }
}
