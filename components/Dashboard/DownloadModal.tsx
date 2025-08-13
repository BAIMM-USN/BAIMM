import React, { useState } from "react";
import Select from "react-select";
import { X, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import  { useTranslation } from "react-i18next";

interface Municipality {
  id: string;
  name: string;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableMedications: string[];
  availableMunicipalities: Municipality[];
  availableHistoryPeriods: string[];
}
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface Prediction {
  municipalityId: string;
  predictedValue?: number;
  y?: number;
  confidence?: number;
}

async function fetchPredictionsFromApi({
  token,
  medicationId,
  municipalityIds,
  periodType,
}: {
  token?: string;
  medicationId?: string;
  municipalityIds?: string[];
  periodType?: string;
}): Promise<Prediction[]> {
  const params = new URLSearchParams();
  if (medicationId) params.append("medicationId", medicationId.toLowerCase());
  if (periodType) params.append("periodType", periodType);
  if (municipalityIds && municipalityIds.length > 0) {
    params.append("municipalityIds", municipalityIds.join(","));
  }

  const url = `${API_BASE_URL}/predictions/multiple${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch predictions from backend API");

  return res.json();
}

export default function DownloadModal({
  isOpen,
  onClose,
  availableMedications = [],
  availableMunicipalities = [],
  availableHistoryPeriods = [],
}: DownloadModalProps) {
  
   const { t } = useTranslation("downloadModal");
  const { user } = useAuth();
  const [selectedMedication, setSelectedMedication] = useState(
    availableMedications[0] || ""
  );
  const [selectedPredictionType, setSelectedPredictionType] =
    useState("weekly");
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<
    string[]
  >([]);
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState(
    availableHistoryPeriods[0] || ""
  );
  const [includeConfidence, setIncludeConfidence] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;
  async function handleDownload() {
    setIsDownloading(true);
    try {
      let token: string | undefined = undefined;
      if (user && user.getIdToken) {
        token = await user.getIdToken();
      }

      const predictions = await fetchPredictionsFromApi({
        token,
        medicationId: selectedMedication,
        periodType: selectedPredictionType,
        municipalityIds: selectedMunicipalities,
      });

      // Build CSV
      const headers = [
        "Municipality",
        "Demand (units)",
        ...(includeConfidence ? ["Confidence (%)"] : []),
        "Date Range",
        "Medication",
        "Prediction Type",
      ];

      const rows = selectedMunicipalities.map((municipalityId) => {
        const pred = predictions.find(
          (p) => p.municipalityId === municipalityId
        );
        const demand = pred ? pred.predictedValue ?? pred.y ?? "" : "";
        const confidence =
          pred && typeof pred.confidence === "number" ? pred.confidence : "";

        return [
          municipalityId,
          demand.toString(),
          ...(includeConfidence ? [confidence.toString()] : []),
          selectedHistoryPeriod,
          selectedMedication,
          selectedPredictionType,
        ];
      });

      const csvData = [headers, ...rows];
      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Trigger download
      const link = document.createElement("a");
      const downloadName = `medication-demand-${selectedMedication
        .replace(/\s+/g, "-")
        .toLowerCase()}-${selectedPredictionType}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      link.setAttribute("href", URL.createObjectURL(blob));
      link.setAttribute("download", downloadName);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Failed to download predictions. Please try again.");
      // Log error details and context
      console.error("DownloadModal error:", err);
      if (err instanceof Error) {
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
      }
    } finally {
      setIsDownloading(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto animate-in fade-in duration-200 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("exportData")}
              </h2>
              <p className="text-sm text-gray-600">
                {t("configureExport")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDownloading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="text-blue-700 font-medium block mb-1">
                {t("medication")}
              </label>
              <select
                value={selectedMedication}
                onChange={(e) => setSelectedMedication(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableMedications.map((med) => (
                  <option key={med} value={med}>
                    {med}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-blue-700 font-medium block mb-1">
                {t("predictionType")}
              </label>
              <select
                value={selectedPredictionType}
                onChange={(e) => setSelectedPredictionType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 capitalize"
              >
                <option value="weekly">{t("weekly")}</option>
                <option value="monthly">{t("monthly")}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-blue-700 font-medium block mb-1">
              {t("municipality")}
            </label>
            <Select
              isMulti
              isSearchable
              options={[
                {
                  value: "__all__",
                  label:
                    selectedMunicipalities.length ===
                    availableMunicipalities.length
                      ? "Deselect All"
                      : "Select All",
                },
                ...availableMunicipalities.map((m) => ({
                  value: m.id,
                  label: m.name,
                })),
              ]}
              value={
                selectedMunicipalities.length === availableMunicipalities.length
                  ? [
                      { value: "__all__", label: "Deselect All" },
                      ...availableMunicipalities.map((m) => ({
                        value: m.id,
                        label: m.name,
                      })),
                    ]
                  : availableMunicipalities
                      .filter((m) => selectedMunicipalities.includes(m.id))
                      .map((m) => ({ value: m.id, label: m.name }))
              }
              onChange={(selected) => {
                if (
                  !selected ||
                  (Array.isArray(selected) && selected.length === 0)
                ) {
                  setSelectedMunicipalities([]);
                  return;
                }
                const values = Array.isArray(selected)
                  ? selected.map((opt) => opt.value)
                  : [];
                if (values.includes("__all__")) {
                  // If Deselect All is clicked (all selected and user clicks again), clear all
                  if (
                    selectedMunicipalities.length ===
                    availableMunicipalities.length
                  ) {
                    setSelectedMunicipalities([]);
                  } else {
                    // Otherwise, select all
                    setSelectedMunicipalities(
                      availableMunicipalities.map((m) => m.id)
                    );
                  }
                } else {
                  setSelectedMunicipalities(values);
                }
              }}
              classNamePrefix="react-select"
              placeholder="Select municipalities..."
              styles={{
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
              }}
            />
          </div>
          <div>
            <label className="text-blue-700 font-medium block mb-1">
              {t("historyPeriod")}
            </label>
            <select
              value={selectedHistoryPeriod}
              onChange={(e) => setSelectedHistoryPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableHistoryPeriods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeConfidence}
                onChange={(e) => setIncludeConfidence(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{t("includeConfidence")}</span>
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={isDownloading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="ml-3 px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                {t("preparing")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {t("downloadCsv")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
