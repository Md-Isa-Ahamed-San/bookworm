import { TutorialsTable } from "./_components/tutorials-table";

export default function ManageTutorialsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-poppins font-bold text-foreground">
          Manage Tutorials
        </h1>
        <p className="text-muted-foreground mt-2">
          Add and manage YouTube tutorial videos
        </p>
      </div>

      <TutorialsTable />
    </div>
  );
}