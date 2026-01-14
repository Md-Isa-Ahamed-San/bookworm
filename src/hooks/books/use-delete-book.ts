"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { deleteBook } from "~/actions/book-actions"

export function useDeleteBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['books'] })
        toast.success("Book deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete book")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    }
  })
}