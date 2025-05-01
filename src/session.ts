"use server";

import type { HTTPHeaders } from "@trpc/client";
import type { Request } from "express";

export type Session = { sessionId: string } | "anonymous";

export async function getSessionFromExpressRequest(
  req: Request
): Promise<Session> {
  const sessionId = req.cookies?.sessionId;

  if (typeof sessionId === "string" && sessionId.length > 0)
    return { sessionId };

  return "anonymous";
}

export async function getSessionFromNextCookies(): Promise<Session> {
  const cookies = await import("next/headers").then((mod) => mod.cookies());
  const sessionId = cookies.get("sessionId");

  if (sessionId && sessionId.value.length > 0) {
    return { sessionId: sessionId.value };
  }

  return "anonymous";
}

export async function getHeadersForTRPCClient(): Promise<HTTPHeaders> {
  const headers = await import("next/headers").then((mod) => mod.headers());
  const cookies = headers.get("cookies");

  if (cookies)
    return {
      cookies: cookies,
    };

  return {};
}
