# Advanced Topics

## Table of Contents
- [Backtracking](#backtracking)
- [Binary Search Advanced](#binary-search-advanced)
- [Bit Manipulation](#bit-manipulation)
- [Math & Number Theory](#math--number-theory)
- [Sorting Algorithms Comparison](#sorting-algorithms-comparison)
- [Design Patterns in Interviews](#design-patterns-in-interviews)
- [Concurrency Data Structures](#concurrency-data-structures)
- [System Design Intersections](#system-design-intersections)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Interview Strategy](#interview-strategy)

---

## Backtracking

Backtracking builds solutions incrementally, abandoning ("pruning") paths that cannot lead to a valid solution.

### Template

```java
void backtrack(List<List<T>> result, List<T> current, /* params */) {
    if (isComplete(current)) {
        result.add(new ArrayList<>(current)); // deep copy!
        return;
    }
    for (T candidate : getCandidates(/* params */)) {
        if (!isValid(candidate)) continue; // prune
        current.add(candidate);             // choose
        backtrack(result, current, /* updated params */);
        current.remove(current.size() - 1); // un-choose
    }
}
```

### N-Queens (LC 51)

```java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    boolean[] cols = new boolean[n];
    boolean[] diag1 = new boolean[2 * n]; // row - col + n
    boolean[] diag2 = new boolean[2 * n]; // row + col
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');
    solve(result, board, 0, cols, diag1, diag2, n);
    return result;
}

private void solve(List<List<String>> result, char[][] board, int row,
                   boolean[] cols, boolean[] diag1, boolean[] diag2, int n) {
    if (row == n) {
        List<String> snapshot = new ArrayList<>();
        for (char[] r : board) snapshot.add(new String(r));
        result.add(snapshot);
        return;
    }
    for (int col = 0; col < n; col++) {
        if (cols[col] || diag1[row - col + n] || diag2[row + col]) continue;
        board[row][col] = 'Q';
        cols[col] = diag1[row - col + n] = diag2[row + col] = true;
        solve(result, board, row + 1, cols, diag1, diag2, n);
        board[row][col] = '.';
        cols[col] = diag1[row - col + n] = diag2[row + col] = false;
    }
}
```

### Subsets / Combinations / Permutations

```java
// Subsets (LC 78)
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums, 0);
    return result;
}
private void backtrack(List<List<Integer>> res, List<Integer> curr, int[] nums, int start) {
    res.add(new ArrayList<>(curr));
    for (int i = start; i < nums.length; i++) {
        curr.add(nums[i]);
        backtrack(res, curr, nums, i + 1);
        curr.remove(curr.size() - 1);
    }
}

// Permutations (LC 46) — use a visited array or swap-based
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    permuteHelper(result, new ArrayList<>(), nums, used);
    return result;
}
private void permuteHelper(List<List<Integer>> res, List<Integer> curr, int[] nums, boolean[] used) {
    if (curr.size() == nums.length) { res.add(new ArrayList<>(curr)); return; }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        curr.add(nums[i]);
        permuteHelper(res, curr, nums, used);
        curr.remove(curr.size() - 1);
        used[i] = false;
    }
}
```

---

## Binary Search Advanced

### Search in Rotated Sorted Array (LC 33)

```java
public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;

        if (nums[lo] <= nums[mid]) { // left half is sorted
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
            else lo = mid + 1;
        } else { // right half is sorted
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
            else hi = mid - 1;
        }
    }
    return -1;
}
```

### Finding Boundaries (Lower/Upper Bound)

```java
// First position where nums[i] >= target
int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// First position where nums[i] > target
int upperBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
```

### Binary Search on Answer

When the answer space is monotonic: if `f(x)` is feasible, then `f(x+1)` is also feasible.

**Koko Eating Bananas (LC 875)**

```java
public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = Arrays.stream(piles).max().getAsInt();
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, mid, h)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}

private boolean canFinish(int[] piles, int speed, int h) {
    int hours = 0;
    for (int pile : piles) hours += (pile + speed - 1) / speed;
    return hours <= h;
}
```

---

## Bit Manipulation

### Essential Operations

| Operation | Code | Description |
|-----------|------|-------------|
| Check bit i | `(n >> i) & 1` | Is bit i set? |
| Set bit i | `n \| (1 << i)` | Turn on bit i |
| Clear bit i | `n & ~(1 << i)` | Turn off bit i |
| Toggle bit i | `n ^ (1 << i)` | Flip bit i |
| Lowest set bit | `n & (-n)` | Isolate rightmost 1-bit |
| Clear lowest set bit | `n & (n - 1)` | Turn off rightmost 1-bit |
| Check power of 2 | `n > 0 && (n & (n-1)) == 0` | Only one bit set |
| Count set bits | `Integer.bitCount(n)` | Population count |

### Single Number Variants

```java
// Single Number I — every element appears twice except one. XOR all.
public int singleNumber(int[] nums) {
    int result = 0;
    for (int num : nums) result ^= num;
    return result;
}

// Single Number II — every element appears three times except one.
// Count bits at each position mod 3.
public int singleNumberII(int[] nums) {
    int ones = 0, twos = 0;
    for (int num : nums) {
        ones = (ones ^ num) & ~twos;
        twos = (twos ^ num) & ~ones;
    }
    return ones;
}

// Single Number III — two elements appear once, rest twice.
public int[] singleNumberIII(int[] nums) {
    int xor = 0;
    for (int num : nums) xor ^= num;
    int diffBit = xor & (-xor); // lowest bit where the two differ
    int a = 0, b = 0;
    for (int num : nums) {
        if ((num & diffBit) == 0) a ^= num;
        else b ^= num;
    }
    return new int[]{a, b};
}
```

### Counting Bits (LC 338)

```java
public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1); // dp[i] = dp[i/2] + last bit
    }
    return dp;
}
```

---

## Math & Number Theory

### GCD (Euclidean Algorithm)

```java
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
int lcm(int a, int b) {
    return a / gcd(a, b) * b; // divide first to avoid overflow
}
```

### Sieve of Eratosthenes

```java
public List<Integer> sieve(int n) {
    boolean[] isComposite = new boolean[n + 1];
    List<Integer> primes = new ArrayList<>();
    for (int i = 2; i <= n; i++) {
        if (!isComposite[i]) {
            primes.add(i);
            for (long j = (long) i * i; j <= n; j += i) {
                isComposite[(int) j] = true;
            }
        }
    }
    return primes;
}
```

### Modular Arithmetic

```java
static final int MOD = 1_000_000_007;

// (a + b) % MOD
long modAdd(long a, long b) { return ((a % MOD) + (b % MOD)) % MOD; }

// (a * b) % MOD
long modMul(long a, long b) { return ((a % MOD) * (b % MOD)) % MOD; }
```

### Fast Exponentiation

```java
long modPow(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) result = result * base % mod;
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}
```

---

## Sorting Algorithms Comparison

| Algorithm | Best | Average | Worst | Space | Stable | Notes |
|-----------|------|---------|-------|-------|--------|-------|
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes | Best for small/nearly sorted |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Guaranteed O(n log n) |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Fastest in practice |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | In-place, not cache-friendly |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | Integer keys in range [0,k] |
| Radix Sort | O(d·(n+k)) | O(d·(n+k)) | O(d·(n+k)) | O(n+k) | Yes | Fixed-length keys |
| Bucket Sort | O(n+k) | O(n+k) | O(n²) | O(n) | Yes | Uniform distribution |

### Java's Built-in Sorts

| Method | Algorithm | Stability | Use Case |
|--------|-----------|-----------|----------|
| `Arrays.sort(int[])` | Dual-pivot Quicksort | No | Primitives |
| `Arrays.sort(Object[])` | TimSort (merge sort hybrid) | Yes | Objects |
| `Collections.sort()` | TimSort | Yes | Lists |

**TimSort**: Merge sort + insertion sort hybrid. Exploits existing runs in data. O(n) best case for nearly sorted data.

---

## Design Patterns in Interviews

### LRU Cache (LC 146)

```java
public class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map;
    private final Node head, tail; // dummy sentinel nodes

    class Node {
        int key, value;
        Node prev, next;
        Node(int k, int v) { key = k; value = v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        map = new HashMap<>();
        head = new Node(0, 0);
        tail = new Node(0, 0);
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        addToHead(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.value = value;
            remove(node);
            addToHead(node);
        } else {
            Node node = new Node(key, value);
            map.put(key, node);
            addToHead(node);
            if (map.size() > capacity) {
                Node lru = tail.prev;
                remove(lru);
                map.remove(lru.key);
            }
        }
    }

    private void addToHead(Node node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void remove(Node node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
}
```

### Iterator Pattern (Flatten Nested List)

```java
public class NestedIterator implements Iterator<Integer> {
    private Deque<Iterator<NestedInteger>> stack = new ArrayDeque<>();
    private Integer next;

    public NestedIterator(List<NestedInteger> nestedList) {
        stack.push(nestedList.iterator());
    }

    public Integer next() {
        if (!hasNext()) throw new NoSuchElementException();
        Integer val = next;
        next = null;
        return val;
    }

    public boolean hasNext() {
        while (next == null && !stack.isEmpty()) {
            Iterator<NestedInteger> it = stack.peek();
            if (!it.hasNext()) { stack.pop(); continue; }
            NestedInteger ni = it.next();
            if (ni.isInteger()) next = ni.getInteger();
            else stack.push(ni.getList().iterator());
        }
        return next != null;
    }
}
```

---

## Concurrency Data Structures

Conceptual understanding often tested in system design rounds.

| Structure | Key Properties | Use Case |
|-----------|---------------|----------|
| `ConcurrentHashMap` | Segment-level locking (Java 8: node-level CAS), no full-map lock | Shared mutable maps across threads |
| `CopyOnWriteArrayList` | Creates new copy on every write, reads are lock-free | Read-heavy, write-rare scenarios |
| `BlockingQueue` | `put()` blocks when full, `take()` blocks when empty | Producer-consumer pattern |
| `AtomicInteger` | CAS-based lock-free operations | Counters, accumulators |
| `ReadWriteLock` | Multiple concurrent readers, exclusive writers | Read-heavy shared resources |
| `CountDownLatch` | One-time barrier, counts down to zero | Wait for N tasks to complete |
| `CyclicBarrier` | Reusable barrier, all threads must arrive | Phased parallel computation |

### ConcurrentHashMap Key Points
- **Java 7**: `Segment[]` (16 segments by default), each segment locks independently
- **Java 8**: Node-level CAS + synchronized on individual bins, `computeIfAbsent()` is atomic
- **Never use** `HashMap` in concurrent code — infinite loops possible on resize

---

## System Design Intersections

### Consistent Hashing
- Maps keys to a hash ring; nodes own ranges
- Adding/removing a node only remaps O(K/N) keys (K keys, N nodes)
- Virtual nodes improve balance

### Bloom Filters
- Probabilistic set membership: no false negatives, possible false positives
- Uses k hash functions mapping to a bit array of size m
- False positive rate ≈ `(1 - e^(-kn/m))^k`
- Used in: databases (avoid disk reads), caches, spell checkers

### Skip Lists
- Probabilistic alternative to balanced BSTs
- O(log n) search/insert/delete with randomized levels
- Used in Redis sorted sets, LevelDB/RocksDB memtables

### B-Trees / B+ Trees
- Self-balancing tree optimized for disk I/O (high branching factor)
- B+ Trees store data only in leaves, internal nodes are index
- Used in databases (MySQL InnoDB) and file systems

---

## Complexity Cheat Sheet

### Data Structure Operations

| Data Structure | Access | Search | Insert | Delete | Notes |
|---------------|--------|--------|--------|--------|-------|
| Array | O(1) | O(n) | O(n) | O(n) | O(1) append amortized |
| Linked List | O(n) | O(n) | O(1)* | O(1)* | *At known position |
| Stack | O(n) | O(n) | O(1) | O(1) | LIFO |
| Queue | O(n) | O(n) | O(1) | O(1) | FIFO |
| HashMap | — | O(1)† | O(1)† | O(1)† | †Amortized, O(n) worst |
| TreeMap | — | O(log n) | O(log n) | O(log n) | Sorted keys |
| HashSet | — | O(1)† | O(1)† | O(1)† | †Amortized |
| TreeSet | — | O(log n) | O(log n) | O(log n) | Sorted |
| Heap (PQ) | O(1) top | O(n) | O(log n) | O(log n) | Min/Max in O(1) |
| BST (balanced) | — | O(log n) | O(log n) | O(log n) | AVL, Red-Black |
| Trie | — | O(L) | O(L) | O(L) | L = key length |
| Union-Find | — | O(α(n)) | — | O(α(n)) | Nearly O(1) |

### Algorithm Complexities

| Algorithm | Time | Space | Category |
|-----------|------|-------|----------|
| Binary Search | O(log n) | O(1) | Search |
| BFS / DFS | O(V + E) | O(V) | Graph traversal |
| Dijkstra (binary heap) | O((V+E) log V) | O(V) | Shortest path |
| Bellman-Ford | O(V·E) | O(V) | Shortest path (neg weights) |
| Floyd-Warshall | O(V³) | O(V²) | All-pairs shortest path |
| Kruskal's MST | O(E log E) | O(V) | MST |
| Prim's MST (binary heap) | O((V+E) log V) | O(V) | MST |
| Topological Sort | O(V + E) | O(V) | DAG ordering |
| KMP String Match | O(n + m) | O(m) | Pattern matching |
| Merge Sort | O(n log n) | O(n) | Sorting |
| Quick Sort | O(n log n) avg | O(log n) | Sorting |

---

## Interview Strategy

### Time Management (45-minute coding interview)

| Phase | Time | Activity |
|-------|------|----------|
| 0-5 min | Clarify | Restate the problem, ask about edge cases, confirm I/O format |
| 5-10 min | Plan | Discuss approach, state time/space complexity *before* coding |
| 10-35 min | Code | Write clean, working code. Talk through your logic. |
| 35-40 min | Test | Trace through examples. Test edge cases mentally. |
| 40-45 min | Optimize | Discuss improvements if any. Answer follow-up questions. |

### Communication Framework

1. **Repeat** the problem in your own words
2. **Examples**: Walk through 1-2 examples to confirm understanding
3. **Brute force**: State the obvious O(n²) or O(2^n) approach
4. **Optimize**: Explain why and how you can do better
5. **Code**: Write it, explaining as you go
6. **Test**: Dry-run with the examples. Check off-by-one, null, empty input.

### When You're Stuck

1. **Think aloud** — silence is the worst thing in an interview
2. **Simplify** — solve a smaller version of the problem first
3. **Think about what data structure would help** — if brute force is O(n²), what gives O(n log n) or O(n)?
4. **Work backwards** — what does the answer look like? What information would you need?
5. **Draw it** — diagrams and examples often reveal patterns
6. **Ask for a hint** — better than wasting 10 minutes silently

### Pattern Recognition Quick Reference

| If you see... | Think... |
|---------------|----------|
| "Sorted array" | Binary search, two pointers |
| "Top K / Kth largest" | Heap, quickselect |
| "Connected/grouped" | Union-Find, BFS/DFS |
| "Shortest path" | BFS (unweighted), Dijkstra (weighted) |
| "Tree traversal" | DFS (pre/in/post), BFS (level order) |
| "Subarray with condition" | Sliding window, prefix sum |
| "All possible / generate" | Backtracking |
| "Min/max cost, ways to" | Dynamic programming |
| "Stream of data" | Heap, design with HashMap |
| "Parentheses / nested" | Stack |
| "In-place rearrange" | Two pointers, cyclic sort |
| "Prefix/suffix" | Trie, prefix sum array |
| "Interval scheduling" | Sort + greedy or merge |
| "Matrix traversal" | BFS/DFS, grid DP |
