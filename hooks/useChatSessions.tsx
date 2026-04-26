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
  const [reportIds, setReportIds] = useState<Record<string, string>>({});

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: async () => {
      const msgs = await apiService.getMessages(sessionId!);
      // Seed the report cache for any message that has a reportId
      msgs.forEach((m) => {
        if (m.reportId) {
          setReportIds((prev) => ({
            ...prev,
            [m.id]: m.reportId!,
          }));
          // Pre-fetch into query cache so ReportRenderer loads instantly
          queryClient.prefetchQuery({
            queryKey: ["report", m.reportId],
            queryFn: () => apiService.getReport(m.reportId!),
          });
        }
      });
      return msgs;
    },
    enabled: Boolean(sessionId),
    staleTime: 3 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error instanceof APIError && error.status === 404) return false;
      return failureCount < 2;
    },
  });

  const sessionNotFound =
    messagesError instanceof APIError && messagesError.status === 404;

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

    onSuccess: async (chatResponse) => {
      setError(null);

      // Store the reportId so MessageBubble can fetch the structured report
      if (chatResponse.reportId) {
        setReportIds((prev) => ({
          ...prev,
          [chatResponse.reportId]: chatResponse.reportId,
        }));
        // Pre-fetch the report into the query cache
        queryClient.prefetchQuery({
          queryKey: ["report", chatResponse.reportId],
          queryFn: () => apiService.getReport(chatResponse.reportId),
        });
      }

      await queryClient.invalidateQueries({
        queryKey: ["messages", sessionId],
      });
      await queryClient.invalidateQueries({ queryKey: ["userSessions"] });
    },

    onError: (err, _query, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", sessionId],
          context.previousMessages,
        );
      }

      let friendlyMessage = "Failed to send message. Please try again.";
      if (err instanceof APIError) {
        friendlyMessage = getUserFriendlyErrorMessage(err);
      } else if (err instanceof Error) {
        friendlyMessage = err.message.includes("network")
          ? "Network error. Please check your connection."
          : err.message;
      }

      setError(friendlyMessage);
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
    sessionNotFound,
    reportIds,
    isSending: sendMessageMutation.isPending,
    sendMessage,
    error,
    clearError,
  };
}
