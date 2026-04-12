"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Clock, Zap, Terminal, Copy, Check, FileCode } from "lucide-react";
import type { ExecutionResult } from "../lib/executor";

interface ExtendedResult extends ExecutionResult {
  noEndpoint?: boolean;
  javaSource?: string;
}

interface ExecutionPanelProps {
  result: ExtendedResult | null;
  isRunning: boolean;
  expectedComplexity?: { time: string; space: string };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all">
      {copied ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy Java Code</>}
    </button>
  );
}

export default function ExecutionPanel({ result, isRunning, expectedComplexity }: ExecutionPanelProps) {
  const [showSource, setShowSource] = useState(false);

  if (isRunning) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader2 className="animate-spin mb-3 text-emerald-400" size={32} />
        <p className="text-sm font-medium">Compiling & Running...</p>
        <p className="text-xs text-slate-500 mt-1">Executing your Java code</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Terminal size={32} className="mb-3 opacity-50" />
        <p className="text-sm">Click <span className="text-emerald-400 font-semibold">Run Code</span> to execute your solution</p>
        <p className="text-xs text-slate-600 mt-1">Your code will be compiled and tested against sample test cases</p>
      </div>
    );
  }

  // No execution endpoint — show "Run Locally" instructions
  if (result.noEndpoint && result.javaSource) {
    return (
      <div className="p-4 space-y-4">
        <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileCode size={18} className="text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Run Locally</span>
          </div>
          <p className="text-sm text-slate-400 mb-3">
            Copy the generated test file below and run it with Java on your machine:
          </p>
          <div className="flex items-center gap-2 mb-3">
            <CopyButton text={result.javaSource} />
          </div>
          <div className="rounded-lg bg-slate-900 border border-slate-700 p-3 text-xs font-mono text-slate-400">
            <div className="text-cyan-400 mb-1"># Run these commands:</div>
            <div>javac Main.java</div>
            <div>java Main</div>
          </div>
          {!showSource ? (
            <button onClick={() => setShowSource(true)} className="mt-3 text-xs text-slate-500 hover:text-slate-300 transition-colors underline">
              Show generated Java source
            </button>
          ) : (
            <pre className="mt-3 rounded-lg bg-[#0f172a] border border-slate-700 p-3 text-xs text-slate-300 font-mono overflow-x-auto max-h-80 overflow-y-auto">
              {result.javaSource}
            </pre>
          )}
        </div>

        {expectedComplexity && (
          <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400">Expected Optimal Complexity</span>
            </div>
            <div className="flex gap-6 text-xs">
              <div><span className="text-slate-500">Time: </span><span className="text-white font-mono">{expectedComplexity.time}</span></div>
              <div><span className="text-slate-500">Space: </span><span className="text-white font-mono">{expectedComplexity.space}</span></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Compilation error
  if (result.compilationError) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-red-400">
          <XCircle size={18} />
          <span className="text-sm font-semibold">Compilation Error</span>
        </div>
        <pre className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 text-xs text-red-300 font-mono overflow-x-auto whitespace-pre-wrap">
          {result.compilationError}
        </pre>
      </div>
    );
  }

  // Runtime error (no test output)
  if (result.runtimeError && result.testResults.length === 0) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-amber-400">
          <AlertTriangle size={18} />
          <span className="text-sm font-semibold">
            {result.timeout ? "Time Limit Exceeded" : "Runtime Error"}
          </span>
        </div>
        <pre className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-300 font-mono overflow-x-auto whitespace-pre-wrap">
          {result.runtimeError}
        </pre>
      </div>
    );
  }

  // Test results
  const allPassed = result.passedTests === result.totalTests && result.totalTests > 0;

  return (
    <div className="p-4 space-y-4">
      {/* Summary bar */}
      <div className={`flex items-center justify-between rounded-lg p-3 ${
        allPassed
          ? "bg-emerald-500/10 border border-emerald-500/20"
          : "bg-red-500/10 border border-red-500/20"
      }`}>
        <div className="flex items-center gap-2">
          {allPassed ? (
            <CheckCircle2 className="text-emerald-400" size={20} />
          ) : (
            <XCircle className="text-red-400" size={20} />
          )}
          <span className={`text-sm font-bold ${allPassed ? "text-emerald-400" : "text-red-400"}`}>
            {allPassed ? "All Tests Passed! 🎉" : `${result.passedTests}/${result.totalTests} Tests Passed`}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {result.executionTimeMs}ms
          </span>
        </div>
      </div>

      {/* Test case details */}
      <div className="space-y-2">
        {result.testResults.map((test) => (
          <div
            key={test.id}
            className={`rounded-lg border p-3 ${
              test.passed
                ? "border-emerald-500/10 bg-emerald-500/5"
                : "border-red-500/10 bg-red-500/5"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {test.error ? (
                <AlertTriangle size={14} className="text-amber-400" />
              ) : test.passed ? (
                <CheckCircle2 size={14} className="text-emerald-400" />
              ) : (
                <XCircle size={14} className="text-red-400" />
              )}
              <span className={`text-xs font-semibold ${
                test.error ? "text-amber-400" : test.passed ? "text-emerald-400" : "text-red-400"
              }`}>
                {test.name}
              </span>
            </div>

            {test.error ? (
              <div className="ml-6 text-xs text-amber-300 font-mono">{test.error}</div>
            ) : !test.passed ? (
              <div className="ml-6 space-y-1 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Expected: </span>
                  <span className="text-emerald-400">{test.expected}</span>
                </div>
                <div>
                  <span className="text-slate-500">Actual:   </span>
                  <span className="text-red-400">{test.actual}</span>
                </div>
              </div>
            ) : (
              <div className="ml-6 text-xs font-mono text-slate-400">
                Output: {test.actual}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expected Complexity */}
      {expectedComplexity && (
        <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold text-cyan-400">Expected Optimal Complexity</span>
          </div>
          <div className="flex gap-6 text-xs">
            <div>
              <span className="text-slate-500">Time: </span>
              <span className="text-white font-mono">{expectedComplexity.time}</span>
            </div>
            <div>
              <span className="text-slate-500">Space: </span>
              <span className="text-white font-mono">{expectedComplexity.space}</span>
            </div>
          </div>
        </div>
      )}

      {/* Runtime error alongside results */}
      {result.runtimeError && result.testResults.length > 0 && (
        <pre className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3 text-xs text-amber-300 font-mono overflow-x-auto whitespace-pre-wrap">
          {result.runtimeError}
        </pre>
      )}
    </div>
  );
}
