"use server";

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";

export async function getUserToken() {
  const encodedToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!encodedToken) return null;

  const decodedToken = await decode({
    token: encodedToken,
    secret: (process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET)!,
  });

  return decodedToken?.accessToken ?? null;
}

export async function getUserId() {
  const encodedToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!encodedToken) return null;

  const decodedToken = await decode({
    token: encodedToken,
    secret: (process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET)!,
  });

  return decodedToken?.sub ?? null;
}
