"use client";

import { useEffect, useState } from "react";
import { useTRPC } from "./trpc";
import { useMutation } from "@tanstack/react-query";

export function Calculator() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const trpc = useTRPC();

  const add = useMutation(trpc.math.add.mutationOptions());

  useEffect(() => {
    add.mutate({ a, b });
  }, [a, b]);

  return (
    <div>
      <input
        type="number"
        value={a}
        onInput={(e) => setA(Number(e.currentTarget.value))}
      />
      <span> + </span>
      <input
        type="number"
        value={b}
        onInput={(e) => setB(Number(e.currentTarget.value))}
      />
      <span> = </span>
      <span>{add.data?.sum ?? 0}</span>
    </div>
  );
}
