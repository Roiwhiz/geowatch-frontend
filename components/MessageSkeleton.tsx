"use client";

import { cn } from "@/lib/utils";

function SkeletonBubble({ isUser, width }: { isUser: boolean; width: string }) {
  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "h-10 rounded-2xl animate-pulse",
          isUser ? "bg-primary/20" : "bg-muted",
          width,
        )}
      />
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 w-full">
      <SkeletonBubble isUser={false} width="w-[65%]" />
      <SkeletonBubble isUser={true} width="w-[45%]" />
      <SkeletonBubble isUser={false} width="w-[75%]" />
      <SkeletonBubble isUser={true} width="w-[35%]" />
      <SkeletonBubble isUser={false} width="w-[60%]" />
    </div>
  );
}
