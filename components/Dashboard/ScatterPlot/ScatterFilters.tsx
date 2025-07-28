"use client";
import React from "react";
import { Calendar, MapPin, History } from "lucide-react";
import Select from "react-select";
import { useTranslation } from "react-i18next";

interface ScatterFiltersProps {
  predictionType: "weekly" | "monthly";
  onPredictionTypeChange: (type: "weekly" | "monthly") => void;
  availableMunicipalities: string[];
  selectedMunicipality: string;
  setSelectedMunicipality: (municipality: string) => void;
  availableHistoryPeriods: string[];
  selectedHistoryPeriod: string;
  setSelectedHistoryPeriod: (period: string) => void;
  visualization?: string;
  municipalitySearch?: string;
  setMunicipalitySearch?: (val: string) => void;
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
  visualization,
}: ScatterFiltersProps) {
  const { t } = useTranslation("ScatterFilters");

  const municipalityOptions = availableMunicipalities.map((municipality) => ({
    label: municipality,
    value: municipality,
  }));
  const predictionOptions = [
    { value: "weekly", label: t("weekly") },
    { value: "monthly", label: t("monthly") },
  ];
  const filteredHistoryOptions = availableHistoryPeriods
    .filter((period) => {
      // Hide "week" periods when monthly prediction is selected
      return predictionType === "monthly" ? !/week/i.test(period) : true;
    })
    .map((period) => ({
      label: period,
      value: period,
    }));

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Prediction Type Selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {t("predictionLabel")}:
        </span>
        <div className="w-24">
          <Select
            options={predictionOptions}
            value={predictionOptions.find(
              (opt) => opt.value === predictionType
            )}
            onChange={(selected) =>
              selected &&
              onPredictionTypeChange(selected.value as "weekly" | "monthly")
            }
            isSearchable={false}
            styles={{
              control: (base) => ({
                ...base,
                minHeight: "36px",
                borderColor: "#d1d5db",
                fontSize: "0.875rem",
              }),
              dropdownIndicator: (base) => ({
                ...base,
                padding: "2px",
              }),
              indicatorSeparator: () => ({
                display: "none",
              }),
            }}
          />
        </div>
      </div>

      {/* Municipality Selector with inline filter and label */}
      {visualization !== "heatmap" && (
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {t("municipalityLabel")}:
          </span>
          <div className="w-48">
            <Select
              options={municipalityOptions}
              value={municipalityOptions.find(
                (opt) => opt.value === selectedMunicipality
              )}
              onChange={(selected) =>
                selected && setSelectedMunicipality(selected.value)
              }
              placeholder={t("selectMunicipality")}
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
      )}

      {/* History Period Selector */}
      {visualization !== "heatmap" && (
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {t("historyLabel")}:
          </span>
          <div className="w-36">
            <Select
              options={filteredHistoryOptions}
              value={filteredHistoryOptions.find(
                (opt) => opt.value === selectedHistoryPeriod
              )}
              onChange={(selected) =>
                selected && setSelectedHistoryPeriod(selected.value)
              }
              isSearchable={false}
              placeholder={t("selectHistory")}
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "36px",
                  borderColor: "#d1d5db",
                  fontSize: "0.875rem",
                  borderRadius: "0.375rem",
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "4px",
                }),
                indicatorSeparator: () => ({
                  display: "none",
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: "0.875rem",
                }),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
