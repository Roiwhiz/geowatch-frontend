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
      className={`flex bg-background ${isRTL ? "flex-row-reverse" : ""}`}
      style={{ height: "100dvh" }}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <MobileSidebar />
      <DesktopSidebar />

      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ minHeight: 0 }}
      >
        <Header />
        <main className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
