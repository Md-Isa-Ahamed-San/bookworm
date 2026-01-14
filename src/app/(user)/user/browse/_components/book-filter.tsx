// src/app/(user)/browse/_components/book-filters.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Genre {
  id: string;
  name: string;
  _count: { books: number };
}

interface BookFiltersProps {
  genres: Genre[];
  currentGenre: string;
  currentSort: string;
}

export function BookFilters({
  genres,
  currentGenre,
  currentSort,
}: BookFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");

    router.push(`/user/browse?${params.toString()}`);
  };

  return (
    <div className="flex w-full gap-2 md:w-auto">
      <Select
        value={currentGenre}
        onValueChange={(val) => updateFilter("genre", val)}
      >
        <SelectTrigger className="bg-background border-border/60 w-full md:w-45">
          <SelectValue placeholder="All Genres" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={genre.id}>
              {genre.name} ({genre._count.books})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={currentSort}
        onValueChange={(val) => updateFilter("sort", val)}
      >
        <SelectTrigger className="bg-background border-border/60 w-full md:w-40">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
          <SelectItem value="title">Title (A-Z)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
