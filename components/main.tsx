"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "../components/Auth/LoginForm";
import Header from "../components/Dashboard/Header";
import MedicationSelector from "../components/Dashboard/MedicationSelector";
import ScatterPlot from "../components/Dashboard/ScatterPlot";
import ResearchInfo from "../components/Dashboard/ResearchInfo";
import type { Medication, Prediction, Municipality } from "../types/medication";

// Use environment variable for API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function fetchMedicationsFromApi(token?: string): Promise<Medication[]> {
  const res = await fetch(`${API_BASE_URL}/medications`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch medications from backend API");
  return res.json();
}

async function fetchPredictionsFromApi({
  token,
  medicationId,
  municipalityId,
  periodType,
}: {
  token?: string;
  medicationId?: string;
  municipalityId?: string;
  periodType?: string;
}): Promise<Prediction[]> {
  const params = new URLSearchParams();
  if (medicationId) params.append("medicationId", medicationId);
  if (municipalityId) params.append("municipalityId", municipalityId);
  if (periodType) params.append("periodType", periodType);
  const url = `${API_BASE_URL}/predictions${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch predictions from backend API");
  return res.json();
}

async function fetchMunicipalitiesFromApi(): Promise<Municipality[]> {
  const res = await fetch(`${API_BASE_URL}/municipalities`);
  if (!res.ok)
    throw new Error("Failed to fetch municipalities from backend API");
  return res.json();
}

import { ApiIntegrationGuide } from "@/components/Dashboard/apiIntegration";
import { useTranslation } from "react-i18next";
let medicationsCache: Medication[] | null = null;
let predictionsCache: Prediction[] | null = null;
let municipalitiesCache: Municipality[] | null = null;

export default function App() {
  const { user, isLoading, login, signup, logout, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [predictionType, setPredictionType] = useState<"weekly" | "monthly">(
    "weekly"
  );
  const [modalLoading, setModalLoading] = useState(false);

  const [medicationsData, setMedicationsData] = useState<Medication[]>([]);
  const [predictionsData, setPredictionsData] = useState<Prediction[]>([]);
  const [municipalitiesData, setMunicipalitiesData] = useState<Municipality[]>(
    []
  );
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");

  useEffect(() => {
    async function fetchStaticData() {
      setLoadingData(true);
      setDataError(null);
      try {
        let medications = medicationsCache;
        let municipalities = municipalitiesCache;
        let token: string | undefined = undefined;
        if (user && user.getIdToken) {
          token = await user.getIdToken();
        }
        if (!medications) {
          medications = await fetchMedicationsFromApi(token);
          medicationsCache = medications;
        } else if (token) {
          medications = await fetchMedicationsFromApi(token);
          medicationsCache = medications;
        }
        if (!municipalities) {
          municipalities = await fetchMunicipalitiesFromApi();
          municipalitiesCache = municipalities;
        }
        setMedicationsData(medications || []);
        setMunicipalitiesData(municipalities || []);
        if (medications.length > 0 && !selectedMedication) {
          setSelectedMedication(medications[0].id);
        }
      } catch (error) {
        console.error("Error fetching static data:", error);
        setDataError("Failed to load data. Please try again.");
      } finally {
        setLoadingData(false);
      }
    }
    fetchStaticData();
  }, [user]);

  useEffect(() => {
    if (medicationsData.length > 0) {
      const found = medicationsData.find((m) => m.id === selectedMedication);
      if (!found) {
        setSelectedMedication(medicationsData[0].id);
      }
    }
  }, [medicationsData]);

  useEffect(() => {
    const medicationId = selectedMedication || medicationsData[0]?.id;
    if (!medicationId || !selectedMunicipality) {
      setPredictionsData([]);
      setLoadingData(false);
      return;
    }
    setLoadingData(true);
    setDataError(null);
    async function fetchPredictions() {
      try {
        let predictions: Prediction[] = [];
        let token: string | undefined = undefined;
        if (user && user.getIdToken) {
          token = await user.getIdToken();
        }
        const preds = await fetchPredictionsFromApi({
          token,
          medicationId,
          municipalityId: selectedMunicipality,
          periodType: predictionType,
        });
        predictions = preds;
        predictionsCache = predictions;
        setPredictionsData(predictions || []);
      } catch (error) {
        setDataError("Failed to load predictions. Please try again.");
      } finally {
        setLoadingData(false);
      }
    }
    fetchPredictions();
  }, [selectedMedication, selectedMunicipality, predictionType]);

  const headerUser =
    user && user.email
      ? {
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
        }
      : null;

  useEffect(() => {
    if (municipalitiesData.length > 0 && !selectedMunicipality) {
      setSelectedMunicipality(municipalitiesData[0].id);
    }
  }, [municipalitiesData, selectedMunicipality]);

  function getPredictionData(
    medicationId: string,
    predictionType: "weekly" | "monthly",
    municipalityId?: string
  ) {
    if (!medicationId || !municipalityId) return { upcoming: [], previous: [] };

    const filtered = predictionsData
      .filter(
        (p) =>
          p.medicationId === medicationId &&
          p.periodType === predictionType &&
          (p.municipalityId === municipalityId ||
            municipalitiesData.find((m) => m.id === municipalityId)?.name ===
              p.municipalityId)
      )
      .sort((a, b) =>
        predictionType === "weekly"
          ? (a.weekNumber || 0) - (b.weekNumber || 0)
          : (a.monthNumber || 0) - (b.monthNumber || 0)
      );

    if (filtered.length === 0) {
      return { upcoming: [], previous: [] };
    }

    const upcoming = [
      {
        x:
          (predictionType === "weekly"
            ? filtered[filtered.length - 1].weekNumber
            : filtered[filtered.length - 1].monthNumber) || 0,
        y:
          filtered[filtered.length - 1].predictedValue ||
          filtered[filtered.length - 1].y ||
          0,
        label:
          predictionType === "weekly"
            ? `Week ${filtered[filtered.length - 1].weekNumber || 0}`
            : `Month ${filtered[filtered.length - 1].monthNumber || 0}`,
        weekNumber: filtered[filtered.length - 1].weekNumber,
        monthNumber: filtered[filtered.length - 1].monthNumber,
        date:
          filtered[filtered.length - 1].date ||
          new Date().toISOString().split("T")[0],
        confidence: filtered[filtered.length - 1].confidence || 0,
      },
    ];

    const previous = filtered.slice(0, -1).map((p) => ({
      x: (predictionType === "weekly" ? p.weekNumber : p.monthNumber) || 0,
      y: p.predictedValue || p.y || 0,
      label:
        predictionType === "weekly"
          ? `Week ${p.weekNumber || 0}`
          : `Month ${p.monthNumber || 0}`,
      weekNumber: p.weekNumber,
      monthNumber: p.monthNumber,
      date: p.date || new Date().toISOString().split("T")[0],
      confidence: p.confidence || 0,
    }));

    return { upcoming, previous };
  }

  function getAvailableHistoryPeriods(
    predictionType: "weekly" | "monthly"
  ): string[] {
    const medicationId = selectedMedication || medicationsData[0]?.id || "";
    if (!medicationId || !selectedMunicipality) return [];

    const filtered = predictionsData
      .filter(
        (p) =>
          p.medicationId === medicationId &&
          p.periodType === predictionType &&
          p.municipalityId === selectedMunicipality
      )
      .sort((a, b) =>
        predictionType === "weekly"
          ? (a.weekNumber || 0) - (b.weekNumber || 0)
          : (a.monthNumber || 0) - (b.monthNumber || 0)
      );

    return filtered
      .slice(1)
      .map((p) =>
        predictionType === "weekly"
          ? `Week ${p.weekNumber || 0}`
          : `Month ${p.monthNumber || 0}`
      );
  }

  const handleLogin = async (email: string, password: string) => {
    setModalLoading(true);
    try {
      await login(email, password);
      setIsLoginModalOpen(false);
    } finally {
      let token: string | undefined = undefined;
      if (user && user.getIdToken) {
        token = await user.getIdToken();
      }
      fetchMedicationsFromApi(token).then((medications) => {
        medicationsCache = medications;
      });
      setModalLoading(false);
    }
  };

  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    setModalLoading(true);
    try {
      await signup(name, email, password);
      setIsLoginModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const { t } = useTranslation("mainPage");

  const staticDataLoaded =
    medicationsData.length > 0 && municipalitiesData.length > 0;
  if (isLoading || loadingData || !staticDataLoaded) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {t("errorLoadingData")}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("retry")}
          </button>
        </div>
      </div>
    );
  }

  const DashboardContent = ({ showLoginButton = false }) => {
    const currentMedicationId =
      selectedMedication || medicationsData[0]?.id || "";

    const firebaseConfig = {
      apiKey: "AIzaSyCr7lo2u_wTjODERWRcasdjxbsQ2Wvmeac",
      authDomain: "baimm-58404.firebaseapp.com",
      projectId: "baimm-58404",
      storageBucket: "baimm-58404.firebaseapp.com",
      messagingSenderId: "561212997161",
      appId: "1:561212997161:web:5d6f423a7555cb6a422638",
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Header
            user={showLoginButton ? null : headerUser}
            onLogout={logout}
            onLoginClick={
              showLoginButton ? () => setIsLoginModalOpen(true) : undefined
            }
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MedicationSelector
              medications={medicationsData}
              selectedMedication={currentMedicationId}
              onMedicationChange={setSelectedMedication}
              isAuthenticated={isAuthenticated}
            />
            <ScatterPlot
              data={getPredictionData(
                currentMedicationId,
                predictionType,
                selectedMunicipality
              )}
              title={
                predictionType === "weekly"
                  ? isAuthenticated
                    ? t("weeklyMedicationDemandAnalysis")
                    : t("weeklyMedicationDemandPrediction")
                  : isAuthenticated
                  ? t("monthlyMedicationDemandAnalysis")
                  : t("monthlyMedicationDemandPrediction")
              }
              xLabel={
                predictionType === "weekly" ? t("weekPeriod") : t("monthPeriod")
              }
              yLabel={t("predictedDemand")}
              availableMedications={medicationsData.map((m) => m.name)}
              availableMunicipalities={municipalitiesData}
              selectedMunicipality={selectedMunicipality}
              setSelectedMunicipality={setSelectedMunicipality}
              availableHistoryPeriods={getAvailableHistoryPeriods(
                predictionType
              )}
              onMedicationChange={setSelectedMedication}
              selectedMedication={currentMedicationId}
              predictionType={predictionType}
              onPredictionTypeChange={setPredictionType}
              isLoggedIn={isAuthenticated}
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <ResearchInfo />
            {user && (
              <ApiIntegrationGuide
                apiEndpoint="https://baimm.vercel.app/api/predict"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        loading={modalLoading}
      />
      {isAuthenticated ? (
        <DashboardContent />
      ) : (
        <DashboardContent showLoginButton={true} />
      )}
    </div>
  );
}
