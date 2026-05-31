"use client";

import { useServerStatus } from "@/hooks/useServerStatus";
import { Loader2 } from "lucide-react";

export function ServerWakeUp({ children }: { children: React.ReactNode }) {
  const { status, elapsed } = useServerStatus();

  if (status === "ready" || status === "checking") {
    return <>{children}</>;
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-3 max-w-sm px-4">
          <h2 className="text-lg font-semibold text-foreground">
            Unable to reach the server
          </h2>
          <p className="text-sm text-muted-foreground">
            Please check your connection and refresh the page.
          </p>
        </div>
      </div>
    );
  }

  // status === "waking"
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 max-w-sm px-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        <div className="space-y-1.5">
          <h2 className="text-lg font-semibold text-foreground">
            Waking up the server
          </h2>
          <p className="text-sm text-muted-foreground">
            GeoWatch runs on a free tier that sleeps when inactive. This usually
            takes 20–40 seconds.
          </p>
        </div>
        {elapsed > 5 && (
          <p className="text-xs text-muted-foreground">
            {elapsed} seconds elapsed — almost there...
          </p>
        )}
      </div>
    </div>
  );
}
