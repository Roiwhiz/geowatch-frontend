"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { identificationService } from "@/lib/services/identification";
import UserIdentificationDialog from "@/components/UserIdentificationDialog";
import { useUIstore } from "@/lib/stores/uiStore";
import { apiService } from "@/lib/services/api";
import { APIError } from "@/lib/services/api";
import { useTranslations } from "next-intl";
export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(
    null,
  );
  const { showIdentificationDialog, setShowIdentificationDialog } =
    useUIstore();
  const queryClient = useQueryClient();
  const t = useTranslations("identification");
  const u = useTranslations("empty");
  const userId = identificationService.getStoredUserId();

  const { isPending: isUserPending } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => apiService.getUserById(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });

  const identifyUserMutation = useMutation({
    mutationFn: (email: string) => apiService.identifyUser(email),

    onSuccess: (identifiedUser) => {
      identificationService.storeUser(identifiedUser);
      setIdentificationError(null);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      setShowIdentificationDialog(false);
    },

    onError: (err: unknown) => {
      let message = "Failed to identify user. Please try again.";
      if (err instanceof APIError) message = err.message;
      else if (err instanceof Error) message = err.message;

      setIdentificationError(message);
    },
  });

  const handleIdentification = (email: string) => {
    setIdentificationError(null);
    identifyUserMutation.mutate(email);
  };

  const isLoading = !mounted || (userId && isUserPending);

  useEffect(() => {
    if (!mounted) return;
    setShowIdentificationDialog(!userId);
  }, [userId, mounted, setShowIdentificationDialog]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-background flex items-center justify-center min-h-screen">
        {u("loading")}
      </div>
    );
  }

  if (showIdentificationDialog) {
    return (
      <div className="bg-background flex items-center justify-center min-h-screen">
        <UserIdentificationDialog
          isOpen={true}
          onSubmit={handleIdentification}
          isLoading={identifyUserMutation.isPending}
          error={identificationError}
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center gap-2">
      <h1>{t("title")}</h1>
      <h3 className="text-center p-3">{u("noSessions")}</h3>
    </div>
  );
}
