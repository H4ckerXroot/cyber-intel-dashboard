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

      {/* Mobile drawer */}
      <aside
        className={cn(
          "glass-panel fixed left-0 top-0 z-50 flex h-full w-56 flex-col border-r border-slate-800/90 transition-transform duration-200 lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent
          mainNav={mainNav}
          personalNav={personalNav}
          activeSection={activeSection}
          onNavigate={onNavigate}
          onClose={onClose}
          expanded
        />
      </aside>

      {/* Desktop: sticky, collapsed → expand on hover */}
      <aside
        className={cn(
          "group/sidebar glass-panel hidden h-screen w-14 shrink-0 flex-col overflow-hidden",
          "border-r border-slate-800/90 transition-[width] duration-200 ease-out",
          "hover:w-56 lg:sticky lg:top-0 lg:flex"
        )}
      >
        <SidebarContent
          mainNav={mainNav}
          personalNav={personalNav}
          activeSection={activeSection}
          onNavigate={onNavigate}
          onClose={onClose}
          expanded={false}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  mainNav,
  personalNav,
  activeSection,
  onNavigate,
  onClose,
  expanded,
}: {
  mainNav: typeof NAV_ITEMS;
  personalNav: typeof NAV_ITEMS;
  activeSection: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
  expanded: boolean;
}) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center border-b border-slate-800/80 px-3">
        <BrandLogo size="sm" />
        <div
          className={cn(
            "ml-2.5 min-w-0 overflow-hidden transition-opacity duration-200",
            expanded
              ? "opacity-100"
              : "w-0 opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100"
          )}
        >
          <p className="truncate text-sm font-semibold text-slate-100">{BRAND.name}</p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            {BRAND.tagline}
          </p>
        </div>
      </div>

      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden px-1.5 py-2"
        aria-label="Dashboard sections"
      >
        <NavGroup
          label="Operations"
          items={mainNav}
          activeSection={activeSection}
          onNavigate={onNavigate}
          onClose={onClose}
          expanded={expanded}
        />
        <NavGroup
          label="Personal"
          items={personalNav}
          activeSection={activeSection}
          onNavigate={onNavigate}
          onClose={onClose}
          expanded={expanded}
          className="mt-4"
        />
      </nav>

      <div className="shrink-0 border-t border-slate-800/80 px-3 py-2.5">
        <p
          className={cn(
            "overflow-hidden text-[10px] leading-relaxed text-slate-600 transition-opacity duration-200",
            expanded
              ? "opacity-100"
              : "h-0 opacity-0 group-hover/sidebar:h-auto group-hover/sidebar:opacity-100"
          )}
        >
          {BRAND.feedCount} sources · {BRAND.maxArticleAgeHours}h
        </p>
      </div>
    </>
  );
}

function NavGroup({
  label,
  items,
  activeSection,
  onNavigate,
  onClose,
  expanded,
  className,
}: {
  label: string;
  items: typeof NAV_ITEMS;
  activeSection: string;
  onNavigate: (id: string) => void;
  onClose: () => void;
  expanded: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <p
        className={cn(
          "mb-1 overflow-hidden px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-600 transition-opacity duration-200",
          expanded
            ? "opacity-100"
            : "h-0 opacity-0 group-hover/sidebar:h-auto group-hover/sidebar:opacity-100"
        )}
      >
        {label}
      </p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const active = activeSection === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                title={item.label}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={cn(
                  "relative flex w-full items-center gap-2.5 rounded-md py-2 text-left text-sm transition-colors",
                  expanded ? "px-2" : "justify-center px-0 group-hover/sidebar:justify-start group-hover/sidebar:px-2",
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
                <span className="w-5 shrink-0 text-center text-sm opacity-80" aria-hidden>
                  {item.icon}
                </span>
                <span
                  className={cn(
                    "truncate transition-opacity duration-200",
                    expanded
                      ? "opacity-100"
                      : "w-0 overflow-hidden opacity-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
