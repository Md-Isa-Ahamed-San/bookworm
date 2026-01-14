// src/hooks/admin/use-admin-stats.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchDashboardStats } from "~/actions/admin-actions"

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const result = await fetchDashboardStats()
      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to fetch stats")
      }
      return result.data
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  })
}