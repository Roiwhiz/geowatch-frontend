"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ChatResponse } from "@/lib/validators/schemas";
import { useDirection } from "@/hooks/useDirection";
import { cn } from "@/lib/utils";
import { useToast } from "../hooks/use-toast";

interface QueryInputProps {
  onSubmit: (query: string) => Promise<ChatResponse>;
  disabled?: boolean;
}

export function QueryInput({ onSubmit, disabled = false }: QueryInputProps) {
  const t = useTranslations("chat");
  const { isRTL } = useDirection();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = disabled || isSubmitting;

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 120);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  const showErrorToast = (message: string) => {
    toast({
      variant: "destructive",
      title: "Invalid input",
      description: message,
      duration: 3000,
    });
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const trimmed = input.trim();

      // Run all validation here — this runs on both Enter (desktop) and button tap (mobile)
      if (!trimmed) {
        showErrorToast("Please enter a message.");
        return;
      }

      if (trimmed.length < 3) {
        showErrorToast("Please enter at least 3 characters.");
        return;
      }

      if (trimmed.length > 2000) {
        showErrorToast("Message is too long. Please limit to 2000 characters.");
        return;
      }

      if (isLoading) return;

      setIsSubmitting(true);
      try {
        await onSubmit(trimmed);
        setInput("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
        }
      } catch (err) {
        console.debug("Failed to send:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [input, isLoading, onSubmit],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Textarea
        ref={textareaRef}
        placeholder={t("placeholder") || "Ask anything..."}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        rows={1}
        className={cn(
          "w-full resize-none min-h-[52px] max-h-[120px] py-3 px-4",
          "bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring",
          "placeholder:text-muted-foreground",
          "rounded-2xl",
          isRTL ? "pr-12 pl-4" : "pr-12",
        )}
        style={{ border: "none" }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={isLoading}
        className={cn(
          "absolute bottom-2 h-8 w-8 rounded-full",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          isRTL ? "left-2" : "right-2",
        )}
      >
        <Send className="h-3.5 w-3.5" />
      </Button>
    </form>
  );
}
