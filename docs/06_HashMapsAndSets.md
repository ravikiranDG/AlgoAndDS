# HashMaps and Sets

## 1. Hashing Fundamentals

A **hash function** maps keys to indices in a fixed-size array (bucket array), enabling O(1) average-case lookups.

### Properties of a Good Hash Function
- **Deterministic**: Same key always produces the same hash
- **Uniform distribution**: Minimizes clustering / collisions
- **Fast to compute**: O(1) per key

### Collision Resolution Strategies

| Strategy | Mechanism | Pros | Cons |
|----------|-----------|------|------|
| **Separate Chaining** | Each bucket holds a linked list (or tree) | Simple, graceful degradation | Extra memory for pointers |
| **Open Addressing — Linear Probing** | Check next slot sequentially | Cache-friendly | Primary clustering |
| **Open Addressing — Quadratic Probing** | Check slot i + 1², i + 2², ... | Reduces primary clustering | Secondary clustering |
| **Open Addressing — Double Hashing** | Use second hash function for step size | Best distribution | More computation |

Java's `HashMap` uses **separate chaining** with linked lists that convert to **red-black trees** when a bucket exceeds 8 entries (Java 8+).

---

## 2. Java HashMap Internals

### Structure

```
HashMap<K, V>
├── Node<K,V>[] table     // bucket array
├── int size               // number of entries
├── int threshold          // capacity * loadFactor
├── float loadFactor       // default 0.75
└── int modCount           // structural modification counter
```

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Initial capacity | 16 | Must be power of 2 |
| Load factor | 0.75 | Ratio of entries to capacity before resize |
| Treeify threshold | 8 | Bucket converts linked list → red-black tree |
| Untreeify threshold | 6 | Tree reverts to linked list |
| Min treeify capacity | 64 | Table must be this large before treeification |

### How `put(key, value)` Works

1. Compute `hash(key)`: `(h = key.hashCode()) ^ (h >>> 16)` — spreads higher bits
2. Compute bucket index: `hash & (capacity - 1)` — works because capacity is power of 2
3. If bucket is empty → insert new `Node`
4. If bucket has entries → check for key match:
   - Match found → replace value
   - No match → append to list/tree
5. If `size > threshold` → **rehash**: double capacity, redistribute all entries

### Rehashing

When load factor is exceeded, the table doubles in size. All entries are rehashed because the bucket index formula changes with new capacity. This is an **O(n) amortized** operation.

### Treeification (Java 8+)

When a single bucket exceeds 8 entries AND the table has ≥ 64 buckets, the linked list converts to a red-black tree. This improves worst-case bucket lookup from O(n) to O(log n).

```
Worst-case lookup:
  Pre-Java 8:  O(n)      — all keys collide into one bucket
  Java 8+:     O(log n)  — treeified bucket
```

---

## 3. The equals() and hashCode() Contract

**This is one of the most frequently asked Java interview topics.**

### The Contract

1. **If `a.equals(b)` is true, then `a.hashCode() == b.hashCode()` must be true.**
2. If `a.hashCode() == b.hashCode()`, `a.equals(b)` may or may not be true (collisions are allowed).
3. `equals()` must be reflexive, symmetric, transitive, and consistent.

### What Breaks if You Violate It

```java
// BAD: overrides equals() but not hashCode()
class Key {
    int id;
    @Override
    public boolean equals(Object o) {
        return o instanceof Key && ((Key) o).id == this.id;
    }
    // hashCode() NOT overridden — uses Object's default (memory address)
}

Map<Key, String> map = new HashMap<>();
Key k1 = new Key(1);
map.put(k1, "hello");

Key k2 = new Key(1);        // k2.equals(k1) == true
map.get(k2);                 // returns NULL! Different hashCode → different bucket
```

### Correct Implementation

```java
class Key {
    int id;
    String name;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Key)) return false;
        Key other = (Key) o;
        return id == other.id && Objects.equals(name, other.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
```

> **Interview tip**: Always mention the contract. If asked "what happens if you only override equals?", explain the broken HashMap lookup scenario above.

---

## 4. Java Map and Set Variants

### Map Variants

| Class | Ordering | Null Keys | Time Complexity | Use Case |
|-------|----------|-----------|-----------------|----------|
| `HashMap` | None | 1 allowed | O(1) avg | General purpose |
| `LinkedHashMap` | **Insertion order** | 1 allowed | O(1) avg | LRU cache, ordered iteration |
| `TreeMap` | **Sorted by key** | Not allowed | O(log n) | Range queries, sorted data |
| `ConcurrentHashMap` | None | Not allowed | O(1) avg | Thread-safe |
| `Hashtable` | None | Not allowed | O(1) avg | Legacy — avoid |

### Set Variants

| Class | Ordering | Null Elements | Backed By |
|-------|----------|---------------|-----------|
| `HashSet` | None | 1 allowed | `HashMap` |
| `LinkedHashSet` | Insertion order | 1 allowed | `LinkedHashMap` |
| `TreeSet` | Sorted (natural/comparator) | Not allowed | `TreeMap` |

### LinkedHashMap — Insertion vs Access Order

```java
// Insertion order (default)
Map<String, Integer> lhm = new LinkedHashMap<>();

// Access order — moves accessed entries to end (basis for LRU)
Map<String, Integer> lhm = new LinkedHashMap<>(16, 0.75f, true);
```

### TreeMap — Useful Operations

```java
TreeMap<Integer, String> tm = new TreeMap<>();
tm.put(1, "a"); tm.put(3, "c"); tm.put(5, "e");

tm.firstKey();          // 1
tm.lastKey();           // 5
tm.floorKey(4);         // 3 — greatest key ≤ 4
tm.ceilingKey(4);       // 5 — smallest key ≥ 4
tm.subMap(1, true, 5, false); // {1=a, 3=c}
tm.headMap(3);          // {1=a}
tm.tailMap(3);          // {3=c, 5=e}
```

---

## 5. Common Patterns

### Frequency Counting

```java
Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) {
    freq.merge(c, 1, Integer::sum);
}
// or: freq.put(c, freq.getOrDefault(c, 0) + 1);
```

### Grouping (Group Anagrams)

```java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] key = s.toCharArray();
        Arrays.sort(key);
        map.computeIfAbsent(String.valueOf(key), k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}
```

### Two-Sum Pattern

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>(); // value → index
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) {
            return new int[]{seen.get(complement), i};
        }
        seen.put(nums[i], i);
    }
    return new int[]{};
}
// Time: O(n), Space: O(n)
```

### Subarray Sum Equals K (Prefix Sum + HashMap)

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1); // empty prefix
    int sum = 0, count = 0;

    for (int num : nums) {
        sum += num;
        // If (sum - k) was a previous prefix sum, those subarrays sum to k
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}
// Time: O(n), Space: O(n)
```

### First Non-Repeating Character

```java
public int firstUniqChar(String s) {
    Map<Character, Integer> freq = new LinkedHashMap<>();
    for (char c : s.toCharArray())
        freq.merge(c, 1, Integer::sum);
    for (Map.Entry<Character, Integer> e : freq.entrySet())
        if (e.getValue() == 1) return s.indexOf(e.getKey());
    return -1;
}
```

### Longest Consecutive Sequence

```java
public int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);

    int longest = 0;
    for (int n : set) {
        if (!set.contains(n - 1)) { // only start from sequence beginning
            int len = 1;
            while (set.contains(n + len)) len++;
            longest = Math.max(longest, len);
        }
    }
    return longest;
}
// Time: O(n), Space: O(n)
```

---

## 6. Design Problems

### LRU Cache

Uses `LinkedHashMap` with access-order mode. Override `removeEldestEntry` for automatic eviction.

```java
class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true); // access-order = true
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}
```

### LRU Cache — Manual Implementation (Interview Standard)

```java
class LRUCache {
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0); // dummy
    private final Node tail = new Node(0, 0); // dummy

    static class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node);
        addToHead(node);
        return node.val;
    }

    public void put(int key, int value) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            node.val = value;
            remove(node);
            addToHead(node);
        } else {
            if (map.size() == capacity) {
                map.remove(tail.prev.key);
                remove(tail.prev);
            }
            Node node = new Node(key, value);
            map.put(key, node);
            addToHead(node);
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
// All operations: O(1) time, O(capacity) space
```

### LFU Cache (Conceptual)

- Track frequency of each key
- Maintain a `Map<Integer, LinkedHashSet<Integer>>` mapping frequency → keys (in insertion order)
- On eviction, remove the least-frequently used key; break ties by LRU (oldest in the set)
- `get` and `put` both update frequency

---

## 7. Consistent Hashing (System Design)

Used in distributed systems to minimize key remapping when nodes are added/removed.

**How it works**:
1. Hash both keys and server nodes onto a circular ring (0 to 2^32)
2. Each key is assigned to the next server clockwise on the ring
3. When a server is added/removed, only keys between adjacent servers need remapping

**Virtual nodes**: Each physical server maps to multiple points on the ring, improving balance.

> This is a system design concept — unlikely to be coded in an interview, but commonly discussed.

---

## 8. Complexity Analysis

### HashMap / HashSet

| Operation | Average | Worst Case | Notes |
|-----------|---------|------------|-------|
| `put` / `add` | O(1) | O(n) | Worst case: all keys collide |
| `get` / `contains` | O(1) | O(log n)* | *Java 8+ with treeified buckets |
| `remove` | O(1) | O(log n)* | Same as above |
| `containsValue` | O(n) | O(n) | Must scan all entries |
| Iteration | O(n + capacity) | — | Iterates over all buckets |
| **Space** | **O(n)** | — | n entries + bucket array overhead |

### TreeMap / TreeSet

| Operation | Time | Notes |
|-----------|------|-------|
| `put` / `add` | O(log n) | Red-black tree |
| `get` / `contains` | O(log n) | |
| `remove` | O(log n) | |
| `firstKey/lastKey` | O(log n) | |
| `floorKey/ceilingKey` | O(log n) | |
| Iteration (in order) | O(n) | |

---

## 9. Interview Tips

### Choosing the Right Map/Set

```
Need O(1) lookup, no ordering?          → HashMap / HashSet
Need insertion-order iteration?         → LinkedHashMap / LinkedHashSet
Need sorted keys / range queries?       → TreeMap / TreeSet
Need thread safety?                     → ConcurrentHashMap
Need LRU eviction?                      → LinkedHashMap (access order)
```

### Common Interview Questions by Pattern

| Pattern | Problems |
|---------|----------|
| Frequency counting | Anagram check, top K frequent, valid arrangement |
| Value → index mapping | Two-sum, subarray sum |
| Seen/visited tracking | Contains duplicate, first missing positive |
| Prefix sum + map | Subarray sum = K, contiguous array |
| Grouping by key | Group anagrams, group shifted strings |
| Design | LRU cache, LFU cache, time-based key-value store |

### Common Mistakes

1. **Mutable keys in HashMap**: If you mutate a key after insertion, its hashCode changes and it becomes unreachable. Use immutable keys.
2. **Forgetting `hashCode()` when overriding `equals()`**: Map lookups will fail silently.
3. **Using `==` instead of `.equals()` for Integer keys > 127**: Auto-unboxing and the Integer cache (-128 to 127) can cause subtle bugs.
4. **Ignoring null handling**: `HashMap` allows one null key; `TreeMap`/`ConcurrentHashMap` do not.
5. **Not considering `getOrDefault` / `merge` / `computeIfAbsent`**: These methods simplify code and reduce bugs versus manual null checks.

### Useful HashMap Methods (Java 8+)

```java
map.getOrDefault(key, defaultVal);
map.putIfAbsent(key, val);
map.merge(key, val, (oldVal, newVal) -> oldVal + newVal);
map.computeIfAbsent(key, k -> new ArrayList<>());
map.compute(key, (k, v) -> v == null ? 1 : v + 1);
map.replaceAll((k, v) -> v * 2);
map.forEach((k, v) -> System.out.println(k + "=" + v));
```
