"use client";

import { useState, useEffect } from "react";

type ServerStatus = "checking" | "waking" | "ready" | "error";

const HEALTH_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/health`;
const WAKE_THRESHOLD_MS = 3000; // If no response after 3s, show waking state

export function useServerStatus() {
  const [status, setStatus] = useState<ServerStatus>("checking");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;
    const startTime = Date.now();

    // If no response within 3 seconds, switch to "waking" state
    timer = setTimeout(() => {
      setStatus("waking");

      // Start an elapsed seconds counter so the UI can show progress
      intervalId = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }, WAKE_THRESHOLD_MS);

    const check = async () => {
      try {
        const res = await fetch(HEALTH_URL, { cache: "no-store" });
        if (res.ok) {
          clearTimeout(timer);
          clearInterval(intervalId);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch {
        clearTimeout(timer);
        clearInterval(intervalId);
        setStatus("error");
      }
    };

    check();

    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
    };
  }, []);

  return { status, elapsed };
}
