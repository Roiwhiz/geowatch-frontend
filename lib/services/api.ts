import {
  UserSchema,
  SessionsSchema,
  MessagesSchema,
  ChatResponseSchema,
  ReportSchema,
  SingleSessionSchema,
  User,
  Session,
  Message,
  ChatResponse,
  Report,
  SingleSession,
  SessionRenameAndDeleteSchema,
  SessionRenamAndDelete,
} from "../validators/schemas";
import { z } from "zod";
import { handleResponse } from "./api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";

// ============================================================================
// API SERVICE
// ============================================================================

export const apiService = {
  async identifyUser(email: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/identify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response, UserSchema);
  },

  async getUserById(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`);
    return handleResponse(response, UserSchema);
  },

  async getSessions(userId: string): Promise<Session[]> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/sessions`);
    return handleResponse(response, SessionsSchema);
  },

  async getSession(sessionId: string): Promise<SingleSession> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
    return handleResponse(response, SingleSessionSchema);
  },

  async createSession(userId: string): Promise<SingleSession> {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    return handleResponse(response, SingleSessionSchema);
  },

  async renameSession(
    sessionId: string,
    title: string,
  ): Promise<SessionRenamAndDelete> {
    const response = await fetch(
      `${API_BASE_URL}/sessions/${sessionId}/title`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      },
    );

    return handleResponse(response, SessionRenameAndDeleteSchema);
  },

  async deleteSession(sessionId: string): Promise<SessionRenamAndDelete> {
    const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
      method: "DELETE",
    });

    return handleResponse(response, SessionRenameAndDeleteSchema);
  },

  async getMessages(sessionId: string): Promise<Message[]> {
    const response = await fetch(
      `${API_BASE_URL}/sessions/${sessionId}/messages`,
    );
    return handleResponse(response, MessagesSchema);
  },

  async chat(
    sessionId: string,
    query: string,
    locale: string,
  ): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, query, locale }),
    });
    return handleResponse(response, ChatResponseSchema);
  },

  async getReport(reportId: string): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}`);
    return handleResponse(response, ReportSchema);
  },
};

export { APIError } from "./api-client";
