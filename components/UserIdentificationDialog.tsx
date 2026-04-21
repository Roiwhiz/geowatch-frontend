"use client";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { useTranslations } from "use-intl";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import React, { useState } from "react";

interface UserIdentificationDialogProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
  isLoading?: boolean; // New prop
  error?: string | null; // New prop
}

export default function UserIdentificationDialog({
  isOpen,
  onSubmit,
  isLoading = false,
  error = null,
}: UserIdentificationDialogProps) {
  const [email, setEmail] = useState("");
  const t = useTranslations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t("identification.title")}</DialogTitle>
          <DialogDescription>
            {t("identification.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              {t("identification.emailLabel")}
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("identification.emailPlaceholder")}
              required
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Processing..." : t("identification.submitButton")}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {t("identification.subtitle")}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
