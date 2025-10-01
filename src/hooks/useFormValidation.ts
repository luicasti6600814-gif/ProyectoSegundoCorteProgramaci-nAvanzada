import { useCallback } from 'react';
import { FormValidationError } from '../types';

export const useFormValidation = () => {
  const validateImage = useCallback((file: File): string | null => {
    // Validar que sea un archivo
    if (!file) {
      return FormValidationError.NO_IMAGE;
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return FormValidationError.INVALID_IMAGE_FORMAT;
    }

    // Validar tamaño de archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'La imagen es demasiado grande. Máximo 5MB permitido.';
    }

    // Validar tamaño mínimo (al menos 1KB)
    if (file.size < 1024) {
      return 'La imagen es demasiado pequeña.';
    }

    return null;
  }, []);

  const validateImageDimensions = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        const { width, height } = img;
        
        // Validar dimensiones mínimas
        if (width < 10 || height < 10) {
          resolve('La imagen es demasiado pequeña. Mínimo 10x10 píxeles requeridos.');
          return;
        }

        // Validar dimensiones máximas (ahora 100x100 en lugar de 1000x1000)
        if (width > 100 || height > 100) {
          resolve('La imagen es demasiado grande. Máximo 100x100 píxeles permitidos.');
          return;
        }

        // Mensaje informativo si no es 28x28
        if (width !== 28 || height !== 28) {
          resolve(`La imagen es de ${width}x${height} píxeles. Se redimensionará automáticamente a 28x28 píxeles.`);
        } else {
          resolve(null);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('No se pudo cargar la imagen para validar dimensiones.');
      };
      
      img.src = objectUrl;
    });
  }, []);

  const validateInvert = useCallback((invert: string): string | null => {
    if (invert !== 'true' && invert !== 'false') {
      return FormValidationError.INVALID_INVERT_VALUE;
    }
    return null;
  }, []);

  const validateForm = useCallback(async (image: File | null, invert: string): Promise<{ isValid: boolean; errors: string[] }> => {
    const errors: string[] = [];

    // Validar que hay imagen
    if (!image) {
      errors.push(FormValidationError.NO_IMAGE);
      return { isValid: false, errors };
    }

    // Validar invert
    const invertError = validateInvert(invert);
    if (invertError) {
      errors.push(invertError);
    }

    // Validar imagen básica
    const imageError = validateImage(image);
    if (imageError) {
      errors.push(imageError);
    }

    // Si hay errores básicos, no validar dimensiones
    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Validar dimensiones (async) - solo si no hay errores previos
    try {
      const dimensionError = await validateImageDimensions(image);
      if (dimensionError) {
        // Ahora solo mostramos advertencia, no error
        if (!dimensionError.includes('demasiado grande') && !dimensionError.includes('demasiado pequeña')) {
          // Es solo una advertencia informativa, no un error que impida el envío
          console.log('Advertencia de dimensiones:', dimensionError);
        } else {
          errors.push(dimensionError);
        }
      }
    } catch (error) {
      errors.push('Error al validar las dimensiones de la imagen.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, [validateImage, validateInvert, validateImageDimensions]);

  return {
    validateForm,
    validateImage,
    validateImageDimensions,
    validateInvert,
  };
};