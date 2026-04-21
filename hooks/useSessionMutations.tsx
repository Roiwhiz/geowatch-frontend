"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { APIError, apiService } from "@/lib/services/api";
import { identificationService } from "@/lib/services/identification";
import { Session, SingleSession } from "@/lib/validators/schemas";
import { useDirection } from "@/hooks/useDirection";
import { toast } from "../hooks/use-toast";
import { getUserFriendlyErrorMessage } from "@/lib/services/api-client";
type RenamePayload = {
  id: string;
  title: string;
};

export function useSessionMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { locale } = useDirection();

  const userId = identificationService.getStoredUserId();
  const queryKey = ["userSessions", userId];

  // ====================== CREATE SESSION ======================
  const createMutation = useMutation({
    mutationFn: () => apiService.createSession(userId!),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Session[]>(queryKey) ?? [];

      const tempSession: SingleSession = {
        id: `temp-${Date.now()}`,
        title: "New Session",
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        userId: userId!,
      };

      queryClient.setQueryData<Session[]>(queryKey, (old = []) => [
        tempSession,
        ...old,
      ]);

      return { previous, tempId: tempSession.id };
    },

    onSuccess: (newSession, _vars, context) => {
      queryClient.setQueryData<Session[]>(queryKey, (old = []) =>
        old.map((s) => (s.id === context?.tempId ? newSession : s)),
      );
      router.push(`/${locale}/session/${newSession.id}`);

      toast({
        title: "New session created",
        description: "You can now start chatting.",
      });
    },

    onError: (error) => {
      const message =
        error instanceof APIError
          ? getUserFriendlyErrorMessage(error)
          : error instanceof Error
            ? error.message
            : "There was an error when trying to create new session. Please try again";

      toast({
        variant: "destructive",
        title: "Failed to create session",
        description: message,
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // ====================== RENAME ======================
  const renameMutation = useMutation({
    mutationFn: ({ id, title }: RenamePayload) =>
      apiService.renameSession(id, title),

    onMutate: async ({ id, title }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Session[]>(queryKey) ?? [];

      queryClient.setQueryData<Session[]>(queryKey, (old = []) =>
        old.map((s) => (s.id === id ? { ...s, title } : s)),
      );

      return { previous };
    },

    onSuccess: () => {
      toast({
        title: "Session renamed successfully",
      });
    },

    onError: (error) => {
      const message =
        error instanceof APIError
          ? getUserFriendlyErrorMessage(error)
          : error instanceof Error
            ? error.message
            : "There was an error while renaming the session";
      toast({
        variant: "destructive",
        title: "Failed to rename session",
        description: message,
      });
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  // ====================== DELETE ======================
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteSession(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Session[]>(queryKey) ?? [];

      queryClient.setQueryData<Session[]>(queryKey, (old = []) =>
        old.filter((s) => s.id !== id),
      );

      return { previous };
    },

    onSuccess: () => {
      toast({
        title: "Session deleted",
      });
    },

    onError: (error) => {
      const message =
        error instanceof APIError
          ? getUserFriendlyErrorMessage(error)
          : error instanceof Error
            ? error.message
            : "Try was an error while trying to delete the session";
      toast({
        variant: "destructive",
        title: "Failed to delete session",
        description: message,
      });
    },

    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  return {
    createMutation,
    renameMutation,
    deleteMutation,
  };
}
