"use client";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeEditorProps {
  defaultValue: string;
  language?: string;
  height?: string;
  onChange?: (value: string | undefined) => void;
}

export default function CodeEditor({
  defaultValue,
  language = "java",
  height = "500px",
  onChange,
}: CodeEditorProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700 bg-[#1e1e1e]">
      <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/60" />
            <div className="h-3 w-3 rounded-full bg-amber-500/60" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
          </div>
          <span className="ml-2 text-xs text-slate-400 font-mono">
            Solution.java
          </span>
        </div>
        <span className="text-xs text-slate-500">Java</span>
      </div>
      <Editor
        height={height}
        language={language}
        defaultValue={defaultValue}
        theme="vs-dark"
        onChange={onChange}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-geist-mono), Consolas, monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: "on",
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
          tabSize: 4,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
