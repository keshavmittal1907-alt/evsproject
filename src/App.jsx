import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import ReportPage from './pages/ReportPage';
import CalculatorPage from './pages/CalculatorPage';
import DecoderPage from './pages/DecoderPage';
import HealthPage from './pages/HealthPage';
import ActionPage from './pages/ActionPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="map" element={<MapPage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/action" element={<ActionPage />} />
          <Route path="/decoder" element={<DecoderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
