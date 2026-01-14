"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTutorial } from "~/actions/tutorial-actions";
import { toast } from "sonner";

export function useUpdateTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tutorialId,
      data,
    }: {
      tutorialId: string;
      data: { title: string; youtubeUrl: string; description?: string };
    }) => updateTutorial(tutorialId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutorials"] });
      toast.success("Tutorial updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update tutorial");
    },
  });
}