"use client";

import { MapContainer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { GeoJsonObject, Feature, Geometry } from "geojson";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";

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

// Change function signature to accept selectedMedication as a prop
export default function MedicationDemandMap({
  selectedMedication,
  predictionType = "weekly",
}: HeatMapProps) {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const mapRef = useRef<L.Map>(null);
  const [open, setOpen] = useState(true);
  const [demand, setDemand] = useState<DemandMap>({});
  const [weeklyPredictions, setWeeklyPredictions] = useState<Prediction[]>([]);
  const [monthlyPredictions, setMonthlyPredictions] = useState<Prediction[]>(
    []
  );
  const [top10Increases, setTop10Increases] = useState<
    { kommunenavn: string; increase: number }[]
  >([]);
  // const [selectedMedication, setSelectedMedication] = useState<string>("");

  // Fetch all medications for dropdown
  const [medications, setMedications] = useState<
    { id: string; name: string }[]
  >([]);
  useEffect(() => {
    async function fetchMeds() {
      const medsSnap = await getDocs(collection(db, "medications"));
      const meds = medsSnap.docs.map(
        (doc) => doc.data() as { id: string; name: string }
      );
      setMedications(meds);
      //   if (meds.length > 0 && !selectedMedication)
      //     setSelectedMedication(meds[0].id);
    }
    fetchMeds();
  }, []);

  // Fetch demand values for week 4 (weekly) or month 3 (monthly) from Firestore (for coloring the map)
  useEffect(() => {
    if (!selectedMedication) return;
    async function fetchDemand() {
      let predsSnap;
      if (predictionType === "monthly") {
        predsSnap = await getDocs(
          query(
            collection(db, "predictions"),
            where("periodType", "==", "monthly"),
            where("monthNumber", "==", 3),
            where("medicationId", "==", selectedMedication)
          )
        );
      } else {
        predsSnap = await getDocs(
          query(
            collection(db, "predictions"),
            where("periodType", "==", "weekly"),
            where("weekNumber", "==", 4),
            where("medicationId", "==", selectedMedication)
          )
        );
      }
      const demandMap: DemandMap = {};
      predsSnap.forEach((doc) => {
        const data = doc.data();
        demandMap[data.municipalityId] = data.predictedValue || data.y || 0;
      });
      setDemand(demandMap);
    }
    fetchDemand();
  }, [selectedMedication, predictionType]);

  // Fetch filtered municipalities GeoJSON
  useEffect(() => {
    fetch("/Kommuner-M.geojson")
      .then((res) => res.json())
      .then((data: GeoJSONData) => {
        setGeoData(data);
      });
    console.log(
      geoData?.features?.map((feature) => feature.properties.kommunenummer),
      geoData?.features?.map((feature) => feature.properties.name)
    );
  }, []);

  // Zoom to bounds after geoData is loaded
  useEffect(() => {
    if (geoData && mapRef.current) {
      const bounds = L.geoJSON(geoData).getBounds();
      mapRef.current.fitBounds(bounds);
    }
  }, [geoData]);

  // Log geoData changes
  useEffect(() => {
    if (geoData) {
      console.log("GeoData fetched:", geoData);
    }
  }, [geoData]);

  // Color scale for demand
  const getColor = (value: number) => {
    if (predictionType === "monthly") {
      // Monthly: use a different scale (example: higher values, wider bands)
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
    // Debug: log the key and value
    // console.log("style kommunenr", kommunenr, "val", demand[kommunenr]);
    // console.log(demand)
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
      let increases: { municipalityId: string; increase: number }[] = [];
      if (predictionType === "monthly") {
        // Monthly: get month 2 and month 3 for selected medication
        const monthlySnap = await getDocs(
          query(
            collection(db, "predictions"),
            where("periodType", "==", "monthly"),
            where("monthNumber", "in", [2, 3]),
            where("medicationId", "==", selectedMedication)
          )
        );
        const month2Map: { [mun: string]: number } = {};
        const month3Map: { [mun: string]: number } = {};
        monthlySnap.forEach((doc) => {
          const data = doc.data() as Prediction;
          if (data.monthNumber === 2) {
            month2Map[data.municipalityId] = data.predictedValue || data.y || 0;
          }
          if (data.monthNumber === 3) {
            month3Map[data.municipalityId] = data.predictedValue || data.y || 0;
          }
        });
        // Only compare municipalities that exist in both months
        Object.keys(month3Map).forEach((mun) => {
          if (month2Map.hasOwnProperty(mun)) {
            const inc = month3Map[mun] - month2Map[mun];
            increases.push({ municipalityId: mun, increase: inc });
          }
        });
        setMonthlyPredictions(
          monthlySnap.docs.map((doc) => doc.data() as Prediction)
        );
      } else {
        // Weekly: get week 3 and week 4 for selected medication
        const weeklySnap = await getDocs(
          query(
            collection(db, "predictions"),
            where("periodType", "==", "weekly"),
            where("weekNumber", "in", [3, 4]),
            where("medicationId", "==", selectedMedication)
          )
        );
        const week3Map: { [mun: string]: number } = {};
        const week4Map: { [mun: string]: number } = {};
        weeklySnap.forEach((doc) => {
          const data = doc.data() as Prediction;
          if (data.weekNumber === 3) {
            week3Map[data.municipalityId] = data.predictedValue || data.y || 0;
          }
          if (data.weekNumber === 4) {
            week4Map[data.municipalityId] = data.predictedValue || data.y || 0;
          }
        });
        Object.keys(week4Map).forEach((mun) => {
          const inc = week4Map[mun] - (week3Map[mun] || 0);
          increases.push({ municipalityId: mun, increase: inc });
        });
        setWeeklyPredictions(
          weeklySnap.docs.map((doc) => doc.data() as Prediction)
        );
      }

      // Map municipalityId to name using geoData if available
      let idToName: { [id: string]: string } = {};
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
          Demand Level
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
          <span>🔺 Top 10 Demand Increases</span>
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
