// ==========================================
// 📁 src/app/(user)/dashboard/page.tsx
// ==========================================
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getUserDashboardData } from "~/queries/user-queries";
import { DashboardGreeting } from "./_components/dashboard-greeting";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { RecommendationsSection } from "./_components/recommendations-section";
import { RecentActivity } from "./_components/recent-activity";
import { StatsOverview } from "./_components/stats-overview";
import { CurrentReadHero } from "./_components/current-read-hero";
import { getSession } from "../../../../server/better-auth/server";
import { LoadingSpinner } from "../../../../components/loading-spinner";
import { EmptyState } from "../../../../components/empty-state";

export const metadata = {
  title: "Dashboard - BookWorm",
  description: "Your personalized reading dashboard",
};

async function DashboardContent() {
  const session = await getSession();
  if (!session) redirect("/login");

  const data = await getUserDashboardData();
  // console.log(data)
  // First-time user experience
  if (data.stats.totalBooks === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <EmptyState
          icon={BookOpen}
          title="Welcome to BookWorm!"
          description="Start your reading journey by browsing our collection and adding books to your library."
          actionLabel="Browse Books"
          onAction={() => { /* empty */ }}
        />
        <div className="mt-8 text-center">
          <Link href="/user/browse">
            <Button size="lg" className="font-poppins font-bold">
              Explore Books →
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Greeting */}
      <DashboardGreeting userName={session.user.name || "Reader"} />

      {/* Current Reading Hero */}
      {data.currentReading && (
        <CurrentReadHero currentReading={data.currentReading} />
      )}

      {/* Stats Overview */}
      <StatsOverview stats={data.stats} />

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <RecommendationsSection
          recommendations={data.recommendations}
          genreName={data.topGenreName}
        />
      )}

      {/* Recent Activity */}
      {data.recentReviews.length > 0 && (
        <RecentActivity reviews={data.recentReviews} />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
