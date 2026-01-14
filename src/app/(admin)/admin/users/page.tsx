import { UsersTable } from "./_components/users-table";



export default function ManageUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Manage Users
        </h1>
        <p className="text-muted-foreground mt-2">
          View and manage user roles
        </p>
      </div>

      <UsersTable />
    </div>
  );
}