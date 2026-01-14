// src/app/(user)/user/browse/_components/book-search.tsx
"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "~/components/ui/input";
import { useDebouncedCallback } from "use-debounce"; 

export function BookSearch({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // Reset to page 1 on new search
    params.set("page", "1");

    startTransition(() => {
      router.replace(`/user/browse?${params.toString()}`);
    });
  }, 300);

  return (
    <div className="relative w-full md:w-75">
      <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Search title or author..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-background border-border/60 focus-visible:ring-primary/20 pl-9"
      />
      {isPending && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2">
          <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      )}
    </div>
  );
}
