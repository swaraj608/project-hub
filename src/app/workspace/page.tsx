
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { readTasks, saveTasks, type Task } from "@/lib/storage";

const starterTasks: Task[] = [
  {
    id: 1,
    title: "Refine the core problem statement",
    done: false,
    priority: "High",
  },
  {
    id: 2,
    title: "Review project requirements",
    done: false,
    priority: "Medium",
  },
  {
    id: 3,
    title: "Prepare the next milestone",
    done: true,
    priority: "Low",
  },
];

const priorityStyle: Record<Task["priority"], string> = {
  High: "border-[#7A4938] bg-[#3A2821] text-[#F0B69A]",
  Medium: "border-[#6B7448] bg-[#303724] text-[#D6E5B4]",
  Low: "border-[#405C43] bg-[#202F24] text-[#BFD2A7]",
};

export default function WorkspacePage() {
  const [tasks, setTasks] = useState<Task[]>(starterTasks);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTasks(readTasks(starterTasks));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      saveTasks(tasks);
    }
  }, [tasks, loaded]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: title.trim(),
        done: false,
        priority,
      },
    ]);

    setTitle("");
  }

  const completed = tasks.filter((task) => task.done).length;
  const remaining = tasks.length - completed;
  const completionRate =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold tracking-wide text-[#D6E5B4]">
          PLAN YOUR NEXT MOVE
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl">
          Workspace
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C0C8BC] sm:text-base">
          A focused space to organise your next steps, manage priorities, and
          keep track of progress.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total tasks" value={tasks.length} />
        <Stat label="Completed" value={completed} />
        <Stat label="Remaining" value={remaining} />
      </div>

      <section className="mb-6 rounded-2xl border border-[#344339] bg-[#18231B] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-[#F5F2E9]">Your momentum</h2>
            <p className="mt-1 text-xs text-[#AAB7A5]">
              Small steps still move a project forward.
            </p>
          </div>

          <span className="text-lg font-bold text-[#D6E5B4]">
            {completionRate}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-[#344339]"
          role="progressbar"
          aria-label="Task completion"
          aria-valuenow={completionRate}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-[#A9BE86] transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </section>

      <form
        onSubmit={addTask}
        className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#344339] bg-[#18231B] p-4 sm:flex-row"
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to get done?"
          aria-label="New task title"
          className="min-w-0 flex-1 rounded-xl border border-[#344339] bg-[#111914] px-4 py-3 text-sm text-[#F5F2E9] outline-none placeholder:text-[#879487] focus:border-[#A9BE86] focus:ring-2 focus:ring-[#A9BE86]/15"
        />

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as Task["priority"])
          }
          aria-label="Task priority"
          className="rounded-xl border border-[#344339] bg-[#111914] px-3 py-3 text-sm text-[#F5F2E9] outline-none focus:border-[#A9BE86]"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 text-sm font-semibold text-[#18231B] transition hover:bg-[#E3EDCE]"
        >
          <Plus size={17} />
          Add task
        </button>
      </form>

      <section className="overflow-hidden rounded-2xl border border-[#344339] bg-[#18231B]">
        <div className="flex items-center justify-between gap-3 border-b border-[#344339] p-5">
          <div>
            <h2 className="font-semibold text-[#F5F2E9]">Your tasks</h2>
            <p className="mt-1 text-xs text-[#AAB7A5]">
              Check off tasks as you make progress.
            </p>
          </div>

          <span className="rounded-full border border-[#405C43] bg-[#202F24] px-3 py-1 text-xs text-[#D6E5B4]">
            {completed}/{tasks.length} done
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#26372B] text-[#D6E5B4]">
              <Check size={22} />
            </div>
            <p className="mt-4 font-medium text-[#F5F2E9]">
              Nothing on the list yet
            </p>
            <p className="mt-2 text-sm text-[#C0C8BC]">
              Add your first task above and get moving.
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-3 border-b border-[#344339]/70 p-4 transition last:border-0 hover:bg-[#202F24]/60"
            >
              <button
                type="button"
                aria-label={
                  task.done
                    ? `Mark ${task.title} as incomplete`
                    : `Mark ${task.title} as complete`
                }
                aria-pressed={task.done}
                onClick={() =>
                  setTasks((current) =>
                    current.map((item) =>
                      item.id === task.id
                        ? { ...item, done: !item.done }
                        : item
                    )
                  )
                }
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                  task.done
                    ? "border-[#A9BE86] bg-[#D6E5B4] text-[#18231B]"
                    : "border-[#657660] text-transparent hover:border-[#D6E5B4]"
                }`}
              >
                {task.done && <Check size={15} />}
              </button>

              <span
                className={`min-w-0 flex-1 break-words text-sm ${
                  task.done
                    ? "text-[#879487] line-through"
                    : "text-[#F5F2E9]"
                }`}
              >
                {task.title}
              </span>

              <span
                className={`shrink-0 rounded-full border px-2.5 py-1 text-xs ${
                  priorityStyle[task.priority]
                }`}
              >
                {task.priority}
              </span>

              <button
                type="button"
                aria-label={`Delete ${task.title}`}
                onClick={() =>
                  setTasks((current) =>
                    current.filter((item) => item.id !== task.id)
                  )
                }
                className="shrink-0 rounded-lg p-2 text-[#AAB7A5] transition hover:bg-[#3A2821] hover:text-[#F0B69A]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </section>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-5 transition hover:border-[#405C43]">
      <p className="text-sm text-[#AAB7A5]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[#F5F2E9]">
        {value}
      </p>
    </div>
  );
}
