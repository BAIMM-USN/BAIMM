import React from "react";
import { BookOpen, Users, Calendar, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ResearchInfo() {
  const { t } = useTranslation("researchInfo");

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">{t("title")}</h2>
      </div>

      <div className="space-y-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            {t("subtitle")}
          </h3>
          <p className="text-gray-600 mb-4">{t("researchDescription")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {t("ResearchTeam")}
                </h4>
                <p className="text-sm text-gray-600">{t("ResearchTeams")}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {t("StudyPeriod")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("studyPeriodDetail")}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {t("ModelPerformance")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("ModelPerformanceDetail")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">
                  {t("Methodology")}
                </h4>
                <p className="text-sm text-gray-600">
                  {t("MethodologyDetail")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            {t("KeyParameters")}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="text-blue-700">• {t("Temperature")}</div>
            <div className="text-blue-700">• {t("Humidity")}</div>
            <div className="text-blue-700">• {t("Atmosphere")}</div>
            <div className="text-blue-700">• {t("Wind")}</div>
            <div className="text-blue-700">• {t("Precipitation")}</div>
            <div className="text-blue-700">• {t("Visibility")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
