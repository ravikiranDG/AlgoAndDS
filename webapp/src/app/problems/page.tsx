"use client";
import ProblemTable from "../../components/ProblemTable";
import { problems, getCategories } from "../../data/problems";

export default function ProblemsPage() {
  const categories = getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Coding Problems</h1>
        <p className="mt-2 text-lg text-slate-400">
          45 curated problems across 11 categories. Filter by difficulty, track your progress,
          and practice with the built-in code editor.
        </p>
      </div>

      <ProblemTable problems={problems} categories={categories} />
    </div>
  );
}
