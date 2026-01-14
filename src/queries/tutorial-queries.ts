"use server";

import { db } from "~/server/db";

export async function getTutorials({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
} = {}) {
  const skip = (page - 1) * limit;

  const [tutorials, total] = await Promise.all([
    db.tutorial.findMany({
      select: {
        id: true,
        title: true,
        youtubeUrl: true,
        description: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.tutorial.count(),
  ]);

  return {
    tutorials,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}