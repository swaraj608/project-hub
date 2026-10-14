import Link from "next/link";
import { ArrowRight, Code2, Lightbulb, Rocket } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const experiences = [
  { icon: Lightbulb, title: "Discover", description: "Explore ideas, identify problems, and turn curiosity into clear project concepts." },
  { icon: Code2, title: "Build", description: "Organize projects, experiment with tools, and break complex work into manageable tasks." },
  { icon: Rocket, title: "Deliver", description: "Track progress, complete milestones, and move your ideas towards meaningful outcomes." },
];

export default function ExperiencePage() {
  return (
    <AppLayout>
      <div className="max-w-3xl">
        <p className="mb-2 text-sm text-violet-300">YOUR JOURNEY</p>
        <h1 className="text-3xl font-bold">Experience</h1>
        <p className="mt-3 leading-7 text-gray-400">A simple workflow to help you move from an early idea to a structured, actionable project.</p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {experiences.map(({ icon: Icon, title, description }, index) => (
          <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-400/40">
            <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300"><Icon size={23} /></span>
            <p className="mb-2 text-xs text-gray-500">STEP 0{index + 1}</p>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">{description}</p>
          </article>
        ))}
      </div>

      <Link href="/projects" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500">
        Explore your projects <ArrowRight size={17} />
      </Link>
    </AppLayout>
  );
}
