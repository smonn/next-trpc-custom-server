"use client";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import { type AppRouter } from "@/trpc/router";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { ReactNode, useMemo, useState } from "react";
import SuperJSON from "superjson";
import { getQueryClient } from "@/trpc/queryClient";
import { Session } from "@/session";

const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

export { useTRPC };

export function Provider({
  children,
  session,
}: {
  children: ReactNode;
  session: Session;
}) {
  const queryClient = getQueryClient();
  const trpcClient = useMemo(
    () =>
      createTRPCClient<AppRouter>({
        links: [
          httpBatchLink({
            url: "http://localhost:3000/api/trpc",
            headers() {
              return {
                cookie:
                  session !== "anonymous"
                    ? `sessionId=${session.sessionId}`
                    : undefined,
              };
            },
            transformer: SuperJSON,
          }),
        ],
      }),
    [session]
  );
  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
