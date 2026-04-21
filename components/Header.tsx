"use client";

import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import { useUIstore } from "@/lib/stores/uiStore";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useDirection } from "@/hooks/useDirection";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { sidebarOpen, setSidebarOpen } = useUIstore();
  const { isRTL } = useDirection();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header
      className="h-16 border-b bg-background flex items-center px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between w-full">
        {/* LEFT SIDE - Menu Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* CENTER - Language Switcher */}
        <div className="flex-1 flex justify-center">
          <LanguageSwitcher />
        </div>

        {/* RIGHT SIDE - Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
    </header>
  );
}
