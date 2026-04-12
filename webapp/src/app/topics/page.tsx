import TopicCard from "../../components/TopicCard";

const topicPreviews = [
  { slug: "arrays-and-strings", title: "Arrays & Strings", icon: "Layers", color: "emerald", description: "Two pointers, prefix sums, Kadane's algorithm, sliding window patterns, string hashing, and matrix traversal techniques." },
  { slug: "linked-lists", title: "Linked Lists", icon: "Link", color: "blue", description: "Floyd's cycle detection, in-place reversal, merge techniques, dummy head pattern, and deep copy with random pointers." },
  { slug: "stacks-and-queues", title: "Stacks & Queues", icon: "Boxes", color: "purple", description: "Monotonic stack/queue, expression evaluation, bracket matching, histogram problems, and design patterns." },
  { slug: "trees-and-bst", title: "Trees & BST", icon: "TreePine", color: "amber", description: "All traversals (including Morris), BST operations, AVL rotations, segment trees, Fenwick trees, LCA, and serialization." },
  { slug: "heaps-and-priority-queues", title: "Heaps & Priority Queues", icon: "ArrowUpDown", color: "rose", description: "Heap operations, Top-K patterns, two-heap median finding, merge K sorted lists, and Java PriorityQueue mastery." },
  { slug: "hashmaps-and-sets", title: "HashMaps & Sets", icon: "Hash", color: "cyan", description: "HashMap internals, equals/hashCode contract, frequency counting, prefix sum patterns, LRU/LFU cache design." },
  { slug: "graphs", title: "Graphs", icon: "Network", color: "orange", description: "BFS, DFS, Dijkstra's, Bellman-Ford, topological sort, MST (Kruskal's & Prim's), Tarjan's SCC, and grid problems." },
  { slug: "tries", title: "Tries", icon: "Type", color: "indigo", description: "Prefix tree implementation, autocomplete, spell checker, word search in matrix, and compressed trie (radix tree)." },
  { slug: "union-find", title: "Union-Find", icon: "GitMerge", color: "pink", description: "Disjoint Set Union with path compression and union by rank. Cycle detection, connected components, and Kruskal's MST." },
  { slug: "dynamic-programming", title: "Dynamic Programming", icon: "BrainCircuit", color: "teal", description: "9 DP patterns: linear, knapsack, string, interval, grid, tree, bitmask, state machine, and digit DP." },
  { slug: "sliding-window-two-pointers", title: "Sliding Window & Two Pointers", icon: "SlidersHorizontal", color: "lime", description: "Fixed/variable size windows, opposite/same direction pointers, shrinkable vs non-shrinkable window templates." },
  { slug: "advanced-topics", title: "Advanced Topics", icon: "Sparkles", color: "sky", description: "Backtracking, advanced binary search, bit manipulation, concurrency data structures, and interview strategy." },
];

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Study Topics</h1>
        <p className="mt-2 text-lg text-slate-400">
          In-depth documentation with Java examples, complexity analysis, and interview strategies.
          Each topic is designed to give you a solid foundation for mid-senior level interviews.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {topicPreviews.map((topic) => (
          <TopicCard key={topic.slug} {...topic} />
        ))}
      </div>
    </div>
  );
}
