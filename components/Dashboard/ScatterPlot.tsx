"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  Calendar,
  History,
  ChevronLeft,
  ChevronRight,
  Activity,
  Download,
} from "lucide-react";
import ScatterChart from "./ScatterPlot/ScatterChart";
import ScatterStats from "./ScatterPlot/ScatterStats";
import ScatterFilters from "./ScatterPlot/ScatterFilters";
import DownloadModal from "./DownloadModal";
// import type { GeoJsonObject, Feature, Geometry } from "geojson";
import type { Municipality, DataPoint } from "../../types/medication";

// Dynamically import the map component to avoid SSR issues
const MedicationDemandMap = dynamic(() => import("./HeatMap"), {
  ssr: false,
});

interface ScatterPlotProps {
  data: {
    upcoming: DataPoint[];
    previous: DataPoint[];
  };
  title: string;
  xLabel: string;
  yLabel: string;
  availableMedications: string[];
  availableMunicipalities: Municipality[];
  availableHistoryPeriods: string[];
  onMedicationChange?: (medication: string) => void;
  selectedMedication?: string;
  predictionType: "weekly" | "monthly";
  onPredictionTypeChange: (type: "weekly" | "monthly") => void;
  isLoggedIn: boolean;
  onLoginClick?: () => void;
  // Add these two props to match usage in parent
  selectedMunicipality?: string;
  setSelectedMunicipality?: (municipality: string) => void;
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
  isLoggedIn,
  selectedMunicipality: selectedMunicipalityProp,
  setSelectedMunicipality: setSelectedMunicipalityProp,
}: ScatterPlotProps) {
  const [viewMode, setViewMode] = useState<"upcoming" | "previous" | "both">(
    "both"
  );
  const [visualization, setVisualization] = useState<"scatter" | "heatmap">(
    "scatter"
  );

  const selectedMedication =
    selectedMedicationProp ?? (availableMedications[0] || "");

  // Use selectedMunicipality from parent if provided, otherwise fallback to first available
  const municipalityIds = availableMunicipalities.map((m) => m.id);
  const [internalSelectedMunicipality, internalSetSelectedMunicipality] =
    useState<string>(
      selectedMunicipalityProp &&
        municipalityIds.includes(selectedMunicipalityProp)
        ? selectedMunicipalityProp
        : municipalityIds[0] || ""
    );
  const selectedMunicipality =
    selectedMunicipalityProp ?? internalSelectedMunicipality;
  const setSelectedMunicipality =
    setSelectedMunicipalityProp ?? internalSetSelectedMunicipality;

  // For filters, show names but store id
  const municipalityNames = availableMunicipalities.map((m) => m.name);
  console.log(availableMunicipalities);

  // Static history period options for the filter (not tied to data)
  const staticHistoryPeriods =
    predictionType === "weekly"
      ? ["Lat 4 Weeks", "Last 8 weeks", "last 12 weeks"]
      : ["Last 3 Months", "Last 6 Months", "Last Year"];

  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState<string>(
    staticHistoryPeriods[0]
  );
  const [municipalitySearch, setMunicipalitySearch] = useState<string>("");
 
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

 
 

  const getDisplayData = (): DataPoint[] => {
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
  const maxY =
    displayData.length > 0 ? Math.max(...displayData.map((d) => d.y)) : 0;
  const minY =
    displayData.length > 0 ? Math.min(...displayData.map((d) => d.y)) : 0;

  const handleViewModeChange = (mode: "upcoming" | "previous" | "both") => {
    setViewMode(mode);
  };

  // Find the name of the selected municipality (for display in ScatterStats and below)
  const selectedMunicipalityName =
    availableMunicipalities.find((m) => m.id === selectedMunicipality)?.name ||
    municipalityNames[0] ||
    "";

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
            <div className="bg-gray-100 rounded-lg p-1 flex mr-2">
              <button
                onClick={() => setVisualization("scatter")}
                className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                  visualization === "scatter"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Scatter
              </button>
              <button
                onClick={() => setVisualization("heatmap")}
                className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                  visualization === "heatmap"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Heat Map
              </button>
            </div>
            {/* Download/Export CSV Button */}
            <button
              onClick={() => {
                setIsDownloadModalOpen(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isLoggedIn
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!isLoggedIn}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
        {visualization === "scatter" && (
          <div className="bg-gray-100 rounded-lg p-1 flex max-w-max">
            <button
              onClick={() => handleViewModeChange("previous")}
              className={` cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
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
              className={` cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
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
              className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-1.5 ${
                viewMode === "both"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Activity className="w-4 h-4" />
              Trend View
            </button>
          </div>
        )}
        {/* Always show ScatterFilters for predictionType/municipality/history selection */}
        <ScatterFilters
          predictionType={predictionType}
          onPredictionTypeChange={onPredictionTypeChange}
          availableMunicipalities={municipalityNames}
          selectedMunicipality={
            // Find the name for the selected id, fallback to first name
            availableMunicipalities.find((m) => m.id === selectedMunicipality)
              ?.name ||
            municipalityNames[0] ||
            ""
          }
          setSelectedMunicipality={(name: string) => {
            // Find the id for the selected name and update by id
            const found = availableMunicipalities.find((m) => m.name === name);
            if (found) setSelectedMunicipality(found.id);
          }}
          availableHistoryPeriods={staticHistoryPeriods}
          selectedHistoryPeriod={selectedHistoryPeriod}
          setSelectedHistoryPeriod={setSelectedHistoryPeriod}
          visualization={visualization}
          municipalitySearch={municipalitySearch}
          setMunicipalitySearch={setMunicipalitySearch}
        />
      </div>

      {/* Chart Area */}
      {visualization === "scatter" ? (
        <>
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
            selectedMunicipality={selectedMunicipalityName}
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
                  } Trend Analysis: ${selectedMedication} in ${selectedMunicipalityName}`}
              </span>
              {viewMode === "upcoming" && (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </div>
        </>
      ) : (
        <MedicationDemandMap
          selectedMedication={selectedMedication}
          predictionType={predictionType}
        />
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        availableMunicipalities={availableMunicipalities}
        availableHistoryPeriods={availableHistoryPeriods}
        selectedMedication={selectedMedication}
        predictionType={predictionType}
        availableMedications={availableMedications}
        onMedicationChange={onMedicationChange}
        onPredictionTypeChange={onPredictionTypeChange}
      />
    </div>
  );
}
