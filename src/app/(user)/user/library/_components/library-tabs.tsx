"use client"

import Link from "next/link"
import { cn } from "~/lib/utils"
import { BookOpen, BookPlus, CheckCircle } from "lucide-react"
import type { ShelfType } from "../../../../../../generated/prisma"


interface LibraryTabsProps {
  currentShelf: ShelfType
}

export function LibraryTabs({ currentShelf }: LibraryTabsProps) {
  const tabs = [
    {
      value: "CURRENTLY_READING",
      label: "Currently Reading",
      icon: BookOpen,
    },
    {
      value: "WANT_TO_READ",
      label: "Want to Read",
      icon: BookPlus,
    },
    {
      value: "READ",
      label: "Read",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="border-b border-border/40">
      <div className="flex overflow-x-auto no-scrollbar gap-6">
        {tabs.map((tab) => {
          const isActive = currentShelf === tab.value
          const Icon = tab.icon
          
          return (
            <Link
              key={tab.value}
              href={`/user/library?shelf=${tab.value}`}
              scroll={false} // Prevents scrolling to top on tab switch
              className={cn(
                "flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap px-1",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}