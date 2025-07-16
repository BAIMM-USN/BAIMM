"use client";
import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Calendar,
  History,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pill,
} from "lucide-react";
import ScatterChart from "./ScatterPlot/ScatterChart";
import ScatterStats from "./ScatterPlot/ScatterStats";
import ScatterFilters from "./ScatterPlot/ScatterFilters";

interface DataPoint {
  x: number;
  y: number;
  label: string;
  weekNumber?: number;
  monthNumber?: number;
  date: string;
  confidence?: number;
}

interface ScatterPlotProps {
  data: {
    upcoming: DataPoint[];
    previous: DataPoint[];
  };
  title: string;
  xLabel: string;
  yLabel: string;
  availableMedications: string[];
  availableMunicipalities: string[];
  availableHistoryPeriods: string[];
  onMedicationChange?: (medication: string) => void;
  selectedMedication?: string;
  predictionType: "weekly" | "monthly";
  onPredictionTypeChange: (type: "weekly" | "monthly") => void;
}

export default function ScatterPlot({
  data,
  title,
  xLabel,
  yLabel,
  availableMedications,
  availableMunicipalities,
  availableHistoryPeriods,
  onMedicationChange,
  selectedMedication: selectedMedicationProp,
  predictionType,
  onPredictionTypeChange,
}: ScatterPlotProps) {
  const [viewMode, setViewMode] = useState<"upcoming" | "previous" | "both">(
    "both"
  );
  // Use selectedMedication from parent if provided, otherwise fallback to first available
  const selectedMedication =
    selectedMedicationProp ?? (availableMedications[0] || "");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>(
    availableMunicipalities[0] || ""
  );
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState<string>(
    availableHistoryPeriods[0] || ""
  );

  // Remove local state update, only call parent handler
  const handleMedicationChange = (medication: string) => {
    onMedicationChange?.(medication);
  };

  const getDisplayData = () => {
    switch (viewMode) {
      case "upcoming":
        return data.upcoming;
      case "previous":
        return data.previous;
      case "both":
        return [...data.previous, ...data.upcoming];
      default:
        return data.upcoming;
    }
  };

  const displayData = getDisplayData();
  const maxX = Math.max(...displayData.map((d) => d.x));
  const maxY = Math.max(...displayData.map((d) => d.y));
  const minX = Math.min(...displayData.map((d) => d.x));
  const minY = Math.min(...displayData.map((d) => d.y));

  const normalizeX = (x: number) => ((x - minX) / (maxX - minX)) * 90 + 5;
  // Center the point if only one data point is present
  const getXPosition = (x: number) => {
    if (displayData.length === 1) {
      return 50; // Center horizontally
    }
    return normalizeX(x);
  };

  const normalizeY = (y: number) => 90 - ((y - minY) / (maxY - minY)) * 80 + 5;

  const getPointColor = (point: DataPoint, index: number) => {
    if (viewMode === "both") {
      return index < data.previous.length ? "#6b7280" : "#3b82f6";
    }
    return viewMode === "previous" ? "#6b7280" : "#3b82f6";
  };

  const getPointOpacity = (point: DataPoint, index: number) => {
    if (viewMode === "both") {
      return index < data.previous.length ? 0.6 : 1;
    }
    return viewMode === "previous" ? 0.8 : 1;
  };

  const formatTooltipContent = (point: DataPoint, index: number) => {
    const isHistorical =
      viewMode === "both"
        ? index < data.previous.length
        : viewMode === "previous";
    const confidenceText = isHistorical
      ? "Historical Data"
      : `${point.confidence}% confidence`;

    const periodLabel =
      predictionType === "weekly"
        ? `Week ${point.weekNumber}`
        : `Month ${point.monthNumber}`;

    return `${periodLabel} (${point.date})
Demand: ${point.y.toLocaleString()} units
${confidenceText}
Medication: ${selectedMedication}
Municipality: ${selectedMunicipality}`;
  };

  const getPeriodLabel = (point: DataPoint) => {
    return predictionType === "weekly"
      ? `W${point.weekNumber}`
      : `M${point.monthNumber}`;
  };

  const handleViewModeChange = (mode: "upcoming" | "previous" | "both") => {
    setViewMode(mode);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header with controls */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => handleViewModeChange("previous")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                  viewMode === "previous"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <History className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={() => handleViewModeChange("upcoming")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                  viewMode === "upcoming"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar className="w-4 h-4" />
                Next {predictionType === "weekly" ? "Week" : "Month"}
              </button>
              <button
                onClick={() => handleViewModeChange("both")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                  viewMode === "both"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Activity className="w-4 h-4" />
                Trend View
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <ScatterFilters
          predictionType={predictionType}
          onPredictionTypeChange={onPredictionTypeChange}
          availableMunicipalities={availableMunicipalities}
          selectedMunicipality={selectedMunicipality}
          setSelectedMunicipality={setSelectedMunicipality}
          availableHistoryPeriods={availableHistoryPeriods}
          selectedHistoryPeriod={selectedHistoryPeriod}
          setSelectedHistoryPeriod={setSelectedHistoryPeriod}
        />
      </div>

      {/* Chart Area */}
      <ScatterChart
        data={displayData}
        viewMode={viewMode}
        predictionType={predictionType}
        xLabel={xLabel}
        yLabel={yLabel}
        selectedMedication={selectedMedication}
        selectedMunicipality={selectedMunicipality}
        dataPreviousLength={data.previous.length}
      />

      {/* Statistics Cards */}
      <ScatterStats
        minY={minY}
        maxY={maxY}
        predictionType={predictionType}
        upcoming={data.upcoming}
        selectedMedication={selectedMedication}
        selectedMunicipality={selectedMunicipality}
        viewMode={viewMode}
      />

      {/* Time period indicator */}
      <div className="mt-4 flex items-center justify-center">
        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2">
          {viewMode === "previous" && (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {viewMode === "previous" &&
              `Previous ${
                predictionType === "weekly" ? "Weeks" : "Months"
              } (${selectedHistoryPeriod})`}
            {viewMode === "upcoming" &&
              `Next ${
                predictionType === "weekly" ? "Week" : "Month"
              } Prediction for ${selectedMedication}`}
            {viewMode === "both" &&
              `${
                predictionType === "weekly" ? "Weekly" : "Monthly"
              } Trend Analysis: ${selectedMedication} in ${selectedMunicipality}`}
          </span>
          {viewMode === "upcoming" && (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </div>
    </div>
  );
}
