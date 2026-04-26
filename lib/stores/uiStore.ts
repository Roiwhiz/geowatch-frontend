import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showIdentificationDialog: boolean;
  setShowIdentificationDialog: (open: boolean) => void;
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useUIstore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },
      showIdentificationDialog: false,
      setShowIdentificationDialog: (open: boolean) => {
        set({ showIdentificationDialog: open });
      },
      activeSessionId: null,
      setActiveSessionId: (id: string | null) => {
        set({ activeSessionId: id });
      },
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed: boolean) => {
        set({ sidebarCollapsed: collapsed });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeSessionId: state.activeSessionId,
      }),
    },
  ),
);
