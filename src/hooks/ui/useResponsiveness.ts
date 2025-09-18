'use client';

import { BREAKPOINTS, UI_CONSTANTS } from '@/constants';
import { useEffect, useState } from 'react';

export const useResponsiveness = (mobileBreakpoint = BREAKPOINTS.MOBILE) => {
  const [isMobile, setIsMobile] = useState(false);

  const checkIfMobile = () => {
    const newIsMobile = window.innerWidth < mobileBreakpoint;
    setIsMobile(newIsMobile);
  };

  let timeoutId: NodeJS.Timeout;
  const debouncedCheckIfMobile = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(checkIfMobile, UI_CONSTANTS.DEBOUNCE_DELAY);
  };

  useEffect(() => {
    checkIfMobile();

    window.addEventListener('resize', debouncedCheckIfMobile);

    return () => {
      window.removeEventListener('resize', debouncedCheckIfMobile);
    };
  }, [checkIfMobile, debouncedCheckIfMobile]);

  return { isMobile };
};
