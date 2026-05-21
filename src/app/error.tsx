"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app, report to monitoring (Sentry, etc.)
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-500/10 text-red-600">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-lg font-semibold">Something went wrong</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        An unexpected error occurred. You can try again, or reload the page.
      </p>
      <div className="mt-4 flex justify-center gap-2">
        <Button variant="primary" onClick={() => reset()}>
          Try again
        </Button>
      </div>
      {error.digest && (
        <p className="mt-4 text-xs text-[var(--color-text-muted)]">
          Reference: <code>{error.digest}</code>
        </p>
      )}
    </div>
  );
}
