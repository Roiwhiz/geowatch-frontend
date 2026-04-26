"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/lib/services/api";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { useState } from "react";

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
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-muted/50 hover:bg-muted transition-colors text-left"
      >
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {open ? (
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-4 py-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}

export function ReportRenderer({ reportId, className }: ReportRendererProps) {
  console.log("Rendering ReportRenderer with reportId:", reportId);
  const {
    data: report,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => apiService.getReport(reportId),
    staleTime: Infinity, // Reports never change once created
  });

  if (isLoading) {
    return (
      <div className={cn("space-y-2", className)}>
        {[80, 60, 90, 70].map((w, i) => (
          <div
            key={i}
            className="h-4 rounded animate-pulse bg-muted"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-sm text-muted-foreground italic">
        Report details unavailable.
      </div>
    );
  }

  const { output, frameworkUsed, partialSources } = report;

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {/* Framework badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full",
            FRAMEWORK_COLORS[frameworkUsed] ?? "bg-muted text-muted-foreground",
          )}
        >
          {FRAMEWORK_LABELS[frameworkUsed] ?? frameworkUsed}
        </span>

        {partialSources && (
          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            Partial sources
          </span>
        )}
      </div>

      {/* BLUF — always open, most prominent */}
      {output.bluf && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
            Bottom Line
          </p>
          <p className="text-sm leading-relaxed font-medium text-foreground">
            {output.bluf}
          </p>
        </div>
      )}

      {/* Collapsible sections */}
      <div className="space-y-2">
        <Section
          title="Background"
          content={output.background}
          defaultOpen={false}
        />
        <Section
          title="Current Situation"
          content={output.currentSituation}
          defaultOpen={true}
        />
        <Section
          title="Analysis"
          content={output.analysis}
          defaultOpen={true}
        />
        <Section
          title="Implications"
          content={output.implications}
          defaultOpen={true}
        />
        <Section title="Sources" content={output.sources} defaultOpen={false} />
      </div>
    </div>
  );
}
