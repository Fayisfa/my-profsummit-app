import { useEffect, type RefObject } from 'react';

/**
 * A custom hook that triggers a callback when a click is detected outside of the referenced element.
 * @param ref - A React ref object attached to the element to monitor.
 * @param handler - The function to call when an outside click is detected.
 */
export const useClickOutside = <T extends HTMLElement>(
  ref: RefObject<T | null>, 
  handler: () => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
