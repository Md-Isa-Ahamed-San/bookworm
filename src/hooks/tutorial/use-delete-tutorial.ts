"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTutorial } from "~/actions/tutorial-actions";
import { toast } from "sonner";

export function useDeleteTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tutorialId: string) => deleteTutorial(tutorialId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["tutorials"] });
      toast.success("Tutorial deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete tutorial");
    },
  });
}