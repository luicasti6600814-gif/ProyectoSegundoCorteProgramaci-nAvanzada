import React, { useRef } from 'react';
import { ImageUploadFormProps, FormState } from '../../types';
import InvertToggle from './InvertToggle';

interface ExtendedImageUploadFormProps extends ImageUploadFormProps {
  formState: FormState;
  onImageChange: (file: File) => void;
  onInvertChange: (invert: string) => void;
  originalImageInfo?: { width: number; height: number } | null;
}

const ImageUploadForm: React.FC<ExtendedImageUploadFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error, 
  formState, 
  onImageChange, 
  onInvertChange,
  originalImageInfo 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.image) {
      return;
    }

    const formData = new FormData();
    formData.append('image', formState.image);
    formData.append('invert', formState.invert);

    onSubmit(formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        return;
      }
      onImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Subir Imagen de Dígito
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Área de carga de imagen */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 mx-auto ${
            formState.image 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          }`}
          style={{ maxWidth: '400px' }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          {formState.image ? (
            <div className="space-y-3">
              <div className="text-green-500">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium text-gray-700">Imagen seleccionada</p>
              <p className="text-gray-600 text-sm">{formState.image.name}</p>
              <p className="text-xs text-gray-500">
                Tamaño: {(formState.image.size / 1024).toFixed(2)} KB
              </p>
              
              {/* Información de dimensiones y redimensionado */}
              {originalImageInfo && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-700 text-xs text-center">
                    📏 Imagen: {originalImageInfo.width}x{originalImageInfo.height}px 
                    {originalImageInfo.width !== 28 || originalImageInfo.height !== 28 ? 
                      ' → Se redimensionará a 28x28px' : 
                      ' (Tamaño óptimo)'
                    }
                  </p>
                </div>
              )}
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onImageChange(null as any);
                }}
                className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium transition duration-200"
              >
                Eliminar imagen
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-gray-400">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="font-medium text-gray-700">
                Haz clic o arrastra una imagen aquí
              </p>
              <p className="text-gray-500 text-sm">
                La imagen será redimensionada automáticamente a 28x28 píxeles
              </p>
              <div className="text-xs text-gray-400 mt-2">
                Formatos: JPG, PNG, GIF • Máximo 100x100px
              </div>
            </div>
          )}
        </div>

        {/* Preview de imagen */}
        {formState.previewUrl && (
          <div className="flex justify-center">
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-white shadow-sm" style={{ maxWidth: '400px' }}>
              <p className="text-sm text-gray-600 mb-2 text-center font-medium">Vista previa:</p>
              <div className="flex justify-center">
                <img 
                  src={formState.previewUrl} 
                  alt="Preview del dígito" 
                  className="border rounded-lg shadow-sm"
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>
              
              {/* Información adicional en el preview */}
              {originalImageInfo && (
                <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-xs text-center">
                    📐 Original: {originalImageInfo.width}x{originalImageInfo.height}px
                  </p>
                  <p className="text-gray-500 text-xs text-center">
                    🎯 Enviado: 28x28px
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Selector de invert */}
        <div className="bg-gray-50 rounded-lg p-4">
          <InvertToggle 
            value={formState.invert} 
            onChange={onInvertChange} 
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isLoading || !formState.image}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300 flex items-center justify-center space-x-3"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Procesando imagen...</span>
            </>
          ) : (
            <>
              <span>🔍</span>
              <span>Reconocer Dígito</span>
            </>
          )}
        </button>
      </form>
      
      {/* Mensaje de error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <span className="text-red-700 font-medium">Error:</span>
              <span className="text-red-600 ml-1">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Información sobre redimensionado */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <span className="text-blue-500 text-sm">💡</span>
          <div>
            <p className="text-blue-700 text-sm font-medium">Procesamiento automático:</p>
            <p className="text-blue-600 text-sm">
              Las imágenes se redimensionan automáticamente a 28x28 píxeles para optimizar el reconocimiento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadForm;