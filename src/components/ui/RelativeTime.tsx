"use client";

import { useEffect, useState } from "react";
import { formatRelative, formatTime } from "@/lib/format";

/**
 * Renders an absolute time on the server / first paint, then upgrades to a
 * relative time after mount. This avoids SSR hydration mismatches caused by
 * Date.now() differing between build-time and view-time.
 */
export function RelativeTime({ iso }: { iso: string }) {
  const [mounted, setMounted] = useState(false);
  /* eslint-disable-next-line react-hooks/set-state-in-effect */
  useEffect(() => setMounted(true), []);
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {mounted ? formatRelative(iso) : formatTime(iso)}
    </time>
  );
}
