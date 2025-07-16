import React from 'react';
import { Cloud, Droplets, Sun, Thermometer, Wind, Eye } from 'lucide-react';

interface WeatherControlsProps {
  weatherParams: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    precipitation: number;
    visibility: number;
  };
  onWeatherChange: (params: any) => void;
}

export default function WeatherControls({ weatherParams, onWeatherChange }: WeatherControlsProps) {
  const handleParamChange = (param: string, value: number) => {
    onWeatherChange({ ...weatherParams, [param]: value });
  };

  const weatherInputs = [
    { key: 'temperature', label: 'Temperature (°C)', icon: Thermometer, min: -20, max: 45, step: 0.5 },
    { key: 'humidity', label: 'Humidity (%)', icon: Droplets, min: 0, max: 100, step: 1 },
    { key: 'pressure', label: 'Pressure (hPa)', icon: Cloud, min: 980, max: 1040, step: 0.1 },
    { key: 'windSpeed', label: 'Wind Speed (km/h)', icon: Wind, min: 0, max: 100, step: 0.1 },
    { key: 'precipitation', label: 'Precipitation (mm)', icon: Droplets, min: 0, max: 100, step: 0.1 },
    { key: 'visibility', label: 'Visibility (km)', icon: Eye, min: 0, max: 30, step: 0.1 }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center gap-2 mb-6">
        <Sun className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Weather Parameters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherInputs.map(({ key, label, icon: Icon, min, max, step }) => (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700">{label}</label>
            </div>
            <div className="relative">
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={weatherParams[key as keyof typeof weatherParams]}
                onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{min}</span>
                <span className="font-medium text-blue-600">
                  {weatherParams[key as keyof typeof weatherParams]}
                </span>
                <span>{max}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}