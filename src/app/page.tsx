import Link from "next/link";
import AppLayout from "@/components/AppLayout";
import { starterProjects } from "@/lib/projects";
import {
  ArrowUpRight,
  Compass,
  FlaskConical,
  FolderKanban,
  Landmark,
  Lightbulb,
  MapPinned,
  Sparkles,
  CodeXml,
} from "lucide-react";

const accents = [
  {
    icon: Landmark,
    color: "text-[#D6E5B4]",
    tile: "bg-[#344B37]",
    line: "border-[#52684A]",
  },
  {
    icon: MapPinned,
    color: "text-[#E3A080]",
    tile: "bg-[#493329]",
    line: "border-[#75513E]",
  },
  {
    icon: Lightbulb,
    color: "text-[#E8CF8C]",
    tile: "bg-[#443D29]",
    line: "border-[#6C6040]",
  },
];

export default function DashboardPage() {
  const featuredProjects = starterProjects.slice(0, 3);
  const categoryCount = new Set(
    starterProjects.map((project) => project.category)
  ).size;

  return (
    <AppLayout>
      <main className="mx-auto max-w-6xl space-y-10 pb-8">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[28px] border border-[#405443] bg-[#1C2D22]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 -z-10 h-80 w-80 rounded-full border border-[#D6E5B4]/15"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-12 -z-10 h-56 w-56 rounded-full border border-[#E3A080]/20"
          />
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#52684A] bg-[#263B2B] px-3 py-2 text-xs font-medium text-[#D6E5B4]">
                <Sparkles size={14} />
                A SPACE FOR BUILDERS
              </div>

              <h1 className="mt-6 max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-[#F5F2E9] sm:text-5xl">
                Ideas into projects.
                <span className="block text-[#D6E5B4]">
                  Projects into impact.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#D0D7CC] sm:text-base">
                Discover unconventional project ideas, explore practical
                solutions to real-world problems, and turn promising
                concepts into working projects.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E5EED0]"
                >
                  Explore projects <ArrowUpRight size={17} />
                </Link>

                <Link
                  href="/innovation-lab"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#52684A] px-5 py-3 text-sm font-medium text-[#F5F2E9] transition hover:bg-[#2B4030]"
                >
                  Visit Innovation Lab <FlaskConical size={16} />
                </Link>
              </div>
            </div>

            {/* Decorative illustration */}
            <div className="relative mx-auto flex aspect-square w-full max-w-[290px] items-center justify-center">
              <div className="absolute inset-[7%] rounded-full border border-[#A9BE86]/25" />
              <div className="absolute inset-[18%] rounded-full border border-dashed border-[#E3A080]/40" />
              <div className="absolute inset-[29%] rounded-full border border-[#A9BE86]/35" />

              <div className="relative flex h-28 w-28 items-center justify-center rounded-[30px] border border-[#708A62] bg-[#344B37] shadow-2xl shadow-black/20 sm:h-32 sm:w-32">
                <FolderKanban size={48} strokeWidth={1.3} className="text-[#D6E5B4]" />
              </div>

              <div className="absolute right-[8%] top-[16%] flex h-12 w-12 items-center justify-center rounded-2xl border border-[#75513E] bg-[#493329] text-[#E3A080] shadow-lg">
                <Lightbulb size={22} />
              </div>

              <div className="absolute bottom-[14%] left-[8%] flex h-12 w-12 items-center justify-center rounded-2xl border border-[#52684A] bg-[#263B2B] text-[#D6E5B4] shadow-lg">
                <Compass size={22} />
              </div>

              <span className="absolute left-0 top-[23%] h-2 w-2 rounded-full bg-[#E3A080]" />
              <span className="absolute bottom-[20%] right-[5%] h-3 w-3 rounded-full bg-[#D6E5B4]" />
              <span className="absolute right-[22%] top-[3%] h-1.5 w-1.5 rounded-full bg-[#E8CF8C]" />
            </div>
          </div>
        </section>

        {/* Overview cards */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#6C835E]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#C0C8BC]">Project ideas</span>
              <FolderKanban size={19} className="text-[#D6E5B4] transition group-hover:scale-110" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#F5F2E9]">
              {starterProjects.length}
            </p>
            <p className="mt-1 text-xs text-[#AAB7A5]">Concepts ready to explore</p>
          </div>

          <div className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#6C835E]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#C0C8BC]">Areas of interest</span>
              <Compass size={19} className="text-[#E3A080] transition group-hover:scale-110" />
            </div>
            <p className="mt-4 text-3xl font-semibold text-[#F5F2E9]">{categoryCount}</p>
            <p className="mt-1 text-xs text-[#AAB7A5]">Different problem spaces</p>
          </div>

          <Link
            href="/innovation-lab"
            className="group rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#6C835E] hover:bg-[#202F24]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#C0C8BC]">Try something new</span>
              <ArrowUpRight size={19} className="text-[#E8CF8C] transition group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
            <p className="mt-4 text-xl font-semibold text-[#F5F2E9]">Innovation Lab</p>
            <p className="mt-1 text-xs text-[#AAB7A5]">Experiments and interactive tools</p>
          </Link>

          {/* GitHub dashboard card */}
          <Link
            href="/github"
            className="group rounded-2xl border border-[#52684A] bg-[#202F24] p-5 transition hover:-translate-y-1 hover:border-[#D6E5B4] hover:bg-[#263B2B]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#C0C8BC]">Your GitHub</span>
              <CodeXml size={20} className="text-[#D6E5B4] transition group-hover:scale-110" />
            </div>
            <p className="mt-4 text-xl font-semibold text-[#F5F2E9]">Repository Dashboard</p>
            <p className="mt-1 text-xs leading-5 text-[#AAB7A5]">
              Explore your public repositories, languages and project links.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#D6E5B4]">
              View GitHub <ArrowUpRight size={14} />
            </span>
          </Link>
        </section>

        {/* Featured projects */}
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#A9BE86]">
                PROJECT COLLECTION
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#F5F2E9] sm:text-3xl">
                Ideas worth exploring
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#C0C8BC]">
                Projects built around problems that deserve better solutions.
              </p>
            </div>
            <Link
              href="/projects"
              className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-[#D6E5B4] transition hover:bg-[#26372B]"
            >
              View all <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {featuredProjects.map((project, index) => {
              const accent = accents[index % accents.length];
              const Icon = accent.icon;

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border ${accent.line} bg-[#18231B] p-5 transition duration-300 hover:-translate-y-1 hover:bg-[#202F24]`}
                >
                  <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-full ${accent.tile} opacity-30 transition group-hover:opacity-60`} />

                  <div className="relative flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.tile} ${accent.color}`}>
                      <Icon size={23} strokeWidth={1.6} />
                    </div>
                    <ArrowUpRight size={19} className="text-[#AAB7A5] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#D6E5B4]" />
                  </div>

                  <p className="mt-5 text-xs font-medium text-[#D6E5B4]">{project.category}</p>
                  <h3 className="mt-2 text-xl font-semibold text-[#F5F2E9]">{project.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-[#C0C8BC]">{project.description}</p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#344339] pt-4">
                    <span className="text-xs text-[#C0C8BC]">{project.status}</span>
                    <span className="text-xs font-medium text-[#D6E5B4]">Explore idea</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Closing section */}
        <section className="relative overflow-hidden rounded-2xl border border-[#405443] bg-[#202F24] p-6 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full border border-[#A9BE86]/20" />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#E3A080]">START WITH A PROBLEM</p>
            <h2 className="mt-2 text-xl font-semibold text-[#F5F2E9] sm:text-2xl">
              The next idea could start here.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#C0C8BC]">
              Explore the collection, find a problem worth solving, and see where it takes you.
            </p>
          </div>
          <Link
            href="/projects"
            className="relative mt-5 inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E5EED0] sm:mt-0"
          >
            Find your next project <ArrowUpRight size={17} />
          </Link>
        </section>
      </main>
    </AppLayout>
  );
}
