import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { AppProvider } from "@/lib/AppContext";

export function renderWithApp(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: AppProvider, ...options });
}

export * from "@testing-library/react";
