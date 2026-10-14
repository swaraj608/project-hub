"use client";

import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import AppLayout from "@/components/AppLayout";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [compact, setCompact] = useState(false);
  const [message, setMessage] = useState("");

  function clearWorkspace() {
    if (!window.confirm("Delete all saved projects and tasks from this browser?")) return;
    localStorage.removeItem("project-hub-projects");
    localStorage.removeItem("project-hub-tasks");
    setMessage("Saved workspace data cleared. Refresh the pages to reload starter data.");
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="mb-2 text-sm text-violet-300">MAKE IT YOURS</p>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-gray-400">Manage your workspace preferences.</p>
      </div>

      <section className="max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03] px-5">
        <Preference title="Notifications" description="Enable workspace notification preferences." value={notifications} onChange={setNotifications} />
        <Preference title="Compact layout" description="Use a more compact workspace preference." value={compact} onChange={setCompact} />
      </section>

      <section className="mt-6 max-w-2xl rounded-2xl border border-red-400/20 bg-red-400/[0.03] p-5">
        <h2 className="font-semibold text-red-300">Workspace data</h2>
        <p className="mt-2 text-sm leading-6 text-gray-400">Remove locally saved projects and tasks from this browser. This action cannot be undone.</p>
        <button onClick={clearWorkspace} className="mt-4 flex items-center gap-2 rounded-xl border border-red-400/20 px-4 py-2.5 text-sm text-red-300 hover:bg-red-400/10"><RotateCcw size={16} /> Clear saved data</button>
        {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
      </section>
    </AppLayout>
  );
}

function Preference({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-5">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      </div>
      <button type="button" role="switch" aria-checked={value} onClick={() => onChange(!value)} className={`flex h-6 w-11 shrink-0 items-center rounded-full p-1 transition ${value ? "bg-violet-600" : "bg-gray-700"}`}>
        <span className={`h-4 w-4 rounded-full bg-white transition ${value ? "translate-x-5" : "translate-x-0"}`}>{value && <Check size={12} className="text-violet-600" />}</span>
      </button>
    </div>
  );
}
