# Trees and Binary Search Trees — Comprehensive Guide

## Table of Contents
1. [Binary Tree Fundamentals](#binary-tree-fundamentals)
2. [Tree Traversals](#tree-traversals)
3. [Morris Traversal](#morris-traversal)
4. [Binary Search Trees](#binary-search-trees)
5. [Balanced BSTs](#balanced-bsts)
6. [Segment Trees](#segment-trees)
7. [Binary Indexed Tree (Fenwick Tree)](#binary-indexed-tree-fenwick-tree)
8. [Common Patterns](#common-patterns)
9. [Complexity Reference](#complexity-reference)
10. [Interview Tips](#interview-tips)

---

## Binary Tree Fundamentals

### Node Definition

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
```

### Terminology
- **Root:** The topmost node (no parent)
- **Leaf:** A node with no children
- **Depth of node:** Number of edges from root to that node (root has depth 0)
- **Height of node:** Number of edges on the longest path from that node to a leaf
- **Height of tree:** Height of the root node

### Types of Binary Trees

| Type | Definition | Properties |
|---|---|---|
| **Full** | Every node has 0 or 2 children | Leaves = internal nodes + 1 |
| **Complete** | All levels full except possibly last, filled left-to-right | Used for heaps; n nodes → height = ⌊log₂n⌋ |
| **Perfect** | All internal nodes have 2 children, all leaves at same level | Exactly 2^(h+1) − 1 nodes |
| **Balanced** | Height difference between left/right subtrees ≤ 1 (at every node) | Guarantees O(log n) operations |
| **Degenerate** | Every internal node has exactly 1 child | Essentially a linked list; O(n) operations |

### Key Properties
- A binary tree with `n` nodes has exactly `n − 1` edges.
- Maximum nodes at level `k`: `2^k`
- Maximum nodes in a tree of height `h`: `2^(h+1) − 1`
- Minimum height of a tree with `n` nodes: `⌊log₂n⌋`

---

## Tree Traversals

### Recursive Traversals

```java
// Inorder: Left → Root → Right (gives sorted order for BST)
public void inorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    inorder(root.left, result);
    result.add(root.val);
    inorder(root.right, result);
}

// Preorder: Root → Left → Right (useful for serialization, copying)
public void preorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    result.add(root.val);
    preorder(root.left, result);
    preorder(root.right, result);
}

// Postorder: Left → Right → Root (useful for deletion, bottom-up computation)
public void postorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    postorder(root.left, result);
    postorder(root.right, result);
    result.add(root.val);
}
```

### Iterative Traversals

```java
// Iterative Inorder — O(n) time, O(h) space
public List<Integer> inorderIterative(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;

    while (curr != null || !stack.isEmpty()) {
        while (curr != null) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        result.add(curr.val);
        curr = curr.right;
    }
    return result;
}

// Iterative Preorder — O(n) time, O(h) space
public List<Integer> preorderIterative(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);

    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.add(node.val);
        if (node.right != null) stack.push(node.right); // right first so left is processed first
        if (node.left != null) stack.push(node.left);
    }
    return result;
}

// Iterative Postorder — O(n) time, O(h) space
// Trick: modified preorder (Root→Right→Left) then reverse
public List<Integer> postorderIterative(TreeNode root) {
    LinkedList<Integer> result = new LinkedList<>();
    if (root == null) return result;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);

    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.addFirst(node.val);
        if (node.left != null) stack.push(node.left);
        if (node.right != null) stack.push(node.right);
    }
    return result;
}
```

### Level-Order Traversal (BFS)

```java
// O(n) time, O(w) space where w = max width of the tree
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
    }
    return result;
}
```

---

## Morris Traversal

Achieves **O(1) space** (no stack, no recursion) by temporarily modifying the tree structure
using **threaded binary tree** links.

### Morris Inorder

```java
// O(n) time, O(1) space
public List<Integer> morrisInorder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    TreeNode curr = root;

    while (curr != null) {
        if (curr.left == null) {
            result.add(curr.val);
            curr = curr.right;
        } else {
            // Find inorder predecessor
            TreeNode pred = curr.left;
            while (pred.right != null && pred.right != curr) {
                pred = pred.right;
            }

            if (pred.right == null) {
                // Create thread
                pred.right = curr;
                curr = curr.left;
            } else {
                // Remove thread, visit node
                pred.right = null;
                result.add(curr.val);
                curr = curr.right;
            }
        }
    }
    return result;
}
```

**How it works:** For each node with a left subtree, find the inorder predecessor (rightmost
node in left subtree). Create a temporary "thread" back to the current node. When you
encounter the thread again, remove it and process the node. The tree is restored to its
original structure.

**When to use:** When O(1) space is a hard requirement. In interviews, mention it to show
depth of knowledge but implement iterative-with-stack first unless asked specifically.

---

## Binary Search Trees

### BST Property
For every node: all values in the left subtree < node.val < all values in the right subtree.

### Core Operations

```java
// Search — O(h) time, O(1) space iterative
public TreeNode search(TreeNode root, int target) {
    while (root != null && root.val != target) {
        root = (target < root.val) ? root.left : root.right;
    }
    return root;
}

// Insert — O(h) time
public TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else if (val > root.val) root.right = insert(root.right, val);
    return root;
}

// Delete — O(h) time
public TreeNode delete(TreeNode root, int key) {
    if (root == null) return null;

    if (key < root.val) {
        root.left = delete(root.left, key);
    } else if (key > root.val) {
        root.right = delete(root.right, key);
    } else {
        // Found the node to delete
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        // Two children: replace with inorder successor
        TreeNode successor = root.right;
        while (successor.left != null) successor = successor.left;
        root.val = successor.val;
        root.right = delete(root.right, successor.val);
    }
    return root;
}
```

### Validation

```java
// Validate BST — O(n) time, O(h) space
public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private boolean validate(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val)
        && validate(node.right, node.val, max);
}
```

**Common mistake:** Using `int` for bounds fails when node values are `Integer.MIN_VALUE` or
`Integer.MAX_VALUE`. Use `long` or pass `TreeNode` references as bounds.

---

## Balanced BSTs

### AVL Trees

Self-balancing BST where for every node, the height difference between left and right
subtrees (the **balance factor**) is at most 1.

**Rotations:**

```java
// Right rotation (for left-heavy imbalance)
//     y           x
//    / \         / \
//   x   C  →   A   y
//  / \             / \
// A   B           B   C
private TreeNode rotateRight(TreeNode y) {
    TreeNode x = y.left;
    TreeNode B = x.right;
    x.right = y;
    y.left = B;
    updateHeight(y);
    updateHeight(x);
    return x;
}

// Left rotation (for right-heavy imbalance)
private TreeNode rotateLeft(TreeNode x) {
    TreeNode y = x.right;
    TreeNode B = y.left;
    y.left = x;
    x.right = B;
    updateHeight(x);
    updateHeight(y);
    return y;
}

private int height(TreeNode n) { return n == null ? -1 : n.height; }

private void updateHeight(TreeNode n) {
    n.height = 1 + Math.max(height(n.left), height(n.right));
}

private int balanceFactor(TreeNode n) {
    return n == null ? 0 : height(n.left) - height(n.right);
}
```

**Four imbalance cases:**
1. **Left-Left:** Single right rotation
2. **Right-Right:** Single left rotation
3. **Left-Right:** Left rotate left child, then right rotate node
4. **Right-Left:** Right rotate right child, then left rotate node

### Red-Black Trees (Conceptual)

Java's `TreeMap` and `TreeSet` use Red-Black trees internally. Key properties:
- Every node is red or black
- Root is black
- No two consecutive red nodes
- Every path from root to null has the same number of black nodes
- **Guarantees:** O(log n) search, insert, delete
- **Advantage over AVL:** Fewer rotations on insert/delete (at most 2 vs O(log n))

```java
// Java TreeMap — Red-Black tree backed sorted map
TreeMap<Integer, String> map = new TreeMap<>();
map.put(5, "five");
map.firstKey();                // smallest key
map.lastKey();                 // largest key
map.floorKey(4);               // largest key ≤ 4
map.ceilingKey(4);             // smallest key ≥ 4
map.subMap(2, true, 8, false); // keys in [2, 8)
```

---

## Segment Trees

For **range queries and point/range updates** on an array.

```java
class SegmentTree {
    int[] tree;
    int n;

    SegmentTree(int[] nums) {
        n = nums.length;
        tree = new int[4 * n];
        build(nums, 1, 0, n - 1);
    }

    private void build(int[] nums, int node, int start, int end) {
        if (start == end) {
            tree[node] = nums[start];
            return;
        }
        int mid = (start + end) / 2;
        build(nums, 2 * node, start, mid);
        build(nums, 2 * node + 1, mid + 1, end);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // Point update: set nums[idx] = val — O(log n)
    public void update(int node, int start, int end, int idx, int val) {
        if (start == end) {
            tree[node] = val;
            return;
        }
        int mid = (start + end) / 2;
        if (idx <= mid) update(2 * node, start, mid, idx, val);
        else update(2 * node + 1, mid + 1, end, idx, val);
        tree[node] = tree[2 * node] + tree[2 * node + 1];
    }

    // Range sum query: sum of nums[l..r] — O(log n)
    public int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;          // no overlap
        if (l <= start && end <= r) return tree[node]; // total overlap
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r)
             + query(2 * node + 1, mid + 1, end, l, r);
    }
}
```

**When to use:** When you need both range queries (sum, min, max) AND updates on the same
array. If only queries without updates, prefix sums suffice.

---

## Binary Indexed Tree (Fenwick Tree)

Simpler and more memory-efficient than Segment Tree for **prefix sum queries + point updates**.

```java
class BIT {
    int[] tree;
    int n;

    BIT(int n) {
        this.n = n;
        tree = new int[n + 1]; // 1-indexed
    }

    // Point update: add delta to index i — O(log n)
    public void update(int i, int delta) {
        for (i++; i <= n; i += i & (-i)) {
            tree[i] += delta;
        }
    }

    // Prefix sum query: sum of [0..i] — O(log n)
    public int query(int i) {
        int sum = 0;
        for (i++; i > 0; i -= i & (-i)) {
            sum += tree[i];
        }
        return sum;
    }

    // Range sum query: sum of [l..r]
    public int rangeQuery(int l, int r) {
        return query(r) - (l > 0 ? query(l - 1) : 0);
    }
}
```

**`i & (-i)` extracts the lowest set bit** — this determines which range of the array each
tree node is responsible for. The tree requires only `n+1` space vs `4n` for segment tree.

---

## Common Patterns

### Lowest Common Ancestor (LCA)

```java
// LCA for binary tree (not necessarily BST) — O(n) time, O(h) space
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root; // p and q are in different subtrees
    return left != null ? left : right;
}

// LCA for BST — O(h) time, O(1) space
public TreeNode lcaBST(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root;
    }
    return null;
}
```

### Path Sum Variants

```java
// Path Sum III: count paths summing to target (any start/end) — O(n) time, O(h) space
public int pathSum(TreeNode root, int targetSum) {
    Map<Long, Integer> prefixMap = new HashMap<>();
    prefixMap.put(0L, 1);
    return dfs(root, 0L, targetSum, prefixMap);
}

private int dfs(TreeNode node, long currSum, int target, Map<Long, Integer> prefixMap) {
    if (node == null) return 0;
    currSum += node.val;
    int count = prefixMap.getOrDefault(currSum - target, 0);
    prefixMap.merge(currSum, 1, Integer::sum);
    count += dfs(node.left, currSum, target, prefixMap);
    count += dfs(node.right, currSum, target, prefixMap);
    prefixMap.merge(currSum, -1, Integer::sum); // backtrack
    return count;
}
```

### Serialization / Deserialization

```java
// Preorder serialization with null markers
public String serialize(TreeNode root) {
    StringBuilder sb = new StringBuilder();
    serializeHelper(root, sb);
    return sb.toString();
}

private void serializeHelper(TreeNode node, StringBuilder sb) {
    if (node == null) { sb.append("#,"); return; }
    sb.append(node.val).append(",");
    serializeHelper(node.left, sb);
    serializeHelper(node.right, sb);
}

public TreeNode deserialize(String data) {
    Queue<String> queue = new ArrayDeque<>(Arrays.asList(data.split(",")));
    return deserializeHelper(queue);
}

private TreeNode deserializeHelper(Queue<String> queue) {
    String val = queue.poll();
    if ("#".equals(val)) return null;
    TreeNode node = new TreeNode(Integer.parseInt(val));
    node.left = deserializeHelper(queue);
    node.right = deserializeHelper(queue);
    return node;
}
```

### Construct Tree from Traversals

```java
// Build tree from preorder + inorder — O(n) time, O(n) space
public TreeNode buildTree(int[] preorder, int[] inorder) {
    Map<Integer, Integer> inorderIndex = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) inorderIndex.put(inorder[i], i);
    return build(preorder, 0, preorder.length - 1,
                 0, inorder.length - 1, inorderIndex);
}

private int preIdx = 0;

private TreeNode build(int[] preorder, int preStart, int preEnd,
                        int inStart, int inEnd, Map<Integer, Integer> map) {
    if (inStart > inEnd) return null;
    TreeNode root = new TreeNode(preorder[preIdx++]);
    int inRoot = map.get(root.val);
    root.left = build(preorder, preStart, preEnd, inStart, inRoot - 1, map);
    root.right = build(preorder, preStart, preEnd, inRoot + 1, inEnd, map);
    return root;
}
```

### Top-Down vs Bottom-Up Recursion

**Top-Down (preorder style):** Pass information DOWN via parameters.
```java
// Maximum depth — top-down
public void maxDepth(TreeNode node, int depth, int[] maxRef) {
    if (node == null) return;
    maxRef[0] = Math.max(maxRef[0], depth);
    maxDepth(node.left, depth + 1, maxRef);
    maxDepth(node.right, depth + 1, maxRef);
}
```

**Bottom-Up (postorder style):** Compute results from children, combine upward. Generally
more natural for tree problems.
```java
// Maximum depth — bottom-up (cleaner)
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Diameter of tree — bottom-up, track global max
int diameter = 0;
public int diameterOfBinaryTree(TreeNode root) {
    height(root);
    return diameter;
}
private int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left);
    int right = height(node.right);
    diameter = Math.max(diameter, left + right);
    return 1 + Math.max(left, right);
}
```

---

## Complexity Reference

| Operation | BST (avg) | BST (worst) | AVL / RB-Tree | Segment Tree | Fenwick Tree |
|---|---|---|---|---|---|
| Search | O(log n) | O(n) | O(log n) | — | — |
| Insert | O(log n) | O(n) | O(log n) | — | — |
| Delete | O(log n) | O(n) | O(log n) | — | — |
| Range Query | — | — | — | O(log n) | O(log n) |
| Point Update | — | — | — | O(log n) | O(log n) |
| Build | O(n log n) | O(n²) | O(n log n) | O(n) | O(n log n) |
| Space | O(n) | O(n) | O(n) | O(4n) | O(n) |

| Traversal | Time | Space (iterative) | Space (recursive) |
|---|---|---|---|
| Inorder | O(n) | O(h) | O(h) |
| Preorder | O(n) | O(h) | O(h) |
| Postorder | O(n) | O(h) | O(h) |
| Level-order | O(n) | O(w) | — |
| Morris | O(n) | O(1) | — |

h = height of tree, w = maximum width of tree

---

## Interview Tips

### Recursive vs Iterative — How to Choose

| Prefer Recursive | Prefer Iterative |
|---|---|
| Solution is naturally top-down or bottom-up | Need to control traversal order precisely |
| Tree is balanced (stack depth ≤ ~20 for 10⁶ nodes) | Worried about stack overflow |
| Code clarity is important | Need O(1) space (Morris) |
| Most interview problems | System-level code |

### Edge Cases Checklist
- **Null root** (empty tree)
- **Single node** (root with no children)
- **Skewed tree** (all left or all right — degenerates to linked list)
- **Negative values** (affects path sum problems)
- **Duplicate values** (affects BST validity definition)
- **Integer overflow** (sum of path values may exceed `int`)

### Problem-Solving Framework
1. **Identify the traversal:** Does the problem need top-down info (preorder)? Bottom-up
   computation (postorder)? Level-by-level (BFS)?
2. **Define the recursive function:** What does it return? What parameters does it need?
3. **Base case:** Usually `if (root == null) return ...`
4. **Recursive case:** Process current node, combine results from left/right.
5. **Global state:** Some problems need a global variable (diameter, max path sum).

### Common Mistakes
1. **Confusing height and depth** — height is bottom-up, depth is top-down
2. **Not passing bounds correctly** in BST validation
3. **Forgetting to backtrack** in path problems that use maps/sets
4. **Modifying tree structure** unintentionally (threads in Morris, pointer swaps)
5. **Assuming balanced** — worst case BST height is O(n), not O(log n)
