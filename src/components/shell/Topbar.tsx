"use client";

import { Moon, Sun, Building2, Dog, Shield, Users, User } from "lucide-react";
import { useApp } from "@/lib/AppContext";
import type { Role } from "@/data/mockData";
import type { ThemeKey } from "@/data/themes";

const ROLES: { value: Role; label: string; icon: typeof Shield }[] = [
  { value: "admin", label: "Admin", icon: Shield },
  { value: "staff", label: "Staff", icon: Users },
  { value: "client", label: "Client", icon: User },
];

const THEMES: { value: ThemeKey; label: string; icon: typeof Building2 }[] = [
  { value: "generic", label: "Generic SaaS", icon: Building2 },
  { value: "petcare", label: "Pet Care", icon: Dog },
];

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { role, setRole, theme, setTheme, darkMode, toggleDarkMode, labels } = useApp();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-surface)]/70">
      <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)]"
          aria-label="Open navigation"
        >
          <span className="block h-0.5 w-4 bg-current shadow-[0_-5px_0_currentColor,0_5px_0_currentColor]" />
        </button>

        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--color-brand)] text-[var(--color-brand-fg)] text-sm font-semibold">
            {labels.brand.charAt(0)}
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">{labels.brand}</div>
            <div className="text-[11px] leading-tight text-[var(--color-text-muted)]">
              {labels.brandTagline}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SegmentedControl
            ariaLabel="Theme"
            value={theme}
            options={THEMES}
            onChange={setTheme}
          />
          <SegmentedControl
            ariaLabel="Role"
            value={role}
            options={ROLES}
            onChange={setRole}
          />
          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-2)]"
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light" : "Switch to dark"}
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon: typeof Shield;
}

function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T;
  onChange: (v: T) => void;
  options: SegmentedOption<T>[];
  ariaLabel: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="hidden md:inline-flex rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-0.5"
    >
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors " +
              (active
                ? "bg-[var(--color-brand)] text-[var(--color-brand-fg)]"
                : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]")
            }
          >
            <Icon className="h-3.5 w-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
