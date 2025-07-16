import React from 'react';
import { BookOpen, Users, Calendar, Award } from 'lucide-react';

export default function ResearchInfo() {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Research Overview</h2>
      </div>

      <div className="space-y-6">
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Weather-Based Medication Demand Forecasting
          </h3>
          <p className="text-gray-600 mb-4">
            Our AI model leverages machine learning algorithms to predict medication demand based on weather patterns. 
            By analyzing historical data correlations between meteorological conditions and pharmaceutical consumption, 
            we provide accurate forecasts to optimize healthcare supply chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Research Team</h4>
                <p className="text-sm text-gray-600">
                  Collaborative effort between meteorologists, data scientists, and healthcare professionals
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Study Period</h4>
                <p className="text-sm text-gray-600">
                  5-year longitudinal study (2019-2024) analyzing over 2.3 million data points
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Model Performance</h4>
                <p className="text-sm text-gray-600">
                  87.3% accuracy with R² = 0.91 across all medication categories
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h4 className="font-medium text-gray-900">Methodology</h4>
                <p className="text-sm text-gray-600">
                  Random Forest and Neural Network ensemble with weather parameter correlation analysis
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Key Weather Parameters</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="text-blue-700">• Temperature variations</div>
            <div className="text-blue-700">• Humidity levels</div>
            <div className="text-blue-700">• Atmospheric pressure</div>
            <div className="text-blue-700">• Wind patterns</div>
            <div className="text-blue-700">• Precipitation data</div>
            <div className="text-blue-700">• Visibility conditions</div>
          </div>
        </div>
      </div>
    </div>
  );
}