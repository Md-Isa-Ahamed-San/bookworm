"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteGenre } from "~/actions/genre-actions"

export function useDeleteGenre() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteGenre(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['genres'] })
        toast.success("Genre deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete genre")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    }
  })
}