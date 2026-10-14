"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Layers3, Menu, X, ArrowUpRight } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Innovation Lab", href: "/innovation-lab" },
  { label: "Workspace", href: "/workspace" },
  { label: "Experience", href: "/experience" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-[#294B3A]/10 bg-[#F4F0E7]/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          className="group flex shrink-0 items-center gap-3"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#294B3A] text-[#F4F0E7] transition duration-300 group-hover:rotate-[-5deg] group-hover:bg-[#365D47]">
            <Layers3 size={22} strokeWidth={1.8} />
          </span>

          <span className="leading-tight">
            <span className="block text-lg font-semibold tracking-tight text-[#26372C]">
              project<span className="text-[#B66C4D]">.</span>hub
            </span>
            <span className="mt-1 hidden text-[10px] tracking-[0.12em] text-[#858278] sm:block">
              IDEAS INTO REALITY
            </span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2.5 text-sm transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-[#294B3A] font-medium text-white shadow-sm"
                  : "text-[#62665B] hover:bg-[#E7E3D9] hover:text-[#294B3A]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right-side action */}
        <Link
          href="/projects"
          className="hidden items-center gap-2 rounded-full border border-[#294B3A]/20 px-4 py-2.5 text-sm font-medium text-[#294B3A] transition hover:border-[#294B3A] hover:bg-[#294B3A] hover:text-white sm:flex"
        >
          Explore ideas
          <ArrowUpRight size={15} />
        </Link>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#294B3A]/15 text-[#294B3A] transition hover:bg-[#E7E3D9] lg:hidden"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="border-t border-[#294B3A]/10 bg-[#F4F0E7] px-5 pb-5 pt-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  isActive(item.href)
                    ? "bg-[#294B3A] font-medium text-white"
                    : "text-[#62665B] hover:bg-[#E7E3D9] hover:text-[#294B3A]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/projects"
              onClick={() => setMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#B66C4D] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#9E593D]"
            >
              Explore ideas <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
