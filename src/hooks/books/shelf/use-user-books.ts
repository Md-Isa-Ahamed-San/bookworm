"use client"

import { useQuery } from "@tanstack/react-query"
import { getUserBooks } from "~/queries/shelf-queries"
import type { ShelfType } from "../../../../generated/prisma"


export function useUserBooks(shelf?: ShelfType) {
  return useQuery({
    queryKey: ['userBooks', shelf],
    queryFn: () => getUserBooks(shelf),
    staleTime: 60 * 1000, // 1 minute
  })
}