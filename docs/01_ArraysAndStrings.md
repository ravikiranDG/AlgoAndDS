# Arrays and Strings — Comprehensive Guide

## Table of Contents
1. [Array Fundamentals](#array-fundamentals)
2. [Key Techniques](#key-techniques)
3. [String Manipulation](#string-manipulation)
4. [Common Patterns](#common-patterns)
5. [Complexity Reference](#complexity-reference)
6. [Java-Specific Tips](#java-specific-tips)
7. [Interview Strategy](#interview-strategy)

---

## Array Fundamentals

### Memory Layout & Cache-Friendliness

Arrays store elements in **contiguous memory**. This gives O(1) random access and excellent
**spatial locality** — when one element is loaded into the CPU cache line (typically 64 bytes),
neighbouring elements come along for free. This is why iterating an array linearly is
significantly faster in practice than traversing a linked structure, even when both are O(n).

**Implication for interviews:** Prefer array-based approaches when data fits and random access
is needed. A `HashMap` has O(1) lookup but worse cache behaviour than a sorted array with
binary search.

### Dynamic Arrays — Amortized Analysis

Java's `ArrayList` doubles its internal array when full. Individual resizes cost O(n), but
across n insertions the total work is:

```
1 + 2 + 4 + 8 + ... + n = 2n − 1 → O(n) total → O(1) amortized per add
```

**Key insight:** The geometric growth factor (typically 1.5× or 2×) is what guarantees
amortized O(1). A fixed increment (e.g., +10 each time) degrades to O(n) amortized.

---

## Key Techniques

### 1. Two Pointers

Use when the array is **sorted** or you need to compare/process elements from both ends.

**Variants:**
- **Opposite ends** — converge from `left=0` and `right=n-1` (e.g., Two Sum on sorted array)
- **Same direction** — slow/fast pointer (e.g., remove duplicates in-place)

```java
// Two Sum on sorted array — O(n) time, O(1) space
public int[] twoSum(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo < hi) {
        int sum = nums[lo] + nums[hi];
        if (sum == target) return new int[]{lo, hi};
        else if (sum < target) lo++;
        else hi--;
    }
    return new int[]{-1, -1};
}
```

```java
// Remove duplicates in-place — O(n) time, O(1) space
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            nums[++slow] = nums[fast];
        }
    }
    return slow + 1;
}
```

### 2. Prefix Sums

Precompute cumulative sums to answer **range sum queries** in O(1) after O(n) preprocessing.

```java
// Build prefix sum — O(n) time, O(n) space
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// Sum of nums[l..r] inclusive
int rangeSum = prefix[r + 1] - prefix[l];
```

**Advanced use — Subarray Sum Equals K:**

```java
// Count subarrays with sum == k — O(n) time, O(n) space
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1);
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}
```

### 3. Kadane's Algorithm

Find the **maximum subarray sum** in O(n) time, O(1) space.

```java
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], curSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curSum = Math.max(nums[i], curSum + nums[i]);
        maxSum = Math.max(maxSum, curSum);
    }
    return maxSum;
}
```

**Core idea:** At each position, decide: extend the current subarray or start fresh. If the
running sum drops below the current element, starting fresh is better.

### 4. Dutch National Flag (3-Way Partition)

Sort an array of 0s, 1s, and 2s in a **single pass** — O(n) time, O(1) space.

```java
public void sortColors(int[] nums) {
    int lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            swap(nums, lo++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, hi--);
        }
    }
}

private void swap(int[] a, int i, int j) {
    int tmp = a[i]; a[i] = a[j]; a[j] = tmp;
}
```

**Invariant:** `[0..lo-1]` are 0s, `[lo..mid-1]` are 1s, `[hi+1..n-1]` are 2s.

---

## String Manipulation

### StringBuilder & Immutability

Java strings are **immutable**. Every `s += "x"` creates a new `String` object → O(n) per
concatenation → O(n²) for n concatenations in a loop.

```java
// BAD — O(n²)
String result = "";
for (int i = 0; i < n; i++) result += words[i];

// GOOD — O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(words[i]);
String result = sb.toString();
```

### String Hashing — Rabin-Karp

Rolling hash for substring search. Avoids O(n·m) brute force by computing hashes in O(1) per
window shift.

```java
// Rabin-Karp substring search — O(n+m) average, O(n·m) worst case
public int rabinKarp(String text, String pattern) {
    int n = text.length(), m = pattern.length();
    if (m > n) return -1;
    long MOD = 1_000_000_007L, BASE = 31;

    long patHash = 0, txtHash = 0, power = 1;
    for (int i = 0; i < m; i++) {
        patHash = (patHash * BASE + pattern.charAt(i)) % MOD;
        txtHash = (txtHash * BASE + text.charAt(i)) % MOD;
        if (i > 0) power = power * BASE % MOD;
    }

    for (int i = 0; i <= n - m; i++) {
        if (patHash == txtHash && text.substring(i, i + m).equals(pattern)) {
            return i;
        }
        if (i < n - m) {
            txtHash = (txtHash - text.charAt(i) * power % MOD + MOD) % MOD;
            txtHash = (txtHash * BASE + text.charAt(i + m)) % MOD;
        }
    }
    return -1;
}
```

---

## Common Patterns

### Sliding Window — Fixed Size

Process all contiguous subarrays/substrings of exactly size `k`.

```java
// Maximum sum of subarray of size k — O(n) time, O(1) space
public int maxSumFixed(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];

    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
```

### Sliding Window — Variable Size

Expand the right end; shrink from the left when a condition is violated.

```java
// Longest substring without repeating characters — O(n) time, O(min(n,charset)) space
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
            left = lastSeen.get(c) + 1;
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
```

### In-Place Array Manipulation

When the problem says "modify in-place with O(1) extra space", use overwrite-from-front or
overwrite-from-back strategies.

```java
// Move zeroes to end, maintain order — O(n) time, O(1) space
public void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int num : nums) {
        if (num != 0) nums[insertPos++] = num;
    }
    while (insertPos < nums.length) nums[insertPos++] = 0;
}
```

### Matrix Traversal

```java
// Spiral order traversal — O(m·n) time, O(1) extra space (excluding output)
public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> result = new ArrayList<>();
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;

    while (top <= bottom && left <= right) {
        for (int c = left; c <= right; c++) result.add(matrix[top][c]);
        top++;
        for (int r = top; r <= bottom; r++) result.add(matrix[r][right]);
        right--;
        if (top <= bottom) {
            for (int c = right; c >= left; c--) result.add(matrix[bottom][c]);
            bottom--;
        }
        if (left <= right) {
            for (int r = bottom; r >= top; r--) result.add(matrix[r][left]);
            left++;
        }
    }
    return result;
}
```

---

## Complexity Reference

| Technique | Time | Space | When to Use |
|---|---|---|---|
| Two Pointers (sorted) | O(n) | O(1) | Pair/triplet finding, partitioning |
| Prefix Sum | O(n) build, O(1) query | O(n) | Range sum queries, subarray sum problems |
| Kadane's | O(n) | O(1) | Maximum subarray sum |
| Dutch National Flag | O(n) | O(1) | 3-way partitioning |
| Sliding Window (fixed) | O(n) | O(1) | Fixed-size subarray/substring |
| Sliding Window (variable) | O(n) | O(k)† | Min/max length subarray with constraint |
| Rabin-Karp | O(n+m) avg | O(1) | Pattern matching, repeated substring |
| Binary Search | O(log n) | O(1) | Sorted data, monotonic predicate |

† k = size of auxiliary set/map tracking the window state

---

## Java-Specific Tips

### Sorting Internals
- **`Arrays.sort(int[])` (primitives):** Dual-pivot Quicksort — O(n log n) average, O(n²)
  worst case. Not stable.
- **`Arrays.sort(Object[])` / `Collections.sort()`:** TimSort — O(n log n) guaranteed, stable.
  Exploits existing runs in the data (adaptive).
- **Choosing comparators:**
  ```java
  // Sort 2D array by first element, then by second descending
  Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);
  ```
  ⚠️ Avoid `a - b` for comparators when values can overflow. Use `Integer.compare(a, b)`.

### Useful Utilities
```java
Arrays.fill(arr, 0);                 // fill entire array
Arrays.copyOfRange(arr, from, to);   // sub-array copy
Collections.reverse(list);           // reverse a list
String.valueOf(charArray);           // char[] → String
s.toCharArray();                     // String → char[]
Character.isLetterOrDigit(c);        // alphanumeric check
```

---

## Interview Strategy

### Choosing Your Approach

```
Is the input sorted (or can be sorted cheaply)?
├── YES → Two Pointers or Binary Search
└── NO
    ├── Need exact counts / sums?  → HashMap + Prefix Sum
    ├── Contiguous subarray?       → Sliding Window or Kadane's
    ├── Pattern matching?          → Rabin-Karp or two-pointer
    └── In-place required?         → Two Pointers / Dutch Flag
```

### Common Edge Cases to Check
- Empty array / empty string
- Single element
- All elements identical
- Already sorted / reverse sorted
- Negative numbers (Kadane's, prefix sums)
- Integer overflow (`int` vs `long`)
- Unicode / special characters in strings

### Communication Template
1. **Clarify:** Input constraints, duplicates allowed?, sorted?, return type?
2. **Brute force:** State it, give complexity, acknowledge it's suboptimal.
3. **Optimize:** Explain the technique and why it applies here.
4. **Code:** Write clean code with meaningful variable names.
5. **Test:** Walk through 1-2 examples, then edge cases.
6. **Complexity:** State time and space, justify each.
