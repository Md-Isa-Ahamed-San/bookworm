"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectReview } from "~/actions/review-actions";
import { toast } from "sonner";

export function useRejectReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => rejectReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-counts"] });
      toast.success("Review rejected");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reject review");
    },
  });
}