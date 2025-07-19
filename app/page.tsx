"use client";
import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "../components/Auth/LoginForm";
import Header from "../components/Dashboard/Header";
import MedicationSelector from "../components/Dashboard/MedicationSelector";
import ScatterPlot from "../components/Dashboard/ScatterPlot";
import ResearchInfo from "../components/Dashboard/ResearchInfo";
import {
  medications,
  availableMedications,
  availableMunicipalities,
  availableHistoryPeriods,
  getMedicationData,
} from "../Data/mockData";

function App() {
  const { user, isLoading, login, signup, logout, isAuthenticated } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(
    medications[0].name
  );
  const [predictionType, setPredictionType] = useState<"weekly" | "monthly">(
    "weekly"
  );
  // const [weatherParams, setWeatherParams] = useState({
  //   temperature: 22,
  //   humidity: 65,
  //   pressure: 1013,
  //   windSpeed: 12,
  //   precipitation: 2.5,
  //   visibility: 15,
  // });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={login}
          onSignup={signup}
        />

        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Header
              user={null}
              onLogout={logout}
              onLoginClick={() => setIsLoginModalOpen(true)}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* <WeatherControls
                weatherParams={weatherParams}
                onWeatherChange={setWeatherParams}
              /> */}

              <MedicationSelector
                medications={medications}
                selectedMedication={medications[0].id}
                onMedicationChange={setSelectedMedication}
                isAuthenticated={false}
              />

              <ScatterPlot
                data={{
                  upcoming: getMedicationData(
                    selectedMedication,
                    predictionType
                  ).upcoming,
                  previous:
                    predictionType === "weekly"
                      ? getMedicationData(
                          selectedMedication,
                          predictionType
                        ).previous.slice(-4)
                      : getMedicationData(selectedMedication, predictionType)
                          .previous,
                }}
                title={`${
                  predictionType === "weekly" ? "Weekly" : "Monthly"
                } Medication Demand Prediction`}
                xLabel={
                  predictionType === "weekly" ? "Week Period" : "Month Period"
                }
                yLabel="Predicted Demand (units)"
                availableMedications={availableMedications}
                availableMunicipalities={availableMunicipalities}
                availableHistoryPeriods={availableHistoryPeriods}
                onMedicationChange={setSelectedMedication}
                selectedMedication={selectedMedication}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={user} onLogout={logout} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* <WeatherControls
              weatherParams={weatherParams}
              onWeatherChange={setWeatherParams}
            /> */}

            <MedicationSelector
              medications={medications}
              selectedMedication={selectedMedication}
              onMedicationChange={setSelectedMedication}
              isAuthenticated={true}
            />

            <ScatterPlot
              data={{
                upcoming: getMedicationData(selectedMedication, predictionType)
                  .upcoming,
                previous:
                  predictionType === "weekly"
                    ? getMedicationData(
                        selectedMedication,
                        predictionType
                      ).previous.slice(-4)
                    : getMedicationData(selectedMedication, predictionType)
                        .previous,
              }}
              title={`${
                predictionType === "weekly" ? "Weekly" : "Monthly"
              } Medication Demand Analysis`}
              xLabel={
                predictionType === "weekly" ? "Week Period" : "Month Period"
              }
              yLabel="Predicted Demand (units)"
              availableMedications={availableMedications}
              availableMunicipalities={availableMunicipalities}
              availableHistoryPeriods={availableHistoryPeriods}
              onMedicationChange={setSelectedMedication}
              selectedMedication={selectedMedication}
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
    </div>
  );
}

export default App;
