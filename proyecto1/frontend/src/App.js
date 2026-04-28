import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ContenidoPage from './pages/ContenidoPage';
import CodigoPage from './pages/CodigoPage';
import GaleriaPage from './pages/GaleriaPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contenido" element={<ContenidoPage />} />
            <Route path="/codigo" element={<CodigoPage />} />
            <Route path="/galeria" element={<GaleriaPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
