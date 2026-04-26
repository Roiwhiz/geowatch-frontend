"use client";

import { useParams } from "next/navigation";
import { ConversationContainer } from "@/components/ConversationContainer";
import { useChatSession } from "@/hooks/useChatSessions";
import { useDirection } from "@/hooks/useDirection";

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const { dir } = useDirection();

  const {
    messages,
    isLoadingMessages,
    isSending,
    sendMessage,
    error,
    clearError,
  } = useChatSession(sessionId);

  return (
    <div className="flex flex-col h-full min-h-0" dir={dir}>
      <ConversationContainer
        messages={messages}
        onSubmitQuery={sendMessage}
        isLoading={isSending || isLoadingMessages}
        sessionId={sessionId}
        error={error}
        onClearError={clearError}
      />
    </div>
  );
}
