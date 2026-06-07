"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { identificationService } from "@/lib/services/identification";
import { useUIstore } from "@/lib/stores/uiStore";
import { apiService } from "@/lib/services/api";
import { APIError } from "@/lib/services/api";
import { useTranslations } from "next-intl";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import UserIdentificationDialog from "@/components/UserIdentificationDialog";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [identificationError, setIdentificationError] = useState<string | null>(
    null,
  );

  const {
    userId,
    setUserId,
    showIdentificationDialog,
    setShowIdentificationDialog,
  } = useUIstore();

  const queryClient = useQueryClient();
  const t = useTranslations("identification");
  const u = useTranslations("empty");

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    data: verifiedUser,
    isPending: isVerifying,
    isError: userNotFound,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => apiService.getUserById(userId!),
    enabled: !!userId && mounted,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  const identifyUserMutation = useMutation({
    mutationFn: (email: string) => apiService.identifyUser(email),

    onSuccess: async (identifiedUser) => {
      // Store in persistent storage (so it persists across sessions)
      identificationService.storeUser(identifiedUser);
      setIdentificationError(null);

      // Update global store — this triggers useSessions in the sidebar to re-read
      setUserId(identifiedUser.id);

      // Populate user cache under the verified id
      queryClient.setQueryData(["user", identifiedUser.id], identifiedUser);

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

  useEffect(() => {
    if (!mounted) return;

    if (!userId) {
      identificationService.clearUserId();
      setShowIdentificationDialog(true);
      return;
    }

    // 5. If the user was not found in the database, clear the store and show dialog
    if (userNotFound) {
      identificationService.clearUserId();
      setUserId(null); // Clear global store
      queryClient.removeQueries({ queryKey: ["user", userId] });
      setShowIdentificationDialog(true);
    }
  }, [
    mounted,
    userId,
    userNotFound,
    setShowIdentificationDialog,
    setUserId,
    queryClient,
  ]);

  const isLoading = !mounted || (!!userId && isVerifying);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner message={u("loading")} />
      </div>
    );
  }

  if (showIdentificationDialog) {
    return (
      <div className="bg-background flex items-center justify-center h-full">
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
