// ==========================================
// 📁 src/components/shared/error-display.tsx
// ==========================================
import { AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

interface ErrorDisplayProps {
  error: Error | string;
  onRetry?: () => void;
}

export function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const errorMessage = typeof error === "string" ? error : error.message;

  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="mt-2 flex flex-col gap-3">
        <p className="text-sm">{errorMessage}</p>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="w-fit"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}