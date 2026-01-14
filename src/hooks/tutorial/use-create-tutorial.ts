"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTutorial } from "~/actions/tutorial-actions";
import { toast } from "sonner";

export function useCreateTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      youtubeUrl: string;
      description?: string;
    }) => createTutorial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tutorials"] });
      toast.success("Tutorial created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create tutorial");
    },
  });
}