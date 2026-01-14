"use client";

import { useState } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { PaginationControls } from "~/app/(admin)/admin/books/_components/pagination-controls";

import { useDebouncedValue } from "~/hooks/books/use-debounced-value";
import { useUsers } from "../../../../../hooks/user/user-users";
import { RoleFilter } from "./role-filter";
import { UserRow } from "./user-row";

export function UsersTable() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<"USER" | "ADMIN" | undefined>();
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isFetching, isError, error } = useUsers({
    search: debouncedSearch,
    role: selectedRole,
    page,
    limit: 10,
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedRole(undefined);
    setPage(1);
  };

  const hasFilters = search || selectedRole;
  const { users, pagination } = data || { users: [], pagination: null };

  return (
    <Card className="bg-card border-border">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-poppins font-bold text-foreground">
              All Users
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {pagination?.total || 0} user(s) total
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-input border-border"
              />
            </div>

            <RoleFilter
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
            />
          </div>

          {hasFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="border-border"
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground text-sm">Loading users...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12 border border-dashed border-destructive/50 rounded-lg">
            <p className="text-destructive font-medium mb-2">Failed to load users</p>
            <p className="text-muted-foreground text-sm">{error?.message}</p>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-foreground font-medium mb-2">
              {hasFilters ? "No users found" : "No users yet"}
            </p>
            <p className="text-muted-foreground text-sm">
              {hasFilters ? "Try adjusting your filters" : ""}
            </p>
          </div>
        ) : (
          <div className={`space-y-3 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}>
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6">
                <PaginationControls
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}