"use client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { ArrowLeft, Lightbulb, TestTube, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import DifficultyBadge from "../../../components/DifficultyBadge";
import CodeEditor from "../../../components/CodeEditor";
import { problems } from "../../../data/problems";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function HintAccordion({ hints }: { hints: string[] }) {
  const [openHints, setOpenHints] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setOpenHints((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-2">
      {hints.map((hint, i) => (
        <div key={i} className="rounded-lg border border-slate-700 overflow-hidden">
          <button
            onClick={() => toggle(i)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm text-left text-slate-300 hover:bg-slate-800/50 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Lightbulb size={14} className="text-amber-400" />
              Hint {i + 1}
            </span>
            {openHints.has(i) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {openHints.has(i) && (
            <div className="border-t border-slate-700 px-4 py-3 text-sm text-slate-400 bg-slate-800/20">
              {hint}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProblemDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const problem = problems.find((p) => p.slug === slug);
  const [activeTab, setActiveTab] = useState<"description" | "hints" | "testcases">("description");

  if (!problem) {
    notFound();
  }

  const tabs = [
    { id: "description" as const, label: "Description", icon: FileText },
    { id: "hints" as const, label: "Hints", icon: Lightbulb },
    { id: "testcases" as const, label: "Test Cases", icon: TestTube },
  ];

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">
      {/* Left Panel — Problem Description */}
      <div className="flex flex-col lg:w-1/2 border-r border-slate-800 overflow-hidden">
        {/* Problem Header */}
        <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
          <Link
            href="/problems"
            className="mb-3 inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft size={12} />
            All Problems
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <div className="mt-1">
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
              {problem.category}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-emerald-400 text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "description" && (
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="prose-dark text-sm leading-relaxed">
                <p className="whitespace-pre-line">{problem.description}</p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Examples</h3>
                <div className="space-y-3">
                  {problem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-slate-700 bg-slate-900/50 p-4"
                    >
                      <div className="mb-1 text-xs font-medium text-slate-500">
                        Example {i + 1}
                      </div>
                      <div className="space-y-1 font-mono text-sm">
                        <div>
                          <span className="text-slate-500">Input: </span>
                          <span className="text-emerald-400">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Output: </span>
                          <span className="text-amber-400">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="mt-2 text-xs text-slate-400">
                            <span className="text-slate-500">Explanation: </span>
                            {ex.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Constraints</h3>
                <ul className="space-y-1">
                  {problem.constraints.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />
                      <code className="text-xs bg-slate-800/50 px-1 rounded">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "hints" && (
            <div>
              <p className="mb-4 text-sm text-slate-400">
                Progressive hints — start with Hint 1 and only reveal more if needed.
              </p>
              <HintAccordion hints={problem.hints} />
            </div>
          )}

          {activeTab === "testcases" && (
            <div>
              <p className="mb-4 text-sm text-slate-400">
                Verify your solution against these test cases. Copy the inputs into your code
                and compare outputs.
              </p>
              <div className="space-y-3">
                {problem.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-700 bg-slate-900/50 p-4"
                  >
                    <div className="mb-2 text-xs font-medium text-slate-500">
                      Test Case {i + 1}
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="rounded bg-slate-800/50 p-2">
                        <span className="text-xs text-slate-500 block mb-1">Input:</span>
                        <span className="text-emerald-400 text-xs">{tc.input}</span>
                      </div>
                      <div className="rounded bg-slate-800/50 p-2">
                        <span className="text-xs text-slate-500 block mb-1">Expected Output:</span>
                        <span className="text-amber-400 text-xs">{tc.expectedOutput}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel — Code Editor */}
      <div className="flex flex-col lg:w-1/2 overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-white">Code Editor</span>
          <span className="text-xs text-slate-500">Java</span>
        </div>
        <div className="flex-1">
          <CodeEditor
            defaultValue={problem.starterCode}
            height="calc(100vh - 128px)"
          />
        </div>
      </div>
    </div>
  );
}
