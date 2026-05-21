import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-muted)]">
        <Compass className="h-5 w-5" />
      </div>
      <h1 className="mt-4 text-lg font-semibold">Page not found</h1>
      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
        The page you’re looking for doesn’t exist.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-lg bg-[var(--color-brand)] px-4 py-2 text-sm font-medium text-[var(--color-brand-fg)] hover:opacity-90"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
