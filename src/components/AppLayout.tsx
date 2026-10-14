
import type { ReactNode } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const mobileNavItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/innovation-lab", label: "Lab" },
  { href: "/workspace", label: "Tasks" },
];

export default function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111914] text-[#F5F2E9]">
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-[#344339] bg-[#18231B] md:block">
          <Sidebar />
        </aside>

        {/* Main application area */}
        <div className="min-w-0 flex-1">
          <Navbar />

          <main className="mx-auto w-full max-w-[1500px] px-5 py-7 pb-28 sm:px-7 md:px-8 md:py-10 md:pb-10">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[#344339] bg-[#18231B]/95 px-2 py-2 backdrop-blur-lg md:hidden"
      >
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1">
          {mobileNavItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-3 py-2.5 text-xs font-medium text-[#E0E5DA] transition-colors hover:bg-[#344339] hover:text-[#D6E5B4]"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
