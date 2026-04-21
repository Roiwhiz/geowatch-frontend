import { cookieService } from "./cookies";
import type { User } from "../validators/schemas";

interface IdentificationService {
  getStoredUserId(): string | null;
  storeUser(user: User): void;
}

export const identificationService: IdentificationService = {
  getStoredUserId(): string | null {
    if (typeof window === "undefined") return null;
    return cookieService.getStoredUserId() ?? null;
  },

  storeUser(user: User): void {
    if (typeof window === "undefined") return;
    cookieService.setUserId(user.id);
  },
};
