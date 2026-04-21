import { z } from "zod";
import { BackendErrorSchema } from "../validators/schemas";

// ============================================================================
// ERROR CLASSES
// ============================================================================

export class APIError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "APIError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
// ============================================================================
// ERROR UTILITIES
// ============================================================================

function getUserFriendlyErrorMessage(error: APIError): string {
  if (error.status === 400 && error.details) {
    const details = error.details as Record<string, string[]>;

    if (details.query) {
      if (details.query.some((msg) => msg.includes("at least 3 characters"))) {
        return "Please enter at least 3 characters. Your message is too short.";
      }
      if (details.query.some((msg) => msg.includes("exceed 2000 characters"))) {
        return "Your message is too long. Please limit to 2000 characters.";
      }
      return `Question issue: ${details.query.join(", ")}`;
    }

    if (details.sessionId) {
      return "Invalid session. Please refresh the page and try again.";
    }

    if (details.locale) {
      return "Language setting issue. Please refresh the page.";
    }

    return `Invalid request: ${error.message}`;
  }

  // Handle specific HTTP status codes
  switch (error.status) {
    case 409:
      return "This session is currently processing another request. Please wait a moment.";
    case 404:
      return "Session not found. Please create a new session.";
    case 429:
      return "Too many requests. Please wait a moment before trying again.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return error.message || "Failed to complete request. Please try again.";
  }
}

// ============================================================================
// RESPONSE HANDLER
// ============================================================================

export async function handleResponse<T>(
  response: Response,
  schema: z.ZodSchema<T>,
): Promise<T> {
  if (!response.ok) {
    let errorData: unknown = {};

    try {
      errorData = await response.json();

      const parsedError = BackendErrorSchema.safeParse(errorData);

      if (parsedError.success) {
        throw new APIError(
          response.status,
          parsedError.data.error,
          parsedError.data.message,
          parsedError.data.details,
        );
      }
    } catch (e) {
      if (e instanceof APIError) throw e;
    }

    // Fallback error
    throw new APIError(
      response.status,
      "UNKNOWN_ERROR",
      `Request failed with status ${response.status}`,
    );
  }

  const data = await response.json();

  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new APIError(
        400,
        "VALIDATION_ERROR",
        `Response validation failed: ${error.errors[0]?.message || "Invalid data shape"}`,
      );
    }
    throw error;
  }
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

export { getUserFriendlyErrorMessage };
