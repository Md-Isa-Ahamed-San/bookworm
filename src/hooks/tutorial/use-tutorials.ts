"use client";

import { useQuery } from "@tanstack/react-query";
import { getTutorials } from "~/queries/tutorial-queries";

export function useTutorials({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["tutorials", { page, limit }],
    queryFn: () => getTutorials({ page, limit }),
  });
}