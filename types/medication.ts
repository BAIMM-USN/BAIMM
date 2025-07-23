export interface Medication {
  id: string
  name: string
  description?: string
  category?: string
}

export interface Prediction {
  id: string
  medicationId: string
  periodType: "weekly" | "monthly"
  weekNumber?: number
  monthNumber?: number
  predictedValue?: number // Make this optional since your data uses 'y'
  y?: number // Your actual data uses this field
  date?: string
  confidence?: number
  createdAt?: string
  label?: string
  municipalityId?: string
  weatherParams?: {
    humidity: number
    temperature: number
  }
}

export interface Municipality {
  id: string
  name: string
  region?: string
}

// Consolidated DataPoint interface
export interface DataPoint {
  x: number
  y: number
  label: string
  weekNumber?: number
  monthNumber?: number
  date: string
  confidence?: number
}

// Updated type guards to match your actual data structure
export function isMedication(data: any): data is Medication {
  return typeof data === "object" && data !== null && typeof data.id === "string" && typeof data.name === "string"
}

export function isPrediction(data: any): data is Prediction {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.id === "string" &&
    typeof data.medicationId === "string" &&
    (data.periodType === "weekly" || data.periodType === "monthly") &&
    // Check for either predictedValue OR y (since your data uses y)
    (typeof data.predictedValue === "number" || typeof data.y === "number")
  )
}

export function isMunicipality(data: any): data is Municipality {
  return typeof data === "object" && data !== null && typeof data.id === "string" && typeof data.name === "string"
}
