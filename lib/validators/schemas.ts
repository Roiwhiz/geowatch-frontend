import { z } from "zod";

// ============================================================================
// SCHEMAS — field names match exactly what the backend returns
// ============================================================================

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  createdAt: z.string(),
  preferences: z.record(z.unknown()).nullable().optional(),
});

export const SessionSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.string(),
  lastActiveAt: z.string(),
});

export const SessionsSchema = z.array(SessionSchema);

export const SingleSessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  title: z.string().min(1),
  createdAt: z.string().datetime(),
  lastActiveAt: z.string().datetime(),
});

export const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  createdAt: z.string(),
  reportId: z.string().nullable().optional(),
  responseType: z.enum(["report", "conversational"]).nullable().optional(),
});

export const MessagesSchema = z.array(MessageSchema);

export const ReportOutputSchema = z.object({
  bluf: z.string(),
  background: z.string(),
  currentSituation: z.string(),
  analysis: z.string(),
  implications: z.string(),
  sources: z.string(),
  rawOutput: z.string(),
});

export const ReportSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  query: z.string(),
  frameworkUsed: z.enum([
    "realism",
    "liberalism",
    "constructivism",
    "political_economy",
  ]),
  responseType: z.enum(["report", "conversational"]),
  output: ReportOutputSchema,
  partialSources: z.boolean(),
  createdAt: z.string(),
});

export const ChatResponseSchema = z.object({
  id: z.string(),
  role: z.literal("assistant"),
  content: z.string(),
  reportId: z.string(),
  sessionId: z.string(),
  createdAt: z.string(),
  responseType: z.enum(["report", "conversational"]),
});

export const SessionRenameAndDeleteSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  timestamp: z.string().datetime(),
});

// Backend error response schema
export const BackendErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.unknown()).optional(),
  timestamp: z.string(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type User = z.infer<typeof UserSchema>;
export type Session = z.infer<typeof SessionSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type Report = z.infer<typeof ReportSchema>;
export type ChatResponse = z.infer<typeof ChatResponseSchema>;
export type SingleSession = z.infer<typeof SingleSessionSchema>;
export type SessionRenamAndDelete = z.infer<
  typeof SessionRenameAndDeleteSchema
>;
export type BackendError = z.infer<typeof BackendErrorSchema>;
