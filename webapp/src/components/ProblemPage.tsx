"use client";

import Link from "next/link";
import { use, useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft, Lightbulb, TestTube, FileText,
  ChevronDown, ChevronUp, Play,
  Timer, RotateCcw, Bookmark, BookmarkCheck, Zap,
} from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";
import CodeEditor from "./CodeEditor";
import ExecutionPanel from "./ExecutionPanel";
import { problems } from "../data/problems";
import { generateJavaSource, executeCode, parseExecutionOutput } from "../lib/executor";
import type { ExecutionResult, TestRunnerConfig } from "../lib/executor";

interface ExtendedExecutionResult extends ExecutionResult {
  noEndpoint?: boolean;
  javaSource?: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function HintAccordion({ hints }: { hints: string[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setOpen((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  return (
    <div className="space-y-2">
      {hints.map((hint, i) => (
        <div key={i} className="rounded-lg border border-slate-700 overflow-hidden">
          <button onClick={() => toggle(i)} className="flex w-full items-center justify-between px-4 py-3 text-sm text-left text-slate-300 hover:bg-slate-800/50 transition-colors">
            <span className="flex items-center gap-2"><Lightbulb size={14} className="text-amber-400" />Hint {i + 1}</span>
            {open.has(i) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {open.has(i) && <div className="border-t border-slate-700 px-4 py-3 text-sm text-slate-400 bg-slate-800/20">{hint}</div>}
        </div>
      ))}
    </div>
  );
}

function ProblemTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    else if (ref.current) clearInterval(ref.current);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);
  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => setRunning(!running)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${running ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white"}`}>
        <Timer size={12} />{fmt(seconds)}
      </button>
      {seconds > 0 && <button onClick={() => { setSeconds(0); setRunning(false); }} className="p-1.5 rounded text-slate-500 hover:text-white transition-colors"><RotateCcw size={12} /></button>}
    </div>
  );
}

export default function ProblemDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const problem = problems.find((p: { slug: string }) => p.slug === slug);
  const [activeTab, setActiveTab] = useState<"description" | "hints" | "testcases" | "output">("description");
  const [code, setCode] = useState("");
  const [executionResult, setExecutionResult] = useState<ExtendedExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [runnerConfig, setRunnerConfig] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!problem) return;
    const saved = localStorage.getItem(`code_${slug}`);
    setCode(saved || problem.starterCode);
    setBookmarked(!!localStorage.getItem(`bookmark_${slug}`));
    import("../data/test-runners").then((mod) => {
      if (mod.getTestRunner) {
        const cfg = mod.getTestRunner(slug);
        if (cfg) setRunnerConfig(cfg as unknown as Record<string, unknown>);
      }
    }).catch(() => {});
  }, [slug, problem]);

  useEffect(() => { if (code && problem) localStorage.setItem(`code_${slug}`, code); }, [code, slug, problem]);

  const toggleBookmark = () => { if (bookmarked) localStorage.removeItem(`bookmark_${slug}`); else localStorage.setItem(`bookmark_${slug}`, "1"); setBookmarked(!bookmarked); };

  const handleRun = useCallback(async () => {
    if (!runnerConfig || isRunning) return;
    setIsRunning(true);
    setActiveTab("output");
    setExecutionResult(null);
    try {
      const javaSource = generateJavaSource(code, runnerConfig as unknown as TestRunnerConfig);
      const { stdout, stderr, exitCode } = await executeCode(javaSource);
      const result: ExtendedExecutionResult = { ...parseExecutionOutput(stdout, stderr, exitCode), javaSource };
      setExecutionResult(result);
      if (result.success) {
        const done = JSON.parse(localStorage.getItem("completedProblems") || "[]");
        if (!done.includes(slug)) { done.push(slug); localStorage.setItem("completedProblems", JSON.stringify(done)); }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setExecutionResult({ success: false, runtimeError: `Execution error: ${msg}`, testResults: [], totalTests: 0, passedTests: 0, executionTimeMs: 0 });
    } finally { setIsRunning(false); }
  }, [code, runnerConfig, isRunning, slug]);

  const handleReset = () => { if (problem && confirm("Reset code to starter template?")) { setCode(problem.starterCode); localStorage.removeItem(`code_${slug}`); } };

  if (!problem) return <div className="flex items-center justify-center h-screen text-slate-400">Problem not found</div>;

  const tabs = [
    { id: "description" as const, label: "Description", icon: FileText },
    { id: "hints" as const, label: "Hints", icon: Lightbulb },
    { id: "testcases" as const, label: "Test Cases", icon: TestTube },
    { id: "output" as const, label: "Output", icon: Play },
  ];
  const expectedComplexity = (runnerConfig as { expectedComplexity?: { time: string; space: string } } | null)?.expectedComplexity;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="flex flex-col lg:w-1/2 border-r border-slate-800 overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <Link href="/problems" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-emerald-400 transition-colors"><ArrowLeft size={12} /> All Problems</Link>
            <div className="flex items-center gap-2">
              <ProblemTimer />
              <button onClick={toggleBookmark} className="p-1.5 rounded text-slate-500 hover:text-amber-400 transition-colors">
                {bookmarked ? <BookmarkCheck size={16} className="text-amber-400" /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{problem.title}</h1>
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-400">{problem.category}</span>
            {expectedComplexity && <span className="flex items-center gap-1 text-xs text-cyan-400"><Zap size={10} /> {expectedComplexity.time} / {expectedComplexity.space}</span>}
          </div>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-900/30">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all ${activeTab === tab.id ? "border-emerald-400 text-emerald-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}>
              <tab.icon size={14} />{tab.label}
              {tab.id === "output" && executionResult && <span className={`ml-1 text-xs ${executionResult.success ? "text-emerald-400" : "text-red-400"}`}>{executionResult.passedTests}/{executionResult.totalTests}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "description" && (
            <div className="space-y-6">
              <div className="prose-dark text-sm leading-relaxed whitespace-pre-line">{problem.description}</div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Examples</h3>
                <div className="space-y-3">
                  {problem.examples.map((ex: { input: string; output: string; explanation?: string }, i: number) => (
                    <div key={i} className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                      <div className="mb-1 text-xs font-medium text-slate-500">Example {i + 1}</div>
                      <div className="space-y-1 font-mono text-sm">
                        <div><span className="text-slate-500">Input: </span><span className="text-emerald-400">{ex.input}</span></div>
                        <div><span className="text-slate-500">Output: </span><span className="text-amber-400">{ex.output}</span></div>
                        {ex.explanation && <div className="mt-2 text-xs text-slate-400">{ex.explanation}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-semibold text-white">Constraints</h3>
                <ul className="space-y-1">
                  {problem.constraints.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-600" />
                      <code className="text-xs bg-slate-800/50 px-1 rounded">{c}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {activeTab === "hints" && <div><p className="mb-4 text-sm text-slate-400">Progressive hints — reveal only what you need.</p><HintAccordion hints={problem.hints} /></div>}
          {activeTab === "testcases" && (
            <div>
              <p className="mb-4 text-sm text-slate-400">{runnerConfig ? "These test cases will run when you click Run Code." : "Review these test cases and verify manually."}</p>
              <div className="space-y-3">
                {problem.testCases.map((tc: { input: string; expectedOutput: string }, i: number) => (
                  <div key={i} className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
                    <div className="mb-2 text-xs font-medium text-slate-500">Test Case {i + 1}</div>
                    <div className="space-y-2 font-mono text-sm">
                      <div className="rounded bg-slate-800/50 p-2"><span className="text-xs text-slate-500 block mb-1">Input:</span><span className="text-emerald-400 text-xs">{tc.input}</span></div>
                      <div className="rounded bg-slate-800/50 p-2"><span className="text-xs text-slate-500 block mb-1">Expected:</span><span className="text-amber-400 text-xs">{tc.expectedOutput}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "output" && <ExecutionPanel result={executionResult} isRunning={isRunning} expectedComplexity={expectedComplexity} />}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col lg:w-1/2 overflow-hidden">
        <div className="border-b border-slate-800 bg-slate-900/50 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">Solution.java</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all"><RotateCcw size={12} />Reset</button>
            <button onClick={handleRun} disabled={!runnerConfig || isRunning}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${runnerConfig ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20" : "bg-slate-700 text-slate-400 cursor-not-allowed"}`}>
              {isRunning ? <><div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running...</> : <><Play size={12} fill="currentColor" />Run Code</>}
            </button>
          </div>
        </div>
        <div className="flex-1">
          <CodeEditor defaultValue={code} height="calc(100vh - 128px)" onChange={(val) => val !== undefined && setCode(val)} />
        </div>
      </div>
    </div>
  );
}
