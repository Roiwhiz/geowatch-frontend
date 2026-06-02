import { useQuery } from "@tanstack/react-query";
import { APIError, apiService } from "@/lib/services/api";
import { toast } from "../hooks/use-toast";
import { useEffect } from "react";
import { getUserFriendlyErrorMessage } from "@/lib/services/api-client";
import { useUIstore } from "@/lib/stores/uiStore";

export function useSessions() {
  const { userId } = useUIstore();

  const { data: fetchedUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => apiService.getUserById(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
    retry: false,
  });

  const verifiedUserId = fetchedUser?.id ?? null;

  const query = useQuery({
    queryKey: ["userSessions", verifiedUserId],
    queryFn: () => apiService.getSessions(verifiedUserId!),
    enabled: !!verifiedUserId,
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1500,
  });

  useEffect(() => {
    if (query.error) {
      const message =
        query.error instanceof APIError
          ? getUserFriendlyErrorMessage(query.error)
          : query.error instanceof Error
            ? query.error.message
            : "Could not load your previous conversations";

      toast({
        variant: "destructive",
        title: "Failed to load sessions",
        description: message,
      });
    }
  }, [query.error]);

  return query;
}
