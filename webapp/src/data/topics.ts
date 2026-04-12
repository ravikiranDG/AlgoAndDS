export interface Topic {
  slug: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  content: string;
}

export const topics: Topic[] = [
  {
    slug: 'arrays-and-strings',
    title: 'Arrays & Strings',
    icon: 'Layers',
    description: 'Master array manipulation, string processing, and fundamental techniques like two pointers, prefix sums, and sliding window.',
    color: 'emerald',
    content: `# Arrays and Strings — Comprehensive Guide

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
is needed. A \`HashMap\` has O(1) lookup but worse cache behaviour than a sorted array with
binary search.

### Dynamic Arrays — Amortized Analysis

Java's \`ArrayList\` doubles its internal array when full. Individual resizes cost O(n), but
across n insertions the total work is:

\`\`\`
1 + 2 + 4 + 8 + ... + n = 2n − 1 → O(n) total → O(1) amortized per add
\`\`\`

**Key insight:** The geometric growth factor (typically 1.5× or 2×) is what guarantees
amortized O(1). A fixed increment (e.g., +10 each time) degrades to O(n) amortized.

---

## Key Techniques

### 1. Two Pointers

Use when the array is **sorted** or you need to compare/process elements from both ends.

**Variants:**
- **Opposite ends** — converge from \`left=0\` and \`right=n-1\` (e.g., Two Sum on sorted array)
- **Same direction** — slow/fast pointer (e.g., remove duplicates in-place)

\`\`\`java
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
\`\`\`

\`\`\`java
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
\`\`\`

### 2. Prefix Sums

Precompute cumulative sums to answer **range sum queries** in O(1) after O(n) preprocessing.

\`\`\`java
// Build prefix sum — O(n) time, O(n) space
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// Sum of nums[l..r] inclusive
int rangeSum = prefix[r + 1] - prefix[l];
\`\`\`

**Advanced use — Subarray Sum Equals K:**

\`\`\`java
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
\`\`\`

### 3. Kadane's Algorithm

Find the **maximum subarray sum** in O(n) time, O(1) space.

\`\`\`java
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], curSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curSum = Math.max(nums[i], curSum + nums[i]);
        maxSum = Math.max(maxSum, curSum);
    }
    return maxSum;
}
\`\`\`

**Core idea:** At each position, decide: extend the current subarray or start fresh. If the
running sum drops below the current element, starting fresh is better.

### 4. Dutch National Flag (3-Way Partition)

Sort an array of 0s, 1s, and 2s in a **single pass** — O(n) time, O(1) space.

\`\`\`java
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
\`\`\`

**Invariant:** \`[0..lo-1]\` are 0s, \`[lo..mid-1]\` are 1s, \`[hi+1..n-1]\` are 2s.

---

## String Manipulation

### StringBuilder & Immutability

Java strings are **immutable**. Every \`s += "x"\` creates a new \`String\` object → O(n) per
concatenation → O(n²) for n concatenations in a loop.

\`\`\`java
// BAD — O(n²)
String result = "";
for (int i = 0; i < n; i++) result += words[i];

// GOOD — O(n)
StringBuilder sb = new StringBuilder();
for (int i = 0; i < n; i++) sb.append(words[i]);
String result = sb.toString();
\`\`\`

### String Hashing — Rabin-Karp

Rolling hash for substring search. Avoids O(n·m) brute force by computing hashes in O(1) per
window shift.

\`\`\`java
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
\`\`\`

---

## Common Patterns

### Sliding Window — Fixed Size

Process all contiguous subarrays/substrings of exactly size \`k\`.

\`\`\`java
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
\`\`\`

### Sliding Window — Variable Size

Expand the right end; shrink from the left when a condition is violated.

\`\`\`java
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
\`\`\`

### In-Place Array Manipulation

When the problem says "modify in-place with O(1) extra space", use overwrite-from-front or
overwrite-from-back strategies.

\`\`\`java
// Move zeroes to end, maintain order — O(n) time, O(1) space
public void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int num : nums) {
        if (num != 0) nums[insertPos++] = num;
    }
    while (insertPos < nums.length) nums[insertPos++] = 0;
}
\`\`\`

### Matrix Traversal

\`\`\`java
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
\`\`\`

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
- **\`Arrays.sort(int[])\` (primitives):** Dual-pivot Quicksort — O(n log n) average, O(n²)
  worst case. Not stable.
- **\`Arrays.sort(Object[])\` / \`Collections.sort()\`:** TimSort — O(n log n) guaranteed, stable.
  Exploits existing runs in the data (adaptive).
- **Choosing comparators:**
  \`\`\`java
  // Sort 2D array by first element, then by second descending
  Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);
  \`\`\`
  ⚠️ Avoid \`a - b\` for comparators when values can overflow. Use \`Integer.compare(a, b)\`.

### Useful Utilities
\`\`\`java
Arrays.fill(arr, 0);                 // fill entire array
Arrays.copyOfRange(arr, from, to);   // sub-array copy
Collections.reverse(list);           // reverse a list
String.valueOf(charArray);           // char[] → String
s.toCharArray();                     // String → char[]
Character.isLetterOrDigit(c);        // alphanumeric check
\`\`\`

---

## Interview Strategy

### Choosing Your Approach

\`\`\`
Is the input sorted (or can be sorted cheaply)?
├── YES → Two Pointers or Binary Search
└── NO
    ├── Need exact counts / sums?  → HashMap + Prefix Sum
    ├── Contiguous subarray?       → Sliding Window or Kadane's
    ├── Pattern matching?          → Rabin-Karp or two-pointer
    └── In-place required?         → Two Pointers / Dutch Flag
\`\`\`

### Common Edge Cases to Check
- Empty array / empty string
- Single element
- All elements identical
- Already sorted / reverse sorted
- Negative numbers (Kadane's, prefix sums)
- Integer overflow (\`int\` vs \`long\`)
- Unicode / special characters in strings

### Communication Template
1. **Clarify:** Input constraints, duplicates allowed?, sorted?, return type?
2. **Brute force:** State it, give complexity, acknowledge it's suboptimal.
3. **Optimize:** Explain the technique and why it applies here.
4. **Code:** Write clean code with meaningful variable names.
5. **Test:** Walk through 1-2 examples, then edge cases.
6. **Complexity:** State time and space, justify each.

---

## ASCII Visual Diagrams

### Array Memory Layout

\`\`\`
Contiguous Memory (int[] arr = {10, 20, 30, 40, 50}):

Address:  0x100  0x104  0x108  0x10C  0x110
         ┌──────┬──────┬──────┬──────┬──────┐
Value:   │  10  │  20  │  30  │  40  │  50  │
         └──────┴──────┴──────┴──────┴──────┘
Index:      0      1      2      3      4

Random access: arr[3] → base + 3 × sizeof(int) = 0x100 + 12 = 0x10C → 40
\`\`\`

### Two Pointer Movement (Opposite Ends)

\`\`\`
Two Sum on sorted array [1, 3, 5, 7, 9], target = 12

Step 1:  [1, 3, 5, 7, 9]   sum = 1+9 = 10 < 12  → move L right
          L              R

Step 2:  [1, 3, 5, 7, 9]   sum = 3+9 = 12 = target → FOUND!
             L           R
\`\`\`

### Two Pointer Movement (Same Direction — Remove Duplicates)

\`\`\`
Input: [1, 1, 2, 2, 3]

Step 1:  [1, 1, 2, 2, 3]   nums[F]=1 == nums[S]=1  → skip
          S  F

Step 2:  [1, 1, 2, 2, 3]   nums[F]=2 != nums[S]=1  → S++, copy
          S     F

Step 3:  [1, 2, 2, 2, 3]   nums[F]=2 == nums[S]=2  → skip
             S     F

Step 4:  [1, 2, 2, 2, 3]   nums[F]=3 != nums[S]=2  → S++, copy
             S        F

Result:  [1, 2, 3, _, _]   return S+1 = 3
                S        F
\`\`\`

### Sliding Window (Variable Size)

\`\`\`
Longest substring without repeating chars: "abcabcbb"

Window expands right, shrinks left on duplicate:

  a b c a b c b b
  L
  R               → window: "a"       len=1
  L
    R             → window: "ab"      len=2
  L
      R           → window: "abc"     len=3  ✓ max=3
  L
        R         → 'a' repeats       shrink L
    L
        R         → window: "bca"     len=3  ✓ max=3
    L
          R       → 'b' repeats       shrink L
      L
          R       → 'c' repeats       shrink L
        L
          R       → window: "abc"     len=3
        L
            R     → 'b' repeats       shrink L
          L
            R     → 'b' repeats       shrink L
            L
            R     → window: "cb"      len=2
            L
              R   → 'b' repeats       shrink L
              L
              R   → window: "b"       len=1
Answer: 3
\`\`\`

### Prefix Sum Visualization

\`\`\`
nums:    [2,  4,  1,  3,  5]
prefix:  [0,  2,  6,  7, 10, 15]
          ↑                     ↑
        prefix[0]=0          prefix[5]=sum of all

Range sum [1..3] = prefix[4] - prefix[1] = 10 - 2 = 8
Check: nums[1]+nums[2]+nums[3] = 4+1+3 = 8  ✓
\`\`\`

### Kadane's Algorithm Walkthrough

\`\`\`
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

i=0: curSum = max(-2, -2)     = -2   maxSum = -2
i=1: curSum = max(1, -2+1)    =  1   maxSum =  1
i=2: curSum = max(-3, 1+(-3)) = -2   maxSum =  1
i=3: curSum = max(4, -2+4)    =  4   maxSum =  4
i=4: curSum = max(-1, 4+(-1)) =  3   maxSum =  4
i=5: curSum = max(2, 3+2)     =  5   maxSum =  5
i=6: curSum = max(1, 5+1)     =  6   maxSum =  6  ← answer
i=7: curSum = max(-5, 6+(-5)) =  1   maxSum =  6
i=8: curSum = max(4, 1+4)     =  5   maxSum =  6

Answer: 6 (subarray [4, -1, 2, 1])
\`\`\`

---

## Step-by-Step Walkthroughs

### Two Sum (HashMap Approach)

\`\`\`
nums = [2, 7, 11, 15], target = 9

Step 1: i=0, num=2,  need=7,  map={}            → not found, add {2:0}
Step 2: i=1, num=7,  need=2,  map={2:0}         → FOUND! return [0, 1]
\`\`\`

### Binary Search Walkthrough

\`\`\`
Find 7 in [1, 3, 5, 7, 9, 11, 13]

Step 1: lo=0, hi=6, mid=3  → arr[3]=7 == target → FOUND at index 3

Find 6 in [1, 3, 5, 7, 9, 11, 13]

Step 1: lo=0, hi=6, mid=3  → arr[3]=7 > 6  → hi=2
Step 2: lo=0, hi=2, mid=1  → arr[1]=3 < 6  → lo=2
Step 3: lo=2, hi=2, mid=2  → arr[2]=5 < 6  → lo=3
Step 4: lo=3 > hi=2        → NOT FOUND
\`\`\`

### Dutch National Flag Walkthrough

\`\`\`
Input: [2, 0, 2, 1, 1, 0]

lo=0, mid=0, hi=5

mid=0: nums[0]=2 → swap(mid,hi), hi--   → [0, 0, 2, 1, 1, 2] lo=0 mid=0 hi=4
mid=0: nums[0]=0 → swap(lo,mid), lo++, mid++ → [0, 0, 2, 1, 1, 2] lo=1 mid=1 hi=4
mid=1: nums[1]=0 → swap(lo,mid), lo++, mid++ → [0, 0, 2, 1, 1, 2] lo=2 mid=2 hi=4
mid=2: nums[2]=2 → swap(mid,hi), hi--   → [0, 0, 1, 1, 2, 2] lo=2 mid=2 hi=3
mid=2: nums[2]=1 → mid++                → [0, 0, 1, 1, 2, 2] lo=2 mid=3 hi=3
mid=3: nums[3]=1 → mid++                → [0, 0, 1, 1, 2, 2] lo=2 mid=4 hi=3
mid=4 > hi=3 → DONE

Result: [0, 0, 1, 1, 2, 2]
\`\`\`

---

## Additional Java Code Examples

### Binary Search — Classic Template

\`\`\`java
// Standard binary search — O(log n) time, O(1) space
public int binarySearch(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2; // avoids overflow
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}
\`\`\`

### Binary Search — Find Insertion Point (Lower Bound)

\`\`\`java
// Find first position where nums[i] >= target
public int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
\`\`\`

### Trapping Rain Water

\`\`\`java
// Two-pointer approach — O(n) time, O(1) space
public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;

    while (left < right) {
        if (height[left] < height[right]) {
            leftMax = Math.max(leftMax, height[left]);
            water += leftMax - height[left];
            left++;
        } else {
            rightMax = Math.max(rightMax, height[right]);
            water += rightMax - height[right];
            right--;
        }
    }
    return water;
}
\`\`\`

### Product of Array Except Self

\`\`\`java
// O(n) time, O(1) extra space (output array doesn't count)
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    // Forward pass: result[i] = product of nums[0..i-1]
    result[0] = 1;
    for (int i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1];
    }

    // Backward pass: multiply by product of nums[i+1..n-1]
    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i];
    }
    return result;
}
\`\`\`

### Rotate Array In-Place

\`\`\`java
// Rotate array right by k positions — O(n) time, O(1) space
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n; // handle k > n
    reverse(nums, 0, n - 1);
    reverse(nums, 0, k - 1);
    reverse(nums, k, n - 1);
}

private void reverse(int[] nums, int l, int r) {
    while (l < r) {
        int tmp = nums[l]; nums[l] = nums[r]; nums[r] = tmp;
        l++; r--;
    }
}
\`\`\`

---

## Comparison Tables

### ArrayList vs LinkedList vs Array

| Feature | Array | ArrayList | LinkedList |
|---|---|---|---|
| Random access | O(1) | O(1) | O(n) |
| Insert at end | N/A (fixed) | O(1) amortized | O(1) |
| Insert at index | N/A | O(n) | O(n) traversal + O(1) splice |
| Delete at index | N/A | O(n) | O(n) traversal + O(1) splice |
| Memory | Compact, cache-friendly | Compact + resize overhead | Node objects, poor cache |
| When to use | Fixed size, primitives | Default choice | Rare — only deque use |

### Sorting Algorithm Comparison

| Algorithm | Best | Average | Worst | Space | Stable? |
|---|---|---|---|---|---|
| Arrays.sort(int[]) | O(n log n) | O(n log n) | O(n²) | O(log n) | No |
| Arrays.sort(Object[]) | O(n) | O(n log n) | O(n log n) | O(n) | Yes |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No |

### String Comparison Methods

| Method | Time | When to Use |
|---|---|---|
| \`s.equals(t)\` | O(n) | Exact equality |
| \`s.compareTo(t)\` | O(n) | Lexicographic ordering |
| \`s.contains(t)\` | O(n·m) | Substring check |
| Sorting + compare | O(n log n) | Anagram check |
| Frequency array | O(n) | Anagram check (faster) |

---

## ⚠️ Common Mistakes

1. **Off-by-one in binary search:** Use \`lo <= hi\` for search (inclusive), \`lo < hi\` for boundary finding.
2. **Integer overflow in mid calculation:** Use \`lo + (hi - lo) / 2\` instead of \`(lo + hi) / 2\`.
3. **Modifying array while iterating with index:** Track insertion position separately.
4. **Forgetting that Java strings are immutable:** String concatenation in a loop is O(n²).
5. **Not considering negative numbers:** Affects prefix sum, Kadane's, and two-sum approaches.
6. **Using \`==\` to compare strings:** Always use \`.equals()\` in Java.
7. **Array index out of bounds in sliding window:** Ensure \`right < n\` and \`left >= 0\`.
8. **Assuming sorted input:** Always clarify — if not sorted, can you sort? Does that change complexity?

---

## 💡 Interview Tips

- **Always clarify:** "Can the array have duplicates?", "Is it sorted?", "Can elements be negative?"
- **State the brute force first** — even if it's O(n²), it shows you understand the problem.
- **Mention the trade-off:** "We trade O(n) space for O(n) time with a HashMap."
- **Use meaningful variable names:** \`left\`/\`right\` or \`lo\`/\`hi\` not \`i\`/\`j\` for two pointers.
- **Walk through your code** with a small example before claiming it's correct.
- **Don't forget edge cases:** Empty arrays, single elements, all same values.

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Technique |
|---|---|
| "Sorted array", "pair that sums to" | Two pointers (opposite ends) |
| "Remove duplicates in-place" | Two pointers (same direction) |
| "Contiguous subarray", "substring" | Sliding window |
| "Sum of range", "subarray sum equals K" | Prefix sum + HashMap |
| "Maximum/minimum subarray" | Kadane's algorithm |
| "Find element in sorted array" | Binary search |
| "Partition into groups" | Dutch National Flag |
| "Pattern in string" | Rabin-Karp or KMP |
| "Rotate array" | Reverse trick |
| "Product except self" | Prefix/suffix product |

### Decision Tree

\`\`\`
Problem involves an array or string?
├── Is input sorted?
│   ├── YES → Two Pointers or Binary Search
│   └── NO → Can you sort it?
│       ├── YES and O(n log n) OK → Sort + Two Pointers
│       └── NO or need O(n) → HashMap / Prefix Sum
├── Contiguous subarray needed?
│   ├── Fixed size → Fixed Sliding Window
│   ├── Variable size → Expandable Sliding Window
│   └── Any subarray sum → Prefix Sum + HashMap
├── In-place modification?
│   ├── Partition/sort → Dutch National Flag
│   └── Remove/move elements → Two Pointers (same dir)
└── String pattern matching?
    ├── Single pattern → KMP or Rabin-Karp
    └── Multiple patterns → Trie or Aho-Corasick
\`\`\`
`,
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    icon: 'Link',
    description: 'Navigate pointer-based data structures with techniques like reversal, runner pattern, and cycle detection.',
    color: 'blue',
    content: `# Linked Lists — Comprehensive Guide

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

\`\`\`java
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
\`\`\`

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

\`\`\`java
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
\`\`\`

### 2. In-Place Reversal

Reverse a linked list by re-pointing \`next\` pointers. Master this — it appears as a
sub-routine in many problems.

\`\`\`java
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
\`\`\`

### 3. Runner Technique (Slow/Fast Pointer)

Two pointers moving at different speeds. The workhorse of linked list problems.

\`\`\`java
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
\`\`\`

**Variation for even-length lists:** To get the second middle node, change the condition to
\`while (fast != null && fast.next != null)\`.

---

## Cycle Detection — Floyd's Algorithm

### The Algorithm

\`\`\`java
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
\`\`\`

### Mathematical Proof

Let:
- **F** = distance from head to cycle entrance
- **C** = cycle length
- **a** = distance from cycle entrance to the meeting point (within the cycle)

When slow and fast meet:
- Slow has traveled: \`F + a\` steps
- Fast has traveled: \`F + a + kC\` steps (for some integer k ≥ 1, having looped k times)
- Fast moves twice as fast: \`2(F + a) = F + a + kC\`
- Therefore: \`F + a = kC\` → \`F = kC − a\` → \`F = (k−1)C + (C − a)\`

This means: starting from the **meeting point**, walking \`F\` more steps lands you at the
**cycle entrance** (you go around the cycle \`k−1\` full times, then \`C − a\` more steps to
reach the entrance). And starting from the **head**, walking \`F\` steps also reaches the
entrance. Hence, moving one pointer from head and one from the meeting point at the same
speed, they meet at the cycle entrance.

---

## Merge Techniques

### Merge Two Sorted Lists

\`\`\`java
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
\`\`\`

### Merge K Sorted Lists

\`\`\`java
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
\`\`\`

### Merge Sort on Linked Lists

Linked lists are natural for merge sort (no extra space for merging). Split using
slow/fast pointer, recurse, merge.

\`\`\`java
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
\`\`\`

---

## Common Patterns

### Reverse Nodes in k-Group

\`\`\`java
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
\`\`\`

### Partition List

Rearrange nodes so all values < x come before nodes ≥ x, preserving relative order.

\`\`\`java
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
\`\`\`

### Deep Copy with Random Pointers

Each node has a \`next\` and a \`random\` pointer that can point to any node or null.

\`\`\`java
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
\`\`\`

### Palindrome Check

\`\`\`java
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
\`\`\`

---

## Java LinkedList Internals

Java's \`java.util.LinkedList\` is a **doubly linked list** that also implements \`Deque\`.

| Operation | Time |
|---|---|
| \`addFirst\` / \`addLast\` | O(1) |
| \`removeFirst\` / \`removeLast\` | O(1) |
| \`get(index)\` | O(n) — traverses from closer end |
| \`add(index, element)\` | O(n) — traversal + O(1) splice |
| \`contains(element)\` | O(n) |
| \`iterator.remove()\` | O(1) |

**When to use \`LinkedList\` in practice:** Almost never. \`ArrayList\` beats it for nearly all
workloads due to cache locality. Use \`LinkedList\` only when you need constant-time insertion/
removal at both ends **and** you don't need random access (though \`ArrayDeque\` is usually
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

\`\`\`
Before reversal:   1 → 2 → 3 → null
Step 1:           null ← 1   2 → 3 → null   (prev=1, curr=2)
Step 2:           null ← 1 ← 2   3 → null   (prev=2, curr=3)
Step 3:           null ← 1 ← 2 ← 3          (prev=3, curr=null)
\`\`\`

### Edge Cases Checklist
- **Null head** — empty list
- **Single node** — head.next == null
- **Two nodes** — minimal case for reversal/swap
- **Even vs odd length** — affects middle-finding and palindrome checks
- **Cycle present** — guard infinite loops in traversal
- **Duplicate values** — ensure logic doesn't depend on unique values

### Common Mistakes
1. **Losing references:** Always save \`next\` before overwriting a pointer.
   \`\`\`java
   ListNode next = curr.next;  // SAVE first
   curr.next = prev;           // then redirect
   \`\`\`
2. **Not terminating lists:** After partitioning or copying, explicitly set the last
   node's \`next = null\` or you create a cycle.
3. **Off-by-one in slow/fast:** The loop condition determines which middle node you get
   for even-length lists. Test with a 4-node list.
4. **Forgetting dummy.next:** Return \`dummy.next\`, not \`head\` — head may have changed.

### Strategy for Linked List Problems
1. **Understand:** What transformation is needed? Draw before/after.
2. **Choose technique:** Reversal? Split + merge? Two pointers?
3. **Use dummy head** unless there's a reason not to.
4. **Implement** with careful pointer discipline.
5. **Trace** through a small example (3-4 nodes).
6. **Check edge cases** from the checklist above.

---

## ASCII Visual Diagrams

### Linked List Memory Layout

\`\`\`
Unlike arrays, nodes are scattered in memory:

  head
   ↓
┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐
│ val:1│    │ val:2│    │ val:3│    │ val:4│
│ next:─┼──→│ next:─┼──→│ next:─┼──→│ next:null│
└──────┘    └──────┘    └──────┘    └──────┘
 @0x200      @0x500      @0x100      @0x340

Nodes can be anywhere in memory — linked by pointers.
\`\`\`

### Reversal Step-by-Step

\`\`\`
Original:  1 → 2 → 3 → 4 → null
           prev=null, curr=1

Step 1:    null ← 1    2 → 3 → 4 → null
           prev=1, curr=2

Step 2:    null ← 1 ← 2    3 → 4 → null
           prev=2, curr=3

Step 3:    null ← 1 ← 2 ← 3    4 → null
           prev=3, curr=4

Step 4:    null ← 1 ← 2 ← 3 ← 4
           prev=4, curr=null → DONE, return prev
\`\`\`

### Slow/Fast Pointer (Finding Middle)

\`\`\`
List: 1 → 2 → 3 → 4 → 5 → null

Step 1:  S=1, F=1
Step 2:  S=2, F=3     (slow +1, fast +2)
Step 3:  S=3, F=5     (slow +1, fast +2)
Step 4:  F.next.next == null → STOP

Middle = node 3 ✓

Even-length: 1 → 2 → 3 → 4 → null
Step 1:  S=1, F=1
Step 2:  S=2, F=3     (slow +1, fast +2)
Step 3:  F.next.next == null → STOP

Middle = node 2 (first of two middle nodes)
\`\`\`

### Floyd's Cycle Detection

\`\`\`
List with cycle:

 1 → 2 → 3 → 4 → 5
              ↑       ↓
              8 ← 7 ← 6

Phase 1 — Detect cycle (slow moves 1, fast moves 2):
  Step 1: S=1, F=1
  Step 2: S=2, F=3
  Step 3: S=3, F=5
  Step 4: S=4, F=7
  Step 5: S=5, F=3   (fast looped)
  Step 6: S=6, F=5
  Step 7: S=7, F=7   ← MEET! Cycle exists.

Phase 2 — Find cycle start (both move 1 step):
  entry=1(head), slow=7
  Step 1: entry=2, slow=8
  Step 2: entry=3, slow=3  ← MEET! Cycle starts at node 3.
\`\`\`

### Dummy Head Pattern

\`\`\`
Without dummy head (complex):     With dummy head (clean):

  if list is empty...               dummy → 1 → 2 → 3
  if removing head...                ↑
  special case for first node        Always start from dummy
                                     Return dummy.next

Before: dummy → 1 → 2 → 3 → null    (remove val=1)
After:  dummy → 2 → 3 → null
Return: dummy.next = 2
\`\`\`

### Merge Two Sorted Lists

\`\`\`
l1: 1 → 3 → 5
l2: 2 → 4 → 6

dummy → ?

Step 1: Compare 1 vs 2 → pick 1.  dummy → 1
Step 2: Compare 3 vs 2 → pick 2.  dummy → 1 → 2
Step 3: Compare 3 vs 4 → pick 3.  dummy → 1 → 2 → 3
Step 4: Compare 5 vs 4 → pick 4.  dummy → 1 → 2 → 3 → 4
Step 5: Compare 5 vs 6 → pick 5.  dummy → 1 → 2 → 3 → 4 → 5
Step 6: l1 is null → append l2.   dummy → 1 → 2 → 3 → 4 → 5 → 6

Return dummy.next
\`\`\`

---

## Step-by-Step Algorithm Walkthroughs

### Reverse Nodes in k-Group (k=3)

\`\`\`
Input: 1 → 2 → 3 → 4 → 5 → null,  k=3

Check: 3 nodes exist? Yes (1,2,3)
Reverse group: 3 → 2 → 1 → (rest)
Result so far: 3 → 2 → 1 → 4 → 5 → null

Check: 3 nodes from node 4? No (only 4,5)
Don't reverse remaining.

Final: 3 → 2 → 1 → 4 → 5 → null
\`\`\`

### Palindrome Check Walkthrough

\`\`\`
Input: 1 → 2 → 2 → 1

Step 1: Find middle → node 2 (first)
Step 2: Reverse second half: 1 → 2 → 1 ← 2
        (second half becomes: 1 → 2 → null)
Step 3: Compare:
        p1=1, p2=1  → equal ✓
        p1=2, p2=2  → equal ✓
        p2=null      → DONE

Result: true (is palindrome)
Step 4: Restore list (good practice)
\`\`\`

---

## Additional Java Code Examples

### Remove Nth Node From End

\`\`\`java
// Two-pointer gap technique — O(n) time, O(1) space
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;

    // Advance fast n+1 steps ahead
    for (int i = 0; i <= n; i++) fast = fast.next;

    // Move both until fast reaches end
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}
\`\`\`

### Add Two Numbers (Linked List Digits)

\`\`\`java
// Numbers stored in reverse order — O(max(m,n)) time
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode curr = dummy;
    int carry = 0;

    while (l1 != null || l2 != null || carry > 0) {
        int sum = carry;
        if (l1 != null) { sum += l1.val; l1 = l1.next; }
        if (l2 != null) { sum += l2.val; l2 = l2.next; }
        curr.next = new ListNode(sum % 10);
        carry = sum / 10;
        curr = curr.next;
    }
    return dummy.next;
}
\`\`\`

### Swap Nodes in Pairs

\`\`\`java
// O(n) time, O(1) space
public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;

    while (prev.next != null && prev.next.next != null) {
        ListNode first = prev.next;
        ListNode second = prev.next.next;
        first.next = second.next;
        second.next = first;
        prev.next = second;
        prev = first;
    }
    return dummy.next;
}
\`\`\`

### Intersection of Two Linked Lists

\`\`\`java
// O(m+n) time, O(1) space
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode a = headA, b = headB;
    // When a reaches end, redirect to headB and vice versa
    // They will meet at intersection or both be null
    while (a != b) {
        a = (a == null) ? headB : a.next;
        b = (b == null) ? headA : b.next;
    }
    return a;
}
\`\`\`

---

## Comparison Tables

### Linked List Techniques at a Glance

| Technique | When to Use | Key Idea |
|---|---|---|
| Dummy head | Always (default) | Eliminates head edge cases |
| Slow/fast pointer | Find middle, detect cycle | Two speeds reveal structure |
| Reversal | Reorder, palindrome check | Re-point \\\`next\\\` pointers |
| Merge (sorted) | Combine sorted lists | Compare heads, pick smaller |
| Partition | Split by value | Two separate chains |
| Recursion | Reverse, merge, clone | Elegant but uses O(n) stack |

### ArrayList vs LinkedList Performance (Java)

| Operation | ArrayList | LinkedList |
|---|---|---|
| get(i) | O(1) | O(n) |
| add(end) | O(1) amortized | O(1) |
| add(0) / addFirst | O(n) | O(1) |
| remove(i) | O(n) | O(n) find + O(1) unlink |
| Iterator.remove() | O(n) | O(1) |
| Memory per element | ~4 bytes | ~24 bytes (node overhead) |
| Cache locality | Excellent | Poor |
| **Verdict** | **Default choice** | **Deque ops only** |

---

## ⚠️ Common Mistakes (Extended)

1. **Losing the next pointer:** Always save \\\`curr.next\\\` before modifying \\\`curr.next\\\`.
2. **Creating a cycle by accident:** After partitioning, set the last node's \\\`next = null\\\`.
3. **Off-by-one in slow/fast:** Test with 1, 2, 3, and 4-node lists to verify.
4. **Returning \\\`head\\\` instead of \\\`dummy.next\\\`:** The original head may no longer be first.
5. **Not handling null head:** Always check \\\`if (head == null)\\\` first.
6. **Stack overflow with recursion:** Deep lists (>10K nodes) overflow the call stack. Use iterative.
7. **Comparing nodes with \\\`==\\\` vs \\\`.val\\\`:** \\\`==\\\` compares references (same node object); \\\`.val\\\` compares values.

---

## 💡 Interview Tips (Extended)

- **Always draw the list** on whiteboard/paper before coding. Visualize pointer changes.
- **Use a dummy head by default** — it handles edge cases for free.
- **Name your pointers clearly:** \\\`prev\\\`, \\\`curr\\\`, \\\`next\\\`, \\\`slow\\\`, \\\`fast\\\`.
- **Test with 0, 1, and 2 nodes** — most bugs appear in tiny cases.
- **Mention time AND space complexity** — linked list solutions often have elegant O(1) space.
- **Know when NOT to use linked lists:** In real code, \\\`ArrayList\\\` almost always wins.

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Technique |
|---|---|
| "Reverse a linked list" or portion | In-place reversal |
| "Detect cycle", "find loop" | Floyd's slow/fast |
| "Find middle node" | Slow/fast pointer |
| "Merge sorted lists" | Two-pointer merge + dummy |
| "Kth from end", "Nth from end" | Two-pointer gap technique |
| "Palindrome linked list" | Find middle + reverse half |
| "Intersection of two lists" | Two-pointer length trick |
| "Flatten / deep copy with random" | HashMap or interleaving |
| "Remove duplicates" | Two pointers or set |
| "Reorder list" (L0→Ln→L1→Ln-1) | Middle + reverse + merge |

### Decision Tree

\`\`\`
Linked list problem?
├── Involves cycle?
│   ├── Detect → Floyd's slow/fast
│   └── Find start → Floyd's phase 2
├── Involves ordering/sorting?
│   ├── Merge sorted → Two-pointer merge
│   └── Sort list → Merge sort (split + merge)
├── Involves reversal?
│   ├── Full reverse → Iterative (prev/curr/next)
│   ├── Partial reverse → Reverse between positions
│   └── k-group reverse → Count + reverse groups
├── Involves position?
│   ├── Middle → Slow/fast pointer
│   ├── Kth from end → Two-pointer gap
│   └── Intersection → Two-pointer redirect
└── Design problem?
    ├── LRU cache → Doubly linked list + HashMap
    └── Flatten list → Recursion or iteration
\`\`\`
`,
  },
  {
    slug: 'stacks-and-queues',
    title: 'Stacks & Queues',
    icon: 'StackIcon',
    description: 'Leverage LIFO and FIFO structures for expression parsing, monotonic patterns, and design problems.',
    color: 'purple',
    content: `# Stacks and Queues — Comprehensive Guide

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
| \`Stack\` | \`Vector\` (array) | Yes (synchronized) | ❌ Legacy — avoid |
| \`ArrayDeque\` | Resizable array | No | ✅ Preferred for stack |
| \`LinkedList\` | Doubly linked list | No | Acceptable but slower |

\`\`\`java
// Preferred stack usage in Java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);        // push onto top
stack.push(2);
int top = stack.peek(); // 2, doesn't remove
int val = stack.pop();  // 2, removes
boolean empty = stack.isEmpty();
\`\`\`

**Why \`ArrayDeque\` over \`Stack\`?** \`Stack\` extends \`Vector\`, which synchronizes every
operation (unnecessary overhead). \`ArrayDeque\` is faster and more memory-efficient due to
array-based storage with cache locality.

---

## Queue Fundamentals

### FIFO Principle
First-In, First-Out. Like a real-world queue — first person in line gets served first.

### Java Implementation Choices

| Class | Backing | Best for |
|---|---|---|
| \`ArrayDeque\` | Circular array | ✅ General-purpose queue |
| \`LinkedList\` | Doubly linked list | When you also need list operations |
| \`PriorityQueue\` | Binary heap | Priority-based processing |

\`\`\`java
// Preferred queue usage in Java
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1);       // enqueue (returns false if capacity-restricted and full)
queue.offer(2);
int front = queue.peek(); // 1, doesn't remove
int val = queue.poll();   // 1, removes
\`\`\`

**\`ArrayDeque\` vs \`LinkedList\` as a Queue:**
- \`ArrayDeque\` is faster in practice (contiguous memory, fewer allocations)
- \`ArrayDeque\` does not allow \`null\` elements; \`LinkedList\` does
- \`ArrayDeque\` allocates less memory (no node objects)
- Prefer \`ArrayDeque\` unless you specifically need null values or \`List\` interface

---

## Monotonic Stack

### Concept
A stack that maintains elements in **monotonically increasing or decreasing** order. When a
new element would violate the ordering, pop elements until the invariant is restored.

**When to use:** Finding the **next greater/smaller element** for each position, or problems
involving "how far can I extend left/right before finding a larger/smaller value."

### Next Greater Element

\`\`\`java
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
\`\`\`

**How it works:** The stack holds indices of elements waiting for their "next greater." When
we encounter a larger element, it is the answer for all smaller elements on the stack.

### Next Smaller Element

\`\`\`java
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
\`\`\`

### Previous Greater / Smaller
Same idea, but look **left**. Scan left-to-right, and the answer is what's currently on the
stack top after popping.

---

## Monotonic Queue

### Sliding Window Maximum

Maintain a deque where elements are in **decreasing order**. The front of the deque is always
the maximum of the current window.

\`\`\`java
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
\`\`\`

**Why it works:** Elements that are smaller than a newer element can never be the window
maximum, so they are safely discarded. Each element is added and removed at most once → O(n).

---

## Priority Queue (Heap)

### Java PriorityQueue

Java's \`PriorityQueue\` is a **min-heap** by default.

\`\`\`java
// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Custom comparator — sort by frequency, then alphabetically
PriorityQueue<String> pq = new PriorityQueue<>((a, b) -> {
    int freqCompare = freq.get(b) - freq.get(a);
    return freqCompare != 0 ? freqCompare : a.compareTo(b);
});
\`\`\`

### Operations and Complexity

| Operation | Time | Notes |
|---|---|---|
| \`offer(e)\` / \`add(e)\` | O(log n) | Insert + sift up |
| \`poll()\` | O(log n) | Remove min/max + sift down |
| \`peek()\` | O(1) | View min/max without removing |
| \`remove(Object)\` | O(n) | Linear scan + O(log n) sift |
| \`contains(Object)\` | O(n) | Linear scan |
| Build from collection | O(n) | Floyd's heapify |

### Top K Elements Pattern

\`\`\`java
// Find k largest elements — O(n log k) time, O(k) space
public int[] topKLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.stream().mapToInt(Integer::intValue).toArray();
}
\`\`\`

**Key insight:** Use a min-heap of size k to find the k largest. Use a max-heap of size k
to find the k smallest. The "opposite" heap ejects the least relevant element.

### K-Way Merge

\`\`\`java
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
\`\`\`

---

## Deque

### Double-Ended Queue

Supports insertion and removal at **both** ends in O(1).

\`\`\`java
Deque<Integer> deque = new ArrayDeque<>();
deque.offerFirst(1);   // add to front
deque.offerLast(2);    // add to back
deque.peekFirst();     // view front
deque.peekLast();      // view back
deque.pollFirst();     // remove from front
deque.pollLast();      // remove from back
\`\`\`

**Using Deque as both Stack and Queue:**
- **As Stack:** \`push()\` / \`pop()\` / \`peek()\` — all operate on the front
- **As Queue:** \`offerLast()\` to enqueue, \`pollFirst()\` to dequeue

---

## Common Patterns

### Expression Evaluation

\`\`\`java
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
\`\`\`

### Bracket Matching

\`\`\`java
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
\`\`\`

### Largest Rectangle in Histogram

Classic monotonic stack problem.

\`\`\`java
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
\`\`\`

---

## Design Problems

### Min Stack — O(1) getMin

\`\`\`java
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
\`\`\`

**Note:** Use \`.equals()\` for \`Integer\` comparison, not \`==\`, to avoid boxing cache issues
for values outside [-128, 127].

### Queue Using Two Stacks

Amortized O(1) per operation.

\`\`\`java
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
\`\`\`

**Amortized analysis:** Each element is moved from \`inStack\` to \`outStack\` exactly once.
Over n operations, total moves = n → O(1) amortized per operation.

### Circular Queue

\`\`\`java
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
\`\`\`

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

\\* Amortized — occasional O(n) resize for array-backed implementations.
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
1. Using \`Stack\` class instead of \`ArrayDeque\`
2. \`==\` vs \`.equals()\` for \`Integer\` wrapper comparisons
3. Forgetting to handle the case when stack/queue is empty before \`peek()\`/\`pop()\`
4. Off-by-one in sliding window boundaries
5. Not considering that \`PriorityQueue\` iteration order is **NOT** sorted — only
   \`poll()\` gives elements in heap order

---

## ASCII Visual Diagrams

### Stack Operations (LIFO)

\`\`\`
push(1), push(2), push(3), pop(), push(4)

 push(1)  push(2)  push(3)  pop()→3  push(4)
                   ┌───┐
          ┌───┐   │ 3 │   ┌───┐    ┌───┐
 ┌───┐   │ 2 │   │ 2 │   │ 2 │    │ 4 │
 │ 1 │   │ 1 │   │ 1 │   │ 1 │    │ 2 │
 └───┘   └───┘   └───┘   └───┘    │ 1 │
                                    └───┘
\`\`\`

### Queue Operations (FIFO)

\`\`\`
offer(1), offer(2), offer(3), poll()→1, offer(4)

 Front                    Back
  ↓                        ↓
 [1]
 [1, 2]
 [1, 2, 3]
 [2, 3]           ← poll returns 1
 [2, 3, 4]        ← offer adds 4 at back
\`\`\`

### Monotonic Stack — Next Greater Element

\`\`\`
nums = [2, 1, 4, 3, 5]

Process:    Stack (bottom→top)    Result
i=0, 2:    [2]                   [_, _, _, _, _]
i=1, 1:    [2, 1]                [_, _, _, _, _]    (1 < 2, push)
i=2, 4:    pop 1 → ans[1]=4     [_, 4, _, _, _]
            pop 2 → ans[0]=4     [4, 4, _, _, _]
            push 4 → [4]
i=3, 3:    [4, 3]                [4, 4, _, _, _]    (3 < 4, push)
i=4, 5:    pop 3 → ans[3]=5     [4, 4, _, 5, _]
            pop 4 → ans[2]=5     [4, 4, 5, 5, _]
            push 5 → [5]
Remaining: ans[4]=-1             [4, 4, 5, 5, -1]

Final: [4, 4, 5, 5, -1]
\`\`\`

### Monotonic Deque — Sliding Window Maximum

\`\`\`
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k=3

i=0: deque=[0]          (add 1)
i=1: deque=[1]          (3>1, remove 0, add 1)
i=2: deque=[1, 2]       (-1<3, add 2)     → max=nums[1]=3
i=3: deque=[1, 2, 3]    (-3<-1, add 3)    → max=nums[1]=3
i=4: deque=[4]           (remove 1,2,3 < 5, add 4) → max=nums[4]=5
i=5: deque=[4, 5]       (3<5, add 5)      → max=nums[4]=5
i=6: deque=[6]           (remove 4,5 < 6, add 6)   → max=nums[6]=6
i=7: deque=[7]           (remove 6 < 7, add 7)     → max=nums[7]=7

Result: [3, 3, 5, 5, 6, 7]
\`\`\`

### Largest Rectangle in Histogram

\`\`\`
heights = [2, 1, 5, 6, 2, 3]

Stack tracks indices of increasing heights:

i=0: push 0   stack=[0]       heights: 2
i=1: 1<2, pop 0 → area=2×1=2  stack=[]
     push 1    stack=[1]       heights: 1
i=2: push 2   stack=[1,2]     heights: 1,5
i=3: push 3   stack=[1,2,3]   heights: 1,5,6
i=4: 2<6, pop 3 → h=6, w=4-2-1=1, area=6
     2<5, pop 2 → h=5, w=4-1-1=2, area=10 ← MAX
     push 4    stack=[1,4]
i=5: push 5   stack=[1,4,5]
i=6 (sentinel 0):
     pop 5 → h=3, w=6-4-1=1, area=3
     pop 4 → h=2, w=6-1-1=4, area=8
     pop 1 → h=1, w=6, area=6

Answer: 10
\`\`\`

### Min Stack Visualization

\`\`\`
Operations: push(5), push(3), push(7), push(2), pop(), getMin()

  Main Stack    Min Stack
  ┌───┐         ┌───┐
  │ 2 │         │ 2 │    ← current min
  │ 7 │         │ 3 │
  │ 3 │         │ 3 │
  │ 5 │         │ 5 │
  └───┘         └───┘

After pop():
  Main Stack    Min Stack
  ┌───┐         ┌───┐
  │ 7 │         │ 3 │    ← current min = 3
  │ 3 │         │ 3 │
  │ 5 │         │ 5 │
  └───┘         └───┘
\`\`\`

---

## Step-by-Step Walkthroughs

### Valid Parentheses Walkthrough

\`\`\`
Input: "({[]})"

i=0, '(': push '('       stack: ['(']
i=1, '{': push '{'       stack: ['(', '{']
i=2, '[': push '['       stack: ['(', '{', '[']
i=3, ']': pop → '[',     match? ']' matches '['  ✓   stack: ['(', '{']
i=4, '}': pop → '{',     match? '}' matches '{'  ✓   stack: ['(']
i=5, ')': pop → '(',     match? ')' matches '('  ✓   stack: []

Stack empty? YES → Valid!

Input: "([)]"

i=0, '(': push '('       stack: ['(']
i=1, '[': push '['       stack: ['(', '[']
i=2, ')': pop → '[',     match? ')' matches '['?  ✗ → Invalid!
\`\`\`

### Queue from Two Stacks Walkthrough

\`\`\`
Operations: push(1), push(2), push(3), pop(), push(4), pop()

push(1): inStack=[1], outStack=[]
push(2): inStack=[1,2], outStack=[]
push(3): inStack=[1,2,3], outStack=[]

pop():
  outStack empty → transfer: inStack→outStack
  inStack=[], outStack=[3,2,1]
  pop outStack → returns 1    outStack=[3,2]

push(4): inStack=[4], outStack=[3,2]

pop():
  outStack not empty → pop directly
  returns 2    outStack=[3]
\`\`\`

---

## Additional Java Code Examples

### Decode String (Stack-based)

\`\`\`java
// "3[a2[c]]" → "accaccacc" — O(n) time
public String decodeString(String s) {
    Deque<Integer> countStack = new ArrayDeque<>();
    Deque<StringBuilder> strStack = new ArrayDeque<>();
    StringBuilder curr = new StringBuilder();
    int k = 0;

    for (char c : s.toCharArray()) {
        if (Character.isDigit(c)) {
            k = k * 10 + (c - '0');
        } else if (c == '[') {
            countStack.push(k);
            strStack.push(curr);
            curr = new StringBuilder();
            k = 0;
        } else if (c == ']') {
            int count = countStack.pop();
            StringBuilder decoded = strStack.pop();
            for (int i = 0; i < count; i++) decoded.append(curr);
            curr = decoded;
        } else {
            curr.append(c);
        }
    }
    return curr.toString();
}
\`\`\`

### Daily Temperatures (Monotonic Stack)

\`\`\`java
// For each day, find how many days until warmer — O(n)
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
            int prev = stack.pop();
            result[prev] = i - prev;
        }
        stack.push(i);
    }
    return result;
}
\`\`\`

### Evaluate Reverse Polish Notation

\`\`\`java
// O(n) time, O(n) space
public int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String token : tokens) {
        switch (token) {
            case "+": stack.push(stack.pop() + stack.pop()); break;
            case "-": int b = stack.pop(), a = stack.pop();
                      stack.push(a - b); break;
            case "*": stack.push(stack.pop() * stack.pop()); break;
            case "/": int d = stack.pop(), c = stack.pop();
                      stack.push(c / d); break;
            default:  stack.push(Integer.parseInt(token));
        }
    }
    return stack.pop();
}
\`\`\`

### Implement Stack Using Queues

\`\`\`java
class MyStack {
    Queue<Integer> queue = new ArrayDeque<>();

    public void push(int x) {
        queue.offer(x);
        // Rotate so the newest element is at front
        for (int i = 0; i < queue.size() - 1; i++) {
            queue.offer(queue.poll());
        }
    }

    public int pop() { return queue.poll(); }
    public int top() { return queue.peek(); }
    public boolean empty() { return queue.isEmpty(); }
}
\`\`\`

---

## Comparison Tables

### Stack vs Queue vs Deque

| Feature | Stack | Queue | Deque |
|---|---|---|---|
| Order | LIFO | FIFO | Both ends |
| Java class | ArrayDeque | ArrayDeque | ArrayDeque |
| Add | push() | offer() | offerFirst/Last() |
| Remove | pop() | poll() | pollFirst/Last() |
| View | peek() | peek() | peekFirst/Last() |
| Use case | Parsing, undo | BFS, scheduling | Sliding window |

### When to Use Each Structure

| Problem Type | Data Structure | Why |
|---|---|---|
| Matching brackets | Stack | LIFO matches nested pairs |
| Expression evaluation | Stack (or two) | Operators/operands in order |
| Next greater/smaller | Monotonic stack | Maintains ordering invariant |
| Sliding window max/min | Monotonic deque | O(1) access to extremes |
| BFS / level-order | Queue | FIFO processes by level |
| Top-K streaming | Priority queue | Always access min/max |
| Undo/redo | Two stacks | One for undo, one for redo |
| Task scheduling | Queue or PQ | FIFO or priority ordering |

---

## ⚠️ Common Mistakes (Extended)

1. **Using \`Stack\` class:** Use \`ArrayDeque\` instead — \`Stack\` is legacy and synchronized.
2. **\`==\` for Integer comparison:** Fails for values outside [-128, 127]. Always use \`.equals()\`.
3. **Empty check before pop/peek:** Always guard with \`!stack.isEmpty()\`.
4. **Wrong monotonic direction:** For "next greater" use increasing stack; for "next smaller" use decreasing.
5. **Off-by-one in sliding window:** Deque stores indices; check \`deque.peekFirst() < i - k + 1\` for expiry.
6. **PriorityQueue iteration ≠ sorted order:** Only \`poll()\` extracts in priority order.
7. **Forgetting the sentinel in histogram:** Add height 0 at the end to flush remaining stack elements.

---

## 💡 Interview Tips (Extended)

- **Monotonic stack = O(n):** Each element pushed/popped at most once across the entire pass.
- **Two stacks = queue:** Amortized O(1) per operation. Explain the amortization clearly.
- **Draw the stack state** at each step when debugging — most bugs are from wrong push/pop order.
- **For expression parsing:** Consider operator precedence. Two stacks: one for numbers, one for operators.
- **Min stack trick:** Store (value, currentMin) pairs to avoid a second stack.

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Data Structure |
|---|---|
| "Valid parentheses", "matching brackets" | Stack |
| "Next greater/smaller element" | Monotonic stack |
| "Largest rectangle", "trapping rain water" | Monotonic stack |
| "Sliding window maximum/minimum" | Monotonic deque |
| "Expression evaluation", "calculator" | Stack(s) |
| "Decode string", "nested structure" | Stack |
| "BFS", "level-order traversal" | Queue |
| "Implement queue/stack using other" | Design with constraints |
| "Min/Max in O(1)" | Augmented stack |
| "Undo / Back button" | Stack |
| "Task scheduler", "CPU scheduling" | Queue or priority queue |

### Decision Tree

\`\`\`
Problem involves processing order?
├── LIFO (last in, first out)?
│   ├── Nested/matching pairs → Stack
│   ├── Next greater/smaller → Monotonic Stack
│   └── Expression parsing → Stack(s)
├── FIFO (first in, first out)?
│   ├── Level-by-level → Queue (BFS)
│   ├── Process in arrival order → Queue
│   └── Bounded buffer → Circular Queue
├── Both ends?
│   ├── Sliding window extremes → Monotonic Deque
│   └── Double-ended operations → Deque
└── Priority-based?
    ├── Top-K → Heap (PriorityQueue)
    ├── Merge K sorted → Min-heap
    └── Median → Two heaps
\`\`\`
`,
  },
  {
    slug: 'trees-and-bst',
    title: 'Trees & BST',
    icon: 'TreePine',
    description: 'Traverse and manipulate binary trees, BSTs, segment trees, and Fenwick trees with confidence.',
    color: 'green',
    content: `# Trees and Binary Search Trees — Comprehensive Guide

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

\`\`\`java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}
\`\`\`

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
- A binary tree with \`n\` nodes has exactly \`n − 1\` edges.
- Maximum nodes at level \`k\`: \`2^k\`
- Maximum nodes in a tree of height \`h\`: \`2^(h+1) − 1\`
- Minimum height of a tree with \`n\` nodes: \`⌊log₂n⌋\`

---

## Tree Traversals

### Recursive Traversals

\`\`\`java
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
\`\`\`

### Iterative Traversals

\`\`\`java
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
\`\`\`

### Level-Order Traversal (BFS)

\`\`\`java
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
\`\`\`

---

## Morris Traversal

Achieves **O(1) space** (no stack, no recursion) by temporarily modifying the tree structure
using **threaded binary tree** links.

### Morris Inorder

\`\`\`java
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
\`\`\`

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

\`\`\`java
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
\`\`\`

### Validation

\`\`\`java
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
\`\`\`

**Common mistake:** Using \`int\` for bounds fails when node values are \`Integer.MIN_VALUE\` or
\`Integer.MAX_VALUE\`. Use \`long\` or pass \`TreeNode\` references as bounds.

---

## Balanced BSTs

### AVL Trees

Self-balancing BST where for every node, the height difference between left and right
subtrees (the **balance factor**) is at most 1.

**Rotations:**

\`\`\`java
// Right rotation (for left-heavy imbalance)
//     y           x
//    / \\         / \\
//   x   C  →   A   y
//  / \\             / \\
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
\`\`\`

**Four imbalance cases:**
1. **Left-Left:** Single right rotation
2. **Right-Right:** Single left rotation
3. **Left-Right:** Left rotate left child, then right rotate node
4. **Right-Left:** Right rotate right child, then left rotate node

### Red-Black Trees (Conceptual)

Java's \`TreeMap\` and \`TreeSet\` use Red-Black trees internally. Key properties:
- Every node is red or black
- Root is black
- No two consecutive red nodes
- Every path from root to null has the same number of black nodes
- **Guarantees:** O(log n) search, insert, delete
- **Advantage over AVL:** Fewer rotations on insert/delete (at most 2 vs O(log n))

\`\`\`java
// Java TreeMap — Red-Black tree backed sorted map
TreeMap<Integer, String> map = new TreeMap<>();
map.put(5, "five");
map.firstKey();                // smallest key
map.lastKey();                 // largest key
map.floorKey(4);               // largest key ≤ 4
map.ceilingKey(4);             // smallest key ≥ 4
map.subMap(2, true, 8, false); // keys in [2, 8)
\`\`\`

---

## Segment Trees

For **range queries and point/range updates** on an array.

\`\`\`java
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
\`\`\`

**When to use:** When you need both range queries (sum, min, max) AND updates on the same
array. If only queries without updates, prefix sums suffice.

---

## Binary Indexed Tree (Fenwick Tree)

Simpler and more memory-efficient than Segment Tree for **prefix sum queries + point updates**.

\`\`\`java
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
\`\`\`

**\`i & (-i)\` extracts the lowest set bit** — this determines which range of the array each
tree node is responsible for. The tree requires only \`n+1\` space vs \`4n\` for segment tree.

---

## Common Patterns

### Lowest Common Ancestor (LCA)

\`\`\`java
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
\`\`\`

### Path Sum Variants

\`\`\`java
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
\`\`\`

### Serialization / Deserialization

\`\`\`java
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
\`\`\`

### Construct Tree from Traversals

\`\`\`java
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
\`\`\`

### Top-Down vs Bottom-Up Recursion

**Top-Down (preorder style):** Pass information DOWN via parameters.
\`\`\`java
// Maximum depth — top-down
public void maxDepth(TreeNode node, int depth, int[] maxRef) {
    if (node == null) return;
    maxRef[0] = Math.max(maxRef[0], depth);
    maxDepth(node.left, depth + 1, maxRef);
    maxDepth(node.right, depth + 1, maxRef);
}
\`\`\`

**Bottom-Up (postorder style):** Compute results from children, combine upward. Generally
more natural for tree problems.
\`\`\`java
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
\`\`\`

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
- **Integer overflow** (sum of path values may exceed \`int\`)

### Problem-Solving Framework
1. **Identify the traversal:** Does the problem need top-down info (preorder)? Bottom-up
   computation (postorder)? Level-by-level (BFS)?
2. **Define the recursive function:** What does it return? What parameters does it need?
3. **Base case:** Usually \`if (root == null) return ...\`
4. **Recursive case:** Process current node, combine results from left/right.
5. **Global state:** Some problems need a global variable (diameter, max path sum).

### Common Mistakes
1. **Confusing height and depth** — height is bottom-up, depth is top-down
2. **Not passing bounds correctly** in BST validation
3. **Forgetting to backtrack** in path problems that use maps/sets
4. **Modifying tree structure** unintentionally (threads in Morris, pointer swaps)
5. **Assuming balanced** — worst case BST height is O(n), not O(log n)

---

## ASCII Visual Diagrams

### Binary Tree Structure

\`\`\`
Complete Binary Tree:            Skewed (Degenerate) Tree:

         [10]                         [1]
        /    \\                          \\
      [5]    [15]                       [2]
     /  \\   /   \\                        \\
   [3]  [7][12] [20]                    [3]
                                          \\
Height = 2, Nodes = 7                   [4]
Perfect binary tree                       \\
                                         [5]
                                    Height = 4, Nodes = 5
                                    Essentially a linked list
\`\`\`

### BST Property Visualization

\`\`\`
Valid BST:                    INVALID BST:

       [8]                         [8]
      /   \\                       /   \\
    [3]   [10]                  [3]   [10]
   /  \\      \\                 /  \\      \\
  [1] [6]   [14]              [1] [9]   [14]
     / \\    /                     ↑
    [4][7] [13]              9 > 8 but in LEFT subtree!

All left subtree values < root < all right subtree values
\`\`\`

### Tree Traversal Orders

\`\`\`
         [1]
        /   \\
      [2]   [3]
     /  \\
   [4]  [5]

Inorder   (L→Root→R):  4, 2, 5, 1, 3    ← sorted for BST
Preorder  (Root→L→R):  1, 2, 4, 5, 3    ← root always first
Postorder (L→R→Root):  4, 5, 2, 3, 1    ← root always last
Level-order (BFS):     1, 2, 3, 4, 5    ← top to bottom
\`\`\`

### BST Inorder = Sorted

\`\`\`
BST:            Inorder traversal:
     [5]
    /   \\       Visit left → root → right:
  [3]   [8]     1 → 3 → 4 → 5 → 7 → 8 → 10
 / \\   / \\
[1][4][7][10]   Result: [1, 3, 4, 5, 7, 8, 10]  ← SORTED!
\`\`\`

### Level-Order BFS with Queue

\`\`\`
         [3]           Queue processing:
        /   \\
      [9]   [20]       Start: queue = [3]
           /    \\      Level 0: process 3, add 9,20 → queue = [9,20]
         [15]   [7]    Level 1: process 9,20, add 15,7 → queue = [15,7]
                       Level 2: process 15,7

Result: [[3], [9, 20], [15, 7]]
\`\`\`

### AVL Rotation — Right Rotation

\`\`\`
Before (left-heavy):        After right rotation:

        [30]                     [20]
       /                        /    \\
     [20]                    [10]    [30]
    /    \\                          /
  [10]   [25]                    [25]

Balance factor at 30: 2 (left heavy)
→ Single right rotation fixes it
\`\`\`

### BST Delete Cases

\`\`\`
Case 1: Leaf node (no children) → just remove it
Case 2: One child → replace node with its child
Case 3: Two children → replace with inorder successor

Delete 5 (two children):
       [5]              Find successor (6):    Replace:
      /   \\             smallest in right       [6]
    [3]   [8]           subtree = 6            /   \\
         /                                   [3]   [8]
       [6]                                        /
         \\                                      [7]
         [7]
\`\`\`

---

## Step-by-Step Walkthroughs

### LCA (Lowest Common Ancestor) in Binary Tree

\`\`\`
Find LCA of 4 and 7:

         [3]
        /   \\
      [5]   [1]
     /  \\   / \\
   [6] [2][0] [8]
       / \\
      [7][4]

Recursion trace:
  lca(3, 4, 7):
    left = lca(5, 4, 7):
      left = lca(6, 4, 7) → null
      right = lca(2, 4, 7):
        left = lca(7, 4, 7) → 7 (found q!)
        right = lca(4, 4, 7) → 4 (found p!)
        both non-null → return 2    ← LCA is 2
      left=null, right=2 → return 2
    right = lca(1, 4, 7) → null
    left=2, right=null → return 2

Answer: node 2
\`\`\`

### Validate BST Walkthrough

\`\`\`
Tree:
       [5]
      /   \\
    [1]   [6]
         /   \\
       [3]   [7]

validate(5, -∞, +∞): 5 in (-∞, +∞)? ✓
  validate(1, -∞, 5): 1 in (-∞, 5)? ✓
  validate(6, 5, +∞): 6 in (5, +∞)? ✓
    validate(3, 5, 6): 3 in (5, 6)? ✗ → INVALID!

3 is in right subtree of 5, so must be > 5, but 3 < 5.
\`\`\`

---

## Additional Java Code Examples

### Right Side View of Binary Tree

\`\`\`java
// BFS — take last node of each level — O(n) time
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);

    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (i == size - 1) result.add(node.val); // rightmost at this level
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return result;
}
\`\`\`

### Zigzag Level Order Traversal

\`\`\`java
// O(n) time, O(w) space
public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;

    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    boolean leftToRight = true;

    while (!queue.isEmpty()) {
        int size = queue.size();
        LinkedList<Integer> level = new LinkedList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (leftToRight) level.addLast(node.val);
            else level.addFirst(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
        leftToRight = !leftToRight;
    }
    return result;
}
\`\`\`

### Flatten Binary Tree to Linked List

\`\`\`java
// In-place, preorder — O(n) time, O(1) space (Morris-style)
public void flatten(TreeNode root) {
    TreeNode curr = root;
    while (curr != null) {
        if (curr.left != null) {
            // Find rightmost node in left subtree
            TreeNode pred = curr.left;
            while (pred.right != null) pred = pred.right;
            pred.right = curr.right;
            curr.right = curr.left;
            curr.left = null;
        }
        curr = curr.right;
    }
}
\`\`\`

### Kth Smallest Element in BST

\`\`\`java
// Inorder traversal stops at kth — O(H + k) time
public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;

    while (curr != null || !stack.isEmpty()) {
        while (curr != null) {
            stack.push(curr);
            curr = curr.left;
        }
        curr = stack.pop();
        if (--k == 0) return curr.val;
        curr = curr.right;
    }
    return -1; // shouldn't reach here
}
\`\`\`

### Symmetric Tree Check

\`\`\`java
// O(n) time, O(h) space
public boolean isSymmetric(TreeNode root) {
    return root == null || isMirror(root.left, root.right);
}

private boolean isMirror(TreeNode t1, TreeNode t2) {
    if (t1 == null && t2 == null) return true;
    if (t1 == null || t2 == null) return false;
    return t1.val == t2.val
        && isMirror(t1.left, t2.right)
        && isMirror(t1.right, t2.left);
}
\`\`\`

---

## Comparison Tables

### Top-Down vs Bottom-Up Recursion

| Aspect | Top-Down (Preorder) | Bottom-Up (Postorder) |
|---|---|---|
| Direction | Pass info DOWN via params | Compute results UP from children |
| When to use | Need ancestor info at each node | Need subtree info at each node |
| Example | Max depth (pass current depth) | Max depth (return height) |
| Example | Path sum (pass remaining sum) | Diameter (return heights, track max) |
| Pros | Intuitive, like DFS | Cleaner, composes naturally |
| Cons | May need global state | Need to combine child results |

### Tree Problem Categories

| Category | Problems | Approach |
|---|---|---|
| Traversal | Level order, zigzag, boundary | BFS or modified DFS |
| Path | Path sum, max path sum, diameter | Bottom-up DFS |
| Construction | Build from traversals, serialize | Recursive divide & conquer |
| BST-specific | Validate, kth smallest, LCA | Inorder property |
| Modification | Invert, flatten, prune | Top-down or bottom-up |
| Ancestor | LCA, distance between nodes | Recursive search |

### Segment Tree vs Fenwick Tree

| Feature | Segment Tree | Fenwick Tree (BIT) |
|---|---|---|
| Space | O(4n) | O(n) |
| Build | O(n) | O(n log n) |
| Point update | O(log n) | O(log n) |
| Range query | O(log n) | O(log n) |
| Range update | O(log n) with lazy | Complex |
| Implementation | More complex | Very concise |
| Flexibility | Sum, min, max, GCD | Primarily sum |
| When to use | Need range updates or non-sum queries | Prefix sum + point update |

---

## ⚠️ Common Mistakes (Extended)

1. **Not handling null root:** First line should be \\\`if (root == null)\\\`.
2. **Confusing height and depth:** Height goes up (leaves=0), depth goes down (root=0).
3. **BST validation with wrong bounds:** Must use \\\`long\\\` for bounds or \\\`TreeNode\\\` references.
4. **Forgetting to backtrack:** In path-sum-with-map problems, undo map changes after recursion.
5. **Assuming balanced:** Worst-case BST is O(n) height, not O(log n).
6. **Modifying tree during traversal:** Morris threading is intentional; accidental modification causes bugs.
7. **Wrong parent pointer in LCA:** Binary tree LCA ≠ BST LCA (different algorithms).
8. **Off-by-one in level-order:** Process \\\`queue.size()\\\` nodes per level (save size before loop).

---

## 💡 Interview Tips (Extended)

- **Ask: "Is it a BST or general binary tree?"** — BST allows O(log n) approaches.
- **Start with the recursive solution** — it's almost always cleaner and expected.
- **State the recursive function contract clearly:** "This function returns the height of the subtree."
- **Use a global variable** for diameter/max-path-sum problems where you need to track a running max.
- **Mention Morris traversal** for extra credit, but implement stack-based first.
- **For BST problems, think "inorder = sorted"** — this unlocks many solutions.

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Technique |
|---|---|
| "Level order", "by level" | BFS with queue |
| "Max depth", "height" | Bottom-up recursion |
| "Path sum", "root to leaf" | Top-down DFS |
| "Max path sum" (any path) | Bottom-up + global max |
| "Validate BST" | Inorder or min/max bounds |
| "Kth smallest in BST" | Inorder traversal |
| "Serialize / deserialize" | Preorder + null markers |
| "Lowest common ancestor" | Recursive search |
| "Invert / mirror tree" | Recursive swap |
| "Right side view" | BFS, take last per level |
| "Range sum with updates" | Segment tree or BIT |
| "Construct from traversals" | Preorder(root) + inorder(split) |

### Decision Tree

\`\`\`
Tree problem?
├── Need level-by-level info?
│   └── BFS (Queue)
├── Need subtree computation?
│   └── Bottom-up DFS (postorder)
├── Need ancestor info at each node?
│   └── Top-down DFS (preorder)
├── BST-specific?
│   ├── Search/insert/delete → O(h) BST traversal
│   ├── Kth element → Inorder
│   └── Validate → Min/max bounds
├── Range queries + updates?
│   ├── Sum only → Fenwick Tree
│   └── Min/max/sum → Segment Tree
└── Construction?
    ├── From preorder + inorder → Recursive build
    └── Serialize/deserialize → Preorder + markers
\`\`\`
`,
  },
  {
    slug: 'heaps-and-priority-queues',
    title: 'Heaps & Priority Queues',
    icon: 'ArrowUpDown',
    description: 'Use heap-based structures for top-K problems, median finding, and efficient merge operations.',
    color: 'orange',
    content: `# Heaps and Priority Queues

## 1. Heap Fundamentals

A **heap** is a complete binary tree stored as an array that satisfies the heap property.

| Type | Property |
|------|----------|
| **Min-Heap** | Parent ≤ children — smallest element at root |
| **Max-Heap** | Parent ≥ children — largest element at root |

### Array Representation

For a node at index \`i\` (0-based):
- **Parent**: \`(i - 1) / 2\`
- **Left child**: \`2 * i + 1\`
- **Right child**: \`2 * i + 2\`

\`\`\`
Min-Heap:        Array: [1, 3, 5, 7, 9, 8]
       1
      / \\         Index:  0  1  2  3  4  5
     3   5
    / \\ /
   7  9 8
\`\`\`

No pointers needed — the tree structure is implicit in the array indices.

### Heapify (Sift Down)

Restores heap property for a subtree rooted at index \`i\` by pushing the node down.

\`\`\`java
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
\`\`\`

---

## 2. Heap Operations

### Insert (Sift Up)

Add element at end, then bubble up to restore heap property.

\`\`\`java
public void insert(int val) {
    heap.add(val);
    int i = heap.size() - 1;
    while (i > 0 && heap.get(parent(i)) > heap.get(i)) {
        swap(i, parent(i));
        i = parent(i);
    }
}
\`\`\`

### Extract Min/Max

Remove root, move last element to root, then sift down.

\`\`\`java
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
\`\`\`

### Decrease Key

Reduce value at index, then sift up.

\`\`\`java
public void decreaseKey(int i, int newVal) {
    heap.set(i, newVal);
    while (i > 0 && heap.get(parent(i)) > heap.get(i)) {
        swap(i, parent(i));
        i = parent(i);
    }
}
\`\`\`

### Operation Complexities

| Operation | Time | Notes |
|-----------|------|-------|
| \`insert\` | O(log n) | Sift up at most tree height |
| \`extractMin/Max\` | O(log n) | Sift down at most tree height |
| \`peek\` | O(1) | Just return root |
| \`decreaseKey\` | O(log n) | Sift up |
| \`delete\` | O(log n) | Decrease to -∞, then extract |
| \`buildHeap\` | **O(n)** | See below |

---

## 3. Building a Heap in O(n)

### Why It's Not O(n log n)

Calling \`heapifyDown\` on each non-leaf node from bottom up is O(n), **not** O(n log n).

\`\`\`java
public static void buildHeap(int[] arr) {
    int n = arr.length;
    // Start from last non-leaf node
    for (int i = n / 2 - 1; i >= 0; i--) {
        heapifyDown(arr, n, i);
    }
}
\`\`\`

**Mathematical proof**: Most nodes are near the bottom and do very little work.
- Level \`h\` (leaves): n/2 nodes × 0 swaps
- Level \`h-1\`: n/4 nodes × 1 swap
- Level \`h-2\`: n/8 nodes × 2 swaps
- Total work: Σ (n / 2^(k+1)) × k for k = 0 to h = **O(n)**

> **Interview insight**: Building a heap with repeated insertions IS O(n log n). The bottom-up \`buildHeap\` approach is the O(n) method.

---

## 4. Java PriorityQueue

\`java.util.PriorityQueue\` is a **min-heap** by default, backed by a resizable array.

### Basic Usage

\`\`\`java
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
\`\`\`

### Custom Comparator Patterns

\`\`\`java
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
\`\`\`

### Internal Implementation Notes

- Default initial capacity: 11
- Grows by 50% when full (if capacity < 64, doubles + 2)
- \`offer()\` / \`poll()\` are O(log n); \`remove(Object)\` is O(n)
- **Not thread-safe** — use \`PriorityBlockingQueue\` for concurrency
- **Iterator does NOT return elements in heap order** — poll them one by one for sorted order

---

## 5. Top-K Patterns

### Kth Largest Element

Use a **min-heap of size K**. After processing all elements, the root is the Kth largest.

\`\`\`java
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
\`\`\`

> **Key insight**: For Kth largest, use a **min-heap**. For Kth smallest, use a **max-heap**. The heap holds the "answer set" and the root is the threshold.

### K Closest Points to Origin

\`\`\`java
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
\`\`\`

### K Most Frequent Elements

\`\`\`java
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
\`\`\`

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

\`\`\`java
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
\`\`\`

**Invariants**:
1. All elements in \`lo\` ≤ all elements in \`hi\`
2. \`lo.size()\` == \`hi.size()\` or \`lo.size()\` == \`hi.size() + 1\`

### Sliding Window Median

Use two heaps plus lazy deletion (mark elements as removed, clean up when they appear at the top).

\`\`\`java
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
\`\`\`

> Note: The \`remove(Object)\` call is O(k) here. For optimal O(n log k), use lazy deletion with a \`HashMap<Integer, Integer>\` counting pending removals.

---

## 7. Merge K Sorted Lists

\`\`\`java
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
\`\`\`

### Merge K Sorted Arrays

\`\`\`java
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
\`\`\`

---

## 8. Heap Sort

### Algorithm

1. Build a max-heap from the array — O(n)
2. Repeatedly extract the max, place it at the end — O(n log n)

\`\`\`java
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
\`\`\`

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
| Build Heap | O(n) | O(n) via \`new PQ(collection)\` |
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
2. **Forgetting PriorityQueue iterator is unordered**: Always use \`poll()\` for sorted access.
3. **Using \`remove(Object)\` in a loop**: It's O(n) each time — use lazy deletion instead.
4. **Integer overflow in comparators**: \`(a, b) -> a - b\` overflows for large values. Use \`Integer.compare(a, b)\`.
5. **Not handling equal elements**: Ensure your comparator defines total ordering.

### Quick Pattern Recognition

\`\`\`
"Find the K..."          → Heap
"Continuously find..."   → Heap (streaming)
"Merge sorted..."        → Heap
"Median of stream..."    → Two heaps
"Schedule/minimize..."   → Greedy + Heap
"Smallest/largest in     → Heap or monotonic structure
 sliding window..."
\`\`\`

---

## ASCII Visual Diagrams

### Min-Heap Array Representation

\`\`\`
Min-Heap as tree:           As array:

          [1]               Index:  0   1   2   3   4   5   6
        /     \\             Value: [1] [3] [2] [7] [6] [5] [4]
      [3]     [2]
     /   \\   /   \\          Parent of i: (i-1)/2
   [7]  [6][5]  [4]         Left child: 2*i + 1
                             Right child: 2*i + 2

Node at index 1 (val=3):
  Parent = (1-1)/2 = 0 → val=1  ✓ (1 ≤ 3)
  Left   = 2*1+1 = 3   → val=7  ✓ (3 ≤ 7)
  Right  = 2*1+2 = 4   → val=6  ✓ (3 ≤ 6)
\`\`\`

### Heap Insert (Sift Up)

\`\`\`
Insert 0 into min-heap [1, 3, 2, 7, 6, 5, 4]:

Step 1: Add at end           Step 2: Sift up (0 < 2)
          [1]                          [1]
        /     \\                      /     \\
      [3]     [2]                  [3]     [0] ← swapped
     /  \\    /   \\                /  \\    /   \\
   [7] [6] [5]  [4]            [7] [6] [5]  [4]
                  |                           |
                 [0] ← added                 [2]

Step 3: Sift up (0 < 1)
          [0] ← now root
        /     \\
      [3]     [1]
     /  \\    /   \\
   [7] [6] [5]  [4]
                  |
                 [2]
\`\`\`

### Heap Extract Min (Sift Down)

\`\`\`
Extract min from [1, 3, 2, 7, 6, 5, 4]:

Step 1: Remove root, move last to root
          [4] ← was last        Step 2: Sift down
        /     \\                           [2]
      [3]     [2]                       /     \\
     /   \\   /                        [3]     [4] ← swapped
   [7]  [6][5]                       /   \\   /
                                   [7]  [6][5]

Compare 4 with children: min(3,2)=2 → swap 4 and 2
Compare 4 with children: min(5)=5 → 4 < 5 → DONE

Extracted: 1, New heap: [2, 3, 4, 7, 6, 5]
\`\`\`

### Two-Heap Median Pattern

\`\`\`
Stream: 5, 2, 8, 1, 4

After 5:  lo=[5]       hi=[]         median=5
After 2:  lo=[2]       hi=[5]        median=(2+5)/2=3.5
After 8:  lo=[5,2]     hi=[8]        median=5
After 1:  lo=[2,1]     hi=[5,8]      median=(2+5)/2=3.5
After 4:  lo=[4,2,1]   hi=[5,8]      median=4

     lo (max-heap)     hi (min-heap)
     keeps lower half  keeps upper half
     root = max of lo  root = min of hi

     [... ≤ median] | [median ≤ ...]
\`\`\`

### Build Heap O(n) Visualization

\`\`\`
Array: [4, 10, 3, 5, 1]  →  Build min-heap bottom-up

Start from last non-leaf (index 1):

        [4]              [4]              [1]
       /   \\            /   \\            /   \\
     [10]  [3]   →   [1]   [3]   →   [4]   [3]
     /  \\            /  \\              /  \\
   [5] [1]         [5] [10]          [5] [10]

  heapify(1):        heapify(0):
  swap 10↔1          swap 4↔1, then 4↔5? No, 4<5

Final: [1, 4, 3, 5, 10]
\`\`\`

---

## Step-by-Step Walkthroughs

### Kth Largest Element Walkthrough

\`\`\`
nums = [3, 2, 1, 5, 6, 4], k = 2  (find 2nd largest)

Use min-heap of size k=2:

Process 3: heap=[3]         size=1
Process 2: heap=[2,3]       size=2
Process 1: heap=[1,2,3]     size=3 > k → poll 1 → heap=[2,3]
Process 5: heap=[2,3,5]     size=3 > k → poll 2 → heap=[3,5]
Process 6: heap=[3,5,6]     size=3 > k → poll 3 → heap=[5,6]
Process 4: heap=[4,5,6]     size=3 > k → poll 4 → heap=[5,6]

Answer: heap.peek() = 5  (2nd largest)
\`\`\`

### Merge K Sorted Lists Walkthrough

\`\`\`
lists: [1→4→5], [1→3→4], [2→6]

Min-heap initially: {1(list0), 1(list1), 2(list2)}

Poll 1(list0) → result: 1, push 4(list0)
  heap: {1(list1), 2(list2), 4(list0)}

Poll 1(list1) → result: 1→1, push 3(list1)
  heap: {2(list2), 3(list1), 4(list0)}

Poll 2(list2) → result: 1→1→2, push 6(list2)
  heap: {3(list1), 4(list0), 6(list2)}

Poll 3(list1) → result: 1→1→2→3, push 4(list1)
Poll 4(list0) → result: ...→3→4, push 5(list0)
Poll 4(list1) → result: ...→4→4, list1 exhausted
Poll 5(list0) → result: ...→4→5, list0 exhausted
Poll 6(list2) → result: ...→5→6, list2 exhausted

Final: 1→1→2→3→4→4→5→6
\`\`\`

---

## Additional Java Code Examples

### Kth Largest Element in a Stream

\`\`\`java
class KthLargest {
    private final PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    private final int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int num : nums) add(num);
    }

    public int add(int val) {
        minHeap.offer(val);
        if (minHeap.size() > k) minHeap.poll();
        return minHeap.peek();
    }
}
\`\`\`

### Task Scheduler

\`\`\`java
// Find minimum intervals to execute all tasks with cooldown n
public int leastInterval(char[] tasks, int n) {
    int[] freq = new int[26];
    for (char t : tasks) freq[t - 'A']++;

    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
    for (int f : freq) if (f > 0) maxHeap.offer(f);

    int time = 0;
    Queue<int[]> cooldown = new LinkedList<>(); // {remaining count, available time}

    while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {
        time++;
        if (!maxHeap.isEmpty()) {
            int count = maxHeap.poll() - 1;
            if (count > 0) cooldown.offer(new int[]{count, time + n});
        }
        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {
            maxHeap.offer(cooldown.poll()[0]);
        }
    }
    return time;
}
\`\`\`

### Reorganize String

\`\`\`java
// Place characters so no two adjacent are same
public String reorganizeString(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;

    PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[1] - a[1]);
    for (int i = 0; i < 26; i++) {
        if (freq[i] > 0) maxHeap.offer(new int[]{i, freq[i]});
    }

    StringBuilder sb = new StringBuilder();
    while (maxHeap.size() >= 2) {
        int[] first = maxHeap.poll();
        int[] second = maxHeap.poll();
        sb.append((char)(first[0] + 'a'));
        sb.append((char)(second[0] + 'a'));
        if (--first[1] > 0) maxHeap.offer(first);
        if (--second[1] > 0) maxHeap.offer(second);
    }
    if (!maxHeap.isEmpty()) {
        int[] last = maxHeap.poll();
        if (last[1] > 1) return "";
        sb.append((char)(last[0] + 'a'));
    }
    return sb.toString();
}
\`\`\`

---

## Comparison Tables

### Heap vs Sort vs Quickselect

| Approach | Time | Space | Best When |
|---|---|---|---|
| Sort + index K | O(n log n) | O(1)-O(n) | Simple, one-time query |
| Min-heap size K | O(n log k) | O(k) | K << n, streaming data |
| Quickselect | O(n) avg, O(n²) worst | O(1) | Single Kth element, not streaming |
| Counting sort | O(n + range) | O(range) | Small value range |

### PriorityQueue vs TreeMap for Ordered Operations

| Feature | PriorityQueue | TreeMap |
|---|---|---|
| Top element | O(1) peek | O(log n) firstKey |
| Remove top | O(log n) poll | O(log n) pollFirstEntry |
| Remove arbitrary | O(n) | O(log n) |
| Search | O(n) | O(log n) |
| Sorted iteration | Must poll all | Free via iterator |
| Duplicates | Allowed | Keys unique (values can differ) |
| When to use | Top-K, merge-K | Range queries, ordered lookups |

---

## ⚠️ Common Mistakes (Extended)

1. **Min-heap for K largest** (not max-heap): Counterintuitive but correct — min-heap evicts smallest.
2. **PQ iterator is NOT sorted:** Only \\\`poll()\\\` extracts in order.
3. **\\\`remove(Object)\\\` is O(n):** For frequent removals, use lazy deletion with a counter map.
4. **Comparator overflow:** \\\`(a,b) -> a-b\\\` overflows for large values. Use \\\`Integer.compare(a,b)\\\`.
5. **Forgetting to handle equal elements:** Ensure total ordering in custom comparators.
6. **Confusing offer vs add:** Both work, but \\\`offer\\\` returns false on failure; \\\`add\\\` throws exception.

---

## 💡 Interview Tips (Extended)

- **State the heap type and size upfront:** "I'll use a min-heap of size K to find the K largest."
- **Explain the counterintuitive choice:** Why min-heap for largest? "The root is the smallest of our top-K set — it's the Kth largest."
- **Mention the trade-off:** Heap is O(n log k) vs sort O(n log n) — better when k << n.
- **For median problems, immediately think two heaps.**
- **For merge-K, immediately think min-heap of size K.**
- **Always mention buildHeap is O(n)** — interviewers love this detail.

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Pattern |
|---|---|
| "Kth largest/smallest" | Min/max heap of size K |
| "Top K frequent/closest" | Heap of size K with custom comparator |
| "Median of stream" | Two heaps (max-heap lo + min-heap hi) |
| "Merge K sorted" | Min-heap of K elements |
| "Continuously find min/max" | Heap |
| "Schedule tasks with cooldown" | Max-heap + queue |
| "Reorganize / rearrange" | Max-heap (greedy by frequency) |
| "Minimum cost to connect" | Min-heap (greedy) |
| "Sliding window median" | Two heaps + lazy deletion |
\`\`\`
`,
  },
  {
    slug: 'hashmaps-and-sets',
    title: 'HashMaps & Sets',
    icon: 'Hash',
    description: 'Exploit O(1) lookups for frequency counting, grouping, caching, and classic design problems like LRU cache.',
    color: 'red',
    content: `# HashMaps and Sets

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

Java's \`HashMap\` uses **separate chaining** with linked lists that convert to **red-black trees** when a bucket exceeds 8 entries (Java 8+).

---

## 2. Java HashMap Internals

### Structure

\`\`\`
HashMap<K, V>
├── Node<K,V>[] table     // bucket array
├── int size               // number of entries
├── int threshold          // capacity * loadFactor
├── float loadFactor       // default 0.75
└── int modCount           // structural modification counter
\`\`\`

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Initial capacity | 16 | Must be power of 2 |
| Load factor | 0.75 | Ratio of entries to capacity before resize |
| Treeify threshold | 8 | Bucket converts linked list → red-black tree |
| Untreeify threshold | 6 | Tree reverts to linked list |
| Min treeify capacity | 64 | Table must be this large before treeification |

### How \`put(key, value)\` Works

1. Compute \`hash(key)\`: \`(h = key.hashCode()) ^ (h >>> 16)\` — spreads higher bits
2. Compute bucket index: \`hash & (capacity - 1)\` — works because capacity is power of 2
3. If bucket is empty → insert new \`Node\`
4. If bucket has entries → check for key match:
   - Match found → replace value
   - No match → append to list/tree
5. If \`size > threshold\` → **rehash**: double capacity, redistribute all entries

### Rehashing

When load factor is exceeded, the table doubles in size. All entries are rehashed because the bucket index formula changes with new capacity. This is an **O(n) amortized** operation.

### Treeification (Java 8+)

When a single bucket exceeds 8 entries AND the table has ≥ 64 buckets, the linked list converts to a red-black tree. This improves worst-case bucket lookup from O(n) to O(log n).

\`\`\`
Worst-case lookup:
  Pre-Java 8:  O(n)      — all keys collide into one bucket
  Java 8+:     O(log n)  — treeified bucket
\`\`\`

---

## 3. The equals() and hashCode() Contract

**This is one of the most frequently asked Java interview topics.**

### The Contract

1. **If \`a.equals(b)\` is true, then \`a.hashCode() == b.hashCode()\` must be true.**
2. If \`a.hashCode() == b.hashCode()\`, \`a.equals(b)\` may or may not be true (collisions are allowed).
3. \`equals()\` must be reflexive, symmetric, transitive, and consistent.

### What Breaks if You Violate It

\`\`\`java
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
\`\`\`

### Correct Implementation

\`\`\`java
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
\`\`\`

> **Interview tip**: Always mention the contract. If asked "what happens if you only override equals?", explain the broken HashMap lookup scenario above.

---

## 4. Java Map and Set Variants

### Map Variants

| Class | Ordering | Null Keys | Time Complexity | Use Case |
|-------|----------|-----------|-----------------|----------|
| \`HashMap\` | None | 1 allowed | O(1) avg | General purpose |
| \`LinkedHashMap\` | **Insertion order** | 1 allowed | O(1) avg | LRU cache, ordered iteration |
| \`TreeMap\` | **Sorted by key** | Not allowed | O(log n) | Range queries, sorted data |
| \`ConcurrentHashMap\` | None | Not allowed | O(1) avg | Thread-safe |
| \`Hashtable\` | None | Not allowed | O(1) avg | Legacy — avoid |

### Set Variants

| Class | Ordering | Null Elements | Backed By |
|-------|----------|---------------|-----------|
| \`HashSet\` | None | 1 allowed | \`HashMap\` |
| \`LinkedHashSet\` | Insertion order | 1 allowed | \`LinkedHashMap\` |
| \`TreeSet\` | Sorted (natural/comparator) | Not allowed | \`TreeMap\` |

### LinkedHashMap — Insertion vs Access Order

\`\`\`java
// Insertion order (default)
Map<String, Integer> lhm = new LinkedHashMap<>();

// Access order — moves accessed entries to end (basis for LRU)
Map<String, Integer> lhm = new LinkedHashMap<>(16, 0.75f, true);
\`\`\`

### TreeMap — Useful Operations

\`\`\`java
TreeMap<Integer, String> tm = new TreeMap<>();
tm.put(1, "a"); tm.put(3, "c"); tm.put(5, "e");

tm.firstKey();          // 1
tm.lastKey();           // 5
tm.floorKey(4);         // 3 — greatest key ≤ 4
tm.ceilingKey(4);       // 5 — smallest key ≥ 4
tm.subMap(1, true, 5, false); // {1=a, 3=c}
tm.headMap(3);          // {1=a}
tm.tailMap(3);          // {3=c, 5=e}
\`\`\`

---

## 5. Common Patterns

### Frequency Counting

\`\`\`java
Map<Character, Integer> freq = new HashMap<>();
for (char c : s.toCharArray()) {
    freq.merge(c, 1, Integer::sum);
}
// or: freq.put(c, freq.getOrDefault(c, 0) + 1);
\`\`\`

### Grouping (Group Anagrams)

\`\`\`java
public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] key = s.toCharArray();
        Arrays.sort(key);
        map.computeIfAbsent(String.valueOf(key), k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}
\`\`\`

### Two-Sum Pattern

\`\`\`java
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
\`\`\`

### Subarray Sum Equals K (Prefix Sum + HashMap)

\`\`\`java
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
\`\`\`

### First Non-Repeating Character

\`\`\`java
public int firstUniqChar(String s) {
    Map<Character, Integer> freq = new LinkedHashMap<>();
    for (char c : s.toCharArray())
        freq.merge(c, 1, Integer::sum);
    for (Map.Entry<Character, Integer> e : freq.entrySet())
        if (e.getValue() == 1) return s.indexOf(e.getKey());
    return -1;
}
\`\`\`

### Longest Consecutive Sequence

\`\`\`java
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
\`\`\`

---

## 6. Design Problems

### LRU Cache

Uses \`LinkedHashMap\` with access-order mode. Override \`removeEldestEntry\` for automatic eviction.

\`\`\`java
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
\`\`\`

### LRU Cache — Manual Implementation (Interview Standard)

\`\`\`java
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
\`\`\`

### LFU Cache (Conceptual)

- Track frequency of each key
- Maintain a \`Map<Integer, LinkedHashSet<Integer>>\` mapping frequency → keys (in insertion order)
- On eviction, remove the least-frequently used key; break ties by LRU (oldest in the set)
- \`get\` and \`put\` both update frequency

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
| \`put\` / \`add\` | O(1) | O(n) | Worst case: all keys collide |
| \`get\` / \`contains\` | O(1) | O(log n)* | *Java 8+ with treeified buckets |
| \`remove\` | O(1) | O(log n)* | Same as above |
| \`containsValue\` | O(n) | O(n) | Must scan all entries |
| Iteration | O(n + capacity) | — | Iterates over all buckets |
| **Space** | **O(n)** | — | n entries + bucket array overhead |

### TreeMap / TreeSet

| Operation | Time | Notes |
|-----------|------|-------|
| \`put\` / \`add\` | O(log n) | Red-black tree |
| \`get\` / \`contains\` | O(log n) | |
| \`remove\` | O(log n) | |
| \`firstKey/lastKey\` | O(log n) | |
| \`floorKey/ceilingKey\` | O(log n) | |
| Iteration (in order) | O(n) | |

---

## 9. Interview Tips

### Choosing the Right Map/Set

\`\`\`
Need O(1) lookup, no ordering?          → HashMap / HashSet
Need insertion-order iteration?         → LinkedHashMap / LinkedHashSet
Need sorted keys / range queries?       → TreeMap / TreeSet
Need thread safety?                     → ConcurrentHashMap
Need LRU eviction?                      → LinkedHashMap (access order)
\`\`\`

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
2. **Forgetting \`hashCode()\` when overriding \`equals()\`**: Map lookups will fail silently.
3. **Using \`==\` instead of \`.equals()\` for Integer keys > 127**: Auto-unboxing and the Integer cache (-128 to 127) can cause subtle bugs.
4. **Ignoring null handling**: \`HashMap\` allows one null key; \`TreeMap\`/\`ConcurrentHashMap\` do not.
5. **Not considering \`getOrDefault\` / \`merge\` / \`computeIfAbsent\`**: These methods simplify code and reduce bugs versus manual null checks.

### Useful HashMap Methods (Java 8+)

\`\`\`java
map.getOrDefault(key, defaultVal);
map.putIfAbsent(key, val);
map.merge(key, val, (oldVal, newVal) -> oldVal + newVal);
map.computeIfAbsent(key, k -> new ArrayList<>());
map.compute(key, (k, v) -> v == null ? 1 : v + 1);
map.replaceAll((k, v) -> v * 2);
map.forEach((k, v) -> System.out.println(k + "=" + v));
\`\`\`

---

## ASCII Visual Diagrams

### HashMap Internal Structure

\`\`\`
HashMap<String, Integer> with capacity=8, entries: "cat"→1, "dog"→2, "bat"→3

Bucket Array (size 8):
Index: 0    1    2    3    4    5    6    7
      [ ]  [ ]  [●]  [ ]  [ ]  [●]  [ ]  [●]
              ↓              ↓          ↓
           "cat"→1       "dog"→2    "bat"→3

hash("cat") & 7 = 2
hash("dog") & 7 = 5
hash("bat") & 7 = 7

Collision (both hash to index 2):
Index 2: "cat"→1 → "cow"→4 → null   (linked list chain)

Java 8+: If chain > 8 entries, converts to red-black tree
\`\`\`

### HashSet Internal (backed by HashMap)

\`\`\`
HashSet<String> set = {"apple", "banana", "cherry"}

Internally:
HashMap<String, Object> map = {
    "apple"  → PRESENT,    // PRESENT = dummy Object
    "banana" → PRESENT,
    "cherry" → PRESENT
}

set.add("apple")   →  map.put("apple", PRESENT)
set.contains("x")  →  map.containsKey("x")
\`\`\`

### LinkedHashMap — Insertion Order

\`\`\`
LinkedHashMap: maintains a doubly-linked list through all entries

Bucket array (like HashMap):
[0] → null
[1] → "b"→2
[2] → "a"→1
[3] → null
[4] → "c"→3

Plus insertion-order linked list:
head ←→ "a"→1 ←→ "b"→2 ←→ "c"→3 ←→ tail

Iteration follows the linked list: a, b, c (insertion order)
Access-order mode: on get("a"), "a" moves to tail
\`\`\`

### TreeMap — Red-Black Tree

\`\`\`
TreeMap<Integer, String>: {1:"a", 3:"c", 5:"e", 7:"g", 9:"i"}

            [5:"e"] (B)
           /         \\
      [3:"c"] (R)   [7:"g"] (R)
      /                  \\
  [1:"a"] (B)        [9:"i"] (B)

B = Black, R = Red

floorKey(4) → 3  (largest key ≤ 4)
ceilingKey(4) → 5 (smallest key ≥ 4)
subMap(3, 8) → {3:"c", 5:"e", 7:"g"}
\`\`\`

### LRU Cache Visualization

\`\`\`
LRU Cache (capacity=3): put(1,A), put(2,B), put(3,C), get(1), put(4,D)

After put(1,A), put(2,B), put(3,C):
  HashMap: {1→nodeA, 2→nodeB, 3→nodeC}
  DLL: head ↔ [3,C] ↔ [2,B] ↔ [1,A] ↔ tail
                ↑ most recent         ↑ least recent

After get(1):  (move 1 to front)
  DLL: head ↔ [1,A] ↔ [3,C] ↔ [2,B] ↔ tail

After put(4,D): (evict LRU = 2)
  HashMap: {1→nodeA, 3→nodeC, 4→nodeD}  (2 removed)
  DLL: head ↔ [4,D] ↔ [1,A] ↔ [3,C] ↔ tail
\`\`\`

---

## Step-by-Step Walkthroughs

### Two Sum Walkthrough

\`\`\`
nums = [2, 7, 11, 15], target = 9

Step 1: i=0, num=2,  complement=9-2=7,  map={}
        7 not in map → add {2: 0}

Step 2: i=1, num=7,  complement=9-7=2,  map={2: 0}
        2 IS in map → return [map.get(2), 1] = [0, 1]  ✓
\`\`\`

### Group Anagrams Walkthrough

\`\`\`
Input: ["eat", "tea", "tan", "ate", "nat", "bat"]

Process each word → sort chars → use as key:

"eat" → sort → "aet" → map: {"aet": ["eat"]}
"tea" → sort → "aet" → map: {"aet": ["eat","tea"]}
"tan" → sort → "ant" → map: {"aet": [...], "ant": ["tan"]}
"ate" → sort → "aet" → map: {"aet": ["eat","tea","ate"], ...}
"nat" → sort → "ant" → map: {..., "ant": ["tan","nat"]}
"bat" → sort → "abt" → map: {..., "abt": ["bat"]}

Result: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
\`\`\`

### Longest Consecutive Sequence Walkthrough

\`\`\`
nums = [100, 4, 200, 1, 3, 2]

Set: {100, 4, 200, 1, 3, 2}

For each n, only start counting if (n-1) is NOT in set:

n=100: 99 not in set → start! 100,101? no → length=1
n=4:   3 IS in set   → skip (not a sequence start)
n=200: 199 not in set → start! 200,201? no → length=1
n=1:   0 not in set  → start! 1,2? yes. 3? yes. 4? yes. 5? no → length=4 ✓
n=3:   2 IS in set   → skip
n=2:   1 IS in set   → skip

Answer: 4 (sequence: 1,2,3,4)
\`\`\`

---

## Additional Java Code Examples

### Isomorphic Strings

\`\`\`java
// Check if s and t have the same structure — O(n) time
public boolean isIsomorphic(String s, String t) {
    if (s.length() != t.length()) return false;
    Map<Character, Character> sToT = new HashMap<>();
    Map<Character, Character> tToS = new HashMap<>();

    for (int i = 0; i < s.length(); i++) {
        char a = s.charAt(i), b = t.charAt(i);
        if (sToT.containsKey(a) && sToT.get(a) != b) return false;
        if (tToS.containsKey(b) && tToS.get(b) != a) return false;
        sToT.put(a, b);
        tToS.put(b, a);
    }
    return true;
}
\`\`\`

### Copy List with Random Pointer (HashMap)

\`\`\`java
// O(n) time, O(n) space
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
\`\`\`

### Valid Sudoku (HashSet approach)

\`\`\`java
public boolean isValidSudoku(char[][] board) {
    Set<String> seen = new HashSet<>();
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char d = board[r][c];
            if (d == '.') continue;
            if (!seen.add(d + " row " + r) ||
                !seen.add(d + " col " + c) ||
                !seen.add(d + " box " + r/3 + "-" + c/3))
                return false;
        }
    }
    return true;
}
\`\`\`

### Minimum Window Substring (HashMap + Sliding Window)

\`\`\`java
public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

    int left = 0, matched = 0, minLen = Integer.MAX_VALUE, minStart = 0;
    Map<Character, Integer> window = new HashMap<>();

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && window.get(c).equals(need.get(c))) matched++;

        while (matched == need.size()) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            char lc = s.charAt(left);
            if (need.containsKey(lc) && window.get(lc).equals(need.get(lc))) matched--;
            window.merge(lc, -1, Integer::sum);
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
}
\`\`\`

---

## Comparison Tables

### HashMap vs TreeMap vs LinkedHashMap

| Feature | HashMap | TreeMap | LinkedHashMap |
|---|---|---|---|
| Ordering | None | Sorted by key | Insertion (or access) order |
| put/get time | O(1) avg | O(log n) | O(1) avg |
| Null keys | 1 allowed | Not allowed | 1 allowed |
| Implementation | Hash table | Red-black tree | Hash table + DLL |
| Iterator order | Random | Ascending key | Insertion order |
| Use case | General purpose | Range queries | LRU cache, ordered iteration |

### HashSet vs TreeSet vs LinkedHashSet

| Feature | HashSet | TreeSet | LinkedHashSet |
|---|---|---|---|
| add/contains | O(1) avg | O(log n) | O(1) avg |
| Ordering | None | Sorted | Insertion order |
| Null elements | 1 allowed | Not allowed | 1 allowed |
| Use case | Membership test | Sorted unique elements | Ordered unique elements |

### Choosing the Right Collection

| Need | Collection |
|---|---|
| Fast lookup, no order | HashMap / HashSet |
| Insertion-order iteration | LinkedHashMap / LinkedHashSet |
| Sorted keys / range queries | TreeMap / TreeSet |
| Count occurrences | HashMap<K, Integer> with merge() |
| Group by key | HashMap<K, List<V>> with computeIfAbsent() |
| LRU eviction | LinkedHashMap (access order) |
| Thread-safe map | ConcurrentHashMap |
| Unique elements only | HashSet |

---

## ⚠️ Common Mistakes (Extended)

1. **Mutable keys:** If a key object is modified after insertion, its hash changes and it becomes unreachable. Use immutable keys (String, Integer, etc.).
2. **Missing \\\`hashCode()\\\` override:** If you override \\\`equals()\\\` but not \\\`hashCode()\\\`, HashMap lookups fail silently.
3. **\\\`==\\\` for Integer > 127:** Java caches Integer objects only from -128 to 127. Use \\\`.equals()\\\` for comparison.
4. **Not using \\\`getOrDefault\\\`/\\\`merge\\\`:** Manual null checks are verbose and error-prone. Prefer functional API.
5. **HashMap capacity planning:** If you know the size upfront, set initial capacity to \\\`n / 0.75 + 1\\\` to avoid rehashing.
6. **Iterating and modifying:** Use \\\`iterator.remove()\\\` or \\\`removeIf()\\\`, not \\\`map.remove()\\\` during iteration (ConcurrentModificationException).
7. **Null values vs absent keys:** \\\`map.get(key)\\\` returns null for both. Use \\\`containsKey()\\\` to distinguish.

---

## 💡 Interview Tips (Extended)

- **Default to HashMap** unless you need ordering. It's O(1) and simple.
- **Mention the equals/hashCode contract** proactively in Java interviews — it shows depth.
- **Know the Java 8 API:** \\\`merge\\\`, \\\`computeIfAbsent\\\`, \\\`getOrDefault\\\` produce cleaner code.
- **For "design LRU cache":** First mention LinkedHashMap shortcut, then implement manually with DLL + HashMap.
- **Think HashMap + prefix sum** whenever you see "subarray sum equals K."
- **For anagram problems,** sorted characters or frequency array as map key.

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Technique |
|---|---|
| "Two sum", "pair that sums to" | HashMap (value → index) |
| "Count frequency", "most common" | HashMap frequency counter |
| "Group by property" | HashMap (property → list) |
| "Subarray sum equals K" | Prefix sum + HashMap |
| "Contains duplicate" | HashSet |
| "First unique / non-repeating" | LinkedHashMap (preserves order) |
| "Longest consecutive sequence" | HashSet (check sequence starts) |
| "Isomorphic / pattern matching" | Two HashMaps (bidirectional mapping) |
| "LRU / LFU cache" | HashMap + Doubly Linked List |
| "Sorted range queries" | TreeMap (floor/ceiling/subMap) |
| "Design data structure" | HashMap as the backbone |

### Decision Tree

\`\`\`
Need O(1) lookup?
├── Just membership? → HashSet
├── Key-value mapping? → HashMap
│   ├── Need insertion order? → LinkedHashMap
│   ├── Need sorted keys? → TreeMap
│   └── Need thread safety? → ConcurrentHashMap
├── Counting occurrences? → HashMap + merge()
├── Grouping items? → HashMap + computeIfAbsent()
└── Sliding window + frequency? → HashMap + Two Pointers
\`\`\`
`,
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    icon: 'Network',
    description: 'Master BFS, DFS, shortest paths, topological sort, MST, and advanced graph algorithms.',
    color: 'cyan',
    content: `# Graphs

## 1. Graph Representations

### Adjacency List

Best for **sparse graphs** (E << V²). Most common in interviews.

\`\`\`java
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
\`\`\`

### Adjacency Matrix

Best for **dense graphs** or when you need O(1) edge lookups.

\`\`\`java
boolean[][] graph = new boolean[n][n];
graph[u][v] = true;
graph[v][u] = true; // undirected

int[][] weighted = new int[n][n]; // 0 or INF = no edge
\`\`\`

### Edge List

Useful for Kruskal's algorithm (sort edges by weight).

\`\`\`java
int[][] edges = {{u1, v1, w1}, {u2, v2, w2}, ...};
\`\`\`

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

\`\`\`java
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
\`\`\`

### BFS with Level Tracking

\`\`\`java
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
\`\`\`

### Shortest Path in Unweighted Graph

BFS naturally finds shortest paths in unweighted graphs because it explores level by level.

### Bidirectional BFS

Search from both source and target simultaneously. When the two frontiers meet, you've found the shortest path.

\`\`\`java
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
\`\`\`

Time: O(V + E) but in practice much faster — explores O(b^(d/2)) instead of O(b^d).

---

## 3. DFS — Depth-First Search

### Recursive DFS

\`\`\`java
public void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
    visited.add(node);
    process(node);
    for (int neighbor : graph.getOrDefault(node, List.of())) {
        if (!visited.contains(neighbor)) {
            dfs(graph, neighbor, visited);
        }
    }
}
\`\`\`

### Iterative DFS

\`\`\`java
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
\`\`\`

### Cycle Detection — Directed Graph

Use three states: unvisited, in-progress (on current recursion stack), done.

\`\`\`java
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
\`\`\`

### Cycle Detection — Undirected Graph

Track the parent to avoid counting the edge you came from.

\`\`\`java
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
\`\`\`

### Connected Components

\`\`\`java
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
\`\`\`

---

## 4. Topological Sort

Linear ordering of vertices such that for every directed edge u → v, u comes before v. **Only valid for DAGs** (Directed Acyclic Graphs).

### Kahn's Algorithm (BFS-based)

\`\`\`java
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
\`\`\`

### DFS-based Topological Sort

\`\`\`java
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
\`\`\`

| Approach | Cycle Detection | Output |
|----------|----------------|--------|
| Kahn's (BFS) | \`order.size() < n\` | Order directly |
| DFS | Back edge (in-progress → in-progress) | Reverse post-order |

---

## 5. Shortest Path Algorithms

### Dijkstra's Algorithm

For **non-negative weights**. Greedy approach using a min-heap.

\`\`\`java
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
\`\`\`

### Bellman-Ford Algorithm

Handles **negative weights**. Detects negative cycles.

\`\`\`java
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
\`\`\`

### Floyd-Warshall Algorithm

**All-pairs** shortest paths. Works with negative weights (no negative cycles).

\`\`\`java
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
\`\`\`

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

\`\`\`java
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
\`\`\`

### Prim's Algorithm

Grow MST from a starting vertex, always picking the cheapest edge to an unvisited vertex.

\`\`\`java
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
\`\`\`

| Algorithm | Best For | Time |
|-----------|----------|------|
| Kruskal's | Sparse graphs, edge list available | O(E log E) |
| Prim's | Dense graphs, adjacency list | O(E log V) |

---

## 7. Union-Find (Disjoint Set Union)

### Implementation with Path Compression + Union by Rank

\`\`\`java
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
\`\`\`

| Operation | Time (amortized) |
|-----------|-----------------|
| \`find\` | O(α(n)) ≈ O(1) |
| \`union\` | O(α(n)) ≈ O(1) |

α(n) is the inverse Ackermann function — grows incredibly slowly, effectively constant.

### Applications

- **Kruskal's MST**: Check if adding an edge creates a cycle
- **Number of connected components**: Count distinct roots
- **Redundant connections**: Find the edge that creates a cycle
- **Accounts merge**: Group accounts by common emails
- **Detect cycle in undirected graph**: If \`find(u) == find(v)\` before union, cycle exists

---

## 8. Advanced Graph Algorithms

### Tarjan's Strongly Connected Components

A directed graph's **SCC** is a maximal set of vertices where every vertex is reachable from every other.

\`\`\`java
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
\`\`\`

### Bridges and Articulation Points

A **bridge** is an edge whose removal disconnects the graph.
An **articulation point** is a vertex whose removal disconnects the graph.

\`\`\`java
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
\`\`\`

---

## 9. Graph Coloring / Bipartite Check

A graph is **bipartite** if it can be 2-colored — no two adjacent vertices share a color.

\`\`\`java
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
\`\`\`

> **Interview insight**: A graph is bipartite if and only if it contains **no odd-length cycles**.

---

## 10. Common Interview Patterns

### Number of Islands (Grid BFS/DFS)

\`\`\`java
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
\`\`\`

### Word Ladder (BFS + Word Transformation)

\`\`\`java
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
\`\`\`

### Network Delay Time (Dijkstra Application)

\`\`\`java
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
\`\`\`

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
4. **Integer overflow with Dijkstra**: Use \`long\` for distance accumulation with large weights.
5. **Dijkstra with negative weights**: Use Bellman-Ford instead.
6. **Not tracking parent in undirected cycle detection**: Will incorrectly detect the edge you came from as a cycle.

---

## ASCII Visual Diagrams

### Graph Representations

\`\`\`
Graph with 5 nodes:
    0 --- 1
    |   / |
    |  /  |
    2 --- 3
          |
          4

Adjacency List:                  Adjacency Matrix:
0: [1, 2]                          0  1  2  3  4
1: [0, 2, 3]                    0 [0  1  1  0  0]
2: [0, 1, 3]                    1 [1  0  1  1  0]
3: [1, 2, 4]                    2 [1  1  0  1  0]
4: [3]                           3 [0  1  1  0  1]
                                 4 [0  0  0  1  0]
\`\`\`

### BFS Traversal Order

\`\`\`
Start from node 0:

    0 --- 1          Level 0: {0}
    |   / |          Level 1: {1, 2}
    |  /  |          Level 2: {3}
    2 --- 3          Level 3: {4}
          |
          4          Order: 0 → 1 → 2 → 3 → 4

Queue progression:
  [0]  →  [1, 2]  →  [2, 3]  →  [3]  →  [4]  →  []
\`\`\`

### DFS vs BFS on Grid

\`\`\`
Grid (1=land, 0=water):        DFS exploration:
  1 1 0 0 0                      1→2→3 0 0 0
  1 1 0 0 0                      4 5 0 0 0 0
  0 0 1 0 0                      0 0 6 0 0 0
  0 0 0 1 1                      0 0 0 7→8

DFS visits connected land cells (one island at a time).
Islands found: 3 (top-left, center, bottom-right)
\`\`\`

### Dijkstra's Algorithm Walkthrough

\`\`\`
Weighted graph:
    0 --4-- 1
    |       |
    2       1
    |       |
    2 --3-- 3

dist = [0, ∞, ∞, ∞]   Priority Queue: {(0,0)}

Process (0,0): update neighbors
  dist[1] = min(∞, 0+4) = 4    dist[2] = min(∞, 0+2) = 2
  PQ: {(2,2), (4,1)}

Process (2,2): update neighbors
  dist[3] = min(∞, 2+3) = 5
  PQ: {(4,1), (5,3)}

Process (4,1): update neighbors
  dist[3] = min(5, 4+1) = 5    no change
  PQ: {(5,3)}

Process (5,3): no unvisited neighbors

Final: dist = [0, 4, 2, 5]
\`\`\`

### Topological Sort (Kahn's BFS)

\`\`\`
Directed graph (prerequisites):
  0 → 1 → 3
  0 → 2 → 3

In-degree: [0:0, 1:1, 2:1, 3:2]

Start: queue = [0]       (in-degree 0)
Process 0: decrement 1,2 → in-degree: [0:0, 1:0, 2:0, 3:2]
  queue = [1, 2]

Process 1: decrement 3   → in-degree: [0:0, 1:0, 2:0, 3:1]
  queue = [2]

Process 2: decrement 3   → in-degree: [0:0, 1:0, 2:0, 3:0]
  queue = [3]

Process 3: done

Order: [0, 1, 2, 3]  ✓
\`\`\`

---

## Step-by-Step Walkthroughs

### Number of Islands Walkthrough

\`\`\`
Grid:
  1 1 0 0 0
  1 1 0 0 0
  0 0 1 0 0
  0 0 0 1 1

(0,0)='1' → count=1, DFS flood-fill marks all connected:
  (0,0)→(0,1)→(1,0)→(1,1) all marked '0'

(0,2)='0' → skip
(2,2)='1' → count=2, DFS marks (2,2)
(3,3)='1' → count=3, DFS marks (3,3)→(3,4)

Answer: 3 islands
\`\`\`

---

## Additional Comparison Tables

### BFS vs DFS — Complete Decision Guide

| Scenario | BFS | DFS |
|---|---|---|
| Shortest path (unweighted) | ✅ Guaranteed | ❌ Not guaranteed |
| Level-order processing | ✅ Natural | ❌ Requires extra work |
| Memory (wide graph) | ❌ O(width) | ✅ O(depth) |
| Memory (deep graph) | ✅ O(width) | ❌ O(depth), may overflow |
| Cycle detection (directed) | Possible | ✅ Preferred (3-color) |
| Topological sort | ✅ Kahn's | ✅ Reverse post-order |
| Connected components | ✅ Either | ✅ Either |
| All paths between two nodes | ❌ Impractical | ✅ Backtracking |
| Word ladder / transformation | ✅ Optimal | ❌ Too slow |

### Shortest Path Algorithm Selection

\`\`\`
What type of graph?
├── Unweighted → BFS
├── Weighted, no negative edges → Dijkstra O((V+E)log V)
├── Weighted, has negative edges → Bellman-Ford O(V·E)
├── All-pairs → Floyd-Warshall O(V³)
└── DAG → Topological sort + relaxation O(V+E)
\`\`\`

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Algorithm |
|---|---|
| "Shortest path", "minimum steps" | BFS (unweighted) or Dijkstra (weighted) |
| "Connected components", "groups" | DFS or Union-Find |
| "Course schedule", "prerequisites" | Topological sort |
| "Number of islands" | DFS/BFS flood fill on grid |
| "Word ladder", "transformation" | BFS (word graph) |
| "Detect cycle" (directed) | DFS with 3 states |
| "Detect cycle" (undirected) | DFS with parent tracking or Union-Find |
| "Minimum cost to connect all" | MST (Kruskal's or Prim's) |
| "Bipartite", "2-colorable" | BFS/DFS coloring |
| "Strongly connected components" | Tarjan's or Kosaraju's |
| "Network delay", "signal time" | Dijkstra |

---

## ⚠️ Common Mistakes (Extended)

1. **Not marking visited BEFORE adding to queue (BFS):** Causes duplicate processing and TLE.
2. **Using DFS for shortest path:** BFS guarantees shortest in unweighted graphs, DFS does not.
3. **Forgetting disconnected components:** Always iterate all nodes as potential start points.
4. **Integer overflow in Dijkstra:** Use \\\`long\\\` for accumulated distances with large weights.
5. **Dijkstra with negative edges:** Results are wrong. Use Bellman-Ford.
6. **Grid problems — not checking bounds first:** Always check \\\`r >= 0 && r < rows && c >= 0 && c < cols\\\`.
7. **Modifying input grid permanently:** Clone if the original is needed later.
`,
  },
  {
    slug: 'tries',
    title: 'Tries',
    icon: 'Type',
    description: 'Build prefix trees for autocomplete, word search, and dictionary-based string problems.',
    color: 'pink',
    content: `# Tries (Prefix Trees)

## 1. Trie Fundamentals

A **Trie** (pronounced "try") is a tree-like data structure for efficiently storing and retrieving strings by their prefixes. Each node represents a single character, and paths from root to marked nodes form complete words.

\`\`\`
Insert: "app", "apple", "apt", "bat"

         (root)
        /      \\
       a        b
       |        |
       p        a
      / \\       |
     p   t*     t*
     |
     l
     |
     e*

  * = end of word
\`\`\`

### Key Properties

| Property | Value |
|----------|-------|
| Each edge represents one character | |
| Root is empty (no character) | |
| Depth of a node = length of the prefix it represents | |
| Common prefixes share the same path | |

---

## 2. Trie Node Design

### Array-Based Children (26 lowercase letters)

\`\`\`java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}
\`\`\`

- **Pros**: O(1) child access, simple indexing
- **Cons**: Wastes space if alphabet is large or children are sparse
- **Space per node**: 26 pointers + boolean ≈ 208 bytes (on 64-bit JVM)

### HashMap-Based Children

\`\`\`java
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEndOfWord = false;
}
\`\`\`

- **Pros**: Memory-efficient for sparse nodes, supports any character set
- **Cons**: Slightly slower due to hashing overhead
- **Best for**: Unicode, mixed-case, or large alphabets

> **Interview default**: Use array-based for lowercase English letters. Mention HashMap-based as an alternative.

---

## 3. Complete Trie Implementation

\`\`\`java
class Trie {
    private TrieNode root = new TrieNode();

    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEndOfWord = false;
    }

    // Insert a word — O(m) where m = word length
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) {
                node.children[idx] = new TrieNode();
            }
            node = node.children[idx];
        }
        node.isEndOfWord = true;
    }

    // Search for exact word — O(m)
    public boolean search(String word) {
        TrieNode node = findNode(word);
        return node != null && node.isEndOfWord;
    }

    // Check if any word starts with prefix — O(m)
    public boolean startsWith(String prefix) {
        return findNode(prefix) != null;
    }

    // Helper: traverse to the node representing the given prefix
    private TrieNode findNode(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return null;
            node = node.children[idx];
        }
        return node;
    }

    // Delete a word — O(m)
    public void delete(String word) {
        deleteHelper(root, word, 0);
    }

    // Returns true if the parent should delete the child link
    private boolean deleteHelper(TrieNode node, String word, int depth) {
        if (node == null) return false;

        if (depth == word.length()) {
            if (!node.isEndOfWord) return false; // word not found
            node.isEndOfWord = false;
            return isEmpty(node); // delete node if no children
        }

        int idx = word.charAt(depth) - 'a';
        if (deleteHelper(node.children[idx], word, depth + 1)) {
            node.children[idx] = null;
            return !node.isEndOfWord && isEmpty(node);
        }
        return false;
    }

    private boolean isEmpty(TrieNode node) {
        for (TrieNode child : node.children) {
            if (child != null) return false;
        }
        return true;
    }
}
\`\`\`

---

## 4. Operations Complexity

| Operation | Time | Space |
|-----------|------|-------|
| \`insert(word)\` | O(m) | O(m) worst case — creates m new nodes |
| \`search(word)\` | O(m) | O(1) |
| \`startsWith(prefix)\` | O(m) | O(1) |
| \`delete(word)\` | O(m) | O(m) — recursion stack |
| **Build trie from N words** | **O(N × m)** | **O(N × m × α)** |

Where m = word length, α = alphabet size (for array-based: 26).

### Trie vs HashMap for String Lookups

| Aspect | Trie | HashMap |
|--------|------|---------|
| Exact lookup | O(m) | O(m) average |
| Prefix search | O(m) + traversal | Not supported natively |
| Space | Can share prefixes | Stores full keys |
| Sorted iteration | Natural (DFS) | Requires sorting |
| Worst-case lookup | O(m) always | O(m × n) — hash collision |

> **When Trie beats HashMap**: Prefix queries, autocomplete, lexicographic ordering, and when many strings share common prefixes.

---

## 5. Compressed Trie (Radix Tree)

A **compressed trie** merges chains of single-child nodes into one node with a multi-character label.

\`\`\`
Standard Trie:           Compressed Trie:

     (root)                  (root)
       |                    /     \\
       r                 "romane" "rub"
       o                    |     / \\
       m                  "us"  "er" "ic"
       a                        |     |
       n                       "s"   "on"
      / \\
     e   u
          |
          s

Words: romane, romanus, ruber, rubicon, rubric
\`\`\`

### When to Use

- **Large datasets** with many shared prefixes (IP routing tables, file systems)
- **Memory-constrained** environments
- Harder to implement — usually not required in coding interviews

---

## 6. Applications and Interview Patterns

### Autocomplete System

\`\`\`java
class AutocompleteSystem {
    private TrieNode root = new TrieNode();

    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        Map<String, Integer> counts = new HashMap<>(); // sentence → frequency
    }

    public void addSentence(String sentence, int count) {
        TrieNode node = root;
        for (char c : sentence.toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> new TrieNode());
            node.counts.merge(sentence, count, Integer::sum);
        }
    }

    public List<String> search(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return List.of();
        }
        // Return top 3 by frequency
        return node.counts.entrySet().stream()
            .sorted((a, b) -> b.getValue() != a.getValue()
                ? b.getValue() - a.getValue()
                : a.getKey().compareTo(b.getKey()))
            .limit(3)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }
}
\`\`\`

### Word Search II (Trie + DFS on Grid)

Find all words from a dictionary that exist in a character grid.

\`\`\`java
public List<String> findWords(char[][] board, String[] words) {
    // Build trie from dictionary
    TrieNode root = new TrieNode();
    for (String word : words) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) node.children[idx] = new TrieNode();
            node = node.children[idx];
        }
        node.word = word; // store complete word at terminal node
    }

    List<String> result = new ArrayList<>();
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            dfs(board, i, j, root, result);
        }
    }
    return result;
}

private void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;
    char ch = board[r][c];
    if (ch == '#' || node.children[ch - 'a'] == null) return;

    node = node.children[ch - 'a'];
    if (node.word != null) {
        result.add(node.word);
        node.word = null; // avoid duplicates
    }

    board[r][c] = '#'; // mark visited
    dfs(board, r + 1, c, node, result);
    dfs(board, r - 1, c, node, result);
    dfs(board, r, c + 1, node, result);
    dfs(board, r, c - 1, node, result);
    board[r][c] = ch; // restore

    // Optimization: prune empty branches
    // if all children are null, remove this node from parent
}

static class TrieNode {
    TrieNode[] children = new TrieNode[26];
    String word = null;
}
\`\`\`

> **Key insight**: Using a Trie to prune the DFS. Instead of searching for each word independently (O(words × cells × 4^L)), we search once, guided by the Trie.

### Word Break Problem

Determine if a string can be segmented into dictionary words.

\`\`\`java
public boolean wordBreak(String s, List<String> wordDict) {
    Trie trie = new Trie();
    for (String word : wordDict) trie.insert(word);

    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;

    for (int i = 0; i < n; i++) {
        if (!dp[i]) continue;
        TrieNode node = trie.root;
        for (int j = i; j < n; j++) {
            int idx = s.charAt(j) - 'a';
            if (node.children[idx] == null) break;
            node = node.children[idx];
            if (node.isEndOfWord) dp[j + 1] = true;
        }
    }
    return dp[n];
}
// Time: O(n² × 1) — Trie lookup is O(1) per character
// Better than naive O(n² × m) where m = average word length
\`\`\`

### Replace Words (Prefix Replacement)

Replace words in a sentence with their shortest root from a dictionary.

\`\`\`java
public String replaceWords(List<String> dictionary, String sentence) {
    Trie trie = new Trie();
    for (String root : dictionary) trie.insert(root);

    StringBuilder result = new StringBuilder();
    for (String word : sentence.split(" ")) {
        if (result.length() > 0) result.append(" ");
        result.append(findRoot(trie.root, word));
    }
    return result.toString();
}

private String findRoot(TrieNode root, String word) {
    TrieNode node = root;
    StringBuilder prefix = new StringBuilder();
    for (char c : word.toCharArray()) {
        int idx = c - 'a';
        if (node.children[idx] == null) break;
        node = node.children[idx];
        prefix.append(c);
        if (node.isEndOfWord) return prefix.toString();
    }
    return word; // no root found
}
\`\`\`

### Implement a Spell Checker

Find words within edit distance 1 (simplified).

\`\`\`java
public List<String> spellCheck(TrieNode root, String word) {
    List<String> suggestions = new ArrayList<>();
    // Check exact match
    if (search(root, word)) return List.of(word);

    // Try all single-character edits
    for (int i = 0; i <= word.length(); i++) {
        for (char c = 'a'; c <= 'z'; c++) {
            // Insertion
            String inserted = word.substring(0, i) + c + word.substring(i);
            if (search(root, inserted)) suggestions.add(inserted);

            // Replacement
            if (i < word.length()) {
                String replaced = word.substring(0, i) + c + word.substring(i + 1);
                if (search(root, replaced)) suggestions.add(replaced);
            }
        }
        // Deletion
        if (i < word.length()) {
            String deleted = word.substring(0, i) + word.substring(i + 1);
            if (search(root, deleted)) suggestions.add(deleted);
        }
    }
    return suggestions;
}
\`\`\`

### Map Sum Pairs

\`\`\`java
class MapSum {
    TrieNode root = new TrieNode();

    static class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        int prefixSum = 0;
    }

    Map<String, Integer> map = new HashMap<>();

    public void insert(String key, int val) {
        int delta = val - map.getOrDefault(key, 0);
        map.put(key, val);
        TrieNode node = root;
        for (char c : key.toCharArray()) {
            node = node.children.computeIfAbsent(c, k -> new TrieNode());
            node.prefixSum += delta;
        }
    }

    public int sum(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            node = node.children.get(c);
            if (node == null) return 0;
        }
        return node.prefixSum;
    }
}
\`\`\`

---

## 7. Trie with Additional Node Data

Depending on the problem, you may store extra data at each node:

\`\`\`java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;

    // Optional fields per problem:
    String word;            // store complete word (Word Search II)
    int count;              // frequency count
    int prefixCount;        // number of words with this prefix
    int prefixSum;          // sum of values for prefix queries
    List<String> words;     // all words passing through this node
}
\`\`\`

### Counting Words with a Given Prefix

\`\`\`java
class Trie {
    TrieNode root = new TrieNode();

    static class TrieNode {
        TrieNode[] children = new TrieNode[26];
        int wordCount = 0;    // words ending here
        int prefixCount = 0;  // words passing through here
    }

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) node.children[idx] = new TrieNode();
            node = node.children[idx];
            node.prefixCount++;
        }
        node.wordCount++;
    }

    public int countWordsWithPrefix(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            int idx = c - 'a';
            if (node.children[idx] == null) return 0;
            node = node.children[idx];
        }
        return node.prefixCount;
    }
}
\`\`\`

---

## 8. Collecting All Words with a Prefix

\`\`\`java
public List<String> getAllWordsWithPrefix(String prefix) {
    List<String> result = new ArrayList<>();
    TrieNode node = findNode(prefix);
    if (node != null) {
        collectWords(node, new StringBuilder(prefix), result);
    }
    return result;
}

private void collectWords(TrieNode node, StringBuilder path, List<String> result) {
    if (node.isEndOfWord) result.add(path.toString());
    for (int i = 0; i < 26; i++) {
        if (node.children[i] != null) {
            path.append((char) ('a' + i));
            collectWords(node.children[i], path, result);
            path.deleteCharAt(path.length() - 1);
        }
    }
}
\`\`\`

---

## 9. Complexity Summary

| Operation | Time | Space |
|-----------|------|-------|
| Insert word of length m | O(m) | O(m) worst case |
| Search word of length m | O(m) | O(1) |
| StartsWith prefix of length m | O(m) | O(1) |
| Delete word of length m | O(m) | O(m) recursion stack |
| Collect all words with prefix | O(m + k) | O(k) results |
| Build trie from N words, avg len m | O(N·m) | O(N·m·α) |
| Word Search II (grid r×c, K words) | O(r·c·4^L) | O(K·L) trie space |

Where α = alphabet size (26 for lowercase), L = max word length, k = number of matching words.

### Space Optimization

| Node Type | Space per Node | When to Use |
|-----------|---------------|-------------|
| Array[26] | 26 × 8 bytes = 208 bytes | Fast, fixed alphabet |
| HashMap | ~48 + 32 per entry | Sparse nodes, large alphabets |
| Compressed (Radix) | Varies | Very memory-constrained |

---

## 10. Interview Tips

### When to Use a Trie

- **Prefix-based queries**: "find all words starting with..."
- **Autocomplete / typeahead**: Real-time prefix search
- **Word search in grid**: Trie-guided DFS dramatically prunes search space
- **Dictionary-based problems**: Word break, replace words
- **Lexicographic ordering**: DFS on trie yields sorted order
- **XOR-based problems**: Binary trie for maximum XOR pair

### When Trie is Overkill

- **Simple exact lookups**: \`HashSet\` is simpler and equally fast
- **Small dictionaries**: Overhead of trie nodes outweighs benefits
- **No prefix queries**: If you never need \`startsWith\`, use a set

### Common Interview Questions

| Problem | Key Technique |
|---------|--------------|
| Implement Trie | Standard insert/search/startsWith |
| Word Search II | Trie + DFS on grid |
| Word Break | Trie + DP |
| Replace Words | Shortest prefix match in trie |
| Autocomplete System | Trie + frequency sorting |
| Design Search Suggest | Trie + top-K at each node |
| Map Sum Pairs | Trie with prefix sums |
| Maximum XOR of Two Numbers | Binary trie |
| Palindrome Pairs | Trie with reverse words |

### Implementation Checklist

1. **Choose node type**: Array (fast, fixed) vs HashMap (flexible)
2. **Decide what to store at each node**: \`isEnd\`, \`word\`, \`count\`, etc.
3. **Handle edge cases**: Empty string, single character, duplicate insertions
4. **Consider deletion**: Do you need it? It adds complexity
5. **Optimize**: Prune dead branches in backtracking problems

---

## ASCII Visual Diagrams

### Trie Structure — Detailed

\`\`\`
Words: "car", "card", "care", "cat"

             (root)
              |
              c
              |
              a
             / \\
            r*   t*
           / \\
          d*  e*

Searching "care":
  root → c → a → r → e* → FOUND (isEnd=true)

Searching "ca":
  root → c → a → node exists but isEnd=false → NOT a word (but IS a prefix)
\`\`\`

### Word Search II — Trie + Backtracking

\`\`\`
Board:           Trie from words ["oath","pea","eat","rain"]:
  o a a n
  e t a e             (root)
  i h k r           /   |   \\
  i f l v          o    p    e    r
                   |    |    |    |
                   a    e    a    a
                   |    |    |    |
                   t    a*   t*   i
                   |               |
                   h*              n*

DFS from each cell, following trie paths.
Found: "oath" (o→a→t→h), "eat" (e→a→t)
\`\`\`

---

## Step-by-Step Walkthroughs

### Trie Insert Walkthrough

\`\`\`
Insert "apple" into empty trie:

Step 1: root → create 'a' child
Step 2: 'a' → create 'p' child
Step 3: 'p' → create 'p' child
Step 4: 'p' → create 'l' child
Step 5: 'l' → create 'e' child, mark isEnd=true

Insert "app":
Step 1: root → 'a' exists, follow
Step 2: 'a' → 'p' exists, follow
Step 3: 'p' → 'p' exists, follow, mark isEnd=true

Now "app" and "apple" both exist. "app" shares prefix with "apple".
\`\`\`

---

## Comparison Tables

### Array vs HashMap Trie Nodes

| Feature | Array (children[26]) | HashMap<Char, Node> |
|---|---|---|
| Lookup time | O(1) direct index | O(1) avg hash |
| Space per node | 26 pointers always | Only used chars |
| Best when | Lowercase English only | Unicode, sparse alphabet |
| Implementation | Simpler, faster | More flexible |

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Approach |
|---|---|
| "Autocomplete", "prefix search" | Trie with search/startsWith |
| "Word search in grid" | Trie + backtracking DFS |
| "Word dictionary with wildcards" | Trie + DFS for '.' wildcard |
| "Longest common prefix" | Trie (traverse until branch) |
| "Maximum XOR" | Binary trie (bit by bit) |
| "Spell checker" | Trie with edit distance |

---

## ⚠️ Common Mistakes

1. **Confusing "word exists" with "prefix exists":** Check \\\`isEnd\\\` flag for complete words.
2. **Not pruning in backtracking:** After finding a word in Word Search II, prune the trie branch.
3. **Memory usage:** A 26-array trie uses 26 pointers per node — use HashMap for large alphabets.
4. **Deletion complexity:** Removing a word requires checking if nodes are shared by other words.
`,
  },
  {
    slug: 'union-find',
    title: 'Union-Find',
    icon: 'GitMerge',
    description: 'Track connected components dynamically with disjoint set union, path compression, and union by rank.',
    color: 'amber',
    content: `# Union-Find (Disjoint Set Union)

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

- **Find(x)**: Return the *representative element* (root) of the set containing \`x\`.
- **Union(x, y)**: Merge the sets containing \`x\` and \`y\` into one.

### Core Concepts

| Concept | Description |
|---------|-------------|
| Representative Element | A unique member chosen to identify the entire set (the root of its tree) |
| Connected Component | A maximal set of elements where every pair is connected |
| Parent Array | \`parent[i]\` stores the parent of element \`i\`; root has \`parent[i] = i\` |
| Rank/Size | Metadata used to keep trees balanced during union |

### When to Use Union-Find

Union-Find excels when you need to:
1. Dynamically group elements and query membership
2. Detect cycles in undirected graphs
3. Track the number of connected components as edges are added
4. Process queries online (one at a time, in order)

---

## Naive Implementation

Each element starts as its own set. We use a parent array where \`parent[i] = i\` initially.

\`\`\`java
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
\`\`\`

**Problem**: Without optimizations, trees can degenerate into linked lists, making \`find\` O(n).

---

## Optimizations

### Path Compression

During \`find\`, make every node on the path point directly to the root. This flattens the tree.

\`\`\`java
public int find(int x) {
    if (parent[x] != x) {
        parent[x] = find(parent[x]); // path compression
    }
    return parent[x];
}
\`\`\`

- Amortized cost per operation: **O(log n)** with path compression alone.

### Union by Rank

Attach the shorter tree under the root of the taller tree to prevent height growth.

\`\`\`java
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
\`\`\`

### Union by Size

Alternative to rank — attach the smaller set under the larger one. Useful when you need component sizes.

\`\`\`java
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
\`\`\`

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

\`\`\`java
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
\`\`\`

### Size-Based Variant (when you need component sizes)

\`\`\`java
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
\`\`\`

---

## Weighted Union-Find

Used when edges carry weights / relationships (e.g., ratios, offsets). Each node stores a weight relative to its parent.

### Use Case: Evaluate Division (LC 399)

Given \`a/b = 2.0\` and \`b/c = 3.0\`, find \`a/c\`.

\`\`\`java
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
\`\`\`

### Use Case: Satisfiability of Equations (LC 990)

Group variables connected by \`==\` and check no \`!=\` pair shares a group.

\`\`\`java
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
\`\`\`

---

## Applications

### 1. Kruskal's Minimum Spanning Tree

Sort edges by weight, greedily add edges that don't create a cycle.

\`\`\`java
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
\`\`\`

### 2. Detecting Cycles in Undirected Graphs

If \`find(u) == find(v)\` before \`union(u, v)\`, the edge creates a cycle.

\`\`\`java
public boolean hasCycle(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        if (!uf.union(edge[0], edge[1])) {
            return true; // cycle detected
        }
    }
    return false;
}
\`\`\`

### 3. Dynamic Connectivity

Track connected components as edges arrive in an online fashion — something BFS/DFS can't do efficiently without rebuilding.

---

## Common Interview Patterns

### Number of Connected Components (LC 323)

\`\`\`java
public int countComponents(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        uf.union(edge[0], edge[1]);
    }
    return uf.getCount();
}
\`\`\`

### Redundant Connection (LC 684)

Find the edge that, when removed, makes the graph a tree.

\`\`\`java
public int[] findRedundantConnection(int[][] edges) {
    UnionFind uf = new UnionFind(edges.length + 1);
    for (int[] edge : edges) {
        if (!uf.union(edge[0], edge[1])) {
            return edge;
        }
    }
    return new int[0];
}
\`\`\`

### Accounts Merge (LC 721)

Union accounts sharing an email, then group by root.

\`\`\`java
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
\`\`\`

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
4. **Return value from union**: returning \`boolean\` lets you detect cycles and count components easily.
5. **Map-based UF**: When elements aren't integers 0..n-1, use a \`HashMap<T, T>\` for parent instead of an array.
6. **Component count**: Maintain a \`count\` variable, decrement on successful union.
7. **Don't forget**: Union-Find does NOT support efficient deletion or splitting of sets.

### Common Mistakes
- Forgetting to call \`find()\` before comparing roots
- Not initializing \`parent[i] = i\`
- Using union by rank but forgetting to only increment when ranks are equal
- Confusing rank (tree height) with size (element count) — pick one, stick with it

---

## ASCII Visual Diagrams

### Union-Find Operations

\`\`\`
Initial: each element is its own root
  parent: [0, 1, 2, 3, 4]
  Sets: {0} {1} {2} {3} {4}

union(0, 1):           union(2, 3):           union(1, 3):
  0                      2                      0
  |                      |                    / |
  1                      3                   1  2
                                                |
Sets: {0,1} {2} {3} {4}  {0,1} {2,3} {4}      3

find(3) with path compression:
  Before: 3→2→0    After: 3→0 (direct link)
                          2→0 (direct link)

  0                    0
  |                  / | \\
  2        →        1  2  3
  |
  3
\`\`\`

### Path Compression Effect

\`\`\`
Before find(5):              After find(5):
     0                            0
     |                         / | | \\
     1                        1  2 3  5
     |                        |
     2                        4
     |
     3
     |
     5

Tree height reduced from 4 to 1 for the queried path.
\`\`\`

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Use Union-Find |
|---|---|
| "Connected components" (dynamic) | Track components with union |
| "Are X and Y connected?" | find(x) == find(y) |
| "Redundant connection" / "extra edge" | Edge that connects already-connected nodes |
| "Accounts merge" | Group by shared attribute |
| "Minimum spanning tree" | Kruskal's uses Union-Find |
| "Number of provinces / friend circles" | Count distinct roots |
| "Making network connected" | Count components, need (components-1) edges |

### Union-Find vs BFS/DFS

| Scenario | Union-Find | BFS/DFS |
|---|---|---|
| Dynamic edge additions | ✅ O(α(n)) per op | ❌ Rebuild each time |
| Static connected components | ✅ Works | ✅ Works, sometimes simpler |
| Shortest path | ❌ Can't do | ✅ BFS/Dijkstra |
| Cycle detection (undirected) | ✅ Simple | ✅ With parent tracking |

---

## ⚠️ Common Mistakes (Extended)

1. **Comparing nodes directly instead of roots:** Always call \\\`find()\\\` before comparing.
2. **Forgetting \\\`parent[i] = i\\\` initialization:** Every node starts as its own root.
3. **Rank increment error:** Only increment rank when merging two trees of equal rank.
4. **Confusing rank with size:** They're different optimizations — pick one approach consistently.
5. **Expecting efficient split/delete:** Union-Find does NOT support un-unioning sets.
`,
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: 'BrainCircuit',
    description: 'Solve optimization problems with memoization and tabulation across all major DP patterns.',
    color: 'violet',
    content: `# Dynamic Programming

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
\`\`\`java
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
\`\`\`

### Bottom-Up (Tabulation)
\`\`\`java
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
\`\`\`

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
- **State variables**: \`day\`, \`holding\` (whether we currently hold a stock), \`cooldown\`
- Simplified: \`dp[i][0]\` = max profit on day i without stock, \`dp[i][1]\` = with stock

---

## DP Patterns

### 1. Linear DP

Problems where state depends on previous elements in a 1D sequence.

**Climbing Stairs** — \`dp[i] = dp[i-1] + dp[i-2]\`

\`\`\`java
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
\`\`\`

**House Robber** — \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`

\`\`\`java
public int rob(int[] nums) {
    int prev2 = 0, prev1 = 0;
    for (int num : nums) {
        int curr = Math.max(prev1, prev2 + num);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
\`\`\`

**Maximum Subarray (Kadane's)** — \`dp[i] = max(nums[i], dp[i-1] + nums[i])\`

\`\`\`java
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], currSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currSum = Math.max(nums[i], currSum + nums[i]);
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}
\`\`\`

**Longest Increasing Subsequence** — O(n log n) with patience sorting

\`\`\`java
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
\`\`\`

| Problem | Time | Space |
|---------|------|-------|
| Climbing Stairs | O(n) | O(1) |
| House Robber | O(n) | O(1) |
| Maximum Subarray | O(n) | O(1) |
| LIS (binary search) | O(n log n) | O(n) |

---

### 2. Knapsack Variants

**0/1 Knapsack** — Each item used at most once.

\`\`\`java
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
\`\`\`

**Unbounded Knapsack** — Each item used unlimited times.

\`\`\`java
public int unboundedKnapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int w = weights[i]; w <= capacity; w++) { // forward order!
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
\`\`\`

**Subset Sum** — Can we pick elements summing to target?

\`\`\`java
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
\`\`\`

**Coin Change** — Minimum coins to make amount (unbounded variant).

\`\`\`java
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
\`\`\`

| Variant | Item Reuse | Loop Order (1D) | Time | Space |
|---------|-----------|-----------------|------|-------|
| 0/1 Knapsack | Once | Reverse | O(n·W) | O(W) |
| Unbounded | Unlimited | Forward | O(n·W) | O(W) |
| Bounded (k copies) | k times | Binary lifting or reverse with count | O(n·W·log k) | O(W) |
| Subset Sum | Once | Reverse | O(n·S) | O(S) |

---

### 3. String DP

**Edit Distance (Levenshtein)** — \`dp[i][j]\` = min edits to convert \`word1[0..i-1]\` to \`word2[0..j-1]\`

\`\`\`java
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
\`\`\`

**Longest Common Subsequence (LCS)**

\`\`\`java
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
\`\`\`

**Longest Palindromic Subsequence** — LCS of string and its reverse, or interval DP.

| Problem | Time | Space |
|---------|------|-------|
| Edit Distance | O(m·n) | O(n) optimized |
| LCS | O(m·n) | O(n) optimized |
| Longest Palindromic Subseq | O(n²) | O(n) optimized |

---

### 4. Interval DP

State defined over subarray \`[i, j]\`. Solve smaller intervals first.

**Matrix Chain Multiplication** — \`dp[i][j]\` = min cost to multiply matrices i through j.

\`\`\`java
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
\`\`\`

**Burst Balloons (LC 312)** — Think of adding balloons instead of removing.

\`\`\`java
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
\`\`\`

| Problem | Time | Space |
|---------|------|-------|
| Matrix Chain Multiplication | O(n³) | O(n²) |
| Burst Balloons | O(n³) | O(n²) |

---

### 5. Grid DP

**Unique Paths** — \`dp[i][j] = dp[i-1][j] + dp[i][j-1]\`

\`\`\`java
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
\`\`\`

**Minimum Path Sum**

\`\`\`java
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
\`\`\`

**Maximal Square** — \`dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1\` if cell is '1'.

\`\`\`java
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
\`\`\`

---

### 6. Tree DP

Run DP on tree structure, typically via post-order DFS.

**Binary Tree Maximum Path Sum (LC 124)**

\`\`\`java
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
\`\`\`

**House Robber III** — Rob or skip each node.

\`\`\`java
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
\`\`\`

---

### 7. Bitmask DP

Use bitmask to represent subsets. State: \`dp[mask]\` or \`dp[mask][i]\`.

**Travelling Salesman Problem** — \`dp[mask][i]\` = min cost to visit cities in \`mask\`, ending at \`i\`.

\`\`\`java
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
\`\`\`

**Complexity**: O(2^n · n²) time, O(2^n · n) space. Feasible for n ≤ 20.

---

### 8. State Machine DP

Model the problem as transitions between states.

**Best Time to Buy and Sell Stock with Cooldown (LC 309)**

States: \`held\`, \`sold\`, \`rest\`

\`\`\`java
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
\`\`\`

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

**Template**: \`dp(pos, tight, state)\` — build number digit by digit.

\`\`\`java
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
\`\`\`

**Key insight for range [L, R]**: compute \`count(R) - count(L - 1)\`.

---

## Space Optimization

### Rolling Array (2D → Two Rows)

When \`dp[i]\` only depends on \`dp[i-1]\`, keep only two rows.

\`\`\`java
// Before: int[][] dp = new int[m][n];
// After:
int[] prev = new int[n], curr = new int[n];
for (int i = 1; i < m; i++) {
    // fill curr using prev
    int[] temp = prev; prev = curr; curr = temp;
}
\`\`\`

### 1D from 2D

For knapsack-style problems, iterate in the right direction to reuse the same row.

\`\`\`java
// 0/1 knapsack: iterate capacity in reverse
for (int w = capacity; w >= weights[i]; w--)

// Unbounded: iterate capacity forward
for (int w = weights[i]; w <= capacity; w++)
\`\`\`

### Variable Elimination

When \`dp[i]\` depends only on \`dp[i-1]\` and \`dp[i-2]\`, use two variables.

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

---

## ASCII Visual Diagrams

### Top-Down vs Bottom-Up Visualization

\`\`\`
Fibonacci fib(5) — Top-Down (Memoization):

  fib(5)
  ├── fib(4)                    Call tree with memo:
  │   ├── fib(3)                fib(5) → fib(4) → fib(3) → fib(2) → fib(1)
  │   │   ├── fib(2) → 1                                    → fib(0)
  │   │   └── fib(1) → 1                   → fib(2) [cached!]
  │   └── fib(2) [cached!] → 1  → fib(3) [cached!]
  └── fib(3) [cached!] → 2

Bottom-Up (Tabulation):
  dp[0]=0, dp[1]=1
  dp[2]=dp[1]+dp[0]=1
  dp[3]=dp[2]+dp[1]=2
  dp[4]=dp[3]+dp[2]=3
  dp[5]=dp[4]+dp[3]=5    ← answer
\`\`\`

### Knapsack DP Table

\`\`\`
Items: weights=[1,2,3], values=[6,10,12], capacity=5

     Capacity →  0   1   2   3   4   5
Item 0 (w=1,v=6) 0   6   6   6   6   6
Item 1 (w=2,v=10) 0  6  10  16  16  16
Item 2 (w=3,v=12) 0  6  10  16  18  22

dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
Answer: dp[2][5] = 22 (take items 1 and 2)
\`\`\`

### Longest Common Subsequence Table

\`\`\`
s1 = "ABCDE", s2 = "ACE"

      ""  A  C  E
  ""   0  0  0  0
  A    0  1  1  1
  B    0  1  1  1
  C    0  1  2  2
  D    0  1  2  2
  E    0  1  2  3  ← answer

Match → diagonal + 1
No match → max(left, top)
LCS = "ACE", length = 3
\`\`\`

---

## Step-by-Step Walkthroughs

### Coin Change Walkthrough

\`\`\`
coins = [1, 3, 4], amount = 6

dp[i] = min coins to make amount i

dp[0] = 0
dp[1] = dp[1-1]+1 = 1           (use coin 1)
dp[2] = dp[2-1]+1 = 2           (use coin 1)
dp[3] = min(dp[3-1]+1, dp[3-3]+1) = min(3, 1) = 1  (use coin 3)
dp[4] = min(dp[4-1]+1, dp[4-3]+1, dp[4-4]+1) = min(2, 2, 1) = 1  (use coin 4)
dp[5] = min(dp[4]+1, dp[2]+1, dp[1]+1) = min(2, 3, 2) = 2  (use coin 4+1)
dp[6] = min(dp[5]+1, dp[3]+1, dp[2]+1) = min(3, 2, 3) = 2  (use coins 3+3)

Answer: 2 (coins 3+3)
\`\`\`

---

## Comparison Tables

### Top-Down vs Bottom-Up

| Aspect | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|---|---|---|
| Approach | Recursive + cache | Iterative, fill table |
| Computes | Only needed subproblems | All subproblems |
| Stack | Recursion stack O(n) | No stack |
| Space optimization | Harder | Easy (rolling array) |
| Implementation | More intuitive | More efficient |
| When to prefer | Complex state transitions | Need space optimization |

### DP Pattern Quick Reference

| Pattern | State | Transition | Examples |
|---|---|---|---|
| Linear | dp[i] | dp[i-1], dp[i-2] | Climbing stairs, house robber |
| 0/1 Knapsack | dp[i][w] | Take or skip item i | Subset sum, partition equal |
| Unbounded Knapsack | dp[w] | Any item can repeat | Coin change, rod cutting |
| String | dp[i][j] | Match/skip chars | LCS, edit distance |
| Grid | dp[r][c] | From top/left | Unique paths, min path sum |
| Interval | dp[i][j] | Split at k in [i,j] | Matrix chain, burst balloons |

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | DP Pattern |
|---|---|
| "Minimum/maximum cost to reach" | Linear or grid DP |
| "Number of ways to" | Counting DP |
| "Can you make exactly X?" | Knapsack / subset sum |
| "Longest increasing/common" | Sequence DP (LIS, LCS) |
| "Edit distance", "convert string" | String DP |
| "Partition into groups" | Interval or knapsack DP |
| "Buy and sell stock" | State machine DP |
| "Distinct subsequences" | String DP with counting |

---

## ⚠️ Common Mistakes

1. **Wrong base case:** Always define dp[0] or dp[0][0] carefully.
2. **Wrong iteration order:** Bottom-up must fill dependencies first. For 0/1 knapsack iterate capacity backwards.
3. **Off-by-one in string DP:** dp table is usually (m+1) × (n+1) with empty string base case.
4. **Not considering negative values:** Affects subset sum and partition problems.
5. **Stack overflow in top-down:** For large inputs, convert to bottom-up.
6. **Forgetting space optimization:** Many 2D DP problems only need the previous row.
`,
  },
  {
    slug: 'sliding-window-two-pointers',
    title: 'Sliding Window & Two Pointers',
    icon: 'SlidersHorizontal',
    description: 'Efficiently process contiguous subarrays and sorted data with window and pointer techniques.',
    color: 'teal',
    content: `# Sliding Window & Two Pointers

## Table of Contents
- [Two Pointers Technique](#two-pointers-technique)
  - [Same Direction](#same-direction-pointers)
  - [Opposite Direction](#opposite-direction-pointers)
  - [Three Pointers](#three-pointers)
- [Sliding Window Technique](#sliding-window-technique)
  - [Fixed-Size Window](#fixed-size-window)
  - [Variable-Size Window](#variable-size-window)
  - [Shrinkable vs Non-Shrinkable](#shrinkable-vs-non-shrinkable-windows)
- [Common Patterns](#common-patterns)
- [HashMap + Sliding Window](#hashmap--sliding-window)
- [Complexity Analysis](#complexity-analysis)
- [Interview Tips](#interview-tips)

---

## Two Pointers Technique

Two pointers reduce brute-force O(n²) to O(n) by exploiting sorted or sequential structure.

### Same Direction Pointers

Both pointers move left to right. Typically a **slow** pointer tracks the write position and a **fast** pointer scans.

**Remove Duplicates from Sorted Array (LC 26)**

\`\`\`java
public int removeDuplicates(int[] nums) {
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            nums[++slow] = nums[fast];
        }
    }
    return slow + 1;
}
\`\`\`

**Move Zeroes (LC 283)**

\`\`\`java
public void moveZeroes(int[] nums) {
    int slow = 0;
    for (int fast = 0; fast < nums.length; fast++) {
        if (nums[fast] != 0) {
            int temp = nums[slow];
            nums[slow++] = nums[fast];
            nums[fast] = temp;
        }
    }
}
\`\`\`

**Linked List Cycle Detection (Floyd's)**

\`\`\`java
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
\`\`\`

---

### Opposite Direction Pointers

One pointer at each end, moving inward. Works on sorted arrays or palindrome checks.

**Two Sum II — Sorted Array (LC 167)**

\`\`\`java
public int[] twoSum(int[] numbers, int target) {
    int lo = 0, hi = numbers.length - 1;
    while (lo < hi) {
        int sum = numbers[lo] + numbers[hi];
        if (sum == target) return new int[]{lo + 1, hi + 1};
        else if (sum < target) lo++;
        else hi--;
    }
    return new int[]{-1, -1};
}
\`\`\`

**Container With Most Water (LC 11)**

\`\`\`java
public int maxArea(int[] height) {
    int lo = 0, hi = height.length - 1, max = 0;
    while (lo < hi) {
        int area = Math.min(height[lo], height[hi]) * (hi - lo);
        max = Math.max(max, area);
        if (height[lo] < height[hi]) lo++;
        else hi--;
    }
    return max;
}
\`\`\`

**Valid Palindrome (LC 125)**

\`\`\`java
public boolean isPalindrome(String s) {
    int lo = 0, hi = s.length() - 1;
    while (lo < hi) {
        while (lo < hi && !Character.isLetterOrDigit(s.charAt(lo))) lo++;
        while (lo < hi && !Character.isLetterOrDigit(s.charAt(hi))) hi--;
        if (Character.toLowerCase(s.charAt(lo)) != Character.toLowerCase(s.charAt(hi))) {
            return false;
        }
        lo++;
        hi--;
    }
    return true;
}
\`\`\`

**Trapping Rain Water (LC 42)**

\`\`\`java
public int trap(int[] height) {
    int lo = 0, hi = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;
    while (lo < hi) {
        if (height[lo] < height[hi]) {
            leftMax = Math.max(leftMax, height[lo]);
            water += leftMax - height[lo];
            lo++;
        } else {
            rightMax = Math.max(rightMax, height[hi]);
            water += rightMax - height[hi];
            hi--;
        }
    }
    return water;
}
\`\`\`

---

### Three Pointers

**3Sum (LC 15)** — Fix one element, then use two pointers on the rest.

\`\`\`java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicates
        int lo = i + 1, hi = nums.length - 1;
        while (lo < hi) {
            int sum = nums[i] + nums[lo] + nums[hi];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                while (lo < hi && nums[lo] == nums[lo + 1]) lo++;
                while (lo < hi && nums[hi] == nums[hi - 1]) hi--;
                lo++;
                hi--;
            } else if (sum < 0) lo++;
            else hi--;
        }
    }
    return result;
}
\`\`\`

---

## Sliding Window Technique

Maintain a window \`[left, right]\` over a contiguous subarray/substring and slide it to explore all valid ranges.

### Fixed-Size Window

Window size \`k\` is constant. Slide by advancing both ends by 1.

**Maximum Sum Subarray of Size K**

\`\`\`java
public int maxSumSubarray(int[] nums, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < nums.length; i++) {
        windowSum += nums[i];
        if (i >= k) {
            windowSum -= nums[i - k];
        }
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
        }
    }
    return maxSum;
}
\`\`\`

**Maximum of All Subarrays of Size K** (using deque)

\`\`\`java
public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>(); // stores indices
    int[] result = new int[nums.length - k + 1];
    for (int i = 0; i < nums.length; i++) {
        while (!deque.isEmpty() && deque.peekFirst() <= i - k) {
            deque.pollFirst();
        }
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
\`\`\`

---

### Variable-Size Window

Window size varies to satisfy a condition. Two variants exist:

#### Template: Find Longest Subarray Meeting Condition

\`\`\`java
// TEMPLATE: Longest subarray/substring where condition holds
public int longestWithCondition(int[] nums) {
    int left = 0, result = 0;
    // state variables to track window condition (e.g., sum, count map)

    for (int right = 0; right < nums.length; right++) {
        // 1. Expand: add nums[right] to window state

        // 2. Shrink: while window is INVALID, remove nums[left] and advance left
        while (windowIsInvalid()) {
            // remove nums[left] from window state
            left++;
        }

        // 3. Update: window [left, right] is now valid
        result = Math.max(result, right - left + 1);
    }
    return result;
}
\`\`\`

#### Template: Find Shortest Subarray Meeting Condition

\`\`\`java
// TEMPLATE: Shortest subarray/substring where condition holds
public int shortestWithCondition(int[] nums, int target) {
    int left = 0, result = Integer.MAX_VALUE;
    // state variables

    for (int right = 0; right < nums.length; right++) {
        // 1. Expand: add nums[right] to window state

        // 2. Shrink: while window is VALID, record answer and shrink
        while (windowIsValid()) {
            result = Math.min(result, right - left + 1);
            // remove nums[left] from window state
            left++;
        }
    }
    return result == Integer.MAX_VALUE ? -1 : result;
}
\`\`\`

**Minimum Size Subarray Sum (LC 209)**

\`\`\`java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left++];
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
\`\`\`

---

### Shrinkable vs Non-Shrinkable Windows

Two approaches for "find the longest" problems:

**Shrinkable** (standard): Shrink the window until it becomes valid.
\`\`\`java
// Window can shrink: left moves as much as needed
while (invalid) { left++; }
result = Math.max(result, right - left + 1);
\`\`\`

**Non-shrinkable** (advanced): Window never shrinks, only grows or slides.
\`\`\`java
// Window never shrinks: left moves at most once per step
if (invalid) { left++; }
result = right - left + 1; // always update (window size only grows)
\`\`\`

The non-shrinkable approach works because we only care about the *maximum* window size. If the current window is invalid, we don't shrink — we just slide, maintaining the largest valid size found so far.

\`\`\`java
// Non-shrinkable: Longest Repeating Character Replacement (LC 424)
public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0, maxFreq = 0;
    for (int right = 0; right < s.length(); right++) {
        maxFreq = Math.max(maxFreq, ++count[s.charAt(right) - 'A']);
        if (right - left + 1 - maxFreq > k) {
            count[s.charAt(left) - 'A']--;
            left++;
        }
    }
    return s.length() - left;
}
\`\`\`

---

## Common Patterns

### Minimum Window Substring (LC 76)

Find the smallest substring of \`s\` containing all characters of \`t\`.

\`\`\`java
public String minWindow(String s, String t) {
    int[] need = new int[128], have = new int[128];
    for (char c : t.toCharArray()) need[c]++;

    int required = 0;
    for (int n : need) if (n > 0) required++;

    int left = 0, formed = 0, minLen = Integer.MAX_VALUE, start = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        have[c]++;
        if (need[c] > 0 && have[c] == need[c]) formed++;

        while (formed == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                start = left;
            }
            char leftChar = s.charAt(left);
            have[leftChar]--;
            if (need[leftChar] > 0 && have[leftChar] < need[leftChar]) formed--;
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(start, start + minLen);
}
\`\`\`

### Longest Substring Without Repeating Characters (LC 3)

\`\`\`java
public int lengthOfLongestSubstring(String s) {
    int[] lastSeen = new int[128];
    Arrays.fill(lastSeen, -1);
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen[c] >= left) {
            left = lastSeen[c] + 1;
        }
        lastSeen[c] = right;
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Subarrays with K Different Integers (LC 992)

**Key trick**: \`exactly(K) = atMost(K) - atMost(K - 1)\`

\`\`\`java
public int subarraysWithKDistinct(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

private int atMost(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() > k) {
            int leftVal = nums[left++];
            count.merge(leftVal, -1, Integer::sum);
            if (count.get(leftVal) == 0) count.remove(leftVal);
        }
        result += right - left + 1; // count all valid subarrays ending at right
    }
    return result;
}
\`\`\`

### String Permutation / Anagram Matching (LC 567, LC 438)

**Find All Anagrams in a String (LC 438)**

\`\`\`java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;

    int[] pCount = new int[26], sCount = new int[26];
    for (char c : p.toCharArray()) pCount[c - 'a']++;

    for (int i = 0; i < s.length(); i++) {
        sCount[s.charAt(i) - 'a']++;
        if (i >= p.length()) {
            sCount[s.charAt(i - p.length()) - 'a']--;
        }
        if (Arrays.equals(sCount, pCount)) {
            result.add(i - p.length() + 1);
        }
    }
    return result;
}
\`\`\`

**Optimization**: Instead of comparing arrays each time, maintain a \`matches\` counter.

\`\`\`java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;

    int[] count = new int[26];
    for (char c : p.toCharArray()) count[c - 'a']++;

    int matches = 0;
    for (int i = 0; i < 26; i++) if (count[i] == 0) matches++;

    for (int i = 0; i < s.length(); i++) {
        int idx = s.charAt(i) - 'a';
        count[idx]--;
        if (count[idx] == 0) matches++;
        else if (count[idx] == -1) matches--;

        if (i >= p.length()) {
            idx = s.charAt(i - p.length()) - 'a';
            count[idx]++;
            if (count[idx] == 0) matches++;
            else if (count[idx] == 1) matches--;
        }
        if (matches == 26) result.add(i - p.length() + 1);
    }
    return result;
}
\`\`\`

---

## HashMap + Sliding Window

Many window problems need a frequency map to track the window's contents.

### Pattern: Window with Character Frequency

\`\`\`java
// Generic framework
Map<Character, Integer> windowMap = new HashMap<>();
int left = 0;
for (int right = 0; right < s.length(); right++) {
    // Add s.charAt(right) to windowMap
    windowMap.merge(s.charAt(right), 1, Integer::sum);

    // Shrink while condition violated
    while (conditionViolated(windowMap)) {
        char leftChar = s.charAt(left);
        windowMap.merge(leftChar, -1, Integer::sum);
        if (windowMap.get(leftChar) == 0) windowMap.remove(leftChar);
        left++;
    }

    // Update result
}
\`\`\`

### When to Use Array vs HashMap
| Approach | Use When |
|----------|----------|
| \`int[26]\` or \`int[128]\` | Character set is small and known (lowercase, ASCII) |
| \`HashMap<K, V>\` | Elements are arbitrary integers, strings, or large domain |

Array lookup is faster (O(1) with small constant) and avoids boxing overhead.

---

## Complexity Analysis

| Technique | Time | Space | Key Insight |
|-----------|------|-------|-------------|
| Two Pointers (opposite) | O(n) | O(1) | Each pointer moves at most n times |
| Two Pointers (same dir) | O(n) | O(1) | Fast pointer visits each element once |
| Fixed Window | O(n) | O(1) or O(k) | Each element enters/exits window once |
| Variable Window (shrinkable) | O(n) | O(k) | \`left\` and \`right\` each move at most n times total |
| Variable Window + HashMap | O(n) | O(min(n, alphabet)) | Map operations are O(1) amortized |
| 3Sum | O(n²) | O(1) | Outer loop × inner two-pointer pass |
| Sliding Window Maximum | O(n) | O(k) | Monotonic deque — each element pushed/popped once |

> **Why is variable window O(n)?** Both \`left\` and \`right\` only move forward. Over the entire execution, \`left\` moves at most \`n\` times and \`right\` moves exactly \`n\` times → total work is O(n).

---

## Interview Tips

### Recognizing the Pattern

| Signal | Technique |
|--------|-----------|
| "Contiguous subarray/substring" | Sliding window |
| "Longest/shortest subarray with condition" | Variable sliding window |
| "Subarray of size k" | Fixed sliding window |
| "Pair that sums to X" in sorted array | Opposite two pointers |
| "Remove/partition in place" | Same-direction two pointers |
| "All triplets that sum to X" | Sort + three pointers |
| "Anagram / permutation in string" | Fixed window + frequency count |
| "At most K distinct" | Variable window + HashMap |

### Choosing the Right Variant

1. **Is the array sorted or can be sorted?** → Two pointers (opposite direction)
2. **Looking for contiguous subarray?** → Sliding window
3. **Fixed size or variable size?**
   - Fixed → simple slide
   - Variable, "longest" → expand right, shrink left when invalid
   - Variable, "shortest" → expand right, shrink left while valid
4. **"Exactly K" condition?** → Convert to \`atMost(K) - atMost(K-1)\`

### Common Mistakes
1. **Off-by-one**: Is the window \`[left, right]\` inclusive on both ends? Be consistent.
2. **Forgetting to update state** when shrinking the left side.
3. **Not handling empty/single-element** input.
4. **Using HashMap when an array suffices** — slower and harder to debug.
5. **Trying sliding window on non-contiguous problems** — window only works for contiguous subarrays.

### Practice Problems by Difficulty

| Difficulty | Problems |
|------------|----------|
| Easy | Two Sum II, Valid Palindrome, Move Zeroes |
| Medium | 3Sum, Container With Most Water, Longest Substring Without Repeating, Minimum Size Subarray Sum, Permutation in String |
| Hard | Minimum Window Substring, Sliding Window Maximum, Subarrays with K Different Integers, Trapping Rain Water |

---

## ASCII Visual Diagrams

### Fixed-Size Sliding Window

\`\`\`
Find max sum of subarray of size k=3 in [2, 1, 5, 1, 3, 2]:

Window 1: [2, 1, 5] 1  3  2    sum = 8
Window 2:  2 [1, 5, 1] 3  2    sum = 7
Window 3:  2  1 [5, 1, 3] 2    sum = 9  ← max
Window 4:  2  1  5 [1, 3, 2]   sum = 6

Slide: add right, remove left → O(1) per step, O(n) total
\`\`\`

### Variable-Size Sliding Window

\`\`\`
Min subarray with sum ≥ 7 in [2, 3, 1, 2, 4, 3]:

 L R
[2] 3  1  2  4  3    sum=2 < 7, expand R
[2, 3] 1  2  4  3    sum=5 < 7, expand R
[2, 3, 1] 2  4  3    sum=6 < 7, expand R
[2, 3, 1, 2] 4  3    sum=8 ≥ 7! len=4, shrink L
 3 [3, 1, 2] 4  3    sum=6 < 7, expand R
 3 [3, 1, 2, 4] 3    sum=10 ≥ 7! len=4, shrink L
 3  3 [1, 2, 4] 3    sum=7 ≥ 7! len=3, shrink L
 3  3  1 [2, 4] 3    sum=6 < 7, expand R
 3  3  1 [2, 4, 3]   sum=9 ≥ 7! len=3, shrink L
 3  3  1  2 [4, 3]   sum=7 ≥ 7! len=2 ← min

Answer: 2
\`\`\`

### Two Pointers — 3Sum

\`\`\`
sorted: [-4, -1, -1, 0, 1, 2], target=0

Fix i=0 (-4), two-pointer on rest:
  L=1(-1), R=5(2): sum = -4+(-1)+2 = -3 < 0 → L++
  L=2(-1), R=5(2): sum = -4+(-1)+2 = -3 < 0 → L++
  L=3(0),  R=5(2): sum = -4+0+2 = -2 < 0 → L++
  L=4(1),  R=5(2): sum = -4+1+2 = -1 < 0 → L++
  L=5 ≥ R → done

Fix i=1 (-1), two-pointer on rest:
  L=2(-1), R=5(2): sum = -1+(-1)+2 = 0 → FOUND [-1,-1,2]
  L=3(0),  R=4(1): sum = -1+0+1 = 0 → FOUND [-1,0,1]

Answer: [[-1,-1,2], [-1,0,1]]
\`\`\`

---

## Comparison Tables

### Sliding Window Template Comparison

| Type | Window Size | Expand | Shrink | Track |
|---|---|---|---|---|
| Fixed | k (constant) | Always | Always (maintain size) | Sum, count |
| Variable (min) | Dynamic | Until condition met | While condition holds | Min length |
| Variable (max) | Dynamic | Always | When condition violated | Max length |

### Two Pointer Patterns

| Pattern | Pointers | Direction | Use Case |
|---|---|---|---|
| Opposite ends | lo, hi | Toward center | Two Sum (sorted), container water |
| Same direction | slow, fast | Both forward | Remove duplicates, partition |
| Gap (linked list) | ahead, behind | Same direction | Kth from end |
| Read/write | read, write | Same direction | In-place modification |

---

## 🔍 How to Recognize These Problems

| Keywords / Signals | Technique |
|---|---|
| "Contiguous subarray of size K" | Fixed sliding window |
| "Smallest/longest subarray with..." | Variable sliding window |
| "Substring with at most K distinct" | Window + HashMap |
| "Two sum in sorted array" | Two pointers (opposite) |
| "3Sum / 4Sum" | Sort + fix one + two pointers |
| "Container with most water" | Two pointers (opposite) |
| "Remove duplicates in-place" | Two pointers (same direction) |
| "Minimum window containing all" | Variable window + frequency map |

---

## ⚠️ Common Mistakes (Extended)

1. **Using window for non-contiguous:** Sliding window only works for contiguous subarrays.
2. **Not updating state on shrink:** When left pointer moves, update sum/map/count.
3. **Off-by-one window boundaries:** Window \\\`[left, right]\\\` is inclusive both ends.
4. **HashMap overhead when array works:** For character frequency, int[128] beats HashMap.
5. **Forgetting to skip duplicates in 3Sum:** After finding a triplet, skip identical values.
6. **Wrong shrink condition:** For "minimum length," shrink while valid; for "maximum length," shrink when invalid.
`,
  },
  {
    slug: 'advanced-topics',
    title: 'Advanced Topics',
    icon: 'Sparkles',
    description: 'Round out your prep with backtracking, binary search, bit manipulation, math, and interview strategy.',
    color: 'rose',
    content: `# Advanced Topics

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

\`\`\`java
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
\`\`\`

### N-Queens (LC 51)

\`\`\`java
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
\`\`\`

### Subsets / Combinations / Permutations

\`\`\`java
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
\`\`\`

---

## Binary Search Advanced

### Search in Rotated Sorted Array (LC 33)

\`\`\`java
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
\`\`\`

### Finding Boundaries (Lower/Upper Bound)

\`\`\`java
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
\`\`\`

### Binary Search on Answer

When the answer space is monotonic: if \`f(x)\` is feasible, then \`f(x+1)\` is also feasible.

**Koko Eating Bananas (LC 875)**

\`\`\`java
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
\`\`\`

---

## Bit Manipulation

### Essential Operations

| Operation | Code | Description |
|-----------|------|-------------|
| Check bit i | \`(n >> i) & 1\` | Is bit i set? |
| Set bit i | \`n \\| (1 << i)\` | Turn on bit i |
| Clear bit i | \`n & ~(1 << i)\` | Turn off bit i |
| Toggle bit i | \`n ^ (1 << i)\` | Flip bit i |
| Lowest set bit | \`n & (-n)\` | Isolate rightmost 1-bit |
| Clear lowest set bit | \`n & (n - 1)\` | Turn off rightmost 1-bit |
| Check power of 2 | \`n > 0 && (n & (n-1)) == 0\` | Only one bit set |
| Count set bits | \`Integer.bitCount(n)\` | Population count |

### Single Number Variants

\`\`\`java
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
\`\`\`

### Counting Bits (LC 338)

\`\`\`java
public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1); // dp[i] = dp[i/2] + last bit
    }
    return dp;
}
\`\`\`

---

## Math & Number Theory

### GCD (Euclidean Algorithm)

\`\`\`java
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
\`\`\`

### Sieve of Eratosthenes

\`\`\`java
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
\`\`\`

### Modular Arithmetic

\`\`\`java
static final int MOD = 1_000_000_007;

// (a + b) % MOD
long modAdd(long a, long b) { return ((a % MOD) + (b % MOD)) % MOD; }

// (a * b) % MOD
long modMul(long a, long b) { return ((a % MOD) * (b % MOD)) % MOD; }
\`\`\`

### Fast Exponentiation

\`\`\`java
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
\`\`\`

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
| \`Arrays.sort(int[])\` | Dual-pivot Quicksort | No | Primitives |
| \`Arrays.sort(Object[])\` | TimSort (merge sort hybrid) | Yes | Objects |
| \`Collections.sort()\` | TimSort | Yes | Lists |

**TimSort**: Merge sort + insertion sort hybrid. Exploits existing runs in data. O(n) best case for nearly sorted data.

---

## Design Patterns in Interviews

### LRU Cache (LC 146)

\`\`\`java
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
\`\`\`

### Iterator Pattern (Flatten Nested List)

\`\`\`java
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
\`\`\`

---

## Concurrency Data Structures

Conceptual understanding often tested in system design rounds.

| Structure | Key Properties | Use Case |
|-----------|---------------|----------|
| \`ConcurrentHashMap\` | Segment-level locking (Java 8: node-level CAS), no full-map lock | Shared mutable maps across threads |
| \`CopyOnWriteArrayList\` | Creates new copy on every write, reads are lock-free | Read-heavy, write-rare scenarios |
| \`BlockingQueue\` | \`put()\` blocks when full, \`take()\` blocks when empty | Producer-consumer pattern |
| \`AtomicInteger\` | CAS-based lock-free operations | Counters, accumulators |
| \`ReadWriteLock\` | Multiple concurrent readers, exclusive writers | Read-heavy shared resources |
| \`CountDownLatch\` | One-time barrier, counts down to zero | Wait for N tasks to complete |
| \`CyclicBarrier\` | Reusable barrier, all threads must arrive | Phased parallel computation |

### ConcurrentHashMap Key Points
- **Java 7**: \`Segment[]\` (16 segments by default), each segment locks independently
- **Java 8**: Node-level CAS + synchronized on individual bins, \`computeIfAbsent()\` is atomic
- **Never use** \`HashMap\` in concurrent code — infinite loops possible on resize

---

## System Design Intersections

### Consistent Hashing
- Maps keys to a hash ring; nodes own ranges
- Adding/removing a node only remaps O(K/N) keys (K keys, N nodes)
- Virtual nodes improve balance

### Bloom Filters
- Probabilistic set membership: no false negatives, possible false positives
- Uses k hash functions mapping to a bit array of size m
- False positive rate ≈ \`(1 - e^(-kn/m))^k\`
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

---

## ASCII Visual Diagrams

### Backtracking Tree (Subsets)

\`\`\`
Generate all subsets of [1, 2, 3]:

                 []
              /   |   \\
           [1]   [2]   [3]
          / \\     |
       [1,2] [1,3] [2,3]
        |
     [1,2,3]

Subsets: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]

Key: at each level, decide to INCLUDE or EXCLUDE the current element.
\`\`\`

### Binary Search Variants

\`\`\`
Standard:         lo=0, hi=n-1, while (lo <= hi)
                  Returns exact match or -1

Lower bound:      lo=0, hi=n, while (lo < hi)
                  Returns first index where arr[i] >= target

Upper bound:      lo=0, hi=n, while (lo < hi)
                  Returns first index where arr[i] > target

Predicate-based:  lo=0, hi=n, while (lo < hi)
                  Returns first index where condition is true
                  (binary search on answer space)
\`\`\`

### Bit Manipulation Tricks

\`\`\`
n & (n-1)  — clears lowest set bit
  n   = 1010
  n-1 = 1001
  AND = 1000    (cleared lowest set bit)

n & (-n)  — isolates lowest set bit
  n  = 1010
  -n = 0110 (two's complement)
  AND = 0010   (lowest set bit only)

XOR properties:
  a ^ a = 0     (cancel out)
  a ^ 0 = a     (identity)
  a ^ b ^ a = b (find the single number)
\`\`\`

---

## Comparison Tables

### Sorting Algorithm Comprehensive Comparison

| Algorithm | Best | Average | Worst | Space | Stable? | Notes |
|---|---|---|---|---|---|---|
| Insertion Sort | O(n) | O(n²) | O(n²) | O(1) | Yes | Best for nearly sorted / small arrays |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | Guaranteed performance, used in TimSort |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Cache-friendly, fastest in practice |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | In-place, but poor cache locality |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | Only for bounded integers |
| Radix Sort | O(d·n) | O(d·n) | O(d·n) | O(n) | Yes | d = number of digits |

---

## 🔍 How to Recognize These Problems — Master Guide

| Keywords / Signals | Think... |
|---|---|
| "All possible combinations/subsets" | Backtracking |
| "Generate all valid" | Backtracking with pruning |
| "Find in sorted / rotated sorted" | Binary search |
| "Minimum/maximum of something" | Binary search on answer |
| "Single number / missing number" | Bit manipulation (XOR) |
| "Power of 2" | n & (n-1) == 0 |
| "GCD / prime factors" | Number theory |
| "Count digits matching condition" | Digit DP |

---

## ⚠️ Common Mistakes

1. **Backtracking: forgetting to undo choices:** Always remove the last added element after recursing.
2. **Binary search: wrong loop condition:** \\\`lo <= hi\\\` for exact search, \\\`lo < hi\\\` for boundary search.
3. **Binary search: wrong mid update:** If \\\`lo = mid\\\` (not \\\`mid+1\\\`), infinite loop when \\\`lo+1 == hi\\\`.
4. **Bit manipulation: assuming 32-bit:** Java \\\`int\\\` is 32-bit, \\\`long\\\` is 64-bit. Know which you need.
5. **Not handling empty input** in any algorithm.

---

## 💡 Interview Tips — Master Strategy

- **Always start with brute force.** Even if it's O(2^n), state it, analyze it, then optimize.
- **State your approach before coding.** "I'll use binary search on the answer space because the condition is monotonic."
- **Test with the smallest possible input first.** Edge cases catch most bugs.
- **If stuck, think about what data structure gives you the operation you need in O(1) or O(log n).**
- **Practice the pattern, not the problem.** Recognize which pattern applies, then adapt the template.
`,
  },
];
