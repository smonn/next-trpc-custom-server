"use client";

import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "./trpc";
import { useRouter } from "next/navigation";

export function Login() {
  const trpc = useTRPC();
  const { push } = useRouter();
  const queryClient = useQueryClient();

  const session = useSuspenseQuery(trpc.session.get.queryOptions());

  const login = useMutation(
    trpc.session.login.mutationOptions({
      async onSuccess() {
        console.log("Login successful");
        await queryClient.invalidateQueries({
          queryKey: trpc.session.get.queryKey(),
        });
        // force a server-side rerender
        push("/");
      },
    })
  );

  const handleLogin = () => {
    login.mutate();
  };

  const logout = useMutation(
    trpc.session.logout.mutationOptions({
      async onSuccess() {
        console.log("Logout successful");
        await queryClient.invalidateQueries({
          queryKey: trpc.session.get.queryKey(),
        });
        // force a server-side rerender
        push("/");
      },
    })
  );

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <div>
      {session.data === "anonymous" ? (
        <button key="login" onClick={handleLogin}>
          Login
        </button>
      ) : (
        <button key="logout" onClick={handleLogout}>
          Logout
        </button>
      )}
    </div>
  );
}
