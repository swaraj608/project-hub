
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  FolderKanban,
  Lightbulb,
  ListTodo,
  Settings,
  FlaskConical,
  ArrowUpRight,
  Sparkles,
  CodeXml,
  ChevronRight,
} from "lucide-react";

const navGroups = [
  {
    label: "YOUR SPACE",
    items: [
      { label: "Home", href: "/", icon: House },
      { label: "Projects", href: "/projects", icon: FolderKanban },
      { label: "Workspace", href: "/workspace", icon: ListTodo },
    ],
  },
  {
    label: "DEVELOPER SPACE",
    items: [
      { label: "GitHub", href: "/github", icon: CodeXml },
    ],
  },
  {
    label: "EXPLORE",
    items: [
      {
        label: "Innovation Lab",
        href: "/innovation-lab",
        icon: Lightbulb,
      },
      {
        label: "Experience",
        href: "/experience",
        icon: FlaskConical,
      },
    ],
  },
  {
    label: "PREFERENCES",
    items: [{ label: "Settings", href: "/settings", icon: Settings }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-[#344339] bg-[#18231B] px-4 py-6 text-[#F5F2E9]">
      {/* Brand */}
      <Link href="/" className="mb-9 flex items-center gap-3 px-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#52684A] bg-[#344B37] text-[#D6E5B4] shadow-lg shadow-black/10">
          <FolderKanban size={22} strokeWidth={1.8} />
        </div>

        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            project<span className="text-[#E3A080]">.</span>hub
          </h2>
          <p className="mt-1 text-[10px] tracking-[0.14em] text-[#B8C4B4]">
            YOUR CREATIVE SPACE
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <div className="flex-1 space-y-7 overflow-y-auto pb-3">
        {navGroups.map((group) => (
          <section key={group.label}>
            <p className="mb-3 px-3 text-[10px] font-semibold tracking-[0.16em] text-[#AAB7A5]">
              {group.label}
            </p>

            <nav className="space-y-1">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = isActive(href);
                const isGitHub = href === "/github";

                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                      active
                        ? "border border-[#52684A] bg-[#344B37] font-medium text-[#E1EDC9]"
                        : isGitHub
                          ? "border border-transparent text-[#D6E5B4] hover:border-[#405443] hover:bg-[#26372B]"
                          : "border border-transparent text-[#E0E5DA] hover:bg-[#26372B] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#D6E5B4]" />
                    )}

                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className={`shrink-0 transition-colors ${
                        active
                          ? "text-[#D6E5B4]"
                          : "text-[#B8C4B4] group-hover:text-[#E3A080]"
                      }`}
                    />

                    <span className="flex-1">{label}</span>

                    {isGitHub && !active && (
                      <span className="rounded-md border border-[#52684A] px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-[#D6E5B4]">
                        NEW
                      </span>
                    )}

                    {active && (
                      <ChevronRight
                        size={15}
                        className="text-[#D6E5B4]"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </section>
        ))}
      </div>

      {/* GitHub profile shortcut */}
      <a
        href="https://github.com/swaraj608"
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-4 flex items-center gap-3 rounded-xl border border-[#344339] bg-[#202F24] p-3 transition hover:border-[#6C835E] hover:bg-[#263B2B]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#344B37] text-[#D6E5B4]">
          <CodeXml size={21} /> 
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#F5F2E9]">
            GitHub Profile
          </p>
          <p className="mt-1 truncate text-[11px] text-[#AAB7A5]">
            @swaraj608
          </p>
        </div>

        <ArrowUpRight
          size={15}
          className="shrink-0 text-[#AAB7A5] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D6E5B4]"
        />
      </a>

      {/* Idea card */}
      <div className="rounded-2xl border border-[#405443] bg-[#202F24] p-4">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-[#344B37] text-[#D6E5B4]">
          <Sparkles size={18} />
        </div>

        <h3 className="text-sm font-medium text-[#F5F2E9]">
          Got a new idea?
        </h3>

        <p className="mt-2 text-xs leading-5 text-[#C0C8BC]">
          Give it a place to grow. Your next project starts here.
        </p>

        <Link
          href="/projects"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#E3A080] transition hover:text-[#F1B99D]"
        >
          Browse projects
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-5 border-t border-[#344339] pt-4">
        <p className="px-2 text-xs text-[#AAB7A5]">
          Made for ideas worth building.
        </p>
      </div>
    </aside>
  );
}
