"use client"

import { useQuery } from "@tanstack/react-query"
import { getAllGenres } from "~/queries/genre-queries"

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => getAllGenres(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}