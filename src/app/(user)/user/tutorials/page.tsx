// ==========================================
// 📁 src/app/(user)/tutorials/page.tsx
// ==========================================
import { Suspense } from "react";
import { getAllTutorials } from "~/queries/user-queries";

import { Video } from "lucide-react";
import { EmptyState } from "../../../../components/empty-state";
import { TutorialGrid } from "./_components/tutorial-grid";
import { LoadingSpinner } from "../../../../components/loading-spinner";

export const metadata = {
  title: "Tutorials - BookWorm",
  description: "Book recommendations and reading tips",
};

async function TutorialsContent() {
  const tutorials = await getAllTutorials();

  if (tutorials.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={Video}
          title="No Tutorials Available"
          description="Check back later for book recommendations and reading tips!"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="font-poppins text-3xl font-bold text-foreground">
          Book Tutorials & Reviews
        </h1>
        <p className="text-muted-foreground">
          Discover new books and improve your reading experience
        </p>
      </div>

      <TutorialGrid tutorials={tutorials} />
    </div>
  );
}

export default function TutorialsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <TutorialsContent />
    </Suspense>
  );
}