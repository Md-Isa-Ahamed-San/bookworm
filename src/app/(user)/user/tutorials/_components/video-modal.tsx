// ==========================================
// 📁 src/app/(user)/tutorials/_components/video-modal.tsx
// ==========================================
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import type { Tutorial } from "../../../../../../generated/prisma";


interface VideoModalProps {
  tutorial: Tutorial;
  onClose: () => void;
}

export function VideoModal({ tutorial, onClose }: VideoModalProps) {
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] ?? url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-poppins text-xl font-bold">
            {tutorial.title}
          </DialogTitle>
          {tutorial.description && (
            <p className="text-sm text-muted-foreground">
              {tutorial.description}
            </p>
          )}
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={getYouTubeEmbedUrl(tutorial.youtubeUrl)}
            title={tutorial.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}