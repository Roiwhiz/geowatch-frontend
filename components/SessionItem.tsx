"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { MoreHorizontal } from "lucide-react";
import { Session } from "@/lib/validators/schemas";
import { useTranslations } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useDirection } from "@/hooks/useDirection";
import { useUIstore } from "@/lib/stores/uiStore";

interface Props {
  session: Session;
  isActive: boolean;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export default function SessionItem({
  session,
  isActive,
  onDelete,
  onRename,
}: Props) {
  const t = useTranslations("nav");
  const router = useRouter();
  const { isRTL } = useDirection();

  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title || "");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleRename = () => {
    const trimmed = title.trim();
    if (!trimmed) {
      setTitle(session.title || "");
      setIsEditing(false);
      return;
    }
    onRename(session.id, trimmed);
    setIsEditing(false);
  };
  const { setSidebarOpen } = useUIstore();

  return (
    <>
      <div
        className={`
          relative group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors
          hover:bg-muted ${isActive ? "bg-muted" : ""}
          ${isRTL ? "flex-row-reverse text-right" : ""}
        `}
        dir={isRTL ? "rtl" : "ltr"}
        onClick={() => {
          if (!isEditing) {
            router.push(`/${locale}/session/${session.id}`);
            setSidebarOpen(false);
          }
        }}
      >
        {/* Active Indicator Bar */}
        <div
          className={`absolute top-2 bottom-2 w-0.5 rounded 
            ${isRTL ? "right-0" : "left-0"} 
            ${isActive ? "bg-primary" : "bg-transparent"}`}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setTitle(session.title || "");
                }
              }}
              className="h-7 text-sm"
              dir={isRTL ? "rtl" : "ltr"}
            />
          ) : (
            <>
              <p className="text-sm font-medium truncate">{session.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(session.lastActiveAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </>
          )}
        </div>

        {/* Menu */}
        {!isEditing && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="opacity-100 md:opacity-0 md:group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align={isRTL ? "start" : "end"}>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                {t("rename") || "Rename"}
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setConfirmOpen(true);
                }}
                className="text-destructive"
              >
                {t("delete") || "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>{t("deleteSessionConfirm")}</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>{t("cancel") || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(session.id);
                setConfirmOpen(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
