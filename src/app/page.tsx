import { createCaller } from "@/trpc/router";
import { Test } from "./(components)/test";
import { createContextFromNext } from "@/trpc/context";
import { Login } from "./(components)/login";
import { prefetch, trpc } from "@/trpc/next";
import { Calculator } from "./(components)/calculator";

export default async function Home() {
  const caller = createCaller(createContextFromNext);
  const session = await caller.session.get();

  prefetch(trpc.session.get.queryOptions());

  return (
    <main>
      <div>
        Server Session: <code>{JSON.stringify(session)}</code>
      </div>
      <Test />
      <Login />
      <Calculator />
    </main>
  );
}
