"use client";

import { useState } from "react";
import { ArrowRightLeft, Copy, RotateCcw, Sparkles } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const demo = {
  full_name: "Alex Morgan",
  birth_date: "2001-06-15",
  email_address: "alex@example.com",
  phone_number: "+1 555 0100",
};

const fieldMap: Record<string, string> = {
  full_name: "name",
  birth_date: "dateOfBirth",
  email_address: "email",
  phone_number: "phone",
};

export default function InnovationLabPage() {
  const [source, setSource] = useState(JSON.stringify(demo, null, 2));
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function transform() {
    try {
      const input: unknown = JSON.parse(source);

      if (
        !input ||
        typeof input !== "object" ||
        Array.isArray(input)
      ) {
        throw new Error("Please enter a JSON object.");
      }

      const mapped: Record<string, unknown> = {};

      Object.entries(input).forEach(([key, value]) => {
        mapped[fieldMap[key] ?? key] = value;
      });

      setOutput(JSON.stringify(mapped, null, 2));
      setError("");
      setCopied(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON.");
      setOutput("");
      setCopied(false);
    }
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError("");
    } catch {
      setError("Clipboard access failed. Please copy the output manually.");
    }
  }

  return (
    <AppLayout>
      <div className="mb-8">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#D6E5B4]">
          <Sparkles size={16} />
          EXPERIMENT. TRANSFORM. CREATE.
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-[#F5F2E9] sm:text-4xl">
          Innovation Lab
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#C0C8BC] sm:text-base">
          Experiment with data structures, test transformations, and turn
          messy inputs into something useful.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-4">
          <p className="text-xs uppercase tracking-wide text-[#AAB7A5]">
            Input
          </p>
          <p className="mt-2 font-semibold text-[#F5F2E9]">JSON object</p>
        </div>

        <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-4">
          <p className="text-xs uppercase tracking-wide text-[#AAB7A5]">
            Transformation
          </p>
          <p className="mt-2 font-semibold text-[#D6E5B4]">
            Field mapping
          </p>
        </div>

        <div className="rounded-2xl border border-[#344339] bg-[#18231B] p-4">
          <p className="text-xs uppercase tracking-wide text-[#AAB7A5]">
            Output
          </p>
          <p className="mt-2 font-semibold text-[#F5F2E9]">
            Structured JSON
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-[#344339] bg-[#18231B] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[#F5F2E9]">Source JSON</h2>
              <p className="mt-1 text-xs text-[#AAB7A5]">
                Edit the input before transforming it.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSource(JSON.stringify(demo, null, 2));
                setError("");
                setCopied(false);
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#C0C8BC] transition hover:bg-[#26372B] hover:text-[#D6E5B4]"
            >
              <RotateCcw size={15} />
              Load demo
            </button>
          </div>

          <textarea
            spellCheck={false}
            aria-label="Source JSON editor"
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              setCopied(false);
            }}
            className="min-h-80 w-full resize-y rounded-xl border border-[#344339] bg-[#111914] p-4 font-mono text-sm leading-6 text-[#D6E5B4] outline-none placeholder:text-[#7F8D7D] transition focus:border-[#A9BE86] focus:ring-2 focus:ring-[#A9BE86]/15"
          />

          <button
            type="button"
            onClick={transform}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#D6E5B4] px-5 py-3 font-semibold text-[#18231B] transition hover:bg-[#E3EDCE] sm:w-auto"
          >
            <ArrowRightLeft size={17} />
            Transform data
          </button>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-[#7A4938] bg-[#3A2821] px-3 py-2 text-sm text-[#F0B69A]"
            >
              {error}
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[#344339] bg-[#18231B] p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-[#F5F2E9]">
                Transformed output
              </h2>
              <p className="mt-1 text-xs text-[#AAB7A5]">
                Your mapped data will appear here.
              </p>
            </div>

            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#D6E5B4] transition hover:bg-[#26372B] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Copy size={15} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className="min-h-80 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[#344339] bg-[#111914] p-4 font-mono text-sm leading-6 text-[#C7DDA5]">
            {output || "// Your transformed JSON will appear here."}
          </pre>

          <div className="mt-4 rounded-xl border border-[#344339] bg-[#202F24] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#D6E5B4]">
              Field mapping
            </p>
            <p className="mt-2 text-xs leading-6 text-[#C0C8BC]">
              full_name → name
              <br />
              birth_date → dateOfBirth
              <br />
              email_address → email
              <br />
              phone_number → phone
            </p>
            <p className="mt-2 text-xs leading-5 text-[#AAB7A5]">
              Any fields not listed above are preserved unchanged.
            </p>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
