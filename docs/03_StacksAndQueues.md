# Stacks and Queues — Comprehensive Guide

## Table of Contents
1. [Stack Fundamentals](#stack-fundamentals)
2. [Queue Fundamentals](#queue-fundamentals)
3. [Monotonic Stack](#monotonic-stack)
4. [Monotonic Queue](#monotonic-queue)
5. [Priority Queue (Heap)](#priority-queue-heap)
6. [Deque](#deque)
7. [Common Patterns](#common-patterns)
8. [Design Problems](#design-problems)
9. [Complexity Reference](#complexity-reference)
10. [Interview Tips](#interview-tips)

---

## Stack Fundamentals

### LIFO Principle
Last-In, First-Out. Think of a stack of plates — you can only add/remove from the top.

### Java Implementation Choices

| Class | Backing | Thread-safe | Recommendation |
|---|---|---|---|
| `Stack` | `Vector` (array) | Yes (synchronized) | ❌ Legacy — avoid |
| `ArrayDeque` | Resizable array | No | ✅ Preferred for stack |
| `LinkedList` | Doubly linked list | No | Acceptable but slower |

```java
// Preferred stack usage in Java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);        // push onto top
stack.push(2);
int top = stack.peek(); // 2, doesn't remove
int val = stack.pop();  // 2, removes
boolean empty = stack.isEmpty();
```

**Why `ArrayDeque` over `Stack`?** `Stack` extends `Vector`, which synchronizes every
operation (unnecessary overhead). `ArrayDeque` is faster and more memory-efficient due to
array-based storage with cache locality.

---

## Queue Fundamentals

### FIFO Principle
First-In, First-Out. Like a real-world queue — first person in line gets served first.

### Java Implementation Choices

| Class | Backing | Best for |
|---|---|---|
| `ArrayDeque` | Circular array | ✅ General-purpose queue |
| `LinkedList` | Doubly linked list | When you also need list operations |
| `PriorityQueue` | Binary heap | Priority-based processing |

```java
// Preferred queue usage in Java
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1);       // enqueue (returns false if capacity-restricted and full)
queue.offer(2);
int front = queue.peek(); // 1, doesn't remove
int val = queue.poll();   // 1, removes
```

**`ArrayDeque` vs `LinkedList` as a Queue:**
- `ArrayDeque` is faster in practice (contiguous memory, fewer allocations)
- `ArrayDeque` does not allow `null` elements; `LinkedList` does
- `ArrayDeque` allocates less memory (no node objects)
- Prefer `ArrayDeque` unless you specifically need null values or `List` interface

---

## Monotonic Stack

### Concept
A stack that maintains elements in **monotonically increasing or decreasing** order. When a
new element would violate the ordering, pop elements until the invariant is restored.

**When to use:** Finding the **next greater/smaller element** for each position, or problems
involving "how far can I extend left/right before finding a larger/smaller value."

### Next Greater Element

```java
// For each element, find the next element that is strictly greater — O(n) time, O(n) space
public int[] nextGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            result[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return result;
}
```

**How it works:** The stack holds indices of elements waiting for their "next greater." When
we encounter a larger element, it is the answer for all smaller elements on the stack.

### Next Smaller Element

```java
// For each element, find the next element that is strictly smaller
public int[] nextSmallerElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] > nums[i]) {
            result[stack.pop()] = nums[i];
        }
        stack.push(i);
    }
    return result;
}
```

### Previous Greater / Smaller
Same idea, but look **left**. Scan left-to-right, and the answer is what's currently on the
stack top after popping.

---

## Monotonic Queue

### Sliding Window Maximum

Maintain a deque where elements are in **decreasing order**. The front of the deque is always
the maximum of the current window.

```java
// Maximum of each sliding window of size k — O(n) time, O(k) space
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        // Remove elements outside window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        // Maintain decreasing order: remove elements smaller than current
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }
        deque.offerLast(i);

        if (i >= k - 1) {
            result[i - k + 1] = nums[deque.peekFirst()];
        }
    }
    return result;
}
```

**Why it works:** Elements that are smaller than a newer element can never be the window
maximum, so they are safely discarded. Each element is added and removed at most once → O(n).

---

## Priority Queue (Heap)

### Java PriorityQueue

Java's `PriorityQueue` is a **min-heap** by default.

```java
// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Custom comparator — sort by frequency, then alphabetically
PriorityQueue<String> pq = new PriorityQueue<>((a, b) -> {
    int freqCompare = freq.get(b) - freq.get(a);
    return freqCompare != 0 ? freqCompare : a.compareTo(b);
});
```

### Operations and Complexity

| Operation | Time | Notes |
|---|---|---|
| `offer(e)` / `add(e)` | O(log n) | Insert + sift up |
| `poll()` | O(log n) | Remove min/max + sift down |
| `peek()` | O(1) | View min/max without removing |
| `remove(Object)` | O(n) | Linear scan + O(log n) sift |
| `contains(Object)` | O(n) | Linear scan |
| Build from collection | O(n) | Floyd's heapify |

### Top K Elements Pattern

```java
// Find k largest elements — O(n log k) time, O(k) space
public int[] topKLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.stream().mapToInt(Integer::intValue).toArray();
}
```

**Key insight:** Use a min-heap of size k to find the k largest. Use a max-heap of size k
to find the k smallest. The "opposite" heap ejects the least relevant element.

### K-Way Merge

```java
// Merge k sorted arrays — O(N log k) time, O(k) space
public List<Integer> kWayMerge(int[][] arrays) {
    // {value, array index, element index}
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        Comparator.comparingInt(a -> a[0])
    );
    for (int i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0) {
            pq.offer(new int[]{arrays[i][0], i, 0});
        }
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

## Deque

### Double-Ended Queue

Supports insertion and removal at **both** ends in O(1).

```java
Deque<Integer> deque = new ArrayDeque<>();
deque.offerFirst(1);   // add to front
deque.offerLast(2);    // add to back
deque.peekFirst();     // view front
deque.peekLast();      // view back
deque.pollFirst();     // remove from front
deque.pollLast();      // remove from back
```

**Using Deque as both Stack and Queue:**
- **As Stack:** `push()` / `pop()` / `peek()` — all operate on the front
- **As Queue:** `offerLast()` to enqueue, `pollFirst()` to dequeue

---

## Common Patterns

### Expression Evaluation

```java
// Basic calculator: handles +, -, (, ) — O(n) time, O(n) space
public int calculate(String s) {
    Deque<Integer> stack = new ArrayDeque<>();
    int result = 0, num = 0, sign = 1;

    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            num = num * 10 + (c - '0');
        } else if (c == '+') {
            result += sign * num;
            num = 0;
            sign = 1;
        } else if (c == '-') {
            result += sign * num;
            num = 0;
            sign = -1;
        } else if (c == '(') {
            stack.push(result);
            stack.push(sign);
            result = 0;
            sign = 1;
        } else if (c == ')') {
            result += sign * num;
            num = 0;
            result = stack.pop() * result + stack.pop();
        }
    }
    return result + sign * num;
}
```

### Bracket Matching

```java
// Valid parentheses — O(n) time, O(n) space
public boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> map = Map.of(')', '(', '}', '{', ']', '[');

    for (char c : s.toCharArray()) {
        if (map.containsKey(c)) {
            if (stack.isEmpty() || stack.pop() != map.get(c)) return false;
        } else {
            stack.push(c);
        }
    }
    return stack.isEmpty();
}
```

### Largest Rectangle in Histogram

Classic monotonic stack problem.

```java
// O(n) time, O(n) space
public int largestRectangleArea(int[] heights) {
    int n = heights.length, maxArea = 0;
    Deque<Integer> stack = new ArrayDeque<>(); // stores indices

    for (int i = 0; i <= n; i++) {
        int currHeight = (i == n) ? 0 : heights[i];
        while (!stack.isEmpty() && heights[stack.peek()] > currHeight) {
            int h = heights[stack.pop()];
            int w = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, h * w);
        }
        stack.push(i);
    }
    return maxArea;
}
```

---

## Design Problems

### Min Stack — O(1) getMin

```java
class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }

    public void pop() {
        if (stack.pop().equals(minStack.peek())) {
            minStack.pop();
        }
    }

    public int top() { return stack.peek(); }

    public int getMin() { return minStack.peek(); }
}
```

**Note:** Use `.equals()` for `Integer` comparison, not `==`, to avoid boxing cache issues
for values outside [-128, 127].

### Queue Using Two Stacks

Amortized O(1) per operation.

```java
class MyQueue {
    private Deque<Integer> inStack = new ArrayDeque<>();
    private Deque<Integer> outStack = new ArrayDeque<>();

    public void push(int x) {
        inStack.push(x);
    }

    public int pop() {
        shiftIfNeeded();
        return outStack.pop();
    }

    public int peek() {
        shiftIfNeeded();
        return outStack.peek();
    }

    public boolean empty() {
        return inStack.isEmpty() && outStack.isEmpty();
    }

    private void shiftIfNeeded() {
        if (outStack.isEmpty()) {
            while (!inStack.isEmpty()) {
                outStack.push(inStack.pop());
            }
        }
    }
}
```

**Amortized analysis:** Each element is moved from `inStack` to `outStack` exactly once.
Over n operations, total moves = n → O(1) amortized per operation.

### Circular Queue

```java
class MyCircularQueue {
    private int[] data;
    private int head, tail, size;

    public MyCircularQueue(int k) {
        data = new int[k];
        head = 0;
        tail = -1;
        size = 0;
    }

    public boolean enQueue(int value) {
        if (isFull()) return false;
        tail = (tail + 1) % data.length;
        data[tail] = value;
        size++;
        return true;
    }

    public boolean deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % data.length;
        size--;
        return true;
    }

    public int Front() { return isEmpty() ? -1 : data[head]; }

    public int Rear() { return isEmpty() ? -1 : data[tail]; }

    public boolean isEmpty() { return size == 0; }

    public boolean isFull() { return size == data.length; }
}
```

---

## Complexity Reference

| Data Structure | push/offer | pop/poll | peek | Search |
|---|---|---|---|---|
| Stack (ArrayDeque) | O(1)* | O(1) | O(1) | O(n) |
| Queue (ArrayDeque) | O(1)* | O(1) | O(1) | O(n) |
| PriorityQueue | O(log n) | O(log n) | O(1) | O(n) |
| Deque (ArrayDeque) | O(1)* | O(1) | O(1) | O(n) |
| Monotonic Stack | O(1)† | O(1)† | O(1) | — |
| Monotonic Queue | O(1)† | O(1)† | O(1) | — |

\* Amortized — occasional O(n) resize for array-backed implementations.
† Amortized — each element is pushed and popped at most once across the entire algorithm.

---

## Interview Tips

### Recognizing Stack Problems
- **"Nearest" or "next" greater/smaller** → Monotonic stack
- **Matching pairs** (brackets, tags) → Stack
- **Undo/back** operations → Stack
- **Expression parsing** → Stack (possibly two: values + operators)
- **Nested structure** processing → Stack

### Recognizing Queue Problems
- **Level-order processing** → BFS queue
- **FIFO ordering** requirement → Queue
- **Sliding window min/max** → Monotonic deque
- **Stream processing** with bounded buffer → Circular queue

### Recognizing Heap Problems
- **"Top K"**, **"K-th largest/smallest"** → Heap
- **Merge K sorted** things → Min-heap
- **Median in a stream** → Two heaps (max + min)
- **Scheduling by priority** → Heap

### Common Mistakes
1. Using `Stack` class instead of `ArrayDeque`
2. `==` vs `.equals()` for `Integer` wrapper comparisons
3. Forgetting to handle the case when stack/queue is empty before `peek()`/`pop()`
4. Off-by-one in sliding window boundaries
5. Not considering that `PriorityQueue` iteration order is **NOT** sorted — only
   `poll()` gives elements in heap order
