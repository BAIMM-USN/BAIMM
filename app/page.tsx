"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "../components/Auth/LoginForm";
import Header from "../components/Dashboard/Header";
import MedicationSelector from "../components/Dashboard/MedicationSelector";
import ScatterPlot from "../components/Dashboard/ScatterPlot";
import ResearchInfo from "../components/Dashboard/ResearchInfo";
import type {
  Medication,
  Prediction,
  Municipality,
  DataPoint,
} from "../types/medication";
import {
  fetchMedications,
  fetchPredictions,
  fetchMunicipalities,
} from "../utils/firestore";

function App() {
  const { user, isLoading, login, signup, logout, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState("");
  const [predictionType, setPredictionType] = useState<"weekly" | "monthly">(
    "weekly"
  );
  const [modalLoading, setModalLoading] = useState(false);

  // Hydration-safe mounting state
  const [isMounted, setIsMounted] = useState(false);

  // Data states with proper typing
  const [medicationsData, setMedicationsData] = useState<Medication[]>([]);
  const [predictionsData, setPredictionsData] = useState<Prediction[]>([]);
  const [municipalitiesData, setMunicipalitiesData] = useState<Municipality[]>(
    []
  );
  const [loadingData, setLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);

  // Handle hydration by ensuring client-only rendering after mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch data with proper error handling
  useEffect(() => {
    async function fetchData() {
      if (!isMounted) return;

      setLoadingData(true);
      setDataError(null);

      try {
        const [medications, predictions, municipalities] = await Promise.all([
          fetchMedications(),
          fetchPredictions(),
          fetchMunicipalities(),
        ]);

        setMedicationsData(medications);
        setPredictionsData(predictions);
        setMunicipalitiesData(municipalities);

        // Set initial medication if none selected
        if (medications.length > 0 && !selectedMedication) {
          setSelectedMedication(medications[0].id);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setDataError("Failed to load data. Please try again.");
      } finally {
        setLoadingData(false);
      }
    }

    fetchData();
  }, [isMounted, selectedMedication]);

  // Map Firebase user to expected Header user shape
  const headerUser =
    user && user.email
      ? {
          name: user.displayName || user.email.split("@")[0],
          email: user.email,
        }
      : null;

  // Track selected municipality by id
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  useEffect(() => {
    if (municipalitiesData.length > 0 && !selectedMunicipality) {
      setSelectedMunicipality(municipalitiesData[0].id);
    }
  }, [municipalitiesData, selectedMunicipality]);

  // Helper to get predictions for selected medication and selected municipality (by id)
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
          // Accept both id and name for robustness
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

    // Use the last (latest) as the upcoming, previous are all before it
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

  // Update getAvailableHistoryPeriods to filter by selected municipality
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

  // Show loading until hydration is complete and auth is resolved
  if (!isMounted || isLoading || loadingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (dataError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ {dataError}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Common dashboard content component
  const DashboardContent = ({ showLoginButton = false }) => {
    const currentMedicationId =
      selectedMedication || medicationsData[0]?.id || "";

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
              title={`${
                predictionType === "weekly" ? "Weekly" : "Monthly"
              } Medication Demand ${
                isAuthenticated ? "Analysis" : "Prediction"
              }`}
              xLabel={
                predictionType === "weekly" ? "Week Period" : "Month Period"
              }
              yLabel="Predicted Demand (units)"
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
          <div className="lg:col-span-1">
            <ResearchInfo />
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

export default App;
