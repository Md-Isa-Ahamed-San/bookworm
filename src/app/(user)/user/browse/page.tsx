// src/app/(user)/user/browse/page.tsx
import { Suspense } from "react";
import { Skeleton } from "~/components/ui/skeleton";
// Use the alias '~' for cleaner imports
import { getAllBooks, getGenres } from "~/queries/book-queries";
import { PaginationControls } from "./_components/pagination-controls";
import { BookGrid } from "./_components/book-grid";
import { BookSearch } from "./_components/book-search";
import { BookFilters } from "./_components/book-filter";


// Next.js 15: searchParams is a Promise
interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    genre?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;

  const search = params.q || "";
  const genreId = params.genre || "all";
  const sortBy = (params.sort as "newest" | "rating" | "title") || "newest";
  const page = Number(params.page) || 1;

  const [booksData, genres] = await Promise.all([
    getAllBooks({ search, genreId, sortBy, page }),
    getGenres(),
  ]);

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="font-poppins text-foreground text-3xl font-bold tracking-tight">
            Browse Books
          </h1>
          <p className="text-muted-foreground">
            Discover your next favorite read from our collection.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <BookSearch defaultValue={search} />
          <BookFilters
            genres={genres}
            currentGenre={genreId}
            currentSort={sortBy}
          />
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<BookGridSkeleton />}>
        <BookGrid books={booksData.books} />
      </Suspense>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <PaginationControls metadata={booksData.pagination} />
      </div>
    </div>
  );
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-md" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
