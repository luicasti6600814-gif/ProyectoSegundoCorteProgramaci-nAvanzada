import React from 'react';
import { RecognitionResultProps } from '../../types';

const RecognitionResult: React.FC<RecognitionResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" style={{ maxWidth: '350px', margin: '0 auto' }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Procesando Imagen...</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 text-sm">Analizando dígito manuscrito...</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-600 h-1.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" style={{ maxWidth: '350px', margin: '0 auto' }}>
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Resultado del Reconocimiento</h3>
        <div className="text-center py-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm">Sube o dibuja un dígito para ver el resultado aquí</p>
        </div>
      </div>
    );
  }

  const accuracyPercentage = (result.accuracy * 100);
  const accuracyColor = accuracyPercentage >= 80 
    ? 'text-green-600' 
    : accuracyPercentage >= 60 
    ? 'text-yellow-600' 
    : 'text-red-600';

  const accuracyBarColor = accuracyPercentage >= 80 
    ? 'bg-green-600' 
    : accuracyPercentage >= 60 
    ? 'bg-yellow-600' 
    : 'bg-red-600';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6" style={{ maxWidth: '350px', margin: '0 auto' }}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Resultado del Reconocimiento
      </h3>
      
      {/* Dígito reconocido - Reducido */}
      <div className="text-center mb-4">
        <div className="inline-block bg-blue-50 rounded-full p-3 border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600">{result.prediction}</div>
        </div>
        <p className="text-xs text-gray-600 mt-1">Dígito Reconocido</p>
      </div>

      {/* Barra de precisión - Reducida */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-gray-700">Precisión:</span>
          <span className={`text-base font-bold ${accuracyColor}`}>
            {accuracyPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${accuracyBarColor} transition-all duration-500`}
            style={{ width: `${accuracyPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Información adicional - Compacta */}
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-base font-bold text-purple-600">{result.process_time}s</div>
          <div className="text-xs text-gray-600">Tiempo</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <div className={`text-base font-bold ${accuracyColor}`}>
            {accuracyPercentage >= 70 ? 'Alta' : accuracyPercentage >= 50 ? 'Media' : 'Baja'}
          </div>
          <div className="text-xs text-gray-600">Confianza</div>
        </div>
      </div>

      {/* Mensaje basado en la precisión - Reducido */}
      {accuracyPercentage >= 80 && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-xs text-center">
             El reconocimiento tiene alta confianza
          </p>
        </div>
      )}
      
      {accuracyPercentage < 80 && accuracyPercentage >= 60 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-700 text-xs text-center">
             La confianza es moderada
          </p>
        </div>
      )}
      
      {accuracyPercentage < 60 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-xs text-center">
             La confianza es baja
          </p>
        </div>
      )}

      {/* Información adicional compacta */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default RecognitionResult;