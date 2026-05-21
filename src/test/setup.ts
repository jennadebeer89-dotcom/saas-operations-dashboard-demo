import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// jsdom doesn't ship ResizeObserver, which Recharts uses.
const g = globalThis as unknown as { ResizeObserver?: typeof ResizeObserverMock };
g.ResizeObserver ??= ResizeObserverMock;
