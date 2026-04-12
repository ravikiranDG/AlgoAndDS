# Dynamic Programming

## Table of Contents
- [Fundamentals](#fundamentals)
- [Top-Down vs Bottom-Up](#top-down-vs-bottom-up)
- [State Definition](#state-definition)
- [DP Patterns](#dp-patterns)
  - [Linear DP](#1-linear-dp)
  - [Knapsack Variants](#2-knapsack-variants)
  - [String DP](#3-string-dp)
  - [Interval DP](#4-interval-dp)
  - [Grid DP](#5-grid-dp)
  - [Tree DP](#6-tree-dp)
  - [Bitmask DP](#7-bitmask-dp)
  - [State Machine DP](#8-state-machine-dp)
  - [Digit DP](#9-digit-dp)
- [Space Optimization](#space-optimization)
- [Step-by-Step Approach](#step-by-step-approach)
- [Identifying DP Problems](#identifying-dp-problems)
- [Interview Tips](#interview-tips)

---

## Fundamentals

Dynamic Programming solves problems by combining solutions to overlapping subproblems. Two properties must hold:

| Property | Description |
|----------|-------------|
| **Optimal Substructure** | Optimal solution to the problem contains optimal solutions to subproblems |
| **Overlapping Subproblems** | Same subproblems are solved multiple times in a naive recursive approach |

If only optimal substructure exists (no overlapping subproblems), use **greedy**. If only overlapping subproblems exist (no optimality), use **memoized recursion** but not necessarily "DP".

---

## Top-Down vs Bottom-Up

### Top-Down (Memoization)
```java
// Fibonacci — top-down
private int[] memo;
public int fib(int n) {
    memo = new int[n + 1];
    Arrays.fill(memo, -1);
    return dp(n);
}
private int dp(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = dp(n - 1) + dp(n - 2);
}
```

### Bottom-Up (Tabulation)
```java
// Fibonacci — bottom-up
public int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
```

### Tradeoffs

| Aspect | Top-Down | Bottom-Up |
|--------|----------|-----------|
| Implementation | More intuitive, follows recursion | Iterative, needs careful ordering |
| Subproblem computation | Only computes needed subproblems | Computes all subproblems |
| Stack overflow risk | Yes (deep recursion) | No |
| Space optimization | Harder to apply | Easier (rolling arrays) |
| Cache performance | Worse (random access) | Better (sequential access) |
| Debugging | Harder to trace | Easier to inspect table |

**Recommendation**: Start with top-down to get the recurrence right, then convert to bottom-up for optimization.

---

## State Definition

> **The most critical step in DP is defining the state correctly.**

A state must capture *exactly* the information needed to make future decisions without knowing the past.

### Checklist for State Definition
1. **What changes between subproblems?** → These are your state variables.
2. **What decision do you make at each step?** → This defines transitions.
3. **Is the state space finite and manageable?** → Check for feasibility.
4. **Does the state capture enough info?** → If the same state can lead to different results, you're missing a dimension.

### Example: State Design for Buy/Sell Stock with Cooldown
- **State variables**: `day`, `holding` (whether we currently hold a stock), `cooldown`
- Simplified: `dp[i][0]` = max profit on day i without stock, `dp[i][1]` = with stock

---

## DP Patterns

### 1. Linear DP

Problems where state depends on previous elements in a 1D sequence.

**Climbing Stairs** — `dp[i] = dp[i-1] + dp[i-2]`

```java
public int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

**House Robber** — `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

```java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

**Maximum Subarray (Kadane's)** — `dp[i] = max(nums[i], dp[i-1] + nums[i])`

```java
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], currSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currSum = Math.max(nums[i], currSum + nums[i]);
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}
```

**Longest Increasing Subsequence** — O(n log n) with patience sorting

```java
public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int pos = Collections.binarySearch(tails, num);
        if (pos < 0) pos = -(pos + 1);
        if (pos == tails.size()) tails.add(num);
        else tails.set(pos, num);
    }
    return tails.size();
}
```

| Problem | Time | Space |
|---------|------|-------|
| Climbing Stairs | O(n) | O(1) |
| House Robber | O(n) | O(1) |
| Maximum Subarray | O(n) | O(1) |
| LIS (binary search) | O(n log n) | O(n) |

---

### 2. Knapsack Variants

**0/1 Knapsack** — Each item used at most once.

```java
// State: dp[i][w] = max value using items 0..i-1 with capacity w
public int knapsack01(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[] dp = new int[capacity + 1]; // space-optimized to 1D
    for (int i = 0; i < n; i++) {
        for (int w = capacity; w >= weights[i]; w--) { // reverse order!
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

**Unbounded Knapsack** — Each item used unlimited times.

```java
public int unboundedKnapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int w = weights[i]; w <= capacity; w++) { // forward order!
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
```

**Subset Sum** — Can we pick elements summing to target?

```java
public boolean canPartition(int[] nums, int target) {
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int num : nums) {
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    return dp[target];
}
```

**Coin Change** — Minimum coins to make amount (unbounded variant).

```java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    for (int coin : coins) {
        for (int a = coin; a <= amount; a++) {
            dp[a] = Math.min(dp[a], dp[a - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
```

| Variant | Item Reuse | Loop Order (1D) | Time | Space |
|---------|-----------|-----------------|------|-------|
| 0/1 Knapsack | Once | Reverse | O(n·W) | O(W) |
| Unbounded | Unlimited | Forward | O(n·W) | O(W) |
| Bounded (k copies) | k times | Binary lifting or reverse with count | O(n·W·log k) | O(W) |
| Subset Sum | Once | Reverse | O(n·S) | O(S) |

---

### 3. String DP

**Edit Distance (Levenshtein)** — `dp[i][j]` = min edits to convert `word1[0..i-1]` to `word2[0..j-1]`

```java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],  // replace
                                Math.min(dp[i - 1][j],       // delete
                                         dp[i][j - 1]));     // insert
            }
        }
    }
    return dp[m][n];
}
```

**Longest Common Subsequence (LCS)**

```java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[] dp = new int[n + 1]; // space-optimized
    for (int i = 1; i <= m; i++) {
        int prev = 0;
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[j] = prev + 1;
            } else {
                dp[j] = Math.max(dp[j], dp[j - 1]);
            }
            prev = temp;
        }
    }
    return dp[n];
}
```

**Longest Palindromic Subsequence** — LCS of string and its reverse, or interval DP.

| Problem | Time | Space |
|---------|------|-------|
| Edit Distance | O(m·n) | O(n) optimized |
| LCS | O(m·n) | O(n) optimized |
| Longest Palindromic Subseq | O(n²) | O(n) optimized |

---

### 4. Interval DP

State defined over subarray `[i, j]`. Solve smaller intervals first.

**Matrix Chain Multiplication** — `dp[i][j]` = min cost to multiply matrices i through j.

```java
public int matrixChainOrder(int[] dims) {
    int n = dims.length - 1; // number of matrices
    int[][] dp = new int[n][n];

    for (int len = 2; len <= n; len++) {           // interval length
        for (int i = 0; i <= n - len; i++) {       // start
            int j = i + len - 1;                   // end
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {          // split point
                int cost = dp[i][k] + dp[k + 1][j]
                         + dims[i] * dims[k + 1] * dims[j + 1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n - 1];
}
```

**Burst Balloons (LC 312)** — Think of adding balloons instead of removing.

```java
public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] arr = new int[n + 2]; // padded with 1s
    arr[0] = arr[n + 1] = 1;
    for (int i = 0; i < n; i++) arr[i + 1] = nums[i];

    int[][] dp = new int[n + 2][n + 2];
    for (int len = 1; len <= n; len++) {
        for (int left = 1; left <= n - len + 1; left++) {
            int right = left + len - 1;
            for (int k = left; k <= right; k++) {
                dp[left][right] = Math.max(dp[left][right],
                    dp[left][k - 1] + dp[k + 1][right]
                    + arr[left - 1] * arr[k] * arr[right + 1]);
            }
        }
    }
    return dp[1][n];
}
```

| Problem | Time | Space |
|---------|------|-------|
| Matrix Chain Multiplication | O(n³) | O(n²) |
| Burst Balloons | O(n³) | O(n²) |

---

### 5. Grid DP

**Unique Paths** — `dp[i][j] = dp[i-1][j] + dp[i][j-1]`

```java
public int uniquePaths(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[j] += dp[j - 1];
        }
    }
    return dp[n - 1];
}
```

**Minimum Path Sum**

```java
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] dp = new int[n];
    dp[0] = grid[0][0];
    for (int j = 1; j < n; j++) dp[j] = dp[j - 1] + grid[0][j];

    for (int i = 1; i < m; i++) {
        dp[0] += grid[i][0];
        for (int j = 1; j < n; j++) {
            dp[j] = Math.min(dp[j], dp[j - 1]) + grid[i][j];
        }
    }
    return dp[n - 1];
}
```

**Maximal Square** — `dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1` if cell is '1'.

```java
public int maximalSquare(char[][] matrix) {
    int m = matrix.length, n = matrix[0].length, maxSide = 0;
    int[] dp = new int[n + 1];
    int prev = 0;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            int temp = dp[j];
            if (matrix[i - 1][j - 1] == '1') {
                dp[j] = Math.min(Math.min(dp[j], dp[j - 1]), prev) + 1;
                maxSide = Math.max(maxSide, dp[j]);
            } else {
                dp[j] = 0;
            }
            prev = temp;
        }
        prev = 0;
    }
    return maxSide * maxSide;
}
```

---

### 6. Tree DP

Run DP on tree structure, typically via post-order DFS.

**Binary Tree Maximum Path Sum (LC 124)**

```java
private int maxSum = Integer.MIN_VALUE;
public int maxPathSum(TreeNode root) {
    dfs(root);
    return maxSum;
}
private int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = Math.max(0, dfs(node.left));
    int right = Math.max(0, dfs(node.right));
    maxSum = Math.max(maxSum, left + right + node.val); // path through node
    return Math.max(left, right) + node.val;            // path ending at node
}
```

**House Robber III** — Rob or skip each node.

```java
public int rob(TreeNode root) {
    int[] result = dfs(root);
    return Math.max(result[0], result[1]);
}
// returns [rob this node, skip this node]
private int[] dfs(TreeNode node) {
    if (node == null) return new int[]{0, 0};
    int[] left = dfs(node.left);
    int[] right = dfs(node.right);
    int rob = node.val + left[1] + right[1];
    int skip = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    return new int[]{rob, skip};
}
```

---

### 7. Bitmask DP

Use bitmask to represent subsets. State: `dp[mask]` or `dp[mask][i]`.

**Travelling Salesman Problem** — `dp[mask][i]` = min cost to visit cities in `mask`, ending at `i`.

```java
public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE / 2);
    dp[1][0] = 0; // start at city 0

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if ((mask & (1 << u)) == 0) continue;
            for (int v = 0; v < n; v++) {
                if ((mask & (1 << v)) != 0) continue;
                int newMask = mask | (1 << v);
                dp[newMask][v] = Math.min(dp[newMask][v], dp[mask][u] + dist[u][v]);
            }
        }
    }
    int fullMask = (1 << n) - 1;
    int ans = Integer.MAX_VALUE;
    for (int u = 0; u < n; u++) {
        ans = Math.min(ans, dp[fullMask][u] + dist[u][0]);
    }
    return ans;
}
```

**Complexity**: O(2^n · n²) time, O(2^n · n) space. Feasible for n ≤ 20.

---

### 8. State Machine DP

Model the problem as transitions between states.

**Best Time to Buy and Sell Stock with Cooldown (LC 309)**

States: `held`, `sold`, `rest`

```java
public int maxProfit(int[] prices) {
    int held = Integer.MIN_VALUE, sold = 0, rest = 0;
    for (int price : prices) {
        int prevHeld = held;
        held = Math.max(held, rest - price);    // buy or hold
        rest = Math.max(rest, sold);            // rest or exit cooldown
        sold = prevHeld + price;                // sell
    }
    return Math.max(sold, rest);
}
```

**Stock Problems Summary**

| Variant | States | Time |
|---------|--------|------|
| One transaction | held, not_held | O(n) |
| Unlimited transactions | held, not_held | O(n) |
| At most k transactions | day × k × held/not | O(n·k) |
| With cooldown | held, sold, rest | O(n) |
| With fee | held, not_held | O(n) |

---

### 9. Digit DP

Count numbers in range [0, N] with specific digit properties.

**Template**: `dp(pos, tight, state)` — build number digit by digit.

```java
// Count numbers up to N with no two adjacent digits the same
private int[][][] memo;
private int[] digits;

public int countSpecial(int n) {
    digits = getDigits(n);
    memo = new int[digits.length][2][10]; // [pos][tight][lastDigit]
    for (int[][] a : memo) for (int[] b : a) Arrays.fill(b, -1);
    return solve(0, 1, -1);
}

private int solve(int pos, int tight, int last) {
    if (pos == digits.length) return 1;
    if (last >= 0 && memo[pos][tight][last] != -1)
        return memo[pos][tight][last];

    int limit = tight == 1 ? digits[pos] : 9;
    int count = 0;
    for (int d = 0; d <= limit; d++) {
        if (d == last) continue; // constraint: no adjacent same digits
        count += solve(pos + 1, (tight == 1 && d == limit) ? 1 : 0, d);
    }
    if (last >= 0) memo[pos][tight][last] = count;
    return count;
}

private int[] getDigits(int n) {
    String s = String.valueOf(n);
    int[] d = new int[s.length()];
    for (int i = 0; i < s.length(); i++) d[i] = s.charAt(i) - '0';
    return d;
}
```

**Key insight for range [L, R]**: compute `count(R) - count(L - 1)`.

---

## Space Optimization

### Rolling Array (2D → Two Rows)

When `dp[i]` only depends on `dp[i-1]`, keep only two rows.

```java
// Before: int[][] dp = new int[m][n];
// After:
int[] prev = new int[n], curr = new int[n];
for (int i = 1; i < m; i++) {
    // fill curr using prev
    int[] temp = prev; prev = curr; curr = temp;
}
```

### 1D from 2D

For knapsack-style problems, iterate in the right direction to reuse the same row.

```java
// 0/1 knapsack: iterate capacity in reverse
for (int w = capacity; w >= weights[i]; w--)

// Unbounded: iterate capacity forward
for (int w = weights[i]; w <= capacity; w++)
```

### Variable Elimination

When `dp[i]` depends only on `dp[i-1]` and `dp[i-2]`, use two variables.

---

## Step-by-Step Approach

1. **Identify states**: What parameters uniquely define a subproblem?
2. **Define transitions**: How does the current state relate to previous states?
3. **Set base cases**: What are the simplest subproblems with known answers?
4. **Determine order**: Fill states so that dependencies are resolved first.
5. **Compute answer**: Which state(s) hold the final result?
6. **Optimize space**: Can you reduce dimensions?

---

## Identifying DP Problems

### Strong Signals
- "Find the **minimum/maximum** cost/value/count"
- "How **many ways** to reach/achieve..."
- "Is it **possible** to..." (often subset sum variant)
- "**Longest/shortest** subsequence/subarray with property"
- Choices at each step with consequences for future steps

### Weak Signals (could be greedy or other)
- "Optimal strategy" (could be game theory DP)
- "Partition into groups" (could be DP or greedy)

### NOT DP
- "Find all solutions" → usually backtracking
- "Find shortest path" → usually BFS/Dijkstra (though DP on DAGs works)
- "Sort/arrange" → usually sorting algorithms

---

## Interview Tips

1. **Start with brute force**: Explain the recursive solution first. This shows the recurrence.
2. **Add memoization**: Point out overlapping subproblems, add a memo table.
3. **Convert to bottom-up**: If asked to optimize or if recursion depth is a concern.
4. **State the complexity**: Always analyze time and space after writing the solution.
5. **Optimize space last**: Only if time permits or interviewer asks.
6. **Practice the patterns**: 80% of DP interview problems fall into the patterns above.
7. **Draw the table**: For 2D DP, physically trace through a small example to verify.
8. **Watch for off-by-one**: Index mismatches between 0-based and 1-based are the #1 bug source.

### Complexity Quick Reference

| Pattern | Typical Time | Typical Space |
|---------|-------------|---------------|
| Linear DP | O(n) or O(n²) | O(1) to O(n) |
| Knapsack | O(n·W) | O(W) |
| String DP | O(m·n) | O(n) |
| Interval DP | O(n³) | O(n²) |
| Grid DP | O(m·n) | O(n) |
| Tree DP | O(n) | O(h) stack |
| Bitmask DP | O(2^n · n) | O(2^n) |
| State Machine DP | O(n·k) | O(k) |
| Digit DP | O(D·S·10) | O(D·S·10) |
