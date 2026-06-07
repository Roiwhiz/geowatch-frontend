"use client";

import { useEffect } from "react";
import { identificationService } from "@/lib/services/identification";
import { useUIstore } from "@/lib/stores/uiStore";

export function UserInitializer() {
  const { userId, setUserId } = useUIstore();

  useEffect(() => {
    if (!userId) {
      const storedId = identificationService.getStoredUserId();
      if (storedId) {
        setUserId(storedId);
      }
    }
  }, [userId, setUserId]);

  return null;
}
