"use client";
import React from "react";
import { Calendar, MapPin, History } from "lucide-react";

interface ScatterFiltersProps {
  predictionType: "weekly" | "monthly";
  onPredictionTypeChange: (type: "weekly" | "monthly") => void;
  availableMunicipalities: string[];
  selectedMunicipality: string;
  setSelectedMunicipality: (municipality: string) => void;
  availableHistoryPeriods: string[];
  selectedHistoryPeriod: string;
  setSelectedHistoryPeriod: (period: string) => void;
}

export default function ScatterFilters({
  predictionType,
  onPredictionTypeChange,
  availableMunicipalities,
  selectedMunicipality,
  setSelectedMunicipality,
  availableHistoryPeriods,
  selectedHistoryPeriod,
  setSelectedHistoryPeriod,
}: ScatterFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Prediction Type Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Prediction:</span>
        <select
          value={predictionType}
          onChange={(e) =>
            onPredictionTypeChange(e.target.value as "weekly" | "monthly")
          }
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Municipality Selector */}
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Municipality:</span>
        <select
          value={selectedMunicipality}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {availableMunicipalities.map((municipality) => (
            <option key={municipality} value={municipality}>
              {municipality}
            </option>
          ))}
        </select>
      </div>

      {/* History Period Selector */}
      <div className="flex items-center gap-2">
        <History className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">History:</span>
        <select
          value={selectedHistoryPeriod}
          onChange={(e) => setSelectedHistoryPeriod(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {availableHistoryPeriods
            .filter((period) => {
              // Hide any period containing "week" (case-insensitive) if monthly is selected
              if (predictionType === "monthly") {
                return !/week/i.test(period);
              }
              return true;
            })
            .map((period) => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
        </select>
      </div>
    </div>
    
  );
}
