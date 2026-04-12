# Union-Find (Disjoint Set Union)

## Table of Contents
- [Fundamentals](#fundamentals)
- [Naive Implementation](#naive-implementation)
- [Optimizations](#optimizations)
- [Inverse Ackermann Function](#inverse-ackermann-function)
- [Complete Java Implementation](#complete-java-implementation)
- [Weighted Union-Find](#weighted-union-find)
- [Applications](#applications)
- [Common Interview Patterns](#common-interview-patterns)
- [Union-Find vs BFS/DFS](#union-find-vs-bfsdfs)
- [Complexity Analysis](#complexity-analysis)
- [Interview Tips](#interview-tips)

---

## Fundamentals

**Disjoint Set Union (DSU)** maintains a collection of non-overlapping sets and supports two core operations:

- **Find(x)**: Return the *representative element* (root) of the set containing `x`.
- **Union(x, y)**: Merge the sets containing `x` and `y` into one.

### Core Concepts

| Concept | Description |
|---------|-------------|
| Representative Element | A unique member chosen to identify the entire set (the root of its tree) |
| Connected Component | A maximal set of elements where every pair is connected |
| Parent Array | `parent[i]` stores the parent of element `i`; root has `parent[i] = i` |
| Rank/Size | Metadata used to keep trees balanced during union |

### When to Use Union-Find

Union-Find excels when you need to:
1. Dynamically group elements and query membership
2. Detect cycles in undirected graphs
3. Track the number of connected components as edges are added
4. Process queries online (one at a time, in order)

---

## Naive Implementation

Each element starts as its own set. We use a parent array where `parent[i] = i` initially.

```java
public class NaiveUnionFind {
    private int[] parent;

    public NaiveUnionFind(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    // O(n) worst case — tree can degenerate to a linked list
    public int find(int x) {
        while (parent[x] != x) {
            x = parent[x];
        }
        return x;
    }

    // O(n) worst case
    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) {
            parent[rootX] = rootY;
        }
    }
}
```

**Problem**: Without optimizations, trees can degenerate into linked lists, making `find` O(n).

---

## Optimizations

### Path Compression

During `find`, make every node on the path point directly to the root. This flattens the tree.

```java
public int find(int x) {
    if (parent[x] != x) {
        parent[x] = find(parent[x]); // path compression
    }
    return parent[x];
}
```

- Amortized cost per operation: **O(log n)** with path compression alone.

### Union by Rank

Attach the shorter tree under the root of the taller tree to prevent height growth.

```java
public boolean union(int x, int y) {
    int rootX = find(x), rootY = find(y);
    if (rootX == rootY) return false;

    if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
    } else {
        parent[rootY] = rootX;
        rank[rootX]++;
    }
    return true;
}
```

### Union by Size

Alternative to rank — attach the smaller set under the larger one. Useful when you need component sizes.

```java
public boolean union(int x, int y) {
    int rootX = find(x), rootY = find(y);
    if (rootX == rootY) return false;

    if (size[rootX] < size[rootY]) {
        parent[rootX] = rootY;
        size[rootY] += size[rootX];
    } else {
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
    }
    return true;
}
```

### Why Both Together Give Near O(1)

| Optimization | Amortized per Operation |
|-------------|------------------------|
| None | O(n) |
| Path compression only | O(log n) |
| Union by rank only | O(log n) |
| **Both combined** | **O(α(n))** ≈ O(1) |

Path compression flattens paths on reads; union by rank keeps trees shallow on writes. Together, they bound the tree height to the inverse Ackermann function.

---

## Inverse Ackermann Function

The **inverse Ackermann function α(n)** grows extraordinarily slowly:
- α(n) ≤ 4 for all practical values of n (up to 2^65536)
- For any input size you'll ever encounter, α(n) is effectively a constant

**Theoretical result** (Tarjan, 1975): With both path compression and union by rank, a sequence of m operations on n elements takes **O(m · α(n))** time.

This means each operation is **amortized nearly O(1)** — the tightest bound for any known pointer-based data structure for this problem.

---

## Complete Java Implementation

```java
public class UnionFind {
    private int[] parent;
    private int[] rank;
    private int count; // number of connected components

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;

        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
        return true;
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }

    public int getCount() {
        return count;
    }
}
```

### Size-Based Variant (when you need component sizes)

```java
public class UnionFindWithSize {
    private int[] parent;
    private int[] size;
    private int count;

    public UnionFindWithSize(int n) {
        parent = new int[n];
        size = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    public boolean union(int x, int y) {
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return false;

        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }
        count--;
        return true;
    }

    public int getSize(int x) {
        return size[find(x)];
    }

    public int getCount() { return count; }
}
```

---

## Weighted Union-Find

Used when edges carry weights / relationships (e.g., ratios, offsets). Each node stores a weight relative to its parent.

### Use Case: Evaluate Division (LC 399)

Given `a/b = 2.0` and `b/c = 3.0`, find `a/c`.

```java
public class WeightedUnionFind {
    private int[] parent;
    private double[] weight; // weight[i] = value of i / parent[i]

    public WeightedUnionFind(int n) {
        parent = new int[n];
        weight = new double[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            weight[i] = 1.0;
        }
    }

    public int find(int x) {
        if (parent[x] != x) {
            int root = find(parent[x]);
            weight[x] *= weight[parent[x]]; // accumulate weights along the path
            parent[x] = root;
        }
        return parent[x];
    }

    public void union(int x, int y, double w) {
        // w = x / y
        int rootX = find(x), rootY = find(y);
        if (rootX == rootY) return;

        parent[rootX] = rootY;
        // weight[x] * ? = w * weight[y] → solve for the connecting weight
        weight[rootX] = w * weight[y] / weight[x];
    }

    public double query(int x, int y) {
        if (find(x) != find(y)) return -1.0;
        return weight[x] / weight[y];
    }
}
```

### Use Case: Satisfiability of Equations (LC 990)

Group variables connected by `==` and check no `!=` pair shares a group.

```java
public boolean equationsPossible(String[] equations) {
    UnionFind uf = new UnionFind(26);
    for (String eq : equations) {
        if (eq.charAt(1) == '=') {
            uf.union(eq.charAt(0) - 'a', eq.charAt(3) - 'a');
        }
    }
    for (String eq : equations) {
        if (eq.charAt(1) == '!') {
            if (uf.connected(eq.charAt(0) - 'a', eq.charAt(3) - 'a')) {
                return false;
            }
        }
    }
    return true;
}
```

---

## Applications

### 1. Kruskal's Minimum Spanning Tree

Sort edges by weight, greedily add edges that don't create a cycle.

```java
public int kruskalMST(int n, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    UnionFind uf = new UnionFind(n);
    int cost = 0, edgesUsed = 0;

    for (int[] edge : edges) {
        if (uf.union(edge[0], edge[1])) {
            cost += edge[2];
            if (++edgesUsed == n - 1) break;
        }
    }
    return edgesUsed == n - 1 ? cost : -1;
}
```

### 2. Detecting Cycles in Undirected Graphs

If `find(u) == find(v)` before `union(u, v)`, the edge creates a cycle.

```java
public boolean hasCycle(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        if (!uf.union(edge[0], edge[1])) {
            return true; // cycle detected
        }
    }
    return false;
}
```

### 3. Dynamic Connectivity

Track connected components as edges arrive in an online fashion — something BFS/DFS can't do efficiently without rebuilding.

---

## Common Interview Patterns

### Number of Connected Components (LC 323)

```java
public int countComponents(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        uf.union(edge[0], edge[1]);
    }
    return uf.getCount();
}
```

### Redundant Connection (LC 684)

Find the edge that, when removed, makes the graph a tree.

```java
public int[] findRedundantConnection(int[][] edges) {
    UnionFind uf = new UnionFind(edges.length + 1);
    for (int[] edge : edges) {
        if (!uf.union(edge[0], edge[1])) {
            return edge;
        }
    }
    return new int[0];
}
```

### Accounts Merge (LC 721)

Union accounts sharing an email, then group by root.

```java
public List<List<String>> accountsMerge(List<List<String>> accounts) {
    UnionFind uf = new UnionFind(accounts.size());
    Map<String, Integer> emailToId = new HashMap<>();

    for (int i = 0; i < accounts.size(); i++) {
        for (int j = 1; j < accounts.get(i).size(); j++) {
            String email = accounts.get(i).get(j);
            if (emailToId.containsKey(email)) {
                uf.union(i, emailToId.get(email));
            } else {
                emailToId.put(email, i);
            }
        }
    }

    Map<Integer, TreeSet<String>> rootToEmails = new HashMap<>();
    for (Map.Entry<String, Integer> entry : emailToId.entrySet()) {
        int root = uf.find(entry.getValue());
        rootToEmails.computeIfAbsent(root, k -> new TreeSet<>()).add(entry.getKey());
    }

    List<List<String>> result = new ArrayList<>();
    for (Map.Entry<Integer, TreeSet<String>> entry : rootToEmails.entrySet()) {
        List<String> list = new ArrayList<>();
        list.add(accounts.get(entry.getKey()).get(0)); // name
        list.addAll(entry.getValue());
        result.add(list);
    }
    return result;
}
```

### Number of Islands II (LC 305)

Add land cells one at a time, union with adjacent land, track component count.

---

## Union-Find vs BFS/DFS

| Criterion | Union-Find | BFS/DFS |
|-----------|-----------|---------|
| Static connectivity (given full graph) | Works, but overkill | Simpler, preferred |
| Dynamic connectivity (edges added incrementally) | **Preferred** — O(α(n)) per edge | Must rebuild graph each time |
| Cycle detection (undirected) | Clean one-pass solution | Also works with visited set |
| Shortest path | Not applicable | BFS for unweighted |
| Path reconstruction | Not supported | Naturally supported |
| Connected components count (static) | Both work | DFS is simpler |
| Connected components count (dynamic) | **Preferred** | Must recount |
| Space complexity | O(n) | O(n + E) for adjacency list |

**Rule of thumb**: If the problem involves *building up* connections and querying connectivity along the way, think Union-Find. If you need traversal order or shortest path, use BFS/DFS.

---

## Complexity Analysis

| Operation | Naive | Path Compression | Union by Rank | Both |
|-----------|-------|-----------------|---------------|------|
| Find | O(n) | O(log n) amortized | O(log n) | O(α(n)) |
| Union | O(n) | O(log n) amortized | O(log n) | O(α(n)) |
| Connected | O(n) | O(log n) amortized | O(log n) | O(α(n)) |
| Space | O(n) | O(n) | O(n) | O(n) |

For **m operations** on **n elements**: O(m · α(n)) ≈ O(m) in practice.

---

## Interview Tips

1. **Recognition signals**: "connected components", "group elements", "merge sets", "are X and Y connected?", "find redundant edge"
2. **Always use both optimizations** — path compression + union by rank/size. Interviewers expect it.
3. **Have the template memorized** — the standard UnionFind class is ~30 lines. Write it first, then solve the problem on top.
4. **Return value from union**: returning `boolean` lets you detect cycles and count components easily.
5. **Map-based UF**: When elements aren't integers 0..n-1, use a `HashMap<T, T>` for parent instead of an array.
6. **Component count**: Maintain a `count` variable, decrement on successful union.
7. **Don't forget**: Union-Find does NOT support efficient deletion or splitting of sets.

### Common Mistakes
- Forgetting to call `find()` before comparing roots
- Not initializing `parent[i] = i`
- Using union by rank but forgetting to only increment when ranks are equal
- Confusing rank (tree height) with size (element count) — pick one, stick with it
