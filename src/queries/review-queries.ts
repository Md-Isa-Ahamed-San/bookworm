"use server";

import { db } from "~/server/db";
import type { ReviewStatus } from "../../generated/prisma";


export async function getReviews({
  status,
  page = 1,
  limit = 10,
}: {
  status?: ReviewStatus;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      select: {
        id: true,
        rating: true,
        text: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        book: {
          select: {
            id: true,
            title: true,
            author: true,
            coverUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.review.count({ where }),
  ]);

  return {
    reviews,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getReviewCounts() {
  const [all, pending, approved, rejected] = await Promise.all([
    db.review.count(),
    db.review.count({ where: { status: "PENDING" } }),
    db.review.count({ where: { status: "APPROVED" } }),
    db.review.count({ where: { status: "REJECTED" } }),
  ]);

  return { all, pending, approved, rejected };
}