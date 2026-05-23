"use client";

import { BrandLogo } from "@/components/ui/BrandLogo";
import { BRAND } from "@/lib/brand";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  activeSection,
  onNavigate,
  isOpen,
  onClose,
}: SidebarProps) {
  const mainNav = NAV_ITEMS.filter((n) => n.group === "main" || n.group === "intel");
  const personalNav = NAV_ITEMS.filter((n) => n.group === "personal");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/55 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "glass-panel fixed left-0 top-0 z-50 flex h-full w-[13.5rem] flex-col border-r border-slate-800/90 transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="border-b border-slate-800/80 px-3 py-3">
          <div className="flex items-center gap-2.5">
            <BrandLogo size="sm" />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-slate-100">
                {BRAND.name}
              </p>
              <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500">
                {BRAND.tagline}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-1.5 py-2.5" aria-label="Dashboard sections">
          <NavGroup
            label="Operations"
            items={mainNav}
            activeSection={activeSection}
            onNavigate={onNavigate}
            onClose={onClose}
          />
          <NavGroup
            label="Personal"
            items={personalNav}
            activeSection={activeSection}
            onNavigate={onNavigate}
            onClose={onClose}
            className="mt-4"
          />
        </nav>

        <div className="border-t border-slate-800/80 px-3 py-2.5">
          <p className="text-[9px] leading-relaxed text-slate-600">
            {BRAND.feedCount} sources · {BRAND.maxArticleAgeHours}h window
          </p>
        </div>
      </aside>
    </>
  );
}

function NavGroup({
  label,
  items,
  activeSection,
  onNavigate,
  onClose,
  className,
}: {
  label: string;
  items: typeof NAV_ITEMS;
  activeSection: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-1 px-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-600">
        {label}
      </p>
      <ul className="space-y-px">
        {items.map((item) => {
          const active = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  "relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors",
                  active
                    ? "bg-blue-600/12 text-blue-100"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                )}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-blue-500/90"
                    aria-hidden
                  />
                )}
                <span className="w-4 shrink-0 text-center text-xs opacity-60" aria-hidden>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
