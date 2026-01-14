"use client";

import { useQuery } from "@tanstack/react-query";
import { getUsers } from "~/queries/user-queries";

export function useUsers({
  search = "",
  role,
  page = 1,
  limit = 10,
}: {
  search?: string;
  role?: "USER" | "ADMIN";
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["users", { search, role, page, limit }],
    queryFn: () => getUsers({ search, role, page, limit }),
  });
}