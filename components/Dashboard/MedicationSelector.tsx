"use client";
import { Pill, Lock } from "lucide-react";
import type { Medication } from "../../types/medication";
import { useTranslation } from "react-i18next";

interface MedicationSelectorProps {
  medications: Medication[];
  selectedMedication: string;
  onMedicationChange: (medicationId: string) => void;
  isAuthenticated: boolean;
}

export default function MedicationSelector({
  medications,
  selectedMedication,
  onMedicationChange,
  isAuthenticated,
}: MedicationSelectorProps) {
  const { t } = useTranslation("MedicationSelector");
  const availableMedications = isAuthenticated
    ? medications
    : medications.slice(0, 1);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Pill className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
        {!isAuthenticated && (
          <div className="ml-auto flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm">
            <Lock className="w-4 h-4" />
            {t("LimitedAccess")}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableMedications.map((medication) => (
          <div
            key={medication.id || medication.name}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMedication === medication.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onMedicationChange(medication.id)}
          >
            <h3 className="font-medium text-gray-900 mb-1">
              {medication.name}
            </h3>
            <p className="text-sm text-blue-600 mb-2">
              {medication.category || "Uncategorized"}
            </p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {medication.description || "No description available"}
            </p>
          </div>
        ))}
      </div>
      {!isAuthenticated && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">{t("Unlock")}</h3>
          </div>
          <p className="text-sm text-blue-700">
            {t("unlockMessage", { medications })}
          </p>
        </div>
      )}
    </div>
  );
}
