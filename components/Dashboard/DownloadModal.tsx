"use client";
import React, { useState } from "react";
import { X, Download, MapPin, History, FileText } from "lucide-react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Select from "react-select";
import { Municipality } from "@/types/medication";

type MunicipalityOption = { label: string; value: string };

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMunicipalities: Municipality[];
  availableHistoryPeriods: string[];
  selectedMedication: string;
  predictionType: "weekly" | "monthly";
  availableMedications: string[];
  onMedicationChange?: (med: string) => void;
  onPredictionTypeChange?: (type: "weekly" | "monthly") => void;
}

export default function DownloadModal({
  isOpen,
  onClose,
  availableMunicipalities,
  availableHistoryPeriods,
  selectedMedication,
  predictionType,
  availableMedications,
  onMedicationChange,
  onPredictionTypeChange,
}: DownloadModalProps) {
  const allMunicipalities: { id: string; name: string }[] =
    typeof window !== "undefined" && (window as any).__ALL_MUNICIPALITIES__
      ? (window as any).__ALL_MUNICIPALITIES__
      : [];
  console.log(availableMunicipalities, "all");

  // Build options from availableMunicipalities prop (array of Municipality objects)
  const municipalityOptions: MunicipalityOption[] = availableMunicipalities.map(
    (municipality) => ({
      label: municipality.name,
      value: municipality.id,
    })
  );

  // Track selectedMunicipalities as ids (not names)
  const [selectedMunicipalityOptions, setSelectedMunicipalityOptions] =
    useState<MunicipalityOption[]>([]);

  // All other hooks
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<
    string[]
  >([]);
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState(
    availableHistoryPeriods[0] || ""
  );
  const [includeOutliers, setIncludeOutliers] = useState(true);
  const [includeConfidence, setIncludeConfidence] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [localMedication, setLocalMedication] = useState(selectedMedication);
  const [localPredictionType, setLocalPredictionType] =
    useState(predictionType);

  // Sync localMedication and localPredictionType with props when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalMedication(selectedMedication);
      setLocalPredictionType(predictionType);
    }
  }, [isOpen, selectedMedication, predictionType]);

  // Update selectedMunicipalities when options change (always use .value, which is the id)
  React.useEffect(() => {
    setSelectedMunicipalities(
      selectedMunicipalityOptions.map((opt) => opt.value)
    );
  }, [selectedMunicipalityOptions]);

  // Prevent modal from closing on select change
  const handleMedicationChange = (val: string) => {
    setLocalMedication(val);
    if (onMedicationChange) onMedicationChange(val);
  };
  const handlePredictionTypeChange = (val: "weekly" | "monthly") => {
    setLocalPredictionType(val);
    if (onPredictionTypeChange) onPredictionTypeChange(val);
  };

  const handleMunicipalityToggle = (municipality: string) => {
    setSelectedMunicipalities((prev) =>
      prev.includes(municipality)
        ? prev.filter((m) => m !== municipality)
        : [...prev, municipality]
    );
  };

  // Update handleSelectAll to use ids
  const handleSelectAll = () => {
    setSelectedMunicipalities(
      selectedMunicipalities.length === availableMunicipalities.length
        ? []
        : availableMunicipalities.map((m) => m.id)
    );
  };

  const generateCSVData = () => {
    const municipalities =
      selectedMunicipalities.length > 0
        ? selectedMunicipalities
        : availableMunicipalities;

    const headers = [
      "Municipality",
      "Demand (units)",
      "Change (%)",
      ...(includeConfidence ? ["Confidence (%)"] : []),
      ...(includeOutliers ? ["Outlier Status"] : []),
      "Date Range",
      "Medication",
      "Prediction Type",
    ];

    const rows = municipalities.map((municipality) => {
      // Generate mock data for demonstration
      const demand = Math.floor(Math.random() * 900) + 100;
      const change = (Math.random() - 0.5) * 40; // -20% to +20%
      const confidence = Math.floor(Math.random() * 20) + 80; // 80-100%
      const isOutlier = Math.random() > 0.8;

      const row = [
        municipality,
        demand.toString(),
        change.toFixed(1),
        ...(includeConfidence ? [confidence.toString()] : []),
        ...(includeOutliers ? [isOutlier ? "High Outlier" : "Normal"] : []),
        selectedHistoryPeriod,
        selectedMedication,
        predictionType.charAt(0).toUpperCase() + predictionType.slice(1),
      ];

      return row;
    });

    return [headers, ...rows];
  };

  const handleDownload = async () => {
    setIsDownloading(true);

    const municipalities =
      selectedMunicipalities.length > 0
        ? selectedMunicipalities
        : municipalityOptions.map((opt) => opt.value);

    // Build Firestore query
    const predsQuery = query(
      collection(db, "predictions"),
      where("periodType", "==", localPredictionType),
      where(
        localPredictionType === "weekly" ? "weekNumber" : "monthNumber",
        "==",
        parseInt(selectedHistoryPeriod.match(/\d+/)?.[0] || "1", 10)
      ),
      where("medicationId", "==", localMedication)
    );

    const predsSnap = await getDocs(predsQuery);
    // Map municipalityId to prediction data
    const predMap: { [mun: string]: any } = {};
    predsSnap.forEach((doc) => {
      const data = doc.data();
      predMap[data.municipalityId] = data;
    });

    const headers = [
      "Municipality",
      "Demand (units)",
      "Change (%)",
      ...(includeConfidence ? ["Confidence (%)"] : []),
      ...(includeOutliers ? ["Outlier Status"] : []),
      "Date Range",
      "Medication",
      "Prediction Type",
    ];

    // No need for nameToId mapping, municipalities are already ids
    const rows = municipalities.map((municipalityId) => {
      const pred = predMap[municipalityId];
      // Use real demand value if available, otherwise blank
      const demand = pred ? pred.predictedValue ?? pred.y ?? "" : "";
      const change = pred && typeof pred.change === "number" ? pred.change : "";
      const confidence =
        pred && typeof pred.confidence === "number" ? pred.confidence : "";
      const isOutlier = pred && pred.isOutlier ? "High Outlier" : "Normal";

      const row = [
        municipalityId,
        demand.toString(),
        change.toString(),
        ...(includeConfidence ? [confidence.toString()] : []),
        ...(includeOutliers ? [isOutlier] : []),
        selectedHistoryPeriod,
        localMedication,
        localPredictionType.charAt(0).toUpperCase() +
          localPredictionType.slice(1),
      ];

      return row;
    });

    const csvData = [headers, ...rows];
    const csvContent = csvData.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `medication-demand-${localMedication
        .replace(/\s+/g, "-")
        .toLowerCase()}-${localPredictionType}-${
        new Date().toISOString().split("T")[0]
      }.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloading(false);
    // Only close after download, not on select change
    onClose();
  };

  const handleClose = () => {
    if (!isDownloading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-in fade-in duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Export Data
              </h2>
              <p className="text-sm text-gray-600">
                Configure your data export settings
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDownloading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-blue-50 rounded-b-2xl p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Customize Selection
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Medication dropdown */}
            <div>
              <label className="text-blue-700 font-medium block mb-1">
                Medication
              </label>
              <select
                value={localMedication}
                onChange={(e) => handleMedicationChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableMedications?.map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
              </select>
            </div>

            {/* Prediction type dropdown */}
            <div>
              <label className="text-blue-700 font-medium block mb-1">
                Prediction Type
              </label>
              <select
                value={localPredictionType}
                onChange={(e) =>
                  handlePredictionTypeChange(
                    e.target.value as "weekly" | "monthly"
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* Municipality Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                Municipality
              </label>
            </div>
            <div className="w-64">
              <Select
                options={municipalityOptions}
                value={selectedMunicipalityOptions}
                onChange={(selected) =>
                  setSelectedMunicipalityOptions(
                    Array.isArray(selected) ? selected : selected ? [selected] : []
                  )
                }
                isMulti
                placeholder="Select municipality..."
                isSearchable
                styles={{
                  control: (base) => ({
                    ...base,
                    minHeight: "36px",
                    borderColor: "#d1d5db",
                    fontSize: "0.875rem",
                  }),
                }}
              />
            </div>
          </div>

          {/* History Period */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">
                History Period
              </label>
            </div>
            <select
              value={selectedHistoryPeriod}
              onChange={(e) => setSelectedHistoryPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableHistoryPeriods
                .filter((period) => {
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

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Additional Data
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeConfidence}
                  onChange={(e) => setIncludeConfidence(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Include confidence levels
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeOutliers}
                  onChange={(e) => setIncludeOutliers(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Include outlier detection
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="text-sm text-gray-600">
            Export format: CSV • File size: ~
            {Math.ceil(
              (selectedMunicipalities.length ||
                availableMunicipalities.length) * 0.1
            )}
            KB
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              disabled={isDownloading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
