"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createBook } from "~/actions/book-actions"

export function useCreateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Parameters<typeof createBook>[0]) => createBook(data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['books'] })
        toast.success("Book created successfully")
      } else {
        toast.error(result.error || "Failed to create book")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    }
  })
}