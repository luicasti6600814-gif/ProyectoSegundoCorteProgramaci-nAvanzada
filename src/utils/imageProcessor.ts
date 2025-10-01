export class ImageProcessor {
  static async resizeImage(file: File, targetWidth: number = 28, targetHeight: number = 28): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('No se pudo obtener el contexto del canvas'));
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        // Configurar canvas con el tamaño objetivo
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        
        // Configurar calidad de redimensionado
        ctx.imageSmoothingEnabled = false;
        ctx.imageSmoothingQuality = 'high';
        
        // Redimensionar la imagen
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        
        // Convertir a blob y luego a File
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: 'image/png',
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            reject(new Error('No se pudo redimensionar la imagen'));
          }
        }, 'image/png', 0.95);
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Error al cargar la imagen para redimensionar'));
      };
      
      img.src = objectUrl;
    });
  }

  static async processImageForAPI(file: File, invert: string): Promise<FormData> {
    try {
      // Redimensionar imagen a 28x28 píxeles
      const resizedFile = await this.resizeImage(file, 28, 28);
      
      // Crear FormData
      const formData = new FormData();
      formData.append('image', resizedFile);
      formData.append('invert', invert);
      
      return formData;
    } catch (error) {
      throw new Error(`Error procesando la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          width: img.width,
          height: img.height
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('No se pudieron obtener las dimensiones de la imagen'));
      };
      
      img.src = objectUrl;
    });
  }
}