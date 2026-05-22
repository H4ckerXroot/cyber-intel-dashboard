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
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "glass-panel fixed left-0 top-0 z-50 flex h-full w-60 flex-col border-r border-slate-800/80 transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="border-b border-slate-800/80 px-4 py-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-100">
                {BRAND.name}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">
                {BRAND.tagline}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Dashboard sections">
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
            className="mt-5"
          />
        </nav>

        <div className="border-t border-slate-800/80 p-4">
          <p className="text-[10px] leading-relaxed text-slate-600">
            {BRAND.feedCount} sources · Last {BRAND.maxArticleAgeHours}h
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
      <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-slate-600">
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                activeSection === item.id
                  ? "bg-blue-600/15 text-blue-200"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              )}
            >
              <span className="text-sm opacity-70" aria-hidden>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
