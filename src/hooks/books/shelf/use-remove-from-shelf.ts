"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { removeFromShelf } from "~/actions/shelf-actions"

export function useRemoveFromShelf() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userBookId: string) => removeFromShelf(userBookId),
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ['userBooks'] })
        toast.success("Book removed from library")
      } else {
        toast.error(result.error || "Failed to remove book")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    },
  })
}