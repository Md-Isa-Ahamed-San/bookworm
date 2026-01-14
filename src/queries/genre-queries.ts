"use server";

import { db } from "../server/db";

export async function getAllGenres() {
  try {
    const genres = await db.genre.findMany({
      include: {
        _count: {
          select: { books: true },
        },
      },
      orderBy: { name: "asc" },
    });
    return genres;
  } catch (error) {
    //console..error("Error fetching genres:", error)
    throw new Error("Failed to fetch genres");
  }
}
