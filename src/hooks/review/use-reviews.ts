"use client";

import { useQuery } from "@tanstack/react-query";
import { getReviews, getReviewCounts } from "~/queries/review-queries";
import type { ReviewStatus } from "../../../generated/prisma";

export function useReviews({
  status,
  page = 1,
  limit = 10,
}: {
  status?: ReviewStatus;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["reviews", { status, page, limit }],
    queryFn: () => getReviews({ status, page, limit }),
  });
}

export function useReviewCounts() {
  return useQuery({
    queryKey: ["review-counts"],
    queryFn: () => getReviewCounts(),
  });
}