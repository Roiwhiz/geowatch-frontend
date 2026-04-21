"use client";

import { Message } from "@/lib/validators/schemas";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const { isRTL } = useDirection();
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
        <div
          className={cn(
            "text-xs mt-1.5 opacity-70",
            isUser ? "text-right" : "text-left",
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
