/**
 * BARREL EXPORT - SERVICES
 * 
 * Este arquivo facilita as importações centralizando todos os services.
 */

export * from './alertService';
export * from './authService';
export * from './chatService';
export * from './emergencyService';
export * from './tourService';

/**
 * COMO USAR:
 * 
 * Antes:
 * import { authService } from '@/services/authService';
 * import { tourService } from '@/services/tourService';
 * 
 * Depois:
 * import { authService, tourService } from '@/services';
 */
