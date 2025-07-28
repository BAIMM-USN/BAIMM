import React from "react";
import { Activity, TrendingUp, Pill, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ScatterStatsProps {
  minY: number;
  maxY: number;
  predictionType: "weekly" | "monthly";
  upcoming: { y: number }[];
  selectedMedication: string;
  selectedMunicipality: string;
  viewMode: "upcoming" | "previous" | "both";
}

export default function ScatterStats({
  minY,
  maxY,
  predictionType,
  upcoming,
  selectedMedication,
  selectedMunicipality,
  viewMode,
}: ScatterStatsProps) {
  const { t } = useTranslation("ScatterStats");

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            {viewMode === "previous" ? t("historicalRange") : t("demandRange")}
          </span>
        </div>
        <p className="text-sm text-blue-700">
          {Math.round(minY).toLocaleString()} -{" "}
          {Math.round(maxY).toLocaleString()} {t("units")}
        </p>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-900">
            {t("nextPrediction", {
              period:
                predictionType === "weekly"
                  ? t("week", { ns: "mainPage" })
                  : t("month", { ns: "mainPage" }),
            })}
          </span>
        </div>
        <p className="text-sm text-green-700">
          {upcoming.length > 0
            ? `${upcoming[0].y.toLocaleString()} ${t("units")}`
            : t("noPrediction")}
        </p>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Pill className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">
            {t("selectedMedication")}
          </span>
        </div>
        <p className="text-sm text-purple-700 truncate">{selectedMedication}</p>
      </div>

      <div className="bg-orange-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-900">
            {t("municipality")}
          </span>
        </div>
        <p className="text-sm text-orange-700">{selectedMunicipality}</p>
      </div>
    </div>
  );
}
