"use client";

import { Message } from "@/lib/validators/schemas";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { ReportRenderer } from "./ReportRenderer";

interface MessageBubbleProps {
  message: Message;
  reportId?: string;
  responseType?: "report" | "conversational";
}

export default function MessageBubble({
  message,
  reportId,
  responseType,
}: MessageBubbleProps) {
  const { isRTL } = useDirection();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div
        className={cn("flex w-full mb-4 justify-end")}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 bg-primary text-primary-foreground">
          <div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {message.content}
          </div>
          <div className="text-xs mt-1.5 opacity-70 text-right">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    );
  }

  // Assistant message — branch on responseType
  return (
    <div className="flex w-full mb-6 justify-start" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full max-w-[95%] md:max-w-[85%]">
        {reportId && responseType === "report" ? (
          // Structured intelligence report
          <ReportRenderer reportId={reportId} />
        ) : (
          // Conversational response — plain chat bubble
          <div className="bg-muted rounded-2xl px-4 py-3">
            <div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word text-foreground">
              {message.content}
            </div>
          </div>
        )}
        <div className="text-xs mt-1.5 text-muted-foreground px-1">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
