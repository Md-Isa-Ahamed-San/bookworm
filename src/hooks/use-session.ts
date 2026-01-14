"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "../server/better-auth/client";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await authClient.getSession();
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
