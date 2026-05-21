import { useEffect } from 'react';

/**
 * Custom hook for keyboard navigation
 * @param {Function} onLeft - Callback for left arrow key
 * @param {Function} onRight - Callback for right arrow key
 * @param {boolean} enabled - Whether keyboard navigation is enabled
 */
export const useKeyboardNavigation = (onLeft, onRight, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onLeft?.();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onRight?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onLeft, onRight, enabled]);
};

export default useKeyboardNavigation;
