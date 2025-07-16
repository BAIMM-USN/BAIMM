export const medications = [
  {
    id: "aspirin",
    name: "Aspirin",
    category: "Pain Relief",
    description:
      "Over-the-counter pain reliever commonly used for headaches and minor pain. Demand increases during weather changes.",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    category: "Anti-inflammatory",
    description:
      "Nonsteroidal anti-inflammatory drug (NSAID) for pain and fever reduction. Higher demand during cold weather.",
  },
  {
    id: "antihistamine",
    name: "Antihistamine",
    category: "Allergy",
    description:
      "Allergy medication for seasonal allergies. Demand peaks during high pollen seasons and humidity changes.",
  },
  {
    id: "decongestant",
    name: "Decongestant",
    category: "Respiratory",
    description:
      "Nasal decongestant for cold and flu symptoms. Demand increases during temperature drops and high humidity.",
  },
  {
    id: "insulin",
    name: "Insulin",
    category: "Diabetes",
    description:
      "Diabetes medication for blood sugar control. Demand affected by temperature extremes and pressure changes.",
  },
  {
    id: "bronchodilator",
    name: "Bronchodilator",
    category: "Respiratory",
    description:
      "Asthma medication for airway opening. Demand increases during low visibility and high pollution days.",
  },
];

export interface DataPoint {
  x: number;
  y: number;
  label: string;
  weekNumber?: number;
  monthNumber?: number;
  date: string;
  confidence?: number;
}

export interface MedicationData {
  upcoming: DataPoint[];
  previous: DataPoint[];
}

// Weekly prediction data
export const weeklyMedicationDataSets: Record<string, MedicationData> = {
  'Paracetamol 500mg': {
    upcoming: [
      { x: 1, y: 1250, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 87 },
    ],
    previous: [
      { x: -7, y: 890, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 1020, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 980, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 1350, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 1180, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 1050, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 1120, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Ibuprofen 400mg': {
    upcoming: [
      { x: 1, y: 780, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 92 },
    ],
    previous: [
      { x: -7, y: 650, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 720, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 680, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 850, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 790, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 740, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 760, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Amoxicillin 250mg': {
    upcoming: [
      { x: 1, y: 420, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 83 },
    ],
    previous: [
      { x: -7, y: 380, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 450, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 520, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 480, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 390, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 410, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 440, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Omeprazole 20mg': {
    upcoming: [
      { x: 1, y: 320, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 89 },
    ],
    previous: [
      { x: -7, y: 290, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 310, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 305, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 280, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 330, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 315, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 325, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Simvastatin 20mg': {
    upcoming: [
      { x: 1, y: 180, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 91 },
    ],
    previous: [
      { x: -7, y: 165, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 175, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 170, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 160, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 185, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 178, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 182, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Metformin 500mg': {
    upcoming: [
      { x: 1, y: 540, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 88 },
    ],
    previous: [
      { x: -7, y: 520, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 535, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 525, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 510, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 545, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 530, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 538, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Aspirin 100mg': {
    upcoming: [
      { x: 1, y: 680, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 85 },
    ],
    previous: [
      { x: -7, y: 620, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 650, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 640, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 720, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 670, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 660, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 675, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  },
  'Lisinopril 10mg': {
    upcoming: [
      { x: 1, y: 240, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 90 },
    ],
    previous: [
      { x: -7, y: 225, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
      { x: -6, y: 235, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
      { x: -5, y: 230, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
      { x: -4, y: 220, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
      { x: -3, y: 245, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
      { x: -2, y: 238, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
      { x: -1, y: 242, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
    ]
  }
};

// Monthly prediction data
export const monthlyMedicationDataSets: Record<string, MedicationData> = {
  'Paracetamol 500mg': {
    upcoming: [
      { x: 1, y: 5200, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 84 },
    ],
    previous: [
      { x: -6, y: 4800, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 4950, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 5100, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 5400, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 5800, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 4900, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Ibuprofen 400mg': {
    upcoming: [
      { x: 1, y: 3200, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 89 },
    ],
    previous: [
      { x: -6, y: 2800, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 2950, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 3100, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 3400, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 3600, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 3050, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Amoxicillin 250mg': {
    upcoming: [
      { x: 1, y: 1800, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 81 },
    ],
    previous: [
      { x: -6, y: 1600, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 1750, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 1900, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 2100, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 2200, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 1650, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Omeprazole 20mg': {
    upcoming: [
      { x: 1, y: 1350, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 86 },
    ],
    previous: [
      { x: -6, y: 1200, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 1250, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 1300, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 1400, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 1320, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 1380, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Simvastatin 20mg': {
    upcoming: [
      { x: 1, y: 750, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 88 },
    ],
    previous: [
      { x: -6, y: 680, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 720, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 700, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 760, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 740, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 730, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Metformin 500mg': {
    upcoming: [
      { x: 1, y: 2200, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 85 },
    ],
    previous: [
      { x: -6, y: 2100, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 2150, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 2080, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 2250, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 2180, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 2220, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Aspirin 100mg': {
    upcoming: [
      { x: 1, y: 2800, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 82 },
    ],
    previous: [
      { x: -6, y: 2600, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 2700, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 2750, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 2900, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 2850, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 2720, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  },
  'Lisinopril 10mg': {
    upcoming: [
      { x: 1, y: 980, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 87 },
    ],
    previous: [
      { x: -6, y: 920, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
      { x: -5, y: 950, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
      { x: -4, y: 940, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
      { x: -3, y: 1000, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
      { x: -2, y: 970, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
      { x: -1, y: 990, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
    ]
  }
};

export const availableMedications = [
  'Paracetamol 500mg',
  'Ibuprofen 400mg',
  'Amoxicillin 250mg',
  'Omeprazole 20mg',
  'Simvastatin 20mg',
  'Metformin 500mg',
  'Aspirin 100mg',
  'Lisinopril 10mg'
];

export const availableMunicipalities = [
  'Oslo',
  'Bergen',
  'Trondheim',
  'Stavanger',
  'Drammen',
  'Fredrikstad',
  'Kristiansand',
  'Tromsø'
];

export const availableHistoryPeriods = [
  'Last 4 weeks',
  'Last 8 weeks',
  'Last 12 weeks',
  'Last 6 months',
  'Last year'
];

// Function to get data based on prediction type
export const getMedicationData = (medication: string, predictionType: 'weekly' | 'monthly'): MedicationData => {
  const dataSet = predictionType === 'weekly' ? weeklyMedicationDataSets : monthlyMedicationDataSets;
  return dataSet[medication] || dataSet[availableMedications[0]];
};

// Default fallback data
export const defaultWeeklyData: MedicationData = {
  upcoming: [
    { x: 1, y: 1250, label: 'Next Week', weekNumber: 4, date: 'Jan 22-28, 2025', confidence: 87 },
  ],
  previous: [
    { x: -7, y: 890, label: 'Week -7', weekNumber: 49, date: 'Dec 2-8, 2024' },
    { x: -6, y: 1020, label: 'Week -6', weekNumber: 50, date: 'Dec 9-15, 2024' },
    { x: -5, y: 980, label: 'Week -5', weekNumber: 51, date: 'Dec 16-22, 2024' },
    { x: -4, y: 1350, label: 'Week -4', weekNumber: 52, date: 'Dec 23-29, 2024' },
    { x: -3, y: 1180, label: 'Week -3', weekNumber: 1, date: 'Dec 30-Jan 5, 2025' },
    { x: -2, y: 1050, label: 'Week -2', weekNumber: 2, date: 'Jan 6-12, 2025' },
    { x: -1, y: 1120, label: 'Week -1', weekNumber: 3, date: 'Jan 13-19, 2025' },
  ]
};

export const defaultMonthlyData: MedicationData = {
  upcoming: [
    { x: 1, y: 5200, label: 'Next Month', monthNumber: 2, date: 'February 2025', confidence: 84 },
  ],
  previous: [
    { x: -6, y: 4800, label: 'Month -6', monthNumber: 8, date: 'August 2024' },
    { x: -5, y: 4950, label: 'Month -5', monthNumber: 9, date: 'September 2024' },
    { x: -4, y: 5100, label: 'Month -4', monthNumber: 10, date: 'October 2024' },
    { x: -3, y: 5400, label: 'Month -3', monthNumber: 11, date: 'November 2024' },
    { x: -2, y: 5800, label: 'Month -2', monthNumber: 12, date: 'December 2024' },
    { x: -1, y: 4900, label: 'Month -1', monthNumber: 1, date: 'January 2025' },
  ]
};

// Legacy function for backward compatibility
export const generatePredictionData = (
  medicationId: string,
  weatherParams: {
    temperature: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    precipitation: number;
    visibility: number;
  }
) => {
  return getMedicationData(availableMedications[0], 'weekly');
};