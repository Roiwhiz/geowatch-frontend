"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { apiService, APIError } from "@/lib/services/api";
import { getUserFriendlyErrorMessage } from "@/lib/services/api-client";
import { Message } from "@/lib/validators/schemas";
import { useLocale } from "next-intl";

export function useChatSession(sessionId: string | null) {
  const queryClient = useQueryClient();
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);

  // Fetch messages
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: () => apiService.getMessages(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 3 * 60 * 1000,
  });

  // Send message
  const sendMessageMutation = useMutation({
    mutationFn: (query: string) => apiService.chat(sessionId!, query, locale),

    onMutate: async (query: string) => {
      setError(null);
      await queryClient.cancelQueries({ queryKey: ["messages", sessionId] });

      const previousMessages =
        queryClient.getQueryData<Message[]>(["messages", sessionId]) ?? [];

      const optimisticUserMsg: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: query,
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<Message[]>(
        ["messages", sessionId],
        (old = []) => [...old, optimisticUserMsg],
      );

      return { previousMessages };
    },

    onSuccess: async () => {
      setError(null);
      await queryClient.invalidateQueries({
        queryKey: ["messages", sessionId],
      });
      await queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },

    onError: (err, query, context) => {
      // Rollback optimistic update
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", sessionId],
          context.previousMessages,
        );
      }

      // Convert API error to user-friendly message
      let friendlyMessage = "Failed to send message. Please try again.";

      if (err instanceof APIError) {
        friendlyMessage = getUserFriendlyErrorMessage(err);
      } else if (err instanceof Error) {
        if (err.message.includes("network")) {
          friendlyMessage = "Network error. Please check your connection.";
        } else {
          friendlyMessage = err.message;
        }
      }

      setError(friendlyMessage);

      // Auto-clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    },
  });

  const sendMessage = useCallback(
    (query: string) => sendMessageMutation.mutateAsync(query),
    [sendMessageMutation],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isLoadingMessages,
    isSending: sendMessageMutation.isPending,
    sendMessage,
    error,
    clearError,
  };
}
