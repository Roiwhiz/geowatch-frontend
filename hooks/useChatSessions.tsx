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
  const [reportMeta, setReportMeta] = useState<
    Record<
      string,
      { reportId: string; responseType: "report" | "conversational" }
    >
  >({});

  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", sessionId],
    queryFn: async () => {
      const msgs = await apiService.getMessages(sessionId!);
      msgs.forEach((m) => {
        if (m.reportId && m.responseType) {
          setReportMeta((prev) => ({
            ...prev,
            [m.id]: {
              reportId: m.reportId!,
              responseType: m.responseType!,
            },
          }));
          if (m.responseType === "report") {
            queryClient.prefetchQuery({
              queryKey: ["report", m.reportId],
              queryFn: () => apiService.getReport(m.reportId!),
            });
          }
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

      if (chatResponse.reportId) {
        setReportMeta((prev) => ({
          ...prev,
          [chatResponse.reportId]: {
            reportId: chatResponse.reportId,
            responseType: chatResponse.responseType,
          },
        }));

        // Only pre-fetch for structured reports — conversational ones render from rawOutput
        if (chatResponse.responseType === "report") {
          queryClient.prefetchQuery({
            queryKey: ["report", chatResponse.reportId],
            queryFn: () => apiService.getReport(chatResponse.reportId),
          });
        }
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
    reportMeta,
    isSending: sendMessageMutation.isPending,
    sendMessage,
    error,
    clearError,
  };
}
