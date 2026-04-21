import Cookies from "js-cookie";

interface CookieService {
  getStoredUserId(): string | undefined;
  setUserId(userId: string): void;
  clearUserId(): void;
  isUserIdentified(): boolean;
}

const GEOWATCH_UID_COOKIE = "geowatch_uid";
const GEOWATCH_COOKIE_OPTIONS = {
  expires: 365,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Lax" as const,
};

export const cookieService: CookieService = {
  getStoredUserId() {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(GEOWATCH_UID_COOKIE);
  },

  setUserId(userId) {
    if (typeof window !== "undefined") {
      Cookies.set(GEOWATCH_UID_COOKIE, userId, GEOWATCH_COOKIE_OPTIONS);
    }
  },
  clearUserId() {
    if (typeof window !== "undefined") {
      Cookies.remove(GEOWATCH_UID_COOKIE);
    }
  },
  isUserIdentified() {
    return !!this.getStoredUserId();
  },
};
