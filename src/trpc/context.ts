"use server";

import {
  getSessionFromExpressRequest,
  getSessionFromNextCookies,
  Session,
} from "@/session";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { Request } from "express";

let cachedContext: Context | undefined;
let req: Request | undefined;

export async function createContextFromExpress(
  options: CreateExpressContextOptions
): Promise<Context> {
  if (cachedContext && cachedContext.type === "express" && req === options.req) {
    console.log("Using cached context from Express");
    return cachedContext;
  }

  const context: Context = {
    type: "express",
    async getSession() {
      return await getSessionFromExpressRequest(options.req);
    },
    async setSessionId(sessionId: string) {
      options.res.cookie("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 * 1000,
      });
    },
    async clearSessionId() {
      options.res.clearCookie("sessionId");
    },
  };

  console.log("Context from Express", context);

  cachedContext = context;

  return context;
}

export async function createContextFromNext(): Promise<Context> {
  if (cachedContext && cachedContext.type === "next") {
    console.log("Using cached context from Next");
    return cachedContext;
  }

  const context: Context = {
    type: "next",
    async getSession() {
      return await getSessionFromNextCookies();
    },
    async setSessionId(sessionId) {
      const cookies = await import("next/headers").then((mod) => mod.cookies());
      cookies.set("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000,
        path: "/",
      });
    },
    async clearSessionId() {
      const cookies = await import("next/headers").then((mod) => mod.cookies());
      cookies.delete("sessionId");
    },
  };

  console.log("Context from Next", context);
  cachedContext = context;

  return context;
}

// explicit context type
export type Context = {
  type: "express" | "next";
  getSession(): Promise<Session>;
  setSessionId(sessionId: string): Promise<void>;
  clearSessionId(): Promise<void>;
};
