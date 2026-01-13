"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateGenre } from "~/actions/genre-actions"

export function useUpdateGenre() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => 
      updateGenre(id, name),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['genres'] })
        toast.success("Genre updated successfully")
      } else {
        toast.error(result.error || "Failed to update genre")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    }
  })
}