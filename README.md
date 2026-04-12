# 📚 AlgoAndDS — Data Structures & Algorithms Interview Prep

> A visually rich, LeetCode-inspired web application for **mid-senior level** Java interview preparation.  
> 12 in-depth topic guides · 45 curated problems · Built-in Monaco code editor.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)

---

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/<your-username>/AlgoAndDS.git
cd AlgoAndDS/webapp

# Install dependencies
npm install

# Start dev server
npm run dev

# Open in browser
# → http://localhost:3000
```

---

## 📖 What's Inside

### 📚 Documentation (12 Topics)
In-depth guides with Java code examples, complexity tables, and interview strategy:

| # | Topic | Key Concepts |
|---|-------|-------------|
| 1 | Arrays & Strings | Two pointers, prefix sums, Kadane's, sliding window, Rabin-Karp |
| 2 | Linked Lists | Floyd's cycle detection, reversal, merge, deep copy |
| 3 | Stacks & Queues | Monotonic stack/queue, expression evaluation, design |
| 4 | Trees & BST | Traversals, Morris, AVL, segment trees, Fenwick trees |
| 5 | Heaps & Priority Queues | Top-K, two-heap median, merge K sorted |
| 6 | HashMaps & Sets | HashMap internals, equals/hashCode, LRU/LFU cache |
| 7 | Graphs | BFS, DFS, Dijkstra, Bellman-Ford, topological sort, MST |
| 8 | Tries | Prefix tree, autocomplete, word search |
| 9 | Union-Find | Path compression, union by rank, connectivity |
| 10 | Dynamic Programming | 9 DP patterns: knapsack, string, interval, bitmask, etc. |
| 11 | Sliding Window | Fixed/variable windows, two pointer patterns |
| 12 | Advanced Topics | Backtracking, binary search, bit manipulation, design |

### 💻 Problems (45 Curated)
Each problem includes:
- ✅ Detailed description with constraints
- ✅ Multiple examples with explanations
- ✅ Progressive hints (reveal one at a time)
- ✅ Test cases with expected outputs
- ✅ Java starter code template
- ✅ Monaco code editor (same as VS Code)
- 🚫 **No solutions provided** — practice solving them yourself!

### 🎨 Features
- **Dark theme** with emerald accents
- **LeetCode-style** problem table with filters
- **Progress tracking** (completed problems saved in localStorage)
- **Split-pane** problem view: description | code editor
- **Responsive** design for desktop and mobile
- **Static generation** for fast loading

---

## 🗂️ Project Structure

```
AlgoAndDS/
├── docs/                    # Raw markdown documentation
├── webapp/                  # Next.js web application
│   ├── src/
│   │   ├── app/            # Pages (Dashboard, Topics, Problems)
│   │   ├── components/     # UI components (Navbar, CodeEditor, etc.)
│   │   └── data/           # Topics & problems data
│   ├── package.json
│   └── next.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

- **[Next.js 16](https://nextjs.org/)** — React framework with App Router
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first styling
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** — VS Code's editor in the browser
- **[Lucide React](https://lucide.dev/)** — Beautiful icons
- **[react-markdown](https://github.com/remarkjs/react-markdown)** — Markdown rendering with GFM

---

## 📄 License

This project is for personal educational use. Problems are inspired by common interview patterns.

Happy coding! 🚀
