import { randomUUID } from "node:crypto";
import { createCallerFactory, publicProcedure, router } from "./init";
import { z } from "zod";

export const appRouter = router({
  session: {
    get: publicProcedure.query(async (opts) => {
      return await opts.ctx.getSession();
    }),
    login: publicProcedure.mutation(async (opts) => {
      await opts.ctx.setSessionId(randomUUID());
    }),
    logout: publicProcedure.mutation(async (opts) => {
      await opts.ctx.clearSessionId();
    }),
  },
  math: {
    add: publicProcedure
      .input(z.object({ a: z.number(), b: z.number() }))
      .mutation((opts) => {
        return { sum: opts.input.a + opts.input.b };
      }),
  },
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
