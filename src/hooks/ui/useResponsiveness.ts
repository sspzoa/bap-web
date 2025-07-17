import { BREAKPOINTS, UI_CONSTANTS } from '@/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useResponsiveness = (mobileBreakpoint = BREAKPOINTS.MOBILE) => {
  const [isMobile, setIsMobile] = useState(false);

  const checkIfMobile = useCallback(() => {
    const newIsMobile = window.innerWidth < mobileBreakpoint;
    setIsMobile(newIsMobile);
  }, [mobileBreakpoint]);

  const debouncedCheckIfMobile = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIfMobile, UI_CONSTANTS.DEBOUNCE_DELAY);
    };
  }, [checkIfMobile]);

  useEffect(() => {
    checkIfMobile();

    window.addEventListener('resize', debouncedCheckIfMobile);

    return () => {
      window.removeEventListener('resize', debouncedCheckIfMobile);
    };
  }, [checkIfMobile, debouncedCheckIfMobile]);

  return { isMobile };
};
