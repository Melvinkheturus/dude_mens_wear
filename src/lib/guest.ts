import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const GUEST_ID_COOKIE = "guest_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Get or create guest ID on server side
 */
export async function getGuestId(): Promise<string> {
  const cookieStore = await cookies();
  let guestId = cookieStore.get(GUEST_ID_COOKIE)?.value;
  
  if (!guestId) {
    guestId = uuidv4();
    cookieStore.set(GUEST_ID_COOKIE, guestId, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  
  return guestId;
}

/**
 * Get guest ID on client side
 */
export function getGuestIdClient(): string {
  if (typeof window === "undefined") return "";
  
  let guestId = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${GUEST_ID_COOKIE}=`))
    ?.split("=")[1];
  
  if (!guestId) {
    guestId = uuidv4();
    document.cookie = `${GUEST_ID_COOKIE}=${guestId}; max-age=${COOKIE_MAX_AGE}; path=/; ${
      process.env.NODE_ENV === "production" ? "secure;" : ""
    } samesite=lax`;
  }
  
  return guestId;
}

/**
 * Clear guest ID (used after user login to merge guest data)
 */
export async function clearGuestId(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_ID_COOKIE);
}

// Alias for backward compatibility
export const getOrCreateGuestId = getGuestId;