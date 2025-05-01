import { parse } from "url";
import next from "next";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc/router";
import { createContextFromExpress } from "./trpc/context";
import cookieParser from "cookie-parser";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();

  expressApp.use(cookieParser());

  expressApp.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext: createContextFromExpress,
    })
  );

  expressApp.all("*", async (req, res) => {
    const parsedUrl = parse(req.url!, true);
    await handle(req, res, parsedUrl);
  });

  expressApp.listen(port);

  console.log(`> Ready on http://localhost:${port}`);
});
