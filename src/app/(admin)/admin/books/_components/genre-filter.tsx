"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { Genre } from "../../../../../../generated/prisma"


interface GenreFilterProps {
  genres: Genre[]
  selectedGenres: string[]
  onSelectedGenresChange: (genres: string[]) => void
}

export function GenreFilter({
  genres,
  selectedGenres,
  onSelectedGenresChange,
}: GenreFilterProps) {
  const toggleGenre = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      onSelectedGenresChange(selectedGenres.filter((id) => id !== genreId))
    } else {
      onSelectedGenresChange([...selectedGenres, genreId])
    }
  }

  const selectedCount = selectedGenres.length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-border w-full sm:w-auto justify-between"
        >
          <span>
            {selectedCount > 0
              ? `${selectedCount} Genre${selectedCount > 1 ? "s" : ""}`
              : "All Genres"}
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-popover border-border"
      >
        {genres.map((genre) => (
          <DropdownMenuCheckboxItem
            key={genre.id}
            checked={selectedGenres.includes(genre.id)}
            onCheckedChange={() => toggleGenre(genre.id)}
            className="cursor-pointer"
          >
            {genre.name}
          </DropdownMenuCheckboxItem>
        ))}
        {genres.length === 0 && (
          <div className="px-2 py-1.5 text-sm text-muted-foreground">
            No genres available
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}