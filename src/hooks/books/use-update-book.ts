"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateBook } from "~/actions/book-actions"

export function useUpdateBook() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateBook>[1] }) => 
      updateBook(id, data),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['books'] })
        toast.success("Book updated successfully")
      } else {
        toast.error(result.error || "Failed to update book")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    }
  })
}