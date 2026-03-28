# EcoWatch: Delhi NCR Air Pollution Accountability Portal

An advanced, data-driven environmental intelligence platform designed to combat severe air pollution in the Delhi NCR region by increasing industrial transparency through real-time telemetry tracking.

## Features

- **Accountability Map:** A real-time geographic tracking interface monitoring the 25 worst industrial polluting zones across Delhi, Gurugram, Noida, and Faridabad. Uses live algorithmic ranking to identify active World Health Organization (WHO) and Indian NAQI compliance violators.
- **True Cost Calculator:** Dynamically plots 5-year historical pollution trends while translating real-time PM2.5 particulate mass concentrations into actual, measurable physiological and economic medical costs for local communities.
- **Data Decoder:** An AI-powered integration module designed to translate incredibly dense 40-page legal environmental compliance PDFs and corporate ESG reports into plain-English summaries, stripping out jargon to identify specific legal infractions.
- **Take Action Interface:** An automated mobilization dashboard that cross-references live satellite telemetry to find the 6 deadliest active polluting zones in real-time, instantly generating pre-filled, legally-structured compliance complaints to the Indian CPCB and Ministry of Environment.

## Tech Stack

- **Frontend:** React + Vite
- **Styling:** Custom Enterprise Slate CSS (High-Contrast Dark Theme)
- **Mapping:** React-Leaflet + Esri World Imagery Satellite Cartography
- **Telemetry:** Open-Meteo Ambient Air Quality APIs (Integrated natively with Indian NAQI interpolation models)
- **Icons:** Lucide-React

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Navigate to `http://localhost:5173` in your browser.

## Data Accuracy Notice
While the **geospatial locations, corporate entities, and live active NAQI / PM2.5 readings** are 100% accurate and pulled in real-time from actual physical APIs, the specific annual *historical emission tonnages* (e.g., SOx/NOx metrics) and *legal infraction logs* are simulated structural approximations designed strictly for architectural demonstration and UI prototyping.
