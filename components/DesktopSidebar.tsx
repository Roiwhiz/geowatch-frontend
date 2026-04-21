"use client";

import SessionSidebar from "./SessionSidebar";
import { useUIstore } from "@/lib/stores/uiStore";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useDirection } from "@/hooks/useDirection";

export function DesktopSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIstore();
  const { isRTL } = useDirection();

  return (
    <aside
      className={cn(
        "hidden md:flex relative h-full flex-col bg-background border-r transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64",
        isRTL && "border-l border-r-0",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={cn(
          "absolute top-3 h-7 w-7 rounded-full border bg-background shadow-sm",
          isRTL ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
        )}
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </Button>

      <div className="flex-1 overflow-hidden min-h-0">
        <SessionSidebar collapsed={sidebarCollapsed} />
      </div>
    </aside>
  );
}
