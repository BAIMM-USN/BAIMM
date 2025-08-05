"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";

import { useTranslation } from "react-i18next";

interface MunicipalityProperties {
  kommunenummer: string;
  kommunenavn: string;
  id?: string;
  name?: string;
}

type MunicipalityFeature = Feature<Geometry, MunicipalityProperties>;

interface GeoJSONData extends GeoJsonObject {
  type: "FeatureCollection";
  features: MunicipalityFeature[];
}

type DemandMap = {
  [kommunenr: string]: number;
};

type Prediction = {
  municipalityId: string;
  medicationId?: string;
  periodType: "weekly" | "monthly";
  weekNumber?: number;
  monthNumber?: number;
  predictedValue?: number;
  y?: number;
};

interface HeatMapProps {
  selectedMedication: string;
  predictionType?: "weekly" | "monthly";
}

async function fetchPredictionsFromApi({
  token,
  medicationId,
  municipalityId,
  periodType,
  weekNumber,
  monthNumber,
}: {
  token?: string;
  medicationId?: string;
  municipalityId?: string;
  periodType?: string;
  weekNumber?: number;
  monthNumber?: number;
}): Promise<Prediction[]> {
  const params = new URLSearchParams();
  if (medicationId) params.append("medicationId", medicationId);
  if (municipalityId) params.append("municipalityId", municipalityId);
  if (periodType) params.append("periodType", periodType);
  if (weekNumber !== undefined) params.append("weekNumber", String(weekNumber));
  const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  if (monthNumber !== undefined)
    params.append("monthNumber", String(monthNumber));
  const url = `${API_BASE_URL}/predictions${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch predictions from backend API");
  return res.json();
}

export default function MedicationDemandMap({
  selectedMedication,
  predictionType = "weekly",
}: HeatMapProps) {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [open, setOpen] = useState(true);
  const [demand, setDemand] = useState<DemandMap>({});
  const [top10Increases, setTop10Increases] = useState<
    { kommunenavn: string; increase: number }[]
  >([]);
  const { t } = useTranslation("heatMap");

  useEffect(() => {
    if (!selectedMedication) return;
    async function fetchDemand() {
      try {
        const predictions = await fetchPredictionsFromApi({
          medicationId: selectedMedication,
          periodType: predictionType,
          weekNumber: predictionType === "weekly" ? 4 : undefined,
          monthNumber: predictionType === "monthly" ? 3 : undefined,
        });
        const demandMap: DemandMap = {};
        predictions.forEach((data) => {
          demandMap[data.municipalityId] = data.predictedValue || data.y || 0;
        });
        setDemand(demandMap);
      } catch (err) {
        setDemand({});
      }
    }
    fetchDemand();
  }, [selectedMedication, predictionType]);

  useEffect(() => {
    fetch("/Kommuner-M.geojson")
      .then((res) => res.json())
      .then((data: GeoJSONData) => {
        setGeoData(data);
      });
  }, []);

  useEffect(() => {
    if (geoData && mapRef.current) {
      const bounds = L.geoJSON(geoData).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoData]);

  const getColor = (value: number) => {
    if (predictionType === "monthly") {
      return value > 300
        ? "#800026"
        : value > 200
        ? "#BD0026"
        : value > 120
        ? "#E31A1C"
        : value > 60
        ? "#FC4E2A"
        : value > 0
        ? "#FD8D3C"
        : "#FFEDA0";
    }
    // Weekly: original scale
    return value > 70
      ? "#800026"
      : value > 50
      ? "#BD0026"
      : value > 30
      ? "#E31A1C"
      : value > 15
      ? "#FC4E2A"
      : value > 0
      ? "#FD8D3C"
      : "#FFEDA0";
  };

  const style = (feature?: Feature<Geometry, MunicipalityProperties>) => {
    if (!feature?.properties) {
      return {
        fillColor: "#FFEDA0",
        weight: 1,
        opacity: 1,
        color: "#999",
        fillOpacity: 0.85,
      };
    }

    // Always use string and trim for key
    const kommunenr = (
      feature.properties.kommunenummer ||
      feature.properties.id ||
      ""
    )
      .toString()
      .trim();
   
    const val = demand[kommunenr] || 0;
    return {
      fillColor: getColor(val),
      weight: 1,
      opacity: 1,
      color: "#999",
      fillOpacity: 0.85,
    };
  };

  // Store layer references to update tooltips when demand changes
  const layerRefs = useRef<{ [key: string]: L.Layer }>({});
  useEffect(() => {
    Object.entries(layerRefs.current).forEach(([kommunenr, layer]) => {
      // Find the name from geoData for this kommunenr
      let navn = kommunenr;
      if (geoData) {
        const found = geoData.features.find(
          (f) =>
            (f.properties.kommunenummer || f.properties.id || "")
              .toString()
              .trim() === kommunenr
        );
        if (found) {
          navn =
            found.properties.kommunenavn || found.properties.name || kommunenr;
        }
      }
      const val = demand[kommunenr] !== undefined ? demand[kommunenr] : 0;
      layer.bindTooltip(
        `<div class="p-2">
        <div class="font-semibold text-gray-900">${navn}</div>
        <div class="text-sm text-gray-600">Demand: <span class="font-medium">${val}</span></div>
      </div>`,
        {
          sticky: true,
          className: "custom-tooltip",
        }
      );
    });
  }, [demand, geoData]);

  // Fetch week 3, week 4, month 2, month 3 for top increases (but do not overwrite demand for map coloring)
  useEffect(() => {
    if (!selectedMedication) return;
    async function fetchIncreases() {
      try {
        let predsPrev: Prediction[] = [];
        let predsCurr: Prediction[] = [];
        if (predictionType === "monthly") {
          // Compare month 3 vs month 2
          predsPrev = await fetchPredictionsFromApi({
            medicationId: selectedMedication,
            periodType: "monthly",
            monthNumber: 2,
          });
          predsCurr = await fetchPredictionsFromApi({
            medicationId: selectedMedication,
            periodType: "monthly",
            monthNumber: 3,
          });
        } else {
          // Compare week 4 vs week 3
          predsPrev = await fetchPredictionsFromApi({
            medicationId: selectedMedication,
            periodType: "weekly",
            weekNumber: 3,
          });
          predsCurr = await fetchPredictionsFromApi({
            medicationId: selectedMedication,
            periodType: "weekly",
            weekNumber: 4,
          });
        }
        // Map by municipalityId
        const mapPrev: { [mun: string]: number } = {};
        const mapCurr: { [mun: string]: number } = {};
        predsPrev.forEach((data) => {
          mapPrev[data.municipalityId] = data.predictedValue || data.y || 0;
        });
        predsCurr.forEach((data) => {
          mapCurr[data.municipalityId] = data.predictedValue || data.y || 0;
        });
        // Calculate increases
        const increases: { municipalityId: string; increase: number }[] = [];
        Object.keys(mapCurr).forEach((mun) => {
          const inc = mapCurr[mun] - (mapPrev[mun] || 0);
          increases.push({ municipalityId: mun, increase: inc });
        });
        // Map municipalityId to name using geoData if available
        const idToName: { [id: string]: string } = {};
        if (geoData) {
          geoData.features.forEach((f) => {
            const id = (f.properties.kommunenummer || f.properties.id || "")
              .toString()
              .trim();
            const name = f.properties.kommunenavn || f.properties.name || id;
            idToName[id] = name;
          });
        }
        // Sort and pick top 10
        const top10 = increases
          .map((item) => ({
            kommunenavn: idToName[item.municipalityId] || item.municipalityId,
            increase: item.increase,
          }))
          .sort((a, b) => b.increase - a.increase)
          .slice(0, 10);
        setTop10Increases(top10);
      } catch (err) {
        console.error("Error fetching increases from backend:", err);
        setTop10Increases([]);
      }
    }
    fetchIncreases();
  }, [geoData, selectedMedication, predictionType]);

  return (
    <div className="relative">
      {/* Remove medication selector dropdown here */}

      <div className="h-[500px] w-full rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          ref={mapRef}
          center={[63.43, 10.39]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
          attributionControl={false}
        >
          {geoData && (
            <GeoJSON
              data={geoData}
              style={style}
              onEachFeature={(
                feature: Feature<Geometry, MunicipalityProperties>,
                layer: L.Layer
              ) => {
                const kommunenr = (
                  feature.properties.kommunenummer ||
                  feature.properties.id ||
                  ""
                )
                  .toString()
                  .trim();
                const navn =
                  feature?.properties?.kommunenavn ||
                  feature?.properties?.name ||
                  "Unknown";
                // Save layer reference for later tooltip update
                layerRefs.current[kommunenr] = layer;
                // Set initial tooltip (may be 0 if demand not loaded yet)
                const val =
                  demand[kommunenr] !== undefined ? demand[kommunenr] : 0;
                layer.bindTooltip(
                  `<div class="p-2">
                    <div class="font-semibold text-gray-900">${navn}</div>
                    <div class="text-sm text-gray-600">Demand: <span class="font-medium">${val}</span></div>
                  </div>`,
                  {
                    sticky: true,
                    className: "custom-tooltip",
                  }
                );
              }}
            />
          )}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-max">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          {t("demandLevel")}
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-700">
          {predictionType === "monthly" ? (
            <>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#FFEDA0" }}
                ></div>
                <span>0</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#FD8D3C" }}
                ></div>
                <span>1 - 60</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#FC4E2A" }}
                ></div>
                <span>61 - 120</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#E31A1C" }}
                ></div>
                <span>121 - 200</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#BD0026" }}
                ></div>
                <span>201 - 300</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#800026" }}
                ></div>
                <span>301+</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#FFEDA0" }}
                ></div>
                <span>0</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#FD8D3C" }}
                ></div>
                <span>1 - 15</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#FC4E2A" }}
                ></div>
                <span>16 - 30</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#E31A1C" }}
                ></div>
                <span>31 - 50</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#BD0026" }}
                ></div>
                <span>51 - 70</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ background: "#800026" }}
                ></div>
                <span>71+</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Top 10 Increases Panel */}
      <div className="absolute top-4 right-4 max-w-xs w-64">
        <button
          onClick={() => setOpen(!open)}
          className="mb-2 w-full bg-blue-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center"
          aria-expanded={open}
          aria-controls="top10-panel"
        >
          <span>{t("top10Increases")}</span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {open && (
          <div
            id="top10-panel"
            className="bg-white p-4 rounded-lg shadow-md border text-sm text-gray-700"
          >
            <ul className="space-y-1">
              {top10Increases.map((item, idx) => (
                <li key={item.kommunenavn} className="flex justify-between">
                  <span>
                    {idx + 1}. {item.kommunenavn}
                  </span>
                  <span className="text-green-600 font-medium">
                    {item.increase >= 0 ? "+" : ""}
                    {Math.round(item.increase)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
