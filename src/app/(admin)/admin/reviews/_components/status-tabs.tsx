"use client";

import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Badge } from "~/components/ui/badge";
import type { ReviewStatus } from "../../../../../../generated/prisma";


export function StatusTabs({
  selectedStatus,
  onStatusChange,
  counts,
}: {
  selectedStatus: ReviewStatus | "ALL";
  onStatusChange: (status: ReviewStatus | "ALL") => void;
  counts?: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}) {
  return (
    <Tabs value={selectedStatus} onValueChange={(value) => onStatusChange(value as ReviewStatus | "ALL")} className="mb-6">
      <TabsList className="grid w-full grid-cols-4 bg-muted">
        <TabsTrigger value="ALL" className="data-[state=active]:bg-background">
          All
          {counts && (
            <Badge variant="secondary" className="ml-2">
              {counts.all}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="PENDING" className="data-[state=active]:bg-background">
          Pending
          {counts && counts.pending > 0 && (
            <Badge variant="default" className="ml-2 bg-yellow-500">
              {counts.pending}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="APPROVED" className="data-[state=active]:bg-background">
          Approved
          {counts && (
            <Badge variant="secondary" className="ml-2">
              {counts.approved}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="REJECTED" className="data-[state=active]:bg-background">
          Rejected
          {counts && (
            <Badge variant="secondary" className="ml-2">
              {counts.rejected}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}