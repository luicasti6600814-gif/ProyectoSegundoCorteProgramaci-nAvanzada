Reconocimiento de Dígitos Manuscritos

Una aplicación web moderna construida con React y TypeScript para el reconocimiento de dígitos manuscritos utilizando inteligencia artificial.

🚀 Características

 Funcionalidades Principales
- **Reconocimiento de Dígitos**: Sube imágenes de dígitos manuscritos (0-9) para ser reconocidos
- **Procesamiento Automático**: Redimensionamiento automático a 28x28 píxeles
- **Interfaz Intuitiva**: Diseño moderno con Tailwind CSS
- **Historial Completo**: Almacenamiento local de todas las peticiones
- **Múltiples Formatos**: Soporte para JPG, PNG, GIF, WebP
- **Esquema de Colores**: Opción para invertir colores (negro/blanco o blanco/negro)

Gestión de Historial
- **Almacenamiento Local**: Persistencia en localStorage
- **Filtros y Búsqueda**: Por fecha, nombre de archivo, dígito o error
- **Estadísticas**: Métricas de éxito, fallos y uso de almacenamiento
- **Exportar/Importar**: Backup y restauración del historial
- **Límite Inteligente**: Máximo 50 registros almacenados

Características Técnicas
- **TypeScript**: Tipado estático para mayor robustez
- **React Hooks**: Estado y efectos modernos
- **Responsive Design**: Compatible con móviles y desktop
- **Validación Avanzada**: De imágenes y formularios
- **Manejo de Errores**: Comunicación clara de problemas
- **Optimización**: Lazy loading y procesamiento eficiente

Estructura del Proyecto

```
src/
├── components/
│   ├── common/
│   │   ├── Navigation.tsx
│   │   └── RecognitionResult.tsx
│   ├── forms/
│   │   ├── ImageUploadForm.tsx
│   │   └── InvertToggle.tsx
│   └── history/
│       └── HistoryList.tsx
├── hooks/
│   ├── useImageRecognition.ts
│   ├── useHistory.ts
│   ├── useFormValidation.ts
│   ├── useLocalStorage.ts
│   └── useNavigation.ts
├── pages/
│   ├── Home.tsx
│   └── History.tsx
├── services/
│   ├── api.ts
│   └── storage.ts
├── types/
│   └── index.ts
├── utils/
│   └── imageProcessor.ts
├── App.tsx
├── index.tsx
└── index.css
```

Requisitos de Imágenes

- **Formato**: JPG, PNG, GIF, WebP
- **Tamaño de Archivo**: Máximo 5MB
- **Dimensiones**: 10x10px a 100x100px
- **Procesamiento**: Se redimensiona automáticamente a 28x28px
- **Recomendaciones**: Dígito centrado, buen contraste, sin ruidoInstalación y Uso

Prerrequisitos
- Node.js 16+ 
- npm o yarn

Instalación
```bash
Clonar el repositorio
git clone [repository-url]
cd digit-recognition-app

Instalar dependencias
npm install

Ejecutar en desarrollo
npm start

Construir para producción
npm run build
```

Variables de Entorno
La aplicación se conecta automáticamente al endpoint:
```
API_ENDPOINT = http://ec2-54-81-142-28.compute-1.amazonaws.com:8080/predict
```

Uso de la Aplicación

1. Página Principal (/)
- **Subir Imagen**: Arrastra o selecciona un archivo
- **Configurar Esquema**: Negro sobre blanco o blanco sobre negro
- **Procesar**: Enviar para reconocimiento
- **Ver Resultados**: Dígito reconocido con nivel de confianza

2. Historial (/history)
- **Revisar Peticiones**: Todas las solicitudes realizadas
- **Filtrar**: Por fecha (hoy, semana, mes) o búsqueda textual
- **Estadísticas**: Métricas de rendimiento
- **Gestionar**: Exportar, importar o limpiar historial

APIs y Servicios

ApiService
```typescript
// Reconocimiento de imagen
ApiService.recognizeImage(formData)

// Verificación de salud del servidor
ApiService.checkHealth()
```
StorageService
```typescript
// Gestión del historial
StorageService.saveLog(log)
StorageService.getLogs()
StorageService.clearLogs()
StorageService.exportLogs()
StorageService.importLogs(jsonString)
```
Hooks Personalizados

useImageRecognition
Maneja toda la lógica de reconocimiento de imágenes:
- Estado del formulario
- Procesamiento de imágenes
- Comunicación con la API
- Gestión de resultados

useHistory
Gestión completa del historial:
- Carga y sincronización
- Estadísticas
- Operaciones CRUD

useFormValidation
Validación robusta de:
- Tipos de archivo
- Dimensiones de imagen
- Tamaño de archivo
- Valores del formulario

Validaciones

Imágenes
- Formato soportado (JPG, PNG, GIF, WebP)
- Tamaño máximo 5MB
- Dimensiones entre 10x10px y 100x100px
- Archivo no corrupto

Formularios
- Imagen requerida
- Valor de invert válido ('true'/'false')
- Prevención de envíos duplicados

Responsive Design

La aplicación está optimizada para:
- **Móviles**: Navegación hamburguesa, touch-friendly
- **Tablets**: Layout adaptativo
- **Desktop**: Experiencia completa con sidebar

Manejo de Errores

Tipos de Error
- **Red**: Problemas de conectividad
- **Servidor**: Errores 5xx del API
- **Cliente**: Imágenes inválidas o muy grandes
- **Tiempo**: Timeouts de petición (30 segundos)

Mensajes al Usuario
- Claros y específicos
- Sugerencias para resolver problemas
- Feedback visual inmediato

Métricas y Rendimiento

Web Vitals
La aplicación incluye reportes de:
- **CLS** (Cumulative Layout Shift)
- **FID** (First Input Delay) 
- **FCP** (First Contentful Paint)
- **LCP** (Largest Contentful Paint)
- **TTFB** (Time to First Byte)

Optimizaciones
- **Lazy Loading**: Componentes cargados bajo demanda
- **Memoización**: Evita re-renderizados innecesarios
- **Debouncing**: Búsquedas optimizadas
- **Cleanup**: Liberación de recursos

Flujo de Datos

1. **Usuario** sube imagen → `ImageUploadForm`
2. **Validación** → `useFormValidation` 
3. **Procesamiento** → `ImageProcessor`
4. **API Call** → `ApiService.recognizeImage()`
5. **Resultado** → `RecognitionResult`
6. **Almacenamiento** → `StorageService.saveLog()`
7. **Actualización** → `useHistory` sincroniza estado

Testing

```bash
# Ejecutar tests
npm test

# Tests con cobertura
npm test -- --coverage
```

Build y Deploy

```bash
# Build de producción
npm run build

# Servir build localmente
npx serve -s build
```

Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request


Soporte

Si encuentras problemas:
1. Revisa la consola del navegador
2. Verifica que la imagen cumple los requisitos
3. Comprueba tu conexión a internet
4. Contacta al administrador del sistema

