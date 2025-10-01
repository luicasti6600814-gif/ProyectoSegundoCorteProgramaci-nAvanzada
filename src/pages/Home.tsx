import React from 'react';
import { Link } from 'react-router-dom';
import { FormState, ImageRecognitionResponse } from '../types';
import ImageUploadForm from '../components/forms/ImageUploadForm';
import RecognitionResult from '../components/common/RecognitionResult';

interface HomePageProps {
  formState: FormState;
  recognitionResult: ImageRecognitionResponse | null;
  onImageChange: (file: File) => void;
  onInvertChange: (invert: string) => void;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  error: string | null;
  originalImageInfo?: { width: number; height: number } | null;
}

const HomePage: React.FC<HomePageProps> = ({
  formState,
  recognitionResult,
  onImageChange,
  onInvertChange,
  onSubmit,
  isLoading,
  error,
  originalImageInfo
}) => {
  return (
    <div className="min-h-screen py-8 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-2xl mx-auto px-4 space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Reconocimiento de Dígitos
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sube una imagen de un dígito manuscrito para reconocerlo
            </p>
          </div>
        </div>

        {/* Formulario de subida de imagen */}
        <div className="bg-white rounded-lg shadow-md">
          <ImageUploadForm
            onSubmit={onSubmit}
            isLoading={isLoading}
            error={error}
            formState={formState}
            onImageChange={onImageChange}
            onInvertChange={onInvertChange}
            originalImageInfo={originalImageInfo}
          />
        </div>

        {/* Resultados */}
        <div className="text-center">
          <RecognitionResult 
            result={recognitionResult} 
            isLoading={isLoading} 
          />
        </div>

        {/* Información de Procesamiento Automático */}
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">
            Procesamiento automático
          </h3>
          <p className="text-gray-600">
            Las imágenes se redimensionan automáticamente a 28x28 píxeles para optimizar el reconocimiento.
          </p>
        </div>

        {/* Grid Inferior - Estado y Acciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Estado del Sistema */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 text-lg text-center">
              Estado del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Imagen:</span>
                <span className={`font-semibold ${
                  formState.image ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {formState.image ? 'Lista' : 'Esperando'}
                </span>
              </div>
              
              {originalImageInfo && formState.image && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-gray-600">Dimensiones:</span>
                  <span className="font-semibold text-blue-600 text-sm">
                    {originalImageInfo.width}x{originalImageInfo.height}px
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Procesando:</span>
                <span className={`font-semibold ${
                  !isLoading ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {isLoading ? 'En progreso' : 'Listo'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Resultado:</span>
                <span className={`font-semibold ${
                  recognitionResult ? 'text-green-500' : 'text-gray-400'
                }`}>
                  {recognitionResult ? 'Disponible' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-bold text-gray-800 mb-4 text-lg text-center">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Link 
                to="/history" 
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-semibold hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
              >
                <span>📊</span>
                <span>Ver Historial</span>
              </Link>
              
              {recognitionResult && (
                <button
                  onClick={() => {
                    onImageChange(null as any);
                  }}
                  className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-semibold hover:bg-orange-600 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <span>🔄</span>
                  <span>Nuevo Análisis</span>
                </button>
              )}

              <button
                onClick={() => {
                  onImageChange(null as any);
                }}
                className="w-full border-2 border-gray-300 text-gray-600 py-3 px-4 rounded-md font-semibold hover:border-gray-400 hover:bg-gray-50 transition duration-200 flex items-center justify-center space-x-2"
              >
                <span></span>
                <span>Limpiar Todo</span>
              </button>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-xs text-center font-medium">
                Límites de imagen:
              </p>
              <p className="text-blue-600 text-xs text-center">
                Mín: 10x10px • Máx: 100x100px
              </p>
            </div>
          </div>
        </div>

        {/* Guía de Uso */}
        <div className="bg-white border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-4 text-lg text-center">
            Guía de Uso
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>Imagen de 10x10 a 100x100 píxeles</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>Se redimensiona automáticamente a 28x28px</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>Dígito único (0-9)</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>Negro sobre blanco</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>O blanco sobre negro</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <span className="text-green-500">•</span>
                  <span>Centrado y sin ruido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
            <p className="text-gray-600 text-sm">
              Sistema de IA con procesamiento automático de imágenes
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Redimensionado inteligente a 28x28 píxeles
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomePage;