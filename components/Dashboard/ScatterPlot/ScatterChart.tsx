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

interface DataPoint {
  x: number;
  y: number;
  label: string;
  weekNumber?: number;
  monthNumber?: number;
  date: string;
  confidence?: number;
}

interface ScatterChartProps {
  data: DataPoint[];
  viewMode: "upcoming" | "previous" | "both";
  predictionType: "weekly" | "monthly";
  xLabel: string;
  yLabel: string;
  selectedMedication: string;
  selectedMunicipality: string;
  dataPreviousLength: number;
}

export default function ScatterChart({
  data,
  viewMode,
  predictionType,
  xLabel,
  yLabel,
  selectedMedication,
  selectedMunicipality,
  dataPreviousLength,
}: ScatterChartProps) {
  const getXPosition = (x: number) => {
    if (data.length === 1) {
      return 50; // Center horizontally
    }
    const maxX = Math.max(...data.map((d) => d.x));
    const minX = Math.min(...data.map((d) => d.x));
    // Prevent division by zero and clamp to [5,95]
    if (maxX === minX) return 50;
    const pos = ((x - minX) / (maxX - minX)) * 90 + 5;
    return Math.max(5, Math.min(95, pos));
  };

  const normalizeY = (y: number) => {
    const maxY = Math.max(...data.map((d) => d.y));
    const minY = Math.min(...data.map((d) => d.y));
    // Prevent division by zero and clamp to [5,95]
    if (maxY === minY) return 50;
    const pos = 90 - ((y - minY) / (maxY - minY)) * 80 + 5;
    return Math.max(5, Math.min(95, pos));
  };

  const getPointColor = (index: number) => {
    if (viewMode === "both") {
      return index < dataPreviousLength ? "#6b7280" : "#3b82f6";
    }
    return viewMode === "previous" ? "#6b7280" : "#3b82f6";
  };

  const getPointOpacity = (index: number) => {
    if (viewMode === "both") {
      return index < dataPreviousLength ? 0.6 : 1;
    }
    return viewMode === "previous" ? 0.8 : 1;
  };

  const formatTooltipContent = (point: DataPoint, index: number) => {
    const isHistorical =
      viewMode === "both"
        ? index < dataPreviousLength
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

  // Outlier insight for monthly data
  let insight: string | null = null;
  let modifiedData = data;

  // For demonstration: artificially create an outlier in monthly data
  if (predictionType === "monthly" && data.length > 1) {
    // Clone the data array to avoid mutating props
    modifiedData = [...data];
    // Make the last data point a significant outlier (+50% compared to previous)
    const prev = modifiedData[modifiedData.length - 2];
    if (prev) {
      modifiedData[modifiedData.length - 1] = {
        ...modifiedData[modifiedData.length - 1],
        y: prev.y * 1.5,
      };
    }
    // Outlier insight logic
    const last = modifiedData[modifiedData.length - 1];
    if (prev && prev.y > 0) {
      const change = ((last.y - prev.y) / prev.y) * 100;
      if (change > 30) {
        insight = `Significant increase detected: +${change.toFixed(
          1
        )}% compared to previous month.`;
      } else if (change < -30) {
        insight = `Significant decrease detected: ${change.toFixed(
          1
        )}% compared to previous month.`;
      }
    }
  }

  return (
    <div
      className="relative bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6"
      style={{ height: "450px" }}
    >
      {/* Insight/alert for monthly outlier */}
      {insight && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded z-10 text-center text-sm font-medium shadow">
          {insight}
        </div>
      )}
      <svg width="100%" height="100%" className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          </pattern>
          <linearGradient id="trendLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6b7280" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Trend line for both view */}
        {viewMode === "both" && modifiedData.length > 1 && (
          <path
            d={`M ${modifiedData
              .map(
                (point, index) =>
                  `${getXPosition(point.x)},${normalizeY(point.y)}`
              )
              .join(" L ")}`}
            fill="none"
            stroke="url(#trendLine)"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.6"
          />
        )}

        {/* Data points */}
        {modifiedData.map((point, index) => (
          <g key={index}>
            <circle
              cx={`${getXPosition(point.x)}%`}
              cy={`${normalizeY(point.y)}%`}
              r={viewMode === "both" ? "5" : "6"}
              fill={getPointColor(index)}
              stroke="#ffffff"
              strokeWidth="2"
              opacity={getPointOpacity(index)}
              className="hover:r-8 transition-all duration-200 cursor-pointer"
            >
              <title>{formatTooltipContent(point, index)}</title>
            </circle>

            {/* Confidence indicator for upcoming predictions */}
            {viewMode !== "previous" &&
              index >= (viewMode === "both" ? dataPreviousLength : 0) && (
                <circle
                  cx={`${getXPosition(point.x)}%`}
                  cy={`${normalizeY(point.y)}%`}
                  r="10"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.4"
                />
              )}

            <text
              x={`${getXPosition(point.x)}%`}
              y={`${normalizeY(point.y) - 15}%`}
              textAnchor="middle"
              className="text-xs fill-gray-700 pointer-events-none font-medium"
            >
              {getPeriodLabel(point)}
            </text>
          </g>
        ))}
      </svg>

      {/* Axes labels */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 font-medium">
        {xLabel}
      </div>
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2 -rotate-90 text-sm text-gray-600 font-medium">
        {yLabel}
      </div>

      {/* Legend for both view */}
      {/* {viewMode === "both" && (
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-3 border">
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500 opacity-60"></div>
              <span className="text-gray-600">
                Historical {predictionType === "weekly" ? "Weeks" : "Months"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">
                Next {predictionType === "weekly" ? "Week" : "Month"} Prediction
              </span>
            </div>
          </div>
        </div>
      )} */}

      {/* Current period indicator line */}
      {viewMode === "both" && (
        <line
          x1="50%"
          y1="10%"
          x2="50%"
          y2="90%"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="3,3"
          opacity="0.5"
        />
      )}
      {viewMode === "both" && (
        <text x="52%" y="15%" className="text-xs fill-red-600 font-medium">
          Current {predictionType === "weekly" ? "Week" : "Month"}
        </text>
      )}
    </div>
  );
}
