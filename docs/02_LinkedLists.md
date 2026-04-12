# Linked Lists — Comprehensive Guide

## Table of Contents
1. [Fundamentals](#fundamentals)
2. [Essential Techniques](#essential-techniques)
3. [Cycle Detection — Floyd's Algorithm](#cycle-detection--floyds-algorithm)
4. [Merge Techniques](#merge-techniques)
5. [Common Patterns](#common-patterns)
6. [Java LinkedList Internals](#java-linkedlist-internals)
7. [Complexity Reference](#complexity-reference)
8. [Interview Tips](#interview-tips)

---

## Fundamentals

### Node Definition

```java
// Singly Linked List node
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// Doubly Linked List node
class DListNode {
    int val;
    DListNode prev, next;
    DListNode(int val) { this.val = val; }
}
```

### Singly vs Doubly Linked Lists

| Feature | Singly | Doubly |
|---|---|---|
| Memory per node | 1 pointer | 2 pointers |
| Forward traversal | O(1) per step | O(1) per step |
| Backward traversal | Not possible | O(1) per step |
| Delete node (given pointer) | O(n)† | O(1) |
| Insert before node | O(n)† | O(1) |
| Use case | Stacks, simple chains | LRU cache, deques, browsers |

† O(n) because you need the predecessor, which requires traversal from head.

**When to use doubly linked:** When you need bidirectional traversal or O(1) deletion given a
direct reference to the node (e.g., LRU Cache — combine with HashMap for O(1) get/put).

---

## Essential Techniques

### 1. Dummy Head Node

Eliminates special-case handling for operations on the head of the list. **Use this by
default** — it simplifies code and reduces bugs.

```java
// Remove all nodes with value == val — clean code via dummy head
public ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;

    while (prev.next != null) {
        if (prev.next.val == val) {
            prev.next = prev.next.next;
        } else {
            prev = prev.next;
        }
    }
    return dummy.next;
}
```

### 2. In-Place Reversal

Reverse a linked list by re-pointing `next` pointers. Master this — it appears as a
sub-routine in many problems.

```java
// Iterative reversal — O(n) time, O(1) space
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}

// Recursive reversal — O(n) time, O(n) space (call stack)
public ListNode reverseListRecursive(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}
```

### 3. Runner Technique (Slow/Fast Pointer)

Two pointers moving at different speeds. The workhorse of linked list problems.

```java
// Find middle node — O(n) time, O(1) space
// When even length: returns the first of the two middle nodes
public ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
```

**Variation for even-length lists:** To get the second middle node, change the condition to
`while (fast != null && fast.next != null)`.

---

## Cycle Detection — Floyd's Algorithm

### The Algorithm

```java
// Detect cycle — O(n) time, O(1) space
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}

// Find cycle start — O(n) time, O(1) space
public ListNode detectCycleStart(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            // Phase 2: find entrance
            ListNode entry = head;
            while (entry != slow) {
                entry = entry.next;
                slow = slow.next;
            }
            return entry;
        }
    }
    return null;
}
```

### Mathematical Proof

Let:
- **F** = distance from head to cycle entrance
- **C** = cycle length
- **a** = distance from cycle entrance to the meeting point (within the cycle)

When slow and fast meet:
- Slow has traveled: `F + a` steps
- Fast has traveled: `F + a + kC` steps (for some integer k ≥ 1, having looped k times)
- Fast moves twice as fast: `2(F + a) = F + a + kC`
- Therefore: `F + a = kC` → `F = kC − a` → `F = (k−1)C + (C − a)`

This means: starting from the **meeting point**, walking `F` more steps lands you at the
**cycle entrance** (you go around the cycle `k−1` full times, then `C − a` more steps to
reach the entrance). And starting from the **head**, walking `F` steps also reaches the
entrance. Hence, moving one pointer from head and one from the meeting point at the same
speed, they meet at the cycle entrance.

---

## Merge Techniques

### Merge Two Sorted Lists

```java
// Iterative merge — O(n+m) time, O(1) space
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode tail = dummy;

    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            tail.next = l1;
            l1 = l1.next;
        } else {
            tail.next = l2;
            l2 = l2.next;
        }
        tail = tail.next;
    }
    tail.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}
```

### Merge K Sorted Lists

```java
// Using min-heap — O(N log k) time, O(k) space where N = total nodes
public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>(
        Comparator.comparingInt(a -> a.val)
    );
    for (ListNode head : lists) {
        if (head != null) pq.offer(head);
    }

    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        tail.next = node;
        tail = tail.next;
        if (node.next != null) pq.offer(node.next);
    }
    return dummy.next;
}
```

### Merge Sort on Linked Lists

Linked lists are natural for merge sort (no extra space for merging). Split using
slow/fast pointer, recurse, merge.

```java
// Sort linked list — O(n log n) time, O(log n) stack space
public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;

    // Split in half
    ListNode mid = findMiddle(head);
    ListNode rightHalf = mid.next;
    mid.next = null;

    ListNode left = sortList(head);
    ListNode right = sortList(rightHalf);
    return mergeTwoLists(left, right);
}
```

---

## Common Patterns

### Reverse Nodes in k-Group

```java
// Reverse every k nodes — O(n) time, O(1) space
public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode groupPrev = dummy;

    while (true) {
        // Check if k nodes remain
        ListNode kth = groupPrev;
        for (int i = 0; i < k; i++) {
            kth = kth.next;
            if (kth == null) return dummy.next;
        }

        ListNode groupNext = kth.next;
        // Reverse the group
        ListNode prev = groupNext, curr = groupPrev.next;
        for (int i = 0; i < k; i++) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        ListNode tmp = groupPrev.next;
        groupPrev.next = kth;
        groupPrev = tmp;
    }
}
```

### Partition List

Rearrange nodes so all values < x come before nodes ≥ x, preserving relative order.

```java
// Partition list around x — O(n) time, O(1) space
public ListNode partition(ListNode head, int x) {
    ListNode beforeDummy = new ListNode(0), afterDummy = new ListNode(0);
    ListNode before = beforeDummy, after = afterDummy;

    while (head != null) {
        if (head.val < x) {
            before.next = head;
            before = before.next;
        } else {
            after.next = head;
            after = after.next;
        }
        head = head.next;
    }
    after.next = null;          // terminate the after-list
    before.next = afterDummy.next;
    return beforeDummy.next;
}
```

### Deep Copy with Random Pointers

Each node has a `next` and a `random` pointer that can point to any node or null.

```java
// Approach 1: HashMap — O(n) time, O(n) space
public Node copyRandomList(Node head) {
    if (head == null) return null;
    Map<Node, Node> map = new HashMap<>();

    Node curr = head;
    while (curr != null) {
        map.put(curr, new Node(curr.val));
        curr = curr.next;
    }

    curr = head;
    while (curr != null) {
        map.get(curr).next = map.get(curr.next);
        map.get(curr).random = map.get(curr.random);
        curr = curr.next;
    }
    return map.get(head);
}

// Approach 2: Interleaving — O(n) time, O(1) space
// Step 1: Insert copies: A→A'→B→B'→C→C'
// Step 2: Set random pointers: copy.random = original.random.next
// Step 3: Separate the two lists
```

### Palindrome Check

```java
// O(n) time, O(1) space
public boolean isPalindrome(ListNode head) {
    ListNode mid = findMiddle(head);
    ListNode secondHalf = reverseList(mid.next);

    ListNode p1 = head, p2 = secondHalf;
    boolean result = true;
    while (p2 != null) {
        if (p1.val != p2.val) { result = false; break; }
        p1 = p1.next;
        p2 = p2.next;
    }
    // Restore the list (good practice)
    mid.next = reverseList(secondHalf);
    return result;
}
```

---

## Java LinkedList Internals

Java's `java.util.LinkedList` is a **doubly linked list** that also implements `Deque`.

| Operation | Time |
|---|---|
| `addFirst` / `addLast` | O(1) |
| `removeFirst` / `removeLast` | O(1) |
| `get(index)` | O(n) — traverses from closer end |
| `add(index, element)` | O(n) — traversal + O(1) splice |
| `contains(element)` | O(n) |
| `iterator.remove()` | O(1) |

**When to use `LinkedList` in practice:** Almost never. `ArrayList` beats it for nearly all
workloads due to cache locality. Use `LinkedList` only when you need constant-time insertion/
removal at both ends **and** you don't need random access (though `ArrayDeque` is usually
better even then).

---

## Complexity Reference

| Operation | Singly | Doubly |
|---|---|---|
| Access by index | O(n) | O(n) |
| Insert at head | O(1) | O(1) |
| Insert at tail (with tail ptr) | O(1) | O(1) |
| Insert after given node | O(1) | O(1) |
| Delete head | O(1) | O(1) |
| Delete given node | O(n)† | O(1) |
| Search | O(n) | O(n) |
| Reverse | O(n) | O(n) |

† Singly linked requires traversal to find predecessor.

---

## Interview Tips

### Draw Diagrams
Always sketch the list state on paper/whiteboard **before** and **after** each pointer
manipulation. This is the single most effective way to avoid bugs.

```
Before reversal:   1 → 2 → 3 → null
Step 1:           null ← 1   2 → 3 → null   (prev=1, curr=2)
Step 2:           null ← 1 ← 2   3 → null   (prev=2, curr=3)
Step 3:           null ← 1 ← 2 ← 3          (prev=3, curr=null)
```

### Edge Cases Checklist
- **Null head** — empty list
- **Single node** — head.next == null
- **Two nodes** — minimal case for reversal/swap
- **Even vs odd length** — affects middle-finding and palindrome checks
- **Cycle present** — guard infinite loops in traversal
- **Duplicate values** — ensure logic doesn't depend on unique values

### Common Mistakes
1. **Losing references:** Always save `next` before overwriting a pointer.
   ```java
   ListNode next = curr.next;  // SAVE first
   curr.next = prev;           // then redirect
   ```
2. **Not terminating lists:** After partitioning or copying, explicitly set the last
   node's `next = null` or you create a cycle.
3. **Off-by-one in slow/fast:** The loop condition determines which middle node you get
   for even-length lists. Test with a 4-node list.
4. **Forgetting dummy.next:** Return `dummy.next`, not `head` — head may have changed.

### Strategy for Linked List Problems
1. **Understand:** What transformation is needed? Draw before/after.
2. **Choose technique:** Reversal? Split + merge? Two pointers?
3. **Use dummy head** unless there's a reason not to.
4. **Implement** with careful pointer discipline.
5. **Trace** through a small example (3-4 nodes).
6. **Check edge cases** from the checklist above.
