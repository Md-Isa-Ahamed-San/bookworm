"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { moveToShelf } from "~/actions/shelf-actions"
import type { ShelfType } from "../../../../generated/prisma"


export function useMoveToShelf() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userBookId, shelf }: { userBookId: string; shelf: ShelfType }) =>
      moveToShelf(userBookId, shelf),
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ['userBooks'] })
        toast.success("Book moved successfully")
      } else {
        toast.error(result.error || "Failed to move book")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    },
  })
}