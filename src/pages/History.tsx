import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HistoryPageProps } from '../types';
import HistoryList from '../components/history/HistoryList';
import { StorageService } from '../services/storage';

const HistoryPage: React.FC<HistoryPageProps> = ({ requestLogs, onClearHistory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filtrar logs basado en búsqueda y fecha
  const filteredLogs = useMemo(() => {
    let filtered = requestLogs;

    // Filtro por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.request.imageName.toLowerCase().includes(query) ||
        (log.response && log.response.prediction.toString().includes(searchQuery)) ||
        (log.error && log.error.toLowerCase().includes(query))
      );
    }

    // Filtro por fecha
    if (dateFilter !== 'all') {
      const now = new Date();
      const startDate = new Date();

      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate);
    }

    return filtered;
  }, [requestLogs, searchQuery, dateFilter]);

  const stats = useMemo(() => {
    const successful = requestLogs.filter(log => log.status === 'success').length;
    const failed = requestLogs.filter(log => log.status === 'error').length;
    
    return {
      total: requestLogs.length,
      successful,
      failed,
      successRate: requestLogs.length > 0 ? (successful / requestLogs.length) * 100 : 0,
      storageSize: StorageService.getStorageSize(),
    };
  }, [requestLogs]);

  const handleExport = () => {
    const data = StorageService.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digit-recognition-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const success = StorageService.importLogs(content);
        
        if (success) {
          alert('Historial importado exitosamente');
          // Recargar la página para reflejar los cambios
          window.location.reload();
        } else {
          alert('Error al importar el historial. Verifica el formato del archivo.');
        }
      } catch (error) {
        alert('Error al leer el archivo.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6"> {/* py reducido */}
      <div className="container mx-auto px-3"> {/* px reducido */}
        <div className="max-w-6xl mx-auto space-y-4"> {/* space-y reducido */}
          
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2"> {/* text-3xl y mb reducido */}
              📊 Historial de Peticiones
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm"> {/* text-sm */}
              Revisa todas las peticiones de reconocimiento realizadas y su estado.
            </p>
          </div>

          {/* Estadísticas rápidas - COMPACTADAS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3"> {/* gap reducido */}
            <div className="bg-white p-3 rounded-lg shadow-md text-center"> {/* p reducido */}
              <div className="text-xl font-bold text-blue-600">{stats.total}</div> {/* text-xl */}
              <div className="text-xs text-gray-600">Total</div> {/* text-xs */}
            </div>
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <div className="text-xl font-bold text-green-600">{stats.successful}</div>
              <div className="text-xs text-gray-600">Exitosas</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <div className="text-xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-xs text-gray-600">Fallidas</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <div className="text-xl font-bold text-purple-600">
                {stats.successRate.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Tasa de Éxito</div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-md text-center">
              <div className="text-md font-bold text-orange-600">{stats.storageSize}</div> {/* text-md */}
              <div className="text-xs text-gray-600">Almacenamiento</div>
            </div>
          </div>

          {/* Filtros y Búsqueda - COMPACTADO */}
          <div className="bg-white p-3 rounded-lg shadow-md"> {/* p reducido */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3"> {/* gap reducido */}
              {/* Búsqueda */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1"> {/* text-xs y mb reducido */}
                  🔍 Buscar
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, dígito o error..."
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" /* padding y texto reducidos */
                />
              </div>

              {/* Filtro por fecha */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                   Filtro por Fecha
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" /* padding y texto reducidos */
                >
                  <option value="all">Todos</option>
                  <option value="today">Hoy</option>
                  <option value="week">Última semana</option>
                  <option value="month">Último mes</option>
                </select>
              </div>

              {/* Contador de resultados */}
              <div className="flex items-end">
                <div className="text-xs text-gray-600"> {/* text-xs */}
                  Mostrando {filteredLogs.length} de {requestLogs.length} registros
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción - 60% MÁS PEQUEÑOS */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2"> {/* gap muy reducido */}
            
            {/* Botón Volver - 60% más pequeño */}
            <Link 
              to="/" 
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition duration-200 flex items-center text-xs" /* padding y texto muy reducidos */
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* icono más pequeño */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </Link>
            
            {/* Botones de acción - 60% más pequeños */}
            <div className="flex flex-wrap gap-1"> {/* gap muy reducido */}
              
              {/* Botón Exportar - 60% más pequeño */}
              <button
                onClick={handleExport}
                disabled={requestLogs.length === 0}
                className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 disabled:bg-green-300 transition duration-200 flex items-center text-xs" /* padding muy reducido */
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar
              </button>

              {/* Botón Importar - 60% más pequeño */}
              <label className="bg-purple-600 text-white px-2 py-1 rounded-md hover:bg-purple-700 transition duration-200 flex items-center text-xs cursor-pointer">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Importar
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Botón Limpiar - 60% más pequeño */}
              {requestLogs.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition duration-200 flex items-center text-xs"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Lista de historial */}
          <HistoryList logs={filteredLogs} onClearHistory={onClearHistory} />

          {/* Mensaje cuando no hay historial - COMPACTADO */}
          {requestLogs.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center"> {/* p reducido */}
              <div className="text-gray-400 mb-3"> {/* mb reducido */}
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"> {/* iconos más pequeños */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2"> {/* text-lg */}
                No hay historial aún
              </h3>
              <p className="text-gray-600 mb-3 text-sm"> {/* text-sm y mb reducido */}
                Realiza tu primera petición de reconocimiento para ver el historial aquí.
              </p>
              {/* Botón más pequeño en el mensaje */}
              <Link 
                to="/" 
                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition duration-200 inline-block text-xs" /* botón muy pequeño */
              >
                Comenzar Reconocimiento
              </Link>
            </div>
          )}

          {/* Mensaje cuando no hay resultados de búsqueda - COMPACTADO */}
          {requestLogs.length > 0 && filteredLogs.length === 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-yellow-400 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600 text-sm">
                No hay registros que coincidan con tu búsqueda "{searchQuery}".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;