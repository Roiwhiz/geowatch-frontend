import { useQuery } from "@tanstack/react-query";
import { identificationService } from "@/lib/services/identification";
import { APIError, apiService } from "@/lib/services/api";
import { toast } from "../hooks/use-toast";
import { useEffect, useState } from "react";
import { getUserFriendlyErrorMessage } from "@/lib/services/api-client";

export function useSessions() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = identificationService.getStoredUserId();
    setUserId(id);
  }, []);

  const query = useQuery({
    queryKey: ["userSessions", userId],
    queryFn: () => apiService.getSessions(userId!),
    enabled: !!userId,
    staleTime: 50 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
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
            : "Could not load your previous conversation";

      toast({
        variant: "destructive",
        title: "Failed to load sessions",
        description: message,
      });
    }
  }, [query.error]);

  return query;
}
