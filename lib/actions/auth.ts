'use server';

import { cookies } from 'next/headers';

const AUTH_COOKIE_NAME = 'pizzaspace_auth_token';

/**
 * Clear authentication cookie (server action)
 * This should be called when user logs out
 */
export async function clearAuthCookie(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
  } catch (error) {
    console.error('Failed to clear auth cookie:', error);
    throw error;
  }
}

/**
 * Set authentication cookie (server action)
 * This should be called after successful login/registration
 */
export async function setAuthCookie(token: string): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
  } catch (error) {
    console.error('Failed to set auth cookie:', error);
    throw error;
  }
}

/**
 * Get authentication token from cookie (server-side)
 */
export async function getAuthCookie(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    return token || null;
  } catch (error) {
    console.error('Failed to get auth cookie:', error);
    return null;
  }
}
