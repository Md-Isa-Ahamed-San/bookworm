"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateTutorial } from "~/hooks/tutorial/use-create-tutorial";
import { useUpdateTutorial } from "~/hooks/tutorial/use-update-tutorial";

const tutorialSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  youtubeUrl: z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.includes("youtube.com") || url.includes("youtu.be"),
      "Must be a YouTube URL"
    ),
  description: z.string().optional(),
});

type TutorialFormData = z.infer<typeof tutorialSchema>;

type TutorialWithCreator = {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string | null;
  createdAt: Date;
  createdBy: { id: string; name: string };
};

export function TutorialFormDialog({
  tutorial,
  open,
  onOpenChange,
}: {
  tutorial?: TutorialWithCreator;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const isEditing = !!tutorial;
  const createTutorial = useCreateTutorial();
  const updateTutorial = useUpdateTutorial();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TutorialFormData>({
    resolver: zodResolver(tutorialSchema),
    defaultValues: {
      title: tutorial?.title || "",
      youtubeUrl: tutorial?.youtubeUrl || "",
      description: tutorial?.description || "",
    },
  });

  useEffect(() => {
    if (tutorial) {
      reset({
        title: tutorial.title,
        youtubeUrl: tutorial.youtubeUrl,
        description: tutorial.description || "",
      });
    } else {
      reset({ title: "", youtubeUrl: "", description: "" });
    }
  }, [tutorial, reset]);

  const onSubmit = async (data: TutorialFormData) => {
    if (isEditing) {
      updateTutorial.mutate(
        { tutorialId: tutorial.id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
            reset();
          },
        }
      );
    } else {
      createTutorial.mutate(data, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        },
      });
    }
  };

  const isPending = createTutorial.isPending || updateTutorial.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-poppins text-foreground">
            {isEditing ? "Edit Tutorial" : "Add Tutorial"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isEditing
              ? "Update the tutorial information"
              : "Add a new YouTube tutorial video"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-poppins font-bold text-foreground">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Top 10 Books of 2024"
              disabled={isPending}
              className="bg-input border-border text-foreground"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* YouTube URL */}
          <div className="space-y-2">
            <Label htmlFor="youtubeUrl" className="font-poppins font-bold text-foreground">
              YouTube URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="youtubeUrl"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              disabled={isPending}
              className="bg-input border-border text-foreground"
              {...register("youtubeUrl")}
            />
            <p className="text-xs text-muted-foreground">
              Paste any YouTube video URL (watch, embed, or short link)
            </p>
            {errors.youtubeUrl && (
              <p className="text-sm text-destructive">{errors.youtubeUrl.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-poppins font-bold text-foreground">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Brief description of the tutorial..."
              rows={3}
              disabled={isPending}
              className="bg-input border-border text-foreground resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Tutorial"
              ) : (
                "Add Tutorial"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}