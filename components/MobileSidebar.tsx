"use client";

import SessionSidebar from "./SessionSidebar";
import { useUIstore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useDirection } from "@/hooks/useDirection";

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIstore();
  const { isRTL } = useDirection();

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 w-64 bg-background border-r z-50 md:hidden",
          "transform transition-transform duration-300",
          isRTL
            ? sidebarOpen
              ? "translate-x-0"
              : "translate-x-full"
            : sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full",
        )}
        style={{ [isRTL ? "right" : "left"]: 0 }}
      >
        {sidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "absolute top-3 h-8 w-8 rounded-full border bg-background shadow-sm",
              isRTL ? "left-3" : "right-3",
            )}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="h-full overflow-hidden min-h-0">
          <SessionSidebar collapsed={false} />
        </div>
      </div>
    </>
  );
}
