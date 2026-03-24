"use client";

import { useEffect, useState } from "react";

export const useMealInitialization = () => {
  const [initialLoad, setInitialLoad] = useState(true);
  const [dateInitialized, setDateInitialized] = useState(false);

  useEffect(() => {
    if (!initialLoad) return;

    if (typeof window !== "undefined") {
      setDateInitialized(true);
      setInitialLoad(false);
    }
  }, [initialLoad]);

  return {
    initialLoad,
    dateInitialized,
    setDateInitialized,
  };
};
