import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from "@trpc/tanstack-react-query";
// import { cache } from "react";
import { getQueryClient } from "./queryClient";
import { appRouter } from "./router";
import { createContextFromNext } from "./context";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// export const getServerQueryClient = cache(getQueryClient);

export const trpc = createTRPCOptionsProxy({
  ctx: createContextFromNext,
  router: appRouter,
  queryClient: getQueryClient,
});

export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === "infinite") {
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
