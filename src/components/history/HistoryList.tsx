import React, { useState } from 'react';
import { HistoryListProps, RequestLog } from '../../types';

const HistoryList: React.FC<HistoryListProps> = ({ logs, onClearHistory }) => {
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const toggleExpand = (logId: string) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header compacto */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Detalles del Historial</h3>
        <span className="text-xs text-gray-600">
          Mostrando {logs.length} petición{logs.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {logs.map((log, index) => (
          <div 
            key={log.id} 
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            {/* Header del log - COMPACTADO */}
            <div 
              className="p-3 cursor-pointer" // p reducido
              onClick={() => toggleExpand(log.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                      log.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {log.status === 'success' ? ' Éxito' : ' Error'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.timestamp.toLocaleDateString()} {log.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mt-1 text-sm">
                    {log.request.imageName}
                  </h4>
                  
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                    <span>Invert: {log.request.invert}</span>
                    <span>•</span>
                    <span>Tamaño: {formatFileSize(log.request.imageSize)}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {log.response && (
                    <div className="text-right">
                      <div className="text-base font-bold text-blue-600">
                        {log.response.prediction}
                      </div>
                      <div className="text-xs text-gray-500">Dígito</div>
                    </div>
                  )}
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      expandedLogId === log.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Contenido expandible */}
            {expandedLogId === log.id && (
              <div className="px-3 pb-3 border-t border-gray-100 pt-3">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Información del resultado */}
                  <div>
                    {log.response ? (
                      <div className="space-y-3">
                        <h5 className="font-bold text-gray-800 text-base">Resultado del Reconocimiento</h5>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center">
                            <div className="text-xl font-bold text-blue-600">{log.response.prediction}</div>
                            <div className="text-xs text-gray-600">Dígito Reconocido</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">
                              {(log.response.accuracy * 100).toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-600">Precisión</div>
                          </div>
                          <div className="text-center">
                            <div className="text-base font-bold text-purple-600">{log.response.process_time}s</div>
                            <div className="text-xs text-gray-600">Tiempo</div>
                          </div>
                        </div>
                        
                        {/* Barra de precisión */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700">Nivel de Confianza:</span>
                            <span className={`text-xs font-bold ${
                              log.response.accuracy >= 0.8 ? 'text-green-600' : 
                              log.response.accuracy >= 0.6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {(log.response.accuracy * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                log.response.accuracy >= 0.8 ? 'bg-green-600' : 
                                log.response.accuracy >= 0.6 ? 'bg-yellow-600' : 'bg-red-600'
                              } transition-all duration-500`}
                              style={{ width: `${log.response.accuracy * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : log.error && (
                      <div className="bg-red-50 border border-red-200 rounded p-2">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-red-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span className="text-red-700 font-medium text-sm">Error: {log.error}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-gray-500">
                      ID de petición: {log.id}
                    </div>
                  </div>

                  {/* Sección de imagen - 110x110 */}
                  <div className="flex flex-col items-center justify-center">
                    <h5 className="font-bold text-gray-800 text-base mb-2">Imagen del Dígito</h5>
                    <div 
                      className="bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden"
                      style={{ 
                        width: '110px', 
                        height: '110px',
                        minWidth: '110px',
                        minHeight: '110px'
                      }}
                    >
                      {log.status === 'success' ? (
                        <div className="text-center p-2">
                          <div 
                            className="bg-white border border-gray-400 rounded-lg flex items-center justify-center mx-auto font-bold text-4xl text-gray-700"
                            style={{ 
                              width: '70px', 
                              height: '70px',
                              fontSize: '2.5rem'
                            }}
                          >
                            {log.response?.prediction}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">Dígito: {log.response?.prediction}</p>
                        </div>
                      ) : (
                        <div className="text-center p-2">
                          <div className="text-red-400 mb-1">
                            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <p className="text-xs text-gray-600">Error en procesamiento</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Información adicional de la imagen - COMPACTADA */}
                    <div className="mt-2 text-center">
                      <div className="text-xs text-gray-600 bg-gray-50 rounded p-1">
                        <p className="truncate"><strong>Archivo:</strong> {log.request.imageName}</p>
                        <p><strong>Tamaño:</strong> {formatFileSize(log.request.imageSize)}</p>
                        <p><strong>Modo:</strong> {log.request.invert === 'true' ? 'Blanco/Negro' : 'Negro/Blanco'}</p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Navegación entre registros - MUY COMPACTA */}
                <div className="mt-3 flex justify-between items-center">
                  {/* Botón registro anterior */}
                  {index > 0 && (
                    <button
                      onClick={() => {
                        const prevLog = logs[index - 1];
                        setExpandedLogId(prevLog.id);
                        // Scroll suave al registro
                        document.getElementById(prevLog.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition duration-200 flex items-center"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                  )}
                  
                  {/* Espacio flexible */}
                  <div className="flex-1"></div>

                  {/* Botón siguiente registro */}
                  {index < logs.length - 1 && (
                    <button
                      onClick={() => {
                        const nextLog = logs[index + 1];
                        setExpandedLogId(nextLog.id);
                        // Scroll suave al registro
                        document.getElementById(nextLog.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 transition duration-200 flex items-center"
                    >
                      Siguiente
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer con acciones - COMPACTO */}
      {logs.length > 0 && (
        <div className="flex justify-center pt-3">
          <button
            onClick={onClearHistory}
            className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition duration-200 flex items-center text-xs"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Limpiar Todo el Historial
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryList;