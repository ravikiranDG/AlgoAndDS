"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, CheckCircle2, Circle } from "lucide-react";
import DifficultyBadge from "./DifficultyBadge";

interface Problem {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  categorySlug: string;
}

interface ProblemTableProps {
  problems: Problem[];
  categories: { slug: string; name: string; count: number }[];
}

export default function ProblemTable({ problems, categories }: ProblemTableProps) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [completed, setCompleted] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("completedProblems");
        return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const toggleCompleted = (slug: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      if (typeof window !== "undefined") {
        localStorage.setItem("completedProblems", JSON.stringify([...next]));
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchDifficulty =
        difficultyFilter === "All" || p.difficulty === difficultyFilter;
      const matchCategory =
        categoryFilter === "All" || p.categorySlug === categoryFilter;
      return matchSearch && matchDifficulty && matchCategory;
    });
  }, [problems, search, difficultyFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = problems.length;
    const easy = problems.filter((p) => p.difficulty === "Easy").length;
    const medium = problems.filter((p) => p.difficulty === "Medium").length;
    const hard = problems.filter((p) => p.difficulty === "Hard").length;
    const done = completed.size;
    return { total, easy, medium, hard, done };
  }, [problems, completed]);

  return (
    <div>
      {/* Stats Bar */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Easy", value: stats.easy, color: "text-emerald-400" },
          { label: "Medium", value: stats.medium, color: "text-amber-400" },
          { label: "Hard", value: stats.hard, color: "text-red-400" },
          { label: "Completed", value: stats.done, color: "text-cyan-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-center"
          >
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name} ({cat.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="w-12 px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                ✓
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Title
              </th>
              <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                Difficulty
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((problem, i) => (
              <tr
                key={problem.slug}
                className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleCompleted(problem.slug)}
                    className="text-slate-600 hover:text-emerald-400 transition-colors"
                  >
                    {completed.has(problem.slug) ? (
                      <CheckCircle2 size={18} className="text-emerald-400" />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-sm text-slate-500 font-mono">
                  {i + 1}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/problems/${problem.slug}`}
                    className={`text-sm font-medium transition-colors hover:text-emerald-400 ${
                      completed.has(problem.slug)
                        ? "text-slate-500 line-through"
                        : "text-white"
                    }`}
                  >
                    {problem.title}
                  </Link>
                </td>
                <td className="hidden sm:table-cell px-4 py-3">
                  <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-400">
                    {problem.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  No problems found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
