import { useEffect, useState } from 'react';

export const useResponsiveness = (mobileBreakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      const wasMobile = isMobile;
      const newIsMobile = window.innerWidth < mobileBreakpoint;

      setIsMobile(newIsMobile);

      return { wasMobile, isMobile: newIsMobile };
    };

    const result = checkIfMobile();

    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [isMobile, mobileBreakpoint]);

  return { isMobile };
};
