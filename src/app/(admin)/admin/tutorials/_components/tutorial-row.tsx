"use client";

import { Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";

type TutorialWithCreator = {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string | null;
  createdAt: Date;
  createdBy: { id: string; name: string };
};

export function TutorialRow({
  tutorial,
  onEdit,
  onDelete,
}: {
  tutorial: TutorialWithCreator;
  onEdit: () => void;
  onDelete: () => void;
}) {
  // Truncate URL for display
  const truncatedUrl =
    tutorial.youtubeUrl.length > 50
      ? tutorial.youtubeUrl.substring(0, 50) + "..."
      : tutorial.youtubeUrl;

  return (
    <div className="border-border bg-card hover:bg-accent/5 flex items-center justify-between rounded-lg border p-4 transition-colors">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="font-poppins text-foreground truncate font-bold">
          {tutorial.title}
        </p>
        <div className="flex items-center gap-2">
          <a
            href={tutorial.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary flex items-center gap-1 truncate text-sm hover:underline"
          >
            {truncatedUrl}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
        {tutorial.description && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {tutorial.description}
          </p>
        )}
        <p className="text-muted-foreground text-xs">
          Added by {tutorial.createdBy.name} on{" "}
          {new Date(tutorial.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="ml-4 flex shrink-0 gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onEdit}
          className="border-border hover:bg-accent"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
