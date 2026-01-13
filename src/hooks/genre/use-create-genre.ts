"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createGenre } from "~/actions/genre-actions"

export function useCreateGenre() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => createGenre(name),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['genres'] })
        toast.success("Genre created successfully")
      } else {
        toast.error(result.error || "Failed to create genre")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    }
  })
}