// ==========================================
// 📁 src/app/(user)/tutorials/_components/tutorial-grid.tsx
// ==========================================
"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";

import { Play } from "lucide-react";
import type { Tutorial } from "../../../../../../generated/prisma";
import { VideoModal } from "./video-modal";


interface TutorialGridProps {
  tutorials: Tutorial[];
}

export function TutorialGrid({ tutorials }: TutorialGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<Tutorial | null>(null);

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] ?? url.split("/").pop();
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <Card
            key={tutorial.id}
            className="group cursor-pointer overflow-hidden border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={() => setSelectedVideo(tutorial)}
          >
            <CardContent className="p-0">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-muted">
                <img
                  src={getYouTubeThumbnail(tutorial.youtubeUrl)}
                  alt={tutorial.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90">
                    <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h3 className="font-poppins font-bold text-sm leading-tight line-clamp-2 text-card-foreground">
                  {tutorial.title}
                </h3>
                {tutorial.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {tutorial.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          tutorial={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}