"use client";

import { useCallback, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useTranslations } from "next-intl";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { useSessions } from "@/hooks/useSessions";
import { Session } from "@/lib/validators/schemas";
import SessionGroup from "./SessionGroup";
import { useParams } from "next/navigation";
import { useSessionMutations } from "@/hooks/useSessionMutations";
import { useDirection } from "@/hooks/useDirection";

export default function SessionSidebar({ collapsed }: { collapsed: boolean }) {
  const t = useTranslations("nav");
  const { isRTL } = useDirection();

  const params = useParams() as { locale?: string; sessionId?: string };
  const activeSessionId = params.sessionId ?? null;

  const [query, setQuery] = useState("");

  const { data: sessions = [], error, isLoading } = useSessions();
  const { createMutation, renameMutation, deleteMutation } =
    useSessionMutations();

  const handleNewSession = () => {
    createMutation.mutate();
  };

  // ✅ stable "now" (prevents hydration mismatch)
  const now = useMemo(() => new Date(), []);

  const filteredSessions = sessions.filter((s) =>
    s.title?.toLowerCase().includes(query.toLowerCase()),
  );

  const groupSessions = useCallback(
    (sessions: Session[]) => {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);

      const groups: Record<string, Session[]> = {
        today: [],
        yesterday: [],
        older: [],
      };

      sessions.forEach((s) => {
        const d = new Date(s.lastActiveAt);
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());

        if (day.getTime() === today.getTime()) {
          groups.today.push(s);
        } else if (day.getTime() === yesterday.getTime()) {
          groups.yesterday.push(s);
        } else {
          groups.older.push(s);
        }
      });

      return groups;
    },
    [now],
  );

  const groups = groupSessions(filteredSessions);

  return (
    <div
      className={`flex flex-col h-full min-h-0 transition-all duration-300 ${
        isRTL ? "text-right" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* HEADER */}
      <div className="p-3 space-y-3">
        {!collapsed && (
          <h2 className="text-lg font-bold">{t("title") || "GeoWatch"}</h2>
        )}

        <Button
          onClick={handleNewSession}
          variant="ghost"
          disabled={createMutation.isPending}
          className={`w-full h-10 gap-2 ${
            isRTL ? "flex-row-reverse justify-end" : "justify-start"
          } ${collapsed ? "w-10 h-10 p-0 mx-auto justify-center" : ""}`}
        >
          <Plus className="h-4 w-4" />
          {!collapsed && (
            <span>
              {createMutation.isPending
                ? t("create") || "Creating..."
                : t("newSession")}
            </span>
          )}
        </Button>

        {/* SEARCH */}
        <div className="relative">
          {!collapsed ? (
            <>
              <Search
                className={`absolute top-2.5 h-4 w-4 text-muted-foreground ${
                  isRTL ? "right-3" : "left-3"
                }`}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchSession")}
                className={`pl-9 ${isRTL ? "pr-9 pl-3 text-right" : ""}`}
                dir={isRTL ? "rtl" : "ltr"}
              />
            </>
          ) : (
            <Button variant="ghost" size="icon" className="w-10 h-10 mx-auto">
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* CONTENT */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-4">
          {/* Loading */}
          {isLoading && (
            <div className="text-sm text-muted-foreground">Loading...</div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 text-center">
              <p className="text-sm text-destructive">
                Failed to load sessions
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Retry
              </Button>
            </div>
          )}

          {/* Content */}
          {!isLoading && !error && (
            <>
              {!collapsed && (
                <>
                  {groups.today.length > 0 && (
                    <SessionGroup
                      label={t("today")}
                      sessions={groups.today}
                      activeSessionId={activeSessionId}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onRename={(id, title) =>
                        renameMutation.mutate({ id, title })
                      }
                    />
                  )}

                  {groups.yesterday.length > 0 && (
                    <SessionGroup
                      label={t("yesterday")}
                      sessions={groups.yesterday}
                      activeSessionId={activeSessionId}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onRename={(id, title) =>
                        renameMutation.mutate({ id, title })
                      }
                    />
                  )}

                  {groups.older.length > 0 && (
                    <SessionGroup
                      label={t("older")}
                      sessions={groups.older}
                      activeSessionId={activeSessionId}
                      onDelete={(id) => deleteMutation.mutate(id)}
                      onRename={(id, title) =>
                        renameMutation.mutate({ id, title })
                      }
                    />
                  )}

                  {filteredSessions.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">
                      {t("noSession")}
                    </div>
                  )}
                </>
              )}

              {collapsed && (
                <div className="flex items-center justify-center py-6 text-muted-foreground">
                  <span className="text-lg">⋯</span>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
