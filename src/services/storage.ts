import { RequestLog } from '../types';

const STORAGE_KEY = 'digit-recognition-logs';
const MAX_LOGS = 50; // Límite de logs almacenados

export class StorageService {
  static saveLog(log: RequestLog): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      const logs = this.getLogs();
      
      // Evitar duplicados por ID
      const filteredLogs = logs.filter(existingLog => existingLog.id !== log.id);
      
      // Agregar nuevo log al inicio
      const updatedLogs = [log, ...filteredLogs];
      
      // Mantener solo los últimos MAX_LOGS logs
      if (updatedLogs.length > MAX_LOGS) {
        updatedLogs.splice(MAX_LOGS);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs));
      
      // Disparar evento personalizado para sincronización entre componentes
      window.dispatchEvent(new CustomEvent('localStorageUpdate', {
        detail: { key: STORAGE_KEY, logs: updatedLogs }
      }));
    } catch (error) {
      console.error('Error saving log to localStorage:', error);
      throw new Error('No se pudo guardar el registro en el historial');
    }
  }

  static getLogs(): RequestLog[] {
    try {
      if (typeof window === 'undefined') {
        return [];
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const logs = JSON.parse(stored);
      
      // Convertir string dates back to Date objects y validar estructura
      return logs.map((log: any) => ({
        id: log.id || '',
        timestamp: new Date(log.timestamp),
        request: {
          invert: log.request?.invert || 'false',
          imageName: log.request?.imageName || 'unknown',
          imageSize: log.request?.imageSize || 0,
        },
        response: log.response ? {
          process_time: log.response.process_time || '0',
          prediction: log.response.prediction || 0,
          accuracy: log.response.accuracy || 0,
        } : undefined,
        error: log.error,
        status: log.status || 'error',
      })).filter((log: RequestLog) => this.isValidLog(log));
    } catch (error) {
      console.error('Error reading logs from localStorage:', error);
      return [];
    }
  }

  private static isValidLog(log: any): log is RequestLog {
    return (
      log &&
      typeof log.id === 'string' &&
      log.timestamp instanceof Date &&
      log.request &&
      typeof log.request.invert === 'string' &&
      typeof log.request.imageName === 'string' &&
      typeof log.request.imageSize === 'number' &&
      (log.response === undefined || (
        typeof log.response.process_time === 'string' &&
        typeof log.response.prediction === 'number' &&
        typeof log.response.accuracy === 'number'
      )) &&
      (log.error === undefined || typeof log.error === 'string') &&
      (log.status === 'success' || log.status === 'error')
    );
  }

  static clearLogs(): void {
    try {
      if (typeof window === 'undefined') {
        return;
      }

      localStorage.removeItem(STORAGE_KEY);
      
      // Disparar evento para sincronización
      window.dispatchEvent(new CustomEvent('localStorageUpdate', {
        detail: { key: STORAGE_KEY, logs: [] }
      }));
    } catch (error) {
      console.error('Error clearing logs from localStorage:', error);
      throw new Error('No se pudo limpiar el historial');
    }
  }

  static getLogCount(): number {
    return this.getLogs().length;
  }

  static getStorageSize(): string {
    try {
      if (typeof window === 'undefined') {
        return '0 KB';
      }

      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return '0 KB';
      
      const bytes = new Blob([data]).size;
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    } catch (error) {
      console.error('Error calculating storage size:', error);
      return '0 KB';
    }
  }

  static exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(logs, null, 2);
  }

  static importLogs(jsonString: string): boolean {
    try {
      const logs = JSON.parse(jsonString);
      if (!Array.isArray(logs)) {
        throw new Error('Formato de datos inválido');
      }

      // Validar cada log antes de importar
      const validLogs = logs.filter(log => this.isValidLog(log));
      
      if (validLogs.length === 0) {
        throw new Error('No se encontraron registros válidos para importar');
      }

      // Limpiar logs existentes y guardar los nuevos
      this.clearLogs();
      validLogs.forEach(log => this.saveLog(log));
      
      return true;
    } catch (error) {
      console.error('Error importing logs:', error);
      return false;
    }
  }
}