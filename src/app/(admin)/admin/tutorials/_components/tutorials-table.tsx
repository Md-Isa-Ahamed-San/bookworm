"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

import { ConfirmationDialog } from "~/components/confirmation-dialog";
import { PaginationControls } from "~/app/(admin)/admin/books/_components/pagination-controls";
import { useTutorials } from "~/hooks/tutorial/use-tutorials";
import { useDeleteTutorial } from "~/hooks/tutorial/use-delete-tutorial";
import { TutorialRow } from "./tutorial-row";
import { TutorialFormDialog } from "./tutorial-form-dialog";

type TutorialWithCreator = {
  id: string;
  title: string;
  youtubeUrl: string;
  description: string | null;
  createdAt: Date;
  createdBy: { id: string; name: string };
};

export function TutorialsTable() {
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingTutorial, setEditingTutorial] =
    useState<TutorialWithCreator | null>(null);
  const [deletingTutorial, setDeletingTutorial] =
    useState<TutorialWithCreator | null>(null);

  const { data, isLoading, isFetching, isError, error } = useTutorials({
    page,
    limit: 10,
  });

  const deleteTutorial = useDeleteTutorial();

  const handleDelete = () => {
    if (deletingTutorial) {
      deleteTutorial.mutate(deletingTutorial.id, {
        onSuccess: () => setDeletingTutorial(null),
      });
    }
  };

  const { tutorials, pagination } = data || { tutorials: [], pagination: null };

  return (
    <>
      <Card className="bg-card border-border">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-poppins text-foreground text-xl font-bold">
                All Tutorials
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {pagination?.total || 0} tutorial(s) total
              </p>
            </div>
            <Button
              onClick={() => setIsAddOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Tutorial
            </Button>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="text-primary mb-4 h-8 w-8 animate-spin" />
              <p className="text-muted-foreground text-sm">
                Loading tutorials...
              </p>
            </div>
          ) : isError ? (
            <div className="border-destructive/50 rounded-lg border border-dashed py-12 text-center">
              <p className="text-destructive mb-2 font-medium">
                Failed to load tutorials
              </p>
              <p className="text-muted-foreground text-sm">{error?.message}</p>
            </div>
          ) : !tutorials || tutorials.length === 0 ? (
            <div className="border-border rounded-lg border border-dashed py-12 text-center">
              <p className="text-foreground mb-2 font-medium">
                No tutorials yet
              </p>
              <p className="text-muted-foreground mb-4 text-sm">
                Get started by adding your first tutorial
              </p>
            </div>
          ) : (
            <div
              className={`space-y-3 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}
            >
              {tutorials.map((tutorial) => (
                <TutorialRow
                  key={tutorial.id}
                  tutorial={tutorial}
                  onEdit={() => setEditingTutorial(tutorial)}
                  onDelete={() => setDeletingTutorial(tutorial)}
                />
              ))}

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6">
                  <PaginationControls
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Add Dialog */}
      <TutorialFormDialog open={isAddOpen} onOpenChange={setIsAddOpen} />

      {/* Edit Dialog */}
      {editingTutorial && (
        <TutorialFormDialog
          tutorial={editingTutorial}
          open={!!editingTutorial}
          onOpenChange={(open) => !open && setEditingTutorial(null)}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={!!deletingTutorial}
        onOpenChange={(open) => !open && setDeletingTutorial(null)}
        onConfirm={handleDelete}
        title="Delete Tutorial"
        description={
          deletingTutorial
            ? `Are you sure you want to delete "${deletingTutorial.title}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  );
}
