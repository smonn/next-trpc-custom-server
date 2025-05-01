"use client";

import { useTRPC } from "./trpc";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

export function Test() {
  const trpc = useTRPC();
  const session = useSuspenseQuery(trpc.session.get.queryOptions());

  if (session.status === "error") {
    throw session.error;
  }

  return (
    <div>
      Client Session: <code>{JSON.stringify(session.data)}</code>
    </div>
  );
}
