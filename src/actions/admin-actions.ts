// src/actions/admin-actions.ts
"use server";

import { getAdminStats } from "~/queries/admin-queries";
import { getSession } from "../server/better-auth/server";

export async function fetchDashboardStats() {
  // Basic auth check (adjust based on your Better Auth setup)
  const session = await getSession();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }
  try {
    const stats = await getAdminStats();
    return { success: true, data: stats };
  } catch (error) {
    // //console..error("Failed to fetch admin stats:", error)
    return { success: false, error: "Failed to load dashboard data" };
  }
}
