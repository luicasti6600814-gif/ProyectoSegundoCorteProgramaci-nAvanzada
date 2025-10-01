import { useState, useEffect, useCallback } from 'react';
import { RequestLog } from '../types';
import { StorageService } from '../services/storage';

export const useHistory = () => {
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar logs iniciales
  useEffect(() => {
    const loadLogs = () => {
      setIsLoading(true);
      try {
        const storedLogs = StorageService.getLogs();
        setLogs(storedLogs);
      } catch (error) {
        console.error('Error loading logs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogs();

    // Escuchar eventos de actualización de localStorage
    const handleStorageUpdate = (event: CustomEvent) => {
      if (event.detail.key === 'digit-recognition-logs') {
        setLogs(event.detail.logs);
      }
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'digit-recognition-logs') {
        loadLogs();
      }
    };

    // Evento personalizado
    window.addEventListener('localStorageUpdate', handleStorageUpdate as EventListener);
    // Evento nativo de storage (entre pestañas)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('localStorageUpdate', handleStorageUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const addLog = useCallback((log: RequestLog) => {
    try {
      StorageService.saveLog(log);
      // El estado se actualizará automáticamente por los event listeners
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  }, []);

  const clearHistory = useCallback(() => {
    try {
      StorageService.clearLogs();
      // El estado se actualizará automáticamente por los event listeners
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error;
    }
  }, []);

  const getStats = useCallback(() => {
    const total = logs.length;
    const successful = logs.filter(log => log.status === 'success').length;
    const failed = logs.filter(log => log.status === 'error').length;
    const storageSize = StorageService.getStorageSize();

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      storageSize,
    };
  }, [logs]);

  const exportHistory = useCallback(() => {
    return StorageService.exportLogs();
  }, []);

  const importHistory = useCallback((jsonString: string) => {
    return StorageService.importLogs(jsonString);
  }, []);

  const getLogsByDate = useCallback((startDate: Date, endDate: Date) => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate >= startDate && logDate <= endDate;
    });
  }, [logs]);

  const searchLogs = useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return logs.filter(log => 
      log.request.imageName.toLowerCase().includes(lowerQuery) ||
      (log.response && log.response.prediction.toString().includes(query)) ||
      (log.error && log.error.toLowerCase().includes(lowerQuery))
    );
  }, [logs]);

  return {
    logs,
    isLoading,
    addLog,
    clearHistory,
    getStats,
    exportHistory,
    importHistory,
    getLogsByDate,
    searchLogs,
  };
};