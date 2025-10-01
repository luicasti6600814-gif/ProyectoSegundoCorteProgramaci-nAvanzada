import { ImageRecognitionResponse, ApiError } from '../types';

const API_ENDPOINT = 'http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict';
const REQUEST_TIMEOUT = 30000; // 30 segundos

export class ApiService {
  static async recognizeImage(formData: FormData): Promise<ImageRecognitionResponse> {
    // Inicializar timeoutId como null
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      // Crear promise con timeout
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutId = setTimeout(() => {
          reject(new Error('La petición tardó demasiado tiempo. Inténtalo de nuevo.'));
        }, REQUEST_TIMEOUT);
      });

      // Promise de la petición fetch
      const fetchPromise = fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
        // No establecer Content-Type header para FormData
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Limpiar timeout solo si existe
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        if (response.status === 413) {
          throw new Error('La imagen es demasiado grande para el servidor.');
        } else if (response.status === 415) {
          throw new Error('Formato de imagen no soportado por el servidor.');
        } else if (response.status >= 500) {
          throw new Error(ApiError.SERVER_ERROR);
        } else {
          throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();

      // Validar la estructura de la respuesta
      if (!this.isValidResponse(data)) {
        console.error('Invalid API response structure:', data);
        throw new Error(ApiError.INVALID_RESPONSE);
      }

      return data;
    } catch (error) {
      // Limpiar timeout en caso de error solo si existe
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error(ApiError.NETWORK_ERROR);
        }
        if (error.message.includes('timeout') || error.message.includes('demasiado tiempo')) {
          throw new Error('La petición tardó demasiado tiempo. Inténtalo de nuevo.');
        }
        throw error;
      }
      throw new Error(ApiError.SERVER_ERROR);
    }
  }

  private static isValidResponse(data: any): data is ImageRecognitionResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      typeof data.process_time === 'string' &&
      typeof data.prediction === 'number' &&
      typeof data.accuracy === 'number' &&
      data.prediction >= 0 &&
      data.prediction <= 9 &&
      data.accuracy >= 0 &&
      data.accuracy <= 1
    );
  }

  // Método para verificar la conectividad con la API
  static async checkHealth(): Promise<boolean> {
    try {
      // Usar AbortController en lugar de signal.timeout para mejor compatibilidad
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(API_ENDPOINT, {
        method: 'HEAD',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }
}