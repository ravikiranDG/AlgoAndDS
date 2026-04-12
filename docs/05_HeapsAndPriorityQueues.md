# Heaps and Priority Queues

## 1. Heap Fundamentals

A **heap** is a complete binary tree stored as an array that satisfies the heap property.

| Type | Property |
|------|----------|
| **Min-Heap** | Parent ≤ children — smallest element at root |
| **Max-Heap** | Parent ≥ children — largest element at root |

### Array Representation

For a node at index `i` (0-based):
- **Parent**: `(i - 1) / 2`
- **Left child**: `2 * i + 1`
- **Right child**: `2 * i + 2`

```
Min-Heap:        Array: [1, 3, 5, 7, 9, 8]
       1
      / \         Index:  0  1  2  3  4  5
     3   5
    / \ /
   7  9 8
```

No pointers needed — the tree structure is implicit in the array indices.

### Heapify (Sift Down)

Restores heap property for a subtree rooted at index `i` by pushing the node down.

```java
private void heapifyDown(int[] arr, int n, int i) {
    int smallest = i;
    int left = 2 * i + 1;
    int right = 2 * i + 2;

    if (left < n && arr[left] < arr[smallest]) smallest = left;
    if (right < n && arr[right] < arr[smallest]) smallest = right;

    if (smallest != i) {
        swap(arr, i, smallest);
        heapifyDown(arr, n, smallest);
    }
}
```

---

## 2. Heap Operations

### Insert (Sift Up)

Add element at end, then bubble up to restore heap property.

```java
public void insert(int val) {
    heap.add(val);
    int i = heap.size() - 1;
    while (i > 0 && heap.get(parent(i)) > heap.get(i)) {
        swap(i, parent(i));
        i = parent(i);
    }
}
```

### Extract Min/Max

Remove root, move last element to root, then sift down.

```java
public int extractMin() {
    if (heap.isEmpty()) throw new NoSuchElementException();
    int min = heap.get(0);
    int last = heap.remove(heap.size() - 1);
    if (!heap.isEmpty()) {
        heap.set(0, last);
        heapifyDown(0);
    }
    return min;
}
```

### Decrease Key

Reduce value at index, then sift up.

```java
public void decreaseKey(int i, int newVal) {
    heap.set(i, newVal);
    while (i > 0 && heap.get(parent(i)) > heap.get(i)) {
        swap(i, parent(i));
        i = parent(i);
    }
}
```

### Operation Complexities

| Operation | Time | Notes |
|-----------|------|-------|
| `insert` | O(log n) | Sift up at most tree height |
| `extractMin/Max` | O(log n) | Sift down at most tree height |
| `peek` | O(1) | Just return root |
| `decreaseKey` | O(log n) | Sift up |
| `delete` | O(log n) | Decrease to -∞, then extract |
| `buildHeap` | **O(n)** | See below |

---

## 3. Building a Heap in O(n)

### Why It's Not O(n log n)

Calling `heapifyDown` on each non-leaf node from bottom up is O(n), **not** O(n log n).

```java
public static void buildHeap(int[] arr) {
    int n = arr.length;
    // Start from last non-leaf node
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, n, i);
    }
}
```

**Mathematical proof**: Most nodes are near the bottom and do very little work.
- Level `h` (leaves): n/2 nodes × 0 swaps
- Level `h-1`: n/4 nodes × 1 swap
- Level `h-2`: n/8 nodes × 2 swaps
- Total work: Σ (n / 2^(k+1)) × k for k = 0 to h = **O(n)**

> **Interview insight**: Building a heap with repeated insertions IS O(n log n). The bottom-up `buildHeap` approach is the O(n) method.

---

## 4. Java PriorityQueue

`java.util.PriorityQueue` is a **min-heap** by default, backed by a resizable array.

### Basic Usage

```java
// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
// or: new PriorityQueue<>(Comparator.reverseOrder());

minHeap.offer(5);       // add element — O(log n)
minHeap.peek();          // view min — O(1)
minHeap.poll();          // remove min — O(log n)
minHeap.remove(obj);     // remove arbitrary — O(n) (linear scan)
minHeap.size();
minHeap.isEmpty();
```

### Custom Comparator Patterns

```java
// Sort by frequency, then alphabetically
PriorityQueue<String> pq = new PriorityQueue<>((a, b) -> {
    if (freqMap.get(a) != freqMap.get(b))
        return freqMap.get(b) - freqMap.get(a); // higher freq first
    return a.compareTo(b);                       // alphabetical tie-break
});

// Sort int[] pairs by second element
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);

// Sort objects by distance
PriorityQueue<int[]> pq = new PriorityQueue<>(
    Comparator.comparingInt(p -> p[0] * p[0] + p[1] * p[1])
);
```

### Internal Implementation Notes

- Default initial capacity: 11
- Grows by 50% when full (if capacity < 64, doubles + 2)
- `offer()` / `poll()` are O(log n); `remove(Object)` is O(n)
- **Not thread-safe** — use `PriorityBlockingQueue` for concurrency
- **Iterator does NOT return elements in heap order** — poll them one by one for sorted order

---

## 5. Top-K Patterns

### Kth Largest Element

Use a **min-heap of size K**. After processing all elements, the root is the Kth largest.

```java
public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) {
            minHeap.poll(); // evict smallest
        }
    }
    return minHeap.peek();
}
// Time: O(n log k), Space: O(k)
```

> **Key insight**: For Kth largest, use a **min-heap**. For Kth smallest, use a **max-heap**. The heap holds the "answer set" and the root is the threshold.

### K Closest Points to Origin

```java
public int[][] kClosest(int[][] points, int k) {
    // Max-heap by distance — evict farthest when size > k
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(
        (a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1])
    );
    for (int[] p : points) {
        maxHeap.offer(p);
        if (maxHeap.size() > k) maxHeap.poll();
    }
    return maxHeap.toArray(new int[0][]);
}
```

### K Most Frequent Elements

```java
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    // Min-heap by frequency — keep top K
    PriorityQueue<Integer> minHeap = new PriorityQueue<>(
        Comparator.comparingInt(freq::get)
    );
    for (int key : freq.keySet()) {
        minHeap.offer(key);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.stream().mapToInt(i -> i).toArray();
}
// Time: O(n log k), Space: O(n)
```

### Top-K Pattern Summary

| Problem | Heap Type | Size | Why |
|---------|-----------|------|-----|
| K largest | Min-heap | K | Root = threshold; evict too-small |
| K smallest | Max-heap | K | Root = threshold; evict too-large |
| K most frequent | Min-heap by freq | K | Evict least frequent |
| K closest | Max-heap by dist | K | Evict farthest |

---

## 6. Two-Heap Pattern

### Find Median from Data Stream

Maintain two heaps that split the data into a lower and upper half.

```java
class MedianFinder {
    PriorityQueue<Integer> lo; // max-heap — lower half
    PriorityQueue<Integer> hi; // min-heap — upper half

    public MedianFinder() {
        lo = new PriorityQueue<>(Collections.reverseOrder());
        hi = new PriorityQueue<>();
    }

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll()); // balance: push largest of lo into hi
        if (hi.size() > lo.size()) {
            lo.offer(hi.poll()); // lo can have at most 1 more than hi
        }
    }

    public double findMedian() {
        if (lo.size() > hi.size()) return lo.peek();
        return (lo.peek() + hi.peek()) / 2.0;
    }
}
// addNum: O(log n), findMedian: O(1)
```

**Invariants**:
1. All elements in `lo` ≤ all elements in `hi`
2. `lo.size()` == `hi.size()` or `lo.size()` == `hi.size() + 1`

### Sliding Window Median

Use two heaps plus lazy deletion (mark elements as removed, clean up when they appear at the top).

```java
public double[] medianSlidingWindow(int[] nums, int k) {
    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> hi = new PriorityQueue<>();
    double[] result = new double[nums.length - k + 1];

    for (int i = 0; i < nums.length; i++) {
        // Add
        if (lo.isEmpty() || nums[i] <= lo.peek()) lo.offer(nums[i]);
        else hi.offer(nums[i]);

        // Remove outgoing element (when window is full)
        if (i >= k) {
            int out = nums[i - k];
            if (out <= lo.peek()) lo.remove(out);
            else hi.remove(out);
        }

        // Rebalance
        while (lo.size() > hi.size() + 1) hi.offer(lo.poll());
        while (hi.size() > lo.size()) lo.offer(hi.poll());

        // Record median
        if (i >= k - 1) {
            result[i - k + 1] = (k % 2 == 1)
                ? lo.peek()
                : ((long) lo.peek() + hi.peek()) / 2.0;
        }
    }
    return result;
}
```

> Note: The `remove(Object)` call is O(k) here. For optimal O(n log k), use lazy deletion with a `HashMap<Integer, Integer>` counting pending removals.

---

## 7. Merge K Sorted Lists

```java
public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>(
        Comparator.comparingInt(n -> n.val)
    );
    for (ListNode head : lists) {
        if (head != null) pq.offer(head);
    }

    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        tail.next = node;
        tail = node;
        if (node.next != null) pq.offer(node.next);
    }
    return dummy.next;
}
// Time: O(N log k)  — N = total elements, k = number of lists
// Space: O(k) for the heap
```

### Merge K Sorted Arrays

```java
public List<Integer> mergeKArrays(int[][] arrays) {
    // int[]{value, arrayIndex, elementIndex}
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
    for (int i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0)
            pq.offer(new int[]{arrays[i][0], i, 0});
    }

    List<Integer> result = new ArrayList<>();
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        result.add(curr[0]);
        int nextIdx = curr[2] + 1;
        if (nextIdx < arrays[curr[1]].length) {
            pq.offer(new int[]{arrays[curr[1]][nextIdx], curr[1], nextIdx});
        }
    }
    return result;
}
```

---

## 8. Heap Sort

### Algorithm

1. Build a max-heap from the array — O(n)
2. Repeatedly extract the max, place it at the end — O(n log n)

```java
public void heapSort(int[] arr) {
    int n = arr.length;

    // Build max-heap
    for (int i = n / 2 - 1; i >= 0; i--)
        heapifyDown(arr, n, i);

    // Extract elements one by one
    for (int i = n - 1; i > 0; i--) {
        swap(arr, 0, i);           // move max to end
        heapifyDown(arr, i, 0);    // heapify reduced heap
    }
}

private void heapifyDown(int[] arr, int n, int i) {
    int largest = i;
    int left = 2 * i + 1, right = 2 * i + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest != i) {
        swap(arr, i, largest);
        heapifyDown(arr, n, largest);
    }
}
```

### Heap Sort Properties

| Property | Value |
|----------|-------|
| Time (all cases) | O(n log n) |
| Space | O(1) — in-place |
| Stable? | **No** |
| Adaptive? | No — always O(n log n) |

**When to prefer heap sort**: When O(1) space is critical and stability isn't needed. In practice, quicksort and mergesort are usually faster due to better cache locality.

---

## 9. Complexity Summary

| Operation | Min/Max Heap | PriorityQueue |
|-----------|-------------|---------------|
| Insert | O(log n) | O(log n) |
| Extract Min/Max | O(log n) | O(log n) |
| Peek | O(1) | O(1) |
| Build Heap | O(n) | O(n) via `new PQ(collection)` |
| Decrease Key | O(log n) | Not directly supported |
| Delete arbitrary | O(log n) | O(n) — requires linear search |
| Search | O(n) | O(n) |
| Heap Sort | O(n log n) | N/A |
| **Space** | **O(n)** | **O(n)** |

---

## 10. Interview Tips

### When to Use a Heap

- **"Top K" / "K largest/smallest"** → heap of size K
- **"Median" / "middle element"** → two-heap pattern
- **"Merge K sorted"** → min-heap of K elements
- **"Schedule" / "minimum cost"** → greedy + min-heap
- **"Stream of data"** → heap maintains running state

### Heap vs Sorting vs Quickselect

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Sort + index | O(n log n) | O(1)–O(n) | Simple, one-time query |
| Heap (size K) | O(n log k) | O(k) | K << n, streaming data |
| Quickselect | O(n) avg | O(1) | Single Kth element, not streaming |

### Common Mistakes

1. **Confusing min-heap / max-heap direction**: For Kth largest, use min-heap (counterintuitive).
2. **Forgetting PriorityQueue iterator is unordered**: Always use `poll()` for sorted access.
3. **Using `remove(Object)` in a loop**: It's O(n) each time — use lazy deletion instead.
4. **Integer overflow in comparators**: `(a, b) -> a - b` overflows for large values. Use `Integer.compare(a, b)`.
5. **Not handling equal elements**: Ensure your comparator defines total ordering.

### Quick Pattern Recognition

```
"Find the K..."          → Heap
"Continuously find..."   → Heap (streaming)
"Merge sorted..."        → Heap
"Median of stream..."    → Two heaps
"Schedule/minimize..."   → Greedy + Heap
"Smallest/largest in     → Heap or monotonic structure
 sliding window..."
```
