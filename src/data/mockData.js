export const mockFactories = [
  {
    id: 1,
    name: "Timarpur Okhla Waste Management Co.",
    lat: 28.5630,
    lng: 77.2880,
    status: "critical", aqi: 342,
    emissions: { sox: "12 tons/yr", nox: "220 tons/yr" },
    parentCompany: "Jindal Saw Ltd.", lastInfraction: "2026-02-15"
  },
  {
    id: 2,
    name: "East Delhi Waste Processing Co.",
    lat: 28.6240,
    lng: 77.3270,
    status: "warning", aqi: 215,
    emissions: { sox: "45 tons/yr", nox: "180 tons/yr" },
    parentCompany: "IL&FS Environmental Services", lastInfraction: "2025-09-12"
  },
  {
    id: 3,
    name: "NTPC National Capital Power Station",
    lat: 28.5990,
    lng: 77.6070,
    status: "critical", aqi: 405, 
    emissions: { pm25: "500 tons/yr", sox: "1200 tons/yr" },
    parentCompany: "National Thermal Power Corp.", lastInfraction: "2024-08-30"
  },
  {
    id: 4,
    name: "Pragati Power Station (CCGT)",
    lat: 28.6186,
    lng: 77.2483,
    status: "warning", aqi: 220,
    emissions: { nox: "85 tons/yr", co: "320 tons/yr" },
    parentCompany: "Pragati Power Corp. Ltd.", lastInfraction: "2026-03-10"
  },
  {
    id: 5,
    name: "Rithala Effluent Treatment Plant",
    lat: 28.7214,
    lng: 77.1065,
    status: "compliant", aqi: 140,
    emissions: { voc: "5 tons/yr", pm10: "15 tons/yr" },
    parentCompany: "Delhi Jal Board", lastInfraction: "2022-11-22"
  },
  {
    id: 6,
    name: "Delhi MSW Solutions Ltd.",
    lat: 28.8020,
    lng: 77.0600,
    status: "warning", aqi: 210,
    emissions: { dioxins: "0.1 tons/yr", pm25: "11.5 tons/yr" },
    parentCompany: "Ramky Enviro Engineers", lastInfraction: "2023-01-14"
  },
  {
    id: 7,
    name: "Narela Industrial Complex",
    lat: 28.8427,
    lng: 77.0913,
    status: "critical", aqi: 310,
    emissions: { pm10: "245 tons/yr", voc: "60 tons/yr" },
    parentCompany: "DSIIDC", lastInfraction: "2025-12-05"
  },
  {
    id: 8,
    name: "Mayapuri Heavy Industrial Area",
    lat: 28.6277,
    lng: 77.1275,
    status: "warning", aqi: 195,
    emissions: { heavy_metals: "5 tons/yr", pm25: "85 tons/yr" },
    parentCompany: "Various SMEs", lastInfraction: "2026-01-20"
  },
  {
    id: 9,
    name: "Faridabad Sec 58 Industrial",
    lat: 28.3840,
    lng: 77.3110,
    status: "critical", aqi: 285,
    emissions: { nox: "310 tons/yr", sox: "150 tons/yr" },
    parentCompany: "HSIDC", lastInfraction: "2025-10-11"
  },
  {
    id: 10,
    name: "Sahibabad Industrial Area",
    lat: 28.6650,
    lng: 77.3480,
    status: "critical", aqi: 340,
    emissions: { pm25: "400 tons/yr", co: "800 tons/yr" },
    parentCompany: "UPSIDC", lastInfraction: "2026-02-28"
  },
  {
    id: 11,
    name: "Udyog Vihar Gurugram",
    lat: 28.4900,
    lng: 77.0850,
    status: "warning", aqi: 175,
    emissions: { voc: "120 tons/yr", pm10: "90 tons/yr" },
    parentCompany: "HSIIDC", lastInfraction: "2024-05-18"
  },
  {
    id: 12,
    name: "Noida Phase 2 Industrial",
    lat: 28.5410,
    lng: 77.4000,
    status: "warning", aqi: 220,
    emissions: { pm10: "180 tons/yr", nox: "95 tons/yr" },
    parentCompany: "NOIDA Authority", lastInfraction: "2025-08-04"
  },
  {
    id: 13,
    name: "Wazirpur Stainless Steel Hub",
    lat: 28.6946,
    lng: 77.1643,
    status: "critical", aqi: 360,
    emissions: { acid_fumes: "45 tons/yr", pm25: "210 tons/yr" },
    parentCompany: "Wazirpur Ind. Assoc.", lastInfraction: "2026-03-01"
  },
  {
    id: 14,
    name: "Anand Parbat Industrial Area",
    lat: 28.6560,
    lng: 77.1810,
    status: "critical", aqi: 315,
    emissions: { voc: "90 tons/yr", pm10: "175 tons/yr" },
    parentCompany: "Delhi Gov", lastInfraction: "2025-11-15"
  },
  {
    id: 15,
    name: "Naraina Industrial Area",
    lat: 28.6250,
    lng: 77.1400,
    status: "warning", aqi: 190,
    emissions: { pm25: "65 tons/yr", nox: "40 tons/yr" },
    parentCompany: "Naraina Ind. Assoc.", lastInfraction: "2024-12-10"
  },
  {
    id: 16,
    name: "Manesar IMT Auto Hub",
    lat: 28.3610,
    lng: 76.9380,
    status: "critical", aqi: 310,
    emissions: { voc: "125 tons/yr", pm10: "300 tons/yr" },
    parentCompany: "HSIIDC", lastInfraction: "2025-06-18"
  },
  {
    id: 17,
    name: "Sonipat Rai Industrial",
    lat: 28.9480,
    lng: 77.0850,
    status: "critical", aqi: 345,
    emissions: { pm25: "280 tons/yr", sox: "95 tons/yr" },
    parentCompany: "HSIIDC", lastInfraction: "2026-01-11"
  },
  {
    id: 18,
    name: "Panipat Refining & Chem",
    lat: 29.4180,
    lng: 76.9240,
    status: "critical", aqi: 395,
    emissions: { sox: "2100 tons/yr", voc: "800 tons/yr" },
    parentCompany: "Indian Oil Corp.", lastInfraction: "2025-11-20"
  },
  {
    id: 19,
    name: "Loni Heavy Manufacturing",
    lat: 28.7560,
    lng: 77.2910,
    status: "warning", aqi: 240,
    emissions: { pm10: "150 tons/yr", pb: "3.5 tons/yr" },
    parentCompany: "Loni Ind. Assoc.", lastInfraction: "2024-03-12"
  },
  {
    id: 20,
    name: "Meerut Partapur Complex",
    lat: 28.9660,
    lng: 77.6740,
    status: "warning", aqi: 185,
    emissions: { nox: "90 tons/yr", pm25: "110 tons/yr" },
    parentCompany: "UPSIDC", lastInfraction: "2025-02-14"
  },
  {
    id: 21,
    name: "Greater Noida Ecotech",
    lat: 28.4720,
    lng: 77.4980,
    status: "compliant", aqi: 130,
    emissions: { voc: "25 tons/yr", pm10: "60 tons/yr" },
    parentCompany: "GNIDA", lastInfraction: "2020-09-08"
  },
  {
    id: 22,
    name: "Dharuhera Heavy Mfg",
    lat: 28.2040,
    lng: 76.8040,
    status: "critical", aqi: 315,
    emissions: { pm25: "320 tons/yr", so2: "140 tons/yr" },
    parentCompany: "HSIIDC", lastInfraction: "2025-12-01"
  },
  {
    id: 23,
    name: "Bawal Automotive Zone",
    lat: 28.0830,
    lng: 76.5840,
    status: "warning", aqi: 190,
    emissions: { voc: "190 tons/yr", pm10: "120 tons/yr" },
    parentCompany: "HSIIDC", lastInfraction: "2024-08-16"
  },
  {
    id: 24,
    name: "Hapur Chemical Synthetics",
    lat: 28.7290,
    lng: 77.7730,
    status: "critical", aqi: 360,
    emissions: { acid_fumes: "80 tons/yr", voc: "240 tons/yr" },
    parentCompany: "UPSIDC", lastInfraction: "2026-03-22"
  },
  {
    id: 25,
    name: "Okhla Phase 2 Dyes & Plating",
    lat: 28.5300,
    lng: 77.2750,
    status: "critical", aqi: 335,
    emissions: { heavy_metals: "18 tons/yr", pm25: "140 tons/yr" },
    parentCompany: "Okhla Ind. Estate", lastInfraction: "2026-02-05"
  }
];

export const mockReports = [
  {
    id: 101,
    date: "2026-03-28",
    location: "Near Apex Chemical Processing",
    description: "Thick black smoke observed coming from the secondary vent at 4 PM.",
    status: "investigating",
    upvotes: 24
  },
  {
    id: 102,
    date: "2026-03-25",
    location: "Westside power grid",
    description: "Strong sulfur smell reported in residential area downwind from the plant.",
    status: "verified",
    upvotes: 89
  }
];
