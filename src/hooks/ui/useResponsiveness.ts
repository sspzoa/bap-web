import { BREAKPOINTS, UI_CONSTANTS } from '@/constants';
import { useCallback, useEffect, useState } from 'react';

export const useResponsiveness = (mobileBreakpoint = BREAKPOINTS.MOBILE) => {
  const [isMobile, setIsMobile] = useState(false);

  const checkIfMobile = useCallback(() => {
    const newIsMobile = window.innerWidth < mobileBreakpoint;
    setIsMobile(newIsMobile);
  }, [mobileBreakpoint]);

  useEffect(() => {
    checkIfMobile();

    let timeoutId: NodeJS.Timeout;
    const debouncedCheckIfMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIfMobile, UI_CONSTANTS.DEBOUNCE_DELAY);
    };

    window.addEventListener('resize', debouncedCheckIfMobile);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheckIfMobile);
    };
  }, [checkIfMobile]);

  return { isMobile };
};
