import { useState, useCallback, useEffect } from 'react';
import { FormState, ImageRecognitionResponse, RequestLog } from '../types';
import { ApiService } from '../services/api';
import { useHistory } from './useHistory';
import { useFormValidation } from './useFormValidation';
import { ImageProcessor } from '../utils/imageProcessor';

export const useImageRecognition = () => {
  const [formState, setFormState] = useState<FormState>({
    image: null,
    invert: 'false',
    isLoading: false,
    error: null,
    previewUrl: null,
  });

  const [recognitionResult, setRecognitionResult] = useState<ImageRecognitionResponse | null>(null);
  const [originalImageInfo, setOriginalImageInfo] = useState<{ width: number; height: number } | null>(null);
  
  // Hooks personalizados
  const { logs: requestLogs, addLog, clearHistory } = useHistory();
  const { validateForm } = useFormValidation();

  const handleImageChange = useCallback(async (file: File | null) => {
    if (file) {
      // Obtener dimensiones originales de la imagen
      try {
        const dimensions = await ImageProcessor.getImageDimensions(file);
        setOriginalImageInfo(dimensions);
      } catch (error) {
        console.warn('No se pudieron obtener las dimensiones de la imagen:', error);
        setOriginalImageInfo(null);
      }

      // Validar imagen básica antes de crear preview
      const validation = await validateForm(file, formState.invert);
      if (!validation.isValid && validation.errors.length > 0) {
        setFormState(prev => ({
          ...prev,
          error: validation.errors[0],
        }));
        return;
      }

      // Crear URL para preview
      const previewUrl = URL.createObjectURL(file);
      
      setFormState(prev => ({
        ...prev,
        image: file,
        previewUrl,
        error: null,
      }));
    } else {
      // Limpiar preview URL si existe
      if (formState.previewUrl) {
        URL.revokeObjectURL(formState.previewUrl);
      }
      
      setOriginalImageInfo(null);
      
      setFormState(prev => ({
        ...prev,
        image: null,
        previewUrl: null,
        error: null,
      }));
      setRecognitionResult(null);
    }
  }, [formState.previewUrl, formState.invert, validateForm]);

  const handleInvertChange = useCallback((invert: string) => {
    setFormState(prev => ({
      ...prev,
      invert,
      error: null,
    }));
  }, []);

  const handleSubmit = useCallback(async (formData: FormData) => {
    if (!formState.image) {
      setFormState(prev => ({
        ...prev,
        error: 'Por favor, selecciona una imagen',
      }));
      return;
    }

    // Validación completa antes de enviar
    const validation = await validateForm(formState.image, formState.invert);
    if (!validation.isValid) {
      setFormState(prev => ({
        ...prev,
        error: validation.errors[0],
      }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }));
    setRecognitionResult(null);

    // Crear log de request
    const requestLog: RequestLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      request: {
        invert: formState.invert,
        imageName: formState.image.name,
        imageSize: formState.image.size,
      },
      status: 'success',
    };

    try {
      // PROCESAR Y REDIMENSIONAR IMAGEN ANTES DE ENVIAR
      const processedFormData = await ImageProcessor.processImageForAPI(
        formState.image, 
        formState.invert
      );

      const response = await ApiService.recognizeImage(processedFormData);
      
      setRecognitionResult(response);
      
      // Actualizar log con respuesta exitosa
      const successLog: RequestLog = {
        ...requestLog,
        response: response,
        status: 'success',
      };
      
      addLog(successLog);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      setFormState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      
      // Actualizar log con error
      const errorLog: RequestLog = {
        ...requestLog,
        error: errorMessage,
        status: 'error',
      };
      
      addLog(errorLog);
      
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  }, [formState.image, formState.invert, validateForm, addLog]);

  // Cleanup preview URL al desmontar
  useEffect(() => {
    return () => {
      if (formState.previewUrl) {
        URL.revokeObjectURL(formState.previewUrl);
      }
    };
  }, [formState.previewUrl]);

  return {
    formState,
    recognitionResult,
    requestLogs,
    handleImageChange,
    handleInvertChange,
    handleSubmit,
    clearHistory,
    originalImageInfo,
  };
};