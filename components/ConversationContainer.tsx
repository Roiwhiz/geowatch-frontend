"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChatResponse, Message } from "@/lib/validators/schemas";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { QueryInput } from "./QueryInput";
import { useDirection } from "@/hooks/useDirection";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import EmptyState from "./EmptyState";
import MessageBubble from "./MessageBubble";
import { MessageSkeleton } from "./MessageSkeleton";

interface ConversationContainerProps {
  messages: Message[];
  onSubmitQuery: (query: string) => Promise<ChatResponse>;
  isLoading?: boolean;
  isLoadingMessages?: boolean;
  sessionId: string | null;
  error?: string | null;
  onClearError?: () => void;
  reportIds?: Record<string, string>;
}

export function ConversationContainer({
  messages,
  onSubmitQuery,
  isLoading = false,
  isLoadingMessages = false,
  sessionId,
  error,
  onClearError,
  reportIds,
}: ConversationContainerProps) {
  const { dir } = useDirection();
  const { toast } = useToast();

  // Refs
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // State
  const [showScrollDown, setShowScrollDown] = useState(false);

  // Show error toast when error prop changes
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
        duration: 5000,
      });
      if (onClearError) {
        onClearError();
      }
    }
  }, [error, toast, onClearError]);

  // Check if user is at bottom
  const isAtBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  // Handle manual scroll
  const handleScroll = useCallback(() => {
    const atBottom = isAtBottom();
    setShowScrollDown(!atBottom);

    // User is manually scrolling
    isUserScrollingRef.current = true;

    // Clear previous timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Reset auto-scroll flag after 2 seconds
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrollingRef.current = false;
    }, 2000);
  }, [isAtBottom]);

  // Auto-scroll when session changes
  useEffect(() => {
    if (sessionId) {
      isUserScrollingRef.current = false;
      setShowScrollDown(false);
      setTimeout(() => scrollToBottom("auto"), 100);
    }
  }, [sessionId, scrollToBottom]);

  // Auto-scroll when new messages arrive (only if user is at bottom)
  useEffect(() => {
    if (messages.length > 0 && !isUserScrollingRef.current && isAtBottom()) {
      scrollToBottom("smooth");
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const showThinking =
    isLoading &&
    messages.length > 0 &&
    messages[messages.length - 1]?.role === "user";
  const hasMessages = sessionId && messages.length > 0;

  return (
    <div className="flex flex-col h-full bg-background" dir={dir}>
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
      >
        <div className="max-w-3xl mx-auto px-4 py-6 w-full">
          {!sessionId ? (
            <EmptyState type="noSession" />
          ) : isLoadingMessages ? ( // ← add this branch before messages.length check
            <MessageSkeleton />
          ) : messages.length === 0 ? (
            <EmptyState type="newSession" />
          ) : (
            <>
              {messages.map((message, idx) => (
                <MessageBubble
                  key={message.id || idx}
                  message={message}
                  reportId={
                    message.role === "assistant"
                      ? reportIds?.[message.id]
                      : undefined
                  }
                />
              ))}
              {showThinking && <ThinkingIndicator />}
            </>
          )}
        </div>
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollDown && hasMessages && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-24 z-10">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md hover:shadow-lg transition-all duration-200 h-9 w-9 bg-background border border-border"
            onClick={() => scrollToBottom("smooth")}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Input Area - No border */}
      <div className="bg-background">
        <div className="w-full max-w-3xl mx-auto px-4 py-4">
          <QueryInput onSubmit={onSubmitQuery} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
