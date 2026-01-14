"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { updateProgress } from "~/actions/shelf-actions"

export function useUpdateProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userBookId, progress }: { userBookId: string; progress: number }) =>
      updateProgress(userBookId, progress),
    onSuccess: (result) => {
      if (result.success) {
        void queryClient.invalidateQueries({ queryKey: ['userBooks'] })
        toast.success("Progress updated successfully")
      } else {
        toast.error(result.error || "Failed to update progress")
      }
    },
    onError: () => {
      toast.error("An unexpected error occurred")
    },
  })
}