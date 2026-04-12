import Link from "next/link";
import {
  BookOpen,
  Code2,
  Target,
  TrendingUp,
  ArrowRight,
  Layers,
  Link as LinkIcon,
  Boxes,
  TreePine,
  ArrowUpDown,
  Hash,
  Network,
  Type,
  GitMerge,
  BrainCircuit,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import TopicCard from "../components/TopicCard";

const topicPreviews = [
  { slug: "arrays-and-strings", title: "Arrays & Strings", icon: "Layers", color: "emerald", description: "Two pointers, prefix sums, Kadane's algorithm, sliding window patterns" },
  { slug: "linked-lists", title: "Linked Lists", icon: "Link", color: "blue", description: "Floyd's cycle detection, reversal patterns, merge techniques" },
  { slug: "stacks-and-queues", title: "Stacks & Queues", icon: "Boxes", color: "purple", description: "Monotonic stack/queue, expression evaluation, design problems" },
  { slug: "trees-and-bst", title: "Trees & BST", icon: "TreePine", color: "amber", description: "Traversals, BST operations, LCA, serialization, segment trees" },
  { slug: "heaps-and-priority-queues", title: "Heaps & Priority Queues", icon: "ArrowUpDown", color: "rose", description: "Top-K patterns, two-heap median, merge K sorted lists" },
  { slug: "hashmaps-and-sets", title: "HashMaps & Sets", icon: "Hash", color: "cyan", description: "HashMap internals, frequency counting, prefix sum patterns" },
  { slug: "graphs", title: "Graphs", icon: "Network", color: "orange", description: "BFS, DFS, Dijkstra's, topological sort, MST algorithms" },
  { slug: "tries", title: "Tries", icon: "Type", color: "indigo", description: "Prefix trees, autocomplete, word search patterns" },
  { slug: "union-find", title: "Union-Find", icon: "GitMerge", color: "pink", description: "Disjoint sets, path compression, connectivity queries" },
  { slug: "dynamic-programming", title: "Dynamic Programming", icon: "BrainCircuit", color: "teal", description: "Knapsack, LCS, interval DP, bitmask DP, state machines" },
  { slug: "sliding-window-two-pointers", title: "Sliding Window", icon: "SlidersHorizontal", color: "lime", description: "Fixed/variable windows, two pointer patterns" },
  { slug: "advanced-topics", title: "Advanced Topics", icon: "Sparkles", color: "sky", description: "Backtracking, binary search, bit manipulation, design patterns" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-400">
              <Target size={14} />
              Mid-Senior Level Interview Prep
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Master{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Data Structures
              </span>{" "}
              &{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Algorithms
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-400">
              Comprehensive Java-based interview preparation with in-depth documentation,
              45+ curated problems, and an interactive code playground.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/topics"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <BookOpen size={18} />
                Start Learning
              </Link>
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:border-slate-600"
              >
                <Code2 size={18} />
                Practice Problems
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { label: "Topics Covered", value: "12", icon: BookOpen, color: "text-emerald-400" },
              { label: "Coding Problems", value: "45+", icon: Code2, color: "text-cyan-400" },
              { label: "Difficulty Levels", value: "3", icon: TrendingUp, color: "text-amber-400" },
              { label: "Java Examples", value: "100+", icon: Target, color: "text-purple-400" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className={`mx-auto mb-2 ${stat.color}`} size={24} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Study Topics</h2>
            <p className="mt-1 text-slate-400">
              Deep-dive documentation for every core data structure and algorithm
            </p>
          </div>
          <Link
            href="/topics"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View all
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topicPreviews.map((topic) => (
            <TopicCard key={topic.slug} {...topic} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white">Ready to ace your interview?</h2>
          <p className="mt-2 text-slate-400">
            Start with the topics, then practice with curated problems.
          </p>
          <Link
            href="/problems"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/20"
          >
            Start Solving Problems
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
