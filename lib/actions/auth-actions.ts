'use server'

import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'pizzaspace_auth_token';
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * Sets the authentication token as an HTTP-only cookie
 * @param token - The JWT token to store
 * @param rememberMe - If true, sets a longer expiration (30 days). Otherwise, session cookie.
 */
export async function setAuthCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? TOKEN_MAX_AGE : undefined,
    path: '/',
  });
}

/**
 * Clears the authentication token cookie
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

/**
 * Gets the authentication token from cookies
 * @returns The token string or null if not found
 */
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null;
}
