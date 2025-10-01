// Interface para la respuesta de la API
export interface ImageRecognitionResponse {
  process_time: string;
  prediction: number;
  accuracy: number;
}

// Interface para el log de peticiones
export interface RequestLog {
  id: string;
  timestamp: Date;
  request: {
    invert: string; // "true" | "false"
    imageName: string;
    imageSize: number;
  };
  response?: ImageRecognitionResponse;
  error?: string;
  status: 'success' | 'error';
}

// Interface para el estado del formulario
export interface FormState {
  image: File | null;
  invert: string; // "true" | "false"
  isLoading: boolean;
  error: string | null;
  previewUrl: string | null;
}

// Interface para los props del componente de navegación
export interface NavigationProps {
  currentPath: string;
}

// Interface para los props del componente de formulario
export interface ImageUploadFormProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  error: string | null;
}

// Interface para los props del componente de resultado
export interface RecognitionResultProps {
  result: ImageRecognitionResponse | null;
  isLoading: boolean;
}

// Interface para los props del componente de historial
export interface HistoryListProps {
  logs: RequestLog[];
  onClearHistory: () => void;
}

// Interface para el estado global de la aplicación
export interface AppGlobalState {
  formState: FormState;
  recognitionResult: ImageRecognitionResponse | null;
  requestLogs: RequestLog[];
}

// Tipo para las opciones de invert
export type InvertOption = 'true' | 'false';

// Tipo para las rutas de la aplicación
export type AppRoute = '/' | '/history';

// Enums para mejor tipado
export enum FormValidationError {
  NO_IMAGE = 'Por favor, selecciona una imagen',
  INVALID_IMAGE_SIZE = 'La imagen debe ser de 28x28 píxeles',
  INVALID_IMAGE_FORMAT = 'Formato de imagen no válido',
  INVALID_INVERT_VALUE = 'Valor de invert no válido',
}

export enum ApiError {
  NETWORK_ERROR = 'Error de conexión con el servidor',
  SERVER_ERROR = 'Error interno del servidor',
  INVALID_RESPONSE = 'Respuesta inválida del servidor',
}

// Props extendidos para HomePage
export interface HomePageProps {
  formState: FormState;
  recognitionResult: ImageRecognitionResponse | null;
  onImageChange: (file: File) => void;
  onInvertChange: (invert: string) => void;
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  error: string | null;
  originalImageInfo?: { width: number; height: number } | null;
}

// Props extendidos para ImageUploadForm - CORREGIDO
export interface ExtendedImageUploadFormProps extends ImageUploadFormProps {
  formState: FormState;
  onImageChange: (file: File) => void;
  onInvertChange: (invert: string) => void;
  originalImageInfo?: { width: number; height: number } | null;
}

// Props para el componente InvertToggle
export interface InvertToggleProps {
  value: string;
  onChange: (value: InvertOption) => void;
}

// Interface para los props de HistoryPage
export interface HistoryPageProps {
  requestLogs: RequestLog[];
  onClearHistory: () => void;
}

export interface UseImageRecognitionReturn {
  formState: FormState;
  recognitionResult: ImageRecognitionResponse | null;
  requestLogs: RequestLog[];
  handleImageChange: (file: File | null) => void;
  handleInvertChange: (invert: string) => void;
  handleSubmit: (formData: FormData) => void;
  clearHistory: () => void;
}

// Return type del hook useFormValidation
export interface UseFormValidationReturn {
  validateForm: (image: File | null, invert: string) => Promise<{ isValid: boolean; errors: string[] }>;
  validateImage: (file: File) => string | null;
  validateImageDimensions: (file: File) => Promise<string | null>;
  validateInvert: (invert: string) => string | null;
}

export interface UseNavigationReturn {
  currentPath: AppRoute;
  goTo: (route: AppRoute) => void;
  goToHome: () => void;
  goToHistory: () => void;
  goBack: () => void;
  isActiveRoute: (route: AppRoute) => boolean;
}

// Props para el componente de página 404
export interface NotFoundPageProps {
  onGoHome: () => void;
}

export interface UseHistoryReturn {
  logs: RequestLog[];
  isLoading: boolean;
  addLog: (log: RequestLog) => void;
  clearHistory: () => void;
  getStats: () => {
    total: number;
    successful: number;
    failed: number;
    successRate: number;
    storageSize: string;
  };
  exportHistory: () => string;
  importHistory: (jsonString: string) => boolean;
  getLogsByDate: (startDate: Date, endDate: Date) => RequestLog[];
  searchLogs: (query: string) => RequestLog[];
}

// Tipo para filtros de fecha
export type DateFilter = 'all' | 'today' | 'week' | 'month';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ImageDimensions {
  width: number;
  height: number;
}

// Return type extendido del hook useImageRecognition
export interface UseImageRecognitionReturn {
  formState: FormState;
  recognitionResult: ImageRecognitionResponse | null;
  requestLogs: RequestLog[];
  handleImageChange: (file: File | null) => void;
  handleInvertChange: (invert: string) => void;
  handleSubmit: (formData: FormData) => void;
  clearHistory: () => void;
  originalImageInfo: ImageDimensions | null;
}