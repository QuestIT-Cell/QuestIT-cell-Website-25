/**
 * Performance monitoring utilities for Gallery
 */

export const measurePerformance = (name, callback) => {
  if (typeof window === 'undefined') return callback();
  
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  
  console.log(`[Performance] ${name}: ${(endTime - startTime).toFixed(2)}ms`);
  
  return result;
};

export const logWebVitals = (metric) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric);
  }
};

export const preloadImages = (imageUrls) => {
  if (typeof window === 'undefined') return;
  
  imageUrls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};

export const checkAnimationPerformance = () => {
  if (typeof window === 'undefined') return true;
  
  // Check if device prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Check device memory (if available)
  const deviceMemory = navigator.deviceMemory || 4; // Default to 4GB
  
  // Check connection speed (if available)
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effectiveType = connection?.effectiveType || '4g';
  
  // Determine if we should use full animations
  const shouldUseFullAnimations = 
    !prefersReducedMotion && 
    deviceMemory >= 2 && 
    (effectiveType === '4g' || effectiveType === '3g');
  
  return shouldUseFullAnimations;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
