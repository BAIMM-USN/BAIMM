"use client";
import React, { useState, useEffect } from "react";
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
import MedicationDemandMap from "./HeatMap";
import DownloadModal from "./DownloadModal";

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
  // Visualization toggle state
  const [visualization, setVisualization] = useState<"scatter" | "heatmap">(
    "scatter"
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
  const [municipalitySearch, setMunicipalitySearch] = useState<string>("");
  const [geoData, setGeoData] = useState<any>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Load geojson data on mount
  useEffect(() => {
    fetch("/Kommuner-M.geojson")
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
      });
  }, []);

  // Extract municipality names from geoData
  const geoMunicipalities: string[] = React.useMemo(() => {
    if (!geoData?.features) return [];
    return geoData.features
      .map((f: any) => f.properties?.kommunenavn)
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
  }, [geoData]);

  // Filtered municipalities for selector
  const filteredMunicipalities = React.useMemo(() => {
    if (!municipalitySearch) return geoMunicipalities;
    return geoMunicipalities.filter((name) =>
      name.toLowerCase().includes(municipalitySearch.toLowerCase())
    );
  }, [geoMunicipalities, municipalitySearch]);

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
              onClick={() => setIsDownloadModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
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
          availableMunicipalities={geoMunicipalities}
          selectedMunicipality={selectedMunicipality}
          setSelectedMunicipality={setSelectedMunicipality}
          availableHistoryPeriods={availableHistoryPeriods}
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
        </>
      ) : (
        <MedicationDemandMap />
      )}

      {/* Download Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        availableMunicipalities={geoMunicipalities}
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
