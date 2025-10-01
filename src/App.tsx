import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useImageRecognition } from './hooks/useImageRecognition';
import Navigation from './components/common/Navigation';
import HomePage from './pages/Home';
import HistoryPage from './pages/History';

// Componente para usar el hook dentro del Router
const AppWithRouter: React.FC = () => {
  const {
    formState,
    recognitionResult,
    requestLogs,
    handleImageChange,
    handleInvertChange,
    handleSubmit,
    clearHistory,
  } = useImageRecognition();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <div className="relative z-10">
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <Navigation currentPath="/" />
                <HomePage
                  formState={formState}
                  recognitionResult={recognitionResult}
                  onImageChange={handleImageChange}
                  onInvertChange={handleInvertChange}
                  onSubmit={handleSubmit}
                  isLoading={formState.isLoading}
                  error={formState.error}
                />
              </>
            } 
          />
          <Route 
            path="/history" 
            element={
              <>
                <Navigation currentPath="/history" />
                <HistoryPage
                  requestLogs={requestLogs}
                  onClearHistory={clearHistory}
                />
              </>
            } 
          />
          {/* Ruta de fallback para 404 */}
          <Route 
            path="*" 
            element={
              <>
                <Navigation currentPath="/404" />
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
                    <div className="text-4xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">404</h1>
                    <p className="text-gray-600 mb-6">Página no encontrada</p>
                    <a 
                      href="/" 
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 inline-block"
                    >
                      Volver al Inicio
                    </a>
                  </div>
                </div>
              </>
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

export default App;