"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllBooks, type BookFilters } from "~/queries/book-queries"

export function useBooks(filters: BookFilters = {}) {
  return useQuery({
    queryKey: ['books', filters],
    queryFn: () => getAllBooks(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}