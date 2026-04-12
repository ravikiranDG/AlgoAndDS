# Graphs

## 1. Graph Representations

### Adjacency List

Best for **sparse graphs** (E << V²). Most common in interviews.

```java
// Unweighted
Map<Integer, List<Integer>> graph = new HashMap<>();
graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
graph.computeIfAbsent(v, k -> new ArrayList<>()).add(u); // undirected

// Weighted
Map<Integer, List<int[]>> graph = new HashMap<>(); // int[] = {neighbor, weight}
graph.computeIfAbsent(u, k -> new ArrayList<>()).add(new int[]{v, w});

// Using array (when nodes are 0..n-1)
List<List<Integer>> graph = new ArrayList<>();
for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
graph.get(u).add(v);
```

### Adjacency Matrix

Best for **dense graphs** or when you need O(1) edge lookups.

```java
boolean[][] graph = new boolean[n][n];
graph[u][v] = true;
graph[v][u] = true; // undirected

int[][] weighted = new int[n][n]; // 0 or INF = no edge
```

### Edge List

Useful for Kruskal's algorithm (sort edges by weight).

```java
int[][] edges = {{u1, v1, w1}, {u2, v2, w2}, ...};
```

### Comparison

| | Adjacency List | Adjacency Matrix | Edge List |
|---|---|---|---|
| Space | O(V + E) | O(V²) | O(E) |
| Add edge | O(1) | O(1) | O(1) |
| Check edge (u, v) | O(degree(u)) | O(1) | O(E) |
| Iterate neighbors | O(degree(u)) | O(V) | O(E) |
| Best for | Sparse graphs | Dense graphs | Edge-centric algorithms |

---

## 2. BFS — Breadth-First Search

### Algorithm

Explore all neighbors at the current depth before moving deeper. Uses a **queue**.

```java
public void bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    queue.offer(start);
    visited.add(start);

    while (!queue.isEmpty()) {
        int node = queue.poll();
        process(node);
        for (int neighbor : graph.getOrDefault(node, List.of())) {
            if (visited.add(neighbor)) {
                queue.offer(neighbor);
            }
        }
    }
}
// Time: O(V + E), Space: O(V)
```

### BFS with Level Tracking

```java
public int bfsLevels(Map<Integer, List<Integer>> graph, int start, int target) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    queue.offer(start);
    visited.add(start);
    int level = 0;

    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int node = queue.poll();
            if (node == target) return level;
            for (int nei : graph.getOrDefault(node, List.of())) {
                if (visited.add(nei)) queue.offer(nei);
            }
        }
        level++;
    }
    return -1; // not found
}
```

### Shortest Path in Unweighted Graph

BFS naturally finds shortest paths in unweighted graphs because it explores level by level.

### Bidirectional BFS

Search from both source and target simultaneously. When the two frontiers meet, you've found the shortest path.

```java
public int bidirectionalBFS(Map<Integer, List<Integer>> graph, int src, int dst) {
    if (src == dst) return 0;
    Set<Integer> frontA = new HashSet<>(Set.of(src));
    Set<Integer> frontB = new HashSet<>(Set.of(dst));
    Set<Integer> visited = new HashSet<>(Set.of(src, dst));
    int level = 0;

    while (!frontA.isEmpty() && !frontB.isEmpty()) {
        level++;
        // Always expand the smaller frontier
        if (frontA.size() > frontB.size()) {
            Set<Integer> temp = frontA; frontA = frontB; frontB = temp;
        }
        Set<Integer> nextFront = new HashSet<>();
        for (int node : frontA) {
            for (int nei : graph.getOrDefault(node, List.of())) {
                if (frontB.contains(nei)) return level;
                if (visited.add(nei)) nextFront.add(nei);
            }
        }
        frontA = nextFront;
    }
    return -1;
}
```

Time: O(V + E) but in practice much faster — explores O(b^(d/2)) instead of O(b^d).

---

## 3. DFS — Depth-First Search

### Recursive DFS

```java
public void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
    visited.add(node);
    process(node);
    for (int neighbor : graph.getOrDefault(node, List.of())) {
        if (!visited.contains(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}
```

### Iterative DFS

```java
public void dfsIterative(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (!visited.add(node)) continue;
        process(node);
        for (int nei : graph.getOrDefault(node, List.of())) {
            if (!visited.contains(nei)) stack.push(nei);
        }
    }
}
// Time: O(V + E), Space: O(V)
```

### Cycle Detection — Directed Graph

Use three states: unvisited, in-progress (on current recursion stack), done.

```java
public boolean hasCycle(Map<Integer, List<Integer>> graph, int n) {
    int[] state = new int[n]; // 0=unvisited, 1=in-progress, 2=done

    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && dfsCycle(graph, i, state)) return true;
    }
    return false;
}

private boolean dfsCycle(Map<Integer, List<Integer>> graph, int node, int[] state) {
    state[node] = 1;
    for (int nei : graph.getOrDefault(node, List.of())) {
        if (state[nei] == 1) return true;      // back edge → cycle
        if (state[nei] == 0 && dfsCycle(graph, nei, state)) return true;
    }
    state[node] = 2;
    return false;
}
```

### Cycle Detection — Undirected Graph

Track the parent to avoid counting the edge you came from.

```java
private boolean dfsCycleUndirected(Map<Integer, List<Integer>> graph,
                                    int node, int parent, Set<Integer> visited) {
    visited.add(node);
    for (int nei : graph.getOrDefault(node, List.of())) {
        if (!visited.contains(nei)) {
            if (dfsCycleUndirected(graph, nei, node, visited)) return true;
        } else if (nei != parent) {
            return true; // visited and not parent → cycle
        }
    }
    return false;
}
```

### Connected Components

```java
public int countComponents(int n, int[][] edges) {
    Map<Integer, List<Integer>> graph = buildGraph(edges);
    Set<Integer> visited = new HashSet<>();
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (visited.add(i)) {
            dfs(graph, i, visited);
            count++;
        }
    }
    return count;
}
```

---

## 4. Topological Sort

Linear ordering of vertices such that for every directed edge u → v, u comes before v. **Only valid for DAGs** (Directed Acyclic Graphs).

### Kahn's Algorithm (BFS-based)

```java
public List<Integer> topologicalSort(int n, int[][] edges) {
    Map<Integer, List<Integer>> graph = new HashMap<>();
    int[] indegree = new int[n];

    for (int[] e : edges) {
        graph.computeIfAbsent(e[0], k -> new ArrayList<>()).add(e[1]);
        indegree[e[1]]++;
    }

    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) queue.offer(i);
    }

    List<Integer> order = new ArrayList<>();
    while (!queue.isEmpty()) {
        int node = queue.poll();
        order.add(node);
        for (int nei : graph.getOrDefault(node, List.of())) {
            if (--indegree[nei] == 0) queue.offer(nei);
        }
    }

    return order.size() == n ? order : List.of(); // empty if cycle exists
}
// Time: O(V + E), Space: O(V + E)
```

### DFS-based Topological Sort

```java
public List<Integer> topologicalSortDFS(int n, int[][] edges) {
    Map<Integer, List<Integer>> graph = buildGraph(edges);
    int[] state = new int[n]; // 0=unvisited, 1=in-progress, 2=done
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        if (state[i] == 0 && !dfsTopoSort(graph, i, state, stack))
            return List.of(); // cycle detected
    }
    return new ArrayList<>(stack); // stack contains reverse post-order
}

private boolean dfsTopoSort(Map<Integer, List<Integer>> graph, int node,
                             int[] state, Deque<Integer> stack) {
    state[node] = 1;
    for (int nei : graph.getOrDefault(node, List.of())) {
        if (state[nei] == 1) return false; // cycle
        if (state[nei] == 0 && !dfsTopoSort(graph, nei, state, stack)) return false;
    }
    state[node] = 2;
    stack.push(node);
    return true;
}
```

| Approach | Cycle Detection | Output |
|----------|----------------|--------|
| Kahn's (BFS) | `order.size() < n` | Order directly |
| DFS | Back edge (in-progress → in-progress) | Reverse post-order |

---

## 5. Shortest Path Algorithms

### Dijkstra's Algorithm

For **non-negative weights**. Greedy approach using a min-heap.

```java
public int[] dijkstra(Map<Integer, List<int[]>> graph, int src, int n) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    // {distance, node}
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    pq.offer(new int[]{0, src});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int d = curr[0], u = curr[1];
        if (d > dist[u]) continue; // stale entry

        for (int[] edge : graph.getOrDefault(u, List.of())) {
            int v = edge[0], w = edge[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.offer(new int[]{dist[v], v});
            }
        }
    }
    return dist;
}
// Time: O((V + E) log V) with binary heap
// Space: O(V + E)
```

### Bellman-Ford Algorithm

Handles **negative weights**. Detects negative cycles.

```java
public int[] bellmanFord(int[][] edges, int n, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;

    // Relax all edges V-1 times
    for (int i = 0; i < n - 1; i++) {
        for (int[] e : edges) {
            int u = e[0], v = e[1], w = e[2];
            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }

    // Check for negative cycles (one more pass)
    for (int[] e : edges) {
        if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]]) {
            throw new RuntimeException("Negative cycle detected");
        }
    }
    return dist;
}
// Time: O(V * E), Space: O(V)
```

### Floyd-Warshall Algorithm

**All-pairs** shortest paths. Works with negative weights (no negative cycles).

```java
public int[][] floydWarshall(int[][] graph, int n) {
    int[][] dist = new int[n][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE / 2);
    for (int i = 0; i < n; i++) dist[i][i] = 0;
    for (int[] e : edges) dist[e[0]][e[1]] = e[2];

    for (int k = 0; k < n; k++)
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                dist[i][j] = Math.min(dist[i][j], dist[i][k] + dist[k][j]);

    return dist;
}
// Time: O(V³), Space: O(V²)
```

### When to Use Which

| Algorithm | Weights | Negative Edges | Source | Time |
|-----------|---------|----------------|--------|------|
| BFS | Unweighted | N/A | Single | O(V + E) |
| Dijkstra | Non-negative | No | Single | O((V+E) log V) |
| Bellman-Ford | Any | Yes (detects neg cycles) | Single | O(V·E) |
| Floyd-Warshall | Any | Yes (no neg cycles) | All-pairs | O(V³) |

---

## 6. Minimum Spanning Tree

### Kruskal's Algorithm

Sort edges by weight, add edges greedily (skip if it creates a cycle — check with Union-Find).

```java
public int kruskal(int n, int[][] edges) {
    Arrays.sort(edges, (a, b) -> a[2] - b[2]); // sort by weight
    UnionFind uf = new UnionFind(n);
    int cost = 0, edgesUsed = 0;

    for (int[] e : edges) {
        if (uf.union(e[0], e[1])) {
            cost += e[2];
            if (++edgesUsed == n - 1) break;
        }
    }
    return edgesUsed == n - 1 ? cost : -1; // -1 if not connected
}
// Time: O(E log E), Space: O(V)
```

### Prim's Algorithm

Grow MST from a starting vertex, always picking the cheapest edge to an unvisited vertex.

```java
public int prim(Map<Integer, List<int[]>> graph, int n) {
    boolean[] inMST = new boolean[n];
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]); // {node, weight}
    pq.offer(new int[]{0, 0});
    int cost = 0, edgesUsed = 0;

    while (!pq.isEmpty() && edgesUsed < n) {
        int[] curr = pq.poll();
        int u = curr[0], w = curr[1];
        if (inMST[u]) continue;
        inMST[u] = true;
        cost += w;
        edgesUsed++;

        for (int[] edge : graph.getOrDefault(u, List.of())) {
            if (!inMST[edge[0]]) pq.offer(new int[]{edge[0], edge[1]});
        }
    }
    return cost;
}
// Time: O(E log V), Space: O(V + E)
```

| Algorithm | Best For | Time |
|-----------|----------|------|
| Kruskal's | Sparse graphs, edge list available | O(E log E) |
| Prim's | Dense graphs, adjacency list | O(E log V) |

---

## 7. Union-Find (Disjoint Set Union)

### Implementation with Path Compression + Union by Rank

```java
class UnionFind {
    int[] parent, rank;

    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // path compression
        return parent[x];
    }

    boolean union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false; // already connected
        if (rank[px] < rank[py]) { int t = px; px = py; py = t; }
        parent[py] = px; // union by rank
        if (rank[px] == rank[py]) rank[px]++;
        return true;
    }

    boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
```

| Operation | Time (amortized) |
|-----------|-----------------|
| `find` | O(α(n)) ≈ O(1) |
| `union` | O(α(n)) ≈ O(1) |

α(n) is the inverse Ackermann function — grows incredibly slowly, effectively constant.

### Applications

- **Kruskal's MST**: Check if adding an edge creates a cycle
- **Number of connected components**: Count distinct roots
- **Redundant connections**: Find the edge that creates a cycle
- **Accounts merge**: Group accounts by common emails
- **Detect cycle in undirected graph**: If `find(u) == find(v)` before union, cycle exists

---

## 8. Advanced Graph Algorithms

### Tarjan's Strongly Connected Components

A directed graph's **SCC** is a maximal set of vertices where every vertex is reachable from every other.

```java
class TarjanSCC {
    int n, timer = 0, sccCount = 0;
    List<List<Integer>> graph;
    int[] disc, low, sccId;
    boolean[] onStack;
    Deque<Integer> stack = new ArrayDeque<>();

    public int findSCCs(List<List<Integer>> graph, int n) {
        this.graph = graph; this.n = n;
        disc = new int[n]; low = new int[n]; sccId = new int[n];
        onStack = new boolean[n];
        Arrays.fill(disc, -1);

        for (int i = 0; i < n; i++)
            if (disc[i] == -1) dfs(i);
        return sccCount;
    }

    private void dfs(int u) {
        disc[u] = low[u] = timer++;
        stack.push(u);
        onStack[u] = true;

        for (int v : graph.get(u)) {
            if (disc[v] == -1) {
                dfs(v);
                low[u] = Math.min(low[u], low[v]);
            } else if (onStack[v]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }

        if (low[u] == disc[u]) { // root of SCC
            while (true) {
                int v = stack.pop();
                onStack[v] = false;
                sccId[v] = sccCount;
                if (v == u) break;
            }
            sccCount++;
        }
    }
}
// Time: O(V + E)
```

### Bridges and Articulation Points

A **bridge** is an edge whose removal disconnects the graph.
An **articulation point** is a vertex whose removal disconnects the graph.

```java
// Find bridges
private void dfsBridges(List<List<Integer>> graph, int u, int parent,
                         int[] disc, int[] low, List<int[]> bridges) {
    disc[u] = low[u] = timer++;
    for (int v : graph.get(u)) {
        if (disc[v] == -1) {
            dfsBridges(graph, v, u, disc, low, bridges);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > disc[u]) // no back edge from subtree of v to u or ancestors
                bridges.add(new int[]{u, v});
        } else if (v != parent) {
            low[u] = Math.min(low[u], disc[v]);
        }
    }
}
```

---

## 9. Graph Coloring / Bipartite Check

A graph is **bipartite** if it can be 2-colored — no two adjacent vertices share a color.

```java
public boolean isBipartite(int[][] graph) {
    int n = graph.length;
    int[] color = new int[n]; // 0=uncolored, 1=color1, -1=color2

    for (int i = 0; i < n; i++) {
        if (color[i] != 0) continue;
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(i);
        color[i] = 1;

        while (!queue.isEmpty()) {
            int node = queue.poll();
            for (int nei : graph[node]) {
                if (color[nei] == 0) {
                    color[nei] = -color[node];
                    queue.offer(nei);
                } else if (color[nei] == color[node]) {
                    return false;
                }
            }
        }
    }
    return true;
}
// Time: O(V + E)
```

> **Interview insight**: A graph is bipartite if and only if it contains **no odd-length cycles**.

---

## 10. Common Interview Patterns

### Number of Islands (Grid BFS/DFS)

```java
public int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfsFlood(grid, i, j);
            }
        }
    }
    return count;
}

private void dfsFlood(char[][] grid, int r, int c) {
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length
        || grid[r][c] != '1') return;
    grid[r][c] = '0'; // mark visited
    dfsFlood(grid, r + 1, c);
    dfsFlood(grid, r - 1, c);
    dfsFlood(grid, r, c + 1);
    dfsFlood(grid, r, c - 1);
}
```

### Word Ladder (BFS + Word Transformation)

```java
public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> dict = new HashSet<>(wordList);
    if (!dict.contains(endWord)) return 0;

    Queue<String> queue = new LinkedList<>();
    queue.offer(beginWord);
    int level = 1;

    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            char[] word = queue.poll().toCharArray();
            for (int j = 0; j < word.length; j++) {
                char original = word[j];
                for (char c = 'a'; c <= 'z'; c++) {
                    word[j] = c;
                    String next = String.valueOf(word);
                    if (next.equals(endWord)) return level + 1;
                    if (dict.remove(next)) queue.offer(next);
                }
                word[j] = original;
            }
        }
        level++;
    }
    return 0;
}
```

### Network Delay Time (Dijkstra Application)

```java
public int networkDelayTime(int[][] times, int n, int k) {
    Map<Integer, List<int[]>> graph = new HashMap<>();
    for (int[] t : times)
        graph.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});

    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;

    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    pq.offer(new int[]{k, 0});

    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0], d = curr[1];
        if (d > dist[u]) continue;
        for (int[] e : graph.getOrDefault(u, List.of())) {
            if (dist[u] + e[1] < dist[e[0]]) {
                dist[e[0]] = dist[u] + e[1];
                pq.offer(new int[]{e[0], dist[e[0]]});
            }
        }
    }

    int max = 0;
    for (int i = 1; i <= n; i++) max = Math.max(max, dist[i]);
    return max == Integer.MAX_VALUE ? -1 : max;
}
```

---

## 11. Complexity Summary

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| BFS / DFS | O(V + E) | O(V) | Foundation |
| Topological Sort | O(V + E) | O(V + E) | DAG only |
| Dijkstra (binary heap) | O((V+E) log V) | O(V + E) | Non-negative weights |
| Bellman-Ford | O(V · E) | O(V) | Handles negative weights |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs |
| Kruskal's MST | O(E log E) | O(V) | Sparse graphs |
| Prim's MST | O(E log V) | O(V + E) | Dense graphs |
| Union-Find ops | O(α(n)) ≈ O(1) | O(V) | Amortized |
| Tarjan's SCC | O(V + E) | O(V) | Directed graphs |
| Bipartite Check | O(V + E) | O(V) | BFS/DFS coloring |

---

## 12. Interview Tips

### Recognizing Graph Problems

Look for these signals:
- **"Connected" / "reachable"** → BFS/DFS, Union-Find
- **"Shortest path"** → BFS (unweighted), Dijkstra (weighted)
- **"Ordering" / "prerequisites"** → Topological sort
- **"Groups" / "components"** → Union-Find or DFS
- **"Grid traversal"** → Treat grid as implicit graph
- **"Minimum cost to connect"** → MST

### BFS vs DFS Decision

| Use BFS When | Use DFS When |
|--------------|--------------|
| Shortest path (unweighted) | Cycle detection |
| Level-by-level processing | Topological sort |
| Nearest neighbor queries | Path finding (all paths) |
| Bidirectional search | Connected components |
| Word ladder / transformation | Backtracking on graph |

### Common Mistakes

1. **Forgetting to mark visited before enqueueing** (BFS): Causes duplicate processing and potential TLE.
2. **Using DFS for shortest path in unweighted graph**: BFS guarantees shortest path; DFS does not.
3. **Not handling disconnected graphs**: Always loop over all nodes as potential starting points.
4. **Integer overflow with Dijkstra**: Use `long` for distance accumulation with large weights.
5. **Dijkstra with negative weights**: Use Bellman-Ford instead.
6. **Not tracking parent in undirected cycle detection**: Will incorrectly detect the edge you came from as a cycle.
