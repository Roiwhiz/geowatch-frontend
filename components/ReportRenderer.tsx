"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { apiService } from "@/lib/services/api";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ReportRendererProps {
  reportId: string;
  className?: string;
}

const FRAMEWORK_LABELS: Record<string, string> = {
  realism: "Realism",
  liberalism: "Liberalism",
  constructivism: "Constructivism",
  political_economy: "Political Economy",
};

const FRAMEWORK_COLORS: Record<string, string> = {
  realism: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  liberalism:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  constructivism:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  political_economy:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text, id }: { text: string; id: string }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={handleCopy}
      className="h-7 w-7 p-0 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
      aria-label="Copy"
    >
      {copiedId === id ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

// ── Accordion section ─────────────────────────────────────────────────────────

function Section({
  title,
  content,
  defaultOpen = true,
}: {
  title: string;
  content: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (!content) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden group">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-4 py-3 flex items-start gap-2 group">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground flex-1">
            {content}
          </p>
          <CopyButton text={content} id={title} />
        </div>
      )}
    </div>
  );
}

// ── BLUF section — always visible, never collapses ───────────────────────────
// This is intentionally not an accordion. The bottom line must always be
// visible without any interaction. Everything else can be collapsed.

function BlufSection({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="border border-primary/20 rounded-lg overflow-hidden bg-primary/5">
      {/* Header matches accordion header height and style exactly */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Bottom Line
        </span>
        {/* Lock icon indicates this section cannot be collapsed */}
        <span className="text-xs text-primary/50 font-medium">
          Always visible
        </span>
      </div>

      <div className="px-4 py-3 flex items-start gap-2 group">
        <p className="text-sm leading-relaxed font-medium text-foreground flex-1">
          {content}
        </p>
        <CopyButton text={content} id="bluf" />
      </div>
    </div>
  );
}

// ── Sources section — renders as clickable links ──────────────────────────────

function SourcesSection({ content }: { content: string }) {
  const [open, setOpen] = useState(false);

  if (!content) return null;

  // Parse numbered sources: "1. Title — domain.com — retrieved YYYY-MM-DD"
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sources ({lines.length})
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="px-4 py-3 space-y-1.5">
          {lines.map((line, i) => {
            // Extract URL if present
            const urlMatch = line.match(/https?:\/\/[^\s]+/);
            const url = urlMatch?.[0];
            // Clean up the line for display
            const display = line.replace(/^\d+\.\s*/, "");

            return url ? (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-primary hover:underline truncate"
              >
                {display}
              </a>
            ) : (
              <p key={i} className="text-sm text-muted-foreground">
                {display}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ReportSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-5 bg-muted rounded w-24" />
      <div className="h-20 bg-muted/70 rounded-lg" />
      {[90, 70, 85, 75].map((w, i) => (
        <div
          key={i}
          className="h-10 bg-muted/50 rounded-lg"
          style={{ width: `${w}%` }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ReportRenderer({ reportId, className }: ReportRendererProps) {
  const t = useTranslations("report");

  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => apiService.getReport(reportId),
    staleTime: Infinity,
    retry: 1,
  });

  if (isLoading) return <ReportSkeleton />;

  if (error || !report) {
    return (
      <div className="text-sm text-muted-foreground italic px-1">
        {t("unavailable") || "Report details unavailable."}
      </div>
    );
  }

  const { output, frameworkUsed, partialSources, createdAt } = report;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {/* Meta row — framework badge + partial sources warning + timestamp */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          className={cn(
            "text-xs font-medium",
            FRAMEWORK_COLORS[frameworkUsed] ?? "bg-muted text-muted-foreground",
          )}
        >
          {FRAMEWORK_LABELS[frameworkUsed] ?? frameworkUsed}
        </Badge>

        {partialSources && (
          <Badge
            variant="outline"
            className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700"
          >
            <AlertTriangle className="h-3 w-3" />
            Partial sources
          </Badge>
        )}

        <span className="text-xs text-muted-foreground ml-auto">
          {new Date(createdAt).toLocaleString()}
        </span>
      </div>

      {/* BLUF — always visible, no accordion */}
      <BlufSection content={output.bluf} />

      {/* All other sections — collapsible */}
      <div className="space-y-2">
        <Section
          title={t("background") || "Background"}
          content={output.background}
          defaultOpen={false}
        />
        <Section
          title={t("currentSituation") || "Current Situation"}
          content={output.currentSituation}
          defaultOpen={true}
        />
        <Section
          title={t("analysis") || "Analysis"}
          content={output.analysis}
          defaultOpen={true}
        />
        <Section
          title={t("implications") || "Implications"}
          content={output.implications}
          defaultOpen={true}
        />
        <SourcesSection content={output.sources} />
      </div>
    </div>
  );
}
