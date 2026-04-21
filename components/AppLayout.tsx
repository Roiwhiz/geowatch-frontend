"use client";

import { ReactNode } from "react";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileSidebar } from "./MobileSidebar";
import Header from "./Header";
import { useDirection } from "@/hooks/useDirection";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { isRTL } = useDirection();

  return (
    <div
      className={`h-screen flex bg-background ${isRTL ? "flex-row-reverse" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* MOBILE SIDEBAR */}
      <MobileSidebar />

      {/* DESKTOP SIDEBAR */}
      <DesktopSidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden min-h-0">{children}</main>
      </div>
    </div>
  );
}
