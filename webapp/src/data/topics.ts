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
    content: `# Arrays and Strings — Deep Dive Guide

## 📌 Core Concepts

### What Are Arrays?

An **array** is a contiguous block of memory storing elements of the same type. This is the
most fundamental data structure in computer science because it maps directly to how hardware
accesses memory — a base address plus an offset.

**Why it matters for interviews:**
- Arrays are the foundation for ~40% of coding interview problems
- Understanding memory layout explains WHY certain techniques (cache locality, two pointers) work
- Java\`s \`ArrayList\`, \`HashMap\`, \`String\` — all built on arrays internally

### Memory Model & Internal Representation

\`\`\`
╔══════════════════════════════════════════════════════════════════════════╗
║                    CONTIGUOUS vs LINKED MEMORY                         ║
╠══════════════════════════════════════════════════════════════════════════╣
║                                                                        ║
║  Array (contiguous):                                                   ║
║  ┌──────┬──────┬──────┬──────┬──────┐                                  ║
║  │  10  │  20  │  30  │  40  │  50  │   All in one cache line!         ║
║  └──────┴──────┴──────┴──────┴──────┘                                  ║
║  0x100   0x104  0x108  0x10C  0x110                                    ║
║                                                                        ║
║  Access arr[3]: base + 3 × 4 bytes = 0x100 + 12 = 0x10C → O(1)       ║
║                                                                        ║
║  Linked List (scattered):                                              ║
║  ┌────┐      ┌────┐      ┌────┐      ┌────┐                           ║
║  │ 10 │─────→│ 20 │─────→│ 30 │─────→│ 40 │                           ║
║  └────┘      └────┘      └────┘      └────┘                           ║
║  0x200       0x580       0x120       0x790                             ║
║  Each access = potential cache miss!                                   ║
╚══════════════════════════════════════════════════════════════════════════╝
\`\`\`

**Cache Locality Deep Dive:**
\`\`\`
CPU Cache Line = 64 bytes (typical)

When you access arr[0]:
┌─────────────────────────────────────────────────────────────┐
│ CPU loads 64 bytes starting from arr[0]\`s address           │
│                                                             │
│ For int[] (4 bytes each): 16 elements loaded for free!     │
│ arr[0] arr[1] arr[2] ... arr[15] ← all in cache now       │
│                                                             │
│ For long[] (8 bytes each): 8 elements loaded               │
│ For Object[] (8-byte refs): 8 references loaded            │
│   BUT the objects they point to? Scattered in heap!        │
└─────────────────────────────────────────────────────────────┘

This is why:
  ✓ int[] iteration is ~10x faster than LinkedList<Integer>
  ✓ Primitive arrays beat object arrays for numerical work
  ✓ Binary search on sorted array often beats HashMap in practice (for small n)
\`\`\`

### Java Class Hierarchy

\`\`\`
                    Iterable<E>
                        │
                   Collection<E>
                    ╱         ╲
              List<E>       Set<E>
             ╱      ╲
      ArrayList  LinkedList ← (also implements Deque)
         │
    Uses Object[] internally
    Default capacity: 10
    Growth factor: ~1.5x (newCap = oldCap + oldCap >> 1)

  String → backed by char[] (Java 8) or byte[] (Java 9+)
         → IMMUTABLE — every modification creates new object
         → String pool for literal deduplication

  StringBuilder → mutable char sequence, NOT thread-safe
  StringBuffer  → mutable char sequence, thread-safe (slower)
\`\`\`

### Dynamic Arrays — Amortized Analysis

Java\`s \`ArrayList\` grows by ~50% when full. Individual resizes cost O(n), but
across n insertions the total work is:

\`\`\`
Insertions:  1   2   3   4   5   6   7   8   9   ...  n
Capacity:    10  10  10  10  10  10  10  10  10  ...  grows
Cost:        1   1   1   1   1   1   1   1   1   ...  1 (usually)
             └── Occasionally O(n) when resize triggers ──┘

Total cost for n insertions = n + (10 + 15 + 22 + 33 + ...) ≈ 3n
Amortized cost per insertion = O(1)

Key insight: geometric growth (1.5x or 2x) guarantees amortized O(1).
Linear growth (+k each time) would degrade to O(n) amortized.
\`\`\`

### Strings in Java — Immutability

\`\`\`java
// DANGER: O(n²) — creates new String each iteration
String result = "";
for (int i = 0; i < n; i++) {
    result += words[i];  // new String object each time!
}

// CORRECT: O(n) — mutates in place
StringBuilder sb = new StringBuilder(estimatedSize);
for (int i = 0; i < n; i++) {
    sb.append(words[i]);
}
String result = sb.toString();
\`\`\`

\`\`\`
Why O(n²)?

Iteration 1: copy 1 char        → total work: 1
Iteration 2: copy 2 chars       → total work: 1 + 2
Iteration 3: copy 3 chars       → total work: 1 + 2 + 3
   ...
Iteration n: copy n chars       → total work: 1 + 2 + ... + n = n(n+1)/2 = O(n²)
\`\`\`

---

## 🔍 Visual Deep Dive

### Array Operations Visual

\`\`\`
INSERT at index 2 (value 99):
Before: [10, 20, 30, 40, 50]    size=5
                    ↓ shift right
After:  [10, 20, 99, 30, 40, 50] size=6
                 ↑ inserted
Cost: O(n) — must shift n-i elements

DELETE at index 1:
Before: [10, 20, 30, 40, 50]    size=5
             ↓ shift left
After:  [10, 30, 40, 50, _]     size=4
Cost: O(n) — must shift n-i-1 elements

APPEND (add to end):
Before: [10, 20, 30, _, _]      size=3, capacity=5
After:  [10, 20, 30, 40, _]     size=4, capacity=5
                     ↑ O(1) — no shifting needed
\`\`\`

### Two-Dimensional Array Memory Layout

\`\`\`
int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};

In Java, 2D arrays are arrays of arrays (not contiguous):

matrix ──→ [ref0, ref1, ref2]
              │      │      │
              ▼      ▼      ▼
            [1,2,3] [4,5,6] [7,8,9]
            (contiguous within each row, but rows may be scattered)

Row-major iteration (cache-friendly ✓):
  for (int i = 0; i < m; i++)
      for (int j = 0; j < n; j++)
          process(matrix[i][j]);    // sequential within row

Column-major iteration (cache-unfriendly ✗):
  for (int j = 0; j < n; j++)
      for (int i = 0; i < m; i++)
          process(matrix[i][j]);    // jumps between rows
\`\`\`

---

## ⚡ Key Algorithms & Techniques

### 1. Two Pointers

**Concept:** Use two index variables that move through the array, either from opposite ends
toward the center, or both from the same direction at different speeds.

**When to use:**
- Array is sorted (or can be sorted)
- Need to find pairs/triplets with a target sum
- In-place removal or deduplication
- Partitioning problems

#### Opposite-End Two Pointers: Container With Most Water

\`\`\`
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]

Step 1:  [1, 8, 6, 2, 5, 4, 8, 3, 7]   area = min(1,7) × 8 = 8
          L                          R    Move L (smaller height)

Step 2:  [1, 8, 6, 2, 5, 4, 8, 3, 7]   area = min(8,7) × 7 = 49 ← max
             L                       R    Move R

Step 3:  [1, 8, 6, 2, 5, 4, 8, 3, 7]   area = min(8,3) × 6 = 18
             L                    R       Move R

Step 4:  [1, 8, 6, 2, 5, 4, 8, 3, 7]   area = min(8,8) × 5 = 40
             L                 R          Move either (equal)

Step 5:  [1, 8, 6, 2, 5, 4, 8, 3, 7]   area = min(8,4) × 4 = 16
             L              R             Move R
  ... continue until L >= R

Answer: 49

Why move the shorter side? The width decreases by 1 each step.
The only way to get a larger area is to find a taller height.
Moving the taller pointer can never increase the area.
\`\`\`

\`\`\`java
// Container With Most Water — O(n) time, O(1) space
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxWater = 0;
    while (left < right) {
        int w = right - left;
        int h = Math.min(height[left], height[right]);
        maxWater = Math.max(maxWater, w * h);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxWater;
}
\`\`\`

**Time: O(n), Space: O(1)**

#### Opposite-End Two Pointers: 3Sum

\`\`\`
nums = [-1, 0, 1, 2, -1, -4]
Sorted: [-4, -1, -1, 0, 1, 2]

Fix i=0 (val=-4), find pair summing to 4 in rest:
  L=1, R=5: -1+2=1 < 4 → L++
  L=2, R=5: -1+2=1 < 4 → L++
  L=3, R=5: 0+2=2 < 4  → L++
  L=4, R=5: 1+2=3 < 4  → L++
  L=5 >= R → done, no triplet with -4

Fix i=1 (val=-1), find pair summing to 1 in rest:
  L=2, R=5: -1+2=1 = target → FOUND [-1,-1,2] → L++, R--
  L=3, R=4: 0+1=1 = target → FOUND [-1,0,1]  → L++, R--
  L=4 >= R → done

Fix i=2 (val=-1), SKIP (same as i=1 → avoid duplicate triplets)

Answer: [[-1,-1,2], [-1,0,1]]
\`\`\`

\`\`\`java
// 3Sum — O(n²) time, O(1) space (excluding output)
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicates
        int target = -nums[i];
        int lo = i + 1, hi = nums.length - 1;

        while (lo < hi) {
            int sum = nums[lo] + nums[hi];
            if (sum == target) {
                result.add(Arrays.asList(nums[i], nums[lo], nums[hi]));
                while (lo < hi && nums[lo] == nums[lo + 1]) lo++; // skip dups
                while (lo < hi && nums[hi] == nums[hi - 1]) hi--; // skip dups
                lo++; hi--;
            } else if (sum < target) lo++;
            else hi--;
        }
    }
    return result;
}
\`\`\`

**Time: O(n²), Space: O(1)**

#### Same-Direction Two Pointers: Remove Duplicates

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

\`\`\`java
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

**Time: O(n), Space: O(1)**

---

### 2. Sliding Window

**Concept:** Maintain a window [left, right] over the array. Expand right to include more
elements, shrink left to maintain constraints. Avoids re-computing from scratch each time.

**When to use:**
- "Contiguous subarray" or "substring" in the problem statement
- Finding min/max length subarray satisfying a condition
- Fixed-size window aggregations

#### Fixed-Size Window Template

\`\`\`
Window of size k=3 sliding over [2, 1, 5, 1, 3, 2]:

Step 1: [2, 1, 5] 1, 3, 2    sum=8   max=8
        └──────┘
Step 2:  2,[1, 5, 1] 3, 2    sum=7   max=8
           └──────┘   add 1, remove 2
Step 3:  2, 1,[5, 1, 3] 2    sum=9   max=9 ✓
              └──────┘   add 3, remove 1
Step 4:  2, 1, 5,[1, 3, 2]   sum=6   max=9
                 └──────┘   add 2, remove 5

Answer: max subarray sum of size 3 = 9
\`\`\`

\`\`\`java
// Fixed sliding window template — O(n) time, O(1) space
public int maxSumFixed(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i]; // init window

    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k]; // slide: add right, remove left
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
\`\`\`

#### Variable-Size Window Template

\`\`\`
Longest substring without repeating chars: "abcabcbb"

State: [left, right] window, set tracking chars in window

  a b c a b c b b
  LR                → add 'a', set={a}, len=1
  L R               → add 'b', set={a,b}, len=2
  L   R             → add 'c', set={a,b,c}, len=3  ★ max=3
  L     R           → 'a' in set! shrink: remove 'a', L++
    L   R           → set={b,c,a}, len=3  ★ max=3
    L     R         → 'b' in set! shrink: remove 'b', L++
      L   R         → 'c' in set! shrink: remove 'c', L++
        L R         → set={a,b,c}, len=3
        L   R       → 'b' in set! shrink until 'b' removed
          L R       → set={c,b}, len=2
          L   R     → 'b' in set! shrink
            LR      → set={b}, len=1
            L R     → 'b' in set! shrink
              LR    → set={b}, len=1

Answer: 3

Template pattern:
  left = 0
  for right in range(n):
      ADD nums[right] to window state
      while WINDOW_INVALID:
          REMOVE nums[left] from window state
          left++
      UPDATE answer with current window
\`\`\`

\`\`\`java
// Variable window — Longest substring without repeating characters
// O(n) time, O(min(n, charset)) space
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

\`\`\`java
// Variable window — Minimum window substring
// O(n) time, O(charset) space
public String minWindow(String s, String t) {
    int[] need = new int[128], have = new int[128];
    for (char c : t.toCharArray()) need[c]++;

    int required = 0;
    for (int n : need) if (n > 0) required++;

    int formed = 0, left = 0, minLen = Integer.MAX_VALUE, start = 0;

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

**Time: O(n), Space: O(1) (fixed 128-char array)**

---

### 3. Prefix Sum

**Concept:** Precompute cumulative sums so any range sum can be answered in O(1).
\`prefix[i] = nums[0] + nums[1] + ... + nums[i-1]\`
Range sum \`[l..r] = prefix[r+1] - prefix[l]\`

\`\`\`
nums:    [2,  4,  1,  3,  5]
index:    0   1   2   3   4

prefix:  [0,  2,  6,  7, 10, 15]
index:    0   1   2   3   4   5
          ↑                     ↑
       prefix[0]=0           prefix[5]=sum of all

Range sum [1..3] = prefix[4] - prefix[1] = 10 - 2 = 8
Verify: nums[1]+nums[2]+nums[3] = 4+1+3 = 8  ✓

Range sum [0..4] = prefix[5] - prefix[0] = 15 - 0 = 15
Verify: 2+4+1+3+5 = 15  ✓

Range sum [2..2] = prefix[3] - prefix[2] = 7 - 6 = 1
Verify: nums[2] = 1  ✓
\`\`\`

\`\`\`java
// Build prefix sum — O(n) time, O(n) space
int[] prefix = new int[nums.length + 1];
for (int i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
}
// Sum of nums[l..r] inclusive
int rangeSum = prefix[r + 1] - prefix[l];
\`\`\`

#### Advanced: Subarray Sum Equals K (Prefix Sum + HashMap)

\`\`\`
nums = [1, 2, 3, -2, 5], k = 3

Running sum:     1  3  6  4  9
At each index, check: does (runningSum - k) exist in map?

i=0: sum=1, need=1-3=-2, map={0:1}        → not found, add {0:1, 1:1}
i=1: sum=3, need=3-3=0,  map={0:1, 1:1}   → found! count=1 (subarray [1,2])
     add {0:1, 1:1, 3:1}
i=2: sum=6, need=6-3=3,  map={..., 3:1}   → found! count=2 (subarray [3] or [-2,5]?)
     Actually: prefix_sum[3]-prefix_sum[1] = 6-3 = 3, subarray is nums[2..2]=[3]
     add {0:1, 1:1, 3:1, 6:1}
i=3: sum=4, need=4-3=1,  map={..., 1:1}   → found! count=3 (subarray [2,3,-2])
i=4: sum=9, need=9-3=6,  map={..., 6:1}   → found! count=4 (subarray [-2,5])

Answer: 4 subarrays sum to 3
\`\`\`

\`\`\`java
// Count subarrays with sum == k — O(n) time, O(n) space
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> prefixCount = new HashMap<>();
    prefixCount.put(0, 1); // empty prefix
    int sum = 0, count = 0;
    for (int num : nums) {
        sum += num;
        count += prefixCount.getOrDefault(sum - k, 0);
        prefixCount.merge(sum, 1, Integer::sum);
    }
    return count;
}
\`\`\`

**Time: O(n), Space: O(n)**

---

### 4. Kadane\`s Algorithm

**Concept:** Find the maximum subarray sum in one pass. At each position, decide: extend
the current subarray or start a new one. If the running sum drops below the current element,
starting fresh is better.

**Step-by-step with tracking variables:**

\`\`\`
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

Index:  0    1    2    3    4    5    6    7    8
Value: -2    1   -3    4   -1    2    1   -5    4
───────────────────────────────────────────────────
curSum: -2   1   -2    4    3    5    6    1    5
maxSum: -2   1    1    4    4    5    6    6    6
Action: start new  ext  new  ext  ext  ext  ext  ext
                  ↑         ↑    ↑    ↑
                  reset  best subarray: [4,-1,2,1]=6

Detailed trace:
i=0: curSum = max(-2, 0+(-2))      = -2   maxSum = -2  (must start here)
i=1: curSum = max(1, -2+1=-1)      =  1   maxSum =  1  (start new at 1)
i=2: curSum = max(-3, 1+(-3)=-2)   = -2   maxSum =  1  (extend, though negative)
i=3: curSum = max(4, -2+4=2)       =  4   maxSum =  4  (start new at 4!)
i=4: curSum = max(-1, 4+(-1)=3)    =  3   maxSum =  4  (extend)
i=5: curSum = max(2, 3+2=5)        =  5   maxSum =  5  (extend)
i=6: curSum = max(1, 5+1=6)        =  6   maxSum =  6  (extend) ← ANSWER
i=7: curSum = max(-5, 6+(-5)=1)    =  1   maxSum =  6  (extend)
i=8: curSum = max(4, 1+4=5)        =  5   maxSum =  6  (extend)

Answer: 6 (subarray [4, -1, 2, 1])
\`\`\`

\`\`\`java
// Kadane's Algorithm — O(n) time, O(1) space
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], curSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curSum = Math.max(nums[i], curSum + nums[i]);
        maxSum = Math.max(maxSum, curSum);
    }
    return maxSum;
}

// Variant: also track the subarray boundaries
public int[] maxSubArrayWithBounds(int[] nums) {
    int maxSum = nums[0], curSum = nums[0];
    int start = 0, end = 0, tempStart = 0;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] > curSum + nums[i]) {
            curSum = nums[i];
            tempStart = i;
        } else {
            curSum += nums[i];
        }
        if (curSum > maxSum) {
            maxSum = curSum;
            start = tempStart;
            end = i;
        }
    }
    return new int[]{maxSum, start, end};
}
\`\`\`

---

### 5. Binary Search

**Concept:** Eliminate half the search space each step. Works on sorted arrays or any
problem with a monotonic predicate (if condition holds at x, it holds for all x\` > x).

#### Standard Binary Search

\`\`\`
Find 7 in [1, 3, 5, 7, 9, 11, 13]

Step 1: lo=0 hi=6 mid=3 → arr[3]=7 == 7 → FOUND at index 3

Find 6 in [1, 3, 5, 7, 9, 11, 13]

Step 1: lo=0 hi=6 mid=3 → arr[3]=7 > 6  → hi = 2
Step 2: lo=0 hi=2 mid=1 → arr[1]=3 < 6  → lo = 2
Step 3: lo=2 hi=2 mid=2 → arr[2]=5 < 6  → lo = 3
Step 4: lo=3 > hi=2     → NOT FOUND
\`\`\`

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

#### Lower Bound (First Position >= Target)

\`\`\`
Find first position >= 5 in [1, 3, 5, 5, 5, 8, 10]

Step 1: lo=0 hi=7 mid=3 → arr[3]=5 >= 5 → hi=3
Step 2: lo=0 hi=3 mid=1 → arr[1]=3 < 5  → lo=2
Step 3: lo=2 hi=3 mid=2 → arr[2]=5 >= 5 → hi=2
Step 4: lo=2 hi=2 mid=2 → arr[2]=5 >= 5 → hi=2
        lo=2 == hi=2 → answer: index 2
\`\`\`

\`\`\`java
// Lower bound: first index where nums[i] >= target
public int lowerBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] < target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// Upper bound: first index where nums[i] > target
public int upperBound(int[] nums, int target) {
    int lo = 0, hi = nums.length;
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] <= target) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}
\`\`\`

#### Binary Search on Answer (Search Space Reduction)

\`\`\`
Problem: Koko eating bananas — minimum speed k to eat all piles in h hours.
piles = [3, 6, 7, 11], h = 8

Search space: k ∈ [1, max(piles)] = [1, 11]

k=1:  ceil(3/1)+ceil(6/1)+ceil(7/1)+ceil(11/1) = 3+6+7+11 = 27 > 8  ✗
k=6:  ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6) = 1+1+2+2  = 6  ≤ 8  ✓
k=3:  ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3) = 1+2+3+4  = 10 > 8  ✗
k=4:  ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3  = 8  ≤ 8  ✓
k=3:  already checked, too slow

Binary search finds k=4 as the minimum valid speed.

The key insight: if speed k works, any speed > k also works.
→ Monotonic predicate → binary search applies!
\`\`\`

\`\`\`java
// Binary search on answer — O(n log m) where m = max(piles)
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
    for (int pile : piles) {
        hours += (pile + speed - 1) / speed; // ceil division
    }
    return hours <= h;
}
\`\`\`

---

### 6. Dutch National Flag (3-Way Partition)

**Concept:** Partition array into three groups using three pointers. Single pass, O(1) space.

\`\`\`
Sort Colors: [2, 0, 2, 1, 1, 0]

Three pointers: lo (boundary of 0s), mid (scanner), hi (boundary of 2s)

Invariant:
  [0..lo-1] = all 0s    (red zone)
  [lo..mid-1] = all 1s  (white zone)
  [mid..hi] = unexamined
  [hi+1..n-1] = all 2s  (blue zone)

Initial: lo=0, mid=0, hi=5
Array:   [2, 0, 2, 1, 1, 0]
          ↑                ↑
         mid              hi

Step 1: nums[mid]=2 → swap(mid,hi), hi--
Array:   [0, 0, 2, 1, 1, 2]  lo=0, mid=0, hi=4
                            ↑hi

Step 2: nums[mid]=0 → swap(lo,mid), lo++, mid++
Array:   [0, 0, 2, 1, 1, 2]  lo=1, mid=1, hi=4
          ↑lo,mid

Step 3: nums[mid]=0 → swap(lo,mid), lo++, mid++
Array:   [0, 0, 2, 1, 1, 2]  lo=2, mid=2, hi=4

Step 4: nums[mid]=2 → swap(mid,hi), hi--
Array:   [0, 0, 1, 1, 2, 2]  lo=2, mid=2, hi=3

Step 5: nums[mid]=1 → mid++
Array:   [0, 0, 1, 1, 2, 2]  lo=2, mid=3, hi=3

Step 6: nums[mid]=1 → mid++
Array:   [0, 0, 1, 1, 2, 2]  lo=2, mid=4, hi=3
         mid > hi → DONE!

Result: [0, 0, 1, 1, 2, 2] ✓
\`\`\`

\`\`\`java
// Dutch National Flag — O(n) time, O(1) space
public void sortColors(int[] nums) {
    int lo = 0, mid = 0, hi = nums.length - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            swap(nums, lo++, mid++);
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, hi--);
            // Don't advance mid — swapped element needs checking
        }
    }
}

private void swap(int[] a, int i, int j) {
    int tmp = a[i]; a[i] = a[j]; a[j] = tmp;
}
\`\`\`

---

### 7. String Techniques

#### Two-Pointer Palindrome Check

\`\`\`java
// Check if string is palindrome (ignoring non-alphanumeric) — O(n) time, O(1) space
public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
\`\`\`

#### Rabin-Karp Rolling Hash

\`\`\`
Pattern matching: text = "abcabcabc", pattern = "cab"

Hash function: h(s) = (s[0]×31² + s[1]×31 + s[2]) mod P

Initial:
  patHash = h("cab") = (99×961 + 97×31 + 98) = 98114
  txtHash = h("abc") = (97×961 + 98×31 + 99) = 96516

Slide window:
  i=0: txtHash=h("abc")=96516 ≠ 98114
  i=1: txtHash=h("bca")=...   ≠ 98114
       Rolling: remove \`a\` from front, add \`a\` to back
       txtHash = (txtHash - text[0]×31²) × 31 + text[3]
  i=2: txtHash=h("cab")=98114 = 98114 → verify chars → MATCH at i=2!

Key: O(1) per window shift (multiply, add, subtract)
     vs naive O(m) comparison per position
\`\`\`

\`\`\`java
// Rabin-Karp — O(n+m) average, O(n·m) worst
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

## 🎯 Pattern Recognition

### Problem Keywords → Technique

| Keywords / Signals | Technique | Why |
|---|---|---|
| "Sorted array", "pair that sums to" | Two pointers (opposite ends) | Sorted order lets us adjust sum |
| "Remove duplicates in-place" | Two pointers (same direction) | Slow writes, fast scans |
| "Contiguous subarray/substring" | Sliding window | Maintain running window state |
| "Sum of range", "subarray sum = K" | Prefix sum + HashMap | O(1) range queries |
| "Maximum/minimum subarray" | Kadane\`s algorithm | Optimal substructure |
| "Find in sorted array" | Binary search | Halve search space |
| "Minimum speed/capacity that works" | Binary search on answer | Monotonic predicate |
| "Partition into groups" | Dutch National Flag | 3-pointer technique |
| "Pattern in string" | Rabin-Karp / KMP | Rolling hash / failure function |
| "Rotate array" | Reverse trick | Three reverses = rotation |
| "Product except self" | Prefix/suffix product | Two-pass technique |
| "Trapping rain water" | Two pointers or stack | Track left/right max |
| "Anagram" | Frequency array/map | Character counting |

### Decision Flowchart

\`\`\`
Problem involves an array or string?
│
├── Is input sorted?
│   ├── YES → Two Pointers or Binary Search
│   └── NO → Can you sort it?
│       ├── YES and O(n log n) OK → Sort + Two Pointers
│       └── NO or need O(n) → HashMap / Prefix Sum
│
├── Contiguous subarray/substring needed?
│   ├── Fixed size k → Fixed Sliding Window
│   ├── Variable size with constraint → Variable Sliding Window
│   ├── Max/min subarray sum → Kadane\`s
│   └── Subarray count with sum=k → Prefix Sum + HashMap
│
├── Search for a value?
│   ├── Exact match in sorted array → Binary Search
│   ├── Find boundary (first/last) → Lower/Upper Bound
│   └── Find min/max feasible value → Binary Search on Answer
│
├── In-place modification?
│   ├── Partition/sort → Dutch National Flag
│   ├── Remove/move elements → Two Pointers (same dir)
│   └── Rotate → Reverse trick
│
└── String pattern matching?
    ├── Single pattern → KMP or Rabin-Karp
    ├── Anagram detection → Sliding window + freq array
    └── Multiple patterns → Trie or Aho-Corasick
\`\`\`

---

## 📊 Complexity Cheat Sheet

| Technique | Time | Space | Notes |
|---|---|---|---|
| Two Pointers (sorted) | O(n) | O(1) | Pair/triplet finding, partitioning |
| Two Pointers (3Sum) | O(n²) | O(1) | Fix one, two-pointer on rest |
| Prefix Sum (build) | O(n) | O(n) | One-time preprocessing |
| Prefix Sum (query) | O(1) | — | After preprocessing |
| Prefix Sum + HashMap | O(n) | O(n) | Subarray sum count |
| Kadane\`s | O(n) | O(1) | Maximum subarray sum |
| Dutch National Flag | O(n) | O(1) | 3-way partitioning |
| Sliding Window (fixed) | O(n) | O(1) | Fixed-size window |
| Sliding Window (variable) | O(n) | O(k)† | Variable-size window |
| Binary Search (standard) | O(log n) | O(1) | Sorted data |
| Binary Search (on answer) | O(n log m) | O(1) | m = search range |
| Rabin-Karp | O(n+m) avg | O(1) | Pattern matching |
| KMP | O(n+m) | O(m) | Pattern matching (guaranteed) |

† k = size of auxiliary set/map tracking window state

### Array Operation Complexities

| Operation | Array | ArrayList | String |
|---|---|---|---|
| Access by index | O(1) | O(1) | O(1) |
| Search (unsorted) | O(n) | O(n) | O(n) |
| Search (sorted) | O(log n) | O(log n) | — |
| Insert at end | — | O(1)* | O(n)† |
| Insert at index | — | O(n) | O(n)† |
| Delete at index | — | O(n) | O(n)† |
| Concatenation | — | — | O(n+m)† |

\\* Amortized  † Creates new object (immutable)

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Two Sum — From Brute Force to Optimal

**Problem:** Given an array \`nums\` and \`target\`, return indices of two numbers that sum to target.

**Step 1 — Understand:** Can there be duplicate values? (Yes.) Is the array sorted? (No.) Exactly one solution? (Yes.)

**Step 2 — Brute Force:**
\`\`\`java
// O(n²) time, O(1) space
for (int i = 0; i < n; i++)
    for (int j = i + 1; j < n; j++)
        if (nums[i] + nums[j] == target) return new int[]{i, j};
\`\`\`
"This works but is O(n²). Can we do better?"

**Step 3 — Optimize with HashMap:**
"For each number, I need to find its complement (target - num). A HashMap gives O(1) lookup."

\`\`\`
nums = [2, 7, 11, 15], target = 9

i=0: num=2, complement=7, map={}         → not found, store {2→0}
i=1: num=7, complement=2, map={2→0}      → FOUND! return [0, 1]
\`\`\`

**Step 4 — Code:**
\`\`\`java
// O(n) time, O(n) space
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{-1, -1};
}
\`\`\`

**Step 5 — Complexity:** Time O(n) — single pass. Space O(n) — HashMap stores up to n entries.

**Step 6 — Edge cases:** Empty array → no solution. Single element → no pair. Duplicate values → HashMap stores latest index, but we check before storing so the earlier index is in the map.

---

### Example 2: Trapping Rain Water — Three Approaches

**Problem:** Given \`height[]\` representing elevation, compute trapped rainwater.

\`\`\`
height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

Visual:
                              █
              █ ░ ░ ░ ░ ░ ░ █ █
     █ ░ ░ █ █ ░ █ ░ █ ░ █ █ █ █
  ───█───█─█─█─█─█─█─█─█─█─█─█───
     1  0  2  1  0  1  3  2  1  2  1

█ = wall, ░ = trapped water

Water at each position = min(maxLeft, maxRight) - height[i]
\`\`\`

**Approach 1: Precompute Left/Right Max Arrays — O(n) time, O(n) space**

\`\`\`java
public int trap(int[] height) {
    int n = height.length;
    int[] leftMax = new int[n], rightMax = new int[n];

    leftMax[0] = height[0];
    for (int i = 1; i < n; i++)
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);

    rightMax[n - 1] = height[n - 1];
    for (int i = n - 2; i >= 0; i--)
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);

    int water = 0;
    for (int i = 0; i < n; i++)
        water += Math.min(leftMax[i], rightMax[i]) - height[i];
    return water;
}
\`\`\`

**Approach 2: Two Pointers — O(n) time, O(1) space**

\`\`\`
Key insight: We only need the MINIMUM of leftMax and rightMax.
If height[left] < height[right], leftMax determines water at left.

height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]

L=0 R=11: h[L]=0 < h[R]=1 → leftMax=0, water+=0-0=0. L++
L=1 R=11: h[L]=1 >= h[R]=1 → rightMax=1, water+=1-1=0. R--
L=1 R=10: h[L]=1 < h[R]=2 → leftMax=1, water+=1-1=0. L++
L=2 R=10: h[L]=0 < h[R]=2 → leftMax=1, water+=1-0=1. L++
L=3 R=10: h[L]=2 >= h[R]=2 → rightMax=2, water+=2-2=0. R--
L=3 R=9:  h[L]=2 > h[R]=1 → rightMax=2, water+=2-1=1. R--
...continues...

Total water = 6
\`\`\`

\`\`\`java
// Two-pointer — O(n) time, O(1) space
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

**Approach 3: Monotonic Stack — O(n) time, O(n) space**

\`\`\`java
public int trapStack(int[] height) {
    Deque<Integer> stack = new ArrayDeque<>();
    int water = 0;
    for (int i = 0; i < height.length; i++) {
        while (!stack.isEmpty() && height[i] > height[stack.peek()]) {
            int bottom = stack.pop();
            if (stack.isEmpty()) break;
            int left = stack.peek();
            int w = i - left - 1;
            int h = Math.min(height[i], height[left]) - height[bottom];
            water += w * h;
        }
        stack.push(i);
    }
    return water;
}
\`\`\`

---

### Example 3: Longest Substring Without Repeating Characters

**Problem:** Find the length of the longest substring without repeating characters.

**Thought process:**
1. "Substring" = contiguous → think sliding window
2. "Without repeating" = constraint on window validity
3. Variable-size window: expand right, shrink left when duplicate found

\`\`\`
s = "abcabcbb"

right=0: char='a', window="a",     set={a},     len=1, max=1
right=1: char='b', window="ab",    set={a,b},   len=2, max=2
right=2: char='c', window="abc",   set={a,b,c}, len=3, max=3
right=3: char='a', 'a' in set!
         → move left until 'a' removed: left=1
         window="bca", set={b,c,a}, len=3, max=3
right=4: char='b', 'b' in set!
         → move left until 'b' removed: left=2
         window="cab", set={c,a,b}, len=3, max=3
right=5: char='c', 'c' in set!
         → move left until 'c' removed: left=3
         window="abc", set={a,b,c}, len=3, max=3
right=6: char='b', 'b' in set!
         → move left until 'b' removed: left=5
         window="cb", set={c,b}, len=2, max=3
right=7: char='b', 'b' in set!
         → move left until 'b' removed: left=7
         window="b", set={b}, len=1, max=3

Answer: 3
\`\`\`

\`\`\`java
// Optimal: HashMap tracks last seen index — O(n) time
public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
            left = lastSeen.get(c) + 1; // jump left past the duplicate
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

---

### Example 4: Product of Array Except Self

**Problem:** Return an array where result[i] = product of all elements except nums[i]. No division allowed.

**Thought process:**
1. No division → can\`t just compute total product and divide
2. result[i] = (product of left side) × (product of right side)
3. Two passes: forward for prefix products, backward for suffix products

\`\`\`
nums =   [1, 2, 3, 4]

Forward pass (prefix products):
result = [1, 1, 2, 6]     result[i] = product of nums[0..i-1]

Backward pass (suffix products):
suffix = 1
i=3: result[3] = 6 × 1 = 6,   suffix = 1 × 4 = 4
i=2: result[2] = 2 × 4 = 8,   suffix = 4 × 3 = 12
i=1: result[1] = 1 × 12 = 12, suffix = 12 × 2 = 24
i=0: result[0] = 1 × 24 = 24, suffix = 24 × 1 = 24

result = [24, 12, 8, 6]  ✓
\`\`\`

\`\`\`java
// O(n) time, O(1) extra space (output doesn't count)
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];

    result[0] = 1;
    for (int i = 1; i < n; i++) {
        result[i] = result[i - 1] * nums[i - 1]; // prefix product
    }

    int suffix = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= suffix;
        suffix *= nums[i]; // suffix product
    }
    return result;
}
\`\`\`

---

## ⚠️ Common Mistakes

1. **Off-by-one in binary search:** Use \`lo <= hi\` for standard search (inclusive bounds), \`lo < hi\` for boundary finding (converging bounds). Test with 1-element and 2-element arrays.

2. **Integer overflow in mid calculation:** \`(lo + hi) / 2\` overflows when lo+hi > Integer.MAX_VALUE. Always use \`lo + (hi - lo) / 2\`.

3. **Modifying array while iterating with index:** Track insertion position separately with a slow pointer.

4. **Forgetting Java Strings are immutable:** \`s += "x"\` in a loop is O(n²). Use \`StringBuilder\`.

5. **Not considering negative numbers:** Affects Kadane\`s (all-negative arrays), prefix sums (negative prefix possible), and two-sum (complement could be negative).

6. **Using \`==\` to compare Strings:** Always use \`.equals()\`. \`==\` compares references, not content. Only works for string literals in the string pool.

7. **Array index out of bounds in sliding window:** Ensure \`right < n\` before accessing \`nums[right]\`, and \`left >= 0\` before accessing \`nums[left]\`. Check window boundaries when k > array length.

8. **Assuming sorted input:** Always clarify with interviewer. If sorting is allowed, it changes the approach (O(n log n) sort + O(n) two pointers vs O(n) HashMap).

---

## 💡 Java-Specific Tips

### Sorting
\`\`\`java
// Primitives: Dual-pivot Quicksort (not stable, O(n²) worst case)
Arrays.sort(intArray);

// Objects: TimSort (stable, O(n log n) guaranteed)
Arrays.sort(objectArray);
Arrays.sort(arr, Comparator.comparingInt(a -> a[0])); // 2D array

// DANGER: Comparator overflow
// BAD:  (a, b) -> a - b  (overflows for large values!)
// GOOD: Integer.compare(a, b) or Comparator.comparingInt(...)
\`\`\`

### Useful Utilities
\`\`\`java
// Array operations
Arrays.fill(arr, 0);                    // fill entire array
Arrays.copyOfRange(arr, from, to);      // sub-array copy (exclusive end)
Arrays.stream(arr).sum();               // sum of int array
Arrays.stream(arr).max().getAsInt();    // max element

// String operations
s.toCharArray();                        // String → char[]
String.valueOf(charArray);              // char[] → String
s.substring(start, end);               // substring (exclusive end)
Character.isLetterOrDigit(c);          // alphanumeric check
Character.toLowerCase(c);              // case conversion

// Collections
Collections.reverse(list);             // reverse in-place
Collections.swap(list, i, j);          // swap two elements

// Integer tricks
Integer.compare(a, b);                 // safe comparison
Math.floorDiv(a, b);                   // floor division (handles negatives)
Math.ceilDiv(a, b);                    // ceil division (Java 18+)
(a + b - 1) / b;                       // ceil division trick
\`\`\`

### StringBuilder Methods
\`\`\`java
StringBuilder sb = new StringBuilder("hello");
sb.append(" world");           // "hello world"
sb.insert(5, ",");             // "hello, world"
sb.delete(5, 6);               // "hello world"
sb.reverse();                  // "dlrow olleh"
sb.charAt(0);                  // 'd'
sb.setCharAt(0, 'D');          // "Dlrow olleh"
sb.length();                   // 11
sb.toString();                 // convert to String
\`\`\`

### Common Conversions
\`\`\`java
// int[] ↔ List<Integer>
List<Integer> list = Arrays.stream(arr).boxed().collect(Collectors.toList());
int[] arr = list.stream().mapToInt(Integer::intValue).toArray();

// String ↔ int
int n = Integer.parseInt("123");
String s = String.valueOf(123);   // or Integer.toString(123)

// char ↔ int (ASCII)
int ascii = 'a';                  // 97
char c = (char) 97;              // 'a'
int digitVal = c - '0';          // char digit to int
\`\`\`

---

## 🔗 Comparison Tables

### ArrayList vs LinkedList vs Array

| Feature | int[] | ArrayList | LinkedList |
|---|---|---|---|
| Random access | O(1) | O(1) | O(n) |
| Insert at end | N/A (fixed) | O(1)* | O(1) |
| Insert at index | N/A | O(n) | O(n) traverse + O(1) splice |
| Delete at index | N/A | O(n) | O(n) traverse + O(1) splice |
| Memory | Compact, cache-friendly | Compact + resize overhead | Node objects, poor cache |
| Null elements | N/A (primitive) | Yes | Yes |
| When to use | Fixed size, primitives | Default choice | Rare — deque only |

\\* Amortized

### Sorting Algorithm Comparison

| Algorithm | Best | Average | Worst | Space | Stable? | Java Usage |
|---|---|---|---|---|---|---|
| Arrays.sort(int[]) | O(n log n) | O(n log n) | O(n²) | O(log n) | No | Dual-pivot QS |
| Arrays.sort(Object[]) | O(n) | O(n log n) | O(n log n) | O(n) | Yes | TimSort |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | — |
| Quick Sort | O(n log n) | O(n log n) | O(n²) | O(log n) | No | — |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | Manual |

### String Comparison Methods

| Method | Time | When to Use |
|---|---|---|
| \`s.equals(t)\` | O(n) | Exact equality |
| \`s.compareTo(t)\` | O(n) | Lexicographic ordering |
| \`s.contains(t)\` | O(n·m) | Substring check |
| Sorting + compare | O(n log n) | Anagram check |
| Frequency array [26] | O(n) | Anagram check (lowercase only) |
| \`s.hashCode()\` | O(n) | Fast pre-check (not sufficient alone) |

### When to Use Each Technique

| Situation | Best Technique | Alternative |
|---|---|---|
| Find pair with target sum (unsorted) | HashMap | Sort + Two Pointers |
| Find pair with target sum (sorted) | Two Pointers | Binary Search |
| Count subarrays with sum K | Prefix Sum + HashMap | — |
| Max subarray sum | Kadane\`s | Divide & Conquer O(n log n) |
| Find element in sorted array | Binary Search | — |
| Min feasible value | Binary Search on Answer | — |
| Fixed-size subarray aggregate | Fixed Sliding Window | — |
| Longest valid substring | Variable Sliding Window | — |
| Sort 0s, 1s, 2s | Dutch National Flag | Counting Sort |
| Pattern matching | Rabin-Karp / KMP | Brute force O(nm) |

---

## 🔍 Additional Code: Matrix Traversal

### Spiral Order
\`\`\`java
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

### Rotate Array In-Place
\`\`\`java
// Rotate right by k — O(n) time, O(1) space
// Trick: reverse all, reverse first k, reverse rest
public void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n;
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

### Move Zeroes
\`\`\`java
// O(n) time, O(1) space
public void moveZeroes(int[] nums) {
    int insertPos = 0;
    for (int num : nums) {
        if (num != 0) nums[insertPos++] = num;
    }
    while (insertPos < nums.length) nums[insertPos++] = 0;
}
\`\`\`
`,
  },
  {
    slug: 'linked-lists',
    title: 'Linked Lists',
    icon: 'Link',
    description: 'Navigate pointer-based data structures with techniques like reversal, runner pattern, and cycle detection.',
    color: 'blue',
    content: `# Linked Lists — Deep Dive Guide

## 📌 Core Concepts

### What Is a Linked List?

A **linked list** is a linear data structure where elements (nodes) are connected by pointers.
Unlike arrays, nodes are **scattered in memory** — each node stores its data and a reference
to the next node. This makes insertion/deletion O(1) at known positions but sacrifices
random access (O(n) to reach the kth element).

**Why it matters for interviews:**
- Tests pointer manipulation skills — the #1 source of bugs in interviews
- Foundation for many advanced structures (LRU cache, skip lists, hash chain collision)
- ~15% of coding interview problems involve linked lists

### Node Structure & Memory Model

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

\`\`\`
╔══════════════════════════════════════════════════════════════════════╗
║                    MEMORY LAYOUT COMPARISON                        ║
╠══════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║  Array (contiguous — cache-friendly):                              ║
║  ┌──────┬──────┬──────┬──────┐                                     ║
║  │  10  │  20  │  30  │  40  │  All elements in adjacent memory    ║
║  └──────┴──────┴──────┴──────┘                                     ║
║  0x100   0x104  0x108  0x10C                                       ║
║                                                                    ║
║  Linked List (scattered — cache-unfriendly):                       ║
║                                                                    ║
║  head                                                              ║
║   ↓                                                                ║
║  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     ║
║  │ val: 10  │    │ val: 20  │    │ val: 30  │    │ val: 40  │     ║
║  │ next: ───┼──→ │ next: ───┼──→ │ next: ───┼──→ │ next:null│     ║
║  └──────────┘    └──────────┘    └──────────┘    └──────────┘     ║
║   @0x200          @0x580          @0x120          @0x790           ║
║                                                                    ║
║  Each node = separate heap allocation                              ║
║  Following a pointer = potential cache miss                        ║
║  Extra memory: ~16 bytes overhead per node (object header + ref)   ║
╚══════════════════════════════════════════════════════════════════════╝
\`\`\`

### Singly vs Doubly vs Circular

\`\`\`
Singly Linked:
  head → [A] → [B] → [C] → [D] → null
  ✓ Simple, less memory
  ✗ Can only traverse forward
  ✗ Deletion requires predecessor

Doubly Linked:
  null ← [A] ⇄ [B] ⇄ [C] ⇄ [D] → null
         head                 tail
  ✓ Bidirectional traversal
  ✓ O(1) delete given node pointer
  ✗ More memory (two pointers per node)
  Use: LRU Cache, browser history, deques

Circular Singly:
  head → [A] → [B] → [C] → [D] ──┐
          ↑                         │
          └─────────────────────────┘
  ✓ No null checks for end
  Use: Round-robin scheduling, circular buffer

Circular Doubly:
  ┌──→ [A] ⇄ [B] ⇄ [C] ⇄ [D] ──┐
  │     ↑                          │
  │     └──────────────────────────┘
  └── (D.next = A, A.prev = D)
  Use: Josephus problem, doubly-ended circular buffer
\`\`\`

### Java Class Hierarchy

\`\`\`
                   Iterable<E>
                       │
                  Collection<E>
                   ╱         ╲
             List<E>       Queue<E> ─── Deque<E>
            ╱      ╲                     ╱
     ArrayList   LinkedList ←────────────
                     │
            Implements: List, Deque, Queue
            Backed by: Doubly linked list
            
  java.util.LinkedList:
    - addFirst/addLast: O(1)
    - removeFirst/removeLast: O(1)
    - get(index): O(n) — traverses from closer end
    - contains: O(n)
    
  In practice: Almost always prefer ArrayList.
  LinkedList only for pure deque operations.
\`\`\`

---

## 🔍 Visual Deep Dive

### Singly Linked List Operations

\`\`\`
INSERT at head (prepend):
  Before:  head → [B] → [C] → null
  After:   head → [A] → [B] → [C] → null
                   ↑ new node
  Code: newNode.next = head; head = newNode;
  Time: O(1)

INSERT at tail (append with tail pointer):
  Before:  head → [A] → [B] → null   tail = [B]
  After:   head → [A] → [B] → [C] → null   tail = [C]
  Code: tail.next = newNode; tail = newNode;
  Time: O(1) with tail pointer, O(n) without

INSERT after node X:
  Before:  ... → [X] → [Y] → ...
  After:   ... → [X] → [NEW] → [Y] → ...
  Code: newNode.next = X.next; X.next = newNode;
  Time: O(1) given pointer to X

DELETE node (given prev pointer):
  Before:  ... → [prev] → [target] → [next] → ...
  After:   ... → [prev] → [next] → ...
  Code: prev.next = target.next;
  Time: O(1) given prev, O(n) to find prev
\`\`\`

### Doubly Linked List Operations

\`\`\`
INSERT after node X:
  Before:  ... ⇄ [X] ⇄ [Y] ⇄ ...
  
  Step 1: newNode.prev = X
  Step 2: newNode.next = X.next
  Step 3: X.next.prev = newNode
  Step 4: X.next = newNode
  
  After:   ... ⇄ [X] ⇄ [NEW] ⇄ [Y] ⇄ ...
  Time: O(1)

DELETE node (given direct pointer):
  Before:  ... ⇄ [A] ⇄ [TARGET] ⇄ [B] ⇄ ...
  
  Step 1: TARGET.prev.next = TARGET.next
  Step 2: TARGET.next.prev = TARGET.prev
  
  After:   ... ⇄ [A] ⇄ [B] ⇄ ...
  Time: O(1) — no need to find predecessor!
\`\`\`

---

## ⚡ Key Algorithms & Techniques

### 1. In-Place Reversal

**Concept:** Reverse the linked list by redirecting \`next\` pointers. Use three pointers:
\`prev\`, \`curr\`, \`next\`. This is a sub-routine used in many problems.

**Step-by-step visualization with 3 pointers:**

\`\`\`
Original:  1 → 2 → 3 → 4 → null
           prev=null, curr=1

╔═══════════════════════════════════════════════════════════════╗
║ Step 1: Save next. Redirect curr.next to prev. Advance.     ║
║                                                               ║
║   null    1 → 2 → 3 → 4 → null                              ║
║    ↑      ↑   ↑                                               ║
║   prev  curr next                                             ║
║                                                               ║
║   After: null ← 1    2 → 3 → 4 → null                       ║
║                  ↑    ↑                                       ║
║                 prev curr                                     ║
╠═══════════════════════════════════════════════════════════════╣
║ Step 2:                                                       ║
║   null ← 1    2 → 3 → 4 → null                              ║
║          ↑    ↑   ↑                                           ║
║         prev curr next                                        ║
║                                                               ║
║   After: null ← 1 ← 2    3 → 4 → null                      ║
║                      ↑    ↑                                   ║
║                     prev curr                                 ║
╠═══════════════════════════════════════════════════════════════╣
║ Step 3:                                                       ║
║   null ← 1 ← 2    3 → 4 → null                             ║
║               ↑    ↑   ↑                                      ║
║              prev curr next                                   ║
║                                                               ║
║   After: null ← 1 ← 2 ← 3    4 → null                      ║
║                          ↑    ↑                               ║
║                         prev curr                             ║
╠═══════════════════════════════════════════════════════════════╣
║ Step 4:                                                       ║
║   null ← 1 ← 2 ← 3    4 → null                             ║
║                    ↑    ↑   ↑                                 ║
║                   prev curr next                              ║
║                                                               ║
║   After: null ← 1 ← 2 ← 3 ← 4                              ║
║                               ↑  ↑                            ║
║                              prev curr=null → STOP            ║
║                                                               ║
║   Return prev (new head = 4)                                  ║
╚═══════════════════════════════════════════════════════════════╝
\`\`\`

\`\`\`java
// Iterative reversal — O(n) time, O(1) space
public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode next = curr.next; // save
        curr.next = prev;          // reverse
        prev = curr;               // advance prev
        curr = next;               // advance curr
    }
    return prev; // new head
}

// Recursive reversal — O(n) time, O(n) space (call stack)
public ListNode reverseListRecursive(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseListRecursive(head.next);
    head.next.next = head;  // make next node point back
    head.next = null;        // remove forward pointer
    return newHead;
}
\`\`\`

#### Reverse a Sublist (Between Positions)

\`\`\`java
// Reverse nodes between position left and right — O(n) time, O(1) space
public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    for (int i = 1; i < left; i++) prev = prev.next;

    ListNode curr = prev.next;
    for (int i = 0; i < right - left; i++) {
        ListNode next = curr.next;
        curr.next = next.next;
        next.next = prev.next;
        prev.next = next;
    }
    return dummy.next;
}
\`\`\`

---

### 2. Floyd\`s Cycle Detection

**Concept:** Use two pointers moving at different speeds (slow=1 step, fast=2 steps).
If there\`s a cycle, they will eventually meet. If no cycle, fast reaches null.

#### Why It Works — Mathematical Proof

\`\`\`
List with cycle:

  ── F nodes ──    ── a ──
  1 → 2 → 3 → 4 → 5 → 6
                   ↑       ↓    Cycle length = C
                   8 ← 7 ←─┘
                   └── C-a ──┘

Let:
  F = distance from head to cycle entrance
  C = cycle length
  a = distance from cycle entrance to meeting point

When slow and fast meet:
  • slow traveled: F + a steps
  • fast traveled: F + a + k·C steps (k full loops, k ≥ 1)
  • fast = 2 × slow: 2(F + a) = F + a + k·C
  • Simplify: F + a = k·C
  • Therefore: F = k·C - a = (k-1)·C + (C - a)

This means:
  Starting from meeting point, walking F more steps
  = (k-1) full loops + (C-a) more steps
  = arrives at cycle entrance!

  Starting from head, walking F steps
  = arrives at cycle entrance!

  → Move one pointer from head, one from meeting point,
    both at speed 1. They meet at cycle entrance!
\`\`\`

#### Visual Walkthrough

\`\`\`
List with cycle:

 1 → 2 → 3 → 4 → 5
              ↑       ↓
              8 ← 7 ← 6

F=2 (head to entry node 3), C=6 (cycle: 3→4→5→6→7→8→3)

Phase 1 — Detect cycle:
  Step 0: S=1, F=1
  Step 1: S=2, F=3
  Step 2: S=3, F=5
  Step 3: S=4, F=7
  Step 4: S=5, F=3  (fast looped around)
  Step 5: S=6, F=5
  Step 6: S=7, F=7  ← MEET! Cycle confirmed.

Phase 2 — Find cycle entrance:
  entry=1(head), slow=7
  Step 1: entry=2, slow=8
  Step 2: entry=3, slow=3  ← MEET! Cycle starts at node 3.
\`\`\`

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

---

### 3. Dummy Head Pattern

**Concept:** Create a sentinel node before the real head. This eliminates all special-case
handling for operations that might modify the head.

\`\`\`
WITHOUT dummy head (error-prone):           WITH dummy head (clean):

  if (head == null) return null;              dummy → [1] → [2] → [3]
  if (head.val == target) {                    ↑
      head = head.next;                        always start iteration here
      // but what if new head also matches?    return dummy.next at end
      // need another check...
  }
  
  // Even more complex for "remove all
  // occurrences" or "insert at sorted pos"

  RULE: If the head might change, use a dummy node.
\`\`\`

\`\`\`
Visual: Remove all nodes with value 2

Without dummy:                   With dummy:
Input:  [2] → [2] → [1] → [3]  Input: dummy → [2] → [2] → [1] → [3]

Need special case for head=2     prev = dummy
Then another for new head=2      prev.next.val==2? skip. prev.next.val==2? skip.
Complex and bug-prone!           prev.next.val==1? advance. prev.next.val==3? advance.
                                 Return dummy.next = [1] → [3]  ✓
\`\`\`

\`\`\`java
// Remove all nodes with value val — clean code via dummy head
public ListNode removeElements(ListNode head, int val) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;

    while (prev.next != null) {
        if (prev.next.val == val) {
            prev.next = prev.next.next; // skip the node
        } else {
            prev = prev.next;
        }
    }
    return dummy.next; // NOT head — head may have been removed!
}
\`\`\`

---

### 4. Merge Pattern

**Concept:** Merge two sorted lists by comparing heads and picking the smaller one.
Uses a dummy head for clean code.

\`\`\`
Merge [1→3→5] and [2→4→6]:

dummy → ?

Step 1: Compare 1 vs 2 → pick 1.  dummy → 1
        l1 = 3, l2 = 2
Step 2: Compare 3 vs 2 → pick 2.  dummy → 1 → 2
        l1 = 3, l2 = 4
Step 3: Compare 3 vs 4 → pick 3.  dummy → 1 → 2 → 3
        l1 = 5, l2 = 4
Step 4: Compare 5 vs 4 → pick 4.  dummy → 1 → 2 → 3 → 4
        l1 = 5, l2 = 6
Step 5: Compare 5 vs 6 → pick 5.  dummy → 1 → 2 → 3 → 4 → 5
        l1 = null, l2 = 6
Step 6: l1 is null → append l2.   dummy → 1 → 2 → 3 → 4 → 5 → 6

Return dummy.next
\`\`\`

\`\`\`java
// Merge two sorted lists — O(n+m) time, O(1) space
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), tail = dummy;
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

// Merge K sorted lists — O(N log k) time, O(k) space
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

---

### 5. Runner Technique (Slow/Fast Pointer)

**Concept:** Two pointers moving at different speeds reveal structural information.
Slow moves 1 step, fast moves 2 steps.

#### Finding the Middle Node

\`\`\`
Odd length: 1 → 2 → 3 → 4 → 5 → null

  Step 0: S=1, F=1
  Step 1: S=2, F=3
  Step 2: S=3, F=5   F.next = null → STOP
  Middle = 3  ✓

Even length: 1 → 2 → 3 → 4 → null

  Variant A (first middle):
  while (fast.next != null && fast.next.next != null)
  Step 0: S=1, F=1
  Step 1: S=2, F=3   F.next.next = null → STOP
  Middle = 2 (first of two middles)  ✓

  Variant B (second middle):
  while (fast != null && fast.next != null)
  Step 0: S=1, F=1
  Step 1: S=2, F=3
  Step 2: S=3, F=null (past end) → STOP
  Middle = 3 (second of two middles)  ✓
\`\`\`

\`\`\`java
// Find middle — first middle for even-length lists
public ListNode findMiddle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}
\`\`\`

#### Palindrome Check Using Runner

\`\`\`
Input: 1 → 2 → 2 → 1

Step 1: Find middle using slow/fast → middle = node 2 (first)
        1 → 2 → 2 → 1
             ↑ mid

Step 2: Reverse second half (after mid):
        1 → 2 → 2 ← 1
             ↑ mid   ↑ reversed
        Second half head = 1

Step 3: Compare first half with reversed second half:
        p1 = 1 → 2       p2 = 1 → 2 → null
        1 == 1 ✓
        2 == 2 ✓
        p2 = null → DONE

Step 4: Restore list (optional but good practice):
        Re-reverse second half
\`\`\`

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
    mid.next = reverseList(secondHalf); // restore
    return result;
}
\`\`\`

---

### 6. Deep Copy with Random Pointers

**Concept:** Clone a linked list where each node has a \`next\` and a \`random\` pointer.
The random pointer can point to any node in the list or null.

#### Approach 1: HashMap — O(n) time, O(n) space
\`\`\`java
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

#### Approach 2: Interweaving — O(n) time, O(1) space

\`\`\`
Step 1: Insert copy after each original node
  Before:  A → B → C → null       (each has random pointers)
  After:   A → A' → B → B' → C → C' → null

Step 2: Set random pointers on copies
  For each original node:
    copy.random = original.random.next
  (original.random.next IS the copy of the random target!)

Step 3: Separate the two interleaved lists
  Original: A → B → C → null
  Copy:     A' → B' → C' → null
\`\`\`

\`\`\`java
public Node copyRandomList(Node head) {
    if (head == null) return null;

    // Step 1: Interleave copies
    Node curr = head;
    while (curr != null) {
        Node copy = new Node(curr.val);
        copy.next = curr.next;
        curr.next = copy;
        curr = copy.next;
    }

    // Step 2: Set random pointers
    curr = head;
    while (curr != null) {
        if (curr.random != null) {
            curr.next.random = curr.random.next;
        }
        curr = curr.next.next;
    }

    // Step 3: Separate lists
    Node dummy = new Node(0);
    Node copyTail = dummy;
    curr = head;
    while (curr != null) {
        copyTail.next = curr.next;
        copyTail = copyTail.next;
        curr.next = copyTail.next;
        curr = curr.next;
    }
    return dummy.next;
}
\`\`\`

---

## 🎯 Pattern Recognition

### Problem Keywords → Technique

| Keywords / Signals | Technique | Why |
|---|---|---|
| "Reverse a linked list" or portion | In-place reversal (3 pointers) | Redirect pointers |
| "Detect cycle", "find loop" | Floyd\`s slow/fast | O(1) space cycle detection |
| "Find middle node" | Slow/fast pointer | Fast reaches end when slow at middle |
| "Merge sorted lists" | Two-pointer merge + dummy | Compare heads, pick smaller |
| "Kth from end", "Nth from end" | Two-pointer gap technique | Advance fast k steps first |
| "Palindrome linked list" | Find middle + reverse half + compare | Combines techniques |
| "Intersection of two lists" | Two-pointer redirect trick | Equalize path lengths |
| "Flatten / deep copy with random" | HashMap or interleaving | Map originals to copies |
| "Remove duplicates" | Two pointers or set | Skip matching values |
| "Reorder list" (L0→Ln→L1→Ln-1) | Middle + reverse second half + merge | Combines techniques |
| "Sort linked list" | Merge sort (split + merge) | Natural for linked lists |
| "LRU Cache" | HashMap + Doubly linked list | O(1) access + O(1) removal |

### Decision Flowchart

\`\`\`
Linked list problem?
│
├── Involves cycle?
│   ├── Detect → Floyd\`s slow/fast
│   └── Find start → Floyd\`s phase 2
│
├── Involves ordering/sorting?
│   ├── Merge sorted → Two-pointer merge
│   └── Sort list → Merge sort (split with slow/fast + merge)
│
├── Involves reversal?
│   ├── Full reverse → Iterative (prev/curr/next)
│   ├── Partial reverse → Reverse between positions
│   └── k-group reverse → Count k + reverse group + connect
│
├── Involves position?
│   ├── Middle → Slow/fast pointer
│   ├── Kth from end → Two-pointer gap (advance fast k steps)
│   └── Intersection → Two-pointer redirect
│
├── Involves reordering?
│   ├── Palindrome → Middle + reverse + compare
│   ├── Reorder list → Middle + reverse second + merge
│   └── Partition → Two chains (before/after)
│
└── Design problem?
    ├── LRU Cache → Doubly linked list + HashMap
    ├── Flatten list → Recursion or iteration
    └── Copy with random → HashMap or interleaving
\`\`\`

---

## 📊 Complexity Cheat Sheet

### Linked List Operations

| Operation | Singly | Doubly |
|---|---|---|
| Access by index | O(n) | O(n) |
| Insert at head | O(1) | O(1) |
| Insert at tail (with tail ptr) | O(1) | O(1) |
| Insert after given node | O(1) | O(1) |
| Delete head | O(1) | O(1) |
| Delete given node | O(n)† | O(1) |
| Delete tail (with tail ptr) | O(n)† | O(1) |
| Search | O(n) | O(n) |
| Reverse | O(n) | O(n) |

† Singly linked requires traversal to find predecessor.

### Algorithm Complexities

| Algorithm | Time | Space |
|---|---|---|
| Reverse (iterative) | O(n) | O(1) |
| Reverse (recursive) | O(n) | O(n) stack |
| Floyd\`s cycle detection | O(n) | O(1) |
| Floyd\`s cycle entrance | O(n) | O(1) |
| Find middle (slow/fast) | O(n) | O(1) |
| Merge two sorted | O(n+m) | O(1) |
| Merge K sorted (heap) | O(N log k) | O(k) |
| Merge sort on list | O(n log n) | O(log n) stack |
| Copy with random (hash) | O(n) | O(n) |
| Copy with random (weave) | O(n) | O(1) |

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Reverse Nodes in K-Groups

**Problem:** Reverse every k consecutive nodes. If remaining < k, leave as-is.

\`\`\`
Input: 1 → 2 → 3 → 4 → 5 → null, k=3

Step 1: Check 3 nodes from head? Yes (1,2,3).
  Before group reversal:
    dummy → 1 → 2 → 3 → 4 → 5
    groupPrev = dummy
    kth = node 3
    groupNext = node 4

  Reverse 1→2→3 with groupNext as the "prev" (tail connector):
    Iteration 1: null←1 (actually 4←1), curr=2
    Iteration 2: 4←1←2, curr=3
    Iteration 3: 4←1←2←3, curr=4 (which is groupNext)

  After: dummy → 3 → 2 → 1 → 4 → 5
  Move groupPrev to old first node (1): groupPrev = node 1

Step 2: Check 3 nodes from node 4? No (only 4,5).
  Don\`t reverse.

Final: 3 → 2 → 1 → 4 → 5 → null
\`\`\`

\`\`\`java
public ListNode reverseKGroup(ListNode head, int k) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode groupPrev = dummy;

    while (true) {
        ListNode kth = groupPrev;
        for (int i = 0; i < k; i++) {
            kth = kth.next;
            if (kth == null) return dummy.next;
        }

        ListNode groupNext = kth.next;
        ListNode prev = groupNext, curr = groupPrev.next;
        for (int i = 0; i < k; i++) {
            ListNode next = curr.next;
            curr.next = prev;
            prev = curr;
            curr = next;
        }

        ListNode tmp = groupPrev.next; // old first (now last in group)
        groupPrev.next = kth;          // point to new first (kth)
        groupPrev = tmp;               // move to end of reversed group
    }
}
\`\`\`

---

### Example 2: LRU Cache — HashMap + Doubly Linked List

**Problem:** Design a cache with O(1) get and put, evicting the least recently used item.

\`\`\`
Data structure:

  HashMap<key, DListNode>    Doubly Linked List (most recent ↔ least recent)
  ┌─────────────────┐       head ⇄ [A] ⇄ [B] ⇄ [C] ⇄ tail
  │ key1 → node_A   │              most          least
  │ key2 → node_B   │              recent        recent
  │ key3 → node_C   │
  └─────────────────┘

  get(key):
    1. Look up node in HashMap → O(1)
    2. Move node to front of DLL → O(1)
    3. Return value

  put(key, value):
    1. If key exists: update value, move to front → O(1)
    2. If new: add to front of DLL, add to HashMap → O(1)
    3. If over capacity: remove tail of DLL, remove from HashMap → O(1)
\`\`\`

\`\`\`java
class LRUCache {
    private final int capacity;
    private final Map<Integer, DListNode> map = new HashMap<>();
    private final DListNode head = new DListNode(0, 0); // sentinel
    private final DListNode tail = new DListNode(0, 0); // sentinel

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail;
        tail.prev = head;
    }

    public int get(int key) {
        DListNode node = map.get(key);
        if (node == null) return -1;
        moveToFront(node);
        return node.val;
    }

    public void put(int key, int value) {
        DListNode node = map.get(key);
        if (node != null) {
            node.val = value;
            moveToFront(node);
        } else {
            if (map.size() == capacity) {
                DListNode lru = tail.prev;
                removeNode(lru);
                map.remove(lru.key);
            }
            node = new DListNode(key, value);
            map.put(key, node);
            addToFront(node);
        }
    }

    private void addToFront(DListNode node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }

    private void removeNode(DListNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }

    private void moveToFront(DListNode node) {
        removeNode(node);
        addToFront(node);
    }

    static class DListNode {
        int key, val;
        DListNode prev, next;
        DListNode(int key, int val) {
            this.key = key;
            this.val = val;
        }
    }
}
\`\`\`

---

### Example 3: Sort List (Merge Sort)

**Problem:** Sort a linked list in O(n log n) time and O(1) space (or O(log n) stack).

\`\`\`
Input: 4 → 2 → 1 → 3

Split using slow/fast:
  4 → 2 → 1 → 3
  S    F        → S=4, F=4
       S    F   → S=2, F=1 (F.next.next=null, stop)
  Left: 4 → 2, Right: 1 → 3

Recursion:
  sort(4→2): split into [4] and [2], merge → 2→4
  sort(1→3): split into [1] and [3], merge → 1→3
  merge(2→4, 1→3): → 1→2→3→4

Final: 1 → 2 → 3 → 4
\`\`\`

\`\`\`java
public ListNode sortList(ListNode head) {
    if (head == null || head.next == null) return head;

    ListNode mid = findMiddle(head);
    ListNode rightHalf = mid.next;
    mid.next = null; // split

    ListNode left = sortList(head);
    ListNode right = sortList(rightHalf);
    return mergeTwoLists(left, right);
}
\`\`\`

---

### Example 4: Remove Nth Node from End

**Problem:** Remove the nth node from the end in one pass.

\`\`\`
Input: 1 → 2 → 3 → 4 → 5, n=2

Use gap technique:
  Advance fast n+1 steps: fast is at node 3 (or past dummy by n+1)
  
  dummy → 1 → 2 → 3 → 4 → 5
  S                F

  Move both until fast hits null:
  dummy → 1 → 2 → 3 → 4 → 5
          S                F
  dummy → 1 → 2 → 3 → 4 → 5
               S                F
  dummy → 1 → 2 → 3 → 4 → 5 → null
                    S                F (null)

  slow.next = slow.next.next (skip node 4)
  Result: 1 → 2 → 3 → 5
\`\`\`

\`\`\`java
public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}
\`\`\`

---

## ⚠️ Common Mistakes

1. **Losing the next pointer:** ALWAYS save \`curr.next\` before modifying \`curr.next\`. This is the #1 linked list bug.
   \`\`\`java
   ListNode next = curr.next;  // SAVE first
   curr.next = prev;           // then redirect
   \`\`\`

2. **Creating accidental cycles:** After partitioning or copying, set the last node\`s \`next = null\`. Forgetting this creates infinite loops.

3. **Off-by-one in slow/fast:** The loop condition determines which middle node you get for even-length lists. Test with 1, 2, 3, and 4-node lists.

4. **Returning \`head\` instead of \`dummy.next\`:** After operations that might change the head, the original head may no longer be first. Always return \`dummy.next\`.

5. **Not handling null head:** Always check \`if (head == null)\` as the first line. Also check \`head.next == null\` for single-node cases.

6. **Stack overflow with deep recursion:** Recursive reversal uses O(n) stack space. For lists > 10K nodes, this will overflow. Use iterative approach for production code.

7. **Comparing nodes with \`==\` vs \`.val\`:** \`==\` compares object references (same node in memory). \`.val\` compares values. Use \`==\` for "same node" checks, \`.val\` for "same value" checks.

8. **Forgetting to handle even vs odd length:** Many algorithms (palindrome check, reorder list) behave differently for even vs odd length. Test both.

---

## 💡 Java-Specific Tips

### ListNode Class
\`\`\`java
// LeetCode typically provides this — don\`t redefine
class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}
\`\`\`

### Java LinkedList Internals
\`\`\`java
// java.util.LinkedList is a DOUBLY linked list
LinkedList<Integer> list = new LinkedList<>();

// Deque operations (O(1)):
list.addFirst(1);    list.addLast(2);
list.removeFirst();  list.removeLast();
list.peekFirst();    list.peekLast();

// List operations (O(n)):
list.get(3);         // O(n) — traverses from closer end
list.add(2, val);    // O(n) — find position + O(1) splice
list.remove(2);      // O(n) — find position + O(1) unlink
\`\`\`

### When to Use LinkedList vs ArrayList
\`\`\`
Almost ALWAYS use ArrayList.

LinkedList only when:
  ✓ You need O(1) addFirst/removeFirst AND don\`t need random access
  ✓ But even then, ArrayDeque is usually better!

Why ArrayList wins:
  ✓ Cache-friendly contiguous memory
  ✓ ~4 bytes per element vs ~40 bytes (LinkedList node overhead)
  ✓ O(1) random access
  ✓ Iterating is 10x+ faster in practice
\`\`\`

### Debugging Tips
\`\`\`java
// Print a linked list (useful for debugging)
public static String toString(ListNode head) {
    StringBuilder sb = new StringBuilder();
    ListNode curr = head;
    int limit = 100; // prevent infinite loop if cycle exists
    while (curr != null && limit-- > 0) {
        sb.append(curr.val);
        if (curr.next != null) sb.append(" -> ");
        curr = curr.next;
    }
    if (limit <= 0) sb.append(" ... (cycle detected)");
    return sb.toString();
}
\`\`\`

---

## 🔗 Comparison Tables

### Linked List Techniques at a Glance

| Technique | When to Use | Key Idea | Time |
|---|---|---|---|
| Dummy head | Always (default) | Eliminates head edge cases | — |
| Slow/fast pointer | Find middle, detect cycle | Two speeds reveal structure | O(n) |
| In-place reversal | Reorder, palindrome, k-group | Redirect next pointers | O(n) |
| Two-pointer merge | Combine sorted lists | Compare heads, pick smaller | O(n+m) |
| Partition | Split by value | Two separate chains | O(n) |
| Gap technique | Kth from end | Fixed gap between pointers | O(n) |
| Recursion | Reverse, merge, clone | Elegant but O(n) stack | O(n) |

### ArrayList vs LinkedList Performance (Java)

| Operation | ArrayList | LinkedList |
|---|---|---|
| get(i) | O(1) | O(n) |
| add(end) | O(1)* | O(1) |
| add(0) / addFirst | O(n) | O(1) |
| add(i) | O(n) | O(n) find + O(1) splice |
| remove(i) | O(n) | O(n) find + O(1) unlink |
| Iterator.remove() | O(n) | O(1) |
| contains(x) | O(n) | O(n) |
| Memory per element | ~4 bytes | ~40 bytes |
| Cache locality | Excellent | Poor |
| **Verdict** | **Default choice** | **Pure deque only** |

\\* Amortized

### Singly vs Doubly Linked Lists

| Feature | Singly | Doubly |
|---|---|---|
| Memory per node | 1 pointer (~8 bytes) | 2 pointers (~16 bytes) |
| Forward traversal | O(1) per step | O(1) per step |
| Backward traversal | Not possible | O(1) per step |
| Delete given node | O(n) (need prev) | O(1) |
| Insert before node | O(n) (need prev) | O(1) |
| Use case | Stacks, simple chains | LRU cache, deques |

### Additional Code Examples

\`\`\`java
// Intersection of Two Linked Lists — O(m+n) time, O(1) space
public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    ListNode a = headA, b = headB;
    while (a != b) {
        a = (a == null) ? headB : a.next;
        b = (b == null) ? headA : b.next;
    }
    return a; // null if no intersection
}

// Add Two Numbers (reverse order digits) — O(max(m,n)) time
public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
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

// Swap Nodes in Pairs — O(n) time, O(1) space
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

// Partition List — O(n) time, O(1) space
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
    after.next = null;          // IMPORTANT: terminate list
    before.next = afterDummy.next;
    return beforeDummy.next;
}
\`\`\`
`,
  },
  {
    slug: 'stacks-and-queues',
    title: 'Stacks & Queues',
    icon: 'StackIcon',
    description: 'Leverage LIFO and FIFO structures for expression parsing, monotonic patterns, and design problems.',
    color: 'purple',
    content: `# Stacks and Queues — Deep Dive Guide

## 📌 Core Concepts

### What Are Stacks and Queues?

**Stack (LIFO — Last In, First Out):** Think of a stack of plates. You add and remove from
the top only. The last item added is the first one removed.

**Queue (FIFO — First In, First Out):** Think of a checkout line. The first person in line
gets served first. Items are added at the back and removed from the front.

**Why they matter for interviews:**
- Stacks enable parsing, backtracking, and "nearest" problems
- Queues enable BFS and level-order processing
- Monotonic variants solve O(n) problems that seem to require O(n²)
- ~20% of interview problems use stacks/queues directly or as building blocks

### Memory Model & Internal Representation

\`\`\`
╔═══════════════════════════════════════════════════════════════════╗
║                    STACK (LIFO)                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║   push(A), push(B), push(C):        pop() → C                   ║
║                                                                   ║
║   ┌───┐                              ┌───┐                       ║
║   │ C │ ← top (push/pop here)        │ B │ ← new top            ║
║   │ B │                              │ A │                       ║
║   │ A │                              └───┘                       ║
║   └───┘                                                          ║
║                                                                   ║
║   Operations: push, pop, peek — ALL O(1)                         ║
╠═══════════════════════════════════════════════════════════════════╣
║                    QUEUE (FIFO)                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║   offer(A), offer(B), offer(C):     poll() → A                  ║
║                                                                   ║
║   front → [A] [B] [C] ← back       front → [B] [C] ← back     ║
║            ↑              ↑                   ↑                   ║
║         dequeue        enqueue             dequeue                ║
║                                                                   ║
║   Operations: offer, poll, peek — ALL O(1)                       ║
╚═══════════════════════════════════════════════════════════════════╝
\`\`\`

### Java Implementations — Choose Wisely

\`\`\`
╔═══════════════════════════════════════════════════════════════════╗
║ CLASS           │ BACKING        │ THREAD-SAFE │ USE AS          ║
╠═══════════════════════════════════════════════════════════════════╣
║ Stack           │ Vector (array) │ Yes (sync)  │ ❌ LEGACY       ║
║ ArrayDeque      │ Resizable arr  │ No          │ ✅ Stack/Queue  ║
║ LinkedList      │ Doubly linked  │ No          │ ⚠️ If need null ║
║ PriorityQueue   │ Binary heap    │ No          │ ✅ Priority Q   ║
║ ConcurrentLinked│ Lock-free list │ Yes         │ Multi-threaded  ║
╚═══════════════════════════════════════════════════════════════════╝

Why ArrayDeque over Stack?
  • Stack extends Vector → synchronized on EVERY call → unnecessary overhead
  • ArrayDeque is ~3x faster for single-threaded use
  • ArrayDeque uses contiguous memory → better cache locality
  • ArrayDeque does not allow null → catches bugs early

Why ArrayDeque over LinkedList?
  • No node allocation per element → less GC pressure
  • Contiguous memory → better cache locality
  • Uses ~4 bytes per element vs ~40 bytes (node overhead)
\`\`\`

\`\`\`java
// ✅ Preferred stack usage
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);              // push onto top (addFirst)
stack.push(2);
int top = stack.peek();     // 2, doesn\`t remove (peekFirst)
int val = stack.pop();      // 2, removes (removeFirst)
boolean empty = stack.isEmpty();

// ✅ Preferred queue usage
Queue<Integer> queue = new ArrayDeque<>();
queue.offer(1);             // enqueue at back (offerLast)
queue.offer(2);
int front = queue.peek();   // 1, doesn\`t remove (peekFirst)
int val2 = queue.poll();    // 1, removes (pollFirst)

// ✅ Deque (both ends)
Deque<Integer> deque = new ArrayDeque<>();
deque.offerFirst(1);        // add to front
deque.offerLast(2);         // add to back
deque.pollFirst();          // remove from front
deque.pollLast();           // remove from back
\`\`\`

---

## 🔍 Visual Deep Dive

### Stack Operations Step-by-Step

\`\`\`
Operations: push(1), push(2), push(3), pop(), push(4), peek()

 push(1)  push(2)  push(3)  pop()→3   push(4)   peek()→4
                   ┌───┐
          ┌───┐   │ 3 │   ┌───┐     ┌───┐     ┌───┐
 ┌───┐   │ 2 │   │ 2 │   │ 2 │     │ 4 │     │ 4 │ ← top
 │ 1 │   │ 1 │   │ 1 │   │ 1 │     │ 2 │     │ 2 │
 └───┘   └───┘   └───┘   └───┘     │ 1 │     │ 1 │
                                     └───┘     └───┘
 size=1  size=2  size=3  size=2     size=3    size=3
\`\`\`

### Queue Operations Step-by-Step

\`\`\`
Operations: offer(1), offer(2), offer(3), poll(), offer(4)

Front                              Back
 ↓                                  ↓
[1]                                        after offer(1)
[1, 2]                                     after offer(2)
[1, 2, 3]                                  after offer(3)
[2, 3]               poll() → 1           after poll()
[2, 3, 4]                                  after offer(4)
 ↑                                  ↑
Front                              Back
\`\`\`

### Circular Queue (ArrayDeque Internal)

\`\`\`
ArrayDeque internally uses a circular array:

Capacity = 8, after: offer(A), offer(B), offer(C), poll(), poll()

  Index: [0] [1] [2] [3] [4] [5] [6] [7]
  Value: [ ] [ ] [C] [ ] [ ] [ ] [ ] [ ]
               ↑   ↑
             head tail

After offer(D), offer(E):
  Index: [0] [1] [2] [3] [4] [5] [6] [7]
  Value: [ ] [ ] [C] [D] [E] [ ] [ ] [ ]
               ↑           ↑
             head         tail

Wraparound — when tail reaches end, it wraps to index 0:
  This avoids O(n) shifting that a linear queue would need.
\`\`\`

---

## ⚡ Key Algorithms & Techniques

### 1. Monotonic Stack

**Concept:** A stack that maintains elements in monotonically increasing or decreasing order.
When a new element would violate the ordering, pop elements until the invariant is restored.
Each element is pushed and popped at most once → O(n) total across all elements.

**When to use:**
- "Next greater element" / "next smaller element"
- "Previous greater/smaller element"
- Histogram problems (largest rectangle)
- Temperature / stock span problems

#### Next Greater Element — DETAILED Stack Trace

\`\`\`
nums = [2, 1, 4, 3, 5]

Goal: For each element, find the next element to its RIGHT that is strictly greater.

Stack stores INDICES of elements waiting for their "next greater."
Stack invariant: values at stored indices are in DECREASING order (bottom to top).

i=0, val=2:
  Stack is empty → push index 0
  Stack (bottom→top): [0]        values: [2]
  Result: [_, _, _, _, _]

i=1, val=1:
  1 < 2 (stack top) → does NOT pop → push index 1
  Stack: [0, 1]                   values: [2, 1]
  Result: [_, _, _, _, _]

i=2, val=4:
  4 > 1 (stack top) → pop index 1, result[1] = 4
  4 > 2 (stack top) → pop index 0, result[0] = 4
  Stack empty → push index 2
  Stack: [2]                      values: [4]
  Result: [4, 4, _, _, _]

i=3, val=3:
  3 < 4 (stack top) → does NOT pop → push index 3
  Stack: [2, 3]                   values: [4, 3]
  Result: [4, 4, _, _, _]

i=4, val=5:
  5 > 3 (stack top) → pop index 3, result[3] = 5
  5 > 4 (stack top) → pop index 2, result[2] = 5
  Stack empty → push index 4
  Stack: [4]                      values: [5]
  Result: [4, 4, 5, 5, _]

End of array — remaining stack elements have no next greater:
  Pop index 4 → result[4] = -1
  Result: [4, 4, 5, 5, -1]

Each element pushed once, popped once → O(n) total!
\`\`\`

\`\`\`java
// Next greater element — O(n) time, O(n) space
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

// Next smaller element — just change comparison direction
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

**Monotonic Stack Variants:**

\`\`\`
Direction   │ Stack Order    │ Purpose
───────────────────────────────────────────────────
→ (L to R)  │ Decreasing     │ Next greater element
→ (L to R)  │ Increasing     │ Next smaller element
← (R to L)  │ Decreasing     │ Previous greater element
← (R to L)  │ Increasing     │ Previous smaller element
\`\`\`

---

### 2. Monotonic Queue (Sliding Window Maximum)

**Concept:** A deque that maintains elements in decreasing order. The front always holds
the maximum of the current window. Elements smaller than a newer element are removed from
the back (they can never be the maximum). Elements outside the window are removed from front.

**Step-by-step visual:**

\`\`\`
nums = [1, 3, -1, -3, 5, 3, 6, 7],  k=3

Deque stores INDICES. Values at those indices are in DECREASING order.

i=0, val=1:
  Deque: [0]           values: [1]
  Window not full yet (need k=3 elements)

i=1, val=3:
  3 > 1 (deque back) → remove 0 from back
  Deque: [1]           values: [3]
  Window not full yet

i=2, val=-1:
  -1 < 3 (deque back) → keep
  Deque: [1, 2]        values: [3, -1]
  Window [0..2] full → max = nums[deque.front] = nums[1] = 3  ★

i=3, val=-3:
  -3 < -1 (deque back) → keep
  Deque: [1, 2, 3]     values: [3, -1, -3]
  Check front: index 1 ≥ i-k+1 = 1? Yes → keep
  Window [1..3] → max = nums[1] = 3  ★

i=4, val=5:
  5 > -3 → remove 3. 5 > -1 → remove 2. 5 > 3 → remove 1.
  Deque: [4]           values: [5]
  Window [2..4] → max = nums[4] = 5  ★

i=5, val=3:
  3 < 5 → keep
  Deque: [4, 5]        values: [5, 3]
  Window [3..5] → max = nums[4] = 5  ★

i=6, val=6:
  6 > 3 → remove 5. 6 > 5 → remove 4.
  Deque: [6]           values: [6]
  Window [4..6] → max = nums[6] = 6  ★

i=7, val=7:
  7 > 6 → remove 6.
  Deque: [7]           values: [7]
  Window [5..7] → max = nums[7] = 7  ★

Result: [3, 3, 5, 5, 6, 7]
\`\`\`

\`\`\`java
// Sliding window maximum — O(n) time, O(k) space
public int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] result = new int[n - k + 1];
    Deque<Integer> deque = new ArrayDeque<>(); // stores indices

    for (int i = 0; i < n; i++) {
        // Remove elements outside the window from front
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        // Remove elements smaller than current from back
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

### 3. Expression Evaluation

**Concept:** Use stacks to evaluate mathematical expressions. For simple expressions
(+, -, with parentheses), one stack suffices. For operator precedence (×, ÷), use
two stacks or convert to postfix first.

#### Infix to Postfix Conversion

\`\`\`
Infix: 3 + 4 × 2 - (1 + 5)

Rules:
  - Numbers go directly to output
  - Operators go to stack; pop higher/equal precedence first
  - ( pushes to stack
  - ) pops until (

Step-by-step:
Token │ Output          │ Stack (bottom→top)  │ Action
──────┼─────────────────┼─────────────────────┼─────────────
  3   │ 3               │                     │ number → output
  +   │ 3               │ +                   │ push +
  4   │ 3 4             │ +                   │ number → output
  ×   │ 3 4             │ + ×                 │ × > + → push
  2   │ 3 4 2           │ + ×                 │ number → output
  -   │ 3 4 2 × +       │ -                   │ pop ×,+ (≥ prec), push -
  (   │ 3 4 2 × +       │ - (                 │ push (
  1   │ 3 4 2 × + 1     │ - (                 │ number → output
  +   │ 3 4 2 × + 1     │ - ( +               │ push + (above ()
  5   │ 3 4 2 × + 1 5   │ - ( +               │ number → output
  )   │ 3 4 2 × + 1 5 + │ -                   │ pop until (, discard (
 END  │ 3 4 2 × + 1 5 + -│                    │ pop remaining

Postfix: 3 4 2 × + 1 5 + -
Evaluate: 3 + (4×2) - (1+5) = 3 + 8 - 6 = 5
\`\`\`

#### Evaluating Postfix with a Stack

\`\`\`
Postfix: 3 4 2 × + 1 5 + -

Token │ Stack (bottom→top)  │ Action
──────┼─────────────────────┼─────────────
  3   │ [3]                 │ push number
  4   │ [3, 4]              │ push number
  2   │ [3, 4, 2]           │ push number
  ×   │ [3, 8]              │ pop 2,4 → 4×2=8 → push
  +   │ [11]                │ pop 8,3 → 3+8=11 → push
  1   │ [11, 1]             │ push number
  5   │ [11, 1, 5]          │ push number
  +   │ [11, 6]             │ pop 5,1 → 1+5=6 → push
  -   │ [5]                 │ pop 6,11 → 11-6=5 → push

Result: 5 ✓
\`\`\`

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
            num = 0; sign = 1;
        } else if (c == '-') {
            result += sign * num;
            num = 0; sign = -1;
        } else if (c == '(') {
            stack.push(result);
            stack.push(sign);
            result = 0; sign = 1;
        } else if (c == ')') {
            result += sign * num;
            num = 0;
            result = stack.pop() * result + stack.pop();
        }
    }
    return result + sign * num;
}
\`\`\`

---

### 4. Bracket Matching

**Concept:** Use a stack to track opening brackets. When a closing bracket appears,
verify it matches the most recent opening bracket (stack top).

\`\`\`
Input: "({[]})"

Character │ Action          │ Stack (bottom→top) │ Valid?
──────────┼─────────────────┼────────────────────┼───────
    (     │ push (          │ (                  │ —
    {     │ push {          │ ( {                │ —
    [     │ push [          │ ( { [              │ —
    ]     │ pop → [         │ ( {                │ ✓ ] matches [
    }     │ pop → {         │ (                  │ ✓ } matches {
    )     │ pop → (         │ (empty)            │ ✓ ) matches (
  END     │ stack empty?    │ YES                │ ✅ VALID

Input: "([)]"

Character │ Action          │ Stack (bottom→top) │ Valid?
──────────┼─────────────────┼────────────────────┼───────
    (     │ push (          │ (                  │ —
    [     │ push [          │ ( [                │ —
    )     │ pop → [         │ —                  │ ✗ ) doesn\`t match [
                                                   ❌ INVALID
\`\`\`

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

---

### 5. Min Stack

**Concept:** Support O(1) push, pop, top, AND getMin. Use an auxiliary stack that
tracks the minimum at each level.

\`\`\`
Operations: push(5), push(3), push(7), push(2), pop(), getMin()

  Main Stack    Min Stack
  ─────────     ─────────
  push(5):
  ┌───┐         ┌───┐
  │ 5 │         │ 5 │     min = 5
  └───┘         └───┘

  push(3):
  ┌───┐         ┌───┐
  │ 3 │         │ 3 │     min = 3 (3 ≤ 5)
  │ 5 │         │ 5 │
  └───┘         └───┘

  push(7):
  ┌───┐         ┌───┐
  │ 7 │         │ 3 │     min = 3 (7 > 3, don\`t push to minStack)
  │ 3 │         │ 3 │     Or: push 3 again (simpler logic)
  │ 5 │         │ 5 │
  └───┘         └───┘

  push(2):
  ┌───┐         ┌───┐
  │ 2 │         │ 2 │     min = 2 (2 ≤ 3)
  │ 7 │         │ 3 │
  │ 3 │         │ 3 │
  │ 5 │         │ 5 │
  └───┘         └───┘

  pop() → 2:
  ┌───┐         ┌───┐
  │ 7 │         │ 3 │     2 == minStack.peek() → pop minStack too
  │ 3 │         │ 3 │
  │ 5 │         │ 5 │
  └───┘         └───┘

  getMin() → 3 ✓
\`\`\`

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
        // CRITICAL: use .equals() not == for Integer comparison!
        if (stack.pop().equals(minStack.peek())) {
            minStack.pop();
        }
    }

    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}
\`\`\`

---

### 6. Largest Rectangle in Histogram

**Concept:** For each bar, find how far it can extend left and right (until a shorter bar).
Use a monotonic stack (increasing) to track this efficiently.

\`\`\`
heights = [2, 1, 5, 6, 2, 3]

Step-by-step with stack storing indices:

i=0, h=2:
  Stack empty → push 0
  Stack: [0]          heights at indices: [2]

i=1, h=1:
  1 < 2 (heights[stack.top])
    Pop 0: height=2, width = 1 (stack empty, so width=i=1)
    Area = 2 × 1 = 2
  Push 1
  Stack: [1]          heights: [1]
  maxArea = 2

i=2, h=5:
  5 ≥ 1 → push 2
  Stack: [1, 2]       heights: [1, 5]

i=3, h=6:
  6 ≥ 5 → push 3
  Stack: [1, 2, 3]    heights: [1, 5, 6]

i=4, h=2:
  2 < 6 (heights[3])
    Pop 3: height=6, width = 4-2-1 = 1, area = 6
  2 < 5 (heights[2])
    Pop 2: height=5, width = 4-1-1 = 2, area = 10 ← NEW MAX
  2 ≥ 1 → push 4
  Stack: [1, 4]       heights: [1, 2]
  maxArea = 10

i=5, h=3:
  3 ≥ 2 → push 5
  Stack: [1, 4, 5]    heights: [1, 2, 3]

i=6 (sentinel h=0): flush remaining stack
  0 < 3 (heights[5])
    Pop 5: height=3, width = 6-4-1 = 1, area = 3
  0 < 2 (heights[4])
    Pop 4: height=2, width = 6-1-1 = 4, area = 8
  0 < 1 (heights[1])
    Pop 1: height=1, width = 6 (stack empty), area = 6

maxArea = 10  ✓
(Rectangle of height 5, spanning indices [2,3])
\`\`\`

\`\`\`java
// Largest rectangle in histogram — O(n) time, O(n) space
public int largestRectangleArea(int[] heights) {
    int n = heights.length, maxArea = 0;
    Deque<Integer> stack = new ArrayDeque<>();

    for (int i = 0; i <= n; i++) {
        int currHeight = (i == n) ? 0 : heights[i]; // sentinel at end
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

## 🎯 Pattern Recognition

### Problem Keywords → Data Structure

| Keywords / Signals | Data Structure | Why |
|---|---|---|
| "Valid parentheses", "matching brackets" | Stack | LIFO matches nested pairs |
| "Next greater/smaller element" | Monotonic stack | Maintains ordering invariant |
| "Largest rectangle", "trapping rain water" | Monotonic stack | Find span of each element |
| "Sliding window maximum/minimum" | Monotonic deque | O(1) access to window extremes |
| "Expression evaluation", "calculator" | Stack(s) | Operator/operand ordering |
| "Decode string", "nested structure" | Stack | Track nesting depth |
| "BFS", "level-order traversal" | Queue | FIFO processes by level |
| "Min/Max in O(1)" | Augmented stack | Auxiliary min/max stack |
| "Undo / Back button" | Stack | LIFO matches undo order |
| "Top-K elements" | Priority queue (heap) | Maintain K best |
| "Implement queue/stack using other" | Design with 2 stacks/queues | Interview classic |

### Decision Flowchart

\`\`\`
Problem involves processing order?
│
├── LIFO (last in, first out)?
│   ├── Nested/matching pairs → Stack
│   ├── Next greater/smaller → Monotonic Stack
│   ├── Expression parsing → Stack(s) for values + operators
│   ├── Backtracking/undo → Stack
│   └── Need O(1) min/max → Augmented Stack
│
├── FIFO (first in, first out)?
│   ├── Level-by-level processing → Queue (BFS)
│   ├── Process in arrival order → Queue
│   └── Bounded buffer → Circular Queue
│
├── Both ends needed?
│   ├── Sliding window extremes → Monotonic Deque
│   └── Double-ended operations → Deque
│
└── Priority-based?
    ├── Top-K elements → Heap
    ├── Merge K sorted streams → Min-heap
    └── Running median → Two heaps (max + min)
\`\`\`

---

## 📊 Complexity Cheat Sheet

| Data Structure | push/offer | pop/poll | peek | Search | Notes |
|---|---|---|---|---|---|
| Stack (ArrayDeque) | O(1)* | O(1) | O(1) | O(n) | *Amortized (resize) |
| Queue (ArrayDeque) | O(1)* | O(1) | O(1) | O(n) | Circular array |
| PriorityQueue | O(log n) | O(log n) | O(1) | O(n) | Binary heap |
| Deque (ArrayDeque) | O(1)* | O(1) | O(1) | O(n) | Both ends O(1) |
| Monotonic Stack | O(1)† | O(1)† | O(1) | — | †Per element amortized |
| Monotonic Queue | O(1)† | O(1)† | O(1) | — | †Per element amortized |

### Algorithm Complexities

| Algorithm/Pattern | Time | Space |
|---|---|---|
| Next greater element | O(n) | O(n) |
| Sliding window max/min | O(n) | O(k) |
| Valid parentheses | O(n) | O(n) |
| Basic calculator | O(n) | O(n) |
| Evaluate RPN | O(n) | O(n) |
| Largest rectangle histogram | O(n) | O(n) |
| Daily temperatures | O(n) | O(n) |
| Min stack (all ops) | O(1) | O(n) |
| Queue using 2 stacks | O(1)* | O(n) |

\\* Amortized — each element transferred at most once

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Daily Temperatures — Full Stack Trace

**Problem:** Given daily temperatures, find how many days until a warmer day.

\`\`\`
temperatures = [73, 74, 75, 71, 69, 72, 76, 73]

This is "next greater element" → use monotonic stack (decreasing).

i=0, temp=73:
  Stack empty → push 0
  Stack: [0]           temps: [73]
  Result: [0, 0, 0, 0, 0, 0, 0, 0]

i=1, temp=74:
  74 > 73 → pop 0, result[0] = 1-0 = 1 day
  Push 1
  Stack: [1]           temps: [74]
  Result: [1, 0, 0, 0, 0, 0, 0, 0]

i=2, temp=75:
  75 > 74 → pop 1, result[1] = 2-1 = 1 day
  Push 2
  Stack: [2]           temps: [75]
  Result: [1, 1, 0, 0, 0, 0, 0, 0]

i=3, temp=71:
  71 < 75 → push 3
  Stack: [2, 3]        temps: [75, 71]
  Result: [1, 1, 0, 0, 0, 0, 0, 0]

i=4, temp=69:
  69 < 71 → push 4
  Stack: [2, 3, 4]     temps: [75, 71, 69]
  Result: [1, 1, 0, 0, 0, 0, 0, 0]

i=5, temp=72:
  72 > 69 → pop 4, result[4] = 5-4 = 1 day
  72 > 71 → pop 3, result[3] = 5-3 = 2 days
  72 < 75 → stop popping, push 5
  Stack: [2, 5]        temps: [75, 72]
  Result: [1, 1, 0, 2, 1, 0, 0, 0]

i=6, temp=76:
  76 > 72 → pop 5, result[5] = 6-5 = 1 day
  76 > 75 → pop 2, result[2] = 6-2 = 4 days
  Push 6
  Stack: [6]           temps: [76]
  Result: [1, 1, 4, 2, 1, 1, 0, 0]

i=7, temp=73:
  73 < 76 → push 7
  Stack: [6, 7]        temps: [76, 73]
  Result: [1, 1, 4, 2, 1, 1, 0, 0]

Remaining in stack: indices 6 and 7 have no warmer day → result stays 0.
Final: [1, 1, 4, 2, 1, 1, 0, 0]
\`\`\`

\`\`\`java
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

---

### Example 2: Valid Parentheses

**Problem:** Check if brackets are properly nested and matched.

**Thought process:**
1. Closing bracket must match the most recent unmatched opening → LIFO → Stack
2. Push opening brackets, pop and compare for closing brackets
3. At end, stack must be empty (all brackets matched)

\`\`\`java
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

**Edge cases:** Empty string (valid), single bracket (invalid), only opening (invalid), only closing (invalid).

---

### Example 3: Evaluate Reverse Polish Notation

**Problem:** Evaluate an expression in postfix notation.

\`\`\`
tokens = ["2", "1", "+", "3", "*"]

Token │ Stack         │ Action
──────┼───────────────┼──────────────────
 "2"  │ [2]           │ push number
 "1"  │ [2, 1]        │ push number
 "+"  │ [3]           │ pop 1,2 → 2+1=3
 "3"  │ [3, 3]        │ push number
 "*"  │ [9]           │ pop 3,3 → 3×3=9

Result: 9
Equivalent infix: (2 + 1) × 3 = 9
\`\`\`

\`\`\`java
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

**Note:** For subtraction and division, operand order matters! \`a - b\`: \`b\` is popped first, then \`a\`.

---

### Example 4: Queue Using Two Stacks

**Problem:** Implement a FIFO queue using only two stacks.

\`\`\`
Concept: inStack for pushes, outStack for pops.
When outStack is empty, transfer ALL from inStack (reverses order → FIFO).

Operations: push(1), push(2), push(3), pop(), push(4), pop()

push(1): inStack=[1],     outStack=[]
push(2): inStack=[1,2],   outStack=[]
push(3): inStack=[1,2,3], outStack=[]

pop():
  outStack empty → transfer all from inStack
  inStack=[], outStack=[3,2,1]  (reversed! 1 is now on top)
  Pop outStack → returns 1 ✓    outStack=[3,2]

push(4): inStack=[4], outStack=[3,2]

pop():
  outStack NOT empty → just pop
  Returns 2 ✓    outStack=[3]

Amortized analysis: Each element is moved from inStack to outStack
exactly ONCE. Over n operations → O(n) total transfers → O(1) amortized.
\`\`\`

\`\`\`java
class MyQueue {
    private Deque<Integer> inStack = new ArrayDeque<>();
    private Deque<Integer> outStack = new ArrayDeque<>();

    public void push(int x) { inStack.push(x); }

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

---

## ⚠️ Common Mistakes

1. **Using \`Stack\` class instead of \`ArrayDeque\`:** \`Stack\` extends \`Vector\` (synchronized on every operation). Use \`ArrayDeque\` — it\`s faster, more memory-efficient, and the recommended approach.

2. **\`==\` vs \`.equals()\` for Integer wrapper:** For autoboxed integers, \`==\` works for [-128, 127] due to Integer cache, but FAILS for larger values. Always use \`.equals()\`.
   \`\`\`java
   // BUG: fails for values outside [-128, 127]
   if (stack.pop() == minStack.peek()) ...
   // CORRECT:
   if (stack.pop().equals(minStack.peek())) ...
   \`\`\`

3. **Empty check before pop/peek:** Always guard with \`!stack.isEmpty()\` before \`pop()\` or \`peek()\`. \`ArrayDeque\` throws \`NoSuchElementException\` on empty pop.

4. **Wrong monotonic direction:** For "next greater" use decreasing stack (pop when new > top). For "next smaller" use increasing stack (pop when new < top). Draw examples to verify.

5. **Off-by-one in sliding window:** Deque stores indices. Check \`deque.peekFirst() < i - k + 1\` for expiry. Off-by-one here means wrong window boundaries.

6. **PriorityQueue iteration is NOT sorted:** Only \`poll()\` extracts in priority order. Iterating with for-each gives elements in arbitrary (heap) order.

7. **Forgetting sentinel in histogram:** Adding a height-0 sentinel at the end forces all remaining stack elements to be processed. Without it, you miss rectangles that extend to the end.

8. **Operand order in RPN evaluation:** For non-commutative ops (- and /), the first popped value is the RIGHT operand, the second is LEFT: \`a op b\` where \`b = pop first\`.

---

## 💡 Java-Specific Tips

### ArrayDeque Methods Reference
\`\`\`java
Deque<Integer> d = new ArrayDeque<>();

// As Stack:
d.push(x);     // addFirst — O(1)
d.pop();       // removeFirst — O(1)
d.peek();      // peekFirst — O(1)

// As Queue:
d.offer(x);    // offerLast — O(1)
d.poll();      // pollFirst — O(1)
d.peek();      // peekFirst — O(1)

// As Deque:
d.offerFirst(x);  d.offerLast(x);
d.pollFirst();    d.pollLast();
d.peekFirst();    d.peekLast();

// Size and emptiness:
d.size();      d.isEmpty();

// CAUTION: ArrayDeque does NOT allow null elements
// d.offer(null);  → NullPointerException!
\`\`\`

### PriorityQueue Tips
\`\`\`java
// Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();

// Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());

// Custom: sort by frequency, then alphabetically
PriorityQueue<String> pq = new PriorityQueue<>((a, b) -> {
    int freqCmp = Integer.compare(freq.get(b), freq.get(a));
    return freqCmp != 0 ? freqCmp : a.compareTo(b);
});

// Key operations:
pq.offer(x);     // insert — O(log n)
pq.poll();       // remove min/max — O(log n)
pq.peek();       // view min/max — O(1)
pq.remove(x);    // remove specific — O(n) search + O(log n) sift
pq.size();

// IMPORTANT: Iterating a PQ does NOT give sorted order!
// Only poll() extracts in priority order.
\`\`\`

### Circular Queue Implementation
\`\`\`java
class MyCircularQueue {
    private int[] data;
    private int head, tail, size;

    public MyCircularQueue(int k) {
        data = new int[k];
        head = 0; tail = -1; size = 0;
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

## 🔗 Comparison Tables

### Stack vs Queue vs Deque

| Feature | Stack | Queue | Deque |
|---|---|---|---|
| Order | LIFO | FIFO | Both ends |
| Java class | ArrayDeque | ArrayDeque | ArrayDeque |
| Add | push() | offer() | offerFirst/Last() |
| Remove | pop() | poll() | pollFirst/Last() |
| View | peek() | peek() | peekFirst/Last() |
| Use case | Parsing, undo, DFS | BFS, scheduling | Sliding window |

### When to Use Each Structure

| Problem Type | Data Structure | Why |
|---|---|---|
| Matching brackets | Stack | LIFO matches nested pairs |
| Expression evaluation | Stack (or two) | Operators in order |
| Next greater/smaller | Monotonic stack | Maintains ordering invariant |
| Sliding window max/min | Monotonic deque | O(1) extremes access |
| BFS / level-order | Queue | FIFO processes by level |
| Top-K streaming | Priority queue | Always access min/max |
| Undo/redo | Two stacks | One for undo, one for redo |
| Task scheduling | Queue or PQ | FIFO or priority ordering |

### ArrayDeque vs LinkedList vs Stack

| Feature | ArrayDeque | LinkedList | Stack |
|---|---|---|---|
| Backing | Circular array | Doubly linked list | Vector (array) |
| Thread-safe | No | No | Yes (synchronized) |
| Null elements | No | Yes | Yes |
| Memory/element | ~4 bytes | ~40 bytes | ~4 bytes |
| Cache locality | Excellent | Poor | Good |
| Speed | Fastest | Slower | Slower (sync) |
| **Verdict** | **Always prefer** | If need nulls | **Never use** |

---

## 🔍 Additional Code Examples

### Decode String
\`\`\`java
// "3[a2[c]]" → "accaccacc" — O(output length) time
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

### Stack Using Queues
\`\`\`java
class MyStack {
    Queue<Integer> queue = new ArrayDeque<>();

    public void push(int x) {
        queue.offer(x);
        // Rotate so newest element is at front (LIFO)
        for (int i = 0; i < queue.size() - 1; i++) {
            queue.offer(queue.poll());
        }
    }

    public int pop() { return queue.poll(); }
    public int top() { return queue.peek(); }
    public boolean empty() { return queue.isEmpty(); }
}
\`\`\`

### Top K Frequent Elements
\`\`\`java
// O(n log k) time, O(n) space
public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);

    PriorityQueue<Integer> minHeap = new PriorityQueue<>(
        Comparator.comparingInt(freq::get)
    );
    for (int key : freq.keySet()) {
        minHeap.offer(key);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.stream().mapToInt(Integer::intValue).toArray();
}
\`\`\`
`,
  },
  {
    slug: 'trees-and-bst',
    title: 'Trees & BST',
    icon: 'TreePine',
    description: 'Traverse and manipulate binary trees, BSTs, segment trees, and Fenwick trees with confidence.',
    color: 'green',
    content: `# Trees and Binary Search Trees — Deep Dive Guide

## 📌 Core Concepts

### What Is a Tree?

A **tree** is a hierarchical data structure consisting of nodes connected by edges. Each node
has zero or more children, and there is exactly one path between any two nodes. Trees are the
foundation for representing hierarchical relationships — file systems, HTML DOM, organization
charts, and abstract syntax trees.

**Why it matters for interviews:**
- ~25% of coding interview problems involve trees
- Tree problems test recursion skills deeply
- Understanding BSTs unlocks logarithmic algorithms
- Segment trees and Fenwick trees appear in competitive programming

### Node Definition

\`\`\`java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}
\`\`\`

### Tree Terminology — Visual Guide

\`\`\`
                    [8]  ← ROOT (depth=0, no parent)
                   /   \\
                 /       \\
              [3]        [10]          ← depth=1
             / \\            \\
           /     \\            \\
         [1]     [6]         [14]      ← depth=2
                / \\          /
              [4] [7]     [13]         ← depth=3 (LEAVES)

TERMINOLOGY:
  Root:     Node 8 — the topmost node, no parent
  Leaf:     Nodes 1, 4, 7, 13 — no children
  Internal: Nodes 8, 3, 10, 6, 14 — have at least one child
  Parent:   Node 3 is parent of 1 and 6
  Child:    Nodes 1, 6 are children of 3
  Sibling:  Nodes 1, 6 are siblings (share parent)
  Subtree:  Node 3 and all its descendants form a subtree
  Edge:     Connection between two nodes (e.g., 8→3)

MEASUREMENTS:
  Depth of node:  # edges from root to that node
    depth(8)=0, depth(3)=1, depth(6)=2, depth(4)=3
  Height of node: # edges on longest path to a leaf
    height(4)=0, height(6)=1, height(3)=2, height(8)=3
  Height of tree: height of root = 3
  Level:          All nodes at same depth (level 0 = root)

KEY PROPERTIES:
  Nodes: 9       Edges: 8 (always nodes - 1)
  Max nodes at level k: 2^k
  Max nodes in tree of height h: 2^(h+1) - 1
\`\`\`

### Types of Binary Trees — Visual Comparison

\`\`\`
FULL Binary Tree:                   COMPLETE Binary Tree:
Every node has 0 or 2 children.    All levels full except last,
                                    which is filled left-to-right.
        [1]                                [1]
       /   \\                              /   \\
     [2]   [3]                          [2]    [3]
    /   \\                              /  \\   /
  [4]   [5]                          [4] [5] [6]

  Leaves = internals + 1             Used for: Binary heaps
  (here: 3 leaves, 2 internals)      n nodes → height = floor(log₂n)

PERFECT Binary Tree:                BALANCED Binary Tree:
All internals have 2 children,     |height(left) - height(right)| ≤ 1
all leaves at same level.          at EVERY node.

        [1]                                [4]
       /   \\                              /   \\
     [2]   [3]                          [2]    [6]
    /  \\  /  \\                         / \\    / \\
  [4][5][6][7]                        [1] [3] [5] [7]

  Nodes = 2^(h+1) - 1                Guarantees O(log n) operations
  (here: 2^3 - 1 = 7)                AVL trees, Red-Black trees

DEGENERATE (Skewed) Tree:
Every internal node has 1 child.

  [1]
    \\
    [2]                               This is essentially
      \\                              a LINKED LIST!
      [3]                            Height = n-1
        \\                            All operations O(n)
        [4]
\`\`\`

### Java Class Hierarchy for Trees

\`\`\`
  TreeMap<K,V>  — Red-Black tree backed sorted map
    • O(log n) get, put, remove
    • O(log n) floorKey, ceilingKey, firstKey, lastKey
    • Ordered iteration (by key)
    
  TreeSet<E>    — Red-Black tree backed sorted set
    • O(log n) add, remove, contains
    • O(log n) floor, ceiling, first, last
    • Ordered iteration

  PriorityQueue — Binary heap (complete binary tree in array)
    • O(log n) offer, poll
    • O(1) peek
\`\`\`

---

## 🔍 Visual Deep Dive

### Traversal Orders — Numbered Visit Order

\`\`\`
Tree:
           [A]
          /   \\
        [B]   [C]
       /  \\     \\
     [D]  [E]   [F]

INORDER (Left → Root → Right):    D, B, E, A, C, F
Visit order: ④ ② ⑤ ① ③ ⑥
  Go left as far as possible, visit, then go right.
  For BST: gives SORTED order!

PREORDER (Root → Left → Right):   A, B, D, E, C, F
Visit order: ① ② ④ ⑤ ③ ⑥
  Visit root first, then subtrees.
  Use: serialize tree, copy tree structure.

POSTORDER (Left → Right → Root):  D, E, B, F, C, A
Visit order: ④ ⑤ ② ⑥ ③ ①
  Visit children first, then root.
  Use: delete tree, compute subtree sizes, bottom-up DP.

LEVEL-ORDER (BFS):                A, B, C, D, E, F
Visit order: ① ② ③ ④ ⑤ ⑥
  Visit level by level, left to right.
  Use: shortest path, level-based processing.
\`\`\`

### Iterative Inorder — Stack State at Each Step

\`\`\`
Tree:
        [4]
       /   \\
     [2]   [5]
    /  \\
  [1]  [3]

Stack-based iteration (push all left, pop and go right):

Step │ Action              │ Stack (top→)  │ Output
─────┼──────────────────────┼───────────────┼───────
  1  │ Push 4, go left     │ [4]           │
  2  │ Push 2, go left     │ [2, 4]        │
  3  │ Push 1, go left     │ [1, 2, 4]     │
  4  │ null → pop 1, visit │ [2, 4]        │ 1
  5  │ 1.right=null → pop 2│ [4]           │ 1, 2
  6  │ 2.right=3 → push 3  │ [3, 4]        │ 1, 2
  7  │ 3.left=null → pop 3 │ [4]           │ 1, 2, 3
  8  │ 3.right=null → pop 4│ []            │ 1, 2, 3, 4
  9  │ 4.right=5 → push 5  │ [5]           │ 1, 2, 3, 4
 10  │ 5.left=null → pop 5 │ []            │ 1, 2, 3, 4, 5
 11  │ Stack empty, done    │               │ 1, 2, 3, 4, 5 ✓
\`\`\`

---

## ⚡ Key Algorithms & Techniques

### 1. Tree Traversals — All Implementations

#### Recursive Traversals

\`\`\`java
// Inorder: Left → Root → Right (sorted for BST)
public void inorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    inorder(root.left, result);
    result.add(root.val);
    inorder(root.right, result);
}

// Preorder: Root → Left → Right
public void preorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    result.add(root.val);
    preorder(root.left, result);
    preorder(root.right, result);
}

// Postorder: Left → Right → Root
public void postorder(TreeNode root, List<Integer> result) {
    if (root == null) return;
    postorder(root.left, result);
    postorder(root.right, result);
    result.add(root.val);
}
\`\`\`

#### Iterative Traversals

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
        if (node.right != null) stack.push(node.right); // right first!
        if (node.left != null) stack.push(node.left);
    }
    return result;
}

// Iterative Postorder — modified preorder + reverse
public List<Integer> postorderIterative(TreeNode root) {
    LinkedList<Integer> result = new LinkedList<>();
    if (root == null) return result;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.addFirst(node.val); // reverse: add to front
        if (node.left != null) stack.push(node.left);
        if (node.right != null) stack.push(node.right);
    }
    return result;
}

// Level-Order (BFS) — O(n) time, O(w) space
public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
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

### 2. Morris Traversal — O(1) Space

**Concept:** Achieve O(1) space traversal by creating temporary "threads" — pointers from
a node\`s inorder predecessor back to the node itself. These threads let us return to
a node after processing its left subtree without using a stack.

\`\`\`
Morris Inorder on tree:
        [4]
       /   \\
     [2]   [5]
    /  \\
  [1]  [3]

Step 1: curr=4, left exists
  Find predecessor of 4 in left subtree: rightmost of left = 3
  3.right = null → create thread: 3.right = 4
  Move to left: curr = 2

        [4] ←───────────┐
       /   \\             │ thread
     [2]   [5]           │
    /  \\                 │
  [1]  [3] ─────────────┘

Step 2: curr=2, left exists
  Predecessor of 2 = rightmost of left = 1
  1.right = null → create thread: 1.right = 2
  Move to left: curr = 1

Step 3: curr=1, left is null
  VISIT 1.  Output: [1]
  Move to right: curr = 1.right = 2 (via thread!)

Step 4: curr=2, left exists
  Predecessor of 2 = 1. But 1.right = 2 (thread exists!)
  → Remove thread: 1.right = null
  VISIT 2.  Output: [1, 2]
  Move to right: curr = 3

Step 5: curr=3, left is null
  VISIT 3.  Output: [1, 2, 3]
  Move to right: curr = 3.right = 4 (via thread!)

Step 6: curr=4, left exists
  Predecessor = 3. But 3.right = 4 (thread exists!)
  → Remove thread: 3.right = null
  VISIT 4.  Output: [1, 2, 3, 4]
  Move to right: curr = 5

Step 7: curr=5, left is null
  VISIT 5.  Output: [1, 2, 3, 4, 5]
  Move to right: curr = null → DONE

Tree is RESTORED to original structure. ✓
\`\`\`

\`\`\`java
// Morris Inorder — O(n) time, O(1) space
public List<Integer> morrisInorder(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    TreeNode curr = root;
    while (curr != null) {
        if (curr.left == null) {
            result.add(curr.val); // visit
            curr = curr.right;
        } else {
            TreeNode pred = curr.left;
            while (pred.right != null && pred.right != curr) {
                pred = pred.right;
            }
            if (pred.right == null) {
                pred.right = curr; // create thread
                curr = curr.left;
            } else {
                pred.right = null; // remove thread
                result.add(curr.val); // visit
                curr = curr.right;
            }
        }
    }
    return result;
}
\`\`\`

**When to use:** When O(1) space is a hard requirement. Mention in interviews for extra
credit, but implement stack-based first unless specifically asked.

---

### 3. Binary Search Tree Operations

#### BST Property
For every node: **all** values in left subtree < node.val < **all** values in right subtree.

#### Search Path Visualization

\`\`\`
Search for 6 in BST:

        [8]
       /   \\
     [3]   [10]
    /  \\      \\
  [1]  [6]   [14]
      /  \\    /
    [4]  [7] [13]

Path: 8 → 3 → 6  (found!)
  8: 6 < 8 → go left
  3: 6 > 3 → go right
  6: 6 == 6 → FOUND!

Search for 5:
Path: 8 → 3 → 6 → 4 → null (not found)
  8: 5 < 8 → left
  3: 5 > 3 → right
  6: 5 < 6 → left
  4: 5 > 4 → right → null → NOT FOUND
\`\`\`

#### Insertion Visualization

\`\`\`
Insert 5 into BST:

        [8]               [8]
       /   \\             /   \\
     [3]   [10]   →    [3]   [10]
    /  \\      \\       /  \\      \\
  [1]  [6]   [14]   [1]  [6]   [14]
      /  \\    /         /  \\    /
    [4]  [7] [13]     [4]  [7] [13]
                       \\
                       [5]  ← inserted!

Path followed: 8→3→6→4→(null right) → insert here
\`\`\`

#### Deletion — Three Cases with Diagrams

\`\`\`
CASE 1: Leaf node (no children) — just remove it.

  Delete 4:
       [3]              [3]
      /   \\     →      /   \\
    [1]   [4]         [1]   (removed)

CASE 2: One child — replace node with its child.

  Delete 10:
       [8]              [8]
      /   \\     →      /   \\
    [3]   [10]        [3]   [14]
             \\
            [14]

CASE 3: Two children — replace with inorder successor.

  Delete 3:
       [8]           Find successor: smallest     [8]
      /   \\          in right subtree of 3       /   \\
    [3]   [10]       = leftmost of [6] = [4]   [4]   [10]
   /  \\                                        /  \\
 [1]  [6]          Replace 3 with 4,          [1]  [6]
     /  \\          delete old 4                   /  \\
   [4]  [7]                                     [5]  [7]
     \\
     [5]
\`\`\`

\`\`\`java
// Search — O(h) time, O(1) space
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
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode successor = root.right;
        while (successor.left != null) successor = successor.left;
        root.val = successor.val;
        root.right = delete(root.right, successor.val);
    }
    return root;
}
\`\`\`

---

### 4. Balanced BST — AVL Rotations

**Concept:** AVL trees maintain |height(left) - height(right)| ≤ 1 at every node.
When insertion or deletion violates this, rotations restore balance.

#### Four Rotation Cases

\`\`\`
CASE 1: LEFT-LEFT (LL) — Single Right Rotation

  Imbalanced:          After right rotation:
       [30]                  [20]
      /                     /    \\
    [20]            →    [10]    [30]
   /    \\                       /
 [10]   [25]                  [25]

  Balance factor at 30: +2 (left heavy)
  Left child\`s BF: +1 (left heavy) → LL case

CASE 2: RIGHT-RIGHT (RR) — Single Left Rotation

  Imbalanced:          After left rotation:
  [10]                      [20]
     \\                     /    \\
     [20]          →    [10]    [30]
    /    \\                 \\
  [15]   [30]             [15]

CASE 3: LEFT-RIGHT (LR) — Left Rotate + Right Rotate

  Imbalanced:          Left rotate 10:      Right rotate 30:
       [30]                [30]                  [20]
      /                   /                     /    \\
    [10]          →    [20]             →    [10]    [30]
       \\              /
       [20]         [10]

  Left child\`s BF: -1 (right heavy) → LR case

CASE 4: RIGHT-LEFT (RL) — Right Rotate + Left Rotate

  Imbalanced:          Right rotate 30:     Left rotate 10:
  [10]                 [10]                     [20]
     \\                    \\                    /    \\
     [30]          →     [20]         →    [10]    [30]
    /                       \\
  [20]                     [30]
\`\`\`

\`\`\`java
// Right rotation
private TreeNode rotateRight(TreeNode y) {
    TreeNode x = y.left;
    TreeNode B = x.right;
    x.right = y;
    y.left = B;
    updateHeight(y);
    updateHeight(x);
    return x; // new root
}

// Left rotation
private TreeNode rotateLeft(TreeNode x) {
    TreeNode y = x.right;
    TreeNode B = y.left;
    y.left = x;
    x.right = B;
    updateHeight(x);
    updateHeight(y);
    return y; // new root
}

// AVL insert with rebalancing
public TreeNode avlInsert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = avlInsert(root.left, val);
    else if (val > root.val) root.right = avlInsert(root.right, val);
    else return root;

    updateHeight(root);
    int bf = balanceFactor(root);

    if (bf > 1 && val < root.left.val)  return rotateRight(root);       // LL
    if (bf < -1 && val > root.right.val) return rotateLeft(root);        // RR
    if (bf > 1 && val > root.left.val) {                                 // LR
        root.left = rotateLeft(root.left);
        return rotateRight(root);
    }
    if (bf < -1 && val < root.right.val) {                               // RL
        root.right = rotateRight(root.right);
        return rotateLeft(root);
    }
    return root;
}

private int height(TreeNode n) { return n == null ? -1 : n.height; }
private void updateHeight(TreeNode n) {
    n.height = 1 + Math.max(height(n.left), height(n.right));
}
private int balanceFactor(TreeNode n) {
    return n == null ? 0 : height(n.left) - height(n.right);
}
\`\`\`

---

### 5. Segment Tree

**Concept:** A tree-based data structure for **range queries + point updates** on an array.
Each node stores aggregate info (sum, min, max) for a range of array indices.

\`\`\`
Array: [2, 1, 5, 3, 4]

Segment Tree (for range sum):

              [15]            ← sum of [0..4]
             /    \\
          [8]      [7]       ← sum of [0..2], [3..4]
         /   \\    /   \\
       [3]   [5] [3]  [4]   ← sum of [0..1], [2..2], [3..3], [4..4]
      /   \\
    [2]   [1]                ← sum of [0..0], [1..1]

Query sum([1..3]):
  Start at root [0..4]
  Left child [0..2]: overlaps with [1..3]
    Left child [0..1]: partially overlaps
      Left [0..0]: no overlap → return 0
      Right [1..1]: full overlap → return 1
    Right child [2..2]: full overlap → return 5
  Right child [3..4]: partially overlaps
    Left [3..3]: full overlap → return 3
    Right [4..4]: no overlap → return 0

  Answer: 1 + 5 + 3 = 9 ✓ (nums[1]+nums[2]+nums[3] = 1+5+3 = 9)

Update nums[2] = 7:
  Update leaf [2..2] from 5 to 7
  Propagate up: [0..2] becomes 10, root becomes 17
  Only O(log n) nodes affected.
\`\`\`

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

    public int query(int node, int start, int end, int l, int r) {
        if (r < start || end < l) return 0;          // no overlap
        if (l <= start && end <= r) return tree[node]; // full overlap
        int mid = (start + end) / 2;
        return query(2 * node, start, mid, l, r)
             + query(2 * node + 1, mid + 1, end, l, r);
    }
}
\`\`\`

---

### 6. Lowest Common Ancestor (LCA)

**Concept:** The LCA of two nodes p and q is the deepest node that is an ancestor of both.

\`\`\`
Find LCA of 4 and 7:

          [3]
         /   \\
       [5]   [1]
      /  \\   / \\
    [6] [2] [0] [8]
        / \\
      [7] [4]

Recursion trace:
  lca(3, 4, 7):
    left = lca(5, 4, 7):
      left = lca(6, 4, 7) → null (neither found)
      right = lca(2, 4, 7):
        left = lca(7, 4, 7) → 7 (found q!)
        right = lca(4, 4, 7) → 4 (found p!)
        BOTH non-null → return 2 ← this is the LCA!
      left=null, right=2 → return 2
    right = lca(1, 4, 7) → null (neither in right subtree)
    left=2, right=null → return 2

Answer: node 2  ✓

How it works:
  • If current node IS p or q → return it
  • Recurse left and right
  • If both return non-null → current node is LCA
  • If only one returns non-null → pass it up
  • If both null → neither p nor q in this subtree
\`\`\`

\`\`\`java
// LCA for general binary tree — O(n) time, O(h) space
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}

// LCA for BST — O(h) time, O(1) space (exploit BST property)
public TreeNode lcaBST(TreeNode root, TreeNode p, TreeNode q) {
    while (root != null) {
        if (p.val < root.val && q.val < root.val) root = root.left;
        else if (p.val > root.val && q.val > root.val) root = root.right;
        else return root; // split point = LCA
    }
    return null;
}
\`\`\`

---

## 🎯 Pattern Recognition

### Problem Keywords → Technique

| Keywords / Signals | Technique | Why |
|---|---|---|
| "Level order", "by level", "zigzag" | BFS with queue | Process level by level |
| "Max depth", "height" | Bottom-up recursion | Combine child heights |
| "Path sum" (root to leaf) | Top-down DFS with running sum | Pass info down |
| "Max path sum" (any path) | Bottom-up + global max | Return vs use |
| "Validate BST" | Inorder or min/max bounds | BST property check |
| "Kth smallest in BST" | Inorder traversal (stop at k) | Sorted property |
| "Serialize / deserialize" | Preorder + null markers | Uniquely reconstructable |
| "Lowest common ancestor" | Recursive search | Split point |
| "Invert / mirror tree" | Recursive swap children | Simple recursion |
| "Right side view" | BFS, take last per level | Level-order variant |
| "Range sum with updates" | Segment tree or BIT | O(log n) both |
| "Construct from traversals" | Preorder(root) + inorder(split) | Divide and conquer |
| "Diameter" | Bottom-up, track global max | left_height + right_height |
| "Symmetric tree" | Mirror comparison recursion | Compare left/right subtrees |
| "Flatten to linked list" | Morris-style or recursion | Preorder relink |

### Decision Flowchart

\`\`\`
Tree problem?
│
├── Need level-by-level info?
│   └── BFS (Queue) with level size tracking
│
├── Need subtree computation?
│   └── Bottom-up DFS (postorder)
│       Examples: height, diameter, balanced check, max path sum
│
├── Need ancestor info at each node?
│   └── Top-down DFS (preorder)
│       Examples: path sum, validate BST with ranges
│
├── BST-specific?
│   ├── Search/insert/delete → O(h) BST traversal
│   ├── Kth element → Inorder (stop at k)
│   ├── Validate → Min/max range propagation
│   └── LCA → Use BST property (split point)
│
├── Range queries + updates?
│   ├── Sum only → Fenwick Tree (BIT)
│   └── Min/max/sum → Segment Tree
│
└── Construction?
    ├── From preorder + inorder → Recursive build
    ├── From sorted array → Binary search middle
    └── Serialize/deserialize → Preorder + markers
\`\`\`

---

## 📊 Complexity Cheat Sheet

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

h = height, w = max width. For balanced tree: h = O(log n). For skewed: h = O(n).

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Validate BST — Range Propagation

**Problem:** Determine if a binary tree is a valid BST.

**Key insight:** It\`s NOT enough to check node.left.val < node.val < node.right.val.
You must ensure ALL nodes in the left subtree are less, not just the immediate child.

\`\`\`
       [5]
      /   \\
    [1]   [6]
         /   \\
       [3]   [7]

Naive check: 1 < 5 ✓, 6 > 5 ✓, 3 < 6 ✓, 7 > 6 ✓ → seems valid?
BUT: 3 is in right subtree of 5, so 3 must be > 5. It\`s NOT! → INVALID

Correct approach: propagate valid range [min, max] for each node.

validate(5, -∞, +∞): 5 in (-∞, +∞)? ✓
  validate(1, -∞, 5): 1 in (-∞, 5)? ✓
    validate(null): return true
    validate(null): return true
  validate(6, 5, +∞): 6 in (5, +∞)? ✓
    validate(3, 5, 6): 3 in (5, 6)? ✗ → INVALID!
    (3 < 5, so it fails the lower bound)
\`\`\`

\`\`\`java
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

**Common mistake:** Using \`int\` for bounds fails when node values are \`Integer.MIN_VALUE\` or \`Integer.MAX_VALUE\`. Use \`long\` or \`TreeNode\` references.

---

### Example 2: Binary Tree Maximum Path Sum — Return vs Use

**Problem:** Find the maximum path sum. A path can start and end at any node.

**Key insight:** At each node, we need two different things:
1. **"Use" value:** The max path sum passing THROUGH this node (left + node + right)
   → This updates the global answer
2. **"Return" value:** The max path sum starting FROM this node going DOWN (one direction)
   → This is what we return to the parent

\`\`\`
         [-10]
        /     \\
      [9]     [20]
             /    \\
           [15]   [7]

At node 15: return 15, use = 15
At node 7:  return 7,  use = 7
At node 20: left=15, right=7
  USE: 15 + 20 + 7 = 42 → update global max
  RETURN: max(15, 7) + 20 = 35

At node 9:  return 9, use = 9
At node -10: left=9, right=35
  USE: 9 + (-10) + 35 = 34 → global max still 42
  RETURN: max(9, 35) + (-10) = 25

Global max = 42 (path: 15 → 20 → 7)

The distinction:
  RETURN to parent: can only go in ONE direction (node + best child)
  USE for answer: can go BOTH directions (left + node + right)
  Also: if a path sum is negative, don\`t include it (use 0 = skip).
\`\`\`

\`\`\`java
int maxSum = Integer.MIN_VALUE;

public int maxPathSum(TreeNode root) {
    maxGain(root);
    return maxSum;
}

private int maxGain(TreeNode node) {
    if (node == null) return 0;
    int leftGain = Math.max(0, maxGain(node.left));   // ignore negative paths
    int rightGain = Math.max(0, maxGain(node.right));

    // "Use": path through this node
    int pathThroughNode = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, pathThroughNode);

    // "Return": best single-direction path from this node
    return node.val + Math.max(leftGain, rightGain);
}
\`\`\`

---

### Example 3: Serialize and Deserialize Binary Tree

**Problem:** Convert a tree to a string and reconstruct it.

\`\`\`
Tree:
      [1]
     /   \\
   [2]   [3]
         / \\
       [4] [5]

Preorder serialization with null markers:
  Visit 1 → "1,"
  Visit 2 → "2,"
  Visit null (2\`s left) → "#,"
  Visit null (2\`s right) → "#,"
  Visit 3 → "3,"
  Visit 4 → "4,"
  Visit null → "#,"
  Visit null → "#,"
  Visit 5 → "5,"
  Visit null → "#,"
  Visit null → "#,"

Result: "1,2,#,#,3,4,#,#,5,#,#"

Deserialization:
  Read "1" → create node(1)
    Read "2" → create node(2) as left child
      Read "#" → null (2\`s left)
      Read "#" → null (2\`s right)
    Read "3" → create node(3) as right child
      Read "4" → create node(4) as left child
        Read "#" → null
        Read "#" → null
      Read "5" → create node(5) as right child
        Read "#" → null
        Read "#" → null
\`\`\`

\`\`\`java
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

---

## ⚠️ Common Mistakes

1. **Not handling null root:** First line should always be \`if (root == null) return ...\`. The return value depends on the problem (0 for height, true for validation, null for search).

2. **Confusing height and depth:** Height goes up (leaf=0, root=max). Depth goes down (root=0, leaf=max). They are NOT the same! Height of a node + depth of that node = height of tree.

3. **BST validation with wrong bounds:** Checking only node.left.val < node.val is WRONG. Must ensure ALL descendants satisfy the bound. Use \`long\` for bounds to handle edge values.

4. **Forgetting to backtrack:** In path problems using HashMap/HashSet (like Path Sum III), you MUST undo map changes after returning from a recursive call. Otherwise, left subtree state leaks into right subtree.

5. **Assuming balanced tree:** Worst-case BST height is O(n), not O(log n). A skewed tree is essentially a linked list. Mention this in interviews when discussing complexity.

6. **Modifying tree during traversal:** Morris traversal intentionally creates and removes threads. Accidental modification in other traversals causes subtle bugs. Be explicit about when you modify tree structure.

7. **Wrong parent pointer in LCA:** Binary tree LCA uses different algorithm than BST LCA. Don\`t use BST optimizations on general binary trees.

8. **Off-by-one in level-order:** Save \`queue.size()\` before the inner loop. Processing elements during the loop changes the queue size, causing wrong level boundaries.

---

## 💡 Java-Specific Tips

### TreeMap and TreeSet
\`\`\`java
// TreeMap — Red-Black tree backed sorted map
TreeMap<Integer, String> map = new TreeMap<>();
map.put(5, "five"); map.put(2, "two"); map.put(8, "eight");

map.firstKey();          // 2 (smallest)
map.lastKey();           // 8 (largest)
map.floorKey(4);         // 2 (largest ≤ 4)
map.ceilingKey(4);       // 5 (smallest ≥ 4)
map.lowerKey(5);         // 2 (largest < 5)
map.higherKey(5);        // 8 (smallest > 5)
map.subMap(2, true, 8, false); // keys in [2, 8)
map.headMap(5);          // keys < 5
map.tailMap(5);          // keys ≥ 5

// TreeSet — similar operations
TreeSet<Integer> set = new TreeSet<>();
set.floor(4);    set.ceiling(4);
set.lower(5);    set.higher(5);
\`\`\`

### Recursion Patterns
\`\`\`java
// Bottom-up (most common for tree problems)
public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Top-down (pass info via parameters)
public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return root.val == targetSum;
    return hasPathSum(root.left, targetSum - root.val)
        || hasPathSum(root.right, targetSum - root.val);
}

// Global state (track running max)
int diameter = 0;
public int diameterOfBinaryTree(TreeNode root) {
    height(root);
    return diameter;
}
private int height(TreeNode node) {
    if (node == null) return 0;
    int left = height(node.left), right = height(node.right);
    diameter = Math.max(diameter, left + right);
    return 1 + Math.max(left, right);
}
\`\`\`

### Useful Tree Operations
\`\`\`java
// Check if tree is symmetric
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

// Invert a binary tree
public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
}

// Kth smallest in BST — O(H + k) time
public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        if (--k == 0) return curr.val;
        curr = curr.right;
    }
    return -1;
}

// Right side view — BFS, take last per level
public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new ArrayDeque<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (i == size - 1) result.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return result;
}
\`\`\`

---

## 🔗 Comparison Tables

### Top-Down vs Bottom-Up Recursion

| Aspect | Top-Down (Preorder) | Bottom-Up (Postorder) |
|---|---|---|
| Direction | Pass info DOWN via params | Compute results UP from children |
| When to use | Need ancestor info at node | Need subtree info at node |
| Example | Path sum (pass remaining sum) | Max depth (return height) |
| Example | BST validate (pass range) | Diameter (return height, track max) |
| Pros | Intuitive, like DFS | Cleaner, composes well |
| Cons | May need global state | Need to combine child results |

### Tree Problem Categories

| Category | Problems | Approach |
|---|---|---|
| Traversal | Level order, zigzag, boundary | BFS or modified DFS |
| Path | Path sum, max path sum, diameter | Bottom-up DFS |
| Construction | Build from traversals, serialize | Recursive D&C |
| BST-specific | Validate, kth smallest, LCA | Inorder property |
| Modification | Invert, flatten, prune | Top-down or bottom-up |
| Ancestor | LCA, distance between nodes | Recursive search |

### Segment Tree vs Fenwick Tree (BIT)

| Feature | Segment Tree | Fenwick Tree (BIT) |
|---|---|---|
| Space | O(4n) | O(n) |
| Build | O(n) | O(n log n) |
| Point update | O(log n) | O(log n) |
| Range query | O(log n) | O(log n) |
| Range update | O(log n) with lazy | Complex to implement |
| Implementation | More complex | Very concise (~10 lines) |
| Flexibility | Sum, min, max, GCD | Primarily sum/count |
| When to use | Range updates or non-sum | Prefix sum + point update |

### Fenwick Tree (BIT) Implementation
\`\`\`java
class BIT {
    int[] tree;
    int n;

    BIT(int n) {
        this.n = n;
        tree = new int[n + 1]; // 1-indexed
    }

    // Add delta to index i — O(log n)
    public void update(int i, int delta) {
        for (i++; i <= n; i += i & (-i))
            tree[i] += delta;
    }

    // Prefix sum [0..i] — O(log n)
    public int query(int i) {
        int sum = 0;
        for (i++; i > 0; i -= i & (-i))
            sum += tree[i];
        return sum;
    }

    // Range sum [l..r]
    public int rangeQuery(int l, int r) {
        return query(r) - (l > 0 ? query(l - 1) : 0);
    }
}
\`\`\`

### Construct Tree from Traversals
\`\`\`java
// Build from preorder + inorder — O(n) time, O(n) space
public TreeNode buildTree(int[] preorder, int[] inorder) {
    Map<Integer, Integer> inMap = new HashMap<>();
    for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
    return build(preorder, inMap, new int[]{0}, 0, inorder.length - 1);
}

private TreeNode build(int[] pre, Map<Integer, Integer> inMap,
                        int[] preIdx, int inStart, int inEnd) {
    if (inStart > inEnd) return null;
    TreeNode root = new TreeNode(pre[preIdx[0]++]);
    int inRoot = inMap.get(root.val);
    root.left = build(pre, inMap, preIdx, inStart, inRoot - 1);
    root.right = build(pre, inMap, preIdx, inRoot + 1, inEnd);
    return root;
}
\`\`\`

### Path Sum Variants
\`\`\`java
// Path Sum III — count paths with target sum (start/end anywhere)
// Uses prefix sum technique on tree — O(n) time, O(h) space
public int pathSum(TreeNode root, int targetSum) {
    Map<Long, Integer> prefixMap = new HashMap<>();
    prefixMap.put(0L, 1);
    return dfs(root, 0L, targetSum, prefixMap);
}

private int dfs(TreeNode node, long currSum, int target, Map<Long, Integer> map) {
    if (node == null) return 0;
    currSum += node.val;
    int count = map.getOrDefault(currSum - target, 0);
    map.merge(currSum, 1, Integer::sum);
    count += dfs(node.left, currSum, target, map);
    count += dfs(node.right, currSum, target, map);
    map.merge(currSum, -1, Integer::sum); // BACKTRACK!
    return count;
}
\`\`\`
`,
  },
  {
    slug: 'heaps-and-priority-queues',
    title: 'Heaps & Priority Queues',
    icon: 'ArrowUpDown',
    description: 'Use heap-based structures for top-K problems, median finding, and efficient merge operations.',
    color: 'orange',
    content: '# Heaps and Priority Queues ÔÇö Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## ­ƒôî Core Concepts\n\n### What is a Heap?\n\nA **heap** is a **complete binary tree** that satisfies the **heap property**, stored compactly as an **array**. "Complete" means every level is fully filled except possibly the last, which is filled left to right.\n\n| Type | Property | Root holds |\n|------|----------|------------|\n| **Min-Heap** | Every parent <= its children | Minimum element |\n| **Max-Heap** | Every parent >= its children | Maximum element |\n\n### Why Heaps?\n\nHeaps solve a fundamental problem: maintaining quick access to the extreme element (min or max) while supporting efficient insertions and deletions.\n\n| Operation | Sorted Array | Unsorted Array | Heap |\n|-----------|-------------|---------------|------|\n| Find min/max | O(1) | O(n) | **O(1)** |\n| Insert | O(n) | O(1) | **O(log n)** |\n| Delete min/max | O(n) | O(n) | **O(log n)** |\n| Build from n items | O(n log n) | O(n) | **O(n)** |\n\n### Java Classes\n\n\`\`\`java\n// Min-Heap (default)\nPriorityQueue<Integer> minHeap = new PriorityQueue<>();\n\n// Max-Heap\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n\n// Custom Comparator ÔÇö by frequency, then alphabetical\nPriorityQueue<String> pq = new PriorityQueue<>((a, b) -> {\n    if (freq.get(a) != freq.get(b)) return freq.get(b) - freq.get(a);\n    return a.compareTo(b);\n});\n\n// Comparator.comparing pattern\nPriorityQueue<int[]> pq2 = new PriorityQueue<>(\n    Comparator.comparingInt((int[] a) -> a[0])\n              .thenComparingInt(a -> a[1])\n);\n\`\`\`\n\n**Key PriorityQueue methods:**\n- \`offer(e)\` / \`add(e)\` ÔÇö insert element, O(log n)\n- \`poll()\` ÔÇö remove and return min/max, O(log n)\n- \`peek()\` ÔÇö view min/max without removing, O(1)\n- \`remove(obj)\` ÔÇö remove arbitrary element, O(n) (linear search!)\n- \`size()\`, \`isEmpty()\` ÔÇö O(1)\n\n---\n\n## ­ƒöì Visual Deep Dive\n\n### Array Representation of a Heap\n\nA complete binary tree maps perfectly to an array with **zero wasted space**:\n\n\`\`\`\nTree View:                    Array View (0-indexed):\n                              Index: [0] [1] [2] [3] [4] [5] [6]\n        10                    Value: [10, 20, 15, 30, 40, 50, 25]\n       /  \\\n     20    15                 Parent-Child Formulas (0-indexed):\n    /  \\   / \\                ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ\n  30   40 50  25              Parent of i    : (i - 1) / 2\n                              Left child of i : 2 * i + 1\n                              Right child of i: 2 * i + 2\n\nMapping:\n  Tree Node ÔåÆ Array Index\n  10 (root)  ÔåÆ [0]         parent(-) left(1) right(2)\n  20         ÔåÆ [1]         parent(0) left(3) right(4)\n  15         ÔåÆ [2]         parent(0) left(5) right(6)\n  30         ÔåÆ [3]         parent(1) left(-) right(-)\n  40         ÔåÆ [4]         parent(1) left(-) right(-)\n  50         ÔåÆ [5]         parent(2) left(-) right(-)\n  25         ÔåÆ [6]         parent(2) left(-) right(-)\n\`\`\`\n\n**Why arrays?** No pointer overhead, perfect cache locality, and parent/child navigation is simple arithmetic.\n\n### Heapify Up (Sift Up) ÔÇö Used during Insert\n\nWhen we insert a new element, it goes to the **end** of the array (next available position in the complete tree). Then we "bubble it up" by comparing with its parent and swapping if the heap property is violated.\n\n**Example: Insert 5 into this min-heap:**\n\n\`\`\`\nStep 0 ÔÇö Starting heap:         Array: [10, 20, 15, 30, 40]\n        10\n       /  \\\n     20    15\n    /  \\\n  30   40\n\nStep 1 ÔÇö Add 5 at next position (index 5 = left child of 15):\n        10                      Array: [10, 20, 15, 30, 40, 5]\n       /  \\\n     20    15\n    /  \\   /\n  30  40  5\n  \n  Compare 5 with parent 15 (index 2): 5 < 15 ÔåÆ SWAP\n\nStep 2 ÔÇö After first swap:\n        10                      Array: [10, 20, 5, 30, 40, 15]\n       /  \\\n     20     5\n    /  \\   /\n  30  40  15\n  \n  Compare 5 with parent 10 (index 0): 5 < 10 ÔåÆ SWAP\n\nStep 3 ÔÇö After second swap (DONE ÔÇö 5 is now root):\n         5                      Array: [5, 20, 10, 30, 40, 15]\n       /  \\\n     20    10\n    /  \\   /\n  30  40  15\n\`\`\`\n\n**Time: O(log n)** ÔÇö at most we traverse the height of the tree.\n\n### Heapify Down (Sift Down) ÔÇö Used during Extract/Delete\n\nWhen we remove the root (min or max), we replace it with the **last element** and then "bubble it down" by swapping with the **smaller child** (min-heap) or **larger child** (max-heap).\n\n**Example: Extract min from this min-heap:**\n\n\`\`\`\nStep 0 ÔÇö Starting heap:         Array: [5, 20, 10, 30, 40, 15]\n         5\n       /  \\\n     20    10\n    /  \\   /\n  30  40  15\n\nStep 1 ÔÇö Remove root, move last element (15) to root:\n        15                      Array: [15, 20, 10, 30, 40]\n       /  \\\n     20    10\n    /  \\\n  30   40\n  \n  Compare 15 with children: left=20, right=10\n  Smallest child is 10 (right): 15 > 10 ÔåÆ SWAP with right\n\nStep 2 ÔÇö After swap:\n        10                      Array: [10, 20, 15, 30, 40]\n       /  \\\n     20    15\n    /  \\\n  30   40\n  \n  15 is now at index 2. Children would be at index 5, 6 ÔåÆ out of bounds.\n  No more children ÔåÆ DONE\n\`\`\`\n\n**Time: O(log n)** ÔÇö at most we traverse the height of the tree.\n\n### Build Heap in O(n) ÔÇö Why Not O(n log n)?\n\n**Approach:** Start from the last non-leaf node and heapify-down each node.\n\n\`\`\`\nInput array: [4, 10, 3, 5, 1]\n\nTree view:\n       4\n      / \\\n    10    3\n   /  \\\n  5    1\n\nLast non-leaf = index (n/2 - 1) = index 1 (value 10)\n\nStep 1: Heapify-down index 1 (value 10):\n  Children: 5, 1. Min child = 1. Swap 10 Ôåö 1.\n       4                After: [4, 1, 3, 5, 10]\n      / \\\n     1    3\n   /  \\\n  5   10\n\nStep 2: Heapify-down index 0 (value 4):\n  Children: 1, 3. Min child = 1. Swap 4 Ôåö 1.\n       1\n      / \\\n     4    3              After: [1, 4, 3, 5, 10]\n   /  \\\n  5   10\n  Children of 4: 5, 10. Min = 5. 4 < 5 ÔåÆ STOP.\n\nFinal min-heap: [1, 4, 3, 5, 10] Ô£ô\n\`\`\`\n\n**Mathematical Proof that Build Heap is O(n), not O(n log n):**\n\n\`\`\`\nHeight h of a complete binary tree with n nodes: h = floor(logÔéé n)\n\nNumber of nodes at height k: at most ceil(n / 2^(k+1))\n\nWork for each node at height k: O(k) ÔÇö heapify-down traverses at most k levels\n\nTotal work = ╬ú (k=0 to h) [ceil(n / 2^(k+1)) ├ù k]\n           Ôëñ n ├ù ╬ú (k=0 to h) [k / 2^(k+1)]\n           = n ├ù ╬ú (k=0 to Ôê×) [k / 2^(k+1)]\n           = n ├ù 1                               (by the identity ╬ú k┬Àx^k = x/(1-x)┬▓ with x=1/2)\n           = O(n)\n\nKey insight: Most nodes are near the bottom (many leaves, few high nodes),\nand bottom nodes do LITTLE work (height 0 = no sifting), while the\nfew nodes near the top do more work but there are exponentially fewer of them.\n\nContrast with inserting one-by-one:\n  Each of n inserts does O(log n) work ÔåÆ O(n log n) total.\n  Build-heap is faster because it processes bottom-up!\n\`\`\`\n\n---\n\n## ÔÜí Key Algorithms & Techniques\n\n### 1. Java PriorityQueue Internals & Patterns\n\n**Internal structure:** Java\'s \`PriorityQueue\` uses a **binary min-heap** backed by a resizable \`Object[]\` array. Initial capacity is 11; grows by 50% when small (< 64), doubles when large.\n\n\`\`\`java\n// === Common Comparator patterns ===\n\n// 1. Natural order min-heap (default)\nPriorityQueue<Integer> minPQ = new PriorityQueue<>();\n\n// 2. Max-heap via reverseOrder\nPriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());\n\n// 3. Lambda comparator ÔÇö sort by second element of array\nPriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);\n\n// 4. Comparator.comparing ÔÇö cleaner for complex keys\nPriorityQueue<Map.Entry<String, Integer>> pq2 = new PriorityQueue<>(\n    Map.Entry.<String, Integer>comparingByValue().reversed()\n);\n\n// 5. Multi-level sort: by frequency desc, then alphabetical\nPriorityQueue<String> pq3 = new PriorityQueue<>((a, b) -> {\n    int freqDiff = freq.get(b) - freq.get(a);\n    return freqDiff != 0 ? freqDiff : a.compareTo(b);\n});\n\`\`\`\n\n**Complexity:**\n| Operation | Time | Notes |\n|-----------|------|-------|\n| \`offer()\` | O(log n) | Sift up |\n| \`poll()\` | O(log n) | Sift down |\n| \`peek()\` | O(1) | Return root |\n| \`remove(Object)\` | O(n) | Linear search + sift |\n| \`contains()\` | O(n) | Linear search |\n\n**Warning:** \`remove(Object)\` is O(n)! If you need frequent arbitrary removal, consider a TreeMap or indexed priority queue.\n\n### 2. Top-K Pattern (Min-Heap of Size K)\n\n**Idea:** To find the K largest elements, maintain a **min-heap of size K**. As you process each element, if it is larger than the heap\'s min, evict the min and insert the new element. At the end, the heap contains the K largest.\n\n\`\`\`\nFinding Top-3 from stream: [7, 2, 9, 1, 5, 8, 3]\n\nProcess 7: heap = [7]              size < 3, just add\nProcess 2: heap = [2, 7]           size < 3, just add\nProcess 9: heap = [2, 7, 9]        size == 3, heap full\nProcess 1: 1 < peek(2)?  YES ÔåÆ skip (1 is too small)\nProcess 5: 5 > peek(2)?  YES ÔåÆ poll 2, offer 5 ÔåÆ heap = [5, 7, 9]\nProcess 8: 8 > peek(5)?  YES ÔåÆ poll 5, offer 8 ÔåÆ heap = [7, 8, 9]\nProcess 3: 3 < peek(7)?  YES ÔåÆ skip\n\nResult: heap = [7, 8, 9] ÔÇö the top 3 elements Ô£ô\n\`\`\`\n\n\`\`\`java\npublic int[] topK(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) {\n            minHeap.poll();  // Evict smallest ÔÇö too small to be top-K\n        }\n    }\n    int[] result = new int[k];\n    for (int i = k - 1; i >= 0; i--) {\n        result[i] = minHeap.poll();\n    }\n    return result;\n}\n\`\`\`\n\n**Why min-heap for top-K (not max-heap)?** A min-heap lets us efficiently check and evict the smallest of our K candidates. If a new element is bigger than the current smallest candidate, it replaces it.\n\n**Time:** O(n log k) ÔÇö each of n elements may trigger O(log k) insert/remove on a heap of size k.\n**Space:** O(k)\n\n### 3. Two-Heap Pattern (Find Median)\n\n**Idea:** Maintain two heaps that split the data into a lower half and upper half:\n- **maxHeap** (left half) ÔÇö stores the smaller half, max at top\n- **minHeap** (right half) ÔÇö stores the larger half, min at top\n\nThe median is derived from the tops of these two heaps.\n\n**Balance rule:** \`maxHeap.size() >= minHeap.size()\` and \`maxHeap.size() - minHeap.size() <= 1\`\n\n\`\`\`\nInsert sequence: 5, 15, 1, 3, 8\n\nStep 1: Insert 5\n  maxHeap: [5]     minHeap: []\n  Median = 5\n\nStep 2: Insert 15\n  15 > maxHeap.peek(5) ÔåÆ goes to minHeap\n  maxHeap: [5]     minHeap: [15]\n  Sizes equal ÔåÆ Median = (5 + 15) / 2 = 10.0\n\nStep 3: Insert 1\n  1 Ôëñ maxHeap.peek(5) ÔåÆ goes to maxHeap\n  maxHeap: [5, 1]  minHeap: [15]\n  maxHeap bigger by 1 ÔåÆ OK\n  Median = 5\n\nStep 4: Insert 3\n  3 Ôëñ maxHeap.peek(5) ÔåÆ goes to maxHeap\n  maxHeap: [5, 3, 1]  minHeap: [15]\n  maxHeap bigger by 2! ÔåÆ Rebalance: move 5 to minHeap\n  maxHeap: [3, 1]     minHeap: [5, 15]\n  Sizes equal ÔåÆ Median = (3 + 5) / 2 = 4.0\n\nStep 5: Insert 8\n  8 > maxHeap.peek(3) ÔåÆ goes to minHeap\n  maxHeap: [3, 1]     minHeap: [5, 8, 15]\n  minHeap bigger! ÔåÆ Rebalance: move 5 to maxHeap\n  maxHeap: [5, 3, 1]  minHeap: [8, 15]\n  maxHeap bigger by 1 ÔåÆ OK\n  Median = 5\n\`\`\`\n\n\`\`\`java\nclass MedianFinder {\n    private PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n    private PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n\n    public void addNum(int num) {\n        maxHeap.offer(num);\n        // Ensure max of left <= min of right\n        minHeap.offer(maxHeap.poll());\n        // Keep maxHeap same size or one bigger\n        if (minHeap.size() > maxHeap.size()) {\n            maxHeap.offer(minHeap.poll());\n        }\n    }\n\n    public double findMedian() {\n        if (maxHeap.size() > minHeap.size()) {\n            return maxHeap.peek();\n        }\n        return (maxHeap.peek() + minHeap.peek()) / 2.0;\n    }\n}\n\`\`\`\n\n**Time:** O(log n) per addNum, O(1) per findMedian.\n**Space:** O(n) total.\n\n### 4. Merge K Sorted Lists/Arrays\n\n**Idea:** Use a min-heap to always extract the globally smallest element among the current heads of all K lists.\n\n\`\`\`\nK=3 sorted lists:\n  L0: [1, 4, 7]\n  L1: [2, 5, 8]\n  L2: [3, 6, 9]\n\nInitial heap (value, listIndex, elementIndex):\n  heap = [(1,0,0), (2,1,0), (3,2,0)]\n\nStep 1: Poll (1,0,0) ÔåÆ output 1. Push L0 next: (4,0,1)\n  heap = [(2,1,0), (3,2,0), (4,0,1)]\n\nStep 2: Poll (2,1,0) ÔåÆ output 2. Push L1 next: (5,1,1)\n  heap = [(3,2,0), (4,0,1), (5,1,1)]\n\nStep 3: Poll (3,2,0) ÔåÆ output 3. Push L2 next: (6,2,1)\n  heap = [(4,0,1), (5,1,1), (6,2,1)]\n\n...continues until all elements processed...\n\nOutput: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\`\`\`\n\n\`\`\`java\npublic ListNode mergeKLists(ListNode[] lists) {\n    PriorityQueue<ListNode> pq = new PriorityQueue<>(\n        Comparator.comparingInt(n -> n.val));\n    \n    for (ListNode head : lists) {\n        if (head != null) pq.offer(head);\n    }\n    \n    ListNode dummy = new ListNode(0), tail = dummy;\n    while (!pq.isEmpty()) {\n        ListNode min = pq.poll();\n        tail.next = min;\n        tail = tail.next;\n        if (min.next != null) pq.offer(min.next);\n    }\n    return dummy.next;\n}\n\`\`\`\n\n**Time:** O(N log K) where N = total elements across all lists, K = number of lists.\n**Space:** O(K) for the heap.\n\n### 5. Heap Sort (In-Place)\n\n**Idea:** Build a max-heap in-place, then repeatedly extract the max and place it at the end.\n\n\`\`\`\nInput: [4, 10, 3, 5, 1]\n\nPhase 1 ÔÇö Build Max-Heap (in-place, O(n)):\n  [4, 10, 3, 5, 1] ÔåÆ [10, 5, 3, 4, 1]\n  \n       10\n      /  \\\n     5    3\n    / \\\n   4   1\n\nPhase 2 ÔÇö Extract max repeatedly:\n  \n  Swap root(10) with last(1), reduce heap size:\n  [1, 5, 3, 4, | 10]  heapify-down index 0\n  [5, 4, 3, 1, | 10]\n  \n  Swap root(5) with last(1), reduce heap size:\n  [1, 4, 3, | 5, 10]  heapify-down index 0\n  [4, 1, 3, | 5, 10]\n  \n  Swap root(4) with last(3), reduce heap size:\n  [3, 1, | 4, 5, 10]  heapify-down index 0\n  [3, 1, | 4, 5, 10]\n  \n  Swap root(3) with last(1), reduce heap size:\n  [1, | 3, 4, 5, 10]\n  \n  Done: [1, 3, 4, 5, 10] Ô£ô\n\`\`\`\n\n\`\`\`java\npublic void heapSort(int[] arr) {\n    int n = arr.length;\n    // Build max-heap\n    for (int i = n / 2 - 1; i >= 0; i--) {\n        heapifyDown(arr, n, i);\n    }\n    // Extract elements one by one\n    for (int i = n - 1; i > 0; i--) {\n        // Move current root to end\n        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;\n        // Heapify reduced heap\n        heapifyDown(arr, i, 0);\n    }\n}\n\nprivate void heapifyDown(int[] arr, int heapSize, int i) {\n    int largest = i;\n    int left = 2 * i + 1, right = 2 * i + 2;\n    if (left < heapSize && arr[left] > arr[largest]) largest = left;\n    if (right < heapSize && arr[right] > arr[largest]) largest = right;\n    if (largest != i) {\n        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;\n        heapifyDown(arr, heapSize, largest);\n    }\n}\n\`\`\`\n\n**Time:** O(n log n) always. **Space:** O(1) ÔÇö in-place. **Not stable.**\n\n---\n\n## ­ƒÄ» Pattern Recognition\n\n\`\`\`\nProblem Keywords ÔåÆ Technique:\n\n"Kth largest/smallest"             ÔåÆ Min/Max heap of size K\n"Top K frequent"                   ÔåÆ HashMap + Min-heap of size K\n"Find median" / "streaming data"   ÔåÆ Two-Heap pattern (max + min)\n"Merge K sorted"                   ÔåÆ Min-heap with K entries\n"Closest K points"                 ÔåÆ Max-heap of size K (by distance)\n"Task scheduler" / "cooldown"      ÔåÆ Max-heap + greedy\n"Reorganize string"                ÔåÆ Max-heap by frequency\n"Sliding window maximum"           ÔåÆ Monotonic deque (NOT heap ÔÇö O(n) vs O(n log n))\n"Minimum cost to connect"          ÔåÆ Min-heap (greedy / Prim\'s MST)\n"Smallest range covering K lists"  ÔåÆ Min-heap + sliding window\n"Ugly number / Super ugly"         ÔåÆ Min-heap for candidate generation\n"Sort almost sorted array"         ÔåÆ Min-heap of size K\n\`\`\`\n\n---\n\n## ­ƒôè Complexity Cheat Sheet\n\n| Operation | Min/Max Heap | Notes |\n|-----------|-------------|-------|\n| Build Heap | **O(n)** | Bottom-up heapify |\n| Insert (offer) | O(log n) | Sift up |\n| Extract min/max (poll) | O(log n) | Sift down |\n| Peek | O(1) | Return root |\n| Delete arbitrary | O(n) | Find O(n) + sift O(log n) |\n| Search | O(n) | No ordering among siblings |\n| Heap Sort | O(n log n) | In-place, not stable |\n| Top-K | O(n log k) | k-sized heap |\n| Merge K sorted | O(N log K) | N total, K lists |\n\n| Pattern | Time | Space |\n|---------|------|-------|\n| Kth Largest (quickselect) | O(n) avg | O(1) |\n| Kth Largest (heap) | O(n log k) | O(k) |\n| Find Median (two heaps) | O(log n) per add | O(n) |\n| Task Scheduler | O(n log 26) Ôëê O(n) | O(1) |\n\n---\n\n## ­ƒºá Interview Deep Dive: Worked Examples\n\n### Example 1: Kth Largest Element in an Array (LC 215)\n\n**Problem:** Find the kth largest element in an unsorted array.\n\n**Input:** nums = [3,2,1,5,6,4], k = 2\n**Output:** 5\n\n**Approach: Min-Heap of Size K**\n\n\`\`\`\nProcess each element, maintain min-heap of size k=2:\n\nProcess 3: heap = [3]         (size < k, add)\nProcess 2: heap = [2, 3]      (size == k, heap full)\nProcess 1: 1 < peek(2)? YES ÔåÆ skip\nProcess 5: 5 > peek(2)? YES ÔåÆ poll 2, offer 5 ÔåÆ heap = [3, 5]\nProcess 6: 6 > peek(3)? YES ÔåÆ poll 3, offer 6 ÔåÆ heap = [5, 6]\nProcess 4: 4 < peek(5)? YES ÔåÆ skip\n\nAnswer: peek() = 5 Ô£ô (2nd largest)\n\`\`\`\n\n\`\`\`java\npublic int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) {\n            minHeap.poll();\n        }\n    }\n    return minHeap.peek();\n}\n// Time: O(n log k), Space: O(k)\n\`\`\`\n\n**Alternative: QuickSelect** ÔÇö O(n) average, O(n┬▓) worst. Better for one-time queries; heap is better for streaming.\n\n### Example 2: Find Median from Data Stream (LC 295)\n\n**Problem:** Design a data structure that supports adding numbers and finding the median.\n\n**Trace with insertions [41, 35, 62, 5, 97, 108]:**\n\n\`\`\`\naddNum(41):\n  maxHeap: []  ÔåÆ  offer 41 ÔåÆ [41]\n  Move to minHeap: maxHeap.poll ÔåÆ minHeap.offer(41)\n  maxHeap: []    minHeap: [41]\n  Rebalance (minHeap bigger): minHeap.poll ÔåÆ maxHeap.offer(41)\n  maxHeap: [41]  minHeap: []\n  Median = 41.0\n\naddNum(35):\n  maxHeap: [41]  ÔåÆ  offer 35 ÔåÆ [41, 35]\n  Move to minHeap: maxHeap.poll ÔåÆ minHeap.offer(41)\n  maxHeap: [35]  minHeap: [41]\n  Sizes equal ÔåÆ OK\n  Median = (35 + 41) / 2 = 38.0\n\naddNum(62):\n  maxHeap: [35]  minHeap: [41]  ÔåÆ  offer 62 to maxHeap ÔåÆ [62, 35]\n  Move to minHeap: maxHeap.poll(62) ÔåÆ minHeap.offer(62) ÔåÆ [41, 62]\n  maxHeap: [35]  minHeap: [41, 62]\n  Rebalance (minHeap bigger): minHeap.poll(41) ÔåÆ maxHeap.offer(41)\n  maxHeap: [41, 35]  minHeap: [62]\n  Median = 41.0\n\naddNum(5):\n  maxHeap: [41, 35]  ÔåÆ  offer 5 ÔåÆ [41, 35, 5]\n  Move to minHeap: maxHeap.poll(41) ÔåÆ minHeap.offer(41) ÔåÆ [41, 62]\n  maxHeap: [35, 5]  minHeap: [41, 62]\n  Sizes equal ÔåÆ OK\n  Median = (35 + 41) / 2 = 38.0\n\nSorted so far: [5, 35, 41, 62] ÔåÆ median = (35+41)/2 = 38.0 Ô£ô\n\`\`\`\n\n\`\`\`java\nclass MedianFinder {\n    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()); // max-heap\n    PriorityQueue<Integer> hi = new PriorityQueue<>(); // min-heap\n\n    public void addNum(int num) {\n        lo.offer(num);\n        hi.offer(lo.poll());       // ensure lo\'s max <= hi\'s min\n        if (hi.size() > lo.size()) // keep lo same size or +1\n            lo.offer(hi.poll());\n    }\n\n    public double findMedian() {\n        return lo.size() > hi.size()\n            ? lo.peek()\n            : (lo.peek() + hi.peek()) / 2.0;\n    }\n}\n\`\`\`\n\n### Example 3: Task Scheduler (LC 621)\n\n**Problem:** Given tasks and cooldown n, find minimum intervals to execute all tasks.\n\n**Input:** tasks = [A,A,A,B,B,B], n = 2\n**Output:** 8\n\n**Approach: Max-Heap + Greedy**\n\nThe most frequent task dictates the schedule. Use a max-heap to always pick the most frequent available task.\n\n\`\`\`\nFrequencies: A=3, B=3. Cooldown n=2.\nmaxHeap: [(A,3), (B,3)]   cooldownQueue: []\n\nTime 0: Poll (A,3) ÔåÆ execute A. Dec to (A,2). Cooldown until time 3.\n  Schedule: [A]  cooldownQueue: [(A,2,available@3)]\n\nTime 1: Poll (B,3) ÔåÆ execute B. Dec to (B,2). Cooldown until time 4.\n  Schedule: [A,B]  cooldownQueue: [(A,2,@3), (B,2,@4)]\n\nTime 2: Heap empty, no task available ÔåÆ idle\n  Schedule: [A,B,idle]\n\nTime 3: (A,2) available ÔåÆ push to heap. Poll (A,2) ÔåÆ execute A.\n  Schedule: [A,B,idle,A]  cooldownQueue: [(B,2,@4), (A,1,@6)]\n\nTime 4: (B,2) available ÔåÆ push to heap. Poll (B,2) ÔåÆ execute B.\n  Schedule: [A,B,idle,A,B]  cooldownQueue: [(A,1,@6), (B,1,@7)]\n\nTime 5: Heap empty ÔåÆ idle\n  Schedule: [A,B,idle,A,B,idle]\n\nTime 6: (A,1) available. Execute A. Count=0, don\'t re-add.\n  Schedule: [A,B,idle,A,B,idle,A]\n\nTime 7: (B,1) available. Execute B. Count=0, don\'t re-add.\n  Schedule: [A,B,idle,A,B,idle,A,B]\n\nTotal intervals = 8 Ô£ô\n\`\`\`\n\n\`\`\`java\npublic int leastInterval(char[] tasks, int n) {\n    int[] freq = new int[26];\n    for (char c : tasks) freq[c - \'A\']++;\n    \n    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n    for (int f : freq) if (f > 0) maxHeap.offer(f);\n    \n    Queue<int[]> cooldown = new LinkedList<>(); // [remaining_count, available_time]\n    int time = 0;\n    \n    while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {\n        time++;\n        if (!maxHeap.isEmpty()) {\n            int cnt = maxHeap.poll() - 1;\n            if (cnt > 0) cooldown.offer(new int[]{cnt, time + n});\n        }\n        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {\n            maxHeap.offer(cooldown.poll()[0]);\n        }\n    }\n    return time;\n}\n// Time: O(n * total_tasks), Space: O(26) = O(1)\n\`\`\`\n\n### Example 4: K Closest Points to Origin (LC 973)\n\n**Problem:** Find the K closest points to the origin.\n\n**Approach:** Max-heap of size K, keyed by distance. The heap evicts the farthest of our K candidates.\n\n\`\`\`java\npublic int[][] kClosest(int[][] points, int k) {\n    // Max-heap by distance\n    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(\n        (a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1])\n    );\n    for (int[] p : points) {\n        maxHeap.offer(p);\n        if (maxHeap.size() > k) maxHeap.poll();\n    }\n    return maxHeap.toArray(new int[k][]);\n}\n// Time: O(n log k), Space: O(k)\n\`\`\`\n\n---\n\n## ÔÜá´©Å Common Mistakes\n\n1. **Confusing min-heap and max-heap for top-K:** Use a **min-heap** of size K for the K **largest** (so you can evict the smallest candidate). Use a **max-heap** of size K for the K **smallest**.\n\n2. **Using \`remove(Object)\` in a loop:** PriorityQueue\'s \`remove(Object)\` is **O(n)**. If you need this frequently, use a **TreeMap** or **lazy deletion** (mark as deleted, skip during poll).\n\n3. **Assuming PriorityQueue is sorted:** Iterating a PriorityQueue does **NOT** give elements in sorted order! Only \`poll()\` gives the min/max. To get sorted output, poll repeatedly.\n\n4. **Integer overflow in comparators:** \`(a, b) -> a[0] - b[0]\` can overflow. Use \`Integer.compare(a[0], b[0])\` instead for safety.\n\n5. **Forgetting that Java PriorityQueue is a min-heap:** The default is min-heap. For max-heap, you must explicitly use \`Collections.reverseOrder()\` or a reversed comparator.\n\n6. **Not handling equal elements properly in two-heap:** When elements equal the max-heap\'s top, be consistent about which heap they go to. The standard pattern (always insert to maxHeap first, then move to minHeap) handles this correctly.\n\n7. **Using heap when simpler solution exists:** "Kth largest in a stream" needs a heap, but "Kth largest in a static array" can use QuickSelect O(n).\n\n8. **Build heap one-by-one instead of using heapify:** Inserting n elements one-by-one is O(n log n). Building with bottom-up heapify is O(n). For PriorityQueue, pass the collection to the constructor: \`new PriorityQueue<>(list)\`.\n\n---\n\n## ­ƒÆí Java-Specific Tips\n\n- **PriorityQueue constructor with collection** ÔÇö \`new PriorityQueue<>(Arrays.asList(...))\` builds the heap in O(n), not O(n log n).\n\n- **TreeMap as an alternative** ÔÇö When you need \`O(log n)\` deletion by value, use \`TreeMap<Integer, Integer>\` (value ÔåÆ count). Supports \`firstKey()\`, \`lastKey()\`, \`pollFirstEntry()\`.\n\n- **Lazy deletion pattern** ÔÇö Instead of removing from heap (O(n)), keep a separate \`HashMap<Integer, Integer>\` of "pending removals". When you \`poll()\`, check if that element is pending removal before using it.\n\n\`\`\`java\n// Lazy deletion example\nMap<Integer, Integer> toRemove = new HashMap<>();\n// To "remove" val from heap:\ntoRemove.merge(val, 1, Integer::sum);\n// When polling:\nwhile (!heap.isEmpty() && toRemove.getOrDefault(heap.peek(), 0) > 0) {\n    toRemove.merge(heap.poll(), -1, Integer::sum);\n}\n\`\`\`\n\n- **Custom objects in PriorityQueue** ÔÇö Either implement \`Comparable<T>\` or provide a \`Comparator<T>\`. Don\'t mix both ÔÇö the comparator takes precedence.\n\n- **PriorityQueue does NOT support \`index-based access\`** ÔÇö No \`get(i)\`. If you need indexed access, use a sorted structure like \`TreeSet\` or maintain a parallel array.\n\n---\n\n## ­ƒöù Comparison Tables\n\n### Heap vs Other Data Structures\n\n| Feature | PriorityQueue (Heap) | TreeMap | TreeSet | Sorted Array |\n|---------|---------------------|---------|---------|-------------|\n| Find min/max | O(1) | O(log n) | O(log n) | O(1) |\n| Insert | O(log n) | O(log n) | O(log n) | O(n) |\n| Delete min/max | O(log n) | O(log n) | O(log n) | O(1) or O(n) |\n| Delete arbitrary | **O(n)** | O(log n) | O(log n) | O(n) |\n| Search | **O(n)** | O(log n) | O(log n) | O(log n) |\n| Sorted iteration | O(n log n) | O(n) | O(n) | O(n) |\n| Duplicates | Ô£à Yes | Ô£à (via count) | ÔØî No | Ô£à Yes |\n| Space | O(n) | O(n) | O(n) | O(n) |\n\n### When to Use What?\n\n| Scenario | Best Choice | Why |\n|----------|------------|-----|\n| Top-K elements | Min-Heap (size K) | O(n log k) time, O(k) space |\n| Running median | Two Heaps | O(log n) per insert, O(1) median |\n| Merge K sorted | Min-Heap (size K) | O(N log K), only K elements in memory |\n| Priority scheduling | PriorityQueue | O(log n) insert/extract |\n| Sorted iteration needed | TreeMap/TreeSet | O(n) in-order traversal |\n| Frequent arbitrary deletes | TreeMap | O(log n) delete by key |\n| Sliding window max/min | **Monotonic Deque** | O(n) total, NOT heap |\n| Dijkstra\'s shortest path | PriorityQueue | O((V+E) log V) |\n\n\n## 🔍 Extended Visual Deep Dive\n\n### Heap as Array — Complete Mapping\n\n```\nTree view:          Array: [90, 70, 80, 30, 50, 60, 20, 10]\n       90           Index:  0   1   2   3   4   5   6   7\n      /  \\\n    70    80        Parent of i = (i-1)/2\n   / \\   / \\       Left child = 2*i + 1\n  30  50 60  20    Right child = 2*i + 2\n /\n10\n\nKey relationships:\n  - Parent of index 5 (value 60): (5-1)/2 = 2 → index 2 (value 80) ✓\n  - Left child of index 1 (value 70): 2*1+1 = 3 → index 3 (value 30) ✓\n  - Right child of index 1 (value 70): 2*1+2 = 4 → index 4 (value 50) ✓\n  - Is leaf? Index >= n/2 (for n=8, indices 4,5,6,7 are leaves)\n```\n\n### Insert 95 — Sift Up Walkthrough\n\n```\nStep 0: [90, 70, 80, 30, 50, 60, 20, 10, 95]  ← added at index 8\n               90\n              /  \\\n            70    80\n           / \\   / \\\n          30  50 60  20\n         / \\\n        10  95\n\nStep 1: Compare 95 with parent at (8-1)/2 = 3 → parent is 30\n        95 > 30, so SWAP positions 8 and 3\n        [90, 70, 80, 95, 50, 60, 20, 10, 30]\n               90\n              /  \\\n            70    80\n           / \\   / \\\n          95  50 60  20\n         / \\\n        10  30\n\nStep 2: Compare 95 with parent at (3-1)/2 = 1 → parent is 70\n        95 > 70, so SWAP positions 3 and 1\n        [90, 95, 80, 70, 50, 60, 20, 10, 30]\n               90\n              /  \\\n            95    80\n           / \\   / \\\n          70  50 60  20\n         / \\\n        10  30\n\nStep 3: Compare 95 with parent at (1-1)/2 = 0 → parent is 90\n        95 > 90, so SWAP positions 1 and 0\n        [95, 90, 80, 70, 50, 60, 20, 10, 30]\n               95\n              /  \\\n            90    80\n           / \\   / \\\n          70  50 60  20\n         / \\\n        10  30\n        ✓ 95 is now at root. Sift-up complete! (3 swaps for height-3 tree)\n```\n\n### Extract-Max — Sift Down Walkthrough\n\n```\nHeap:   [95, 90, 80, 70, 50, 60, 20, 10, 30]\n\nStep 0: Remove root (95). Move last element (30) to root position.\n        [30, 90, 80, 70, 50, 60, 20, 10]\n               30\n              /  \\\n            90    80\n           / \\   / \\\n          70  50 60  20\n         /\n        10\n\nStep 1: Compare 30 with children: left=90, right=80. Max child = 90 at index 1.\n        30 < 90, so SWAP positions 0 and 1.\n        [90, 30, 80, 70, 50, 60, 20, 10]\n               90\n              /  \\\n            30    80\n           / \\   / \\\n          70  50 60  20\n         /\n        10\n\nStep 2: Compare 30 with children: left=70, right=50. Max child = 70 at index 3.\n        30 < 70, so SWAP positions 1 and 3.\n        [90, 70, 80, 30, 50, 60, 20, 10]\n               90\n              /  \\\n            70    80\n           / \\   / \\\n          30  50 60  20\n         /\n        10\n\nStep 3: Compare 30 with children: left=10. Max child = 10 at index 7.\n        30 > 10, so STOP. Heap property restored!\n        Final: [90, 70, 80, 30, 50, 60, 20, 10]\n        ✓ Extract-max complete! Returned 95. (2 swaps)\n```\n\n### Build Heap O(n) — Why Not O(n log n)?\n\n```\nBottom-up heapify processes from last internal node up to root.\n\nArray: [4, 10, 3, 5, 1, 8, 2]     n=7, last internal = n/2 - 1 = 2\n\nInitial tree:\n         4\n        / \\\n      10    3\n     / \\   / \\\n    5   1  8   2\n\nStep 1: Heapify index 2 (value 3)\n  Children: 8, 2. Max child = 8.\n  3 < 8 → swap.  Result: [4, 10, 8, 5, 1, 3, 2]\n         4\n        / \\\n      10    8\n     / \\   / \\\n    5   1  3   2\n\nStep 2: Heapify index 1 (value 10)\n  Children: 5, 1. Max child = 5.\n  10 > 5 → no swap needed.\n\nStep 3: Heapify index 0 (value 4)\n  Children: 10, 8. Max child = 10.\n  4 < 10 → swap.  Result: [10, 4, 8, 5, 1, 3, 2]\n        10\n        / \\\n       4    8\n      / \\  / \\\n     5  1 3   2\n  Continue sifting 4 down:\n  Children: 5, 1. Max child = 5.\n  4 < 5 → swap.  Result: [10, 5, 8, 4, 1, 3, 2]\n        10\n        / \\\n       5    8\n      / \\  / \\\n     4  1 3   2\n  ✓ Build complete!\n\nWhy O(n) not O(n log n)?\n  Height h | # nodes at height | Work per node | Total work\n  ---------|-------------------|---------------|----------\n  0 (leaf) |      n/2          |      0        |    0\n  1        |      n/4          |      1        |   n/4\n  2        |      n/8          |      2        |   n/4\n  3        |      n/16         |      3        |   3n/16\n  ...      |      ...          |     ...       |   ...\n\n  Total = n * Σ(h/2^(h+1)) for h=0 to log(n)\n        = n * [1/4 + 2/8 + 3/16 + ...]\n        = n * 1/2 * Σ(h/2^h)\n        = n * 1/2 * 2  (series converges to 2)\n        = n\n  Therefore: BUILD-HEAP = O(n)  ✓\n```\n\n### Two-Heap Median Finder — Full Walkthrough\n\n```\nMaintain two heaps:\n  maxHeap: stores the SMALLER half (top = max of smaller half)\n  minHeap: stores the LARGER half (top = min of larger half)\n\nInvariant: |maxHeap.size - minHeap.size| <= 1\n\nProcess stream: [5, 2, 8, 1, 4, 9, 3]\n\nAdd 5:  maxH=[5]             | minH=[]              | Median = 5.0\n        (first element goes to maxHeap)\n\nAdd 2:  maxH=[5] → add 2     | minH=[]\n        5 > minH.top? N/A, but sizes unbalanced\n        Rebalance: move 5 to minH\n        maxH=[2]             | minH=[5]              | Median = (2+5)/2 = 3.5\n\nAdd 8:  8 > maxH.top(2)? Yes → add to minH\n        maxH=[2]             | minH=[5,8]\n        minH has more → move minH.top(5) to maxH\n        maxH=[5,2]           | minH=[8]              | Median = 5.0\n\nAdd 1:  1 > maxH.top(5)? No → add to maxH\n        maxH=[5,2,1]         | minH=[8]\n        maxH has 2 more → move maxH.top(5) to minH\n        maxH=[2,1]           | minH=[5,8]            | Median = (2+5)/2 = 3.5\n\nAdd 4:  4 > maxH.top(2)? Yes → add to minH\n        maxH=[2,1]           | minH=[4,5,8]\n        minH has 2 more → move minH.top(4) to maxH\n        maxH=[4,2,1]         | minH=[5,8]            | Median = 4.0\n\nAdd 9:  9 > maxH.top(4)? Yes → add to minH\n        maxH=[4,2,1]         | minH=[5,8,9]\n        Equal sizes.\n        maxH=[4,2,1]         | minH=[5,8,9]          | Median = (4+5)/2 = 4.5\n\nAdd 3:  3 > maxH.top(4)? No → add to maxH\n        maxH=[4,3,2,1]       | minH=[5,8,9]\n        maxH has 1 more.\n        maxH=[4,3,2,1]       | minH=[5,8,9]          | Median = 4.0\n```\n\n### Java PriorityQueue — Complete API Reference\n\n```java\n// DEFAULT: Min-Heap\nPriorityQueue<Integer> minHeap = new PriorityQueue<>();\nminHeap.offer(5);    // O(log n) — add element\nminHeap.peek();      // O(1)     — view top WITHOUT removing\nminHeap.poll();      // O(log n) — remove and return top\nminHeap.size();      // O(1)\nminHeap.isEmpty();   // O(1)\nminHeap.contains(5); // O(n)     — WARNING: linear scan!\nminHeap.remove(5);   // O(n)     — WARNING: linear scan + shift!\n\n// MAX-HEAP using reverseOrder\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n\n// MAX-HEAP using lambda\nPriorityQueue<Integer> maxHeap2 = new PriorityQueue<>((a, b) -> b - a);\n// ⚠️ WARNING: (a,b) -> b-a can overflow! Use Integer.compare(b,a) instead.\nPriorityQueue<Integer> maxHeapSafe = new PriorityQueue<>((a, b) -> Integer.compare(b, a));\n\n// Custom comparator for pairs: sort by value, then by key\nPriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {\n    if (a[1] != b[1]) return a[1] - b[1]; // sort by value ascending\n    return a[0] - b[0];                     // tie-break by key ascending\n});\npq.offer(new int[]{1, 5});\npq.offer(new int[]{2, 3});\npq.offer(new int[]{3, 5});\n// Poll order: [2,3], [1,5], [3,5]\n\n// Frequency-based priority (e.g., Top-K Frequent)\nMap<Integer, Integer> freq = new HashMap<>();\nPriorityQueue<Integer> topK = new PriorityQueue<>(\n    (a, b) -> freq.get(a) - freq.get(b) // min-heap by frequency\n);\n```\n\n### Top-K Elements — Visual Showing Min-Heap Eviction\n\n```\nProblem: Find top 3 frequent elements in [1,1,1,2,2,3,3,3,3,4]\n\nStep 1: Build frequency map\n  {1:3, 2:2, 3:4, 4:1}\n\nStep 2: Use min-heap of size K=3 (sorted by frequency)\n\nProcess freq entries:\n  Add (1,3): heap = [(1,3)]                    size=1 < K, just add\n  Add (2,2): heap = [(2,2), (1,3)]              size=2 < K, just add\n  Add (3,4): heap = [(2,2), (1,3), (3,4)]       size=3 = K, just add\n  Add (4,1): freq=1 < heap.peek().freq=2 → SKIP (don\'t add, it\'s smaller than min)\n\n  ┌─────────────────────────────────────┐\n  │  Min-Heap (size 3, by frequency)     │\n  │                                      │\n  │         (2,2)  ← top (min freq)      │\n  │        /     \\                       │\n  │     (1,3)   (3,4)                    │\n  │                                      │\n  │  (4,1) tries to enter: 1 < 2 → ✗    │\n  └─────────────────────────────────────┘\n\n  Result: elements in heap = [1, 2, 3] → these are the top-3 frequent!\n\nWhy min-heap of size K (not max-heap)?\n  - Min-heap keeps the SMALLEST of the top-K at the root\n  - New element only replaces root if it\'s BIGGER → maintains top-K invariant\n  - Time: O(n log K) vs O(n log n) for sorting\n  - Space: O(K) vs O(n) — critical when n is huge\n```\n\n### Meeting Rooms II — Detailed Trace\n\n```\nProblem: Find minimum meeting rooms needed.\nMeetings: [[0,30],[5,10],[15,20],[10,25]]\n\nSort by start time: [[0,30],[5,10],[10,25],[15,20]]\n\nUse min-heap storing END times (rooms in use):\n\n┌─────────────┬──────────────────────┬───────┬──────────────────────────────────┐\n│ Meeting      │ Heap (end times)     │ Rooms │ Action                           │\n├─────────────┼──────────────────────┼───────┼──────────────────────────────────┤\n│ [0, 30]     │ [30]                 │   1   │ No rooms → allocate new room     │\n│ [5, 10]     │ [10, 30]             │   2   │ 5 < 30 (earliest end) → new room │\n│ [10, 25]    │ [25, 30]             │   2   │ 10 >= 10 (poll 10) → reuse room  │\n│ [15, 20]    │ [20, 25, 30]         │   3   │ 15 < 25 (earliest end) → new room│\n└─────────────┴──────────────────────┴───────┴──────────────────────────────────┘\n\nAnswer: 3 rooms needed (max heap size = 3)\n\nTimeline visualization:\nRoom 1: |████████████████████████████████████████████| [0─────────────────────30]\nRoom 2: |     |████|                                  | [5────10]\n        |          |██████████████████|               | [10────────────25] (reused!)\nRoom 3: |               |██████████|                  | [15────────20]\n         0    5   10   15   20   25   30\n```\n\n```java\npublic int minMeetingRooms(int[][] intervals) {\n    Arrays.sort(intervals, (a, b) -> a[0] - b[0]); // sort by start\n    PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap of end times\n\n    for (int[] meeting : intervals) {\n        // If earliest ending room is free, reuse it\n        if (!heap.isEmpty() && heap.peek() <= meeting[0]) {\n            heap.poll(); // remove the freed room\n        }\n        heap.offer(meeting[1]); // add current meeting\'s end time\n    }\n    return heap.size(); // remaining rooms = answer\n}\n```\n\n### Task Scheduler — Greedy with Max-Heap\n\n```\nProblem: tasks = ["A","A","A","B","B","B"], n = 2\n         Must wait n intervals between same tasks.\n\nStrategy: Always execute the most frequent task first (greedy).\nUse max-heap sorted by remaining count.\n\nStep-by-step:\nFreq: {A:3, B:3}    Cooldown n=2\n\nTime │ Action │ Heap State      │ Cooldown Queue      │ Output\n─────┼────────┼─────────────────┼─────────────────────┼────────\n  0  │ Run A  │ [(B,3)]         │ [(A,2) ready@t=3]   │ A\n  1  │ Run B  │ []              │ [(A,2)@3,(B,2)@4]   │ AB\n  2  │ idle   │ []              │ [(A,2)@3,(B,2)@4]   │ AB_\n  3  │ Run A  │ [(B,2)]         │ [(A,1) ready@t=6]   │ AB_A\n  4  │ Run B  │ []              │ [(A,1)@6,(B,1)@7]   │ AB_AB\n  5  │ idle   │ []              │ [(A,1)@6,(B,1)@7]   │ AB_AB_\n  6  │ Run A  │ [(B,1)]         │ []                   │ AB_AB_A\n  7  │ Run B  │ []              │ []                   │ AB_AB_AB\n\nTotal intervals = 8.  Formula: max(n, (maxFreq-1)*(n+1) + countOfMaxFreq)\n                     = max(6, (3-1)*(2+1) + 2) = max(6, 8) = 8 ✓\n```\n\n```java\npublic int leastInterval(char[] tasks, int n) {\n    int[] freq = new int[26];\n    for (char c : tasks) freq[c - \'A\']++;\n\n    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n    for (int f : freq) if (f > 0) maxHeap.offer(f);\n\n    Queue<int[]> cooldown = new LinkedList<>(); // [remainingCount, availableTime]\n    int time = 0;\n\n    while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {\n        time++;\n        if (!maxHeap.isEmpty()) {\n            int count = maxHeap.poll() - 1;\n            if (count > 0) cooldown.offer(new int[]{count, time + n});\n        }\n        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {\n            maxHeap.offer(cooldown.poll()[0]);\n        }\n    }\n    return time;\n}\n```\n\n### Merge K Sorted Lists — Heap Strategy\n\n```\nLists: [1→4→5], [1→3→4], [2→6]\n\nMin-heap stores one node from each list (sorted by value):\n\nStep │ Heap contents    │ Poll  │ Result list\n─────┼──────────────────┼───────┼──────────────────\n  0  │ [1₁, 1₂, 2₃]    │       │ (empty)\n  1  │ [1₂, 2₃, 4₁]    │ 1₁    │ 1\n  2  │ [2₃, 3₂, 4₁]    │ 1₂    │ 1→1\n  3  │ [3₂, 4₁, 6₃]    │ 2₃    │ 1→1→2\n  4  │ [4₁, 4₂, 6₃]    │ 3₂    │ 1→1→2→3\n  5  │ [4₂, 6₃, 5₁]    │ 4₁    │ 1→1→2→3→4\n  6  │ [5₁, 6₃]        │ 4₂    │ 1→1→2→3→4→4\n  7  │ [6₃]            │ 5₁    │ 1→1→2→3→4→4→5\n  8  │ []              │ 6₃    │ 1→1→2→3→4→4→5→6\n\nSubscript = list number. Time: O(N log K), Space: O(K)\n```\n\n### Heap Problem Pattern Decision Tree\n\n```\n┌─────────────────────────────────────────────────┐\n│           WHEN TO USE A HEAP?                    │\n├─────────────────────────────────────────────────┤\n│                                                  │\n│  Need top-K elements?                            │\n│  ├─ YES → Min-heap of size K                     │\n│  │        O(n log K) time, O(K) space            │\n│  │                                               │\n│  Need running median?                            │\n│  ├─ YES → Two heaps (max-heap + min-heap)        │\n│  │        O(log n) per insert, O(1) for median   │\n│  │                                               │\n│  Need to repeatedly get min/max?                 │\n│  ├─ YES → Min-heap or Max-heap                   │\n│  │        O(log n) insert/extract                │\n│  │                                               │\n│  Merging K sorted sequences?                     │\n│  ├─ YES → Min-heap with K entries                │\n│  │        O(N log K) total                       │\n│  │                                               │\n│  Scheduling with priorities?                     │\n│  ├─ YES → PriorityQueue with custom comparator   │\n│  │                                               │\n│  Need sorted order of all elements?              │\n│  └─ Consider: TreeMap/TreeSet instead of heap    │\n│     (heap doesn\'t support ordered traversal)     │\n└─────────────────────────────────────────────────┘\n```\n\n### Common Heap Mistakes and Fixes\n\n```\n❌ MISTAKE 1: Using (a,b) -> a-b for large numbers\n   PriorityQueue<Integer> pq = new PriorityQueue<>((a,b) -> a - b);\n   // OVERFLOW when a = Integer.MAX_VALUE, b = -1\n   ✅ FIX: Use Integer.compare(a, b)\n\n❌ MISTAKE 2: Modifying objects already in the heap\n   pq.offer(node);\n   node.priority = newValue; // Heap doesn\'t know! Order is broken!\n   ✅ FIX: Remove and re-add:\n   pq.remove(node);\n   node.priority = newValue;\n   pq.offer(node);\n   // Or use lazy deletion (mark deleted, skip when polled)\n\n❌ MISTAKE 3: Forgetting PriorityQueue.remove() is O(n)\n   for (int x : toRemove) pq.remove(x); // O(n) per remove → O(n²) total!\n   ✅ FIX: Use lazy deletion or TreeMap for frequent removals\n\n❌ MISTAKE 4: Wrong heap direction for Top-K\n   // To find K LARGEST, use MIN-heap (evict smallest of top-K)\n   // To find K SMALLEST, use MAX-heap (evict largest of bottom-K)\n   // Counterintuitive but correct!\n\n❌ MISTAKE 5: Not handling equal frequencies in Top-K Frequent\n   // When frequencies tie, problem may require lexicographic order\n   PriorityQueue<String> pq = new PriorityQueue<>(\n       (a, b) -> freq.get(a).equals(freq.get(b))\n           ? b.compareTo(a) // reverse lex for min-heap trick\n           : freq.get(a) - freq.get(b)\n   );\n```\n\n### Complexity Comparison Table\n\n```\n┌──────────────────────────┬────────────┬────────────┬─────────────┐\n│ Operation                │ Binary Heap│ TreeMap     │ Sorted Array│\n├──────────────────────────┼────────────┼────────────┼─────────────┤\n│ Insert                   │ O(log n)   │ O(log n)   │ O(n)        │\n│ Find min/max             │ O(1)       │ O(log n)   │ O(1)        │\n│ Extract min/max          │ O(log n)   │ O(log n)   │ O(1) or O(n)│\n│ Delete arbitrary         │ O(n)*      │ O(log n)   │ O(n)        │\n│ Search                   │ O(n)       │ O(log n)   │ O(log n)    │\n│ Build from array         │ O(n)       │ O(n log n) │ O(n log n)  │\n│ Merge two structures     │ O(n+m)     │ O(n log m) │ O(n+m)      │\n├──────────────────────────┼────────────┼────────────┼─────────────┤\n│ * PQ.remove(obj) is O(n) │            │            │             │\n│   because it must search │            │            │             │\n│   the entire array       │            │            │             │\n└──────────────────────────┴────────────┴────────────┴─────────────┘\n```\n\n',
  },
  {
    slug: 'hashmaps-and-sets',
    title: 'HashMaps & Sets',
    icon: 'Hash',
    description: 'Exploit O(1) lookups for frequency counting, grouping, caching, and classic design problems like LRU cache.',
    color: 'red',
    content: '# HashMaps and Sets ÔÇö Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## ­ƒôî Core Concepts\n\n### What is a HashMap?\n\nA **HashMap** maps **keys** to **values** using a **hash function** to compute an index into an internal bucket array. This achieves **O(1) average-case** lookup, insertion, and deletion.\n\n### What is a HashSet?\n\nA **HashSet** is a collection of **unique elements**, implemented internally as a HashMap where only keys matter (values are a dummy constant). It provides O(1) average-case \`add\`, \`remove\`, and \`contains\`.\n\n### Why HashMaps & Sets?\n\n| Problem | Without HashMap | With HashMap |\n|---------|----------------|-------------|\n| Check if element exists | O(n) scan | **O(1)** lookup |\n| Count frequencies | O(n┬▓) nested loop | **O(n)** single pass |\n| Find pairs with target sum | O(n┬▓) or O(n log n) | **O(n)** |\n| Group by property | O(n┬▓ or n log n) | **O(n)** grouping |\n| Detect duplicates | O(n log n) sort | **O(n)** set check |\n\n### Java Classes Overview\n\n\`\`\`java\n// === HashMap ===\nMap<String, Integer> map = new HashMap<>();\nmap.put("key", 1);                    // Insert/update\nmap.get("key");                       // Returns 1 (or null)\nmap.getOrDefault("missing", 0);       // Returns 0\nmap.containsKey("key");               // true\nmap.remove("key");                    // Remove entry\nmap.entrySet();                       // Set<Map.Entry<K,V>>\n\n// === HashSet ===\nSet<String> set = new HashSet<>();\nset.add("hello");                     // Add element\nset.contains("hello");                // true\nset.remove("hello");                  // Remove element\n\n// === LinkedHashMap (insertion order) ===\nMap<String, Integer> lhm = new LinkedHashMap<>();\n\n// === TreeMap (sorted keys, O(log n)) ===\nTreeMap<Integer, String> tm = new TreeMap<>();\ntm.firstKey();  tm.lastKey();         // Min/max key\ntm.floorKey(5); tm.ceilingKey(5);     // <= 5 and >= 5\n\`\`\`\n\n---\n\n## ­ƒöì Visual Deep Dive\n\n### Hash Function: Key ÔåÆ hashCode ÔåÆ Bucket Index\n\n\`\`\`\nKey: "hello"\n  Ôöé\n  Ôû╝\nhashCode(): "hello".hashCode() = 99162322\n  Ôöé\n  Ôû╝\nSpread/Perturb: h ^ (h >>> 16)  [reduces collisions]\n  = 99162322 ^ (99162322 >>> 16)\n  = 99162322 ^ 1513\n  = 99163803\n  Ôöé\n  Ôû╝\nBucket Index: hash & (capacity - 1)   [capacity is power of 2]\n  = 99163803 & 15  (if capacity = 16)\n  = 11\n  Ôöé\n  Ôû╝\nBucket[11]: Store (key="hello", value=...)\n\nVisual of bucket array (capacity=16):\nÔöîÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÉ\nÔöé 0  Ôöé 1  Ôöé 2  Ôöé 3  Ôöé 4  Ôöé 5  Ôöé 6  Ôöé 7  Ôöé 8  Ôöé 9  Ôöé 10 Ôöé     11     Ôöé 12 Ôöé 13 Ôöé 14 Ôöé 15 Ôöé\nÔöénullÔöénullÔöénullÔöénullÔöénullÔöénullÔöénullÔöénullÔöénullÔöénullÔöénullÔöé("hello",42)ÔöénullÔöénullÔöénullÔöénullÔöé\nÔööÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔöÿ\n\`\`\`\n\n### Collision Resolution: Chaining\n\nWhen multiple keys hash to the same bucket, Java uses a **linked list** (or **red-black tree** when the chain grows long):\n\n\`\`\`\nBucket[3]:  ("apple",1) ÔåÆ ("grape",7) ÔåÆ ("mango",3) ÔåÆ null\n            [Linked list chain ÔÇö each node has (key, value, next)]\n\nLookup "grape" at bucket 3:\n  1. Hash "grape" ÔåÆ bucket 3\n  2. Compare "apple".equals("grape")? NO ÔåÆ follow next\n  3. Compare "grape".equals("grape")? YES ÔåÆ return value 7\n\nWhen chain length > 8 and capacity >= 64:\n  Java 8+ converts chain to RED-BLACK TREE (O(log n) lookup within bucket)\n\nBucket[3]:  Linked List    ÔåÆ    Red-Black Tree\n            O(n) search         O(log n) search\n\`\`\`\n\n### Collision Resolution: Open Addressing (Linear Probing)\n\nAlternative approach (used in Python dicts, not Java HashMap):\n\n\`\`\`\nInsert keys that hash to same index:\n\nhash("cat") = 3, hash("dog") = 3, hash("rat") = 3\n\nStep 1: Insert "cat" at index 3\n  [_, _, _, "cat", _, _, _, _]\n\nStep 2: Insert "dog" ÔåÆ index 3 occupied ÔåÆ probe index 4 ÔåÆ empty ÔåÆ insert\n  [_, _, _, "cat", "dog", _, _, _]\n\nStep 3: Insert "rat" ÔåÆ index 3 occupied ÔåÆ index 4 occupied ÔåÆ index 5 ÔåÆ insert\n  [_, _, _, "cat", "dog", "rat", _, _]\n\nLookup "dog": hashÔåÆ3 ÔåÆ check "cat"Ôëá"dog" ÔåÆ check index 4 ÔåÆ "dog" found!\n\nProblem: Clustering ÔÇö consecutive filled slots degrade performance.\n\`\`\`\n\n### Java HashMap Internals: Capacity, Load Factor, Rehashing\n\n\`\`\`\nDEFAULT_INITIAL_CAPACITY = 16 (always power of 2)\nDEFAULT_LOAD_FACTOR = 0.75\n\nRehashing trigger: size > capacity ├ù loadFactor\n  With defaults: rehash when size > 16 ├ù 0.75 = 12\n\nRehashing process:\n  1. Create new array of 2├ù capacity (16 ÔåÆ 32)\n  2. Redistribute ALL entries (bucket index changes because capacity changed)\n  3. Old linked lists may split (some entries stay, others move to old_index + old_capacity)\n\nExample: capacity 4 ÔåÆ 8\n  Key "A" hash=5: bucket = 5 & 3 = 1  ÔåÆ  bucket = 5 & 7 = 5  (MOVED)\n  Key "B" hash=9: bucket = 9 & 3 = 1  ÔåÆ  bucket = 9 & 7 = 1  (STAYED)\n\nTreeification (Java 8+):\n  When a single bucket\'s chain length > TREEIFY_THRESHOLD (8)\n  AND total capacity >= MIN_TREEIFY_CAPACITY (64):\n    Linked list ÔåÆ Red-black tree\n  When chain shrinks below UNTREEIFY_THRESHOLD (6):\n    Red-black tree ÔåÆ Linked list\n\`\`\`\n\n### The equals() and hashCode() Contract\n\n\`\`\`\nTHE CONTRACT:\n  1. If a.equals(b) is true ÔåÆ a.hashCode() == b.hashCode() MUST be true\n  2. If a.hashCode() != b.hashCode() ÔåÆ a.equals(b) MUST be false\n  3. If a.hashCode() == b.hashCode() ÔåÆ a.equals(b) MAY be true or false (collision)\n\nWhat breaks when the contract is violated:\n\nCase: Override equals() but NOT hashCode()\n\n  class Point {\n      int x, y;\n      @Override public boolean equals(Object o) {\n          Point p = (Point) o;\n          return x == p.x && y == p.y;\n      }\n      // hashCode() NOT overridden ÔÇö uses Object.hashCode() (memory address)\n  }\n\n  Point p1 = new Point(1, 2);\n  Point p2 = new Point(1, 2);\n\n  p1.equals(p2) ÔåÆ TRUE   (same x, y)\n  p1.hashCode() ÔåÆ 135721  (memory address)\n  p2.hashCode() ÔåÆ 984532  (different memory address!)\n\n  HashMap<Point, String> map = new HashMap<>();\n  map.put(p1, "origin");\n  map.get(p2) ÔåÆ NULL!   // Different hashCode ÔåÆ different bucket ÔåÆ not found!\n\nFIX: Always override hashCode() when overriding equals():\n  @Override public int hashCode() {\n      return Objects.hash(x, y);\n  }\n\`\`\`\n\n---\n\n## ÔÜí Key Algorithms & Techniques\n\n### 1. Frequency Counting\n\nThe foundational HashMap pattern. Count occurrences of each element.\n\n\`\`\`java\n// Pattern 1: getOrDefault\nMap<Character, Integer> freq = new HashMap<>();\nfor (char c : s.toCharArray()) {\n    freq.put(c, freq.getOrDefault(c, 0) + 1);\n}\n\n// Pattern 2: merge (more concise)\nMap<Character, Integer> freq = new HashMap<>();\nfor (char c : s.toCharArray()) {\n    freq.merge(c, 1, Integer::sum);\n}\n\n// Pattern 3: computeIfAbsent for grouping\nMap<String, List<String>> groups = new HashMap<>();\nfor (String word : words) {\n    String key = sortedKey(word);\n    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);\n}\n\`\`\`\n\n**Time:** O(n), **Space:** O(k) where k = distinct elements.\n\n### 2. Two Sum Pattern: Complement Lookup\n\n**Idea:** For each element, check if its complement (target - element) exists in the map.\n\n\`\`\`\nInput: nums = [2, 7, 11, 15], target = 9\n\nStep 1: num=2, complement=7, map={}. 7 not in map. Store map={2ÔåÆ0}\nStep 2: num=7, complement=2, map={2ÔåÆ0}. 2 IS in map at index 0!\n  Return [0, 1] Ô£ô\n\nVisual trace:\n  Index:  0   1    2    3\n  Value:  2   7   11   15\n          Ôåô\n  map={} ÔåÆ Looking for 7? NO ÔåÆ map={2:0}\n              Ôåô\n  map={2:0} ÔåÆ Looking for 2? YES! ÔåÆ return [0, 1]\n\`\`\`\n\n\`\`\`java\npublic int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (seen.containsKey(complement)) {\n            return new int[]{seen.get(complement), i};\n        }\n        seen.put(nums[i], i);\n    }\n    return new int[]{};\n}\n// Time: O(n), Space: O(n)\n\`\`\`\n\n### 3. Prefix Sum + HashMap Pattern\n\n**Idea:** To find subarrays with a given sum, use running prefix sums. If \`prefix[j] - prefix[i] = k\`, then the subarray from \`i+1\` to \`j\` has sum \`k\`. Store prefix sums in a HashMap to find matches in O(1).\n\n\`\`\`\nProblem: Count subarrays with sum = 7\nInput: [3, 4, 7, 2, -3, 1, 4, 2]\n\nIndex:    0  1  2  3   4  5  6  7\nValue:    3  4  7  2  -3  1  4  2\nPrefix:   3  7 14 16  13 14 18 20\n                                    \nprefixMap starts with {0: 1} (empty prefix)\n\ni=0: prefix=3.  Need 3-7=-4.  Not in map. map={0:1, 3:1}\ni=1: prefix=7.  Need 7-7=0.   0 IS in map(count=1)! count+=1. map={0:1, 3:1, 7:1}\n  ÔåÆ subarray [0..1] = [3,4] sums to 7 Ô£ô\ni=2: prefix=14. Need 14-7=7.  7 IS in map(count=1)! count+=1. map={..., 14:1}\n  ÔåÆ subarray [2..2] = [7] sums to 7 Ô£ô\ni=3: prefix=16. Need 16-7=9.  Not in map. map={..., 16:1}\ni=4: prefix=13. Need 13-7=6.  Not in map. map={..., 13:1}\ni=5: prefix=14. Need 14-7=7.  7 IS in map(count=1)! count+=1. map={..., 14:2}\n  ÔåÆ subarray [2..5] = [7,2,-3,1] sums to 7 Ô£ô\ni=6: prefix=18. Need 18-7=11. Not in map.\ni=7: prefix=20. Need 20-7=13. 13 IS in map(count=1)! count+=1.\n  ÔåÆ subarray [5..7] = [1,4,2] sums to 7 Ô£ô\n\nTotal count = 4\n\`\`\`\n\n\`\`\`java\npublic int subarraySum(int[] nums, int k) {\n    Map<Integer, Integer> prefixCount = new HashMap<>();\n    prefixCount.put(0, 1);  // Empty prefix has sum 0\n    int sum = 0, count = 0;\n    for (int num : nums) {\n        sum += num;\n        count += prefixCount.getOrDefault(sum - k, 0);\n        prefixCount.merge(sum, 1, Integer::sum);\n    }\n    return count;\n}\n// Time: O(n), Space: O(n)\n\`\`\`\n\n### 4. LRU Cache: HashMap + Doubly Linked List\n\n**Idea:** Combine O(1) HashMap lookups with O(1) DLL reordering to implement an LRU (Least Recently Used) cache.\n\n\`\`\`\nCapacity = 3\n\nOperations and state after each:\n\nput(1,A):  DLL: [1] ÔåÉÔåÆ null     Map: {1ÔåÆnode1}\nput(2,B):  DLL: [2] ÔåÉÔåÆ [1]     Map: {1ÔåÆnode1, 2ÔåÆnode2}\nput(3,C):  DLL: [3] ÔåÉÔåÆ [2] ÔåÉÔåÆ [1]   Map: {1,2,3}\n  (most recent at head, least recent at tail)\n\nget(1):    Move node1 to head:\n  DLL: [1] ÔåÉÔåÆ [3] ÔåÉÔåÆ [2]     Map: {1,2,3}\n\nput(4,D):  Cache full! Evict tail (key=2):\n  DLL: [4] ÔåÉÔåÆ [1] ÔåÉÔåÆ [3]     Map: {1,3,4}\n\nget(2):    Returns -1 (evicted!)\n\nInternal structure:\n  HashMap<Key, DLLNode>     DLL: Head ÔåÉÔåÆ ÔåÉÔåÆ ÔåÉÔåÆ Tail\n  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ           (sentinels)\n  Ôöé key ÔåÆ node  Ôöé ÔåÉÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔåÆ ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ ÔåÉÔåÆ ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ ÔåÉÔåÆ ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ\n  Ôöé 4 ÔåÆ node4   Ôöé           Ôöé  4  Ôöé    Ôöé  1  Ôöé    Ôöé  3  Ôöé\n  Ôöé 1 ÔåÆ node1   Ôöé           Ôöé (D) Ôöé    Ôöé (A) Ôöé    Ôöé (C) Ôöé\n  Ôöé 3 ÔåÆ node3   Ôöé           ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ    ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ    ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ\n  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ           Most Recent          Least Recent\n\`\`\`\n\n\`\`\`java\nclass LRUCache {\n    class Node {\n        int key, val;\n        Node prev, next;\n        Node(int k, int v) { key = k; val = v; }\n    }\n    \n    private Map<Integer, Node> map = new HashMap<>();\n    private Node head = new Node(0, 0), tail = new Node(0, 0);\n    private int capacity;\n    \n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        head.next = tail;\n        tail.prev = head;\n    }\n    \n    public int get(int key) {\n        if (!map.containsKey(key)) return -1;\n        Node node = map.get(key);\n        remove(node);\n        insertHead(node);\n        return node.val;\n    }\n    \n    public void put(int key, int value) {\n        if (map.containsKey(key)) {\n            remove(map.get(key));\n        }\n        Node node = new Node(key, value);\n        insertHead(node);\n        map.put(key, node);\n        if (map.size() > capacity) {\n            Node lru = tail.prev;\n            remove(lru);\n            map.remove(lru.key);\n        }\n    }\n    \n    private void remove(Node n) {\n        n.prev.next = n.next;\n        n.next.prev = n.prev;\n    }\n    \n    private void insertHead(Node n) {\n        n.next = head.next;\n        n.prev = head;\n        head.next.prev = n;\n        head.next = n;\n    }\n}\n// All operations: O(1) time\n\`\`\`\n\n### 5. Longest Consecutive Sequence (Set)\n\n**Idea:** Use a HashSet. For each number, only start counting a sequence if \`num - 1\` is NOT in the set (meaning \`num\` is the start of a sequence).\n\n\`\`\`java\npublic int longestConsecutive(int[] nums) {\n    Set<Integer> set = new HashSet<>();\n    for (int n : nums) set.add(n);\n    \n    int maxLen = 0;\n    for (int num : set) {\n        if (!set.contains(num - 1)) {  // Start of sequence\n            int len = 1;\n            while (set.contains(num + len)) len++;\n            maxLen = Math.max(maxLen, len);\n        }\n    }\n    return maxLen;\n}\n// Time: O(n), Space: O(n)\n\`\`\`\n\n---\n\n## ­ƒÄ» Pattern Recognition\n\n\`\`\`\nProblem Keywords ÔåÆ Technique:\n\n"Two sum" / "pair with target"        ÔåÆ HashMap (complement lookup)\n"Count frequency" / "most common"     ÔåÆ HashMap frequency count\n"Group by" / "anagrams"               ÔåÆ HashMap with computed key + computeIfAbsent\n"Subarray sum equals K"               ÔåÆ Prefix Sum + HashMap\n"Longest subarray with at most K"     ÔåÆ HashMap (sliding window + freq)\n"Contains duplicate"                  ÔåÆ HashSet\n"Intersection / union"                ÔåÆ HashSet operations\n"First non-repeating"                 ÔåÆ LinkedHashMap (preserves order)\n"LRU / LFU Cache"                    ÔåÆ HashMap + Doubly Linked List\n"Longest consecutive sequence"        ÔåÆ HashSet (find sequence starts)\n"Isomorphic / pattern matching"       ÔåÆ Two HashMaps (bidirectional mapping)\n"Substring with all chars"            ÔåÆ HashMap + sliding window\n"Design" / "O(1) insert/delete/random"ÔåÆ HashMap + ArrayList\n\`\`\`\n\n---\n\n## ­ƒôè Complexity Cheat Sheet\n\n| Operation | HashMap | TreeMap | LinkedHashMap | HashSet | TreeSet |\n|-----------|---------|---------|--------------|---------|---------|\n| put/add | O(1) avg | O(log n) | O(1) avg | O(1) avg | O(log n) |\n| get/contains | O(1) avg | O(log n) | O(1) avg | O(1) avg | O(log n) |\n| remove | O(1) avg | O(log n) | O(1) avg | O(1) avg | O(log n) |\n| Iteration order | Undefined | Sorted by key | Insertion order | Undefined | Sorted |\n| Worst case (single op) | O(n)* | O(log n) | O(n)* | O(n)* | O(log n) |\n| Space | O(n) | O(n) | O(n) | O(n) | O(n) |\n\n*O(n) worst case for hash structures with many collisions; O(log n) with treeification.\n\n| Pattern | Time | Space | Key Insight |\n|---------|------|-------|------------|\n| Two Sum | O(n) | O(n) | Complement lookup |\n| Frequency Count | O(n) | O(k) | merge() or getOrDefault() |\n| Group Anagrams | O(n ├ù k log k) | O(n ├ù k) | Sorted string as key |\n| Subarray Sum K | O(n) | O(n) | Prefix sum + map |\n| Longest Consecutive | O(n) | O(n) | Only start from sequence heads |\n| LRU Cache | O(1) per op | O(capacity) | HashMap + DLL |\n\n---\n\n## ­ƒºá Interview Deep Dive: Worked Examples\n\n### Example 1: Group Anagrams (LC 49)\n\n**Problem:** Group strings that are anagrams of each other.\n\n**Input:** ["eat","tea","tan","ate","nat","bat"]\n**Output:** [["eat","tea","ate"],["tan","nat"],["bat"]]\n\n**Key insight:** Anagrams have the same sorted characters. Use sorted string as HashMap key.\n\n\`\`\`\n"eat" ÔåÆ sort ÔåÆ "aet"\n"tea" ÔåÆ sort ÔåÆ "aet"  ÔåÆ same group!\n"tan" ÔåÆ sort ÔåÆ "ant"\n"ate" ÔåÆ sort ÔåÆ "aet"  ÔåÆ same group as eat, tea!\n"nat" ÔåÆ sort ÔåÆ "ant"  ÔåÆ same group as tan!\n"bat" ÔåÆ sort ÔåÆ "abt"\n\nHashMap after processing:\n  "aet" ÔåÆ ["eat", "tea", "ate"]\n  "ant" ÔåÆ ["tan", "nat"]\n  "abt" ÔåÆ ["bat"]\n\`\`\`\n\n\`\`\`java\npublic List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] arr = s.toCharArray();\n        Arrays.sort(arr);\n        String key = new String(arr);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}\n// Time: O(n ├ù k log k), Space: O(n ├ù k) where k = max string length\n\`\`\`\n\n**Alternative key strategy ÔÇö frequency array as string (avoids sorting):**\n\n\`\`\`java\n// O(n ├ù k) instead of O(n ├ù k log k)\nString key = Arrays.toString(count); // e.g., "[1,0,0,...,1,0,...,1]" for "eat"\n\`\`\`\n\n### Example 2: Subarray Sum Equals K (LC 560)\n\n**Problem:** Find total number of continuous subarrays whose sum equals k.\n\n**Input:** nums = [1,1,1], k = 2\n**Output:** 2\n\n**Detailed trace:**\n\n\`\`\`\nprefixMap = {0: 1} (base case: empty subarray)\nsum = 0, count = 0\n\ni=0: num=1, sum=1\n  Need sum-k = 1-2 = -1 in map? NO\n  map = {0:1, 1:1}\n\ni=1: num=1, sum=2\n  Need sum-k = 2-2 = 0 in map? YES (count=1) ÔåÆ count += 1 = 1\n  map = {0:1, 1:1, 2:1}\n  (subarray [0..1] = [1,1] has sum 2 Ô£ô)\n\ni=2: num=1, sum=3\n  Need sum-k = 3-2 = 1 in map? YES (count=1) ÔåÆ count += 1 = 2\n  map = {0:1, 1:1, 2:1, 3:1}\n  (subarray [1..2] = [1,1] has sum 2 Ô£ô)\n\nTotal count = 2 Ô£ô\n\`\`\`\n\n**Why prefix sum works:** If prefix[j] - prefix[i] = k, then sum(i+1..j) = k. The HashMap stores how many times each prefix sum has occurred, so we can count all valid i values in O(1).\n\n### Example 3: Longest Consecutive Sequence (LC 128)\n\n**Problem:** Find the length of the longest consecutive element sequence. Must run in O(n).\n\n**Input:** nums = [100, 4, 200, 1, 3, 2]\n**Output:** 4 (sequence: [1, 2, 3, 4])\n\n**Trace:**\n\n\`\`\`\nSet: {100, 4, 200, 1, 3, 2}\n\nCheck each number:\n\n100: Is 99 in set? NO ÔåÆ 100 is a sequence start\n  Count: 100 Ô£ô, 101? NO ÔåÆ length = 1\n\n4:   Is 3 in set? YES ÔåÆ 4 is NOT a sequence start, skip\n\n200: Is 199 in set? NO ÔåÆ 200 is a sequence start\n  Count: 200 Ô£ô, 201? NO ÔåÆ length = 1\n\n1:   Is 0 in set? NO ÔåÆ 1 IS a sequence start\n  Count: 1 Ô£ô, 2 Ô£ô, 3 Ô£ô, 4 Ô£ô, 5? NO ÔåÆ length = 4 Ôÿà\n\n3:   Is 2 in set? YES ÔåÆ skip (not a start)\n\n2:   Is 1 in set? YES ÔåÆ skip (not a start)\n\nmaxLen = 4 Ô£ô\n\`\`\`\n\n**Key insight:** Only start counting from sequence heads (numbers without a predecessor). This ensures each number is visited at most twice ÔÇö once in the outer loop, once in the inner while loop. Total: O(n).\n\n### Example 4: Design RandomizedSet (LC 380)\n\n**Problem:** Implement insert, remove, and getRandom, all in O(1) average time.\n\n**Insight:** Use ArrayList for O(1) random access + HashMap for O(1) lookup. On remove, swap the element with the last element to avoid O(n) shifting.\n\n\`\`\`java\nclass RandomizedSet {\n    List<Integer> list = new ArrayList<>();\n    Map<Integer, Integer> valToIdx = new HashMap<>();\n    Random rand = new Random();\n    \n    public boolean insert(int val) {\n        if (valToIdx.containsKey(val)) return false;\n        valToIdx.put(val, list.size());\n        list.add(val);\n        return true;\n    }\n    \n    public boolean remove(int val) {\n        if (!valToIdx.containsKey(val)) return false;\n        int idx = valToIdx.get(val);\n        int last = list.get(list.size() - 1);\n        list.set(idx, last);            // Overwrite with last\n        valToIdx.put(last, idx);        // Update last\'s index\n        list.remove(list.size() - 1);   // Remove last (O(1))\n        valToIdx.remove(val);\n        return true;\n    }\n    \n    public int getRandom() {\n        return list.get(rand.nextInt(list.size()));\n    }\n}\n\`\`\`\n\n---\n\n## ÔÜá´©Å Common Mistakes\n\n1. **Modifying a HashMap while iterating:** Using \`map.remove()\` inside a for-each loop causes \`ConcurrentModificationException\`. Use \`Iterator.remove()\` or \`removeIf()\` instead.\n\n2. **Using mutable objects as HashMap keys:** If you modify an object after inserting it as a key, its hashCode changes and the entry becomes unreachable. Always use immutable keys (String, Integer, etc.) or never modify keys after insertion.\n\n3. **Forgetting the \`{0: 1}\` base case in prefix sum:** The prefix sum pattern requires initializing the map with \`{0: 1}\` to handle subarrays starting from index 0.\n\n4. **Confusing \`hashCode()\` contract:** Override both \`equals()\` and \`hashCode()\` or neither. Overriding just \`equals()\` breaks HashMap lookups.\n\n5. **Comparing Integer objects with \`==\`:** In Java, \`Integer\` objects cached only for values -128 to 127. Use \`.equals()\` for Integer comparisons: \`map.get(a).equals(map.get(b))\`, not \`map.get(a) == map.get(b)\`.\n\n6. **Assuming HashMap preserves insertion order:** HashMap has NO order guarantee. Use \`LinkedHashMap\` for insertion order or \`TreeMap\` for sorted order.\n\n7. **Using \`int[]\` as HashMap key:** Arrays don\'t override \`hashCode()\` and \`equals()\` in Java ÔÇö they use object identity. Convert to \`String\` via \`Arrays.toString()\` or use a \`List<Integer>\` instead.\n\n8. **Not pre-sizing HashMap for known sizes:** When you know the number of entries, initialize with capacity: \`new HashMap<>((int)(n / 0.75) + 1)\` to avoid rehashing.\n\n---\n\n## ­ƒÆí Java-Specific Tips\n\n- **\`computeIfAbsent\`** ÔÇö The cleanest way to do "get or create":\n  \`\`\`java\n  map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);\n  // vs. verbose alternative:\n  if (!map.containsKey(key)) map.put(key, new ArrayList<>());\n  map.get(key).add(value);\n  \`\`\`\n\n- **\`merge()\`** ÔÇö The cleanest way to update counts:\n  \`\`\`java\n  map.merge(key, 1, Integer::sum);  // increment by 1\n  map.merge(key, -1, Integer::sum); // decrement by 1\n  \`\`\`\n\n- **\`Map.entry()\` (Java 9+)** ÔÇö Create immutable entries:\n  \`\`\`java\n  Map<String, Integer> map = Map.of("a", 1, "b", 2); // Immutable map\n  \`\`\`\n\n- **\`LinkedHashMap\` for LRU** ÔÇö Override \`removeEldestEntry()\` for a simple LRU cache:\n  \`\`\`java\n  Map<K, V> lru = new LinkedHashMap<>(capacity, 0.75f, true) {\n      protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n          return size() > capacity;\n      }\n  };\n  \`\`\`\n\n- **\`TreeMap\` navigation methods:**\n  \`\`\`java\n  TreeMap<Integer, V> tm = new TreeMap<>();\n  tm.floorKey(k);    // greatest key <= k\n  tm.ceilingKey(k);  // smallest key >= k\n  tm.subMap(lo, hi); // keys in [lo, hi)\n  tm.headMap(k);     // keys < k\n  tm.tailMap(k);     // keys >= k\n  \`\`\`\n\n- **Iterating entrySet() is faster than keySet() + get():**\n  \`\`\`java\n  // Good ÔÇö single traversal\n  for (Map.Entry<K, V> e : map.entrySet()) { use e.getKey(), e.getValue(); }\n  // Bad ÔÇö two lookups per entry\n  for (K key : map.keySet()) { V val = map.get(key); }\n  \`\`\`\n\n---\n\n## ­ƒöù Comparison Tables\n\n### Java Map/Set Collection Hierarchy\n\n| Type | Ordering | Null Keys | Null Values | Thread-Safe | Use When |\n|------|----------|-----------|-------------|-------------|----------|\n| HashMap | None | 1 allowed | Yes | No | Default O(1) map |\n| LinkedHashMap | Insertion (or access) | 1 allowed | Yes | No | Need order; LRU cache |\n| TreeMap | Sorted (natural/comparator) | No | Yes | No | Need sorted keys; range queries |\n| Hashtable | None | No | No | Yes (slow) | Legacy ÔÇö avoid |\n| ConcurrentHashMap | None | No | No | Yes (fast) | Multi-threaded |\n| HashSet | None | 1 allowed | N/A | No | Default O(1) set |\n| LinkedHashSet | Insertion | 1 allowed | N/A | No | Ordered unique elements |\n| TreeSet | Sorted | No | N/A | No | Sorted unique; range queries |\n\n### When to Use Which Map?\n\n| Scenario | Best Choice | Why |\n|----------|------------|-----|\n| General-purpose key-value | HashMap | O(1) avg, most common |\n| Need sorted keys | TreeMap | O(log n), navigable |\n| Need insertion order | LinkedHashMap | O(1) + ordering |\n| LRU cache (simple) | LinkedHashMap (access-order) | Built-in eviction |\n| LRU cache (full control) | HashMap + DLL | Custom eviction logic |\n| Frequency counting | HashMap<T, Integer> | merge() pattern |\n| Bidirectional mapping | Two HashMaps | map and reverseMap |\n| Multi-threaded | ConcurrentHashMap | Lock striping, no ConcurrentModEx |\n| Range queries on keys | TreeMap | subMap, floorKey, ceilingKey |\n| Unique elements + order | LinkedHashSet | O(1) + insertion order |\n\n\n## 🔍 Extended Visual Deep Dive\n\n### Hash Function — From Key to Bucket\n\n```\nHow HashMap maps a key to a bucket index:\n\nKey: "hello"\n  │\n  ▼\nhashCode(): "hello".hashCode() = 99162322\n  │\n  ▼\nSpread/Perturb: h ^ (h >>> 16)  [reduces collision in lower bits]\n  99162322 ^ (99162322 >>> 16) = 99163894\n  │\n  ▼\nBucket index: hash & (capacity - 1)  [like hash % capacity but faster]\n  99163894 & (16 - 1) = 99163894 & 15 = 6\n  │\n  ▼\nBucket 6 in the internal array\n\nWhy capacity must be power of 2:\n  hash & (2^n - 1) is equivalent to hash % 2^n\n  Bitwise AND is faster than modulo division\n  16 - 1 = 15 = 0b1111 → masks lower 4 bits\n  32 - 1 = 31 = 0b11111 → masks lower 5 bits\n```\n\n### Java HashMap — 16-Bucket Internal Diagram\n\n```\nHashMap<String, Integer> map = new HashMap<>();\nmap.put("apple", 1); map.put("banana", 2); map.put("cherry", 3);\nmap.put("date", 4);  map.put("elder", 5); map.put("fig", 6);\nmap.put("grape", 7); map.put("apricot", 8);\n\nInternal structure (capacity=16, load factor=0.75, threshold=12):\n\nBucket │ Contents (singly linked list → tree if len >= 8)\n───────┼──────────────────────────────────────────────────\n  0    │ null\n  1    │ ["banana":2] → null\n  2    │ ["cherry":3] → ["apricot":8] → null  ← COLLISION!\n  3    │ null\n  4    │ ["date":4] → null\n  5    │ ["elder":5] → null\n  6    │ ["apple":1] → ["fig":6] → null       ← COLLISION!\n  7    │ ["grape":7] → null\n  8    │ null\n  9    │ null\n 10    │ null\n 11    │ null\n 12    │ null\n 13    │ null\n 14    │ null\n 15    │ null\n\nLoad factor = 8/16 = 0.5  (below threshold of 0.75)\nWhen size > 12 (16 * 0.75), HashMap RESIZES to 32 buckets.\n\nJava 8+ optimization: When chain length >= 8 AND capacity >= 64,\nlinked list converts to RED-BLACK TREE for O(log n) lookup.\n```\n\n### Collision Resolution — Chaining vs Open Addressing\n\n```\n═══════════════════════════════════════════════════════════\n  SEPARATE CHAINING (Java HashMap)\n═══════════════════════════════════════════════════════════\n\nBucket 2: ["cherry":3] → ["apricot":8] → null\n\n  put("cherry", 3): hash("cherry") & 15 = 2, bucket empty → insert\n  put("apricot", 8): hash("apricot") & 15 = 2, bucket occupied → chain\n\n  get("apricot"): go to bucket 2, traverse chain:\n    "cherry".equals("apricot")? No → next\n    "apricot".equals("apricot")? Yes → return 8\n\n  Worst case: all keys hash to same bucket → O(n) lookup (rare)\n  Average case: O(1) with good hash function and load factor < 0.75\n\n\n═══════════════════════════════════════════════════════════\n  OPEN ADDRESSING (Python dict, not Java)\n═══════════════════════════════════════════════════════════\n\nLinear probing example:\n  hash("cat") = 3, hash("car") = 3, hash("cap") = 3\n\n  Index: [0] [1] [2] [3]     [4]     [5]     [6] [7]\n                     "cat"   "car"   "cap"\n                     (home)  (probe1) (probe2)\n\n  Lookup "cap": check 3 (cat≠cap), check 4 (car≠cap), check 5 (cap=cap) ✓\n  Deletion requires "tombstone" markers to not break probe chains.\n```\n\n### Rehashing — Growing from 16 to 32 Buckets\n\n```\nWhen load factor exceeds 0.75, HashMap doubles capacity and rehashes ALL entries.\n\nBEFORE (capacity=16):\n  Bucket 2: ["cherry":3] → ["apricot":8]\n  Bucket 6: ["apple":1] → ["fig":6]\n\nRehash process for each entry:\n  newIndex = hash & (newCapacity - 1)  // now & 31 instead of & 15\n\n  "cherry":  hash & 31 = 2   → stays in bucket 2\n  "apricot": hash & 31 = 18  → moves to bucket 18  (2 + 16)\n  "apple":   hash & 31 = 6   → stays in bucket 6\n  "fig":     hash & 31 = 22  → moves to bucket 22  (6 + 16)\n\nAFTER (capacity=32):\n  Bucket  2: ["cherry":3] → null        (chain split!)\n  Bucket  6: ["apple":1] → null         (chain split!)\n  Bucket 18: ["apricot":8] → null       (moved from bucket 2)\n  Bucket 22: ["fig":6] → null           (moved from bucket 6)\n\nKey insight: When doubling, each entry either STAYS in same bucket\nor moves to (oldIndex + oldCapacity). Only one new bit matters!\n\n  Old mask: 0b01111 (15)    hash bit 4 = 0 → same bucket\n  New mask: 0b11111 (31)    hash bit 4 = 1 → old + 16\n\nPerformance impact of rehashing:\n  ┌─────────────┬──────────────┬────────────────┐\n  │ Size        │ Rehash cost  │ Amortized cost │\n  ├─────────────┼──────────────┼────────────────┤\n  │ 12 → 32     │ rehash 12    │ O(1) per put   │\n  │ 24 → 64     │ rehash 24    │ O(1) per put   │\n  │ 48 → 128    │ rehash 48    │ O(1) per put   │\n  │ Total for n │ ~2n rehashes │ O(1) amortized │\n  └─────────────┴──────────────┴────────────────┘\n  Tip: new HashMap<>(expectedSize * 4/3) avoids rehashing!\n```\n\n### equals() and hashCode() Contract — What Breaks\n\n```\nTHE CONTRACT:\n  1. If a.equals(b) is TRUE  → a.hashCode() MUST == b.hashCode()\n  2. If a.hashCode() == b.hashCode() → a.equals(b) MAY be true or false (collision OK)\n  3. If a.equals(b) is FALSE → hashCodes CAN be same or different\n\n═══════════════════════════════════════════════════════════\n  WHAT BREAKS WHEN YOU VIOLATE THE CONTRACT\n═══════════════════════════════════════════════════════════\n\nScenario: Custom class overrides equals() but NOT hashCode()\n\nclass Point {\n    int x, y;\n    @Override\n    public boolean equals(Object o) {\n        Point p = (Point) o;\n        return x == p.x && y == p.y;\n    }\n    // ❌ hashCode() NOT overridden — uses Object.hashCode() (memory address)\n}\n\nPoint p1 = new Point(1, 2);\nPoint p2 = new Point(1, 2);  // same logical value\n\np1.equals(p2)          → true  ✓\np1.hashCode() == p2.hashCode()  → false ✗ (different objects!)\n\nHashMap<Point, String> map = new HashMap<>();\nmap.put(p1, "hello");\nmap.get(p2);  → NULL! ← BUG!\n\nWhy? p2.hashCode() → different bucket than p1 → never finds "hello"\n\n✅ FIX: Always override both equals() AND hashCode()\n@Override\npublic int hashCode() {\n    return Objects.hash(x, y);  // deterministic based on fields\n}\n```\n\n### Prefix Sum + HashMap — Subarray Sum Equals K Trace\n\n```\nProblem: nums = [1, 2, 3, -2, 5], K = 3\nFind total count of contiguous subarrays that sum to K.\n\nKey insight: If prefixSum[j] - prefixSum[i] = K,\nthen subarray (i,j] sums to K.\nSo we need: prefixSum[j] - K exists in previous prefix sums.\n\nTrace:\n┌───────┬────────┬───────────┬────────────────────────┬───────┬───────────────────┐\n│ Index │ num    │ prefixSum │ Need (pSum - K)        │ Count │ Map {pSum: freq}  │\n├───────┼────────┼───────────┼────────────────────────┼───────┼───────────────────┤\n│ init  │        │ 0         │                        │ 0     │ {0: 1}            │\n│ 0     │ 1      │ 1         │ 1-3 = -2 → not in map │ 0     │ {0:1, 1:1}        │\n│ 1     │ 2      │ 3         │ 3-3 = 0  → in map(1)! │ 1     │ {0:1, 1:1, 3:1}   │\n│ 2     │ 3      │ 6         │ 6-3 = 3  → in map(1)! │ 2     │ {0:1,1:1,3:1,6:1} │\n│ 3     │ -2     │ 4         │ 4-3 = 1  → in map(1)! │ 3     │ {0:1,1:1,3:1,6:1, │\n│       │        │           │                        │       │  4:1}              │\n│ 4     │ 5      │ 9         │ 9-3 = 6  → in map(1)! │ 4     │ {0:1,...,9:1}      │\n└───────┴────────┴───────────┴────────────────────────┴───────┴───────────────────┘\n\nFound subarrays (count=4):\n  [1,2]     indices 0-1, sum = 3 ✓\n  [3]       index 2, sum = 3 ✓\n  [3,-2,2]? No → [2,3,-2] indices 1-3, sum = 3 ✓\n  [3,-2,5]  indices 2-4, sum = 6? No → [-2,5] sum=3? → index 3-4, sum = 3 ✓\n  Hmm, let me recheck: prefix[4]-prefix[2] = 9-6 = 3 → subarray indices 3,4 = [-2,5] = 3 ✓\n```\n\n```java\npublic int subarraySum(int[] nums, int k) {\n    Map<Integer, Integer> prefixCount = new HashMap<>();\n    prefixCount.put(0, 1); // empty prefix has sum 0\n    int sum = 0, count = 0;\n\n    for (int num : nums) {\n        sum += num;\n        // How many previous prefixes have sum = (currentSum - k)?\n        count += prefixCount.getOrDefault(sum - k, 0);\n        prefixCount.merge(sum, 1, Integer::sum);\n    }\n    return count;\n}\n```\n\n### LRU Cache — HashMap + Doubly Linked List\n\n```\nCapacity = 3\n\nOperations: put(1,A), put(2,B), put(3,C), get(2), put(4,D)\n\nData structure: HashMap<key, DLL_Node> + Doubly Linked List\n\nState after put(1,A), put(2,B), put(3,C):\n  HashMap: {1→nodeA, 2→nodeB, 3→nodeC}\n  DLL: HEAD ↔ [3,C] ↔ [2,B] ↔ [1,A] ↔ TAIL\n       (most recent)              (least recent)\n\nState after get(2):  → returns B, moves node to front\n  HashMap: {1→nodeA, 2→nodeB, 3→nodeC}  (no change)\n  DLL: HEAD ↔ [2,B] ↔ [3,C] ↔ [1,A] ↔ TAIL\n       (most recent)              (LRU = 1,A)\n\nState after put(4,D):  → capacity full! Evict LRU = (1,A)\n  HashMap: {2→nodeB, 3→nodeC, 4→nodeD}  (removed key 1)\n  DLL: HEAD ↔ [4,D] ↔ [2,B] ↔ [3,C] ↔ TAIL\n       (most recent)              (new LRU = 3,C)\n\nInternal operations detail:\n  ┌────────────────────────────────────────────────────┐\n  │ get(key):                                          │\n  │   1. HashMap lookup: O(1)                          │\n  │   2. Move node to head of DLL: O(1)                │\n  │   3. Return value                                  │\n  │                                                    │\n  │ put(key, val):                                     │\n  │   1. If key exists: update value, move to head     │\n  │   2. If new key:                                   │\n  │      a. Create node, add to HashMap and DLL head   │\n  │      b. If over capacity: remove TAIL.prev node    │\n  │         (the LRU), delete from HashMap             │\n  │   All operations: O(1)                             │\n  └────────────────────────────────────────────────────┘\n```\n\n```java\nclass LRUCache {\n    class Node {\n        int key, val;\n        Node prev, next;\n        Node(int k, int v) { key = k; val = v; }\n    }\n\n    Map<Integer, Node> map = new HashMap<>();\n    Node head = new Node(0, 0), tail = new Node(0, 0);\n    int capacity;\n\n    public LRUCache(int cap) {\n        capacity = cap;\n        head.next = tail;\n        tail.prev = head;\n    }\n\n    public int get(int key) {\n        if (!map.containsKey(key)) return -1;\n        Node node = map.get(key);\n        remove(node);\n        insertHead(node);\n        return node.val;\n    }\n\n    public void put(int key, int value) {\n        if (map.containsKey(key)) remove(map.get(key));\n        Node node = new Node(key, value);\n        map.put(key, node);\n        insertHead(node);\n        if (map.size() > capacity) {\n            Node lru = tail.prev;\n            remove(lru);\n            map.remove(lru.key);\n        }\n    }\n\n    private void remove(Node n) {\n        n.prev.next = n.next;\n        n.next.prev = n.prev;\n    }\n\n    private void insertHead(Node n) {\n        n.next = head.next;\n        n.prev = head;\n        head.next.prev = n;\n        head.next = n;\n    }\n}\n```\n\n### Java Collection Comparison — Complete Reference Table\n\n```\n═══════════════════════════════════════════════════════════════════════════════════════════\n Map Implementations\n═══════════════════════════════════════════════════════════════════════════════════════════\n┌──────────────────┬────────────┬────────────┬───────────────────┬──────────────────────┐\n│ Implementation   │ Get/Put    │ Ordering   │ Null Keys/Values  │ Thread Safe          │\n├──────────────────┼────────────┼────────────┼───────────────────┼──────────────────────┤\n│ HashMap          │ O(1) avg   │ None       │ 1 null key, many  │ No                   │\n│                  │            │            │ null values        │                      │\n├──────────────────┼────────────┼────────────┼───────────────────┼──────────────────────┤\n│ LinkedHashMap    │ O(1) avg   │ Insertion  │ 1 null key, many  │ No                   │\n│                  │            │ order      │ null values        │                      │\n├──────────────────┼────────────┼────────────┼───────────────────┼──────────────────────┤\n│ TreeMap          │ O(log n)   │ Sorted by  │ No null keys      │ No                   │\n│                  │            │ key        │ (null values OK)   │                      │\n├──────────────────┼────────────┼────────────┼───────────────────┼──────────────────────┤\n│ ConcurrentHashMap│ O(1) avg   │ None       │ No null keys or   │ Yes (segment locks)  │\n│                  │            │            │ null values        │                      │\n├──────────────────┼────────────┼────────────┼───────────────────┼──────────────────────┤\n│ Hashtable        │ O(1) avg   │ None       │ No null keys or   │ Yes (synchronized)   │\n│ (Legacy)         │            │            │ null values        │ Slower than CHM      │\n└──────────────────┴────────────┴────────────┴───────────────────┴──────────────────────┘\n\n═══════════════════════════════════════════════════════════════════════════════════════════\n Set Implementations\n═══════════════════════════════════════════════════════════════════════════════════════════\n┌──────────────────┬────────────┬────────────┬──────────────────┬───────────────────────┐\n│ Implementation   │ Add/Remove │ Contains   │ Ordering         │ Use Case              │\n├──────────────────┼────────────┼────────────┼──────────────────┼───────────────────────┤\n│ HashSet          │ O(1) avg   │ O(1) avg   │ None             │ Fast membership test  │\n├──────────────────┼────────────┼────────────┼──────────────────┼───────────────────────┤\n│ LinkedHashSet    │ O(1) avg   │ O(1) avg   │ Insertion order  │ Ordered unique values │\n├──────────────────┼────────────┼────────────┼──────────────────┼───────────────────────┤\n│ TreeSet          │ O(log n)   │ O(log n)   │ Sorted           │ Range queries, floor/ │\n│                  │            │            │                  │ ceiling operations    │\n└──────────────────┴────────────┴────────────┴──────────────────┴───────────────────────┘\n\nWhen to use which:\n  HashMap  → Default choice. Fast, no ordering needed.\n  TreeMap  → Need sorted keys, range queries, floor/ceiling.\n  LinkedHashMap → Need insertion-order iteration (e.g., LRU cache).\n  ConcurrentHashMap → Multi-threaded access without external sync.\n```\n\n### HashMap vs TreeMap — Interview Decision Guide\n\n```\n┌──────────────────────────────────────────────────────────────────┐\n│  CHOOSE HashMap WHEN:                                             │\n│  • Just need key→value lookup                                     │\n│  • Don\'t care about order                                        │\n│  • Want fastest possible O(1) operations                          │\n│  • Frequency counting: map.merge(key, 1, Integer::sum)           │\n│  • Two-sum, group anagrams, isomorphic strings                   │\n│                                                                   │\n│  CHOOSE TreeMap WHEN:                                             │\n│  • Need keys in sorted order                                     │\n│  • Need floor/ceiling queries (nearest key ≤ or ≥ target)        │\n│  • Need range operations: subMap(from, to)                        │\n│  • Sliding window with ordered structure                          │\n│  • Calendar/interval problems needing ordered events              │\n│  Example: "Find the nearest timestamp ≤ target"                  │\n│    TreeMap<Integer, String> tm = new TreeMap<>();                 │\n│    tm.floorEntry(target); // O(log n) — nearest ≤ target         │\n│                                                                   │\n│  CHOOSE LinkedHashMap WHEN:                                       │\n│  • Need insertion-order or access-order iteration                 │\n│  • LRU cache implementation:                                     │\n│    new LinkedHashMap<>(cap, 0.75f, true) {                       │\n│        protected boolean removeEldestEntry(Map.Entry e) {         │\n│            return size() > capacity;                              │\n│        }                                                          │\n│    };                                                             │\n└──────────────────────────────────────────────────────────────────┘\n```\n\n### Useful HashMap Patterns for Interviews\n\n```java\n// Pattern 1: Frequency Count\nMap<Character, Integer> freq = new HashMap<>();\nfor (char c : s.toCharArray()) {\n    freq.merge(c, 1, Integer::sum); // cleaner than getOrDefault\n}\n\n// Pattern 2: Group By (Group Anagrams)\nMap<String, List<String>> groups = new HashMap<>();\nfor (String word : words) {\n    char[] sorted = word.toCharArray();\n    Arrays.sort(sorted);\n    String key = new String(sorted);\n    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);\n}\n\n// Pattern 3: Two-pass with HashMap\n// First pass: store all values\nMap<Integer, Integer> map = new HashMap<>();\nfor (int i = 0; i < nums.length; i++) map.put(nums[i], i);\n// Second pass: look up complement\nfor (int i = 0; i < nums.length; i++) {\n    int complement = target - nums[i];\n    if (map.containsKey(complement) && map.get(complement) != i)\n        return new int[]{i, map.get(complement)};\n}\n\n// Pattern 4: Sliding Window with HashMap\nMap<Character, Integer> window = new HashMap<>();\nint left = 0;\nfor (int right = 0; right < s.length(); right++) {\n    char c = s.charAt(right);\n    window.merge(c, 1, Integer::sum);\n    while (/* window invalid */) {\n        char d = s.charAt(left);\n        window.merge(d, -1, Integer::sum);\n        if (window.get(d) == 0) window.remove(d);\n        left++;\n    }\n    // update answer\n}\n```\n\n',
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    icon: 'Network',
    description: 'Master BFS, DFS, shortest paths, topological sort, MST, and advanced graph algorithms.',
    color: 'cyan',
    content: '# Graphs ÔÇö Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## ­ƒôî Core Concepts\n\n### What is a Graph?\n\nA **graph** G = (V, E) consists of:\n- **V** (vertices/nodes): the entities\n- **E** (edges): connections between entities\n\n| Type | Description | Example |\n|------|-------------|---------|\n| **Undirected** | Edges have no direction | Friendships, roads |\n| **Directed** | Edges have direction (u ÔåÆ v) | Following, dependencies |\n| **Weighted** | Edges have numeric costs | Road distances, latencies |\n| **Unweighted** | All edges have equal cost | Social connections |\n| **Cyclic** | Contains at least one cycle | General graphs |\n| **Acyclic** | No cycles | Trees, DAGs |\n| **DAG** | Directed Acyclic Graph | Task dependencies, course prereqs |\n| **Connected** | Path between every pair (undirected) | Single component |\n\n### Why Graphs?\n\nGraphs model relationships and are fundamental to:\n- Shortest path (GPS, networking)\n- Dependency resolution (build systems, course planning)\n- Social networks (friend suggestions, influence)\n- Grid/maze problems (treated as implicit graphs)\n- Network flow, matching, scheduling\n\n### Java Classes\n\n\`\`\`java\n// === Adjacency List (most common) ===\nMap<Integer, List<int[]>> graph = new HashMap<>(); // node ÔåÆ [(neighbor, weight)]\n// Or for unweighted:\nList<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n\n// === Edge List ===\nint[][] edges; // [[u, v, weight], ...]\n\n// === Adjacency Matrix ===\nint[][] matrix = new int[n][n]; // matrix[u][v] = weight (0 if no edge)\nboolean[][] connected = new boolean[n][n];\n\n// === Grid as Graph (implicit) ===\nint[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}}; // 4-directional\n\`\`\`\n\n---\n\n## ­ƒöì Visual Deep Dive\n\n### Graph Representations\n\nGiven this graph:\n\n\`\`\`\n    1 --- 2\n    |   / |\n    |  /  |\n    3 --- 4\n      \\\n       5\n\`\`\`\n\n**Adjacency List** (best for sparse graphs ÔÇö most interview problems):\n\n\`\`\`\n1: [2, 3]\n2: [1, 3, 4]\n3: [1, 2, 4, 5]\n4: [2, 3]\n5: [3]\n\nSpace: O(V + E)\nAdd edge: O(1)\nCheck edge (u,v): O(degree(u))\nIterate neighbors: O(degree(u))\n\`\`\`\n\n\`\`\`java\n// Build adjacency list from edge list\nList<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\nfor (int[] edge : edges) {\n    adj.get(edge[0]).add(edge[1]);\n    adj.get(edge[1]).add(edge[0]); // undirected\n}\n\`\`\`\n\n**Adjacency Matrix** (best for dense graphs or when checking edge existence frequently):\n\n\`\`\`\n    1  2  3  4  5\n1 [ 0  1  1  0  0 ]\n2 [ 1  0  1  1  0 ]\n3 [ 1  1  0  1  1 ]\n4 [ 0  1  1  0  0 ]\n5 [ 0  0  1  0  0 ]\n\nSpace: O(V┬▓)\nAdd edge: O(1)\nCheck edge (u,v): O(1)  ÔåÉ advantage\nIterate neighbors: O(V)  ÔåÉ disadvantage for sparse\n\`\`\`\n\n**Edge List** (best for algorithms that process edges, like Kruskal\'s MST or Bellman-Ford):\n\n\`\`\`\nedges = [(1,2), (1,3), (2,3), (2,4), (3,4), (3,5)]\n\nSpace: O(E)\nAdd edge: O(1)\nCheck edge: O(E)\nBest for: Kruskal, Bellman-Ford\n\`\`\`\n\n### BFS: Breadth-First Search (Level by Level)\n\nBFS explores all nodes at distance d before exploring nodes at distance d+1. Uses a **queue**.\n\n\`\`\`\nGraph:        BFS from node 1:\n  1 --- 2\n  |   / |     Queue states and visited order:\n  |  /  |     \n  3 --- 4     Step 0: queue=[1]        visited={1}\n    \\         \n     5        Step 1: Dequeue 1. Neighbors: 2,3\n              queue=[2,3]    visited={1,2,3}    dist: 2ÔåÆ1, 3ÔåÆ1\n              \n              Step 2: Dequeue 2. Neighbors: 1(visited),3(visited),4\n              queue=[3,4]    visited={1,2,3,4}  dist: 4ÔåÆ2\n              \n              Step 3: Dequeue 3. Neighbors: 1(v),2(v),4(v),5\n              queue=[4,5]    visited={1,2,3,4,5} dist: 5ÔåÆ2\n              \n              Step 4: Dequeue 4. All neighbors visited.\n              queue=[5]\n              \n              Step 5: Dequeue 5. All neighbors visited.\n              queue=[] ÔåÆ DONE\n\nBFS order: 1, 2, 3, 4, 5\nDistance from 1: {1:0, 2:1, 3:1, 4:2, 5:2}\n\nLevel-by-level view:\n  Level 0: [1]\n  Level 1: [2, 3]\n  Level 2: [4, 5]\n\`\`\`\n\n\`\`\`java\npublic int[] bfs(List<List<Integer>> adj, int start, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, -1);\n    dist[start] = 0;\n    Queue<Integer> queue = new LinkedList<>();\n    queue.offer(start);\n    \n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        for (int neighbor : adj.get(node)) {\n            if (dist[neighbor] == -1) {\n                dist[neighbor] = dist[node] + 1;\n                queue.offer(neighbor);\n            }\n        }\n    }\n    return dist;\n}\n// Time: O(V + E), Space: O(V)\n\`\`\`\n\n**BFS gives shortest path in unweighted graphs!**\n\n### DFS: Depth-First Search (Go Deep, Then Backtrack)\n\nDFS explores as far as possible along each branch before backtracking. Uses **recursion** (implicit stack) or an explicit stack.\n\n\`\`\`\nGraph:        DFS from node 1:\n  1 --- 2\n  |   / |     Recursion stack trace:\n  |  /  |     \n  3 --- 4     dfs(1) ÔåÆ visit 1\n    \\           dfs(2) ÔåÆ visit 2     stack: [1, 2]\n     5            dfs(3) ÔåÆ visit 3   stack: [1, 2, 3]\n                    dfs(4) ÔåÆ visit 4 stack: [1, 2, 3, 4]\n                      all neighbors visited ÔåÆ backtrack\n                    dfs(5) ÔåÆ visit 5 stack: [1, 2, 3, 5]\n                      backtrack ÔåÆ backtrack ÔåÆ backtrack ÔåÆ backtrack\n\nDFS order: 1, 2, 3, 4, 5\n\nPre-order numbering (discovery time):\n  Node: 1ÔåÆ1, 2ÔåÆ2, 3ÔåÆ3, 4ÔåÆ4, 5ÔåÆ5\nPost-order numbering (finish time):\n  Node: 4ÔåÆ1, 5ÔåÆ2, 3ÔåÆ3, 2ÔåÆ4, 1ÔåÆ5\n\`\`\`\n\n\`\`\`java\n// Recursive DFS\nboolean[] visited;\npublic void dfs(List<List<Integer>> adj, int node) {\n    visited[node] = true;\n    // Pre-order processing here (before visiting children)\n    for (int neighbor : adj.get(node)) {\n        if (!visited[neighbor]) {\n            dfs(adj, neighbor);\n        }\n    }\n    // Post-order processing here (after all children done)\n}\n\n// Iterative DFS (with explicit stack)\npublic void dfsIterative(List<List<Integer>> adj, int start) {\n    boolean[] visited = new boolean[adj.size()];\n    Deque<Integer> stack = new ArrayDeque<>();\n    stack.push(start);\n    while (!stack.isEmpty()) {\n        int node = stack.pop();\n        if (visited[node]) continue;\n        visited[node] = true;\n        for (int neighbor : adj.get(node)) {\n            if (!visited[neighbor]) stack.push(neighbor);\n        }\n    }\n}\n// Time: O(V + E), Space: O(V)\n\`\`\`\n\n### Topological Sort: Kahn\'s Algorithm (BFS-based)\n\nFor a DAG, topological sort produces a linear ordering where for every edge u ÔåÆ v, u comes before v. **Kahn\'s algorithm** uses in-degree tracking:\n\n\`\`\`\nCourse prerequisites (DAG):\n  0 ÔåÆ 1       (must take 0 before 1)\n  0 ÔåÆ 2       (must take 0 before 2)\n  1 ÔåÆ 3       (must take 1 before 3)\n  2 ÔåÆ 3       (must take 2 before 3)\n\nIn-degrees: node 0=0, node 1=1, node 2=1, node 3=2\n\nStep 1: Enqueue nodes with in-degree 0: queue=[0]\n\nStep 2: Dequeue 0. Output: [0]\n  Reduce in-degree of neighbors:\n  node 1: 1ÔåÆ0 (enqueue!)\n  node 2: 1ÔåÆ0 (enqueue!)\n  queue=[1,2]\n\nStep 3: Dequeue 1. Output: [0,1]\n  Reduce in-degree:\n  node 3: 2ÔåÆ1\n  queue=[2]\n\nStep 4: Dequeue 2. Output: [0,1,2]\n  Reduce in-degree:\n  node 3: 1ÔåÆ0 (enqueue!)\n  queue=[3]\n\nStep 5: Dequeue 3. Output: [0,1,2,3]\n  queue=[] ÔåÆ DONE\n\nTopological order: [0, 1, 2, 3] Ô£ô\nAll 4 nodes processed ÔåÆ no cycle ÔåÆ valid ordering!\n(If output.size() < V ÔåÆ cycle exists!)\n\`\`\`\n\n\`\`\`java\npublic int[] topologicalSort(int numCourses, int[][] prerequisites) {\n    List<List<Integer>> adj = new ArrayList<>();\n    int[] inDegree = new int[numCourses];\n    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n    \n    for (int[] pre : prerequisites) {\n        adj.get(pre[1]).add(pre[0]);\n        inDegree[pre[0]]++;\n    }\n    \n    Queue<Integer> queue = new LinkedList<>();\n    for (int i = 0; i < numCourses; i++) {\n        if (inDegree[i] == 0) queue.offer(i);\n    }\n    \n    int[] order = new int[numCourses];\n    int idx = 0;\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        order[idx++] = node;\n        for (int next : adj.get(node)) {\n            if (--inDegree[next] == 0) queue.offer(next);\n        }\n    }\n    return idx == numCourses ? order : new int[0]; // empty if cycle\n}\n// Time: O(V + E), Space: O(V + E)\n\`\`\`\n\n### Dijkstra\'s Algorithm: Shortest Path with Weights\n\nFinds shortest paths from a source to all other nodes in a graph with **non-negative weights**. Uses a **priority queue** for greedy selection.\n\n\`\`\`\nWeighted graph:\n  0 --4-- 1\n  |       |  \\\n  2       1    6\n  |       |  /\n  2 --3-- 3\n\nAdjacency: 0ÔåÆ[(1,4),(2,2)], 1ÔåÆ[(0,4),(3,1),(3,6)], 2ÔåÆ[(0,2),(3,3)], 3ÔåÆ[(1,1),(2,3),(1,6)]\n\nDijkstra from node 0:\n\nInitial: dist=[0, Ôê×, Ôê×, Ôê×]  PQ=[(0,node0)]\n\nStep 1: Poll (cost=0, node=0).\n  Relax edge 0ÔåÆ1: dist[1]=min(Ôê×, 0+4)=4.  PQ=[(2,2), (4,1)]\n  Relax edge 0ÔåÆ2: dist[2]=min(Ôê×, 0+2)=2.\n  dist=[0, 4, 2, Ôê×]\n\nStep 2: Poll (cost=2, node=2).\n  Relax edge 2ÔåÆ0: dist[0]=min(0, 2+2)=0. No change.\n  Relax edge 2ÔåÆ3: dist[3]=min(Ôê×, 2+3)=5.  PQ=[(4,1), (5,3)]\n  dist=[0, 4, 2, 5]\n\nStep 3: Poll (cost=4, node=1).\n  Relax edge 1ÔåÆ3: dist[3]=min(5, 4+1)=5. No change.\n  dist=[0, 4, 2, 5]\n\nStep 4: Poll (cost=5, node=3).\n  No improvements possible.\n  dist=[0, 4, 2, 5] ÔåÆ DONE Ô£ô\n\nShortest paths from 0: to 1=4, to 2=2, to 3=5\n\`\`\`\n\n\`\`\`java\npublic int[] dijkstra(Map<Integer, List<int[]>> graph, int src, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    \n    // PQ of [distance, node]\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    pq.offer(new int[]{0, src});\n    \n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n        if (d > dist[u]) continue;  // Skip outdated entries\n        \n        for (int[] edge : graph.getOrDefault(u, List.of())) {\n            int v = edge[0], w = edge[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    return dist;\n}\n// Time: O((V + E) log V), Space: O(V + E)\n\`\`\`\n\n### Bellman-Ford Algorithm: Handles Negative Weights\n\nRelaxes all edges V-1 times. Detects negative cycles on the Vth pass.\n\n\`\`\`\nGraph with negative edge:\n  0 --4-ÔåÆ 1\n  |        Ôåô\n  2       -2\n  Ôåô        Ôåô\n  2 --3-ÔåÆ 3\n\nEdges: (0,1,4), (0,2,2), (1,3,-2), (2,3,3)\n\ndist = [0, Ôê×, Ôê×, Ôê×]\n\nRound 1 (relax all edges):\n  Edge(0,1,4): dist[1] = min(Ôê×, 0+4) = 4\n  Edge(0,2,2): dist[2] = min(Ôê×, 0+2) = 2\n  Edge(1,3,-2): dist[3] = min(Ôê×, 4+(-2)) = 2\n  Edge(2,3,3): dist[3] = min(2, 2+3) = 2 (no change)\n  dist = [0, 4, 2, 2]\n\nRound 2 (relax all edges):\n  No changes ÔåÆ converged early.\n  dist = [0, 4, 2, 2] Ô£ô\n\nRound V (= round 4, cycle detection):\n  If any distance decreases ÔåÆ NEGATIVE CYCLE exists!\n  No changes here ÔåÆ no negative cycle.\n\`\`\`\n\n\`\`\`java\npublic int[] bellmanFord(int n, int[][] edges, int src) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    \n    for (int i = 0; i < n - 1; i++) {\n        boolean changed = false;\n        for (int[] e : edges) {\n            int u = e[0], v = e[1], w = e[2];\n            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                changed = true;\n            }\n        }\n        if (!changed) break;  // Early termination\n    }\n    \n    // Check for negative cycles\n    for (int[] e : edges) {\n        if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]]) {\n            throw new RuntimeException("Negative cycle detected!");\n        }\n    }\n    return dist;\n}\n// Time: O(V ├ù E), Space: O(V)\n\`\`\`\n\n### Cycle Detection\n\n**Directed graph ÔÇö DFS Coloring (3 states):**\n\n\`\`\`\nStates: WHITE (unvisited), GRAY (in current DFS path), BLACK (finished)\n\nIf we encounter a GRAY node ÔåÆ BACK EDGE ÔåÆ CYCLE!\n\nExample:  0 ÔåÆ 1 ÔåÆ 2 ÔåÆ 0 (cycle!)\n\ndfs(0): color[0]=GRAY\n  dfs(1): color[1]=GRAY\n    dfs(2): color[2]=GRAY\n      neighbor 0: color[0]==GRAY ÔåÆ CYCLE DETECTED!\n\`\`\`\n\n\`\`\`java\n// Directed cycle detection\nint[] color; // 0=WHITE, 1=GRAY, 2=BLACK\npublic boolean hasCycle(List<List<Integer>> adj, int n) {\n    color = new int[n];\n    for (int i = 0; i < n; i++) {\n        if (color[i] == 0 && dfs(adj, i)) return true;\n    }\n    return false;\n}\n\nprivate boolean dfs(List<List<Integer>> adj, int u) {\n    color[u] = 1; // GRAY\n    for (int v : adj.get(u)) {\n        if (color[v] == 1) return true;       // Back edge ÔåÆ cycle\n        if (color[v] == 0 && dfs(adj, v)) return true;\n    }\n    color[u] = 2; // BLACK\n    return false;\n}\n\`\`\`\n\n**Undirected graph ÔÇö Parent tracking:**\n\n\`\`\`java\n// Undirected cycle detection\npublic boolean hasCycleUndirected(List<List<Integer>> adj, int n) {\n    boolean[] visited = new boolean[n];\n    for (int i = 0; i < n; i++) {\n        if (!visited[i] && dfsUndirected(adj, i, -1, visited)) return true;\n    }\n    return false;\n}\n\nprivate boolean dfsUndirected(List<List<Integer>> adj, int u, int parent, boolean[] visited) {\n    visited[u] = true;\n    for (int v : adj.get(u)) {\n        if (!visited[v]) {\n            if (dfsUndirected(adj, v, u, visited)) return true;\n        } else if (v != parent) {\n            return true; // Visited and not parent ÔåÆ cycle\n        }\n    }\n    return false;\n}\n\`\`\`\n\n### Grid Problems: Treating Grid as Graph\n\n\`\`\`\nGrid:          Implicit Graph:\n1 1 0          (0,0)ÔöÇ(0,1)    (0,2)\n1 1 0           Ôöé  Ôò▓   Ôöé\n0 0 1          (1,0)ÔöÇ(1,1)    (1,2)\n\n               (2,0) (2,1)   (2,2)\n\nEach cell is a node. Adjacent cells (4-directional) with value 1 are connected.\n\`\`\`\n\n\`\`\`java\nint[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n\nvoid dfsGrid(int[][] grid, int r, int c, boolean[][] visited) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;\n    if (visited[r][c] || grid[r][c] == 0) return;\n    visited[r][c] = true;\n    for (int[] d : dirs) {\n        dfsGrid(grid, r + d[0], c + d[1], visited);\n    }\n}\n\`\`\`\n\n### Union-Find Integration\n\n**When to use Union-Find vs BFS/DFS:**\n- **Union-Find:** Dynamic connectivity queries ("are A and B connected?"), especially with incremental edge additions\n- **BFS/DFS:** When you need traversal order, shortest paths, or to explore the graph structure\n\n\`\`\`java\nclass UnionFind {\n    int[] parent, rank;\n    int components;\n    \n    UnionFind(int n) {\n        parent = new int[n];\n        rank = new int[n];\n        components = n;\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n    \n    int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]); // path compression\n        return parent[x];\n    }\n    \n    boolean union(int a, int b) {\n        int ra = find(a), rb = find(b);\n        if (ra == rb) return false;\n        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }\n        parent[rb] = ra;\n        if (rank[ra] == rank[rb]) rank[ra]++;\n        components--;\n        return true;\n    }\n}\n\`\`\`\n\n---\n\n## ÔÜí Key Algorithms & Techniques\n\n### Algorithm Summary Table\n\n| Algorithm | Use Case | Time | Space | Works With |\n|-----------|----------|------|-------|------------|\n| BFS | Shortest path (unweighted), level order | O(V+E) | O(V) | Unweighted |\n| DFS | Connectivity, cycle detection, topo sort | O(V+E) | O(V) | Any |\n| Topological Sort (Kahn) | Dependency ordering | O(V+E) | O(V+E) | DAGs only |\n| Topological Sort (DFS) | Dependency ordering | O(V+E) | O(V) | DAGs only |\n| Dijkstra | Shortest path (non-negative weights) | O((V+E)logV) | O(V+E) | Non-negative |\n| Bellman-Ford | Shortest path (negative weights ok) | O(V├ùE) | O(V) | Any (detects neg cycles) |\n| Floyd-Warshall | All-pairs shortest path | O(V┬│) | O(V┬▓) | Any |\n| Union-Find | Dynamic connectivity | O(╬▒(n))ÔëêO(1) | O(V) | Undirected |\n| Prim\'s MST | Minimum spanning tree | O(E logV) | O(V+E) | Weighted undirected |\n| Kruskal\'s MST | Minimum spanning tree | O(E logE) | O(V+E) | Weighted undirected |\n\n---\n\n## ­ƒÄ» Pattern Recognition\n\n\`\`\`\nProblem Keywords ÔåÆ Technique:\n\n"Shortest path" (unweighted)          ÔåÆ BFS\n"Shortest path" (weighted, +)         ÔåÆ Dijkstra\n"Shortest path" (negative weights)    ÔåÆ Bellman-Ford\n"All-pairs shortest path"             ÔåÆ Floyd-Warshall\n"Number of islands / components"      ÔåÆ DFS/BFS or Union-Find\n"Course schedule / prerequisites"     ÔåÆ Topological Sort (Kahn\'s)\n"Detect cycle" (directed)             ÔåÆ DFS coloring (3 states)\n"Detect cycle" (undirected)           ÔåÆ DFS with parent / Union-Find\n"Bipartite check"                     ÔåÆ BFS/DFS 2-coloring\n"Minimum spanning tree"               ÔåÆ Prim\'s or Kruskal\'s\n"Network delay / time"                ÔåÆ Dijkstra from source\n"Word ladder / transformation"        ÔåÆ BFS (each word = node)\n"Clone graph"                         ÔåÆ DFS/BFS + HashMap\n"Grid problem" (connected regions)    ÔåÆ DFS/BFS on grid\n"Alien dictionary"                    ÔåÆ Topological sort from orderings\n"Redundant connection"                ÔåÆ Union-Find (find cycle edge)\n"Is graph a tree?"                    ÔåÆ V-1 edges + connected (Union-Find)\n\`\`\`\n\n---\n\n## ­ƒôè Complexity Cheat Sheet\n\n| Representation | Space | Add Edge | Check Edge | Iterate Neighbors |\n|---------------|-------|----------|------------|-------------------|\n| Adjacency List | O(V+E) | O(1) | O(degree) | O(degree) |\n| Adjacency Matrix | O(V┬▓) | O(1) | **O(1)** | O(V) |\n| Edge List | O(E) | O(1) | O(E) | O(E) |\n\n| Problem Type | Algorithm | Time | Space |\n|-------------|-----------|------|-------|\n| Connected components | DFS/BFS | O(V+E) | O(V) |\n| Shortest path (unweighted) | BFS | O(V+E) | O(V) |\n| Shortest path (Dijkstra) | PQ-based | O((V+E)logV) | O(V) |\n| Topological sort | Kahn\'s BFS | O(V+E) | O(V+E) |\n| Cycle detection (directed) | DFS coloring | O(V+E) | O(V) |\n| Cycle detection (undirected) | DFS/Union-Find | O(V+E)/O(E╬▒(V)) | O(V) |\n| MST (Prim\'s) | PQ-based | O(ElogV) | O(V+E) |\n| MST (Kruskal\'s) | Sort + Union-Find | O(ElogE) | O(V+E) |\n\n---\n\n## ­ƒºá Interview Deep Dive: Worked Examples\n\n### Example 1: Number of Islands (LC 200)\n\n**Problem:** Given a 2D grid of \'1\'s (land) and \'0\'s (water), count the number of islands.\n\n**Input:**\n\`\`\`\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\n\`\`\`\n\n**DFS Trace:**\n\n\`\`\`\nStart scanning from top-left:\n\n(0,0)=\'1\' ÔåÆ NEW ISLAND! DFS to mark entire island:\n  Visit (0,0) ÔåÆ mark \'0\'\n  Visit (0,1) ÔåÆ mark \'0\'\n  Visit (1,0) ÔåÆ mark \'0\'\n  Visit (1,1) ÔåÆ mark \'0\'\n  All neighbors are \'0\' or out of bounds ÔåÆ done\n  Island count = 1\n\n(0,1) already \'0\', skip\n(0,2) is \'0\', skip\n...\n(2,2)=\'1\' ÔåÆ NEW ISLAND!\n  Visit (2,2) ÔåÆ mark \'0\'\n  No unvisited \'1\' neighbors ÔåÆ done\n  Island count = 2\n\n(3,3)=\'1\' ÔåÆ NEW ISLAND!\n  Visit (3,3) ÔåÆ mark \'0\'\n  Visit (3,4) ÔåÆ mark \'0\'\n  No more ÔåÆ done\n  Island count = 3\n\nAnswer: 3 Ô£ô\n\`\`\`\n\n\`\`\`java\npublic int numIslands(char[][] grid) {\n    int count = 0;\n    for (int r = 0; r < grid.length; r++) {\n        for (int c = 0; c < grid[0].length; c++) {\n            if (grid[r][c] == \'1\') {\n                count++;\n                dfs(grid, r, c);\n            }\n        }\n    }\n    return count;\n}\n\nprivate void dfs(char[][] grid, int r, int c) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;\n    if (grid[r][c] != \'1\') return;\n    grid[r][c] = \'0\'; // mark visited\n    dfs(grid, r + 1, c);\n    dfs(grid, r - 1, c);\n    dfs(grid, r, c + 1);\n    dfs(grid, r, c - 1);\n}\n// Time: O(R ├ù C), Space: O(R ├ù C) recursion stack worst case\n\`\`\`\n\n### Example 2: Course Schedule II (LC 210)\n\n**Problem:** Given numCourses and prerequisites, return ordering of courses. Return empty if impossible (cycle).\n\n**Input:** numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\n(Meaning: to take 1, need 0 first; to take 2, need 0; to take 3, need 1 and 2)\n\n**Topological Sort Trace:**\n\n\`\`\`\nBuild graph and in-degrees:\n  0 ÔåÆ [1, 2]     in-degree: 0=0, 1=1, 2=1, 3=2\n  1 ÔåÆ [3]\n  2 ÔåÆ [3]\n\nQueue (in-degree = 0): [0]\n\nPoll 0: output=[0]\n  Reduce: in[1]=1ÔåÆ0 (enqueue!), in[2]=1ÔåÆ0 (enqueue!)\n  Queue: [1, 2]\n\nPoll 1: output=[0, 1]\n  Reduce: in[3]=2ÔåÆ1\n  Queue: [2]\n\nPoll 2: output=[0, 1, 2]\n  Reduce: in[3]=1ÔåÆ0 (enqueue!)\n  Queue: [3]\n\nPoll 3: output=[0, 1, 2, 3]\n  Queue: []\n\nAll 4 courses processed ÔåÆ valid order: [0, 1, 2, 3] Ô£ô\n\`\`\`\n\n\`\`\`java\npublic int[] findOrder(int numCourses, int[][] prerequisites) {\n    List<List<Integer>> adj = new ArrayList<>();\n    int[] inDeg = new int[numCourses];\n    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n    \n    for (int[] p : prerequisites) {\n        adj.get(p[1]).add(p[0]);\n        inDeg[p[0]]++;\n    }\n    \n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < numCourses; i++)\n        if (inDeg[i] == 0) q.offer(i);\n    \n    int[] result = new int[numCourses];\n    int idx = 0;\n    while (!q.isEmpty()) {\n        int course = q.poll();\n        result[idx++] = course;\n        for (int next : adj.get(course))\n            if (--inDeg[next] == 0) q.offer(next);\n    }\n    return idx == numCourses ? result : new int[0];\n}\n// Time: O(V + E), Space: O(V + E)\n\`\`\`\n\n### Example 3: Network Delay Time (LC 743)\n\n**Problem:** Given a network of n nodes and weighted edges, find time for signal from source k to reach all nodes. Return -1 if impossible.\n\n**Input:** times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2\n\n**Dijkstra Trace:**\n\n\`\`\`\nGraph (from edges):\n  2 ÔåÆ [(1,1), (3,1)]\n  3 ÔåÆ [(4,1)]\n\ndist = [Ôê×, Ôê×, 0, Ôê×, Ôê×]  (1-indexed, source=2, dist[2]=0)\nPQ = [(0, node2)]\n\nPoll (0, 2): Process node 2\n  Edge 2ÔåÆ1 (w=1): dist[1] = min(Ôê×, 0+1) = 1. PQ: [(1,1), (1,3)]\n  Edge 2ÔåÆ3 (w=1): dist[3] = min(Ôê×, 0+1) = 1.\n  dist = [Ôê×, 1, 0, 1, Ôê×]\n\nPoll (1, 1): Process node 1\n  No outgoing edges.\n  dist = [Ôê×, 1, 0, 1, Ôê×]\n\nPoll (1, 3): Process node 3\n  Edge 3ÔåÆ4 (w=1): dist[4] = min(Ôê×, 1+1) = 2. PQ: [(2,4)]\n  dist = [Ôê×, 1, 0, 1, 2]\n\nPoll (2, 4): Process node 4\n  No outgoing edges.\n\nAll reachable. Answer = max(dist[1..4]) = max(1, 0, 1, 2) = 2 Ô£ô\n\`\`\`\n\n\`\`\`java\npublic int networkDelayTime(int[][] times, int n, int k) {\n    Map<Integer, List<int[]>> graph = new HashMap<>();\n    for (int[] t : times) {\n        graph.computeIfAbsent(t[0], x -> new ArrayList<>())\n             .add(new int[]{t[1], t[2]});\n    }\n    \n    int[] dist = new int[n + 1];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[k] = 0;\n    \n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    pq.offer(new int[]{0, k});\n    \n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n        if (d > dist[u]) continue;\n        for (int[] e : graph.getOrDefault(u, List.of())) {\n            int v = e[0], w = e[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    \n    int maxDist = 0;\n    for (int i = 1; i <= n; i++) {\n        if (dist[i] == Integer.MAX_VALUE) return -1;\n        maxDist = Math.max(maxDist, dist[i]);\n    }\n    return maxDist;\n}\n// Time: O((V + E) log V), Space: O(V + E)\n\`\`\`\n\n---\n\n## ÔÜá´©Å Common Mistakes\n\n1. **Forgetting to mark visited BEFORE enqueuing in BFS:** If you mark after dequeuing, a node can be enqueued multiple times, causing TLE.\n   \`\`\`java\n   // WRONG: visited[v] = true after poll()\n   // RIGHT: visited[v] = true when offering to queue\n   \`\`\`\n\n2. **Using BFS for weighted shortest paths:** BFS gives shortest path only for **unweighted** graphs. For weighted graphs, use Dijkstra\'s.\n\n3. **Dijkstra with negative edges:** Results are WRONG. Use Bellman-Ford for graphs with negative weights.\n\n4. **Not detecting cycles in topological sort:** If processed count < V, a cycle exists. Always check this.\n\n5. **Grid problems ÔÇö not checking bounds FIRST:** Always check \`r >= 0 && r < rows && c >= 0 && c < cols\` before accessing \`grid[r][c]\`.\n\n6. **Modifying input grid permanently without being asked:** If the problem needs the original grid later, clone it or use a separate visited array.\n\n7. **Confusing directed vs undirected cycle detection:** Directed needs 3-state coloring; undirected needs parent tracking. Using undirected detection on directed graphs gives false positives.\n\n8. **Stack overflow on large grids with recursive DFS:** For very large grids (1000├ù1000), use iterative DFS or BFS to avoid stack overflow.\n\n---\n\n## ­ƒÆí Java-Specific Tips\n\n- **Adjacency list creation pattern:**\n  \`\`\`java\n  // For numbered nodes [0..n-1]:\n  List<List<Integer>> adj = new ArrayList<>();\n  for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n  \n  // For arbitrary labels:\n  Map<String, List<String>> adj = new HashMap<>();\n  adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);\n  \`\`\`\n\n- **Weighted graph with PQ:**\n  \`\`\`java\n  // Use int[] {distance, node} with Comparator\n  PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0] - b[0]);\n  // IMPORTANT: check if d > dist[u] after polling to skip stale entries\n  \`\`\`\n\n- **2D boolean array for visited (grid problems):**\n  \`\`\`java\n  boolean[][] visited = new boolean[rows][cols];\n  // Or modify grid in-place if allowed (saves space)\n  \`\`\`\n\n- **Directions array for grid traversal:**\n  \`\`\`java\n  int[][] dirs4 = {{0,1},{0,-1},{1,0},{-1,0}};       // 4-directional\n  int[][] dirs8 = {{0,1},{0,-1},{1,0},{-1,0},         // 8-directional\n                    {1,1},{1,-1},{-1,1},{-1,-1}};\n  \`\`\`\n\n- **Graph from edge list:**\n  \`\`\`java\n  // Undirected weighted\n  Map<Integer, List<int[]>> g = new HashMap<>();\n  for (int[] e : edges) {\n      g.computeIfAbsent(e[0], k -> new ArrayList<>()).add(new int[]{e[1], e[2]});\n      g.computeIfAbsent(e[1], k -> new ArrayList<>()).add(new int[]{e[0], e[2]});\n  }\n  \`\`\`\n\n---\n\n## ­ƒöù Comparison Tables\n\n### BFS vs DFS\n\n| Feature | BFS | DFS |\n|---------|-----|-----|\n| Data structure | Queue | Stack / Recursion |\n| Traversal order | Level by level | Deep first |\n| Shortest path (unweighted) | Ô£à Yes | ÔØî No |\n| Space (worst case) | O(width of graph) | O(height/depth) |\n| Cycle detection | Possible | Ô£à Preferred |\n| Topological sort | Ô£à Kahn\'s | Ô£à Post-order reverse |\n| Best for | Shortest path, levels | Components, cycles, topo sort |\n\n### Shortest Path Algorithms\n\n| Algorithm | Graph Type | Negative Weights | Negative Cycles | Time | Space |\n|-----------|-----------|-----------------|-----------------|------|-------|\n| BFS | Unweighted | N/A | N/A | O(V+E) | O(V) |\n| Dijkstra | Weighted (non-neg) | ÔØî | N/A | O((V+E)logV) | O(V) |\n| Bellman-Ford | Any weighted | Ô£à | Detects | O(V├ùE) | O(V) |\n| Floyd-Warshall | All pairs | Ô£à | Detects | O(V┬│) | O(V┬▓) |\n| 0-1 BFS | Weights 0 or 1 | N/A | N/A | O(V+E) | O(V) |\n\n### When to Use What\n\n| Scenario | Algorithm | Why |\n|----------|----------|-----|\n| Unweighted shortest path | BFS | O(V+E), optimal |\n| Weighted shortest path (no neg) | Dijkstra | O((V+E)logV) |\n| Has negative weights | Bellman-Ford | Handles negatives |\n| All pairs, small V | Floyd-Warshall | O(V┬│), simple |\n| Dynamic connectivity | Union-Find | Near O(1) per query |\n| Task ordering | Topo Sort | Linear time for DAGs |\n| Connected components | DFS/BFS | O(V+E) |\n| Minimum spanning tree | Prim\'s/Kruskal\'s | Greedy on weights |\n| Grid connected regions | DFS (in-place marking) | Simple + fast |\n| Bipartite check | BFS 2-coloring | Level-based coloring |\n\n\n## 🔍 Extended Visual Deep Dive\n\n### Three Representations of the Same Graph\n\n```\nGraph with 5 nodes and 6 edges (directed, unweighted):\n  0 → 1, 0 → 2, 1 → 3, 2 → 3, 3 → 4, 2 → 4\n\nVisual:\n  0 ──→ 1\n  │      │\n  ▼      ▼\n  2 ──→ 3\n  │      │\n  └──→ 4 ◄┘\n\n═══════════════════════════════════════════════════════════\n  1. ADJACENCY LIST (Most common in interviews)\n═══════════════════════════════════════════════════════════\n  0: [1, 2]\n  1: [3]\n  2: [3, 4]\n  3: [4]\n  4: []\n\n  Java: List<List<Integer>> adj = new ArrayList<>();\n  Space: O(V + E)\n  Check edge exists: O(degree(v))\n  Iterate neighbors: O(degree(v))\n  Best for: sparse graphs, most interview problems\n\n═══════════════════════════════════════════════════════════\n  2. ADJACENCY MATRIX\n═══════════════════════════════════════════════════════════\n       0  1  2  3  4\n    0 [0, 1, 1, 0, 0]\n    1 [0, 0, 0, 1, 0]\n    2 [0, 0, 0, 1, 1]\n    3 [0, 0, 0, 0, 1]\n    4 [0, 0, 0, 0, 0]\n\n  Java: int[][] matrix = new int[n][n];\n  Space: O(V²)\n  Check edge exists: O(1)\n  Iterate neighbors: O(V)\n  Best for: dense graphs, Floyd-Warshall, quick edge lookup\n\n═══════════════════════════════════════════════════════════\n  3. EDGE LIST\n═══════════════════════════════════════════════════════════\n  [(0,1), (0,2), (1,3), (2,3), (3,4), (2,4)]\n\n  Java: int[][] edges = {{0,1},{0,2},{1,3},{2,3},{3,4},{2,4}};\n  Space: O(E)\n  Check edge exists: O(E)\n  Best for: Kruskal\'s MST, problems that give edges directly\n```\n\n### BFS Trace — Complete Queue States\n\n```\nGraph (undirected):\n    0 ── 1 ── 3\n    │    │    │\n    2 ── 4 ── 5\n         │\n         6\n\nAdjacency list:\n  0: [1, 2]    1: [0, 3, 4]    2: [0, 4]\n  3: [1, 5]    4: [1, 2, 5, 6]  5: [3, 4]    6: [4]\n\nBFS from node 0:\n\nStep │ Queue (front→back)  │ Visit │ Visited Set         │ Action\n─────┼─────────────────────┼───────┼─────────────────────┼──────────────\n  0  │ [0]                 │       │ {0}                 │ Start\n  1  │ [1, 2]              │ 0     │ {0,1,2}             │ Dequeue 0, enqueue neighbors 1,2\n  2  │ [2, 3, 4]           │ 1     │ {0,1,2,3,4}         │ Dequeue 1, enqueue 3,4 (0 visited)\n  3  │ [3, 4]              │ 2     │ {0,1,2,3,4}         │ Dequeue 2, 0&4 already visited\n  4  │ [4, 5]              │ 3     │ {0,1,2,3,4,5}       │ Dequeue 3, enqueue 5 (1 visited)\n  5  │ [5, 6]              │ 4     │ {0,1,2,3,4,5,6}     │ Dequeue 4, enqueue 6 (1,2,5 visited)\n  6  │ [6]                 │ 5     │ {0,1,2,3,4,5,6}     │ Dequeue 5, 3&4 already visited\n  7  │ []                  │ 6     │ {0,1,2,3,4,5,6}     │ Dequeue 6, 4 already visited. DONE!\n\nBFS order: 0 → 1 → 2 → 3 → 4 → 5 → 6\n\nLevel-order result:\n  Level 0: [0]\n  Level 1: [1, 2]        (distance 1 from source)\n  Level 2: [3, 4]        (distance 2 from source)\n  Level 3: [5, 6]        (distance 3 from source)\n```\n\n```java\npublic List<Integer> bfs(List<List<Integer>> adj, int start) {\n    List<Integer> order = new ArrayList<>();\n    boolean[] visited = new boolean[adj.size()];\n    Queue<Integer> queue = new LinkedList<>();\n\n    visited[start] = true;\n    queue.offer(start);\n\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        order.add(node);\n        for (int neighbor : adj.get(node)) {\n            if (!visited[neighbor]) {\n                visited[neighbor] = true; // Mark BEFORE enqueue to avoid duplicates!\n                queue.offer(neighbor);\n            }\n        }\n    }\n    return order;\n}\n```\n\n### DFS Trace — Recursion Stack Visualization\n\n```\nSame graph, DFS from node 0:\n\nCall Stack          │ Visit │ Visited Set         │ Action\n────────────────────┼───────┼─────────────────────┼──────────────────\ndfs(0)              │ 0     │ {0}                 │ Visit 0, try neighbor 1\n └─ dfs(1)          │ 1     │ {0,1}               │ Visit 1, try neighbor 0 (visited), try 3\n     └─ dfs(3)      │ 3     │ {0,1,3}             │ Visit 3, try 1 (visited), try 5\n         └─ dfs(5)  │ 5     │ {0,1,3,5}           │ Visit 5, try 3 (visited), try 4\n            └─ dfs(4)│ 4    │ {0,1,3,5,4}         │ Visit 4, try 1,2 → 2 unvisited\n               └─ dfs(2)│ 2 │ {0,1,3,5,4,2}       │ Visit 2, try 0,4 (both visited)\n               │  return │   │                     │ Backtrack from 2\n               └─ try 5,6│   │                     │ 5 visited, try 6\n               └─ dfs(6)│ 6  │ {0,1,3,5,4,2,6}    │ Visit 6, try 4 (visited)\n                  return │   │                     │ Backtrack from 6\n            return      │   │                     │ Backtrack from 4\n         return         │   │                     │ Backtrack from 5\n     return             │   │                     │ Backtrack from 3\n     try 4              │   │                     │ 4 already visited\n return                 │   │                     │ Backtrack from 1\n try 2                  │   │                     │ 2 already visited\nreturn                  │   │                     │ Done!\n\nDFS order: 0 → 1 → 3 → 5 → 4 → 2 → 6\n\nDFS produces a TREE of discovery:\n  0 → 1 → 3 → 5 → 4 → 2\n                    └→ 6\n  Back edges (to ancestors): 2→0, 5→3, 4→1, etc.\n  Back edges indicate CYCLES in undirected graphs.\n```\n\n### Dijkstra — Full Weighted Graph Trace\n\n```\nWeighted directed graph:\n       1\n  0 ──────→ 1\n  │  \\      │ \\\n 4│   2\\    │3  \\1\n  │     \\   │    \\\n  ▼      ▼  ▼     ▼\n  3 ──→ 2 ←─┘     4\n     1       \\   ↗\n              5\\ /2\n               5\n\nEdges: 0→1(1), 0→3(4), 0→2(2), 1→2(3), 1→4(1),\n       3→2(1), 2→5(5), 5→4(2)\n\nDijkstra from source = 0:\n\n┌──────┬────────────────────┬───────────────────────────────┬────────────────────────┐\n│ Step │ Process Node       │ Priority Queue                │ Distances              │\n│      │ (node, dist)       │ [(node, dist), ...]           │ 0   1   2   3   4   5  │\n├──────┼────────────────────┼───────────────────────────────┼────────────────────────┤\n│ Init │                    │ [(0,0)]                       │ 0   ∞   ∞   ∞   ∞   ∞  │\n│  1   │ (0, 0)             │ [(1,1),(2,2),(3,4)]           │ 0   1   2   4   ∞   ∞  │\n│      │                    │ relax: 0→1=1, 0→2=2, 0→3=4   │                        │\n│  2   │ (1, 1)             │ [(2,2),(4,2),(3,4),(2,4)]     │ 0   1   2   4   2   ∞  │\n│      │                    │ relax: 1→2=1+3=4(no), 1→4=1+1=2│                      │\n│  3   │ (2, 2)             │ [(4,2),(3,4),(2,4),(5,7)]     │ 0   1   2   4   2   7  │\n│      │                    │ relax: 2→5=2+5=7              │                        │\n│  4   │ (4, 2)             │ [(3,4),(2,4),(5,7)]           │ 0   1   2   4   2   7  │\n│      │                    │ no outgoing edges from 4      │                        │\n│  5   │ (3, 4)             │ [(2,4),(5,7)]                 │ 0   1   2   3*  2   7  │\n│      │  Wait—3→2: 4+1=5   │ 5 > 2, no improvement        │ 0   1   2   4   2   7  │\n│      │  (no update)       │                               │                        │\n│  6   │ (2, 4) SKIP        │ [(5,7)]                       │ already processed at 2 │\n│  7   │ (5, 7)             │ []                            │ 0   1   2   4   2   7  │\n│      │                    │ 5→4=7+2=9 > 2, no update     │                        │\n└──────┴────────────────────┴───────────────────────────────┴────────────────────────┘\n\nFinal shortest distances from 0:\n  0→0: 0,  0→1: 1,  0→2: 2,  0→3: 4,  0→4: 2,  0→5: 7\n\nShortest paths:\n  0→4: 0 → 1 → 4 (cost 2)\n  0→5: 0 → 2 → 5 (cost 7)\n```\n\n```java\npublic int[] dijkstra(List<int[]>[] adj, int src, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n\n    // {distance, node}\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    pq.offer(new int[]{0, src});\n\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n        if (d > dist[u]) continue; // skip stale entries\n\n        for (int[] edge : adj[u]) {\n            int v = edge[0], w = edge[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    return dist;\n}\n```\n\n### Kahn\'s Topological Sort — In-Degree Reduction Visual\n\n```\nDAG (Directed Acyclic Graph):\n  5 → 0 ← 4\n  5 → 2    4 → 1\n  2 → 3    ↓\n  3 → 1    1\n\nAdjacency List:            In-degree:\n  0: []                    0: 2 (from 5, 4)\n  1: []                    1: 2 (from 3, 4)\n  2: [3]                   2: 1 (from 5)\n  3: [1]                   3: 1 (from 2)\n  4: [0, 1]                4: 0\n  5: [0, 2]                5: 0\n\nKahn\'s Algorithm Trace:\n\nStep │ Queue           │ Process │ Reduce in-degree of  │ In-degrees        │ Result\n─────┼─────────────────┼─────────┼──────────────────────┼───────────────────┼────────\nInit │ [4, 5]          │         │                      │ [2,2,1,1,0,0]     │ []\n  1  │ [5]             │ 4       │ 0: 2→1, 1: 2→1      │ [1,1,1,1,_,0]     │ [4]\n  2  │ []              │ 5       │ 0: 1→0*, 2: 1→0*    │ [0,1,0,1,_,_]     │ [4,5]\n     │ [0, 2]          │         │ *added to queue      │                   │\n  3  │ [2]             │ 0       │ (no outgoing edges)  │ [_,1,0,1,_,_]     │ [4,5,0]\n  4  │ []              │ 2       │ 3: 1→0*              │ [_,1,_,0,_,_]     │ [4,5,0,2]\n     │ [3]             │         │                      │                   │\n  5  │ []              │ 3       │ 1: 1→0*              │ [_,0,_,_,_,_]     │ [4,5,0,2,3]\n     │ [1]             │         │                      │                   │\n  6  │ []              │ 1       │ (no outgoing edges)  │ all done          │ [4,5,0,2,3,1]\n\nTopological order: [4, 5, 0, 2, 3, 1] ✓\n\nCycle detection: If result.size() < numNodes, there\'s a CYCLE!\n  (nodes in cycle never reach in-degree 0)\n```\n\n```java\npublic List<Integer> topologicalSort(int n, List<List<Integer>> adj) {\n    int[] inDegree = new int[n];\n    for (List<Integer> neighbors : adj)\n        for (int v : neighbors) inDegree[v]++;\n\n    Queue<Integer> queue = new LinkedList<>();\n    for (int i = 0; i < n; i++)\n        if (inDegree[i] == 0) queue.offer(i);\n\n    List<Integer> order = new ArrayList<>();\n    while (!queue.isEmpty()) {\n        int u = queue.poll();\n        order.add(u);\n        for (int v : adj.get(u)) {\n            if (--inDegree[v] == 0) queue.offer(v);\n        }\n    }\n\n    if (order.size() != n) throw new RuntimeException("Cycle detected!");\n    return order;\n}\n```\n\n### Cycle Detection — Three-Color DFS Visual\n\n```\nColors: WHITE=unvisited, GRAY=in current path, BLACK=fully processed\n\nGraph: 0→1, 1→2, 2→0 (has cycle!), 2→3\n\nStep │ Visit │ Colors                │ Stack (gray nodes)  │ Notes\n─────┼───────┼───────────────────────┼─────────────────────┼──────────────\n  0  │       │ W  W  W  W            │ []                  │ Start\n  1  │ 0     │ G  W  W  W            │ [0]                 │ Visit 0, color GRAY\n  2  │ 1     │ G  G  W  W            │ [0, 1]              │ Visit 1, color GRAY\n  3  │ 2     │ G  G  G  W            │ [0, 1, 2]           │ Visit 2, color GRAY\n  4  │ 2→0   │ G  G  G  W            │ [0, 1, 2]           │ Neighbor 0 is GRAY!\n     │       │                       │                     │ ★ CYCLE DETECTED! ★\n     │       │                       │                     │ Cycle: 0→1→2→0\n\nIf no cycle (remove edge 2→0):\n  3  │ 2     │ G  G  G  W            │ [0, 1, 2]           │ Visit 2\n  4  │ 3     │ G  G  G  G            │ [0, 1, 2, 3]        │ Visit 3\n  5  │ done3 │ G  G  G  B            │ [0, 1, 2]           │ 3 fully done → BLACK\n  6  │ done2 │ G  G  B  B            │ [0, 1]              │ 2 fully done → BLACK\n  7  │ done1 │ G  B  B  B            │ [0]                 │ 1 fully done → BLACK\n  8  │ done0 │ B  B  B  B            │ []                  │ 0 fully done → BLACK\n     │       │                       │                     │ No cycle found ✓\n\nRule: Edge to GRAY node = CYCLE (back edge to ancestor in DFS tree)\n      Edge to BLACK node = OK (cross edge or forward edge)\n      Edge to WHITE node = tree edge (continue DFS)\n```\n\n```java\n// Directed graph cycle detection with 3 colors\nprivate static final int WHITE = 0, GRAY = 1, BLACK = 2;\n\npublic boolean hasCycle(int n, List<List<Integer>> adj) {\n    int[] color = new int[n]; // all WHITE initially\n    for (int i = 0; i < n; i++) {\n        if (color[i] == WHITE && dfs(i, adj, color)) return true;\n    }\n    return false;\n}\n\nprivate boolean dfs(int u, List<List<Integer>> adj, int[] color) {\n    color[u] = GRAY;\n    for (int v : adj.get(u)) {\n        if (color[v] == GRAY) return true; // back edge → cycle!\n        if (color[v] == WHITE && dfs(v, adj, color)) return true;\n    }\n    color[u] = BLACK;\n    return false;\n}\n```\n\n### Grid as Graph — BFS Flood Fill Visual\n\n```\nGrid (0 = water, 1 = land):\n  1 1 0 0 0\n  1 1 0 0 0\n  0 0 1 0 0\n  0 0 0 1 1\n\nTreat each cell as a node. 4-directional neighbors = edges.\n\nNumber of Islands BFS — Island #1:\n  Start BFS from (0,0):\n\n  Queue states:\n  Step 0: queue=[(0,0)], visited grid:\n    V 1 0 0 0      V = visited\n    1 1 0 0 0\n    0 0 1 0 0\n    0 0 0 1 1\n\n  Step 1: process (0,0), add neighbors (0,1) and (1,0):\n    V V 0 0 0\n    V 1 0 0 0\n    0 0 1 0 0\n    0 0 0 1 1\n\n  Step 2: process (0,1), add (1,1) [only unvisited neighbor]:\n    V V 0 0 0\n    V V 0 0 0\n    0 0 1 0 0\n    0 0 0 1 1\n\n  Step 3: process (1,0), no new unvisited neighbors\n  Step 4: process (1,1), no new unvisited neighbors\n\n  Island #1 complete! Size = 4 cells.\n\n  Continue scanning → find (2,2): Island #2 (size 1)\n  Continue scanning → find (3,3): Island #3, BFS adds (3,4). Size = 2.\n\n  Total islands = 3.\n\nDirection arrays for grid BFS:\n  int[] dx = {-1, 1, 0, 0};  // up, down, left, right\n  int[] dy = {0, 0, -1, 1};\n  // Or combined: int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};\n```\n\n```java\npublic int numIslands(char[][] grid) {\n    int rows = grid.length, cols = grid[0].length, count = 0;\n    for (int i = 0; i < rows; i++) {\n        for (int j = 0; j < cols; j++) {\n            if (grid[i][j] == \'1\') {\n                count++;\n                bfs(grid, i, j, rows, cols);\n            }\n        }\n    }\n    return count;\n}\n\nprivate void bfs(char[][] grid, int r, int c, int rows, int cols) {\n    Queue<int[]> queue = new LinkedList<>();\n    queue.offer(new int[]{r, c});\n    grid[r][c] = \'0\'; // mark visited by modifying grid\n\n    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};\n    while (!queue.isEmpty()) {\n        int[] cell = queue.poll();\n        for (int[] d : dirs) {\n            int nr = cell[0] + d[0], nc = cell[1] + d[1];\n            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == \'1\') {\n                grid[nr][nc] = \'0\';\n                queue.offer(new int[]{nr, nc});\n            }\n        }\n    }\n}\n```\n\n### Graph Problem Pattern Decision Tree\n\n```\n┌──────────────────────────────────────────────────────────────┐\n│              GRAPH PROBLEM DECISION TREE                      │\n├──────────────────────────────────────────────────────────────┤\n│                                                               │\n│  Is it a grid/matrix problem?                                 │\n│  ├─ YES → Treat each cell as node, neighbors as edges         │\n│  │        Use BFS for shortest path, DFS for exploration      │\n│  │                                                            │\n│  Is it shortest path?                                         │\n│  ├─ Unweighted → BFS (guaranteed shortest)                    │\n│  ├─ Weighted, no negative → Dijkstra O((V+E) log V)          │\n│  ├─ Negative weights → Bellman-Ford O(VE)                     │\n│  ├─ All pairs → Floyd-Warshall O(V³)                          │\n│  │                                                            │\n│  Is it ordering/dependency?                                   │\n│  ├─ YES → Topological Sort (Kahn\'s BFS or DFS)               │\n│  │        Check for cycles first!                             │\n│  │                                                            │\n│  Is it connectivity?                                          │\n│  ├─ Connected components → BFS/DFS or Union-Find              │\n│  ├─ Bridges/Articulation pts → Tarjan\'s Algorithm             │\n│  │                                                            │\n│  Is it cycle detection?                                       │\n│  ├─ Directed → 3-color DFS (WHITE/GRAY/BLACK)                 │\n│  ├─ Undirected → DFS with parent tracking or Union-Find       │\n│  │                                                            │\n│  Is it minimum spanning tree?                                 │\n│  ├─ Dense graph → Prim\'s with priority queue                  │\n│  └─ Sparse graph → Kruskal\'s with Union-Find                  │\n└──────────────────────────────────────────────────────────────┘\n```\n\n### BFS vs DFS — When to Use Which\n\n```\n┌─────────────────────────┬──────────────────────────────────┐\n│ Use BFS when:           │ Use DFS when:                    │\n├─────────────────────────┼──────────────────────────────────┤\n│ • Shortest path needed  │ • Exploring all paths/solutions  │\n│ • Level-by-level order  │ • Detecting cycles (3-color)     │\n│ • Nearest neighbor      │ • Topological sorting            │\n│ • Minimum steps/moves   │ • Finding connected components   │\n│ • Multi-source spread   │ • Backtracking problems          │\n│   (rotting oranges)     │ • Path existence (any path)      │\n│ • Word ladder           │ • Strongly connected components  │\n│                         │ • Tree traversals                │\n├─────────────────────────┼──────────────────────────────────┤\n│ Space: O(width of graph)│ Space: O(depth of graph)         │\n│ For trees: O(n) worst   │ For trees: O(h) where h=height  │\n│ (wide trees use more)   │ (deep trees use more)            │\n└─────────────────────────┴──────────────────────────────────┘\n```\n\n',
  },
  {
    slug: 'tries',
    title: 'Tries',
    icon: 'Type',
    description: 'Build prefix trees for autocomplete, word search, and dictionary-based string problems.',
    color: 'pink',
    content: '# Tries (Prefix Trees) ÔÇö Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## ­ƒôî Core Concepts\n\n### What is a Trie?\n\nA **Trie** (pronounced "try", from re**trie**val) is a tree-like data structure where each node represents a **single character**, and paths from root to marked nodes form complete words. Unlike BSTs that compare entire keys, tries decompose keys character by character.\n\n### Why Tries?\n\n| Operation | HashSet | Sorted Array | Trie |\n|-----------|---------|-------------|------|\n| Search word | O(L) avg | O(L log n) | **O(L)** guaranteed |\n| Insert word | O(L) avg | O(n) | **O(L)** guaranteed |\n| Prefix search | O(n ├ù L) | O(L log n + k) | **O(P + k)** |\n| Autocomplete (top-k) | O(n ├ù L) | O(L log n + k) | **O(P + k)** |\n| Lexicographic sort | O(n log n) | Already sorted | **O(total chars)** |\n\nWhere L = word length, P = prefix length, n = number of words, k = number of results.\n\n**Key advantage:** Tries excel at **prefix-based operations** ÔÇö finding all words with a given prefix is O(prefix_length), not O(n).\n\n### Java Classes\n\n\`\`\`java\n// Basic Trie Node ÔÇö Array-based (lowercase English letters)\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord = false;\n    // Optional: count, word reference, etc.\n}\n\n// HashMap-based node (arbitrary characters / large alphabets)\nclass TrieNodeMap {\n    Map<Character, TrieNodeMap> children = new HashMap<>();\n    boolean isEndOfWord = false;\n}\n\n// With word storage (useful for Word Search II)\nclass TrieNodeWithWord {\n    TrieNode[] children = new TrieNode[26];\n    String word = null;  // Store full word at end nodes\n}\n\`\`\`\n\n---\n\n## ­ƒöì Visual Deep Dive\n\n### Trie Node Structure\n\n\`\`\`\nEach node contains:\nÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ\nÔöé TrieNode                             Ôöé\nÔöé ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ Ôöé\nÔöé Ôöé children[26] (a-z)               Ôöé Ôöé\nÔöé Ôöé  [a] [b] [c] ... [p] ... [z]    Ôöé Ôöé\nÔöé Ôöé  Ôöé    Ôöé    ├ù      Ôöé       ├ù      Ôöé Ôöé\nÔöé Ôöé  Ôåô    Ôåô           Ôåô             Ôöé Ôöé\nÔöé Ôöé node node       node            Ôöé Ôöé\nÔöé ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ Ôöé\nÔöé isEndOfWord: true/false              Ôöé\nÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ\n\nArray-based: children[ch - \'a\'] for lowercase letters\nHashMap-based: children.get(ch) for any character\n\`\`\`\n\n### Insert Operation: Building the Trie Character by Character\n\n**Inserting words: "app", "apple", "ape", "bat"**\n\n\`\`\`\nStart with empty root: (root)\n\nInsert "app":\n  root ÔåÆ \'a\' ÔåÆ \'p\' ÔåÆ \'p\'*\n  \n  (root)\n    Ôöé\n    a\n    Ôöé\n    p\n    Ôöé\n    p Ôÿà (isEndOfWord = true)\n\nInsert "apple":\n  root ÔåÆ \'a\' ÔåÆ \'p\' ÔåÆ \'p\' ÔåÆ \'l\' ÔåÆ \'e\'*\n  Reuse existing path aÔåÆpÔåÆp, then add lÔåÆe\n  \n  (root)\n    Ôöé\n    a\n    Ôöé\n    p\n    Ôöé\n    p Ôÿà\n    Ôöé\n    l\n    Ôöé\n    e Ôÿà\n\nInsert "ape":\n  root ÔåÆ \'a\' ÔåÆ \'p\' ÔåÆ \'e\'*\n  Reuse aÔåÆp, branch at p with new child \'e\'\n  \n  (root)\n    Ôöé\n    a\n    Ôöé\n    p\n   / \\\n  p Ôÿà  e Ôÿà\n  Ôöé\n  l\n  Ôöé\n  e Ôÿà\n\nInsert "bat":\n  root ÔåÆ \'b\' ÔåÆ \'a\' ÔåÆ \'t\'*\n  New branch from root\n  \n  (root)\n   / \\\n  a    b\n  Ôöé    Ôöé\n  p    a\n / \\   Ôöé\np Ôÿà e Ôÿà t Ôÿà\nÔöé\nl\nÔöé\ne Ôÿà\n\nWords stored: appÔÿà, appleÔÿà, apeÔÿà, batÔÿà\n\`\`\`\n\n### Search vs StartsWith: Traversal Difference\n\n\`\`\`\nTrie contains: appÔÿà, appleÔÿà, apeÔÿà, batÔÿà\n\nsearch("app"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô ÔåÆ p Ô£ô (isEndOfWord=true) ÔåÆ TRUE Ô£ô\n\nsearch("ap"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô (isEndOfWord=false) ÔåÆ FALSE Ô£ù\n  (Path exists but \'p\' is not marked as word end)\n\nstartsWith("ap"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô (node exists) ÔåÆ TRUE Ô£ô\n  (Only checks if the path exists, doesn\'t need isEndOfWord)\n\nsearch("application"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô ÔåÆ p Ô£ô ÔåÆ l Ô£ô ÔåÆ i ÔåÆ NULL ÔåÆ FALSE Ô£ù\n  (Path breaks at \'i\' ÔÇö no child node)\n\nstartsWith("ba"):\n  root ÔåÆ b Ô£ô ÔåÆ a Ô£ô (node exists) ÔåÆ TRUE Ô£ô\n\`\`\`\n\n**Key difference:**\n- \`search(word)\`: Follow path AND check \`isEndOfWord == true\` at final node\n- \`startsWith(prefix)\`: Just check if the path exists (can reach the last character)\n\n### Delete Operation: When to Remove Nodes vs Just Unmark\n\n\`\`\`\nTrie: appÔÿà, appleÔÿà, apeÔÿà\n\nDelete "apple":\n  Traverse: rootÔåÆaÔåÆpÔåÆpÔåÆlÔåÆeÔÿà\n  \n  Can we remove the \'e\' node? \n    \'e\' has no children ÔåÆ YES, remove it\n  Can we remove the \'l\' node?\n    \'l\' has no children (after removing \'e\') ÔåÆ YES, remove it\n  Can we remove second \'p\' node?\n    \'p\' is isEndOfWord=true ("app" ends here) ÔåÆ STOP removing!\n  \n  Result: appÔÿà, apeÔÿà remain. "apple" deleted.\n\n  Before:           After:\n  (root)            (root)\n    Ôöé                 Ôöé\n    a                 a\n    Ôöé                 Ôöé\n    p                 p\n   / \\               / \\\n  p Ôÿà  e Ôÿà         p Ôÿà  e Ôÿà\n  Ôöé\n  l                (l and e removed)\n  Ôöé\n  e Ôÿà\n\nDelete "app":\n  Traverse: rootÔåÆaÔåÆpÔåÆpÔÿà\n  \n  Can we remove second \'p\'?\n    \'p\' has no children ÔåÆ but wait, is it shared?\n    In this trie, \'p\' (second) has no children (after apple was deleted)\n    Remove the \'p\' node... but it was endpoint for "app".\n    Actually: Just unmark isEndOfWord = false.\n    Since no children after unmarking ÔåÆ then remove node.\n  Can we remove first \'p\'?\n    \'p\' still has child \'e\' (for "ape") ÔåÆ STOP removing!\n    \n  Result: only apeÔÿà remains.\n\`\`\`\n\n### Array-Based vs HashMap-Based Children\n\n\`\`\`\nArray-based (TrieNode[] children = new TrieNode[26]):\n  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ\n  Ôöé [a][b][c][d][e][f]...[x][y][z]              Ôöé\n  Ôöé  Ôåô  ├ù  ├ù  ├ù  Ôåô  ├ù ...  ├ù  ├ù  ├ù             Ôöé\n  Ôöé node       node                              Ôöé\n  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ\n  \n  Pros:\n  + O(1) child access: children[ch - \'a\']\n  + Better cache locality (contiguous memory)\n  + Simpler code\n  \n  Cons:\n  - Wastes memory: 26 pointers per node even if only 2 used\n  - Fixed alphabet size\n  - 26 ├ù 8 bytes = 208 bytes per node (64-bit JVM)\n\nHashMap-based (Map<Character, TrieNode> children):\n  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ\n  Ôöé {\'a\' ÔåÆ node,        Ôöé\n  Ôöé  \'e\' ÔåÆ node}        Ôöé\n  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ\n  \n  Pros:\n  + Memory efficient: only stores actual children\n  + Supports ANY character set (Unicode, numbers, etc.)\n  \n  Cons:\n  - HashMap overhead per node (~48 bytes for empty HashMap)\n  - O(1) average but with higher constant factor\n  - Worse cache behavior\n\nRule of thumb:\n  - Lowercase letters only ÔåÆ Array-based (26)\n  - Alphanumeric ÔåÆ Array-based (62) or HashMap\n  - Unicode / large alphabet ÔåÆ HashMap\n  - Memory-constrained ÔåÆ HashMap\n\`\`\`\n\n### Compressed Trie (Radix Tree / Patricia Tree)\n\n\`\`\`\nStandard Trie for: "romane", "romanus", "romulus", "rubens"\n\nStandard Trie:              Compressed Trie (Radix Tree):\n     (root)                       (root)\n      Ôöé                          /     \\\n      r                       "r"       \n      Ôöé                       / \\        \n      o                    "om"  "ub"    \n      Ôöé                    / \\     Ôöé     \n      m                 "an" "ulus" "ens" \n     / \\               / \\   Ôÿà      Ôÿà    \n    a   u            "e" "us"            \n    Ôöé   Ôöé             Ôÿà    Ôÿà             \n    n   l                                \n   / \\  Ôöé                                \n  e   u u                                \n  Ôÿà   s s                                \n      Ôÿà Ôÿà                                \n\nCompression: Merge chains of single-child nodes into one edge\nwith a substring label instead of a single character.\n\nBenefits:\n  - Fewer nodes ÔåÆ less memory\n  - Faster traversal (skip multi-char edges)\n  \nTradeoffs:\n  - More complex insert/delete (may need to split edges)\n  - Better for long common prefixes\n\`\`\`\n\n### Trie + DFS: Word Search II Strategy\n\n\`\`\`\nBoard:              Words: ["oath", "pea", "eat", "rain"]\no a a n\ne t a e             Build trie from words:\ni h k r                  (root)\ni f l v                 /  |   \\\n                       o   p    e   r\n                       Ôöé   Ôöé    Ôöé   Ôöé\n                       a   e    a   a\n                       Ôöé   Ôöé    Ôöé   Ôöé\n                       t   aÔÿà   tÔÿà  i\n                       Ôöé              Ôöé\n                       hÔÿà             nÔÿà\n\nStrategy: For each cell, if the character matches a trie child,\nDFS on the board while simultaneously descending the trie.\n\nStarting at (0,0)=\'o\':\n  Trie root has child \'o\' ÔåÆ descend trie to \'o\', DFS on board\n  (0,0)=\'o\' ÔåÆ (0,1)=\'a\': trie \'o\' has child \'a\' ÔåÆ continue\n  (0,1)=\'a\' ÔåÆ (1,1)=\'t\': trie \'a\' has child \'t\' ÔåÆ continue\n  (1,1)=\'t\' ÔåÆ (2,1)=\'h\': trie \'t\' has child \'h\' ÔåÆ continue\n  (2,1)=\'h\': trie \'h\' is endOfWord ÔåÆ FOUND "oath"!\n  \n  Prune: After finding "oath", mark trie node to avoid duplicates.\n\nKey optimization: \n  The trie prunes the DFS ÔÇö we only explore board paths \n  that could lead to valid words!\n\`\`\`\n\n---\n\n## ÔÜí Key Algorithms & Techniques\n\n### 1. Basic Trie Implementation\n\n\`\`\`java\nclass Trie {\n    private TrieNode root = new TrieNode();\n    \n    static class TrieNode {\n        TrieNode[] children = new TrieNode[26];\n        boolean isEnd = false;\n    }\n    \n    // Insert a word ÔÇö O(L)\n    public void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null) {\n                node.children[idx] = new TrieNode();\n            }\n            node = node.children[idx];\n        }\n        node.isEnd = true;\n    }\n    \n    // Search for exact word ÔÇö O(L)\n    public boolean search(String word) {\n        TrieNode node = findNode(word);\n        return node != null && node.isEnd;\n    }\n    \n    // Check if any word starts with prefix ÔÇö O(P)\n    public boolean startsWith(String prefix) {\n        return findNode(prefix) != null;\n    }\n    \n    private TrieNode findNode(String s) {\n        TrieNode node = root;\n        for (char c : s.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null) return null;\n            node = node.children[idx];\n        }\n        return node;\n    }\n}\n\`\`\`\n\n### 2. Trie with Delete Operation\n\n\`\`\`java\n// Returns true if the node should be deleted (no children, not end of another word)\npublic boolean delete(TrieNode node, String word, int depth) {\n    if (depth == word.length()) {\n        if (!node.isEnd) return false; // Word not found\n        node.isEnd = false;\n        return isEmpty(node); // Delete node if no children\n    }\n    \n    int idx = word.charAt(depth) - \'a\';\n    if (node.children[idx] == null) return false; // Word not found\n    \n    boolean shouldDeleteChild = delete(node.children[idx], word, depth + 1);\n    if (shouldDeleteChild) {\n        node.children[idx] = null;\n        return !node.isEnd && isEmpty(node);\n    }\n    return false;\n}\n\nprivate boolean isEmpty(TrieNode node) {\n    for (TrieNode child : node.children) {\n        if (child != null) return false;\n    }\n    return true;\n}\n\`\`\`\n\n### 3. Autocomplete with Trie\n\n**Idea:** Navigate to the prefix node, then DFS to find all words below it.\n\n\`\`\`\nTrie contains: "apple", "app", "application", "ape", "apex", "bat"\n\nautocomplete("ap"):\n  Navigate: root ÔåÆ \'a\' ÔåÆ \'p\' (prefix node found)\n  DFS from \'p\' node to collect all words:\n    p ÔåÆ p ÔåÆ (isEnd: "app") ÔåÆ l ÔåÆ e ÔåÆ (isEnd: "apple")\n                                   ÔåÆ i ÔåÆ c ÔåÆ a ÔåÆ t ÔåÆ i ÔåÆ o ÔåÆ n ÔåÆ (isEnd: "application")\n    p ÔåÆ e ÔåÆ (isEnd: "ape") ÔåÆ x ÔåÆ (isEnd: "apex")\n  \n  Results: ["app", "apple", "application", "ape", "apex"]\n\`\`\`\n\n\`\`\`java\npublic List<String> autocomplete(String prefix) {\n    List<String> results = new ArrayList<>();\n    TrieNode node = findNode(prefix);\n    if (node == null) return results;\n    \n    dfsCollect(node, new StringBuilder(prefix), results);\n    return results;\n}\n\nprivate void dfsCollect(TrieNode node, StringBuilder sb, List<String> results) {\n    if (node.isEnd) results.add(sb.toString());\n    for (int i = 0; i < 26; i++) {\n        if (node.children[i] != null) {\n            sb.append((char) (\'a\' + i));\n            dfsCollect(node.children[i], sb, results);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n    }\n}\n\`\`\`\n\n### 4. Word Search II (LC 212) ÔÇö Trie + Backtracking\n\n\`\`\`java\npublic List<String> findWords(char[][] board, String[] words) {\n    // Build trie from words\n    TrieNode root = new TrieNode();\n    for (String word : words) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null)\n                node.children[idx] = new TrieNode();\n            node = node.children[idx];\n        }\n        node.word = word; // Store complete word at end node\n    }\n    \n    List<String> result = new ArrayList<>();\n    for (int r = 0; r < board.length; r++) {\n        for (int c = 0; c < board[0].length; c++) {\n            dfs(board, r, c, root, result);\n        }\n    }\n    return result;\n}\n\nprivate void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {\n    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;\n    \n    char ch = board[r][c];\n    if (ch == \'#\' || node.children[ch - \'a\'] == null) return;\n    \n    node = node.children[ch - \'a\'];\n    if (node.word != null) {\n        result.add(node.word);\n        node.word = null; // Avoid duplicates\n    }\n    \n    board[r][c] = \'#\'; // Mark visited\n    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n    for (int[] d : dirs) {\n        dfs(board, r + d[0], c + d[1], node, result);\n    }\n    board[r][c] = ch; // Restore\n    \n    // Optimization: prune empty trie branches\n    // (if node has no children left, remove it from parent)\n}\n\nstatic class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    String word = null;\n}\n\`\`\`\n\n### 5. Applications of Tries\n\n**Autocomplete System:**\n\`\`\`\nUser types "pro"\n  ÔåÆ Trie navigates to node for "pro"\n  ÔåÆ DFS collects: "program", "programming", "project", "process", ...\n  ÔåÆ Rank by frequency/popularity\n  ÔåÆ Return top-k suggestions\n\`\`\`\n\n**Spell Checker:**\n\`\`\`\nWord "progrm" not in trie.\nGenerate candidates within edit distance 1:\n  Insert: "progrm" ÔåÆ "program" Ô£ô (insert \'a\')\n  Delete: "progrm" ÔåÆ "progrm" (delete chars)\n  Replace: "progrm" ÔåÆ "program" Ô£ô (replace \'m\' ÔåÆ \'am\')\nUse trie to quickly validate candidates.\n\`\`\`\n\n**IP Routing (Longest Prefix Match):**\n\`\`\`\nRouting table as binary trie:\n  192.168.1.0/24   ÔåÆ Route A\n  192.168.0.0/16   ÔåÆ Route B\n  10.0.0.0/8       ÔåÆ Route C\n\nPacket to 192.168.1.42:\n  Traverse binary trie for "11000000.10101000.00000001.00101010"\n  Longest matching prefix: 192.168.1.0/24 ÔåÆ Route A\n\`\`\`\n\n---\n\n## ­ƒÄ» Pattern Recognition\n\n\`\`\`\nProblem Keywords ÔåÆ Technique:\n\n"Prefix search / autocomplete"        ÔåÆ Trie + DFS collect\n"Word dictionary with wildcards"       ÔåÆ Trie + DFS (branch on \'.\')\n"Word search in grid (multiple)"       ÔåÆ Trie + Backtracking (Word Search II)\n"Longest common prefix"                ÔåÆ Trie (traverse until branch/end)\n"Count words with prefix"              ÔåÆ Trie with prefix count at each node\n"Replace words with prefixes"          ÔåÆ Trie lookup for shortest prefix\n"Palindrome pairs"                     ÔåÆ Trie of reversed words\n"Maximum XOR"                          ÔåÆ Bitwise Trie (binary trie)\n"Concatenated words"                   ÔåÆ Trie + DP\n"Search autocomplete system"           ÔåÆ Trie + frequency + top-k\n"Spell checker"                        ÔåÆ Trie + edit distance\n"Stream of characters"                 ÔåÆ Trie built from reversed patterns\n\`\`\`\n\n---\n\n## ­ƒôè Complexity Cheat Sheet\n\n| Operation | Time | Space | Notes |\n|-----------|------|-------|-------|\n| Insert word | O(L) | O(L) | L = word length, creates at most L nodes |\n| Search word | O(L) | O(1) | Follow existing path |\n| Prefix search | O(P) | O(1) | P = prefix length |\n| Delete word | O(L) | O(1) | May remove up to L nodes |\n| Autocomplete (all) | O(P + K) | O(K) | K = total chars in results |\n| Build trie (N words) | O(N ├ù L) | O(N ├ù L) | Worst case all unique chars |\n| Word Search II | O(R├ùC ├ù 4^L) | O(N├ùL + R├ùC) | Pruned by trie |\n\n| Trie Type | Space per Node | Child Access | Best For |\n|-----------|---------------|-------------|----------|\n| Array[26] | 26 pointers (208B) | O(1) | Lowercase only, speed |\n| Array[128] | 128 pointers (1KB) | O(1) | ASCII characters |\n| HashMap | ~48B base + entries | O(1) avg | Large/dynamic alphabets |\n| Compressed | Varies | O(edge length) | Long common prefixes |\n\n---\n\n## ­ƒºá Interview Deep Dive: Worked Examples\n\n### Example 1: Implement Trie (LC 208)\n\n**Problem:** Implement a trie with insert, search, and startsWith.\n\n**Step-by-step trace:**\n\n\`\`\`\nTrie trie = new Trie();\n\ntrie.insert("apple"):\n  root ÔåÆ [a]=new ÔåÆ [p]=new ÔåÆ [p]=new ÔåÆ [l]=new ÔåÆ [e]=new, isEnd=true\n  \n  (root)ÔöÇaÔöÇpÔöÇpÔöÇlÔöÇeÔÿà\n\ntrie.search("apple"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô ÔåÆ p Ô£ô ÔåÆ l Ô£ô ÔåÆ e Ô£ô, isEnd=true ÔåÆ TRUE Ô£ô\n\ntrie.search("app"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô ÔåÆ p Ô£ô, isEnd=false ÔåÆ FALSE Ô£ù\n\ntrie.startsWith("app"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô ÔåÆ p Ô£ô, node exists ÔåÆ TRUE Ô£ô\n\ntrie.insert("app"):\n  root ÔåÆ a(exists) ÔåÆ p(exists) ÔåÆ p(exists), isEnd=true\n  \n  (root)ÔöÇaÔöÇpÔöÇpÔÿàÔöÇlÔöÇeÔÿà\n\ntrie.search("app"):\n  root ÔåÆ a Ô£ô ÔåÆ p Ô£ô ÔåÆ p Ô£ô, isEnd=true ÔåÆ TRUE Ô£ô\n\`\`\`\n\nSee implementation in Key Algorithms section above.\n\n### Example 2: Word Search II (LC 212)\n\n**Problem:** Given a board and list of words, find all words that can be formed by adjacent cells.\n\n**Input:**\n\`\`\`\nBoard:        Words: ["oath", "pea", "eat", "rain"]\no a a n\ne t a e\ni h k r\ni f l v\n\`\`\`\n\n**Trace:**\n\n\`\`\`\nBuild trie from words:\n  Insert "oath": rootÔåÆoÔåÆaÔåÆtÔåÆhÔÿà\n  Insert "pea":  rootÔåÆpÔåÆeÔåÆaÔÿà\n  Insert "eat":  rootÔåÆeÔåÆaÔåÆtÔÿà\n  Insert "rain": rootÔåÆrÔåÆaÔåÆiÔåÆnÔÿà\n\nScan board (r,c), try each cell as starting point:\n\n(0,0)=\'o\': Trie root has child \'o\' Ô£ô\n  DFS: (0,0)=\'o\' ÔåÆ trie at \'o\'\n  \n  Neighbors of (0,0): (0,1)=\'a\', (1,0)=\'e\'\n  \n  (0,1)=\'a\': trie \'o\' has child \'a\' Ô£ô ÔåÆ trie at \'o\'ÔåÆ\'a\'\n    (1,1)=\'t\': trie \'a\' has child \'t\' Ô£ô ÔåÆ trie at \'o\'ÔåÆ\'a\'ÔåÆ\'t\'\n      (2,1)=\'h\': trie \'t\' has child \'h\' Ô£ô ÔåÆ trie at \'o\'ÔåÆ\'a\'ÔåÆ\'t\'ÔåÆ\'h\'Ôÿà\n      FOUND "oath"! Ôÿà Add to results. Null out word to prevent dupes.\n      \n  (1,0)=\'e\': trie \'o\' has child \'e\'? NO ÔåÆ skip\n\n(1,0)=\'e\': Trie root has child \'e\' Ô£ô\n  DFS: (1,0)=\'e\' ÔåÆ trie at \'e\'\n  (1,1)=\'t\': trie \'e\' has child... NO (\'e\' has child \'a\', not \'t\') ÔåÆ skip\n  (0,0)=\'o\': trie \'e\' has child \'o\'? NO ÔåÆ skip\n  No valid paths.\n\n(1,1)=\'t\': Trie root has child \'t\'? NO ÔåÆ skip\n\n...continue scanning...\n\n(1,0)=\'e\': Try path eÔåÆaÔåÆt\n  Actually: (1,0)ÔåÆ(0,0) not matching, but (1,0)ÔåÆ(0,1) or (1,0)ÔåÆ(1,1)ÔåÆ...\n  Need eÔåÆaÔåÆt: (1,0)=\'e\' ÔåÆ up to (0,0)=\'o\' NO\n               (1,0)=\'e\' ÔåÆ right (1,1)=\'t\' ÔåÆ trie \'e\' needs \'a\' not \'t\'\n               \n  The word "eat" can be found starting from a different position.\n  (Let\'s find it from a cell with \'e\' that has path eÔåÆaÔåÆt)\n\nBoard scan finds: "oath", "eat"\nResult: ["oath", "eat"]\n\`\`\`\n\n### Example 3: Design Search Autocomplete System (LC 642)\n\n**Problem:** Design an autocomplete system. Given a sentence history with frequencies, support:\n- \`input(char c)\`: User types a character. Return top-3 sentences matching current prefix, sorted by frequency (then lexicographic). \'#\' marks end of input.\n\n**Approach:** Trie where each node stores a map of \`{sentence ÔåÆ frequency}\` for all sentences passing through that node. On each character input, descend the trie and return sorted results.\n\n\`\`\`java\nclass AutocompleteSystem {\n    class TrieNode {\n        Map<Character, TrieNode> children = new HashMap<>();\n        Map<String, Integer> counts = new HashMap<>();\n    }\n    \n    TrieNode root = new TrieNode();\n    TrieNode curr;          // Current position in trie\n    StringBuilder sb;       // Current input being typed\n    \n    public AutocompleteSystem(String[] sentences, int[] times) {\n        root = new TrieNode();\n        for (int i = 0; i < sentences.length; i++) {\n            addSentence(sentences[i], times[i]);\n        }\n        curr = root;\n        sb = new StringBuilder();\n    }\n    \n    private void addSentence(String sentence, int count) {\n        TrieNode node = root;\n        for (char c : sentence.toCharArray()) {\n            node.children.putIfAbsent(c, new TrieNode());\n            node = node.children.get(c);\n            node.counts.merge(sentence, count, Integer::sum);\n        }\n    }\n    \n    public List<String> input(char c) {\n        if (c == \'#\') {\n            addSentence(sb.toString(), 1);\n            curr = root;\n            sb = new StringBuilder();\n            return new ArrayList<>();\n        }\n        \n        sb.append(c);\n        if (curr != null) {\n            curr = curr.children.get(c);\n        }\n        if (curr == null) return new ArrayList<>();\n        \n        // Get top 3 by frequency (desc), then lexicographic (asc)\n        PriorityQueue<Map.Entry<String, Integer>> pq = new PriorityQueue<>(\n            (a, b) -> a.getValue() != b.getValue()\n                ? a.getValue() - b.getValue()\n                : b.getKey().compareTo(a.getKey())\n        );\n        \n        for (Map.Entry<String, Integer> entry : curr.counts.entrySet()) {\n            pq.offer(entry);\n            if (pq.size() > 3) pq.poll();\n        }\n        \n        LinkedList<String> result = new LinkedList<>();\n        while (!pq.isEmpty()) result.addFirst(pq.poll().getKey());\n        return result;\n    }\n}\n\`\`\`\n\n**Trace:**\n\n\`\`\`\nInit: sentences=["i love you","island","iroman","i love leetcode"], times=[5,3,2,2]\n\nTrie built. Let\'s trace input:\n\ninput(\'i\'):\n  curr = root ÔåÆ \'i\' node\n  Counts at \'i\': {"i love you":5, "island":3, "iroman":2, "i love leetcode":2}\n  Top 3 by freq: ["i love you", "island", "i love leetcode"]\n  (iroman and i love leetcode both freq 2, "i love leetcode" < "iroman" lex)\n\ninput(\' \'):\n  curr = \'i\' ÔåÆ \' \' node\n  Counts: {"i love you":5, "i love leetcode":2}\n  Top 3: ["i love you", "i love leetcode"]\n\ninput(\'a\'):\n  curr = \' \' ÔåÆ \'a\'? No child \'a\' ÔåÆ curr = null\n  Return []\n\ninput(\'#\'):\n  Save "i a" with count 1. Reset.\n  Return []\n\`\`\`\n\n---\n\n## ÔÜá´©Å Common Mistakes\n\n1. **Confusing search() and startsWith():** \`search\` requires \`isEndOfWord == true\` at the final node. \`startsWith\` only requires the path to exist. Forgetting the \`isEnd\` check makes search return true for prefixes.\n\n2. **Not pruning in Word Search II:** After finding a word, mark \`node.word = null\` to avoid adding duplicates. Also prune empty branches for performance.\n\n3. **Memory waste with array[26] for large alphabets:** If the alphabet is large (Unicode, mixed case), using a 26-size array either wastes memory or causes bugs. Use HashMap for flexible alphabets.\n\n4. **Deletion complexity ÔÇö not checking shared nodes:** When deleting a word, don\'t blindly remove nodes. Check if a node is part of another word\'s path (has other children or is another word\'s endpoint).\n\n5. **Not considering empty string edge cases:** An empty string should typically return true for startsWith("") and search("") only if empty string was explicitly inserted.\n\n6. **Allocating new StringBuilder in DFS collect:** In autocomplete DFS, create ONE StringBuilder and use append/deleteCharAt. Don\'t create new strings at each level ÔÇö that causes O(L┬▓) per path instead of O(L).\n\n7. **Forgetting to restore board state in Word Search II:** When using the board itself for visited marking (\`board[r][c] = \'#\'\`), always restore the original character during backtracking.\n\n8. **Building a new trie per query in autocomplete:** The trie should be built once and maintained. Only the current traversal position changes per character input.\n\n---\n\n## ­ƒÆí Java-Specific Tips\n\n- **Array vs HashMap children ÔÇö performance:**\n  \`\`\`java\n  // Array: ~3-5x faster due to no hashing/boxing\n  TrieNode[] children = new TrieNode[26];\n  children[ch - \'a\'];  // Direct index, no overhead\n  \n  // HashMap: more flexible but slower\n  Map<Character, TrieNode> children = new HashMap<>();\n  children.get(ch);    // Hash computation, autoboxing charÔåÆCharacter\n  \`\`\`\n\n- **Store the full word at end nodes** (avoids rebuilding):\n  \`\`\`java\n  class TrieNode {\n      TrieNode[] children = new TrieNode[26];\n      String word = null;  // null if not end of word\n  }\n  // During insert: node.word = word; (instead of isEnd = true)\n  // During search: found word = node.word\n  \`\`\`\n\n- **Count prefix occurrences with a counter at each node:**\n  \`\`\`java\n  class TrieNode {\n      TrieNode[] children = new TrieNode[26];\n      int prefixCount = 0;  // How many words pass through this node\n      int wordCount = 0;    // How many words end at this node\n  }\n  \`\`\`\n\n- **Trie iteration for lexicographic sort:**\n  \`\`\`java\n  // DFS traversal of a trie yields words in lexicographic order!\n  // Because children[0]=\'a\' < children[1]=\'b\' < ... < children[25]=\'z\'\n  void lexSort(TrieNode node, StringBuilder sb, List<String> sorted) {\n      if (node.isEnd) sorted.add(sb.toString());\n      for (int i = 0; i < 26; i++) {\n          if (node.children[i] != null) {\n              sb.append((char)(\'a\' + i));\n              lexSort(node.children[i], sb, sorted);\n              sb.deleteCharAt(sb.length() - 1);\n          }\n      }\n  }\n  \`\`\`\n\n- **Bitwise Trie for Maximum XOR:**\n  \`\`\`java\n  // Each "character" is a bit (0 or 1), from MSB to LSB\n  // To maximize XOR, at each bit position, try to go in the opposite direction\n  class BitTrieNode {\n      BitTrieNode[] children = new BitTrieNode[2]; // [0] and [1]\n  }\n  \`\`\`\n\n---\n\n## ­ƒöù Comparison Tables\n\n### Trie vs Other String Data Structures\n\n| Feature | Trie | HashSet | Sorted Array | BST (of strings) |\n|---------|------|---------|-------------|------------------|\n| Search word | O(L) | O(L) avg | O(L log n) | O(L log n) |\n| Insert | O(L) | O(L) avg | O(n) | O(L log n) |\n| Prefix search | **O(P)** Ôÿà | O(n├ùL) | O(L log n) | O(L log n) |\n| Autocomplete | **O(P+K)** Ôÿà | O(n├ùL) | O(L log n + K) | O(L log n + K) |\n| Space | O(N├ùL) | O(N├ùL) | O(N├ùL) | O(N├ùL) |\n| Wildcard search | **O(26^w ├ù L)** | O(n├ùL) | O(n├ùL) | O(n├ùL) |\n| Lexicographic order | **DFS = sorted** | No order | Already sorted | In-order |\n| Memory overhead | High (node pointers) | Moderate (hash table) | Low | Moderate |\n\n### When to Use Trie vs Alternatives\n\n| Scenario | Best Choice | Why |\n|----------|------------|-----|\n| Exact word lookup only | HashSet | Simpler, same O(L) |\n| Prefix-based search | **Trie** | O(P) prefix lookup |\n| Autocomplete / suggestions | **Trie** + frequency | Natural prefix traversal |\n| Word search on grid | **Trie** | Prunes DFS branches |\n| Spell checking | **Trie** + edit distance | Efficient candidate generation |\n| Dictionary with wildcard \'.\' | **Trie** + DFS branching | Handle wildcards naturally |\n| Simple frequency counting | HashMap | No prefix structure needed |\n| Range queries on strings | TreeSet / Sorted Array | subSet(), binary search |\n| Maximum XOR of two numbers | **Bitwise Trie** | Greedy bit-by-bit decisions |\n| IP routing (longest prefix) | **Compressed Trie** | Longest prefix match |\n\n### Trie Implementation Variants\n\n| Variant | Description | Best For |\n|---------|-------------|----------|\n| Standard Trie | One char per node | General purpose |\n| Compressed (Radix) | Multi-char edges | Long common prefixes |\n| Ternary Search Tree | 3 children (lt, eq, gt) | Memory efficient |\n| DAFSA / DAWG | Shared suffixes too | Static dictionaries |\n| Bitwise Trie | Binary (0/1) per node | XOR problems, IP routing |\n| Double-Array Trie | Array-based compact | Very fast lookup, static |\n\n\n## 🔍 Extended Visual Deep Dive\n\n### Building a Trie — Step by Step\n\n```\nInsert words: "app", "apple", "ape", "bat", "bar"\n\nAfter inserting "app":\n  (root)\n    └─ a\n       └─ p\n          └─ p*     (* = end of word)\n\nAfter inserting "apple":\n  (root)\n    └─ a\n       └─ p\n          └─ p*\n             └─ l\n                └─ e*\n\nAfter inserting "ape":\n  (root)\n    └─ a\n       └─ p\n          ├─ p*\n          │  └─ l\n          │     └─ e*\n          └─ e*\n\nAfter inserting "bat":\n  (root)\n    ├─ a\n    │  └─ p\n    │     ├─ p*\n    │     │  └─ l\n    │     │     └─ e*\n    │     └─ e*\n    └─ b\n       └─ a\n          └─ t*\n\nAfter inserting "bar":\n  (root)\n    ├─ a\n    │  └─ p\n    │     ├─ p*\n    │     │  └─ l\n    │     │     └─ e*\n    │     └─ e*\n    └─ b\n       └─ a\n          ├─ t*\n          └─ r*\n\nFinal trie stores 5 words using shared prefixes:\n  "app" and "apple" share "app"\n  "app" and "ape" share "ap"\n  "bat" and "bar" share "ba"\n  Total nodes: 12 (vs 18 characters if stored separately)\n```\n\n### Search vs StartsWith — Path Difference\n\n```\nTrie contents: "app", "apple", "ape"\n\n  (root)\n    └─ a\n       └─ p\n          ├─ p* ──→ l ──→ e*\n          └─ e*\n\n═══════════════════════════════════════════════════════════\n  search("app") → TRUE\n═══════════════════════════════════════════════════════════\n  Path: root → a → p → p*\n  Reached node marked as END OF WORD (*) → TRUE ✓\n\n═══════════════════════════════════════════════════════════\n  search("ap") → FALSE\n═══════════════════════════════════════════════════════════\n  Path: root → a → p\n  Reached \'p\' node but it is NOT marked as end of word → FALSE ✗\n\n═══════════════════════════════════════════════════════════\n  startsWith("ap") → TRUE\n═══════════════════════════════════════════════════════════\n  Path: root → a → p\n  Node exists! Don\'t care about end-of-word flag → TRUE ✓\n\n═══════════════════════════════════════════════════════════\n  search("apt") → FALSE\n═══════════════════════════════════════════════════════════\n  Path: root → a → p → t?\n  Node \'p\' has no child \'t\' → FALSE ✗\n\n═══════════════════════════════════════════════════════════\n  startsWith("b") → FALSE\n═══════════════════════════════════════════════════════════\n  Path: root → b?\n  Root has no child \'b\' → FALSE ✗\n  (Our trie only has words starting with \'a\')\n\nKey difference:\n  search()     — must reach a node AND isEnd == true\n  startsWith() — only needs to traverse the path (isEnd irrelevant)\n```\n\n### Delete Operation — Visual Walkthrough\n\n```\nTrie: "app", "apple", "ape"\n\nDELETE "apple":\n\nStep 1: Traverse to end of "apple": root→a→p→p→l→e\nStep 2: Unmark e as end-of-word: e.isEnd = false\nStep 3: Check if \'e\' has children → NO → delete \'e\'\nStep 4: Check if \'l\' has children → NO → delete \'l\'\nStep 5: Check if \'p\' (second) has children → NO... wait, is \'p\' end-of-word?\n         YES! \'p\' is end of "app" → STOP deleting!\n\nBefore:                    After:\n  (root)                    (root)\n    └─ a                      └─ a\n       └─ p                      └─ p\n          ├─ p*                     ├─ p*\n          │  └─ l                   └─ e*\n          │     └─ e*\n          └─ e*\n\nDELETE "app":\n\nStep 1: Traverse to "app": root→a→p→p\nStep 2: Unmark p as end-of-word\nStep 3: \'p\' has no children → but wait, does parent \'p\' have other children?\n         Parent \'p\' (first) also has child \'e\' (for "ape") → only delete second \'p\'\n\nBefore:                    After:\n  (root)                    (root)\n    └─ a                      └─ a\n       └─ p                      └─ p\n          ├─ p*                     └─ e*\n          └─ e*\n\nDelete rules:\n  1. Unmark the end-of-word flag\n  2. If the node has children → STOP (other words use this path)\n  3. If the node is end-of-word for another word → STOP\n  4. Otherwise → delete node and recurse up to parent\n```\n\n### Array-Based vs HashMap-Based Trie — Code & Comparison\n\n```java\n// ═══════════════════════════════════════════════════════════\n//   ARRAY-BASED TRIE (fixed alphabet, e.g., lowercase a-z)\n// ═══════════════════════════════════════════════════════════\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26]; // fixed size array\n    boolean isEnd = false;\n}\n\nclass Trie {\n    TrieNode root = new TrieNode();\n\n    void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null)\n                node.children[idx] = new TrieNode();\n            node = node.children[idx];\n        }\n        node.isEnd = true;\n    }\n\n    boolean search(String word) {\n        TrieNode node = traverse(word);\n        return node != null && node.isEnd;\n    }\n\n    boolean startsWith(String prefix) {\n        return traverse(prefix) != null;\n    }\n\n    private TrieNode traverse(String s) {\n        TrieNode node = root;\n        for (char c : s.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null) return null;\n            node = node.children[idx];\n        }\n        return node;\n    }\n}\n\n\n// ═══════════════════════════════════════════════════════════\n//   HASHMAP-BASED TRIE (any character set)\n// ═══════════════════════════════════════════════════════════\nclass TrieNodeMap {\n    Map<Character, TrieNodeMap> children = new HashMap<>();\n    boolean isEnd = false;\n}\n\nclass TrieMap {\n    TrieNodeMap root = new TrieNodeMap();\n\n    void insert(String word) {\n        TrieNodeMap node = root;\n        for (char c : word.toCharArray()) {\n            node = node.children.computeIfAbsent(c, k -> new TrieNodeMap());\n        }\n        node.isEnd = true;\n    }\n\n    boolean search(String word) {\n        TrieNodeMap node = traverse(word);\n        return node != null && node.isEnd;\n    }\n\n    boolean startsWith(String prefix) {\n        return traverse(prefix) != null;\n    }\n\n    private TrieNodeMap traverse(String s) {\n        TrieNodeMap node = root;\n        for (char c : s.toCharArray()) {\n            node = node.children.get(c);\n            if (node == null) return null;\n        }\n        return node;\n    }\n}\n```\n\n```\n┌─────────────────────┬────────────────────┬─────────────────────┐\n│ Feature             │ Array-Based [26]   │ HashMap-Based        │\n├─────────────────────┼────────────────────┼─────────────────────┤\n│ Lookup per char     │ O(1) — array index │ O(1) avg — hash     │\n│ Memory per node     │ 26 pointers        │ Only used chars     │\n│                     │ (mostly null)      │ + HashMap overhead   │\n│ Best when           │ Lowercase a-z only │ Unicode, mixed chars │\n│ Cache performance   │ Excellent          │ Poor (hash tables)   │\n│ Memory for sparse   │ Wasteful           │ Efficient            │\n│ Memory for dense    │ Efficient          │ Wasteful (overhead)  │\n│ Interview default   │ ✅ YES — simpler   │ When asked for it    │\n│ Real-world          │ DNA (4 chars)      │ Autocomplete, NLP    │\n└─────────────────────┴────────────────────┴─────────────────────┘\n```\n\n### Compressed Trie (Radix Tree) — Visual\n\n```\nStandard Trie for: "romane", "romanus", "romulus", "rubens", "ruber", "rubicon"\n\nStandard (many single-child chains):\n  (root)\n    └─ r\n       ├─ o\n       │  └─ m\n       │     ├─ a\n       │     │  └─ n\n       │     │     ├─ e*\n       │     │     └─ u\n       │     │        └─ s*\n       │     └─ u\n       │        └─ l\n       │           └─ u\n       │              └─ s*\n       └─ u\n          └─ b\n             ├─ e\n             │  ├─ n\n             │  │  └─ s*\n             │  └─ r*\n             └─ i\n                └─ c\n                   └─ o\n                      └─ n*\n\nCompressed Trie (merge single-child chains):\n  (root)\n    └─ r\n       ├─ om\n       │  ├─ an\n       │  │  ├─ e*\n       │  │  └─ us*\n       │  └─ ulus*\n       └─ ub\n          ├─ e\n          │  ├─ ns*\n          │  └─ r*\n          └─ icon*\n\nBenefits:\n  - Standard: 21 nodes    Compressed: 12 nodes (43% reduction!)\n  - Fewer pointer hops → faster traversal\n  - Less memory usage for sparse tries\n  - Used in: IP routing tables, suffix trees, HTTP routers\n\nTrade-off: Insert/delete more complex (may need to split/merge edges)\n```\n\n### Word Search II — Trie + Grid DFS Strategy\n\n```\nBoard:                Words: ["oath","pea","eat","rain"]\n  o  a  a  n\n  e  t  a  e\n  i  h  k  r\n  a  i  f  l\n\nStrategy: Build trie from words, then DFS from each cell using trie to prune.\n\nStep 1: Build trie from words\n  (root)\n    ├─ o → a → t → h*\n    ├─ p → e → a*\n    ├─ e → a → t*\n    └─ r → a → i → n*\n\nStep 2: DFS from each cell, following trie edges\n\n  Starting from (0,0) = \'o\':\n    Trie root has child \'o\' → proceed\n    (0,0)\'o\' → (1,0)\'e\'? Trie \'o\' has no child \'e\' → prune ✗\n    (0,0)\'o\' → (0,1)\'a\'? Trie \'o\' has child \'a\' → proceed!\n      (0,1)\'a\' → (1,1)\'t\'? Trie \'oa\' has child \'t\' → proceed!\n        (1,1)\'t\' → (2,1)\'h\'? Trie \'oat\' has child \'h\' → proceed!\n          \'oath\' is end of word! → FOUND "oath" ✓\n\n  Starting from (1,0) = \'e\':\n    Trie root has child \'e\' → proceed\n    (1,0)\'e\' → (0,0)\'o\'? Trie \'e\' has no child \'o\' → prune ✗\n    (1,0)\'e\' → (0,1)\'a\'? Trie \'e\' has child \'a\' → proceed!\n      (0,1)\'a\' → (1,1)\'t\'? Trie \'ea\' has child \'t\' → proceed!\n        \'eat\' is end of word! → FOUND "eat" ✓\n\n  "pea" not findable (no \'p\' on board adjacent to \'e\' then \'a\')\n  "rain" not findable (no valid path r→a→i→n)\n\nResult: ["oath", "eat"]\n\nWhy Trie is critical here:\n  Without trie: For each cell × each word → O(cells × words × wordLen)\n  With trie: Shared prefix exploration. If no word starts with "ik",\n  we prune ALL words at once when we see \'i\'→\'k\' path.\n```\n\n```java\nclass Solution {\n    private int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};\n    private List<String> result = new ArrayList<>();\n\n    public List<String> findWords(char[][] board, String[] words) {\n        // Build trie\n        TrieNode root = new TrieNode();\n        for (String word : words) {\n            TrieNode node = root;\n            for (char c : word.toCharArray()) {\n                int idx = c - \'a\';\n                if (node.children[idx] == null)\n                    node.children[idx] = new TrieNode();\n                node = node.children[idx];\n            }\n            node.word = word; // store complete word at leaf\n        }\n\n        // DFS from each cell\n        int m = board.length, n = board[0].length;\n        for (int i = 0; i < m; i++)\n            for (int j = 0; j < n; j++)\n                dfs(board, i, j, m, n, root);\n\n        return result;\n    }\n\n    private void dfs(char[][] board, int r, int c, int m, int n, TrieNode node) {\n        if (r < 0 || r >= m || c < 0 || c >= n) return;\n        char ch = board[r][c];\n        if (ch == \'#\' || node.children[ch - \'a\'] == null) return;\n\n        node = node.children[ch - \'a\'];\n        if (node.word != null) {\n            result.add(node.word);\n            node.word = null; // avoid duplicates\n        }\n\n        board[r][c] = \'#\'; // mark visited\n        for (int[] d : dirs) dfs(board, r + d[0], c + d[1], m, n, node);\n        board[r][c] = ch;   // backtrack\n    }\n}\n\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    String word; // non-null if end of a word\n}\n```\n\n### Autocomplete System — Design & Visual\n\n```\nDesign an autocomplete system that:\n  1. Returns top-3 results by frequency for a given prefix\n  2. Supports adding new sentences\n\nData structure: Trie where each node stores a map of {sentence → frequency}\n\nExample sentences with frequencies:\n  "i love you" (5), "island" (3), "i love coding" (2), "ironman" (1)\n\nTrie structure (showing freq maps at each node):\n  (root)\n    └─ i                    {i love you:5, island:3, i love coding:2, ironman:1}\n       ├─ \" \" (space)      {i love you:5, i love coding:2}\n       │  └─ l → o → v → e\n       │     ├─ \" \" → y → o → u*  freq=5\n       │     └─ \" \" → c → o → d → i → n → g*  freq=2\n       ├─ s → l → a → n → d*   freq=3\n       └─ r → o → n → m → a → n*  freq=1\n\nQuery: user types "i "\n  1. Traverse trie: root → \'i\' → \' \'\n  2. At node \' \', get frequency map: {i love you:5, i love coding:2}\n  3. Return top 3: ["i love you", "i love coding"]\n\nQuery: user types "i l"\n  1. Traverse: root → \'i\' → \' \' → \'l\'\n  2. Frequency map at \'l\': {i love you:5, i love coding:2}\n  3. Return: ["i love you", "i love coding"]\n\nOptimization: Instead of storing full maps at every node,\nuse a PriorityQueue or pre-sorted list of top-3 at each node.\nThis trades O(n) space per node for O(1) query time.\n```\n\n```java\nclass AutocompleteSystem {\n    class TrieNode {\n        Map<Character, TrieNode> children = new HashMap<>();\n        Map<String, Integer> freqMap = new HashMap<>(); // sentence → count\n    }\n\n    TrieNode root = new TrieNode();\n    TrieNode curr;\n    StringBuilder sb = new StringBuilder();\n\n    public AutocompleteSystem(String[] sentences, int[] times) {\n        root = new TrieNode();\n        for (int i = 0; i < sentences.length; i++)\n            addSentence(sentences[i], times[i]);\n        curr = root;\n    }\n\n    private void addSentence(String sentence, int count) {\n        TrieNode node = root;\n        for (char c : sentence.toCharArray()) {\n            node = node.children.computeIfAbsent(c, k -> new TrieNode());\n            node.freqMap.merge(sentence, count, Integer::sum);\n        }\n    }\n\n    public List<String> input(char c) {\n        if (c == \'#\') {\n            addSentence(sb.toString(), 1);\n            sb = new StringBuilder();\n            curr = root;\n            return new ArrayList<>();\n        }\n\n        sb.append(c);\n        if (curr != null) curr = curr.children.get(c);\n        if (curr == null) return new ArrayList<>();\n\n        // Get top 3 by frequency (then lexicographic for ties)\n        PriorityQueue<Map.Entry<String, Integer>> pq = new PriorityQueue<>(\n            (a, b) -> a.getValue().equals(b.getValue())\n                ? b.getKey().compareTo(a.getKey()) // reverse lex for min-heap\n                : a.getValue() - b.getValue()       // min freq at top\n        );\n\n        for (Map.Entry<String, Integer> entry : curr.freqMap.entrySet()) {\n            pq.offer(entry);\n            if (pq.size() > 3) pq.poll(); // evict lowest\n        }\n\n        List<String> result = new ArrayList<>();\n        while (!pq.isEmpty()) result.add(0, pq.poll().getKey());\n        return result;\n    }\n}\n```\n\n### Trie Problem Pattern Decision Tree\n\n```\n┌──────────────────────────────────────────────────────────────┐\n│              WHEN TO USE A TRIE?                              │\n├──────────────────────────────────────────────────────────────┤\n│                                                               │\n│  Need prefix matching / autocomplete?                         │\n│  ├─ YES → Trie (or sorted array + binary search for simple)  │\n│  │                                                            │\n│  Word search in a grid with dictionary?                       │\n│  ├─ YES → Trie + DFS backtracking (Word Search II)           │\n│  │        Trie enables pruning entire branches at once        │\n│  │                                                            │\n│  Need to find longest common prefix?                          │\n│  ├─ YES → Trie (or horizontal scanning for simple cases)     │\n│  │                                                            │\n│  Implementing a dictionary with wild cards (. matches any)?   │\n│  ├─ YES → Trie + DFS (branch on all children for \'.\')       │\n│  │                                                            │\n│  XOR-related problems (max XOR pair)?                         │\n│  ├─ YES → Bitwise Trie (store binary representations)        │\n│  │        Each level = one bit, choose opposite bit greedily  │\n│  │                                                            │\n│  Counting distinct substrings?                                │\n│  ├─ YES → Suffix Trie (insert all suffixes)                  │\n│  │        Total nodes = distinct substrings + 1               │\n│  │                                                            │\n│  Just checking if words exist in a set?                       │\n│  └─ NO → Use HashSet! Trie is overkill for exact matching    │\n│          Trie shines for PREFIX operations, not exact lookup  │\n└──────────────────────────────────────────────────────────────┘\n```\n\n### Trie vs Other Data Structures\n\n```\n┌────────────────────┬────────────┬────────────┬──────────────┬──────────────┐\n│ Operation          │ Trie       │ HashSet    │ TreeSet      │ Sorted Array │\n├────────────────────┼────────────┼────────────┼──────────────┼──────────────┤\n│ Insert word (len L)│ O(L)       │ O(L) avg   │ O(L log n)   │ O(n)         │\n│ Search exact       │ O(L)       │ O(L) avg   │ O(L log n)   │ O(L log n)   │\n│ Prefix search      │ O(L)       │ O(n*L) ✗   │ O(L log n)   │ O(L log n)   │\n│ Autocomplete (k)   │ O(L + k)   │ O(n*L) ✗   │ O(L log n+k) │ O(L log n+k) │\n│ Delete             │ O(L)       │ O(L) avg   │ O(L log n)   │ O(n)         │\n│ Space              │ O(TOTAL_L) │ O(n*L_avg) │ O(n*L_avg)   │ O(n*L_avg)   │\n│ Wildcard search    │ O(26^w * L)│ O(n*L) ✗   │ Not possible │ Not possible │\n├────────────────────┴────────────┴────────────┴──────────────┴──────────────┤\n│ L = word length, n = number of words, w = number of wildcards              │\n│ Trie wins decisively for prefix operations and wildcard matching           │\n└────────────────────────────────────────────────────────────────────────────┘\n```\n\n',
  },
  {
    slug: 'union-find',
    title: 'Union-Find',
    icon: 'GitMerge',
    description: 'Track connected components dynamically with disjoint set union, path compression, and union by rank.',
    color: 'amber',
    content: `# Union-Find (Disjoint Set Union) — Complete Interview Guide

## Table of Contents
- [Core Concepts](#core-concepts)
- [Visual Deep Dive](#visual-deep-dive)
- [Key Algorithms & Techniques](#key-algorithms--techniques)
- [Kruskal\'s MST with Union-Find](#kruskals-mst-with-union-find)
- [Pattern Recognition](#pattern-recognition)
- [Complete Java Implementation](#complete-java-implementation)
- [Worked Examples](#worked-examples)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Practice Problems](#practice-problems)

---

## 🧠 Core Concepts

### What Is Union-Find?

Union-Find (also called **Disjoint Set Union** or DSU) is a data structure that tracks a collection
of **disjoint (non-overlapping) sets**. It supports two primary operations:

1. **Find(x)**: Determine which set element x belongs to (returns the set representative/root)
2. **Union(x, y)**: Merge the sets containing x and y into one

**Why it matters for interviews:**
- Optimal for dynamic connectivity problems
- Core component of Kruskal\'s Minimum Spanning Tree algorithm
- Detects cycles in undirected graphs in near-constant time
- Solves connected component problems where edges are added incrementally
- Powers many graph problems that seem hard at first glance

### The Key Insight

\`\`\`
Traditional approach to check "Are A and B connected?":
  → BFS/DFS from A: O(V + E) per query

Union-Find approach:
  → find(A) == find(B): Nearly O(1) per query!

When you have Q queries about connectivity:
  BFS/DFS: O(Q × (V + E))    — too slow for large graphs
  Union-Find: O(Q × α(n))    — nearly O(Q), practically instant
\`\`\`

### Core Operations Explained

**Parent Array** — The Foundation:
Each element points to a "parent." The element pointing to itself is the **root** (representative)
of its set.

\`\`\`
Index:  [0, 1, 2, 3, 4]
Parent: [0, 1, 2, 3, 4]   ← Initially, each element is its own parent
         ↑  ↑  ↑  ↑  ↑
        root root root root root

Meaning: 5 separate sets: {0} {1} {2} {3} {4}
\`\`\`

**Find Operation** — "Who is my root?"
Follow parent pointers until you find an element that IS its own parent:
\`\`\`
find(3):
  parent[3] = 1 → follow
  parent[1] = 0 → follow
  parent[0] = 0 → STOP! 0 is the root

The root identifies the set. If find(a) == find(b), then a and b are in the same set.
\`\`\`

**Union Operation** — "Merge two sets"
Connect the root of one set to the root of the other:
\`\`\`
union(3, 4):
  root_3 = find(3) = 0
  root_4 = find(4) = 4
  parent[4] = 0   ← Now 4\'s set is merged into 0\'s set

Before:  {0, 1, 3}  {4}
After:   {0, 1, 3, 4}
\`\`\`

---

## 🔍 Visual Deep Dive

### Initial State — 5 Nodes

\`\`\`
╔═════════════════════════════════════════════════════════════╗
║  INITIAL STATE: Every node is its own component              ║
╠═════════════════════════════════════════════════════════════╣
║                                                               ║
║  Parent Array:  [0, 1, 2, 3, 4]                              ║
║  Rank Array:    [0, 0, 0, 0, 0]                              ║
║  Component Count: 5                                           ║
║                                                               ║
║  Components: {0} {1} {2} {3} {4}                             ║
║                                                               ║
║  Trees:   0    1    2    3    4                               ║
║           •    •    •    •    •                               ║
║         (each node is a root pointing to itself)              ║
╚═════════════════════════════════════════════════════════════╝
\`\`\`

### Step-by-Step Union Operations

**Operation 1: union(0, 1)**
\`\`\`
After union(0, 1):
  find(0) = 0, find(1) = 1 → Different roots
  Attach root 1 under root 0 (equal rank, pick 0)

  Parent: [0, 0, 2, 3, 4]
  Rank:   [1, 0, 0, 0, 0]

  Tree view:
      0       2    3    4          Component Count: 4
      |
      1

  Components: {0,1}  {2}  {3}  {4}
\`\`\`

**Operation 2: union(2, 3)**
\`\`\`
After union(2, 3):
  find(2) = 2, find(3) = 3 → Different roots
  Attach root 3 under root 2

  Parent: [0, 0, 2, 2, 4]
  Rank:   [1, 0, 1, 0, 0]

  Tree view:
      0       2       4               Component Count: 3
      |       |
      1       3

  Components: {0,1}  {2,3}  {4}
\`\`\`

**Operation 3: union(1, 3)**
\`\`\`
After union(1, 3):
  find(1): parent[1]=0, parent[0]=0 → root = 0
  find(3): parent[3]=2, parent[2]=2 → root = 2
  Roots differ (0 vs 2)! rank[0]=1 == rank[2]=1
  Attach root 2 under root 0, increment rank[0]

  Parent: [0, 0, 0, 2, 4]
  Rank:   [2, 0, 1, 0, 0]

  Tree view:
        0          4                   Component Count: 2
       / \
      1   2
          |
          3

  Components: {0,1,2,3}  {4}
\`\`\`

### Path Compression Visualized

Path compression flattens the tree during find() so future lookups are O(1):

\`\`\`
PATH COMPRESSION — find(3)

  BEFORE find(3):         AFTER find(3):

      0                       0
      |                     / | \
      1                    1  2  3
      |
      2                   Every node now points
      |                   directly to the root!
      3

  Trace:
    find(3): parent[3]=2 → parent[2]=1 → parent[1]=0
             parent[0]=0 → root found = 0
    Now set: parent[3]=0, parent[2]=0, parent[1]=0

  Parent BEFORE: [0, 0, 1, 2, 4]
  Parent AFTER:  [0, 0, 0, 0, 4]
\`\`\`

**Why Path Compression is Powerful:**
\`\`\`
Without compression:        With compression:
    0                           0
    |                        / | | \
    1                       1  2  3  4
    |
    2                       After find(4), ALL nodes
    |                       point directly to root.
    3                       Future finds are O(1)!
    |
    4

find(4) traverses 4 nodes   find(4) traverses 1 node
\`\`\`

### Union by Rank Visualized

Union by rank ensures the shorter tree always attaches under the taller tree:

\`\`\`
UNION BY RANK — Why it matters

  WITHOUT union by rank (bad):
  union(0,1), union(1,2), union(2,3), union(3,4)

     0
     |         ← Linear chain! find() = O(n)
     1
     |
     2
     |
     3
     |
     4

  WITH union by rank (good):
  Same unions but attach smaller under larger:

       0
     / | \      ← Balanced! find() = O(log n)
    1  2  3
       |
       4

  Rank only increases when two EQUAL rank trees merge:
    rank[a]=2, rank[b]=1 → attach b under a, rank unchanged
    rank[a]=2, rank[b]=2 → attach b under a, rank[a]=3
\`\`\`

### Inverse Ackermann — The "Effectively O(1)" Explanation

\`\`\`
INVERSE ACKERMANN FUNCTION α(n)

  With BOTH path compression AND union by rank:
  Each operation is O(α(n)) amortized

  α(n) is the inverse Ackermann function.
  How slow does it grow?

  n                    α(n)
  ──────────────────   ────
  1                    0
  2                    1
  4                    2
  16                   3
  65536               4
  2^65536             5   ← A number with ~20,000 digits!

  For ANY practical input (even 10^80 atoms in the universe):
  α(n) ≤ 4

  This means Union-Find is EFFECTIVELY O(1) per operation.
  It\'s the closest you can get to constant time while
  still being technically not O(1).
\`\`\`

---

## 🔑 Key Algorithms & Techniques

### Naive Implementation (No Optimizations)

\`\`\`java
class NaiveUnionFind {
    int[] parent;

    NaiveUnionFind(int n) {
        parent = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    // O(n) worst case — follows chain to root
    int find(int x) {
        while (parent[x] != x) {
            x = parent[x];
        }
        return x;
    }

    // O(n) worst case — can create long chains
    void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX != rootY) {
            parent[rootY] = rootX;
        }
    }

    boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}
\`\`\`

**Problem:** Without optimizations, repeated unions can create a linked list:
\`\`\`
union(0,1): 0←1
union(1,2): 0←1←2
union(2,3): 0←1←2←3
union(3,4): 0←1←2←3←4    find(4) takes O(n) steps!
\`\`\`

### Path Compression Implementation

\`\`\`java
// Recursive path compression
int find(int x) {
    if (parent[x] != x) {
        parent[x] = find(parent[x]);  // Point directly to root
    }
    return parent[x];
}

// Iterative path compression (avoids stack overflow)
int findIterative(int x) {
    int root = x;
    while (parent[root] != root) root = parent[root];
    while (parent[x] != root) {
        int next = parent[x];
        parent[x] = root;
        x = next;
    }
    return root;
}
\`\`\`

**Trace of find(4) with path compression:**
\`\`\`
Before: parent = [0, 0, 1, 2, 3]
Tree:     0 ← 1 ← 2 ← 3 ← 4

find(4):
  find(3):
    find(2):
      find(1):
        find(0): return 0   ← base case
      parent[1] = 0, return 0
    parent[2] = 0, return 0
  parent[3] = 0, return 0
parent[4] = 0, return 0

After: parent = [0, 0, 0, 0, 0]
Tree:     0
        / | | \
       1  2  3  4    ← All flat!
\`\`\`

### Union by Rank Implementation

\`\`\`java
void union(int x, int y) {
    int rootX = find(x);
    int rootY = find(y);
    if (rootX == rootY) return;

    // Attach smaller rank tree under larger rank tree
    if (rank[rootX] < rank[rootY]) {
        parent[rootX] = rootY;
    } else if (rank[rootX] > rank[rootY]) {
        parent[rootY] = rootX;
    } else {
        parent[rootY] = rootX;
        rank[rootX]++;  // Only increment when ranks are equal
    }
}
\`\`\`

**Why rank increases only when equal:**
\`\`\`
Case 1: rank[A]=2 > rank[B]=1
  Attach B under A. Tree height unchanged. rank[A] stays 2.
     A            A
    / \    +  B  →  / | \
   x   y      z   x  y  B
                        |
                        z

Case 2: rank[A]=1 == rank[B]=1
  Attach B under A. Height INCREASES. rank[A] becomes 2.
     A     B       A
     |  +  |  →   / \
     x     y     x   B
                      |
                      y
\`\`\`

---

## 🌲 Kruskal\'s MST with Union-Find

Kruskal\'s algorithm finds the Minimum Spanning Tree by greedily adding the
smallest edge that doesn\'t create a cycle. Union-Find makes cycle detection efficient.

### Complete Walkthrough

\`\`\`
KRUSKAL\'S MST — Step by Step

Graph:     A ---1--- B
           |  \      |
           3    2    5
           |      \  |
           C ---4--- D

Step 1: Sort all edges by weight
  Edge   | Weight
  -------+-------
  A-B    |   1
  A-D    |   2
  A-C    |   3
  C-D    |   4
  B-D    |   5

Step 2: Process edges using Union-Find

  Process (A-B, 1):
    find(A)=A, find(B)=B → Different! → union(A,B)
    MST edges: {A-B}   MST cost: 1
    UF State: {A,B} {C} {D}
       A
       |
       B    C    D

  Process (A-D, 2):
    find(A)=A, find(D)=D → Different! → union(A,D)
    MST edges: {A-B, A-D}   MST cost: 3
    UF State: {A,B,D} {C}
       A
      / \
     B   D    C

  Process (A-C, 3):
    find(A)=A, find(C)=C → Different! → union(A,C)
    MST edges: {A-B, A-D, A-C}   MST cost: 6
    UF State: {A,B,C,D}
        A
      / | \
     B  D  C
    ✓ Done! MST has V-1 = 3 edges

  Process (C-D, 4):
    find(C)=A, find(D)=A → SAME! → SKIP (would create cycle)

  Process (B-D, 5):
    find(B)=A, find(D)=A → SAME! → SKIP (would create cycle)

  Final MST cost: 1 + 2 + 3 = 6
\`\`\`

### Kruskal\'s MST — Java Implementation

\`\`\`java
class KruskalMST {
    int[] parent, rank;

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    boolean union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return false;  // Already connected
        if (rank[rx] < rank[ry]) { parent[rx] = ry; }
        else if (rank[rx] > rank[ry]) { parent[ry] = rx; }
        else { parent[ry] = rx; rank[rx]++; }
        return true;  // Successfully merged
    }

    public int kruskalMST(int n, int[][] edges) {
        // edges[i] = [u, v, weight]
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i;

        // Sort edges by weight
        Arrays.sort(edges, (a, b) -> a[2] - b[2]);

        int mstCost = 0, edgesUsed = 0;
        for (int[] edge : edges) {
            if (edgesUsed == n - 1) break;  // MST complete
            if (union(edge[0], edge[1])) {
                mstCost += edge[2];
                edgesUsed++;
            }
        }
        return edgesUsed == n - 1 ? mstCost : -1;
    }
}
\`\`\`

---

## 🎯 Pattern Recognition

### When to Use Union-Find

\`\`\`
UNION-FIND SIGNAL PHRASES IN PROBLEMS

  "Connected components"        → Classic Union-Find
  "Are X and Y connected?"      → Union-Find find()
  "Group items by equivalence"  → Union by shared property
  "Number of islands / groups"  → Count components
  "Adding edges dynamically"    → Union-Find over BFS/DFS
  "Redundant connection"        → Edge that creates cycle
  "Minimum spanning tree"       → Kruskal\'s with Union-Find
  "Earliest time all connected" → Union + track components
  "Network connectivity"        → Union-Find
  "Merge accounts/groups"       → String-based Union-Find
\`\`\`

### Union-Find vs BFS/DFS — Decision Guide

\`\`\`
Use Union-Find when:              Use BFS/DFS when:
───────────────────────────────   ──────────────────────────────
• Edges added incrementally       • Graph is static
• Multiple connectivity queries   • Single traversal needed
• Need component count            • Need shortest path
• Cycle detection (undirected)    • Need the actual path
• MST (Kruskal\'s)               • Topological sort
• Equivalence grouping            • Level-order traversal
\`\`\`

---

## 💻 Complete Java Implementation

### Full-Featured Union-Find with All Optimizations

\`\`\`java
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int count;  // Number of connected components

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }

    // Find with path compression — O(α(n)) amortized
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }

    // Iterative find (avoids stack overflow for large n)
    public int findIterative(int x) {
        int root = x;
        while (parent[root] != root) root = parent[root];
        while (parent[x] != root) {
            int next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    }

    // Union by rank — returns true if merge happened
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
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

### Weighted Union-Find (Union by Size)

\`\`\`java
class WeightedUnionFind {
    private int[] parent;
    private int[] size;
    private int count;

    public WeightedUnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
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

    public int getSize(int x) { return size[find(x)]; }
    public int getCount() { return count; }
    public boolean connected(int x, int y) { return find(x) == find(y); }
}
\`\`\`

### Map-Based Union-Find (for String/Object Keys)

\`\`\`java
class MapUnionFind<T> {
    private Map<T, T> parent = new HashMap<>();
    private Map<T, Integer> rank = new HashMap<>();

    public T find(T x) {
        if (!parent.containsKey(x)) {
            parent.put(x, x);
            rank.put(x, 0);
        }
        if (!parent.get(x).equals(x)) {
            parent.put(x, find(parent.get(x)));
        }
        return parent.get(x);
    }

    public boolean union(T x, T y) {
        T rootX = find(x), rootY = find(y);
        if (rootX.equals(rootY)) return false;
        int rx = rank.get(rootX), ry = rank.get(rootY);
        if (rx < ry) parent.put(rootX, rootY);
        else if (rx > ry) parent.put(rootY, rootX);
        else { parent.put(rootY, rootX); rank.put(rootX, rx + 1); }
        return true;
    }

    public boolean connected(T x, T y) {
        return find(x).equals(find(y));
    }
}
\`\`\`

---

## 📝 Worked Examples

### Example 1: Number of Connected Components (LC 323)

**Problem:** Given n nodes and undirected edges, find connected component count.

\`\`\`
n = 5, edges = [[0,1], [1,2], [3,4]]

Step-by-step trace:
Initial: parent=[0,1,2,3,4]  count=5

Process edge [0,1]:
  find(0)=0, find(1)=1 → different → union
  parent=[0,0,2,3,4]  count=4
  Components: {0,1} {2} {3} {4}

Process edge [1,2]:
  find(1)→parent[1]=0→root=0
  find(2)=2 → different → union
  parent=[0,0,0,3,4]  count=3
  Components: {0,1,2} {3} {4}

Process edge [3,4]:
  find(3)=3, find(4)=4 → different → union
  parent=[0,0,0,3,3]  count=2
  Components: {0,1,2} {3,4}

Answer: count = 2
\`\`\`

\`\`\`java
public int countComponents(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        uf.union(edge[0], edge[1]);
    }
    return uf.getCount();
}
\`\`\`

### Example 2: Redundant Connection (LC 684)

**Problem:** Find the edge that creates a cycle in an undirected graph.

\`\`\`
edges = [[1,2], [1,3], [2,3]]

Step-by-step trace:
Initial: parent=[_,1,2,3]  (1-indexed)

Process [1,2]:
  find(1)=1, find(2)=2 → different → union OK
  parent=[_,1,1,3]
    1
    |
    2    3

Process [1,3]:
  find(1)=1, find(3)=3 → different → union OK
  parent=[_,1,1,1]
    1
   / \
  2   3

Process [2,3]:
  find(2)=1, find(3)=1 → SAME! → CYCLE DETECTED!
  Return [2,3] ← This is the redundant edge
\`\`\`

\`\`\`java
public int[] findRedundantConnection(int[][] edges) {
    int n = edges.length;
    UnionFind uf = new UnionFind(n + 1);  // 1-indexed
    for (int[] edge : edges) {
        if (!uf.union(edge[0], edge[1])) {
            return edge;  // This edge creates a cycle!
        }
    }
    return new int[0];
}
\`\`\`

### Example 3: Accounts Merge (LC 721)

**Problem:** Merge accounts sharing common emails using string-based Union-Find.

\`\`\`
Input:
  Account 0: ["John", "john@mail.com", "john_newyork@mail.com"]
  Account 1: ["John", "john@mail.com", "john00@mail.com"]
  Account 2: ["Mary", "mary@mail.com"]
  Account 3: ["John", "johnnybravo@mail.com"]

Key insight: "john@mail.com" appears in accounts 0 AND 1 → merge them!

Step-by-step:
1. Map each email to first account index:
   john@mail.com → 0
   john_newyork@mail.com → 0
   john@mail.com → already 0, union(1, 0)!
   john00@mail.com → 1
   mary@mail.com → 2
   johnnybravo@mail.com → 3

2. After unions: {0,1} {2} {3}

3. Group emails by root:
   Root 0: john@mail.com, john_newyork@mail.com, john00@mail.com
   Root 2: mary@mail.com
   Root 3: johnnybravo@mail.com

4. Sort and format with account name
\`\`\`

\`\`\`java
public List<List<String>> accountsMerge(List<List<String>> accounts) {
    int n = accounts.size();
    UnionFind uf = new UnionFind(n);
    Map<String, Integer> emailToId = new HashMap<>();

    for (int i = 0; i < n; i++) {
        for (int j = 1; j < accounts.get(i).size(); j++) {
            String email = accounts.get(i).get(j);
            if (emailToId.containsKey(email)) {
                uf.union(i, emailToId.get(email));
            } else {
                emailToId.put(email, i);
            }
        }
    }

    Map<Integer, TreeSet<String>> groups = new HashMap<>();
    for (Map.Entry<String, Integer> entry : emailToId.entrySet()) {
        int root = uf.find(entry.getValue());
        groups.computeIfAbsent(root, k -> new TreeSet<>()).add(entry.getKey());
    }

    List<List<String>> result = new ArrayList<>();
    for (Map.Entry<Integer, TreeSet<String>> entry : groups.entrySet()) {
        List<String> account = new ArrayList<>();
        account.add(accounts.get(entry.getKey()).get(0));
        account.addAll(entry.getValue());
        result.add(account);
    }
    return result;
}
\`\`\`

### Example 4: Number of Islands II (LC 305)

**Problem:** Add land cells one at a time, return island count after each addition.

\`\`\`
Grid: 3×3 (all water initially)

AddLand(0,0):        AddLand(0,1):        AddLand(1,2):
  1 . .                1 1 .                1 1 .
  . . .                . . .                . . 1
  . . .                . . .                . . .
  Islands: 1           Islands: 1           Islands: 2

AddLand(2,1):        AddLand(1,1):
  1 1 .                1 1 .
  . . 1                . 1 1    ← all merge
  . 1 .                . 1 .
  Islands: 3           Islands: 1
\`\`\`

\`\`\`java
public List<Integer> numIslands2(int m, int n, int[][] positions) {
    UnionFind uf = new UnionFind(m * n);
    boolean[][] grid = new boolean[m][n];
    List<Integer> result = new ArrayList<>();
    int count = 0;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};

    for (int[] pos : positions) {
        int r = pos[0], c = pos[1];
        if (grid[r][c]) { result.add(count); continue; }
        grid[r][c] = true;
        count++;
        int id = r * n + c;

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc]) {
                int nid = nr * n + nc;
                if (uf.find(id) != uf.find(nid)) {
                    uf.union(id, nid);
                    count--;
                }
            }
        }
        result.add(count);
    }
    return result;
}
\`\`\`

---

## ⚡ Complexity Cheat Sheet

\`\`\`
UNION-FIND COMPLEXITY ANALYSIS

  Implementation           | Find     | Union    | Space
  ────────────────────────────+──────────+──────────+──────
  Naive (no optimization)  | O(n)     | O(n)     | O(n)
  Path compression only    | O(log n) | O(log n) | O(n)
  Union by rank only       | O(log n) | O(log n) | O(n)
  Both (optimal)           | O(α(n))  | O(α(n))  | O(n)

  For m operations on n elements:
  Optimal total: O(m × α(n)) ≈ O(m)   practically linear!

  Kruskal\'s MST: O(E log E + E × α(V)) = O(E log E)
    Dominated by the edge sorting step
\`\`\`

### Common Complexity Patterns

| Pattern | Time | Space | Notes |
|---|---|---|---|
| Basic connectivity | O(n × α(n)) | O(n) | n union/find operations |
| Kruskal\'s MST | O(E log E) | O(V) | Sort dominates |
| Connected components | O(V + E × α(V)) | O(V) | Process all edges |
| Dynamic connectivity | O(Q × α(n)) | O(n) | Q queries |
| Graph cycle detection | O(E × α(V)) | O(V) | First duplicate find |
| 2D grid components | O(M×N × α(M×N)) | O(M×N) | Flatten to 1D |

---

## 📋 Practice Problems

### Organized by Difficulty and Pattern

| Problem | Key Technique | Difficulty |
|---|---|---|
| 1971. Find if Path Exists in Graph | Basic connectivity check | Easy |
| 547. Number of Provinces | Basic Union-Find | Medium |
| 684. Redundant Connection | Cycle detection | Medium |
| 200. Number of Islands (UF approach) | 2D grid Union-Find | Medium |
| 721. Accounts Merge | String-based Union-Find | Medium |
| 323. Number of Connected Components | Count components | Medium |
| 128. Longest Consecutive Sequence | Union consecutive numbers | Medium |
| 990. Satisfiability of Equality Equations | == means union, != means check | Medium |
| 1319. Number of Operations to Make Network Connected | Components - 1 extra edges | Medium |
| 305. Number of Islands II | Dynamic island counting | Hard |
| 952. Largest Component Size by Common Factor | Union numbers sharing factors | Hard |
| 803. Bricks Falling When Hit | Reverse time + Union-Find | Hard |
| 839. Similar String Groups | Union similar strings | Hard |
| 1632. Rank Transform of a Matrix | Union-Find + DP | Hard |


---

## 💡 Advanced Union-Find Techniques

### Union-Find on 2D Grid

Many problems require converting a 2D grid to a 1D Union-Find structure:

\`\`\`
2D to 1D conversion: cell (row, col) -> id = row * numCols + col

Grid 3x4:        1D mapping:
(0,0)(0,1)(0,2)(0,3)    0  1  2  3
(1,0)(1,1)(1,2)(1,3)    4  5  6  7
(2,0)(2,1)(2,2)(2,3)    8  9 10 11

cell(1,2) = 1*4 + 2 = 6
cell(2,3) = 2*4 + 3 = 11
\`\`\`

\`\`\`java
// Number of Islands using Union-Find
public int numIslands(char[][] grid) {
    if (grid.length == 0) return 0;
    int m = grid.length, n = grid[0].length;
    UnionFind uf = new UnionFind(m * n);
    int water = 0;

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '0') {
                water++;
                continue;
            }
            // Union with right and down neighbors only (avoid double-counting)
            if (j + 1 < n && grid[i][j+1] == '1') {
                uf.union(i*n+j, i*n+j+1);
            }
            if (i + 1 < m && grid[i+1][j] == '1') {
                uf.union(i*n+j, (i+1)*n+j);
            }
        }
    }
    return uf.getCount() - water;
}
\`\`\`

### Time-Based Union-Find

Some problems ask: "At what time are all nodes connected?"
Process events in order, union as you go, check when component count == 1.

\`\`\`
EARLIEST TIME WHEN ALL CONNECTED (LC 1101)

logs = [[0,1,20], [0,2,10], [1,2,5], [2,3,30]]
  (sorted by time)
n = 4 nodes

Process [1,2,5] at t=5:   components: {0} {1,2} {3}  count=3
Process [0,2,10] at t=10:  components: {0,1,2} {3}    count=2
Process [0,1,20] at t=20:  0 and 1 already connected, skip
Process [2,3,30] at t=30:  components: {0,1,2,3}       count=1 DONE!

Answer: t=30
\`\`\`

\`\`\`java
public int earliestAcq(int[][] logs, int n) {
    Arrays.sort(logs, (a, b) -> a[2] - b[2]);  // Sort by time
    UnionFind uf = new UnionFind(n);

    for (int[] log : logs) {
        uf.union(log[0], log[1]);
        if (uf.getCount() == 1) return log[2];  // All connected!
    }
    return -1;  // Never fully connected
}
\`\`\`

### Weighted Union-Find (for Relative Relationships)

Used when relationships between elements have values (e.g., a/b = 2.0):

\`\`\`
EVALUATE DIVISION (LC 399)

equations: [["a","b"],["b","c"]]
values:    [2.0, 3.0]
Means: a/b = 2.0, b/c = 3.0

Build weighted graph:
  a --2.0--> b --3.0--> c
  a <--0.5-- b <--0.33-- c

Query a/c:
  a/c = (a/b) * (b/c) = 2.0 * 3.0 = 6.0

Query b/a:
  b/a = 1/(a/b) = 1/2.0 = 0.5
\`\`\`

\`\`\`java
// Using weighted Union-Find where weight[x] = x / parent[x]
class WeightedUF {
    Map<String, String> parent = new HashMap<>();
    Map<String, Double> weight = new HashMap<>();  // weight[x] = x / root(x)

    String find(String x) {
        if (!parent.containsKey(x)) {
            parent.put(x, x);
            weight.put(x, 1.0);
        }
        if (!parent.get(x).equals(x)) {
            String root = find(parent.get(x));
            weight.put(x, weight.get(x) * weight.get(parent.get(x)));
            parent.put(x, root);
        }
        return parent.get(x);
    }

    void union(String x, String y, double val) {
        // val = x / y
        String rx = find(x), ry = find(y);
        if (rx.equals(ry)) return;
        parent.put(rx, ry);
        // rx/ry = (x/rx_weight) * val * (ry_weight/y) = val * weight[y] / weight[x]
        weight.put(rx, val * weight.get(y) / weight.get(x));
    }

    double query(String x, String y) {
        if (!parent.containsKey(x) || !parent.containsKey(y)) return -1.0;
        String rx = find(x), ry = find(y);
        if (!rx.equals(ry)) return -1.0;
        return weight.get(x) / weight.get(y);
    }
}
\`\`\`

### Offline Query Processing with Union-Find

Sometimes it helps to process queries in reverse order:

\`\`\`
BRICKS FALLING WHEN HIT (LC 803)

Instead of removing bricks (hard), ADD bricks in reverse (easy!).

Forward: Hit brick -> some bricks fall -> hard to compute
Reverse: Add brick -> some bricks attach to ceiling -> union neighbors!

Steps:
1. Remove ALL hit bricks
2. Build initial Union-Find (stable bricks connected to ceiling)
3. Add hit bricks back in REVERSE order
4. Count how many bricks attach with each addition
\`\`\`

### Union-Find with Rollback (Persistent UF)

For problems that need to undo unions (e.g., dynamic connectivity):

\`\`\`java
class RollbackUnionFind {
    int[] parent, rank;
    int count;
    Deque<int[]> history = new ArrayDeque<>();  // [node, oldParent, oldRank]

    RollbackUnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        while (parent[x] != x) x = parent[x];  // No path compression!
        return x;
    }

    void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (rank[rx] < rank[ry]) { int t = rx; rx = ry; ry = t; }
        history.push(new int[]{ry, parent[ry], rank[rx]});
        parent[ry] = rx;
        if (rank[rx] == rank[ry]) rank[rx]++;
        count--;
    }

    void rollback() {
        int[] h = history.pop();
        parent[h[0]] = h[1];
        // Restore rank if needed
        count++;
    }
}
\`\`\`

---

## 📊 Common Patterns Summary

\`\`\`
UNION-FIND PROBLEM PATTERNS

1. BASIC CONNECTIVITY
   - "Are nodes A and B connected?" -> find(A) == find(B)
   - "How many components?" -> track count

2. CYCLE DETECTION
   - Process edges: if find(u) == find(v), adding edge creates cycle
   - First such edge is the "redundant connection"

3. KRUSKAL'S MST
   - Sort edges by weight, union greedily
   - Skip edges that connect same component

4. ACCOUNT/GROUP MERGING
   - Map items to indices, union by shared property
   - Group by root to collect merged sets

5. 2D GRID PROBLEMS
   - Flatten (row,col) to row*cols+col
   - Union adjacent land cells

6. DYNAMIC CONNECTIVITY
   - Process events chronologically
   - Answer: when does count reach 1?

7. WEIGHTED UNION-FIND
   - Track ratio/distance to root
   - Query: weight[a] / weight[b]
\`\`\`

### Interview Tips for Union-Find

\`\`\`
WHAT TO SAY IN INTERVIEWS:

1. "I'll use Union-Find because we need dynamic connectivity
    with multiple queries."

2. "With path compression and union by rank, each operation
    is O(α(n)) which is effectively O(1)."

3. "The total time complexity is O(n × α(n)) for n operations."

4. "I'll start by coding the UnionFind class, then use it to
    solve the main problem."

5. "Union-Find is preferred over BFS/DFS here because
    [edges are added incrementally / we have multiple queries /
    we need cycle detection]."
\`\`\`


---

## 🔧 Union-Find Variants and Edge Cases

### Handling 1-Indexed Problems

Many graph problems use 1-indexed nodes. Adjust your Union-Find accordingly:

\`\`\`java
// For problems with nodes 1..n (1-indexed):
UnionFind uf = new UnionFind(n + 1);  // Size n+1 to handle index n
// Node 0 is unused

// For problems that mix 0-indexed and 1-indexed:
// Always clarify in the interview!
\`\`\`

### Union-Find with Custom Merge Logic

Some problems need to track extra data per component:

\`\`\`java
class UnionFindWithMax {
    int[] parent, rank, maxVal;

    UnionFindWithMax(int n) {
        parent = new int[n];
        rank = new int[n];
        maxVal = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            maxVal[i] = i;  // Track max value in each component
        }
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (rank[rx] < rank[ry]) { int t = rx; rx = ry; ry = t; }
        parent[ry] = rx;
        maxVal[rx] = Math.max(maxVal[rx], maxVal[ry]);  // Merge max
        if (rank[rx] == rank[ry]) rank[rx]++;
    }

    int getMax(int x) {
        return maxVal[find(x)];
    }
}
\`\`\`

### Longest Consecutive Sequence (LC 128)

Union consecutive numbers to find longest chain:

\`\`\`
nums = [100, 4, 200, 1, 3, 2]

Strategy: For each num, if num-1 exists, union them.

Set of all nums: {100, 4, 200, 1, 3, 2}

Process 100: 99 not in set, skip
Process 4: 3 in set → union(4,3)
Process 200: 199 not in set, skip
Process 1: 0 not in set, skip
Process 3: 2 in set → union(3,2)
Process 2: 1 in set → union(2,1)

After unions: {1,2,3,4} size=4, {100} size=1, {200} size=1
Answer: 4
\`\`\`

\`\`\`java
public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    Map<Integer, Integer> map = new HashMap<>();
    WeightedUnionFind uf = new WeightedUnionFind(nums.length);

    for (int i = 0; i < nums.length; i++) {
        if (map.containsKey(nums[i])) continue;  // Skip duplicates
        map.put(nums[i], i);
        if (map.containsKey(nums[i] - 1)) {
            uf.union(i, map.get(nums[i] - 1));
        }
        if (map.containsKey(nums[i] + 1)) {
            uf.union(i, map.get(nums[i] + 1));
        }
    }

    int maxSize = 1;
    for (int i = 0; i < nums.length; i++) {
        maxSize = Math.max(maxSize, uf.getSize(i));
    }
    return maxSize;
}
\`\`\`

### Satisfiability of Equality Equations (LC 990)

\`\`\`
equations = ["a==b", "b!=a"]

Strategy:
1. First pass: process all == equations (union)
2. Second pass: process all != equations (check)

Pass 1: "a==b" → union(a, b)  Now a and b in same set.
Pass 2: "b!=a" → find(b)==find(a)? YES! Contradiction!

Answer: false
\`\`\`

\`\`\`java
public boolean equationsPossible(String[] equations) {
    UnionFind uf = new UnionFind(26);

    // First pass: process equalities
    for (String eq : equations) {
        if (eq.charAt(1) == '=') {
            uf.union(eq.charAt(0) - 'a', eq.charAt(3) - 'a');
        }
    }

    // Second pass: check inequalities
    for (String eq : equations) {
        if (eq.charAt(1) == '!') {
            if (uf.find(eq.charAt(0) - 'a') == uf.find(eq.charAt(3) - 'a')) {
                return false;  // Contradiction!
            }
        }
    }
    return true;
}
\`\`\`

### Making Network Connected (LC 1319)

\`\`\`
n = 6, connections = [[0,1],[0,2],[0,3],[1,2],[1,3]]

After processing all connections:
  Components: {0,1,2,3} {4} {5}
  Component count = 3
  Extra edges (redundant) = total edges - (n - components) = 5 - (6-3) = 2

Need components-1 = 2 cables to connect all components.
We have 2 extra cables. 2 >= 2? Yes!

Answer: 2

If extra edges < components - 1: return -1 (impossible)
\`\`\`

\`\`\`java
public int makeConnected(int n, int[][] connections) {
    if (connections.length < n - 1) return -1;  // Not enough cables

    UnionFind uf = new UnionFind(n);
    for (int[] conn : connections) {
        uf.union(conn[0], conn[1]);
    }
    return uf.getCount() - 1;  // Need this many extra cables
}
\`\`\`


---

## 💡 Advanced Union-Find Techniques

### Union-Find on 2D Grid

Many problems require converting a 2D grid to a 1D Union-Find structure:

\`\`\`
2D to 1D conversion: cell (row, col) -> id = row * numCols + col

Grid 3x4:        1D mapping:
(0,0)(0,1)(0,2)(0,3)    0  1  2  3
(1,0)(1,1)(1,2)(1,3)    4  5  6  7
(2,0)(2,1)(2,2)(2,3)    8  9 10 11

cell(1,2) = 1*4 + 2 = 6
cell(2,3) = 2*4 + 3 = 11
\`\`\`

\`\`\`java
// Number of Islands using Union-Find
public int numIslands(char[][] grid) {
    if (grid.length == 0) return 0;
    int m = grid.length, n = grid[0].length;
    UnionFind uf = new UnionFind(m * n);
    int water = 0;

    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '0') {
                water++;
                continue;
            }
            // Union with right and down neighbors only (avoid double-counting)
            if (j + 1 < n && grid[i][j+1] == '1') {
                uf.union(i*n+j, i*n+j+1);
            }
            if (i + 1 < m && grid[i+1][j] == '1') {
                uf.union(i*n+j, (i+1)*n+j);
            }
        }
    }
    return uf.getCount() - water;
}
\`\`\`

### Time-Based Union-Find

Some problems ask: "At what time are all nodes connected?"
Process events in order, union as you go, check when component count == 1.

\`\`\`
EARLIEST TIME WHEN ALL CONNECTED (LC 1101)

logs = [[0,1,20], [0,2,10], [1,2,5], [2,3,30]]
  (sorted by time)
n = 4 nodes

Process [1,2,5] at t=5:   components: {0} {1,2} {3}  count=3
Process [0,2,10] at t=10:  components: {0,1,2} {3}    count=2
Process [0,1,20] at t=20:  0 and 1 already connected, skip
Process [2,3,30] at t=30:  components: {0,1,2,3}       count=1 DONE!

Answer: t=30
\`\`\`

\`\`\`java
public int earliestAcq(int[][] logs, int n) {
    Arrays.sort(logs, (a, b) -> a[2] - b[2]);  // Sort by time
    UnionFind uf = new UnionFind(n);

    for (int[] log : logs) {
        uf.union(log[0], log[1]);
        if (uf.getCount() == 1) return log[2];  // All connected!
    }
    return -1;  // Never fully connected
}
\`\`\`

### Weighted Union-Find (for Relative Relationships)

Used when relationships between elements have values (e.g., a/b = 2.0):

\`\`\`
EVALUATE DIVISION (LC 399)

equations: [["a","b"],["b","c"]]
values:    [2.0, 3.0]
Means: a/b = 2.0, b/c = 3.0

Build weighted graph:
  a --2.0--> b --3.0--> c
  a <--0.5-- b <--0.33-- c

Query a/c:
  a/c = (a/b) * (b/c) = 2.0 * 3.0 = 6.0

Query b/a:
  b/a = 1/(a/b) = 1/2.0 = 0.5
\`\`\`

\`\`\`java
// Using weighted Union-Find where weight[x] = x / parent[x]
class WeightedUF {
    Map<String, String> parent = new HashMap<>();
    Map<String, Double> weight = new HashMap<>();  // weight[x] = x / root(x)

    String find(String x) {
        if (!parent.containsKey(x)) {
            parent.put(x, x);
            weight.put(x, 1.0);
        }
        if (!parent.get(x).equals(x)) {
            String root = find(parent.get(x));
            weight.put(x, weight.get(x) * weight.get(parent.get(x)));
            parent.put(x, root);
        }
        return parent.get(x);
    }

    void union(String x, String y, double val) {
        // val = x / y
        String rx = find(x), ry = find(y);
        if (rx.equals(ry)) return;
        parent.put(rx, ry);
        // rx/ry = (x/rx_weight) * val * (ry_weight/y) = val * weight[y] / weight[x]
        weight.put(rx, val * weight.get(y) / weight.get(x));
    }

    double query(String x, String y) {
        if (!parent.containsKey(x) || !parent.containsKey(y)) return -1.0;
        String rx = find(x), ry = find(y);
        if (!rx.equals(ry)) return -1.0;
        return weight.get(x) / weight.get(y);
    }
}
\`\`\`

### Offline Query Processing with Union-Find

Sometimes it helps to process queries in reverse order:

\`\`\`
BRICKS FALLING WHEN HIT (LC 803)

Instead of removing bricks (hard), ADD bricks in reverse (easy!).

Forward: Hit brick -> some bricks fall -> hard to compute
Reverse: Add brick -> some bricks attach to ceiling -> union neighbors!

Steps:
1. Remove ALL hit bricks
2. Build initial Union-Find (stable bricks connected to ceiling)
3. Add hit bricks back in REVERSE order
4. Count how many bricks attach with each addition
\`\`\`

### Union-Find with Rollback (Persistent UF)

For problems that need to undo unions (e.g., dynamic connectivity):

\`\`\`java
class RollbackUnionFind {
    int[] parent, rank;
    int count;
    Deque<int[]> history = new ArrayDeque<>();  // [node, oldParent, oldRank]

    RollbackUnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) parent[i] = i;
    }

    int find(int x) {
        while (parent[x] != x) x = parent[x];  // No path compression!
        return x;
    }

    void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (rank[rx] < rank[ry]) { int t = rx; rx = ry; ry = t; }
        history.push(new int[]{ry, parent[ry], rank[rx]});
        parent[ry] = rx;
        if (rank[rx] == rank[ry]) rank[rx]++;
        count--;
    }

    void rollback() {
        int[] h = history.pop();
        parent[h[0]] = h[1];
        // Restore rank if needed
        count++;
    }
}
\`\`\`

---

## 📊 Common Patterns Summary

\`\`\`
UNION-FIND PROBLEM PATTERNS

1. BASIC CONNECTIVITY
   - "Are nodes A and B connected?" -> find(A) == find(B)
   - "How many components?" -> track count

2. CYCLE DETECTION
   - Process edges: if find(u) == find(v), adding edge creates cycle
   - First such edge is the "redundant connection"

3. KRUSKAL'S MST
   - Sort edges by weight, union greedily
   - Skip edges that connect same component

4. ACCOUNT/GROUP MERGING
   - Map items to indices, union by shared property
   - Group by root to collect merged sets

5. 2D GRID PROBLEMS
   - Flatten (row,col) to row*cols+col
   - Union adjacent land cells

6. DYNAMIC CONNECTIVITY
   - Process events chronologically
   - Answer: when does count reach 1?

7. WEIGHTED UNION-FIND
   - Track ratio/distance to root
   - Query: weight[a] / weight[b]
\`\`\`

### Interview Tips for Union-Find

\`\`\`
WHAT TO SAY IN INTERVIEWS:

1. "I'll use Union-Find because we need dynamic connectivity
    with multiple queries."

2. "With path compression and union by rank, each operation
    is O(α(n)) which is effectively O(1)."

3. "The total time complexity is O(n × α(n)) for n operations."

4. "I'll start by coding the UnionFind class, then use it to
    solve the main problem."

5. "Union-Find is preferred over BFS/DFS here because
    [edges are added incrementally / we have multiple queries /
    we need cycle detection]."
\`\`\`


---

## 🔧 Union-Find Variants and Edge Cases

### Handling 1-Indexed Problems

Many graph problems use 1-indexed nodes. Adjust your Union-Find accordingly:

\`\`\`java
// For problems with nodes 1..n (1-indexed):
UnionFind uf = new UnionFind(n + 1);  // Size n+1 to handle index n
// Node 0 is unused

// For problems that mix 0-indexed and 1-indexed:
// Always clarify in the interview!
\`\`\`

### Union-Find with Custom Merge Logic

Some problems need to track extra data per component:

\`\`\`java
class UnionFindWithMax {
    int[] parent, rank, maxVal;

    UnionFindWithMax(int n) {
        parent = new int[n];
        rank = new int[n];
        maxVal = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            maxVal[i] = i;  // Track max value in each component
        }
    }

    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }

    void union(int x, int y) {
        int rx = find(x), ry = find(y);
        if (rx == ry) return;
        if (rank[rx] < rank[ry]) { int t = rx; rx = ry; ry = t; }
        parent[ry] = rx;
        maxVal[rx] = Math.max(maxVal[rx], maxVal[ry]);  // Merge max
        if (rank[rx] == rank[ry]) rank[rx]++;
    }

    int getMax(int x) {
        return maxVal[find(x)];
    }
}
\`\`\`

### Longest Consecutive Sequence (LC 128)

Union consecutive numbers to find longest chain:

\`\`\`
nums = [100, 4, 200, 1, 3, 2]

Strategy: For each num, if num-1 exists, union them.

Set of all nums: {100, 4, 200, 1, 3, 2}

Process 100: 99 not in set, skip
Process 4: 3 in set → union(4,3)
Process 200: 199 not in set, skip
Process 1: 0 not in set, skip
Process 3: 2 in set → union(3,2)
Process 2: 1 in set → union(2,1)

After unions: {1,2,3,4} size=4, {100} size=1, {200} size=1
Answer: 4
\`\`\`

\`\`\`java
public int longestConsecutive(int[] nums) {
    if (nums.length == 0) return 0;
    Map<Integer, Integer> map = new HashMap<>();
    WeightedUnionFind uf = new WeightedUnionFind(nums.length);

    for (int i = 0; i < nums.length; i++) {
        if (map.containsKey(nums[i])) continue;  // Skip duplicates
        map.put(nums[i], i);
        if (map.containsKey(nums[i] - 1)) {
            uf.union(i, map.get(nums[i] - 1));
        }
        if (map.containsKey(nums[i] + 1)) {
            uf.union(i, map.get(nums[i] + 1));
        }
    }

    int maxSize = 1;
    for (int i = 0; i < nums.length; i++) {
        maxSize = Math.max(maxSize, uf.getSize(i));
    }
    return maxSize;
}
\`\`\`

### Satisfiability of Equality Equations (LC 990)

\`\`\`
equations = ["a==b", "b!=a"]

Strategy:
1. First pass: process all == equations (union)
2. Second pass: process all != equations (check)

Pass 1: "a==b" → union(a, b)  Now a and b in same set.
Pass 2: "b!=a" → find(b)==find(a)? YES! Contradiction!

Answer: false
\`\`\`

\`\`\`java
public boolean equationsPossible(String[] equations) {
    UnionFind uf = new UnionFind(26);

    // First pass: process equalities
    for (String eq : equations) {
        if (eq.charAt(1) == '=') {
            uf.union(eq.charAt(0) - 'a', eq.charAt(3) - 'a');
        }
    }

    // Second pass: check inequalities
    for (String eq : equations) {
        if (eq.charAt(1) == '!') {
            if (uf.find(eq.charAt(0) - 'a') == uf.find(eq.charAt(3) - 'a')) {
                return false;  // Contradiction!
            }
        }
    }
    return true;
}
\`\`\`

### Making Network Connected (LC 1319)

\`\`\`
n = 6, connections = [[0,1],[0,2],[0,3],[1,2],[1,3]]

After processing all connections:
  Components: {0,1,2,3} {4} {5}
  Component count = 3
  Extra edges (redundant) = total edges - (n - components) = 5 - (6-3) = 2

Need components-1 = 2 cables to connect all components.
We have 2 extra cables. 2 >= 2? Yes!

Answer: 2

If extra edges < components - 1: return -1 (impossible)
\`\`\`

\`\`\`java
public int makeConnected(int n, int[][] connections) {
    if (connections.length < n - 1) return -1;  // Not enough cables

    UnionFind uf = new UnionFind(n);
    for (int[] conn : connections) {
        uf.union(conn[0], conn[1]);
    }
    return uf.getCount() - 1;  // Need this many extra cables
}
\`\`\`
`,
  },
  {
    slug: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: 'BrainCircuit',
    description: 'Solve optimization problems with memoization and tabulation across all major DP patterns.',
    color: 'violet',
    content: `# Dynamic Programming — Complete Interview Guide

## Table of Contents
- [Core Concepts](#core-concepts)
- [The DP Framework](#the-dp-framework)
- [Visual Deep Dive](#visual-deep-dive)
- [Fibonacci — 4 Ways](#fibonacci--4-ways)
- [Classic DP Problems](#classic-dp-problems)
- [Advanced DP Patterns](#advanced-dp-patterns)
- [Space Optimization](#space-optimization)
- [Complete Java Implementations](#complete-java-implementations)
- [Worked Examples](#worked-examples)
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Practice Problems](#practice-problems)

---

## 🧠 Core Concepts

### What Is Dynamic Programming?

Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking
them into **overlapping subproblems** and storing their solutions to avoid redundant computation.

**Two key properties that make a problem DP-solvable:**
1. **Optimal Substructure**: The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: The same subproblems are solved multiple times

**Why it matters for interviews:**
- DP problems are the #1 most common hard interview topic
- ~20-25% of all LeetCode problems involve DP
- Tests problem decomposition, mathematical thinking, and optimization skills
- Once you see the pattern, many "hard" problems become mechanical

### Two Approaches

\`\`\`
TOP-DOWN (Memoization):                BOTTOM-UP (Tabulation):
────────────────────────                ───────────────────────────
• Start from the main problem        • Start from smallest subproblems
• Recursively solve subproblems      • Iteratively build up to answer
• Cache results in memo table        • Fill table in dependency order
• More intuitive to write            • Usually faster (no recursion overhead)
• Only solves needed subproblems     • Solves ALL subproblems
• Risk of stack overflow             • Easy to optimize space
\`\`\`

---

## 📋 The DP Framework

Every DP problem can be solved with this 5-step framework:

\`\`\`
THE 5-STEP DP FRAMEWORK

Step 1: DEFINE THE STATE
  What information do I need at each decision point?
  dp[i] = ? dp[i][j] = ?
  Example: dp[i] = min coins to make amount i

Step 2: FIND THE RECURRENCE
  How does the current state relate to previous states?
  dp[i] = f(dp[i-1], dp[i-2], ...)
  Example: dp[i] = min(dp[i - coin] + 1) for each coin

Step 3: IDENTIFY BASE CASES
  What are the starting values?
  Example: dp[0] = 0 (0 coins needed for amount 0)

Step 4: DETERMINE FILL ORDER
  In what order should I compute states?
  Example: left to right (dp[1], dp[2], ..., dp[amount])

Step 5: OPTIMIZE SPACE (optional)
  Can I reduce from 2D to 1D? From array to variables?
  Example: If dp[i] only depends on dp[i-1], use two variables
\`\`\`

---

## 🔍 Visual Deep Dive

### Fibonacci — 4 Ways to Solve the Same Problem

**The Problem:** F(n) = F(n-1) + F(n-2), F(0)=0, F(1)=1

#### Way 1: Naive Recursion — O(2^n)

\`\`\`
Call tree for fib(5):
                        fib(5)
                       /      \
                  fib(4)        fib(3)
                 /    \         /    \
            fib(3)   fib(2)  fib(2)  fib(1)
            /  \      / \     / \      |
        fib(2) fib(1) f(1) f(0) f(1) f(0) 1
        / \     |      |    |    |    |
      f(1) f(0) 1      1    0    1    0
       |    |
       1    0

Total calls: 15 (exponential!)
fib(2) computed 3 times, fib(3) computed 2 times
\`\`\`

\`\`\`java
// Way 1: Naive recursion - O(2^n) time, O(n) space
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);  // Redundant computation!
}
\`\`\`

#### Way 2: Memoization (Top-Down) — O(n)

\`\`\`
Call tree with memoization for fib(5):
                        fib(5)
                       /      \
                  fib(4)       fib(3) ← CACHED! return 2
                 /    \
            fib(3)   fib(2) ← CACHED! return 1
            /  \
        fib(2)  fib(1)
        / \       |
      f(1) f(0)   1
       |    |
       1    0

Total calls: 9 (linear!)
Crossed-out calls used cached results
\`\`\`

\`\`\`java
// Way 2: Memoization - O(n) time, O(n) space
int fib(int n, int[] memo) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];  // Return cached result
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}
\`\`\`

#### Way 3: Bottom-Up Tabulation — O(n)

\`\`\`
Build table from left to right:

Index:  0   1   2   3   4   5   6   7
dp:    [0,  1,  1,  2,  3,  5,  8,  13]
              ↑   ↑   ↑   ↑   ↑   ↑
             0+1 1+1 1+2 2+3 3+5 5+8

dp[i] = dp[i-1] + dp[i-2]
\`\`\`

\`\`\`java
// Way 3: Bottom-up tabulation - O(n) time, O(n) space
int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}
\`\`\`

#### Way 4: Space Optimized — O(1) space

\`\`\`
Only need the last two values at any time:

Step 0: prev2=0, prev1=1
Step 2: curr=0+1=1, prev2=1, prev1=1
Step 3: curr=1+1=2, prev2=1, prev1=2
Step 4: curr=1+2=3, prev2=2, prev1=3
Step 5: curr=2+3=5, prev2=3, prev1=5

No array needed! Just two variables.
\`\`\`

\`\`\`java
// Way 4: Space optimized - O(n) time, O(1) space
int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
\`\`\`

---

## 🎯 Classic DP Problems

### Climbing Stairs (LC 70)

**Problem:** You can climb 1 or 2 stairs at a time. How many ways to reach step n?

\`\`\`
State: dp[i] = number of ways to reach stair i
Recurrence: dp[i] = dp[i-1] + dp[i-2]
  (either came from 1 step below or 2 steps below)

Full table:
Stairs:  0   1   2   3   4   5   6
Ways:   [1,  1,  2,  3,  5,  8,  13]

dp[0] = 1  (one way to stay at ground)
dp[1] = 1  (one way: take 1 step)
dp[2] = dp[1] + dp[0] = 1 + 1 = 2   (1+1 or 2)
dp[3] = dp[2] + dp[1] = 2 + 1 = 3   (1+1+1, 1+2, 2+1)
dp[4] = dp[3] + dp[2] = 3 + 2 = 5
dp[5] = dp[4] + dp[3] = 5 + 3 = 8
\`\`\`

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

### 0/1 Knapsack — FULL 2D Table

**Problem:** Given items with weights and values, maximize value within capacity W.

\`\`\`
Items: weight=[2,3,4,5], value=[3,4,5,6], Capacity=5

State: dp[i][w] = max value using first i items with capacity w
Recurrence: dp[i][w] = max(
    dp[i-1][w],                    // Skip item i
    dp[i-1][w-weight[i]] + val[i]  // Take item i (if w >= weight[i])
)

FULL TABLE (arrows show which choice was made):

         Capacity →
         0    1    2    3    4    5
      ┌────┬────┬────┬────┬────┬────┐
  0   │  0 │  0 │  0 │  0 │  0 │  0 │  ← no items
      ├────┼────┼────┼────┼────┼────┤
  1   │  0 │  0 │  3 │  3 │  3 │  3 │  ← item 1 (w=2,v=3)
      ├────┼────┼────┼────┼────┼────┤
  2   │  0 │  0 │  3 │  4 │  4 │  7 │  ← item 2 (w=3,v=4)
      ├────┼────┼────┼────┼────┼────┤
  3   │  0 │  0 │  3 │  4 │  5 │  7 │  ← item 3 (w=4,v=5)
      ├────┼────┼────┼────┼────┼────┤
  4   │  0 │  0 │  3 │  4 │  5 │  7 │  ← item 4 (w=5,v=6)
      └────┴────┴────┴────┴────┴────┘

Key cell: dp[2][5] = max(dp[1][5], dp[1][5-3]+4) = max(3, 3+4) = 7
  Take items 1 and 2: weight=2+3=5, value=3+4=7

Answer: dp[4][5] = 7
\`\`\`

\`\`\`java
public int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w];  // Skip item
            if (w >= weights[i-1]) {
                dp[i][w] = Math.max(dp[i][w],
                    dp[i-1][w - weights[i-1]] + values[i-1]);  // Take item
            }
        }
    }
    return dp[n][capacity];
}
\`\`\`

### Edit Distance (LC 72) — Full Table

**Problem:** Minimum operations (insert, delete, replace) to convert word1 to word2.

\`\`\`
word1 = "horse", word2 = "ros"

State: dp[i][j] = min edits to convert word1[0..i-1] to word2[0..j-1]
Recurrence:
  If word1[i-1] == word2[j-1]: dp[i][j] = dp[i-1][j-1]  (no edit)
  Else: dp[i][j] = 1 + min(
    dp[i-1][j-1],  // Replace
    dp[i-1][j],    // Delete from word1
    dp[i][j-1]     // Insert into word1
  )

FULL TABLE:

        ""    r    o    s
  ""  [  0,   1,   2,   3 ]
  h   [  1,   1,   2,   3 ]  h≠r: 1+min(0,1,1)=1
  o   [  2,   2,   1,   2 ]  o=o: diagonal=1
  r   [  3,   2,   2,   2 ]  r=r: diagonal=2→wait, r≠o..
  s   [  4,   3,   3,   2 ]  s=s: diagonal=2
  e   [  5,   4,   4,   3 ]  e≠s: 1+min(2,3,4)=3

Trace back for answer dp[5][3] = 3:
  horse → rorse (replace h with r)
  rorse → rose  (delete r at index 2)
  rose  → ros   (delete e)
\`\`\`

\`\`\`java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];

    // Base cases
    for (int i = 0; i <= m; i++) dp[i][0] = i;  // Delete all
    for (int j = 0; j <= n; j++) dp[0][j] = j;  // Insert all

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else {
                dp[i][j] = 1 + Math.min(dp[i-1][j-1],
                    Math.min(dp[i-1][j], dp[i][j-1]));
            }
        }
    }
    return dp[m][n];
}
\`\`\`

### Coin Change (LC 322) — Table Fill

**Problem:** Minimum coins to make amount.

\`\`\`
coins = [1, 5, 11], amount = 15

State: dp[i] = min coins to make amount i
Recurrence: dp[i] = min(dp[i - coin] + 1) for each valid coin
Base case: dp[0] = 0

Table fill (INF shown as ∞):
i:    0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15
dp:  [0,  1,  2,  3,  4,  5,  1,  2,  3,  4,  5,  1,  2,  3,  4,  3]

Trace for key values:
dp[0]  = 0                   (base case)
dp[1]  = dp[0]+1 = 1        (use coin 1)
dp[5]  = min(dp[4]+1, dp[0]+1) = min(5, 1) = 1  (use coin 5!)
dp[6]  = min(dp[5]+1, dp[1]+1) = min(2, 2) = 2  (5+1)
dp[10] = min(dp[9]+1, dp[5]+1) = min(5, 2) = 2  (but actually...)
dp[11] = min(dp[10]+1, dp[6]+1, dp[0]+1) = min(6,3,1) = 1  (coin 11!)
dp[15] = min(dp[14]+1, dp[10]+1, dp[4]+1) = min(5,6,5) = ...
         Actually: dp[15] = 3  (5+5+5)

Greedy would give: 11+1+1+1+1 = 5 coins (WRONG!)
DP gives optimal: 5+5+5 = 3 coins ✓
\`\`\`

\`\`\`java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);  // "infinity"
    dp[0] = 0;

    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
\`\`\`

### Longest Increasing Subsequence — O(n log n)

**Problem:** Find the length of the longest strictly increasing subsequence.

\`\`\`
nums = [10, 9, 2, 5, 3, 7, 101, 18]

O(n²) DP approach:
dp[i] = length of LIS ending at index i
dp = [1, 1, 1, 2, 2, 3, 4, 4]

O(n log n) approach using tails array + binary search:
tails[i] = smallest tail element of all increasing subsequences of length i+1

Step 1: num=10  tails = [10]           len=1
Step 2: num=9   tails = [9]            (9 < 10, replace)  len=1
Step 3: num=2   tails = [2]            (2 < 9, replace)   len=1
Step 4: num=5   tails = [2, 5]         (5 > 2, append)    len=2
Step 5: num=3   tails = [2, 3]         (3 replaces 5)     len=2
Step 6: num=7   tails = [2, 3, 7]      (7 > 3, append)    len=3
Step 7: num=101 tails = [2, 3, 7, 101] (101 > 7, append)  len=4
Step 8: num=18  tails = [2, 3, 7, 18]  (18 replaces 101)  len=4

Answer: length = 4  (subsequence: [2, 3, 7, 18] or [2, 3, 7, 101])

Binary search finds WHERE to place each number:
  num=3: binarySearch(tails, 3) in [2, 5] → index 1 (replace 5)
  num=18: binarySearch(tails, 18) in [2,3,7,101] → index 3 (replace 101)
\`\`\`

\`\`\`java
// O(n²) DP
public int lengthOfLIS_DP(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int maxLen = 1;
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    return maxLen;
}

// O(n log n) with binary search
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

---

## 🔄 Advanced DP Patterns

### Space Optimization — 2D to 1D Rolling Array

\`\`\`
0/1 KNAPSACK SPACE OPTIMIZATION

2D table (O(n×W) space):
dp[i][w] depends on dp[i-1][w] and dp[i-1][w-weight[i]]
  ↑ only depends on PREVIOUS ROW!

Key insight: We only need the previous row, not the entire table.

2D → 1D: Use a single array, iterate capacity RIGHT TO LEFT

Why right to left?
  If left to right: dp[w-weight] was already updated this row!
  We\'d be using current row values (like unbounded knapsack)

  Right to left: dp[w-weight] still has previous row\'s value ✓

Before (2D):                After (1D):
for i in 1..n:              for i in 1..n:
  for w in 0..W:              for w in W..weight[i]:  ← reversed!
    dp[i][w] = max(             dp[w] = max(dp[w],
      dp[i-1][w],                 dp[w-weight[i]] + val[i])
      dp[i-1][w-wt[i]]+v[i])
\`\`\`

\`\`\`java
// Space-optimized 0/1 Knapsack - O(W) space
public int knapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        // MUST iterate right to left for 0/1 knapsack
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
\`\`\`

### State Machine DP — Stock Problems

\`\`\`
STOCK BUY/SELL WITH COOLDOWN (LC 309)

States at each day:
  HOLD: Currently holding a stock
  SOLD: Just sold (in cooldown tomorrow)
  REST: Not holding, not in cooldown

State transitions:
  Day i:
  hold[i] = max(hold[i-1],          // Keep holding
                rest[i-1] - price)   // Buy (must be from rest)
  sold[i] = hold[i-1] + price       // Sell
  rest[i] = max(rest[i-1], sold[i-1]) // Wait

Visual for prices = [1, 2, 3, 0, 2]:

Day:    0      1      2      3      4
Price:  1      2      3      0      2

hold:  -1     -1     -1      1      1
sold:  -∞      1      2     -1      3
rest:   0      0      1      2      2

Answer: rest[4] = max(rest, sold) = max(2, 3) = 3
\`\`\`

\`\`\`java
public int maxProfit(int[] prices) {
    int n = prices.length;
    if (n <= 1) return 0;
    int hold = -prices[0], sold = Integer.MIN_VALUE, rest = 0;
    for (int i = 1; i < n; i++) {
        int prevHold = hold, prevSold = sold, prevRest = rest;
        hold = Math.max(prevHold, prevRest - prices[i]);
        sold = prevHold + prices[i];
        rest = Math.max(prevRest, prevSold);
    }
    return Math.max(sold, rest);
}
\`\`\`

### Interval DP — Burst Balloons / Matrix Chain

\`\`\`
INTERVAL DP PATTERN

State: dp[i][j] = optimal answer for subarray from index i to j
Fill order: By interval LENGTH (small to large)

for length = 1 to n:
  for i = 0 to n - length:
    j = i + length - 1
    for k = i to j:    // Try all split points
      dp[i][j] = optimize(dp[i][k] + dp[k+1][j] + cost(i,k,j))

Example: Matrix Chain Multiplication
Matrices: A1(10×20), A2(20×30), A3(30×40)

dp[1][3] = min over k:
  k=1: dp[1][1] + dp[2][3] + 10*20*40 = 0 + 24000 + 8000 = 32000
  k=2: dp[1][2] + dp[3][3] + 10*30*40 = 6000 + 0 + 12000 = 18000

Best: k=2, cost = 18000
\`\`\`

---

## 💻 Complete Java Implementations

### House Robber (LC 198) — Linear DP

\`\`\`java
// Cannot rob two adjacent houses
public int rob(int[] nums) {
    int n = nums.length;
    if (n == 1) return nums[0];

    // dp[i] = max money robbing from house 0 to i
    // dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < n; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

// Trace: nums = [2, 7, 9, 3, 1]
// i=0: prev1=2
// i=1: curr=max(2, 0+7)=7,   prev2=2, prev1=7
// i=2: curr=max(7, 2+9)=11,  prev2=7, prev1=11
// i=3: curr=max(11, 7+3)=11, prev2=11,prev1=11
// i=4: curr=max(11,11+1)=12, prev2=11,prev1=12
// Answer: 12 (rob houses 0, 2, 4: 2+9+1=12)
\`\`\`

### Word Break (LC 139) — String DP

\`\`\`java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> words = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;  // Empty string is breakable

    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && words.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[n];
}

// Trace: s = "leetcode", words = ["leet", "code"]
// dp = [T, F, F, F, T, F, F, F, T]
//       0  1  2  3  4  5  6  7  8
// dp[4]: j=0, dp[0]=T, "leet" in dict → TRUE
// dp[8]: j=4, dp[4]=T, "code" in dict → TRUE
\`\`\`

### Unique Paths (LC 62) — Grid DP

\`\`\`java
public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];

    // First row and column are all 1s
    for (int i = 0; i < m; i++) dp[i][0] = 1;
    for (int j = 0; j < n; j++) dp[0][j] = 1;

    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    return dp[m-1][n-1];
}

// Grid fill for 3×4:
//  1  1  1  1
//  1  2  3  4
//  1  3  6  10  ← Answer: 10
\`\`\`

### Longest Common Subsequence (LC 1143)

\`\`\`java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i-1) == text2.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
            }
        }
    }
    return dp[m][n];
}
\`\`\`

### Partition Equal Subset Sum (LC 416)

\`\`\`java
public boolean canPartition(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    if (total % 2 != 0) return false;

    int target = total / 2;
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

---

## 📝 Worked Examples

### House Robber — Complete Trace

\`\`\`
nums = [2, 7, 9, 3, 1]

Decision at each house: Rob it or skip it?

House 0 (val=2): Rob      Total: 2
House 1 (val=7): Skip 2, take 7? max(2, 0+7)=7  Total: 7
House 2 (val=9): max(7, 2+9)=11                  Total: 11
House 3 (val=3): max(11, 7+3)=11                 Total: 11 (skip!)
House 4 (val=1): max(11, 11+1)=12                Total: 12

Optimal: Rob houses 0, 2, 4 → 2 + 9 + 1 = 12
\`\`\`

### Word Break — Complete Trace

\`\`\`
s = "catsandog", dict = ["cats", "dog", "sand", "and", "cat"]

dp = [T, F, F, T, T, F, F, T, F, F]
      0  1  2  3  4  5  6  7  8  9

dp[3]: j=0, dp[0]=T, "cat" in dict → TRUE
dp[4]: j=0, dp[0]=T, "cats" in dict → TRUE
dp[7]: j=3, dp[3]=T, "sand" in dict → TRUE
       j=4, dp[4]=T, "and" in dict → TRUE
dp[9]: No valid split leads to dp[9]=T

Answer: FALSE ("catsandog" cannot be fully broken)
\`\`\`

### Unique Paths — Grid Fill

\`\`\`
Grid 4×5:

  1    1    1    1    1
  1    2    3    4    5
  1    3    6   10   15
  1    4   10   20   35

Each cell = top + left
Answer: dp[3][4] = 35
\`\`\`

---

## 🎯 Pattern Recognition

\`\`\`
DP PATTERN IDENTIFICATION GUIDE

If you see...                     It\'s probably...
─────────────────────────────────   ──────────────────────────
"Minimum/maximum of..."           Optimization DP
"How many ways to..."             Counting DP
"Is it possible to..."            Boolean DP
"Longest/shortest..."             Sequence DP
Grid traversal                    2D Grid DP
String matching/editing           Two-string DP
"Can you partition into..."       Subset sum variant
Buy/sell with constraints         State machine DP
Choose from both ends             Interval DP
"Using these items to fill..."    Knapsack variant
\`\`\`

### DP Categories Quick Reference

| Category | State | Example Problems |
|---|---|---|
| Linear | dp[i] | House Robber, Climbing Stairs, Max Subarray |
| Two-String | dp[i][j] | Edit Distance, LCS, Regex Match |
| Knapsack | dp[i][w] | 0/1 Knapsack, Coin Change, Partition |
| Grid | dp[i][j] | Unique Paths, Min Path Sum, Dungeon Game |
| Interval | dp[i][j] | Burst Balloons, Matrix Chain, Palindrome |
| State Machine | dp[state] | Stock Problems, Best Time to Buy/Sell |
| Tree | dp on subtree | House Robber III, Binary Tree Cameras |
| Digit | dp[pos][tight] | Count numbers with property |
| Bitmask | dp[mask] | TSP, Assign tasks to workers |

---

## ⚡ Complexity Cheat Sheet

| Problem | Pattern | Time | Space |
|---|---|---|---|
| Fibonacci | Linear | O(n) | O(1) |
| Climbing Stairs | Linear | O(n) | O(1) |
| House Robber | Linear | O(n) | O(1) |
| Coin Change | Linear | O(n×k) | O(n) |
| 0/1 Knapsack | 2D | O(n×W) | O(W) optimized |
| Edit Distance | 2D | O(m×n) | O(n) optimized |
| LCS | 2D | O(m×n) | O(n) optimized |
| LIS | Sequence | O(n log n) | O(n) |
| Unique Paths | Grid | O(m×n) | O(n) |
| Word Break | String | O(n²) | O(n) |
| Decode Ways | Linear | O(n) | O(1) |
| Maximum Subarray | Linear | O(n) | O(1) |
| Palindrome Substrings | Interval | O(n²) | O(n²) |
| Stock Buy/Sell | State Machine | O(n) | O(1) |

---

## 📋 Practice Problems

| Problem | Pattern | Time | Key Insight |
|---|---|---|---|
| 70. Climbing Stairs | Linear | O(n) | Same as Fibonacci |
| 198. House Robber | Linear | O(n) | Rob or skip each house |
| 213. House Robber II | Linear | O(n) | Run twice: skip first or last |
| 322. Coin Change | Linear | O(n×k) | Try all coins at each amount |
| 300. LIS | Sequence | O(n log n) | Patience sorting / binary search |
| 72. Edit Distance | Two-String | O(m×n) | Insert, delete, or replace |
| 1143. LCS | Two-String | O(m×n) | Match or take max of skip |
| 62. Unique Paths | Grid | O(m×n) | Sum of top + left |
| 64. Min Path Sum | Grid | O(m×n) | Min of top + left + current |
| 139. Word Break | String | O(n²) | Check all split points |
| 91. Decode Ways | Linear | O(n) | 1-digit or 2-digit decode |
| 53. Maximum Subarray | Linear | O(n) | Kadane\'s algorithm |
| 5. Longest Palindromic Substring | Interval | O(n²) | Expand from center |
| 309. Best Time with Cooldown | State Machine | O(n) | hold/sold/rest states |
| 416. Partition Equal Subset Sum | Knapsack | O(n×S) | Subset sum = total/2 |
| 494. Target Sum | Knapsack | O(n×S) | Convert to subset sum |
| 312. Burst Balloons | Interval | O(n³) | Think of LAST balloon to burst |
| 10. Regular Expression | Two-String | O(m×n) | Handle . and * cases |
| 97. Interleaving String | Two-String | O(m×n) | s1[i]+s2[j] forms s3[i+j] |
| 1048. Longest String Chain | Sequence | O(n×L²) | Sort by length, DP on predecessors |


---

## 💡 More DP Patterns

### Digit DP

Used for counting numbers with specific properties in a range [1, N].

\`\`\`
COUNT NUMBERS WITH UNIQUE DIGITS (LC 357)

For n=2 (range 0-99):
  1-digit: 9 choices (1-9)
  2-digit: 9 * 9 = 81 (first digit 1-9, second digit 0-9 minus first)
  Plus 0: total = 1 + 9 + 81 = 91
\`\`\`

\`\`\`java
public int countNumbersWithUniqueDigits(int n) {
    if (n == 0) return 1;
    int result = 10;  // n=1: 0-9
    int unique = 9, available = 9;
    for (int i = 2; i <= n && available > 0; i++) {
        unique *= available;
        result += unique;
        available--;
    }
    return result;
}
\`\`\`

### Bitmask DP

Used when state involves subsets of a small set (n ≤ 20).

\`\`\`
TRAVELING SALESMAN PROBLEM (TSP)

State: dp[mask][i] = min cost to visit cities in mask, ending at city i
mask is a bitmask: bit j = 1 means city j visited

For 4 cities (0,1,2,3):
  mask = 0101 means cities 0 and 2 visited
  mask = 1111 means all cities visited

Recurrence:
  dp[mask][i] = min over j in mask where j != i:
    dp[mask ^ (1<<i)][j] + dist[j][i]
\`\`\`

\`\`\`java
public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[1][0] = 0;  // Start at city 0

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (dp[mask][i] == Integer.MAX_VALUE) continue;
            if ((mask & (1 << i)) == 0) continue;
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) != 0) continue;
                int newMask = mask | (1 << j);
                dp[newMask][j] = Math.min(dp[newMask][j],
                    dp[mask][i] + dist[i][j]);
            }
        }
    }

    int allVisited = (1 << n) - 1;
    int result = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        result = Math.min(result, dp[allVisited][i] + dist[i][0]);
    }
    return result;
}
\`\`\`

### Tree DP

DP on tree structures where state depends on subtrees.

\`\`\`
HOUSE ROBBER III (LC 337) - Binary tree version

Each node: [rob_this, skip_this]

If we rob this node:
  value = node.val + skip_left + skip_right
  (can't rob children)

If we skip this node:
  value = max(rob_left, skip_left) + max(rob_right, skip_right)
  (children can be robbed or skipped)
\`\`\`

\`\`\`java
public int rob(TreeNode root) {
    int[] result = robHelper(root);
    return Math.max(result[0], result[1]);
}

int[] robHelper(TreeNode node) {
    if (node == null) return new int[]{0, 0};  // [rob, skip]

    int[] left = robHelper(node.left);
    int[] right = robHelper(node.right);

    int robThis = node.val + left[1] + right[1];
    int skipThis = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    return new int[]{robThis, skipThis};
}
\`\`\`

### Maximum Subarray (Kadane\'s Algorithm)

\`\`\`
KADANE'S ALGORITHM — The simplest DP

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

dp[i] = max subarray sum ENDING at index i
dp[i] = max(nums[i], dp[i-1] + nums[i])
  Either start fresh or extend previous subarray

i=0: dp=-2, max=-2   [-2]
i=1: dp=max(1, -2+1)=1,  max=1    [1]
i=2: dp=max(-3, 1-3)=-2, max=1    [1,-3]? No, [1] better
i=3: dp=max(4, -2+4)=4,  max=4    [4]
i=4: dp=max(-1, 4-1)=3,  max=4    [4,-1]
i=5: dp=max(2, 3+2)=5,   max=5    [4,-1,2]
i=6: dp=max(1, 5+1)=6,   max=6    [4,-1,2,1]  ← ANSWER
i=7: dp=max(-5, 6-5)=1,  max=6    [4,-1,2,1,-5]
i=8: dp=max(4, 1+4)=5,   max=6    [4,-1,2,1,-5,4]

Answer: 6 (subarray [4,-1,2,1])
\`\`\`

\`\`\`java
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], currentSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}
\`\`\`

### Decode Ways (LC 91)

\`\`\`
s = "226"

dp[i] = number of ways to decode s[0..i-1]

dp[0] = 1 (empty string)
dp[1] = 1 ("2" → B)
dp[2]: "2" valid → dp[1]=1
       "22" valid (1-26) → dp[0]=1
       dp[2] = 2  ("2,2" or "22")
dp[3]: "6" valid → dp[2]=2
       "26" valid (1-26) → dp[1]=1
       dp[3] = 3  ("2,2,6", "22,6", "2,26")

Answer: 3
\`\`\`

\`\`\`java
public int numDecodings(String s) {
    if (s.charAt(0) == '0') return 0;
    int n = s.length();
    int prev2 = 1, prev1 = 1;

    for (int i = 1; i < n; i++) {
        int curr = 0;
        if (s.charAt(i) != '0') curr += prev1;
        int twoDigit = Integer.parseInt(s.substring(i-1, i+1));
        if (twoDigit >= 10 && twoDigit <= 26) curr += prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
\`\`\`

### Palindromic Substrings (LC 647)

\`\`\`
EXPAND AROUND CENTER approach:

s = "aab"

Center at 0: "a" ✓       count=1
Center at 0.5: "aa" ✓    count=2
Center at 1: "a" ✓       count=3
Center at 1.5: "ab" ✗
Center at 2: "b" ✓       count=4

Answer: 4 palindromic substrings: "a", "a", "aa", "b"
\`\`\`

\`\`\`java
public int countSubstrings(String s) {
    int count = 0;
    for (int center = 0; center < 2 * s.length() - 1; center++) {
        int left = center / 2;
        int right = left + center % 2;
        while (left >= 0 && right < s.length()
               && s.charAt(left) == s.charAt(right)) {
            count++;
            left--;
            right++;
        }
    }
    return count;
}
\`\`\`

---

## 💡 DP Debugging Strategies

\`\`\`
COMMON DP MISTAKES AND FIXES

1. Wrong base case
   → Always verify: what happens with empty input? Single element?

2. Wrong fill order
   → Draw dependency arrows: dp[i] depends on dp[?]
   → Fill in topological order of dependencies

3. Off-by-one in indices
   → Use 1-indexed dp array (size n+1) to simplify

4. Space optimization breaks correctness
   → Test 2D version first, then optimize

5. Not considering all transitions
   → List ALL choices at each state explicitly
   → Make sure recurrence handles every case

6. Integer overflow
   → Use long or modular arithmetic when values can be huge
\`\`\`

### Interview Strategy for DP Problems

\`\`\`
STEP-BY-STEP APPROACH IN INTERVIEWS

1. RECOGNIZE it's DP:
   "Minimum/maximum", "how many ways", "is it possible"
   + optimal substructure + overlapping subproblems

2. DEFINE state clearly:
   "dp[i] represents the [minimum cost / number of ways / ...]
    to [reach state i / process first i elements / ...]"

3. WRITE recurrence:
   "dp[i] = [some function of previous dp values]"

4. IDENTIFY base cases:
   "dp[0] = ..., dp[1] = ..."

5. CODE bottom-up (preferred in interviews):
   Easier to analyze time/space complexity

6. TRACE through example:
   Walk through 3-4 values to verify correctness

7. OPTIMIZE space if asked:
   2D → 1D rolling array, or just variables
\`\`\`

---

## 📊 Additional Pattern Examples

### Minimum Path Sum (LC 64) — Grid DP Trace

\`\`\`
grid:
  [1, 3, 1]
  [1, 5, 1]
  [4, 2, 1]

dp:
  [1,  4,  5]
  [2,  7,  6]
  [6,  8,  7]  ← Answer: 7

Path: 1 → 3 → 1 → 1 → 1 = 7
\`\`\`

\`\`\`java
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) continue;
            else if (i == 0) grid[i][j] += grid[i][j-1];
            else if (j == 0) grid[i][j] += grid[i-1][j];
            else grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
        }
    }
    return grid[m-1][n-1];
}
\`\`\`

### Target Sum (LC 494) — Subset Sum Variant

\`\`\`
nums = [1, 1, 1, 1, 1], target = 3

Convert: find subset P where sum(P) = (target + total) / 2 = (3+5)/2 = 4

dp (subset sum for target 4):
dp = [1, 0, 0, 0, 0]

After num=1: dp = [1, 1, 0, 0, 0]
After num=1: dp = [1, 2, 1, 0, 0]
After num=1: dp = [1, 3, 3, 1, 0]
After num=1: dp = [1, 4, 6, 4, 1]
After num=1: dp = [1, 5, 10, 10, 5]

Answer: dp[4] = 5 ways
\`\`\`


---

## 💡 More Classic DP Problems

### Longest Palindromic Substring (LC 5)

\`\`\`
s = "babad"

Expand around center approach:
Center 0 ("b"): "b" → len=1
Center 0.5 ("ba"): no match
Center 1 ("a"): "bab" → len=3 ←
Center 1.5 ("ab"): no match
Center 2 ("b"): "aba" → len=3
Center 2.5 ("ba"): no match
Center 3 ("a"): "a" → len=1
Center 3.5 ("ad"): no match
Center 4 ("d"): "d" → len=1

Answer: "bab" or "aba" (length 3)
\`\`\`

\`\`\`java
public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(s, i, i);      // Odd length
        int len2 = expand(s, i, i + 1);  // Even length
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    return s.substring(start, start + maxLen);
}

int expand(String s, int left, int right) {
    while (left >= 0 && right < s.length()
           && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}
\`\`\`

### Regular Expression Matching (LC 10)

\`\`\`
s = "aab", p = "c*a*b"

State: dp[i][j] = does s[0..i-1] match p[0..j-1]?

Table:
         ""    c    *    a    *    b
  ""   [  T,   F,   T,   F,   T,   F ]
  a    [  F,   F,   F,   T,   T,   F ]
  a    [  F,   F,   F,   F,   T,   F ]
  b    [  F,   F,   F,   F,   F,   T ]

Key transitions:
  '*' means 0 or more of preceding:
    0 occurrences: dp[i][j] = dp[i][j-2]
    1+ occurrences: dp[i][j] = dp[i-1][j] if s[i-1] matches p[j-2]

Answer: dp[3][5] = true
\`\`\`

\`\`\`java
public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;

    // Handle patterns like a*, a*b*, a*b*c*
    for (int j = 1; j <= n; j++) {
        if (p.charAt(j - 1) == '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j-1) == '.' || p.charAt(j-1) == s.charAt(i-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else if (p.charAt(j-1) == '*') {
                dp[i][j] = dp[i][j-2];  // 0 occurrences
                if (p.charAt(j-2) == '.' || p.charAt(j-2) == s.charAt(i-1)) {
                    dp[i][j] = dp[i][j] || dp[i-1][j];  // 1+ occurrences
                }
            }
        }
    }
    return dp[m][n];
}
\`\`\`

### Interleaving String (LC 97)

\`\`\`
s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"

dp[i][j] = can s1[0..i-1] and s2[0..j-1] interleave to form s3[0..i+j-1]?

        ""   d    b    b    c    a
  ""  [  T,   F,   F,   F,   F,   F ]
  a   [  T,   F,   F,   F,   F,   F ]
  a   [  T,   T,   T,   T,   T,   F ]
  b   [  F,   T,   T,   F,   T,   F ]
  c   [  F,   F,   T,   T,   T,   T ]
  c   [  F,   F,   F,   T,   F,   T ]

Answer: dp[5][5] = true
\`\`\`

### Burst Balloons (LC 312) — Interval DP

\`\`\`
nums = [3, 1, 5, 8]  (with virtual 1s at boundaries: [1, 3, 1, 5, 8, 1])

State: dp[i][j] = max coins from bursting balloons between i and j (exclusive)

Key insight: Think of the LAST balloon to burst, not the first!

If k is last burst between i and j:
  dp[i][j] = max over k in (i+1..j-1):
    dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]

Fill by interval length:
  Length 2: dp[0][2] = 1*3*1 = 3, dp[1][3] = 3*1*5 = 15, ...
  Length 3: dp[0][3] = max(dp[0][1]+dp[1][3]+1*3*5,
                           dp[0][2]+dp[2][3]+1*1*5) = max(15+15, 3+5+5)
  ...
  Answer: dp[0][5] = 167
\`\`\`

\`\`\`java
public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] extended = new int[n + 2];
    extended[0] = extended[n + 1] = 1;
    for (int i = 0; i < n; i++) extended[i + 1] = nums[i];

    int[][] dp = new int[n + 2][n + 2];
    for (int len = 2; len <= n + 1; len++) {
        for (int i = 0; i + len <= n + 1; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = Math.max(dp[i][j],
                    dp[i][k] + dp[k][j] + extended[i] * extended[k] * extended[j]);
            }
        }
    }
    return dp[0][n + 1];
}
\`\`\`

### Best Time to Buy and Sell Stock with K Transactions (LC 188)

\`\`\`
State: dp[k][i] = max profit with at most k transactions on day i

Recurrence:
  dp[k][i] = max(
    dp[k][i-1],              // Don't transact on day i
    max over j<i: (prices[i] - prices[j] + dp[k-1][j])  // Sell on day i
  )

Optimization: Track maxDiff = max(dp[k-1][j] - prices[j]) as we scan

For k=2, prices = [3,2,6,5,0,3]:
  k=1: dp = [0, 0, 4, 4, 4, 4]   (buy@2, sell@6)
  k=2: dp = [0, 0, 4, 4, 4, 7]   (buy@2,sell@6, buy@0,sell@3)

Answer: 7
\`\`\`

\`\`\`java
public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (n <= 1) return 0;

    // If k >= n/2, it's unlimited transactions
    if (k >= n / 2) {
        int profit = 0;
        for (int i = 1; i < n; i++) {
            if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];
        }
        return profit;
    }

    int[][] dp = new int[k + 1][n];
    for (int t = 1; t <= k; t++) {
        int maxDiff = -prices[0];
        for (int i = 1; i < n; i++) {
            dp[t][i] = Math.max(dp[t][i-1], prices[i] + maxDiff);
            maxDiff = Math.max(maxDiff, dp[t-1][i] - prices[i]);
        }
    }
    return dp[k][n - 1];
}
\`\`\`

### Distinct Subsequences (LC 115)

\`\`\`
s = "rabbbit", t = "rabbit"

dp[i][j] = number of ways t[0..j-1] appears as subsequence of s[0..i-1]

If s[i-1] == t[j-1]:
  dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
  (use this char OR skip it)
Else:
  dp[i][j] = dp[i-1][j]
  (must skip this char)

Answer: 3 (the three b\'s give 3 ways to form "rabbit")
\`\`\`

### Minimum Cost to Cut a Stick (LC 1547)

\`\`\`java
public int minCost(int n, int[] cuts) {
    Arrays.sort(cuts);
    int m = cuts.length;
    int[] c = new int[m + 2];
    c[0] = 0;
    c[m + 1] = n;
    System.arraycopy(cuts, 0, c, 1, m);

    int[][] dp = new int[m + 2][m + 2];
    for (int len = 2; len <= m + 1; len++) {
        for (int i = 0; i + len <= m + 1; i++) {
            int j = i + len;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = Math.min(dp[i][j],
                    dp[i][k] + dp[k][j] + c[j] - c[i]);
            }
        }
    }
    return dp[0][m + 1];
}
\`\`\`

---

## 🎯 More Pattern Examples

### Unbounded Knapsack (Coin Change variant)

\`\`\`
DIFFERENCE FROM 0/1 KNAPSACK:

0/1 Knapsack: Each item used at most once
  → Iterate capacity RIGHT TO LEFT

Unbounded: Each item can be used unlimited times
  → Iterate capacity LEFT TO RIGHT

for item in items:
    for w in weight[item]..W:          // Left to right!
        dp[w] = max(dp[w], dp[w-weight] + value)
\`\`\`

### DP on Strings: Two-String Template

\`\`\`
For problems involving TWO strings (edit distance, LCS, etc.):

State: dp[i][j] = answer for s1[0..i-1] and s2[0..j-1]

Base cases:
  dp[0][j] = answer when s1 is empty
  dp[i][0] = answer when s2 is empty

Recurrence (usually):
  If s1[i-1] == s2[j-1]:
    dp[i][j] = f(dp[i-1][j-1])     // Characters match
  Else:
    dp[i][j] = g(dp[i-1][j-1],     // Replace/Match
                  dp[i-1][j],       // Delete from s1
                  dp[i][j-1])       // Insert into s1

Space optimization: Use 1D array with prev variable for diagonal
\`\`\`

### Common DP State Definitions

\`\`\`
CHOOSING THE RIGHT STATE

Problem              State                What it represents
──────────────────── ──────────────── ──────────────────────
House Robber         dp[i]              Max money from houses 0..i
Coin Change          dp[amount]         Min coins for this amount
Knapsack             dp[i][w]           Max value, i items, cap w
Edit Distance        dp[i][j]           Min edits, s1[:i]→s2[:j]
LIS                  dp[i]              LIS length ending at i
Grid paths           dp[i][j]           Ways/cost to reach (i,j)
Stock (cooldown)     hold/sold/rest     Max profit in each state
Palindrome           dp[i][j]           Is s[i..j] palindrome?
String partition     dp[i]              Can s[0..i] be partitioned?
Egg drop             dp[k][n]           Min moves, k eggs, n floors
\`\`\`


---

## 💡 More DP Patterns

### Digit DP

Used for counting numbers with specific properties in a range [1, N].

\`\`\`
COUNT NUMBERS WITH UNIQUE DIGITS (LC 357)

For n=2 (range 0-99):
  1-digit: 9 choices (1-9)
  2-digit: 9 * 9 = 81 (first digit 1-9, second digit 0-9 minus first)
  Plus 0: total = 1 + 9 + 81 = 91
\`\`\`

\`\`\`java
public int countNumbersWithUniqueDigits(int n) {
    if (n == 0) return 1;
    int result = 10;  // n=1: 0-9
    int unique = 9, available = 9;
    for (int i = 2; i <= n && available > 0; i++) {
        unique *= available;
        result += unique;
        available--;
    }
    return result;
}
\`\`\`

### Bitmask DP

Used when state involves subsets of a small set (n ≤ 20).

\`\`\`
TRAVELING SALESMAN PROBLEM (TSP)

State: dp[mask][i] = min cost to visit cities in mask, ending at city i
mask is a bitmask: bit j = 1 means city j visited

For 4 cities (0,1,2,3):
  mask = 0101 means cities 0 and 2 visited
  mask = 1111 means all cities visited

Recurrence:
  dp[mask][i] = min over j in mask where j != i:
    dp[mask ^ (1<<i)][j] + dist[j][i]
\`\`\`

\`\`\`java
public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[1][0] = 0;  // Start at city 0

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int i = 0; i < n; i++) {
            if (dp[mask][i] == Integer.MAX_VALUE) continue;
            if ((mask & (1 << i)) == 0) continue;
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) != 0) continue;
                int newMask = mask | (1 << j);
                dp[newMask][j] = Math.min(dp[newMask][j],
                    dp[mask][i] + dist[i][j]);
            }
        }
    }

    int allVisited = (1 << n) - 1;
    int result = Integer.MAX_VALUE;
    for (int i = 0; i < n; i++) {
        result = Math.min(result, dp[allVisited][i] + dist[i][0]);
    }
    return result;
}
\`\`\`

### Tree DP

DP on tree structures where state depends on subtrees.

\`\`\`
HOUSE ROBBER III (LC 337) - Binary tree version

Each node: [rob_this, skip_this]

If we rob this node:
  value = node.val + skip_left + skip_right
  (can't rob children)

If we skip this node:
  value = max(rob_left, skip_left) + max(rob_right, skip_right)
  (children can be robbed or skipped)
\`\`\`

\`\`\`java
public int rob(TreeNode root) {
    int[] result = robHelper(root);
    return Math.max(result[0], result[1]);
}

int[] robHelper(TreeNode node) {
    if (node == null) return new int[]{0, 0};  // [rob, skip]

    int[] left = robHelper(node.left);
    int[] right = robHelper(node.right);

    int robThis = node.val + left[1] + right[1];
    int skipThis = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

    return new int[]{robThis, skipThis};
}
\`\`\`

### Maximum Subarray (Kadane\'s Algorithm)

\`\`\`
KADANE'S ALGORITHM — The simplest DP

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

dp[i] = max subarray sum ENDING at index i
dp[i] = max(nums[i], dp[i-1] + nums[i])
  Either start fresh or extend previous subarray

i=0: dp=-2, max=-2   [-2]
i=1: dp=max(1, -2+1)=1,  max=1    [1]
i=2: dp=max(-3, 1-3)=-2, max=1    [1,-3]? No, [1] better
i=3: dp=max(4, -2+4)=4,  max=4    [4]
i=4: dp=max(-1, 4-1)=3,  max=4    [4,-1]
i=5: dp=max(2, 3+2)=5,   max=5    [4,-1,2]
i=6: dp=max(1, 5+1)=6,   max=6    [4,-1,2,1]  ← ANSWER
i=7: dp=max(-5, 6-5)=1,  max=6    [4,-1,2,1,-5]
i=8: dp=max(4, 1+4)=5,   max=6    [4,-1,2,1,-5,4]

Answer: 6 (subarray [4,-1,2,1])
\`\`\`

\`\`\`java
public int maxSubArray(int[] nums) {
    int maxSum = nums[0], currentSum = nums[0];
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    return maxSum;
}
\`\`\`

### Decode Ways (LC 91)

\`\`\`
s = "226"

dp[i] = number of ways to decode s[0..i-1]

dp[0] = 1 (empty string)
dp[1] = 1 ("2" → B)
dp[2]: "2" valid → dp[1]=1
       "22" valid (1-26) → dp[0]=1
       dp[2] = 2  ("2,2" or "22")
dp[3]: "6" valid → dp[2]=2
       "26" valid (1-26) → dp[1]=1
       dp[3] = 3  ("2,2,6", "22,6", "2,26")

Answer: 3
\`\`\`

\`\`\`java
public int numDecodings(String s) {
    if (s.charAt(0) == '0') return 0;
    int n = s.length();
    int prev2 = 1, prev1 = 1;

    for (int i = 1; i < n; i++) {
        int curr = 0;
        if (s.charAt(i) != '0') curr += prev1;
        int twoDigit = Integer.parseInt(s.substring(i-1, i+1));
        if (twoDigit >= 10 && twoDigit <= 26) curr += prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
\`\`\`

### Palindromic Substrings (LC 647)

\`\`\`
EXPAND AROUND CENTER approach:

s = "aab"

Center at 0: "a" ✓       count=1
Center at 0.5: "aa" ✓    count=2
Center at 1: "a" ✓       count=3
Center at 1.5: "ab" ✗
Center at 2: "b" ✓       count=4

Answer: 4 palindromic substrings: "a", "a", "aa", "b"
\`\`\`

\`\`\`java
public int countSubstrings(String s) {
    int count = 0;
    for (int center = 0; center < 2 * s.length() - 1; center++) {
        int left = center / 2;
        int right = left + center % 2;
        while (left >= 0 && right < s.length()
               && s.charAt(left) == s.charAt(right)) {
            count++;
            left--;
            right++;
        }
    }
    return count;
}
\`\`\`

---

## 💡 DP Debugging Strategies

\`\`\`
COMMON DP MISTAKES AND FIXES

1. Wrong base case
   → Always verify: what happens with empty input? Single element?

2. Wrong fill order
   → Draw dependency arrows: dp[i] depends on dp[?]
   → Fill in topological order of dependencies

3. Off-by-one in indices
   → Use 1-indexed dp array (size n+1) to simplify

4. Space optimization breaks correctness
   → Test 2D version first, then optimize

5. Not considering all transitions
   → List ALL choices at each state explicitly
   → Make sure recurrence handles every case

6. Integer overflow
   → Use long or modular arithmetic when values can be huge
\`\`\`

### Interview Strategy for DP Problems

\`\`\`
STEP-BY-STEP APPROACH IN INTERVIEWS

1. RECOGNIZE it's DP:
   "Minimum/maximum", "how many ways", "is it possible"
   + optimal substructure + overlapping subproblems

2. DEFINE state clearly:
   "dp[i] represents the [minimum cost / number of ways / ...]
    to [reach state i / process first i elements / ...]"

3. WRITE recurrence:
   "dp[i] = [some function of previous dp values]"

4. IDENTIFY base cases:
   "dp[0] = ..., dp[1] = ..."

5. CODE bottom-up (preferred in interviews):
   Easier to analyze time/space complexity

6. TRACE through example:
   Walk through 3-4 values to verify correctness

7. OPTIMIZE space if asked:
   2D → 1D rolling array, or just variables
\`\`\`

---

## 📊 Additional Pattern Examples

### Minimum Path Sum (LC 64) — Grid DP Trace

\`\`\`
grid:
  [1, 3, 1]
  [1, 5, 1]
  [4, 2, 1]

dp:
  [1,  4,  5]
  [2,  7,  6]
  [6,  8,  7]  ← Answer: 7

Path: 1 → 3 → 1 → 1 → 1 = 7
\`\`\`

\`\`\`java
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) continue;
            else if (i == 0) grid[i][j] += grid[i][j-1];
            else if (j == 0) grid[i][j] += grid[i-1][j];
            else grid[i][j] += Math.min(grid[i-1][j], grid[i][j-1]);
        }
    }
    return grid[m-1][n-1];
}
\`\`\`

### Target Sum (LC 494) — Subset Sum Variant

\`\`\`
nums = [1, 1, 1, 1, 1], target = 3

Convert: find subset P where sum(P) = (target + total) / 2 = (3+5)/2 = 4

dp (subset sum for target 4):
dp = [1, 0, 0, 0, 0]

After num=1: dp = [1, 1, 0, 0, 0]
After num=1: dp = [1, 2, 1, 0, 0]
After num=1: dp = [1, 3, 3, 1, 0]
After num=1: dp = [1, 4, 6, 4, 1]
After num=1: dp = [1, 5, 10, 10, 5]

Answer: dp[4] = 5 ways
\`\`\`


---

## 💡 More Classic DP Problems

### Longest Palindromic Substring (LC 5)

\`\`\`
s = "babad"

Expand around center approach:
Center 0 ("b"): "b" → len=1
Center 0.5 ("ba"): no match
Center 1 ("a"): "bab" → len=3 ←
Center 1.5 ("ab"): no match
Center 2 ("b"): "aba" → len=3
Center 2.5 ("ba"): no match
Center 3 ("a"): "a" → len=1
Center 3.5 ("ad"): no match
Center 4 ("d"): "d" → len=1

Answer: "bab" or "aba" (length 3)
\`\`\`

\`\`\`java
public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(s, i, i);      // Odd length
        int len2 = expand(s, i, i + 1);  // Even length
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    return s.substring(start, start + maxLen);
}

int expand(String s, int left, int right) {
    while (left >= 0 && right < s.length()
           && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}
\`\`\`

### Regular Expression Matching (LC 10)

\`\`\`
s = "aab", p = "c*a*b"

State: dp[i][j] = does s[0..i-1] match p[0..j-1]?

Table:
         ""    c    *    a    *    b
  ""   [  T,   F,   T,   F,   T,   F ]
  a    [  F,   F,   F,   T,   T,   F ]
  a    [  F,   F,   F,   F,   T,   F ]
  b    [  F,   F,   F,   F,   F,   T ]

Key transitions:
  '*' means 0 or more of preceding:
    0 occurrences: dp[i][j] = dp[i][j-2]
    1+ occurrences: dp[i][j] = dp[i-1][j] if s[i-1] matches p[j-2]

Answer: dp[3][5] = true
\`\`\`

\`\`\`java
public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;

    // Handle patterns like a*, a*b*, a*b*c*
    for (int j = 1; j <= n; j++) {
        if (p.charAt(j - 1) == '*') {
            dp[0][j] = dp[0][j - 2];
        }
    }

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j-1) == '.' || p.charAt(j-1) == s.charAt(i-1)) {
                dp[i][j] = dp[i-1][j-1];
            } else if (p.charAt(j-1) == '*') {
                dp[i][j] = dp[i][j-2];  // 0 occurrences
                if (p.charAt(j-2) == '.' || p.charAt(j-2) == s.charAt(i-1)) {
                    dp[i][j] = dp[i][j] || dp[i-1][j];  // 1+ occurrences
                }
            }
        }
    }
    return dp[m][n];
}
\`\`\`

### Interleaving String (LC 97)

\`\`\`
s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"

dp[i][j] = can s1[0..i-1] and s2[0..j-1] interleave to form s3[0..i+j-1]?

        ""   d    b    b    c    a
  ""  [  T,   F,   F,   F,   F,   F ]
  a   [  T,   F,   F,   F,   F,   F ]
  a   [  T,   T,   T,   T,   T,   F ]
  b   [  F,   T,   T,   F,   T,   F ]
  c   [  F,   F,   T,   T,   T,   T ]
  c   [  F,   F,   F,   T,   F,   T ]

Answer: dp[5][5] = true
\`\`\`

### Burst Balloons (LC 312) — Interval DP

\`\`\`
nums = [3, 1, 5, 8]  (with virtual 1s at boundaries: [1, 3, 1, 5, 8, 1])

State: dp[i][j] = max coins from bursting balloons between i and j (exclusive)

Key insight: Think of the LAST balloon to burst, not the first!

If k is last burst between i and j:
  dp[i][j] = max over k in (i+1..j-1):
    dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]

Fill by interval length:
  Length 2: dp[0][2] = 1*3*1 = 3, dp[1][3] = 3*1*5 = 15, ...
  Length 3: dp[0][3] = max(dp[0][1]+dp[1][3]+1*3*5,
                           dp[0][2]+dp[2][3]+1*1*5) = max(15+15, 3+5+5)
  ...
  Answer: dp[0][5] = 167
\`\`\`

\`\`\`java
public int maxCoins(int[] nums) {
    int n = nums.length;
    int[] extended = new int[n + 2];
    extended[0] = extended[n + 1] = 1;
    for (int i = 0; i < n; i++) extended[i + 1] = nums[i];

    int[][] dp = new int[n + 2][n + 2];
    for (int len = 2; len <= n + 1; len++) {
        for (int i = 0; i + len <= n + 1; i++) {
            int j = i + len;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = Math.max(dp[i][j],
                    dp[i][k] + dp[k][j] + extended[i] * extended[k] * extended[j]);
            }
        }
    }
    return dp[0][n + 1];
}
\`\`\`

### Best Time to Buy and Sell Stock with K Transactions (LC 188)

\`\`\`
State: dp[k][i] = max profit with at most k transactions on day i

Recurrence:
  dp[k][i] = max(
    dp[k][i-1],              // Don't transact on day i
    max over j<i: (prices[i] - prices[j] + dp[k-1][j])  // Sell on day i
  )

Optimization: Track maxDiff = max(dp[k-1][j] - prices[j]) as we scan

For k=2, prices = [3,2,6,5,0,3]:
  k=1: dp = [0, 0, 4, 4, 4, 4]   (buy@2, sell@6)
  k=2: dp = [0, 0, 4, 4, 4, 7]   (buy@2,sell@6, buy@0,sell@3)

Answer: 7
\`\`\`

\`\`\`java
public int maxProfit(int k, int[] prices) {
    int n = prices.length;
    if (n <= 1) return 0;

    // If k >= n/2, it's unlimited transactions
    if (k >= n / 2) {
        int profit = 0;
        for (int i = 1; i < n; i++) {
            if (prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];
        }
        return profit;
    }

    int[][] dp = new int[k + 1][n];
    for (int t = 1; t <= k; t++) {
        int maxDiff = -prices[0];
        for (int i = 1; i < n; i++) {
            dp[t][i] = Math.max(dp[t][i-1], prices[i] + maxDiff);
            maxDiff = Math.max(maxDiff, dp[t-1][i] - prices[i]);
        }
    }
    return dp[k][n - 1];
}
\`\`\`

### Distinct Subsequences (LC 115)

\`\`\`
s = "rabbbit", t = "rabbit"

dp[i][j] = number of ways t[0..j-1] appears as subsequence of s[0..i-1]

If s[i-1] == t[j-1]:
  dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
  (use this char OR skip it)
Else:
  dp[i][j] = dp[i-1][j]
  (must skip this char)

Answer: 3 (the three b\'s give 3 ways to form "rabbit")
\`\`\`

### Minimum Cost to Cut a Stick (LC 1547)

\`\`\`java
public int minCost(int n, int[] cuts) {
    Arrays.sort(cuts);
    int m = cuts.length;
    int[] c = new int[m + 2];
    c[0] = 0;
    c[m + 1] = n;
    System.arraycopy(cuts, 0, c, 1, m);

    int[][] dp = new int[m + 2][m + 2];
    for (int len = 2; len <= m + 1; len++) {
        for (int i = 0; i + len <= m + 1; i++) {
            int j = i + len;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i + 1; k < j; k++) {
                dp[i][j] = Math.min(dp[i][j],
                    dp[i][k] + dp[k][j] + c[j] - c[i]);
            }
        }
    }
    return dp[0][m + 1];
}
\`\`\`

---

## 🎯 More Pattern Examples

### Unbounded Knapsack (Coin Change variant)

\`\`\`
DIFFERENCE FROM 0/1 KNAPSACK:

0/1 Knapsack: Each item used at most once
  → Iterate capacity RIGHT TO LEFT

Unbounded: Each item can be used unlimited times
  → Iterate capacity LEFT TO RIGHT

for item in items:
    for w in weight[item]..W:          // Left to right!
        dp[w] = max(dp[w], dp[w-weight] + value)
\`\`\`

### DP on Strings: Two-String Template

\`\`\`
For problems involving TWO strings (edit distance, LCS, etc.):

State: dp[i][j] = answer for s1[0..i-1] and s2[0..j-1]

Base cases:
  dp[0][j] = answer when s1 is empty
  dp[i][0] = answer when s2 is empty

Recurrence (usually):
  If s1[i-1] == s2[j-1]:
    dp[i][j] = f(dp[i-1][j-1])     // Characters match
  Else:
    dp[i][j] = g(dp[i-1][j-1],     // Replace/Match
                  dp[i-1][j],       // Delete from s1
                  dp[i][j-1])       // Insert into s1

Space optimization: Use 1D array with prev variable for diagonal
\`\`\`

### Common DP State Definitions

\`\`\`
CHOOSING THE RIGHT STATE

Problem              State                What it represents
──────────────────── ──────────────── ──────────────────────
House Robber         dp[i]              Max money from houses 0..i
Coin Change          dp[amount]         Min coins for this amount
Knapsack             dp[i][w]           Max value, i items, cap w
Edit Distance        dp[i][j]           Min edits, s1[:i]→s2[:j]
LIS                  dp[i]              LIS length ending at i
Grid paths           dp[i][j]           Ways/cost to reach (i,j)
Stock (cooldown)     hold/sold/rest     Max profit in each state
Palindrome           dp[i][j]           Is s[i..j] palindrome?
String partition     dp[i]              Can s[0..i] be partitioned?
Egg drop             dp[k][n]           Min moves, k eggs, n floors
\`\`\`


---

## 💡 Even More DP Patterns

### Egg Drop Problem (LC 887)

\`\`\`
SUPER EGG DROP

State: dp[k][n] = min moves with k eggs and n floors
Recurrence: For floor x (1..n):
  If egg breaks: dp[k-1][x-1]  (below x, one fewer egg)
  If survives: dp[k][n-x]      (above x, same eggs)
  dp[k][n] = 1 + min over x: max(dp[k-1][x-1], dp[k][n-x])

Optimized approach (reverse thinking):
  dp[m][k] = max floors checkable with m moves, k eggs
  dp[m][k] = dp[m-1][k-1] + dp[m-1][k] + 1
    (floors below + floors above + current floor)

  For k=2:
  m=1: dp[1][2] = 1   (can check 1 floor)
  m=2: dp[2][2] = 3   (check 1+1+1 floors)
  m=3: dp[3][2] = 6   (check 3+2+1)
  m=4: dp[4][2] = 10  (check 6+3+1)

  For 100 floors, 2 eggs: need 14 moves
\`\`\`

\`\`\`java
public int superEggDrop(int k, int n) {
    // dp[m][k] = max floors with m moves and k eggs
    int[][] dp = new int[n + 1][k + 1];
    int m = 0;
    while (dp[m][k] < n) {
        m++;
        for (int j = 1; j <= k; j++) {
            dp[m][j] = dp[m-1][j-1] + dp[m-1][j] + 1;
        }
    }
    return m;
}
\`\`\`

### Jump Game Series

\`\`\`
JUMP GAME (LC 55): Can you reach the last index?

nums = [2, 3, 1, 1, 4]

Greedy approach (track maxReach):
  i=0: maxReach = max(0, 0+2) = 2
  i=1: maxReach = max(2, 1+3) = 4  >= last index (4)!

Answer: true

JUMP GAME II (LC 45): Minimum jumps to reach end.

nums = [2, 3, 1, 1, 4]

BFS-like approach:
  Jump 0: at index 0,     can reach [1,2]
  Jump 1: at indices 1-2, can reach [2,3,4]  -> reached end!

Answer: 2 jumps
\`\`\`

\`\`\`java
// Jump Game - Greedy O(n)
public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        if (i > maxReach) return false;
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}

// Jump Game II - Greedy O(n)
public int jump(int[] nums) {
    int jumps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < nums.length - 1; i++) {
        farthest = Math.max(farthest, i + nums[i]);
        if (i == curEnd) {
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}
\`\`\`

### Longest Common Substring (not subsequence)

\`\`\`
s1 = "abcde", s2 = "abfce"

Unlike LCS, substring must be contiguous!

dp[i][j] = length of longest common substring ending at s1[i-1] and s2[j-1]

If s1[i-1] == s2[j-1]: dp[i][j] = dp[i-1][j-1] + 1
Else: dp[i][j] = 0  (must be contiguous!)

       ""  a  b  f  c  e
  ""  [ 0, 0, 0, 0, 0, 0]
  a   [ 0, 1, 0, 0, 0, 0]
  b   [ 0, 0, 2, 0, 0, 0]  ← "ab" matches
  c   [ 0, 0, 0, 0, 1, 0]
  d   [ 0, 0, 0, 0, 0, 0]
  e   [ 0, 0, 0, 0, 0, 1]

Answer: 2 ("ab")
\`\`\`

### Wildcard Matching (LC 44)

\`\`\`
s = "adceb", p = "*a*b"
* matches any sequence of characters

dp[i][j] = does s[0..i-1] match p[0..j-1]?

       ""  *  a  *  b
  ""  [ T, T, F, F, F]   (* matches empty)
  a   [ F, T, T, T, F]
  d   [ F, T, F, T, F]
  c   [ F, T, F, T, F]
  e   [ F, T, F, T, F]
  b   [ F, T, F, T, T]   ← Answer: true

Key: '*' -> dp[i][j] = dp[i-1][j] (match one more char) || dp[i][j-1] (match empty)
\`\`\`

\`\`\`java
public boolean isMatch(String s, String p) {
    int m = s.length(), n = p.length();
    boolean[][] dp = new boolean[m + 1][n + 1];
    dp[0][0] = true;

    // * can match empty sequence
    for (int j = 1; j <= n; j++) {
        if (p.charAt(j-1) == '*') dp[0][j] = dp[0][j-1];
    }

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j-1) == '*') {
                dp[i][j] = dp[i-1][j] || dp[i][j-1];
            } else if (p.charAt(j-1) == '?' || s.charAt(i-1) == p.charAt(j-1)) {
                dp[i][j] = dp[i-1][j-1];
            }
        }
    }
    return dp[m][n];
}
\`\`\`

### Minimum Cost Tree From Leaf Values (LC 1130)

\`\`\`java
// Greedy approach using monotonic stack O(n)
public int mctFromLeafValues(int[] arr) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(Integer.MAX_VALUE);
    int result = 0;

    for (int val : arr) {
        while (stack.peek() <= val) {
            int mid = stack.pop();
            result += mid * Math.min(stack.peek(), val);
        }
        stack.push(val);
    }

    while (stack.size() > 2) {
        result += stack.pop() * stack.peek();
    }
    return result;
}
\`\`\`

---

## 📊 DP Problem Categorization

\`\`\`
COMPREHENSIVE DP PROBLEM MAP

┌─────────────────────────────────────────────────────────┐
│  LINEAR DP (1D array)                              │
│  ────────────────────────────────────────────────── │
│  Climbing Stairs, House Robber, Decode Ways,        │
│  Coin Change, Max Subarray, Jump Game,              │
│  Word Break, LIS, Trapping Rain Water               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  TWO-STRING DP (2D: s1 x s2)                        │
│  ────────────────────────────────────────────────── │
│  Edit Distance, LCS, Regex Match, Wildcard,         │
│  Interleaving String, Distinct Subsequences,         │
│  Shortest Common Supersequence                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  KNAPSACK VARIANTS (capacity-based)                  │
│  ────────────────────────────────────────────────── │
│  0/1 Knapsack, Partition Equal Sum, Target Sum,      │
│  Coin Change (unbounded), Ones and Zeroes,           │
│  Perfect Squares, Combination Sum IV                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  GRID DP (2D: row x col)                             │
│  ────────────────────────────────────────────────── │
│  Unique Paths, Min Path Sum, Dungeon Game,           │
│  Maximal Square, Maximal Rectangle,                  │
│  Cherry Pickup                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  INTERVAL DP (subarray [i..j])                       │
│  ────────────────────────────────────────────────── │
│  Burst Balloons, Matrix Chain, Palindrome Partition, │
│  Min Cost Tree, Strange Printer                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  STATE MACHINE DP (finite states)                    │
│  ────────────────────────────────────────────────── │
│  Stock Buy/Sell (all variants), Best Time to Buy,    │
│  House Robber (circular), Domino Tiling               │
└─────────────────────────────────────────────────────────┘
\`\`\`
`,
  },
  {
    slug: 'sliding-window-two-pointers',
    title: 'Sliding Window & Two Pointers',
    icon: 'SlidersHorizontal',
    description: 'Efficiently process contiguous subarrays and sorted data with window and pointer techniques.',
    color: 'teal',
    content: `# Sliding Window & Two Pointers — Complete Interview Guide

## Table of Contents
- [Core Concepts](#core-concepts)
- [Two Pointer Patterns](#two-pointer-patterns)
- [Fixed Window](#fixed-window)
- [Variable Window — Shrinkable](#variable-window--shrinkable)
- [Variable Window — Non-shrinkable](#variable-window--non-shrinkable)
- [Advanced Window Techniques](#advanced-window-techniques)
- [Complete Java Templates](#complete-java-templates)
- [Worked Examples](#worked-examples)
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Practice Problems](#practice-problems)

---

## 🧠 Core Concepts

### What Are These Techniques?

**Two Pointers** uses two indices that move through data in a coordinated way to efficiently
process elements without nested loops.

**Sliding Window** is a specialized two-pointer technique where both pointers move in the same
direction, maintaining a "window" of elements between them.

**Why it matters for interviews:**
- Converts O(n²) or O(n³) brute force into O(n) solutions
- Extremely common in string and array problems (~15% of problems)
- Once you recognize the pattern, implementation is mechanical
- Used in many "medium" problems that seem hard without the technique

### The Core Insight

\`\`\`
BRUTE FORCE vs SLIDING WINDOW

Problem: Find max sum of k consecutive elements

Brute force O(n×k):              Sliding window O(n):
  For each start position:         Keep running sum, slide:
  sum all k elements                add new element, remove old

  [1, 3, 2, 6, -1, 4]  k=3        [1, 3, 2, 6, -1, 4]  k=3
  [1, 3, 2] = 6                    [1, 3, 2] = 6
  [3, 2, 6] = recount all 3!       [3, 2, 6] = 6 - 1 + 6 = 11 ✓
  O(k) per window                   O(1) per window!
\`\`\`

---

## 🔍 Two Pointer Patterns

### Pattern 1: Opposite Direction (Sorted Two-Sum)

Two pointers start from opposite ends and converge:

\`\`\`
SORTED TWO-SUM: Find pair that sums to target

nums = [1, 3, 5, 7, 11, 13], target = 12

Step 1: L=0, R=5   nums[L]+nums[R] = 1+13 = 14 > 12  → R--
        [1, 3, 5, 7, 11, 13]
         L                R

Step 2: L=0, R=4   1+11 = 12 = target  → FOUND!
        [1, 3, 5, 7, 11, 13]
         L            R

Why it works:
  sum too big  → decrease it → move R left
  sum too small → increase it → move L right
  This eliminates possibilities in O(1), not O(n)
\`\`\`

\`\`\`java
public int[] twoSum(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) return new int[]{left, right};
        else if (sum < target) left++;
        else right--;
    }
    return new int[]{};
}
\`\`\`

### Pattern 2: Same Direction (Remove Duplicates)

Slow pointer marks the write position, fast pointer scans ahead:

\`\`\`
REMOVE DUPLICATES FROM SORTED ARRAY

nums = [1, 1, 2, 2, 3]

Step 1: slow=0, fast=1  nums[1]=1 == nums[0]=1  skip
        [1, 1, 2, 2, 3]
         s  f

Step 2: slow=0, fast=2  nums[2]=2 != nums[0]=1  → slow++, copy
        [1, 2, 2, 2, 3]
            s     f

Step 3: slow=1, fast=3  nums[3]=2 == nums[1]=2  skip
        [1, 2, 2, 2, 3]
            s        f

Step 4: slow=1, fast=4  nums[4]=3 != nums[1]=2  → slow++, copy
        [1, 2, 3, 2, 3]
               s        f

Result: first 3 elements = [1, 2, 3], return slow+1 = 3
\`\`\`

\`\`\`java
public int removeDuplicates(int[] nums) {
    if (nums.length == 0) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}
\`\`\`

### Pattern 3: Three Pointers (3Sum)

Fix one element, use two pointers on the rest:

\`\`\`
3SUM: Find all triplets summing to 0

nums = [-1, 0, 1, 2, -1, -4]
Sorted: [-4, -1, -1, 0, 1, 2]

Fix i=0 (val=-4):  L=1, R=5  sum=-4+(-1)+2=-3 < 0  → L++
                    L=2, R=5  sum=-4+(-1)+2=-3 < 0  → L++
                    L=3, R=5  sum=-4+0+2=-2 < 0     → L++
                    L=4, R=5  sum=-4+1+2=-1 < 0     → L=R, stop

Fix i=1 (val=-1):  L=2, R=5  sum=-1+(-1)+2=0 → FOUND [-1,-1,2]
                    L=3, R=4  sum=-1+0+1=0    → FOUND [-1,0,1]

Fix i=2 (val=-1):  Skip! Same as previous i value

Result: [[-1,-1,2], [-1,0,1]]
\`\`\`

\`\`\`java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;  // Skip duplicates
        int left = i + 1, right = nums.length - 1;
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            if (sum == 0) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left+1]) left++;
                while (left < right && nums[right] == nums[right-1]) right--;
                left++;
                right--;
            } else if (sum < 0) left++;
            else right--;
        }
    }
    return result;
}
\`\`\`

---

## 📊 Fixed Window

### Template

\`\`\`
FIXED WINDOW TEMPLATE

For a window of size k:
1. Build the first window (indices 0 to k-1)
2. Slide: add right element, remove left element
3. Update answer at each position

Key: The window size NEVER changes
\`\`\`

### Visual: Maximum Sum Subarray of Size K

\`\`\`
Array: [1, 3, 2, 6, -1, 4, 1, 8, 2], k=5

Window 1: [1, 3, 2, 6, -1]           sum = 11
           └─────────────┘

Window 2:    [3, 2, 6, -1, 4]        sum = 14  (11 - 1 + 4)
              └────────────┘

Window 3:       [2, 6, -1, 4, 1]     sum = 12  (14 - 3 + 1)
                 └────────────┘

Window 4:          [6, -1, 4, 1, 8]  sum = 18  (12 - 2 + 8)
                    └────────────┘

Window 5:             [-1, 4, 1, 8, 2] sum = 14  (18 - 6 + 2)
                       └────────────┘

Maximum sum = 18 (window 4)
\`\`\`

\`\`\`java
public int maxSumSubarray(int[] arr, int k) {
    int windowSum = 0, maxSum = Integer.MIN_VALUE;

    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];           // Add right element
        if (i >= k) {
            windowSum -= arr[i - k];   // Remove left element
        }
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
        }
    }
    return maxSum;
}
\`\`\`

---

## 🔀 Variable Window — Shrinkable

### Template: Find MINIMUM valid window

\`\`\`
SHRINKABLE VARIABLE WINDOW

int left = 0;
for (int right = 0; right < n; right++) {
    // 1. Add arr[right] to window state

    while (windowIsValid()) {       // Shrink while valid
        // 2. Update answer (minimum window)
        // 3. Remove arr[left] from window state
        left++;
    }
}

Key insight: We shrink WHILE valid to find the MINIMUM valid window
\`\`\`

### Visual: Longest Substring Without Repeating Characters (LC 3)

\`\`\`
s = "abcabcbb"

[a]bcabcbb     L=0 R=0  set={a}        len=1
[ab]cabcbb     L=0 R=1  set={a,b}      len=2
[abc]abcbb     L=0 R=2  set={a,b,c}    len=3  ← max so far
[abc|a]bcbb    L=0 R=3  \'a\' duplicate!
 a[bca]bcbb    L=1 R=3  remove \'a\', set={b,c,a} len=3
 a[bcab]cbb    L=1 R=4  \'b\' duplicate!
 ab[cab]cbb    L=2 R=4  remove \'b\', set={c,a,b} len=3
 ab[cabc]bb    L=2 R=5  \'c\' duplicate!
 abc[abc]bb    L=3 R=5  remove \'c\', set={a,b,c} len=3
 abc[abcb]b    L=3 R=6  \'b\' duplicate!
 abca[bcb]b    L=4 R=6  remove \'a\',\'b\' ... set={c,b} len=2
 abcab[cb]b    L=5 R=6  set={c,b} len=2
 abcab[cbb]    L=5 R=7  \'b\' duplicate!
 abcabc[b]b    L=6 R=7  remove \'c\',\'b\', set={b} len=1
 ...

Answer: 3 ("abc")
\`\`\`

\`\`\`java
public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        while (set.contains(s.charAt(right))) {
            set.remove(s.charAt(left));
            left++;
        }
        set.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Visual: Minimum Window Substring (LC 76)

\`\`\`
s = "ADOBECODEBANC", t = "ABC"
need: {A:1, B:1, C:1}, have: 0, required: 3

R=0 \'A\': window={A:1},           have=1   [A]DOBECODEBANC
R=1 \'D\': window={A:1,D:1},       have=1   [AD]OBECODEBANC
R=2 \'O\': window={A:1,D:1,O:1},   have=1   [ADO]BECODEBANC
R=3 \'B\': window={A:1,D:1,O:1,B:1}, have=2 [ADOB]ECODEBANC
R=4 \'E\': window={...,E:1},        have=2   [ADOBE]CODEBANC
R=5 \'C\': window={...,C:1},        have=3   [ADOBEC]ODEBANC  ← VALID!
  Shrink L:
  L=0 remove A: have=2 → INVALID, stop. min="ADOBEC" (len=6)

R=6..9: expand to get next valid window
R=10 \'A\': [CODEBA]NC         have=3 ← VALID!
  Shrink: remove C,O,D,E → [BA]NC, have=2 → stop.

R=12 \'C\': [BANC]             have=3 ← VALID!
  Shrink: remove B → [ANC], have=2 → stop. min="BANC" (len=4)

Answer: "BANC"
\`\`\`

\`\`\`java
public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);

    Map<Character, Integer> window = new HashMap<>();
    int have = 0, required = need.size();
    int left = 0, minLen = Integer.MAX_VALUE, minStart = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && window.get(c).equals(need.get(c))) {
            have++;
        }

        while (have == required) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            char d = s.charAt(left);
            window.merge(d, -1, Integer::sum);
            if (need.containsKey(d) && window.get(d) < need.get(d)) {
                have--;
            }
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? "" : s.substring(minStart, minStart + minLen);
}
\`\`\`

---

## 📏 Variable Window — Non-shrinkable

### Template: Find MAXIMUM valid window

\`\`\`
NON-SHRINKABLE VARIABLE WINDOW

int left = 0;
for (int right = 0; right < n; right++) {
    // 1. Add arr[right] to window state

    if (windowIsInvalid()) {         // if (not while!)
        // 2. Remove arr[left] from window state
        left++;
    }
    // 3. Answer = right - left + 1  (window never shrinks!)
}

Key insight: Window only grows or stays same size.
Once we find a window of size k, we only care about larger windows.
\`\`\`

### Shrinkable vs Non-shrinkable Comparison

\`\`\`
WHEN TO USE WHICH?

Shrinkable (while loop):
• Find MINIMUM valid window  → shrink while valid, track min
• Find MAXIMUM valid window  → shrink while invalid, track max
• More versatile, always correct
• Slightly more operations

Non-shrinkable (if statement):
• Find MAXIMUM valid window only
• Window size monotonically increases
• Slightly faster in practice
• Answer is always right - left + 1 at the end

Both give same answer for "find maximum" problems!
\`\`\`

### Max Consecutive Ones III (LC 1004)

\`\`\`
nums = [1,1,1,0,0,0,1,1,1,1,0], k=2  (can flip k zeros)

Shrinkable approach:
[1,1,1,0,0]0,1,1,1,1,0  L=0 R=4  zeros=2  len=5
[1,1,1,0,0,0]1,1,1,1,0  L=0 R=5  zeros=3 > k!
  shrink: 1,[1,1,0,0,0]  zeros=3
  shrink: 1,1,[1,0,0,0]  zeros=3
  shrink: 1,1,1,[0,0,0]  zeros=3
  shrink: 1,1,1,0,[0,0]  zeros=2  len=2
...
1,1,1,0,0,0,[1,1,1,1,0] L=6 R=10 zeros=1  len=5
1,1,1,0,0,[0,1,1,1,1,0] L=5 R=10 zeros=2  len=6 ← MAX!

Answer: 6
\`\`\`

\`\`\`java
public int longestOnes(int[] nums, int k) {
    int left = 0, zeros = 0, maxLen = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] == 0) zeros++;
        while (zeros > k) {
            if (nums[left] == 0) zeros--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

---

## 🔧 Advanced Window Techniques

### HashMap + Window Combo

\`\`\`
FREQUENCY MAP WINDOW PATTERN

Used when window validity depends on character/element frequencies.

Common setups:
• Permutation in string: window freq == target freq
• Minimum window: window contains all target chars
• At most K distinct: freq map size ≤ K
• Longest with equal 0s and 1s: transform to prefix sum
\`\`\`

### Permutation in String (LC 567)

\`\`\`
s1 = "ab", s2 = "eidbaooo"
Fixed window of size len(s1)=2, compare frequencies

Target freq: {a:1, b:1}

e,i: {e:1,i:1} ≠ target
i,d: {i:1,d:1} ≠ target
d,b: {d:1,b:1} ≠ target
b,a: {b:1,a:1} == target → FOUND!

Answer: true
\`\`\`

\`\`\`java
public boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    int[] freq1 = new int[26], freq2 = new int[26];
    int k = s1.length();

    for (int i = 0; i < k; i++) {
        freq1[s1.charAt(i) - 'a']++;
        freq2[s2.charAt(i) - 'a']++;
    }
    if (Arrays.equals(freq1, freq2)) return true;

    for (int i = k; i < s2.length(); i++) {
        freq2[s2.charAt(i) - 'a']++;        // Add right
        freq2[s2.charAt(i - k) - 'a']--;    // Remove left
        if (Arrays.equals(freq1, freq2)) return true;
    }
    return false;
}
\`\`\`

### Fruits Into Baskets (LC 904)

\`\`\`
fruits = [1, 2, 3, 2, 2]  (at most 2 types of fruit)

[1,2] types={1,2}=2   len=2
[1,2,3] types={1,2,3}=3 > 2! shrink
  [2,3] types={2,3}=2  len=2
[2,3,2] types={2,3}=2  len=3
[2,3,2,2] types={2,3}=2  len=4

Answer: 4 (subarray [3,2,2] has 2 types...wait, [2,3,2,2] too)
\`\`\`

\`\`\`java
public int totalFruit(int[] fruits) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < fruits.length; right++) {
        count.merge(fruits[right], 1, Integer::sum);

        while (count.size() > 2) {
            int leftFruit = fruits[left];
            count.merge(leftFruit, -1, Integer::sum);
            if (count.get(leftFruit) == 0) count.remove(leftFruit);
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

---

## 💻 Complete Java Templates

### Fixed Window Template

\`\`\`java
// Fixed window of size k
public int fixedWindow(int[] arr, int k) {
    int windowState = 0;  // sum, count, etc.
    int result = 0;

    for (int i = 0; i < arr.length; i++) {
        windowState += arr[i];             // Add right
        if (i >= k) {
            windowState -= arr[i - k];     // Remove left
        }
        if (i >= k - 1) {
            result = Math.max(result, windowState);  // Update answer
        }
    }
    return result;
}
\`\`\`

### Variable Shrinkable Template

\`\`\`java
// Find minimum/maximum valid window
public int variableShrinkable(int[] arr) {
    int left = 0, result = 0;

    for (int right = 0; right < arr.length; right++) {
        // Add arr[right] to window

        while (/* window is invalid */ false) {
            // Remove arr[left] from window
            left++;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}
\`\`\`

### Variable Non-shrinkable Template

\`\`\`java
// Find maximum valid window (optimized)
public int variableNonShrinkable(int[] arr) {
    int left = 0;

    for (int right = 0; right < arr.length; right++) {
        // Add arr[right] to window

        if (/* window is invalid */ false) {
            // Remove arr[left] from window
            left++;
        }
    }
    return arr.length - left;  // Window size at the end
}
\`\`\`

### Frequency Matching Template

\`\`\`java
// Check if window matches target frequency
public boolean freqMatch(String s, String t) {
    int[] need = new int[26];
    for (char c : t.toCharArray()) need[c - 'a']++;

    int[] have = new int[26];
    int k = t.length();

    for (int i = 0; i < s.length(); i++) {
        have[s.charAt(i) - 'a']++;
        if (i >= k) have[s.charAt(i - k) - 'a']--;
        if (i >= k - 1 && Arrays.equals(have, need)) return true;
    }
    return false;
}
\`\`\`

---

## 📝 Worked Examples

### Permutation in String (LC 567) — Full Trace

\`\`\`
s1 = "abc", s2 = "baxcbab"
Target freq: {a:1, b:1, c:1}, window size = 3

i=0,1,2: "bax" freq={b:1,a:1,x:1} ≠ target
i=3: add c, remove b: "axc" freq={a:1,x:1,c:1} ≠ target
i=4: add b, remove a: "xcb" freq={x:1,c:1,b:1} ≠ target
i=5: add a, remove x: "cba" freq={c:1,b:1,a:1} == target → TRUE!

Answer: true (substring "cba" is permutation of "abc")
\`\`\`

### Max Consecutive Ones III (LC 1004) — Full Trace

\`\`\`
nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k=3

The window can contain at most k=3 zeros.

Best window: [1,1,0,0,1,1,1,0,1,1] with 3 zeros flipped
Starting from index 2: [1,1,0,0,1,1,1,0,1,1] len=10

Answer: 10
\`\`\`

### Fruits Into Baskets (LC 904) — Full Trace

\`\`\`
fruits = [3, 3, 3, 1, 2, 1, 1, 2, 3, 3, 4]

Window tracking (at most 2 fruit types):
[3,3,3]           types={3}        len=3
[3,3,3,1]         types={3,1}      len=4
[3,3,3,1,2]       types={3,1,2}    INVALID! shrink
  [3,3,1,2] still 3 types, shrink
  [3,1,2] still 3, shrink
  [1,2]     types={1,2}          len=2
[1,2,1]           types={1,2}      len=3
[1,2,1,1]         types={1,2}      len=4
[1,2,1,1,2]       types={1,2}      len=5  ← max
[1,2,1,1,2,3]     INVALID! shrink...
...

Answer: 5
\`\`\`

---

## 🎯 Pattern Recognition

\`\`\`
SLIDING WINDOW / TWO POINTER DECISION GUIDE

Question to ask:               Technique:
─────────────────────────────────   ────────────────────────────
Sorted array + pair?            Opposite two pointers
Contiguous subarray + size k?   Fixed sliding window
Contiguous + min length valid?  Variable shrinkable
Contiguous + max length valid?  Variable (either)
Contains all chars of T?        Variable + freq map
Permutation/anagram check?      Fixed + freq map
At most K distinct?             Variable + map.size()
Remove in-place?                Same-direction two pointers
Partition/sort related?          Two/three pointers
\`\`\`

### Quick Decision Table

| Goal | Window Type | Shrink | Answer Location |
|---|---|---|---|
| Find minimum valid window | Variable shrinkable | while (valid) | Inside while |
| Find maximum valid window | Variable shrinkable | while (invalid) | After while |
| Find maximum valid window (opt) | Non-shrinkable | if (invalid) | At end |
| Check if permutation exists | Fixed window | N/A | Compare freqs |
| Sum/avg of all k-size windows | Fixed window | N/A | Each slide |
| Pair sum in sorted array | Opposite pointers | N/A | When sum matches |
| Remove duplicates in-place | Same-direction | N/A | slow pointer count |

---

## ⚡ Complexity Cheat Sheet

| Problem | Technique | Time | Space |
|---|---|---|---|
| Two Sum (sorted) | Opposite pointers | O(n) | O(1) |
| 3Sum | Fix + opposite pointers | O(n²) | O(1) |
| Remove Duplicates | Same-direction | O(n) | O(1) |
| Max Sum Subarray k | Fixed window | O(n) | O(1) |
| Longest Substring No Repeat | Variable + HashSet | O(n) | O(min(n,26)) |
| Minimum Window Substring | Variable + HashMap | O(n) | O(k) |
| Permutation in String | Fixed + freq array | O(n) | O(1) |
| Longest with K Distinct | Variable + HashMap | O(n) | O(k) |
| Max Consecutive Ones III | Variable + counter | O(n) | O(1) |
| Fruits Into Baskets | Variable + HashMap | O(n) | O(1) |
| Sliding Window Maximum | Monotonic deque | O(n) | O(k) |

---

## 📋 Practice Problems

| Problem | Technique | Difficulty |
|---|---|---|
| 1. Two Sum | HashMap (or sorted + pointers) | Easy |
| 167. Two Sum II (sorted) | Opposite pointers | Medium |
| 15. 3Sum | Fix + two pointers | Medium |
| 26. Remove Duplicates | Same-direction pointers | Easy |
| 283. Move Zeroes | Same-direction pointers | Easy |
| 11. Container With Most Water | Opposite pointers | Medium |
| 42. Trapping Rain Water | Opposite pointers / stack | Hard |
| 209. Min Size Subarray Sum | Variable shrinkable | Medium |
| 3. Longest Substring No Repeat | Variable + set | Medium |
| 76. Minimum Window Substring | Variable + freq map | Hard |
| 567. Permutation in String | Fixed + freq array | Medium |
| 438. Find All Anagrams | Fixed + freq array | Medium |
| 424. Longest Repeating Replacement | Variable + counter | Medium |
| 904. Fruits Into Baskets | Variable + map | Medium |
| 1004. Max Consecutive Ones III | Variable + counter | Medium |
| 239. Sliding Window Maximum | Monotonic deque | Hard |
| 30. Substring with All Words | Fixed + freq map | Hard |
| 340. Longest with K Distinct | Variable + map | Medium |
| 992. Subarrays with K Different | AtMostK trick | Hard |
| 1248. Count Nice Subarrays | AtMostK trick | Medium |


---

## 💡 Advanced Window Techniques (Continued)

### Sliding Window Maximum (LC 239) — Monotonic Deque

\`\`\`
MONOTONIC DEQUE APPROACH

nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

Deque stores INDICES, maintaining decreasing order of values:

i=0: deque=[0]           val=1
i=1: deque=[1]           val=3  (remove 0: nums[0]=1 < 3)
i=2: deque=[1,2]         val=-1 (append)
     window [1,3,-1] max=nums[deque.front]=nums[1]=3 ✓

i=3: deque=[1,2,3]       val=-3
     window [3,-1,-3] max=nums[1]=3 ✓
     BUT deque.front=1 is outside window (1 < 3-3+1=1)? No, still in.

i=4: deque=[4]           val=5  (remove 1,2,3: all < 5)
     window [-1,-3,5] max=nums[4]=5 ✓

i=5: deque=[4,5]         val=3
     window [-3,5,3] max=nums[4]=5 ✓

i=6: deque=[6]           val=6  (remove 4,5)
     window [5,3,6] max=nums[6]=6 ✓

i=7: deque=[7]           val=7  (remove 6)
     window [3,6,7] max=nums[7]=7 ✓

Result: [3, 3, 5, 5, 6, 7]
\`\`\`

\`\`\`java
public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];
    int ri = 0;

    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        // Remove smaller elements from back
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }
        deque.offerLast(i);
        if (i >= k - 1) {
            result[ri++] = nums[deque.peekFirst()];
        }
    }
    return result;
}
\`\`\`

### Subarrays with K Different Integers (LC 992)

\`\`\`
EXACTLY K = AT MOST K - AT MOST (K-1)

This "exactly K" trick is crucial for counting problems!

nums = [1, 2, 1, 2, 3], k = 2

atMost(2) - atMost(1) = exactly(2)

atMost(2):
  i=0: [1]         distinct=1 ≤ 2  count += 1 = 1
  i=1: [1,2]       distinct=2 ≤ 2  count += 2 = 3
  i=2: [1,2,1]     distinct=2 ≤ 2  count += 3 = 6
  i=3: [1,2,1,2]   distinct=2 ≤ 2  count += 4 = 10
  i=4: [1,2,1,2,3] distinct=3 > 2! shrink to [2,1,2,3]...still 3
       shrink to [1,2,3]...still 3, shrink to [2,3] distinct=2
       count += 2 = 12

atMost(1): count = 5 (only single-element or same-element windows)

Answer: 12 - 5 = 7
\`\`\`

\`\`\`java
public int subarraysWithKDistinct(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

int atMost(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() > k) {
            int leftVal = nums[left];
            count.merge(leftVal, -1, Integer::sum);
            if (count.get(leftVal) == 0) count.remove(leftVal);
            left++;
        }
        result += right - left + 1;  // All subarrays ending at right
    }
    return result;
}
\`\`\`

### Longest Repeating Character Replacement (LC 424)

\`\`\`
s = "AABABBA", k = 1  (can replace at most k characters)

Key insight: window is valid if:
  (window length) - (count of most frequent char) ≤ k

i=0: "A"       maxFreq=1  replacements=1-1=0 ≤ 1  len=1
i=1: "AA"      maxFreq=2  replacements=2-2=0 ≤ 1  len=2
i=2: "AAB"     maxFreq=2  replacements=3-2=1 ≤ 1  len=3
i=3: "AABA"    maxFreq=3  replacements=4-3=1 ≤ 1  len=4  ← MAX
i=4: "AABAB"   maxFreq=3  replacements=5-3=2 > 1! shrink
     "ABAB"    maxFreq=2  replacements=4-2=2 > 1! shrink
     "BAB"     maxFreq=2  replacements=3-2=1 ≤ 1  len=3
i=5: "BABB"    maxFreq=3  replacements=4-3=1 ≤ 1  len=4
i=6: "BABBA"   maxFreq=3  replacements=5-3=2 > 1! shrink
     "ABBA"    maxFreq=2  replacements=4-2=2 > 1! shrink
     "BBA"     maxFreq=2  replacements=3-2=1 ≤ 1  len=3

Answer: 4 ("AABA" → replace B with A → "AAAA")
\`\`\`

\`\`\`java
public int characterReplacement(String s, int k) {
    int[] freq = new int[26];
    int left = 0, maxFreq = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        freq[s.charAt(right) - 'A']++;
        maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);

        // Window size - most frequent = chars to replace
        while (right - left + 1 - maxFreq > k) {
            freq[s.charAt(left) - 'A']--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Substring with Concatenation of All Words (LC 30)

\`\`\`
s = "barfoothefoobarman"
words = ["foo","bar"]  (each word length 3)

Use fixed window of size = wordLen * numWords = 3 * 2 = 6

Check every offset 0, 1, 2 (modulo word length):
Offset 0: "bar|foo|the|foo|bar|man"
  Window "barfoo": {bar:1, foo:1} matches! → index 0
  Slide: "foothe": {foo:1, the:1} no match
  Slide: "thefoo": {the:1, foo:1} no match
  Slide: "foobar": {foo:1, bar:1} matches! → index 9

Answer: [0, 9]
\`\`\`

---

## 📊 Two Pointer Advanced Patterns

### Container With Most Water (LC 11)

\`\`\`
heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]

L=0 R=8: area = min(1,7) * 8 = 8    move L (shorter side)
L=1 R=8: area = min(8,7) * 7 = 49   move R
L=1 R=7: area = min(8,3) * 6 = 18   move R
L=1 R=6: area = min(8,8) * 5 = 40   move R (or L, equal)
L=1 R=5: area = min(8,4) * 4 = 16   move R
L=1 R=4: area = min(8,5) * 3 = 15   move R
L=1 R=3: area = min(8,2) * 2 = 4    move R
L=1 R=2: area = min(8,6) * 1 = 6

Maximum: 49 (L=1, R=8)

Why move the shorter side?
  Moving the taller side can only DECREASE area
  (width shrinks, height limited by shorter side)
  Moving the shorter side MIGHT increase area
\`\`\`

\`\`\`java
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    while (left < right) {
        int area = Math.min(height[left], height[right]) * (right - left);
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}
\`\`\`

### Trapping Rain Water (LC 42)

\`\`\`
height = [0,1,0,2,1,0,1,3,2,1,2,1]

Two pointer approach:
  Water at each position = min(maxLeft, maxRight) - height[i]

L=0 R=11  leftMax=0 rightMax=1
  height[L]=0 ≤ height[R]=1: water += max(0, leftMax-height[0])=0, L++
  leftMax=max(0,0)=0

L=1 R=11  leftMax=1 rightMax=1
  height[L]=1 ≤ height[R]=1: water += max(0, 1-1)=0, L++
  leftMax=max(0,1)=1

L=2 R=11  leftMax=1 rightMax=1
  height[L]=0 ≤ height[R]=1: water += max(0, 1-0)=1, L++

... and so on.  Total water = 6
\`\`\`

\`\`\`java
public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;

    while (left < right) {
        if (height[left] <= height[right]) {
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

---

## 💡 Common Window Pitfalls

\`\`\`
MISTAKES TO AVOID

1. Forgetting to shrink window properly
   → "while" for minimum window, "while" or "if" for maximum

2. Off-by-one in window size
   → Window size = right - left + 1 (inclusive)

3. Not handling empty/single-element arrays
   → Always check edge cases first

4. Using HashMap when array suffices
   → If keys are characters (a-z), use int[26]
   → Much faster than HashMap

5. Not cleaning up window state on shrink
   → When removing left element, UPDATE all state variables

6. Confusing "at most K" with "exactly K"
   → exactly(K) = atMost(K) - atMost(K-1)
\`\`\`

### Interview Tips

\`\`\`
WHAT TO SAY IN INTERVIEWS:

1. "This looks like a sliding window problem because we need
    [contiguous subarray / substring] with [some property]."

2. "I'll use two pointers: right expands the window, left
    shrinks it when [the constraint is violated]."

3. "The time complexity is O(n) because each element is added
    and removed from the window at most once."

4. "For the space complexity, I'm using [a HashSet/HashMap of
    at most k entries / a fixed-size array of 26]."
\`\`\`


---

## 💡 More Window Patterns

### Minimum Size Subarray Sum (LC 209)

\`\`\`
target = 7, nums = [2, 3, 1, 2, 4, 3]

Find shortest subarray with sum >= target.

L=0 R=0: [2]             sum=2  < 7
L=0 R=1: [2,3]           sum=5  < 7
L=0 R=2: [2,3,1]         sum=6  < 7
L=0 R=3: [2,3,1,2]       sum=8  >= 7 ✓ len=4
  shrink: L=1 [3,1,2]    sum=6  < 7
L=1 R=4: [3,1,2,4]       sum=10 >= 7 ✓ len=4
  shrink: L=2 [1,2,4]    sum=7  >= 7 ✓ len=3
  shrink: L=3 [2,4]      sum=6  < 7
L=3 R=5: [2,4,3]         sum=9  >= 7 ✓ len=3
  shrink: L=4 [4,3]      sum=7  >= 7 ✓ len=2 ← MIN!
  shrink: L=5 [3]        sum=3  < 7

Answer: 2 (subarray [4,3])
\`\`\`

\`\`\`java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
\`\`\`

### Find All Anagrams in a String (LC 438)

\`\`\`
s = "cbaebabacd", p = "abc"
Target freq: {a:1, b:1, c:1}, window size = 3

i=0,1,2: "cba" freq={c:1,b:1,a:1} == target → index 0
i=3:     "bae" freq={b:1,a:1,e:1} ≠ target
i=4:     "aeb" freq={a:1,e:1,b:1} ≠ target
i=5:     "eba" freq={e:1,b:1,a:1} ≠ target
i=6:     "bab" freq={b:2,a:1} ≠ target
i=7:     "aba" freq={a:2,b:1} ≠ target
i=8:     "bac" freq={b:1,a:1,c:1} == target → index 6
i=9:     "acd" freq={a:1,c:1,d:1} ≠ target

Answer: [0, 6]
\`\`\`

\`\`\`java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;

    int[] pFreq = new int[26], sFreq = new int[26];
    for (char c : p.toCharArray()) pFreq[c - 'a']++;

    for (int i = 0; i < s.length(); i++) {
        sFreq[s.charAt(i) - 'a']++;
        if (i >= p.length()) sFreq[s.charAt(i - p.length()) - 'a']--;
        if (Arrays.equals(sFreq, pFreq)) result.add(i - p.length() + 1);
    }
    return result;
}
\`\`\`

### Longest Substring with At Most K Distinct Characters (LC 340)

\`\`\`
s = "eceba", k = 2

L=0 R=0: "e"       distinct={e}     1 ≤ 2  len=1
L=0 R=1: "ec"      distinct={e,c}   2 ≤ 2  len=2
L=0 R=2: "ece"     distinct={e,c}   2 ≤ 2  len=3 ← MAX
L=0 R=3: "eceb"    distinct={e,c,b} 3 > 2!
  shrink L=1: "ceb"  distinct={c,e,b} 3 > 2!
  shrink L=2: "eb"   distinct={e,b} 2 ≤ 2  len=2
L=2 R=4: "eba"     distinct={e,b,a} 3 > 2!
  shrink L=3: "ba"   distinct={b,a} 2 ≤ 2  len=2

Answer: 3 ("ece")
\`\`\`

\`\`\`java
public int lengthOfLongestSubstringKDistinct(String s, int k) {
    Map<Character, Integer> map = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        map.merge(s.charAt(right), 1, Integer::sum);

        while (map.size() > k) {
            char c = s.charAt(left);
            map.merge(c, -1, Integer::sum);
            if (map.get(c) == 0) map.remove(c);
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Count Nice Subarrays (LC 1248)

\`\`\`
nums = [1,1,2,1,1], k = 3  (exactly 3 odd numbers)

Transform: odd=1, even=0 -> [1,1,0,1,1]

atMost(3) - atMost(2):
  atMost(3) = 10 (all subarrays with ≤ 3 odds)
  atMost(2) = 6

Answer: 10 - 6 = 4

The nice subarrays:
[1,1,2,1], [1,2,1,1], [1,1,2,1,1], [1,2,1,1]... wait let me recount
Actually: [1,1,2,1], [1,1,2,1,1], [1,2,1,1], [1,2,1,1] -> tricky
\`\`\`

\`\`\`java
public int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

int atMost(int[] nums, int k) {
    int left = 0, count = 0, odds = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) odds++;
        while (odds > k) {
            if (nums[left] % 2 == 1) odds--;
            left++;
        }
        count += right - left + 1;
    }
    return count;
}
\`\`\`

### String-Based Window: Minimum Window Subsequence (LC 727)

\`\`\`
s = "abcdebdde", t = "bde"

Find minimum window in s that contains t as a subsequence.

Forward pass finds end:
  Match b at s[1], d at s[3], e at s[4] → window s[1..4] = "bcde"

Backward pass from end to find tightest start:
  From s[4], match e at 4, d at 3, b at 1 → start=1, len=4

Continue from s[2]:
  Match b at s[5](wait, s[5]=b), d at s[6], e at s[7]
  Window s[5..7] = "bdd"... need e: s[8]=e? No... 
  Actually s = "abcdebdde": b@5, d@6, d@7, e@8
  Backward: e@8, d@7, b@5 → start=5, len=4

Minimum: "bcde" (length 4)
\`\`\`

---

## 📊 Window Complexity Analysis

\`\`\`
WHY SLIDING WINDOW IS O(n):

Each element is processed at most TWICE:
  • Once when right pointer includes it
  • Once when left pointer excludes it

Total operations: 2n = O(n)

Even though there's a while loop inside the for loop,
the LEFT pointer only moves forward, never backward.
So total left pointer movements across all iterations = n.

This is called AMORTIZED analysis:
  Single iteration might do O(n) work
  But total across ALL iterations is O(n)
  Average per iteration: O(1)
\`\`\`

### Space Complexity Patterns

\`\`\`
Window Type         Typical Space
───────────────────────────────────────
Counter-based       O(1) or O(26)
  (e.g., max ones, char replacement)

HashSet-based       O(min(n, charset))
  (e.g., unique substring)

HashMap-based       O(k) where k = distinct elements
  (e.g., K distinct chars)

Freq array-based    O(26) or O(128) = O(1)
  (e.g., anagram matching)

Deque-based         O(k) where k = window size
  (e.g., sliding max/min)
\`\`\`


---

## 💡 Advanced Window Techniques (Continued)

### Sliding Window Maximum (LC 239) — Monotonic Deque

\`\`\`
MONOTONIC DEQUE APPROACH

nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

Deque stores INDICES, maintaining decreasing order of values:

i=0: deque=[0]           val=1
i=1: deque=[1]           val=3  (remove 0: nums[0]=1 < 3)
i=2: deque=[1,2]         val=-1 (append)
     window [1,3,-1] max=nums[deque.front]=nums[1]=3 ✓

i=3: deque=[1,2,3]       val=-3
     window [3,-1,-3] max=nums[1]=3 ✓
     BUT deque.front=1 is outside window (1 < 3-3+1=1)? No, still in.

i=4: deque=[4]           val=5  (remove 1,2,3: all < 5)
     window [-1,-3,5] max=nums[4]=5 ✓

i=5: deque=[4,5]         val=3
     window [-3,5,3] max=nums[4]=5 ✓

i=6: deque=[6]           val=6  (remove 4,5)
     window [5,3,6] max=nums[6]=6 ✓

i=7: deque=[7]           val=7  (remove 6)
     window [3,6,7] max=nums[7]=7 ✓

Result: [3, 3, 5, 5, 6, 7]
\`\`\`

\`\`\`java
public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> deque = new ArrayDeque<>();
    int[] result = new int[nums.length - k + 1];
    int ri = 0;

    for (int i = 0; i < nums.length; i++) {
        // Remove indices outside window
        while (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
            deque.pollFirst();
        }
        // Remove smaller elements from back
        while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
            deque.pollLast();
        }
        deque.offerLast(i);
        if (i >= k - 1) {
            result[ri++] = nums[deque.peekFirst()];
        }
    }
    return result;
}
\`\`\`

### Subarrays with K Different Integers (LC 992)

\`\`\`
EXACTLY K = AT MOST K - AT MOST (K-1)

This "exactly K" trick is crucial for counting problems!

nums = [1, 2, 1, 2, 3], k = 2

atMost(2) - atMost(1) = exactly(2)

atMost(2):
  i=0: [1]         distinct=1 ≤ 2  count += 1 = 1
  i=1: [1,2]       distinct=2 ≤ 2  count += 2 = 3
  i=2: [1,2,1]     distinct=2 ≤ 2  count += 3 = 6
  i=3: [1,2,1,2]   distinct=2 ≤ 2  count += 4 = 10
  i=4: [1,2,1,2,3] distinct=3 > 2! shrink to [2,1,2,3]...still 3
       shrink to [1,2,3]...still 3, shrink to [2,3] distinct=2
       count += 2 = 12

atMost(1): count = 5 (only single-element or same-element windows)

Answer: 12 - 5 = 7
\`\`\`

\`\`\`java
public int subarraysWithKDistinct(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

int atMost(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < nums.length; right++) {
        count.merge(nums[right], 1, Integer::sum);
        while (count.size() > k) {
            int leftVal = nums[left];
            count.merge(leftVal, -1, Integer::sum);
            if (count.get(leftVal) == 0) count.remove(leftVal);
            left++;
        }
        result += right - left + 1;  // All subarrays ending at right
    }
    return result;
}
\`\`\`

### Longest Repeating Character Replacement (LC 424)

\`\`\`
s = "AABABBA", k = 1  (can replace at most k characters)

Key insight: window is valid if:
  (window length) - (count of most frequent char) ≤ k

i=0: "A"       maxFreq=1  replacements=1-1=0 ≤ 1  len=1
i=1: "AA"      maxFreq=2  replacements=2-2=0 ≤ 1  len=2
i=2: "AAB"     maxFreq=2  replacements=3-2=1 ≤ 1  len=3
i=3: "AABA"    maxFreq=3  replacements=4-3=1 ≤ 1  len=4  ← MAX
i=4: "AABAB"   maxFreq=3  replacements=5-3=2 > 1! shrink
     "ABAB"    maxFreq=2  replacements=4-2=2 > 1! shrink
     "BAB"     maxFreq=2  replacements=3-2=1 ≤ 1  len=3
i=5: "BABB"    maxFreq=3  replacements=4-3=1 ≤ 1  len=4
i=6: "BABBA"   maxFreq=3  replacements=5-3=2 > 1! shrink
     "ABBA"    maxFreq=2  replacements=4-2=2 > 1! shrink
     "BBA"     maxFreq=2  replacements=3-2=1 ≤ 1  len=3

Answer: 4 ("AABA" → replace B with A → "AAAA")
\`\`\`

\`\`\`java
public int characterReplacement(String s, int k) {
    int[] freq = new int[26];
    int left = 0, maxFreq = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        freq[s.charAt(right) - 'A']++;
        maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);

        // Window size - most frequent = chars to replace
        while (right - left + 1 - maxFreq > k) {
            freq[s.charAt(left) - 'A']--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Substring with Concatenation of All Words (LC 30)

\`\`\`
s = "barfoothefoobarman"
words = ["foo","bar"]  (each word length 3)

Use fixed window of size = wordLen * numWords = 3 * 2 = 6

Check every offset 0, 1, 2 (modulo word length):
Offset 0: "bar|foo|the|foo|bar|man"
  Window "barfoo": {bar:1, foo:1} matches! → index 0
  Slide: "foothe": {foo:1, the:1} no match
  Slide: "thefoo": {the:1, foo:1} no match
  Slide: "foobar": {foo:1, bar:1} matches! → index 9

Answer: [0, 9]
\`\`\`

---

## 📊 Two Pointer Advanced Patterns

### Container With Most Water (LC 11)

\`\`\`
heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]

L=0 R=8: area = min(1,7) * 8 = 8    move L (shorter side)
L=1 R=8: area = min(8,7) * 7 = 49   move R
L=1 R=7: area = min(8,3) * 6 = 18   move R
L=1 R=6: area = min(8,8) * 5 = 40   move R (or L, equal)
L=1 R=5: area = min(8,4) * 4 = 16   move R
L=1 R=4: area = min(8,5) * 3 = 15   move R
L=1 R=3: area = min(8,2) * 2 = 4    move R
L=1 R=2: area = min(8,6) * 1 = 6

Maximum: 49 (L=1, R=8)

Why move the shorter side?
  Moving the taller side can only DECREASE area
  (width shrinks, height limited by shorter side)
  Moving the shorter side MIGHT increase area
\`\`\`

\`\`\`java
public int maxArea(int[] height) {
    int left = 0, right = height.length - 1;
    int maxArea = 0;
    while (left < right) {
        int area = Math.min(height[left], height[right]) * (right - left);
        maxArea = Math.max(maxArea, area);
        if (height[left] < height[right]) left++;
        else right--;
    }
    return maxArea;
}
\`\`\`

### Trapping Rain Water (LC 42)

\`\`\`
height = [0,1,0,2,1,0,1,3,2,1,2,1]

Two pointer approach:
  Water at each position = min(maxLeft, maxRight) - height[i]

L=0 R=11  leftMax=0 rightMax=1
  height[L]=0 ≤ height[R]=1: water += max(0, leftMax-height[0])=0, L++
  leftMax=max(0,0)=0

L=1 R=11  leftMax=1 rightMax=1
  height[L]=1 ≤ height[R]=1: water += max(0, 1-1)=0, L++
  leftMax=max(0,1)=1

L=2 R=11  leftMax=1 rightMax=1
  height[L]=0 ≤ height[R]=1: water += max(0, 1-0)=1, L++

... and so on.  Total water = 6
\`\`\`

\`\`\`java
public int trap(int[] height) {
    int left = 0, right = height.length - 1;
    int leftMax = 0, rightMax = 0, water = 0;

    while (left < right) {
        if (height[left] <= height[right]) {
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

---

## 💡 Common Window Pitfalls

\`\`\`
MISTAKES TO AVOID

1. Forgetting to shrink window properly
   → "while" for minimum window, "while" or "if" for maximum

2. Off-by-one in window size
   → Window size = right - left + 1 (inclusive)

3. Not handling empty/single-element arrays
   → Always check edge cases first

4. Using HashMap when array suffices
   → If keys are characters (a-z), use int[26]
   → Much faster than HashMap

5. Not cleaning up window state on shrink
   → When removing left element, UPDATE all state variables

6. Confusing "at most K" with "exactly K"
   → exactly(K) = atMost(K) - atMost(K-1)
\`\`\`

### Interview Tips

\`\`\`
WHAT TO SAY IN INTERVIEWS:

1. "This looks like a sliding window problem because we need
    [contiguous subarray / substring] with [some property]."

2. "I'll use two pointers: right expands the window, left
    shrinks it when [the constraint is violated]."

3. "The time complexity is O(n) because each element is added
    and removed from the window at most once."

4. "For the space complexity, I'm using [a HashSet/HashMap of
    at most k entries / a fixed-size array of 26]."
\`\`\`


---

## 💡 More Window Patterns

### Minimum Size Subarray Sum (LC 209)

\`\`\`
target = 7, nums = [2, 3, 1, 2, 4, 3]

Find shortest subarray with sum >= target.

L=0 R=0: [2]             sum=2  < 7
L=0 R=1: [2,3]           sum=5  < 7
L=0 R=2: [2,3,1]         sum=6  < 7
L=0 R=3: [2,3,1,2]       sum=8  >= 7 ✓ len=4
  shrink: L=1 [3,1,2]    sum=6  < 7
L=1 R=4: [3,1,2,4]       sum=10 >= 7 ✓ len=4
  shrink: L=2 [1,2,4]    sum=7  >= 7 ✓ len=3
  shrink: L=3 [2,4]      sum=6  < 7
L=3 R=5: [2,4,3]         sum=9  >= 7 ✓ len=3
  shrink: L=4 [4,3]      sum=7  >= 7 ✓ len=2 ← MIN!
  shrink: L=5 [3]        sum=3  < 7

Answer: 2 (subarray [4,3])
\`\`\`

\`\`\`java
public int minSubArrayLen(int target, int[] nums) {
    int left = 0, sum = 0, minLen = Integer.MAX_VALUE;
    for (int right = 0; right < nums.length; right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = Math.min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
\`\`\`

### Find All Anagrams in a String (LC 438)

\`\`\`
s = "cbaebabacd", p = "abc"
Target freq: {a:1, b:1, c:1}, window size = 3

i=0,1,2: "cba" freq={c:1,b:1,a:1} == target → index 0
i=3:     "bae" freq={b:1,a:1,e:1} ≠ target
i=4:     "aeb" freq={a:1,e:1,b:1} ≠ target
i=5:     "eba" freq={e:1,b:1,a:1} ≠ target
i=6:     "bab" freq={b:2,a:1} ≠ target
i=7:     "aba" freq={a:2,b:1} ≠ target
i=8:     "bac" freq={b:1,a:1,c:1} == target → index 6
i=9:     "acd" freq={a:1,c:1,d:1} ≠ target

Answer: [0, 6]
\`\`\`

\`\`\`java
public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;

    int[] pFreq = new int[26], sFreq = new int[26];
    for (char c : p.toCharArray()) pFreq[c - 'a']++;

    for (int i = 0; i < s.length(); i++) {
        sFreq[s.charAt(i) - 'a']++;
        if (i >= p.length()) sFreq[s.charAt(i - p.length()) - 'a']--;
        if (Arrays.equals(sFreq, pFreq)) result.add(i - p.length() + 1);
    }
    return result;
}
\`\`\`

### Longest Substring with At Most K Distinct Characters (LC 340)

\`\`\`
s = "eceba", k = 2

L=0 R=0: "e"       distinct={e}     1 ≤ 2  len=1
L=0 R=1: "ec"      distinct={e,c}   2 ≤ 2  len=2
L=0 R=2: "ece"     distinct={e,c}   2 ≤ 2  len=3 ← MAX
L=0 R=3: "eceb"    distinct={e,c,b} 3 > 2!
  shrink L=1: "ceb"  distinct={c,e,b} 3 > 2!
  shrink L=2: "eb"   distinct={e,b} 2 ≤ 2  len=2
L=2 R=4: "eba"     distinct={e,b,a} 3 > 2!
  shrink L=3: "ba"   distinct={b,a} 2 ≤ 2  len=2

Answer: 3 ("ece")
\`\`\`

\`\`\`java
public int lengthOfLongestSubstringKDistinct(String s, int k) {
    Map<Character, Integer> map = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        map.merge(s.charAt(right), 1, Integer::sum);

        while (map.size() > k) {
            char c = s.charAt(left);
            map.merge(c, -1, Integer::sum);
            if (map.get(c) == 0) map.remove(c);
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Count Nice Subarrays (LC 1248)

\`\`\`
nums = [1,1,2,1,1], k = 3  (exactly 3 odd numbers)

Transform: odd=1, even=0 -> [1,1,0,1,1]

atMost(3) - atMost(2):
  atMost(3) = 10 (all subarrays with ≤ 3 odds)
  atMost(2) = 6

Answer: 10 - 6 = 4

The nice subarrays:
[1,1,2,1], [1,2,1,1], [1,1,2,1,1], [1,2,1,1]... wait let me recount
Actually: [1,1,2,1], [1,1,2,1,1], [1,2,1,1], [1,2,1,1] -> tricky
\`\`\`

\`\`\`java
public int numberOfSubarrays(int[] nums, int k) {
    return atMost(nums, k) - atMost(nums, k - 1);
}

int atMost(int[] nums, int k) {
    int left = 0, count = 0, odds = 0;
    for (int right = 0; right < nums.length; right++) {
        if (nums[right] % 2 == 1) odds++;
        while (odds > k) {
            if (nums[left] % 2 == 1) odds--;
            left++;
        }
        count += right - left + 1;
    }
    return count;
}
\`\`\`

### String-Based Window: Minimum Window Subsequence (LC 727)

\`\`\`
s = "abcdebdde", t = "bde"

Find minimum window in s that contains t as a subsequence.

Forward pass finds end:
  Match b at s[1], d at s[3], e at s[4] → window s[1..4] = "bcde"

Backward pass from end to find tightest start:
  From s[4], match e at 4, d at 3, b at 1 → start=1, len=4

Continue from s[2]:
  Match b at s[5](wait, s[5]=b), d at s[6], e at s[7]
  Window s[5..7] = "bdd"... need e: s[8]=e? No... 
  Actually s = "abcdebdde": b@5, d@6, d@7, e@8
  Backward: e@8, d@7, b@5 → start=5, len=4

Minimum: "bcde" (length 4)
\`\`\`

---

## 📊 Window Complexity Analysis

\`\`\`
WHY SLIDING WINDOW IS O(n):

Each element is processed at most TWICE:
  • Once when right pointer includes it
  • Once when left pointer excludes it

Total operations: 2n = O(n)

Even though there's a while loop inside the for loop,
the LEFT pointer only moves forward, never backward.
So total left pointer movements across all iterations = n.

This is called AMORTIZED analysis:
  Single iteration might do O(n) work
  But total across ALL iterations is O(n)
  Average per iteration: O(1)
\`\`\`

### Space Complexity Patterns

\`\`\`
Window Type         Typical Space
───────────────────────────────────────
Counter-based       O(1) or O(26)
  (e.g., max ones, char replacement)

HashSet-based       O(min(n, charset))
  (e.g., unique substring)

HashMap-based       O(k) where k = distinct elements
  (e.g., K distinct chars)

Freq array-based    O(26) or O(128) = O(1)
  (e.g., anagram matching)

Deque-based         O(k) where k = window size
  (e.g., sliding max/min)
\`\`\`
`,
  },
  {
    slug: 'advanced-topics',
    title: 'Advanced Topics',
    icon: 'Sparkles',
    description: 'Round out your prep with backtracking, binary search, bit manipulation, math, and interview strategy.',
    color: 'rose',
    content: `# Advanced Topics — Complete Interview Guide

## Table of Contents
- [Core Concepts](#core-concepts)
- [Backtracking](#backtracking)
- [Binary Search Advanced](#binary-search-advanced)
- [Bit Manipulation](#bit-manipulation)
- [Sorting Algorithms](#sorting-algorithms)
- [Math & Number Theory](#math--number-theory)
- [Complete Java Implementations](#complete-java-implementations)
- [Worked Examples](#worked-examples)
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Practice Problems](#practice-problems)

---

## 🧠 Core Concepts

### Overview

This section covers essential techniques that don\'t fit neatly into other categories
but appear frequently in interviews:

- **Backtracking**: Generate all valid combinations/permutations, constraint satisfaction
- **Binary Search**: Beyond sorted arrays — search on answer space, rotated arrays
- **Bit Manipulation**: O(1) tricks with XOR, AND, OR, shifting
- **Sorting**: Understanding Java\'s built-in sorts and when each applies
- **Math**: GCD, primes, modular arithmetic

---

## 🌲 Backtracking

### The Backtracking Template

\`\`\`
BACKTRACKING = DFS + PRUNING + UNDO

void backtrack(state, choices) {
    if (isGoal(state)) {
        result.add(copy(state));
        return;
    }
    for (choice in choices) {
        if (isValid(choice)) {     // Prune invalid branches
            makeChoice(state);       // Choose
            backtrack(state, nextChoices);  // Explore
            undoChoice(state);       // Un-choose (backtrack!)
        }
    }
}

Key insight: We explore a decision TREE.
At each node, we make a choice, explore, then UNDO and try next choice.
\`\`\`

### Decision Tree for Subsets [1,2,3]

\`\`\`
SUBSETS DECISION TREE

At each number, decide: INCLUDE or EXCLUDE?

                          []
                    /            \
              include 1        exclude 1
                [1]               []
              /      \          /      \
         inc 2      exc 2   inc 2    exc 2
         [1,2]      [1]     [2]       []
         /   \     /   \   /   \    /   \
       i3   e3   i3   e3 i3   e3  i3   e3
     [1,2,3][1,2][1,3][1][2,3][2] [3]  []

Leaves (all subsets):
[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]

Total: 2^3 = 8 subsets
\`\`\`

\`\`\`java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrackSubsets(nums, 0, new ArrayList<>(), result);
    return result;
}

void backtrackSubsets(int[] nums, int start, List<Integer> current,
                      List<List<Integer>> result) {
    result.add(new ArrayList<>(current));  // Add every node (not just leaves)

    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);              // Choose
        backtrackSubsets(nums, i + 1, current, result);  // Explore
        current.remove(current.size() - 1); // Un-choose
    }
}
\`\`\`

### Permutations Tree — Swap-Based Generation

\`\`\`
PERMUTATIONS OF [1, 2, 3]

Level 0: Fix position 0
                      [1, 2, 3]
                    /     |      \
            swap(0,0)  swap(0,1)  swap(0,2)
              /           |           \
Level 1: [1,2,3]      [2,1,3]      [3,2,1]
          /    \       /    \       /    \
     sw(1,1) sw(1,2) sw(1,1) sw(1,2) sw(1,1) sw(1,2)
        |       |      |       |      |       |
Level 2: [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,2,1] [3,1,2]

All 3! = 6 permutations generated.
\`\`\`

\`\`\`java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrackPermute(nums, 0, result);
    return result;
}

void backtrackPermute(int[] nums, int start, List<List<Integer>> result) {
    if (start == nums.length) {
        List<Integer> perm = new ArrayList<>();
        for (int n : nums) perm.add(n);
        result.add(perm);
        return;
    }
    for (int i = start; i < nums.length; i++) {
        swap(nums, start, i);              // Choose
        backtrackPermute(nums, start + 1, result);  // Explore
        swap(nums, start, i);              // Un-choose
    }
}

void swap(int[] arr, int i, int j) {
    int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
}
\`\`\`

### N-Queens — Board States with Backtracking

\`\`\`
N-QUEENS (N=4): Place 4 queens so none attack each other

Step 1: Place Q at (0,0)    Step 2: Try row 1
  Q . . .                     Q . . .
  . . . .                     . . Q .  ← (1,2) safe
  . . . .                     . . . .
  . . . .                     . . . .

Step 3: Try row 2             Step 4: row 2 all fail!
  Q . . .                     Backtrack step 2!
  . . Q .                     Q . . .
  . ? ? ?  ← NO safe spot!    . . . Q  ← try (1,3) instead
  . . . .                     . . . .

Step 5: Try row 2             Step 6: Try row 3
  Q . . .                     Q . . .
  . . . Q                     . . . Q
  . Q . .  ← (2,1) safe       . Q . .
  . . . .                     . . . ?  ← NO safe spot!

Backtrack all the way...       Solution found:
                               . Q . .
                               . . . Q
                               Q . . .
                               . . Q .

Another solution:              . . Q .
                               Q . . .
                               . . . Q
                               . Q . .
\`\`\`

\`\`\`java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    boolean[] cols = new boolean[n];
    boolean[] diag1 = new boolean[2 * n];  // row - col + n
    boolean[] diag2 = new boolean[2 * n];  // row + col
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');

    backtrackQueens(board, 0, cols, diag1, diag2, result);
    return result;
}

void backtrackQueens(char[][] board, int row, boolean[] cols,
                     boolean[] diag1, boolean[] diag2,
                     List<List<String>> result) {
    int n = board.length;
    if (row == n) {
        List<String> solution = new ArrayList<>();
        for (char[] r : board) solution.add(new String(r));
        result.add(solution);
        return;
    }
    for (int col = 0; col < n; col++) {
        int d1 = row - col + n, d2 = row + col;
        if (cols[col] || diag1[d1] || diag2[d2]) continue;  // Prune!

        board[row][col] = 'Q';
        cols[col] = diag1[d1] = diag2[d2] = true;
        backtrackQueens(board, row + 1, cols, diag1, diag2, result);
        board[row][col] = '.';
        cols[col] = diag1[d1] = diag2[d2] = false;  // Undo!
    }
}
\`\`\`

---

## 🔍 Binary Search Advanced

### Binary Search Variants

\`\`\`
BINARY SEARCH VARIANT COMPARISON

1. Standard: Find exact target
2. Lower Bound: Find FIRST occurrence of target
3. Upper Bound: Find LAST occurrence of target
4. Condition-based: Find first element satisfying condition
5. Rotated Array: Which half is sorted?
6. Search on Answer: Binary search the answer space
\`\`\`

### Standard Binary Search

\`\`\`
nums = [1, 3, 5, 7, 9, 11, 13], target = 7

Step 1: L=0, R=6, mid=3  nums[3]=7 == target → FOUND!
        [1, 3, 5, [7], 9, 11, 13]
                   ↑
                  found

But what if target = 8?
Step 1: L=0, R=6, mid=3  nums[3]=7 < 8  → L=4
Step 2: L=4, R=6, mid=5  nums[5]=11 > 8 → R=4
Step 3: L=4, R=4, mid=4  nums[4]=9 > 8  → R=3
Step 4: L=4, R=3  L > R → NOT FOUND
\`\`\`

\`\`\`java
public int binarySearch(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
\`\`\`

### Lower Bound (First Occurrence)

\`\`\`
nums = [1, 3, 5, 5, 5, 7, 9], target = 5

Standard search might return index 3 (any of the 5s).
Lower bound always returns FIRST occurrence (index 2).

Step 1: L=0, R=6, mid=3  nums[3]=5 == target → R=mid-1=2
        (Don\'t return! There might be earlier 5s)
Step 2: L=0, R=2, mid=1  nums[1]=3 < 5 → L=2
Step 3: L=2, R=2, mid=2  nums[2]=5 == target → R=1
Step 4: L=2, R=1  L > R → return L=2 (first occurrence)
\`\`\`

\`\`\`java
// Returns first index where nums[i] >= target
public int lowerBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}
\`\`\`

### Search in Rotated Sorted Array (LC 33)

\`\`\`
ROTATED ARRAY: Which half is sorted?

nums = [4, 5, 6, 7, 0, 1, 2], target = 0

Step 1: L=0, R=6, mid=3  nums[3]=7
        Left half [4,5,6,7] is sorted (nums[L]=4 ≤ nums[mid]=7)
        target=0 NOT in [4,7] → search right: L=4
        [4, 5, 6, 7, |0, 1, 2]
                       ← search here

Step 2: L=4, R=6, mid=5  nums[5]=1
        Left half [0,1] is sorted (nums[L]=0 ≤ nums[mid]=1)
        target=0 IS in [0,1] → search left: R=5
        [0, 1,| 2]
         ← here

Step 3: L=4, R=5, mid=4  nums[4]=0 == target → FOUND at index 4!
\`\`\`

\`\`\`java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;

        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;  // Target in sorted left half
            } else {
                left = mid + 1;   // Target in right half
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;   // Target in sorted right half
            } else {
                right = mid - 1;  // Target in left half
            }
        }
    }
    return -1;
}
\`\`\`

### Binary Search on Answer Space

\`\`\`
CAPACITY TO SHIP PACKAGES (LC 1011)

weights = [1,2,3,4,5,6,7,8,9,10], days = 5

Answer must be between max(weights)=10 and sum(weights)=55
Binary search: what\'s the minimum capacity?

mid=32: can ship in 2 days → too much, try less  R=31
mid=20: can ship in 3 days → still feasible      R=19
mid=15: can ship in 5 days → exactly 5, feasible  R=14
mid=12: can ship in 5 days → feasible             R=11
mid=11: can ship in 5 days → feasible             R=10
mid=10: need 6 days → too few capacity            L=11

Answer: 15
\`\`\`

\`\`\`java
public int shipWithinDays(int[] weights, int days) {
    int left = 0, right = 0;
    for (int w : weights) {
        left = Math.max(left, w);
        right += w;
    }

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (canShip(weights, days, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

boolean canShip(int[] weights, int days, int capacity) {
    int d = 1, load = 0;
    for (int w : weights) {
        if (load + w > capacity) {
            d++;
            load = 0;
        }
        load += w;
    }
    return d <= days;
}
\`\`\`

---

## 💡 Bit Manipulation

### Essential Bit Operations

\`\`\`
BIT MANIPULATION CHEAT SHEET

Operation         Example (n=12 = 1100)     Result
──────────────────────────────────────────────────────────────
n & (n-1)         1100 & 1011 = 1000        Remove lowest set bit
n & (-n)          1100 & 0100 = 0100        Isolate lowest set bit
n | (1 << k)      1100 | 0010 = 1110        Set bit k
n & ~(1 << k)     1100 & 1011 = 1000        Clear bit k
n ^ (1 << k)      1100 ^ 0010 = 1110        Toggle bit k
(n >> k) & 1      (1100 >> 2) & 1 = 1       Get bit k
\`\`\`

### Key Trick: n & (n-1)

\`\`\`
n = 12:       1100
n - 1 = 11:  1011
n & (n-1):   1000  ← removed lowest set bit!

Use case: Count set bits (Brian Kernighan\'s algorithm)
  n=12: 1100 → 1000 → 0000  (2 iterations = 2 set bits)

Use case: Check power of 2
  Powers of 2 have exactly ONE set bit:
  8 = 1000, 8 & 7 = 1000 & 0111 = 0000 → true
  6 = 0110, 6 & 5 = 0110 & 0101 = 0100 → false
\`\`\`

### XOR Tricks

\`\`\`
XOR PROPERTIES:
  a ^ a = 0     (same values cancel)
  a ^ 0 = a     (zero is identity)
  a ^ b = b ^ a (commutative)
  (a ^ b) ^ c = a ^ (b ^ c)  (associative)

SINGLE NUMBER (LC 136):
  Find the element that appears once (all others appear twice)

  [4, 1, 2, 1, 2]

  4 ^ 1 ^ 2 ^ 1 ^ 2
  = 4 ^ (1 ^ 1) ^ (2 ^ 2)
  = 4 ^ 0 ^ 0
  = 4  ← The single number!
\`\`\`

\`\`\`java
public int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) {
        result ^= n;
    }
    return result;
}

// Count set bits
public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1);  // Remove lowest set bit
        count++;
    }
    return count;
}

// Check power of 2
public boolean isPowerOfTwo(int n) {
    return n > 0 && (n & (n - 1)) == 0;
}

// Get ith bit
public int getBit(int n, int i) {
    return (n >> i) & 1;
}

// Set ith bit
public int setBit(int n, int i) {
    return n | (1 << i);
}
\`\`\`

---

## 📊 Sorting Algorithms

### Complete Comparison Table

\`\`\`
SORTING ALGORITHM COMPARISON

Algorithm     Best      Avg       Worst     Space    Stable  In-place
─────────────────────────────────────────────────────────────────────────
Bubble        O(n)      O(n²)     O(n²)     O(1)     Yes     Yes
Selection     O(n²)     O(n²)     O(n²)     O(1)     No      Yes
Insertion     O(n)      O(n²)     O(n²)     O(1)     Yes     Yes
Merge Sort    O(nlogn)  O(nlogn)  O(nlogn)  O(n)     Yes     No
Quick Sort    O(nlogn)  O(nlogn)  O(n²)     O(logn)  No      Yes
Heap Sort     O(nlogn)  O(nlogn)  O(nlogn)  O(1)     No      Yes
Counting      O(n+k)    O(n+k)    O(n+k)    O(k)     Yes     No
Radix         O(d(n+k)) O(d(n+k)) O(d(n+k)) O(n+k)   Yes     No
Bucket        O(n+k)    O(n+k)    O(n²)     O(n)     Yes     No

Legend: n = array size, k = range of values, d = number of digits
\`\`\`

### Java\'s Sort Internals

\`\`\`
JAVA SORTING UNDER THE HOOD

Arrays.sort(int[]):       Dual-Pivot Quicksort
  • For primitives (int, long, double, etc.)
  • Average O(n log n), worst O(n²) (rare with dual pivot)
  • Not stable (but primitives don\'t need stability)
  • Switches to insertion sort for small arrays (< 47 elements)

Arrays.sort(Object[]):    TimSort
  • For objects (String, Integer, custom classes)
  • Hybrid of merge sort + insertion sort
  • O(n log n) worst case guaranteed
  • Stable (preserves order of equal elements)
  • Takes advantage of existing order in data
  • Excellent for nearly-sorted data: O(n)

Collections.sort():       Uses Arrays.sort (TimSort)
  • Converts List to array, sorts, converts back

When to mention in interviews:
  "I\'ll use Arrays.sort which is O(n log n) — it uses dual-pivot
   quicksort for primitives and TimSort for objects."
\`\`\`

### Merge Sort Implementation

\`\`\`java
public void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = left + (right - left) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

void merge(int[] arr, int left, int mid, int right) {
    int[] temp = new int[right - left + 1];
    int i = left, j = mid + 1, k = 0;

    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp[k++] = arr[i++];
        else temp[k++] = arr[j++];
    }
    while (i <= mid) temp[k++] = arr[i++];
    while (j <= right) temp[k++] = arr[j++];

    System.arraycopy(temp, 0, arr, left, temp.length);
}
\`\`\`

### Quick Sort Implementation

\`\`\`java
public void quickSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int pivotIdx = partition(arr, left, right);
    quickSort(arr, left, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, right);
}

int partition(int[] arr, int left, int right) {
    int pivot = arr[right];
    int i = left;
    for (int j = left; j < right; j++) {
        if (arr[j] < pivot) {
            swap(arr, i, j);
            i++;
        }
    }
    swap(arr, i, right);
    return i;
}
\`\`\`

---

## 🔢 Math & Number Theory

### Sieve of Eratosthenes — Visual

\`\`\`
SIEVE OF ERATOSTHENES: Find all primes up to 30

Initial:  2  3  4  5  6  7  8  9 10 11 12 13 14 15
         16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

Cross out multiples of 2:
          2  3  X  5  X  7  X  9  X 11  X 13  X 15
          X 17  X 19  X 21  X 23  X 25  X 27  X 29  X

Cross out multiples of 3:
          2  3  X  5  X  7  X  X  X 11  X 13  X  X
          X 17  X 19  X  X  X 23  X 25  X  X  X 29  X

Cross out multiples of 5:
          2  3  X  5  X  7  X  X  X 11  X 13  X  X
          X 17  X 19  X  X  X 23  X  X  X  X  X 29  X

Stop at sqrt(30) ≈ 5.

Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
\`\`\`

\`\`\`java
public List<Integer> sieve(int n) {
    boolean[] isComposite = new boolean[n + 1];
    List<Integer> primes = new ArrayList<>();

    for (int i = 2; i <= n; i++) {
        if (!isComposite[i]) {
            primes.add(i);
            // Mark multiples starting from i*i
            for (long j = (long) i * i; j <= n; j += i) {
                isComposite[(int) j] = true;
            }
        }
    }
    return primes;
}
\`\`\`

### GCD (Euclidean Algorithm)

\`\`\`
GCD(48, 18):
  48 = 2 × 18 + 12
  18 = 1 × 12 + 6
  12 = 2 × 6  + 0   → GCD = 6

LCM(a, b) = a × b / GCD(a, b)
\`\`\`

\`\`\`java
public int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

public int lcm(int a, int b) {
    return a / gcd(a, b) * b;  // Divide first to avoid overflow
}
\`\`\`

### Fast Exponentiation

\`\`\`java
// Calculate base^exp % mod in O(log exp) time
public long power(long base, long exp, long mod) {
    long result = 1;
    base %= mod;
    while (exp > 0) {
        if ((exp & 1) == 1) {
            result = result * base % mod;
        }
        exp >>= 1;
        base = base * base % mod;
    }
    return result;
}
\`\`\`

---

## 📝 Worked Examples

### Subsets [1,2,3] — Complete Trace

\`\`\`
backtrack(start=0, current=[])
  → result: [[]]
  i=0: add 1 → backtrack(1, [1])
    → result: [[], [1]]
    i=1: add 2 → backtrack(2, [1,2])
      → result: [[], [1], [1,2]]
      i=2: add 3 → backtrack(3, [1,2,3])
        → result: [[], [1], [1,2], [1,2,3]]
        return (start=3 == length)
      remove 3
    remove 2
    i=2: add 3 → backtrack(3, [1,3])
      → result: [[], [1], [1,2], [1,2,3], [1,3]]
      return
    remove 3
  remove 1
  i=1: add 2 → backtrack(2, [2])
    → result: [..., [2]]
    i=2: add 3 → backtrack(3, [2,3])
      → result: [..., [2], [2,3]]
    remove 3
  remove 2
  i=2: add 3 → backtrack(3, [3])
    → result: [..., [3]]
  remove 3

Final: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
\`\`\`

### Search in Rotated Array — Binary Search Trace

\`\`\`
nums = [4, 5, 6, 7, 0, 1, 2], target = 0

Step 1: L=0 R=6 mid=3 val=7
  Left sorted [4..7], target=0 NOT in [4,7]
  → L=4

Step 2: L=4 R=6 mid=5 val=1
  Left sorted [0..1], target=0 IS in [0,1]
  → R=5

Step 3: L=4 R=5 mid=4 val=0
  Found! Return 4

nums = [4, 5, 6, 7, 0, 1, 2], target = 3

Step 1: L=0 R=6 mid=3 val=7
  Left sorted [4..7], target=3 NOT in [4,7]
  → L=4

Step 2: L=4 R=6 mid=5 val=1
  Left sorted [0..1], target=3 NOT in [0,1]
  → L=6

Step 3: L=6 R=6 mid=6 val=2
  2 != 3, left sorted [2..2], 3 NOT in [2,2]
  → L=7 > R → NOT FOUND
\`\`\`

### Single Number — XOR Trace

\`\`\`
nums = [2, 3, 4, 3, 2]

result = 0
result ^= 2: 00 ^ 10 = 10  (binary)
result ^= 3: 10 ^ 11 = 01
result ^= 4: 01 ^ 100 = 101
result ^= 3: 101 ^ 011 = 110
result ^= 2: 110 ^ 010 = 100 = 4

Answer: 4  (the single number)
\`\`\`

### N-Queens 4×4 — Complete Backtrack Trace

\`\`\`
Row 0: try col 0
  Q . . .
  Row 1: try col 0 ← BLOCKED (same column)
         try col 1 ← BLOCKED (diagonal)
         try col 2 ✓
    Q . . .
    . . Q .
    Row 2: try col 0 ← BLOCKED (diagonal from Q at (1,2))
           try col 1 ← BLOCKED (diagonal from Q at (0,0))
           try col 2 ← BLOCKED (column)
           try col 3 ← BLOCKED (diagonal from Q at (1,2))
    BACKTRACK! Undo (1,2)
         try col 3 ✓
    Q . . .
    . . . Q
    Row 2: try col 1 ✓
      Q . . .
      . . . Q
      . Q . .
      Row 3: try col 0 ← BLOCKED
             try col 1 ← BLOCKED
             try col 2 ← BLOCKED
             try col 3 ← BLOCKED
      BACKTRACK! Undo (2,1)
    BACKTRACK! Undo (1,3)
  BACKTRACK! Undo (0,0)

Row 0: try col 1
  . Q . .
  Row 1: try col 3 ✓
    . Q . .
    . . . Q
    Row 2: try col 0 ✓
      . Q . .
      . . . Q
      Q . . .
      Row 3: try col 2 ✓ ← SOLUTION FOUND!
        . Q . .
        . . . Q
        Q . . .
        . . Q .

Continue to find second solution...
  . . Q .
  Q . . .
  . . . Q
  . Q . .
\`\`\`

---

## 🎯 Pattern Recognition

\`\`\`
ADVANCED TOPICS DECISION GUIDE

Problem type:                     Technique:
─────────────────────────────────   ────────────────────────────
Generate all subsets              Backtracking (2^n)
Generate all permutations         Backtracking (n!)
Constraint satisfaction           Backtracking + pruning
Find in sorted array              Binary search O(log n)
Find min satisfying condition     Binary search on answer
Find in rotated array             Modified binary search
Find single/missing number        XOR trick
Check power of 2                  n & (n-1) == 0
Count set bits                    Brian Kernighan\'s
Find GCD                          Euclidean algorithm
Find all primes up to n           Sieve O(n log log n)
Sort in interview                 Arrays.sort O(n log n)
Custom sort order                 Comparator lambda
\`\`\`

---

## ⚡ Complexity Cheat Sheet

| Problem | Technique | Time | Space |
|---|---|---|---|
| Subsets | Backtracking | O(n × 2^n) | O(n) |
| Permutations | Backtracking | O(n × n!) | O(n) |
| N-Queens | Backtracking + pruning | O(n!) | O(n) |
| Combination Sum | Backtracking | O(2^target) | O(target) |
| Binary Search | Standard | O(log n) | O(1) |
| Search Rotated | Modified BS | O(log n) | O(1) |
| BS on Answer | Condition BS | O(n × log range) | O(1) |
| Single Number | XOR | O(n) | O(1) |
| Count Bits | Kernighan\'s | O(bits) | O(1) |
| Power of 2 | Bit trick | O(1) | O(1) |
| Sieve of Eratosthenes | Sieve | O(n log log n) | O(n) |
| GCD | Euclidean | O(log n) | O(1) |
| Merge Sort | Divide & Conquer | O(n log n) | O(n) |
| Quick Sort | Divide & Conquer | O(n log n) avg | O(log n) |

---

## 📋 Practice Problems

### Backtracking

| Problem | Key Technique | Difficulty |
|---|---|---|
| 78. Subsets | Include/exclude pattern | Medium |
| 90. Subsets II | Skip duplicates | Medium |
| 46. Permutations | Swap-based generation | Medium |
| 47. Permutations II | Sort + skip duplicates | Medium |
| 39. Combination Sum | Unbounded choices | Medium |
| 40. Combination Sum II | Bounded + skip dupes | Medium |
| 77. Combinations | Choose k from n | Medium |
| 51. N-Queens | Board constraint pruning | Hard |
| 37. Sudoku Solver | Cell-by-cell constraint | Hard |
| 79. Word Search | Grid backtracking | Medium |
| 131. Palindrome Partitioning | String partitioning | Medium |
| 22. Generate Parentheses | Open/close count constraint | Medium |

### Binary Search

| Problem | Key Technique | Difficulty |
|---|---|---|
| 704. Binary Search | Standard | Easy |
| 33. Search in Rotated Array | Which half sorted? | Medium |
| 153. Find Minimum in Rotated | Modified BS | Medium |
| 34. First and Last Position | Lower/upper bound | Medium |
| 74. Search 2D Matrix | Flatten to 1D | Medium |
| 875. Koko Eating Bananas | BS on answer | Medium |
| 1011. Capacity to Ship | BS on answer | Medium |
| 4. Median of Two Sorted | BS on partition | Hard |

### Bit Manipulation

| Problem | Key Technique | Difficulty |
|---|---|---|
| 136. Single Number | XOR all elements | Easy |
| 191. Number of 1 Bits | Kernighan\'s algorithm | Easy |
| 231. Power of Two | n & (n-1) == 0 | Easy |
| 268. Missing Number | XOR with indices | Easy |
| 338. Counting Bits | DP + bit trick | Easy |
| 201. Bitwise AND of Range | Common prefix | Medium |
| 137. Single Number II | Bit counting | Medium |
| 260. Single Number III | XOR + grouping | Medium |

### Sorting & Math

| Problem | Key Technique | Difficulty |
|---|---|---|
| 204. Count Primes | Sieve of Eratosthenes | Medium |
| 179. Largest Number | Custom comparator | Medium |
| 148. Sort List | Merge sort on linked list | Medium |
| 215. Kth Largest | Quickselect | Medium |
| 347. Top K Frequent | Bucket sort | Medium |
| 50. Pow(x, n) | Fast exponentiation | Medium |
| 7. Reverse Integer | Math + overflow check | Medium |
| 172. Factorial Trailing Zeroes | Count factors of 5 | Medium |


---

## 💡 Advanced Backtracking Patterns

### Combination Sum (LC 39)

\`\`\`
candidates = [2, 3, 6, 7], target = 7

Decision tree (can reuse elements):
                        target=7
                    /    |    |    \
                  -2    -3   -6    -7
               t=5   t=4   t=1   t=0 ✓ [7]
              / | \   / | \    |
            -2 -3 -6 -2 -3 -6  No valid
           t=3 t=2 ...  t=2 t=1
          / |     |    / |
        -2 -3    -2   -2 -3
       t=1 t=0✓ t=0✓  t=0✓ No
            [2,2,3] [3,2,2]?
            Skip (avoid duplicates by starting from current index)

Results: [2,2,3], [7]
\`\`\`

\`\`\`java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

void backtrack(int[] candidates, int remaining, int start,
               List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) continue;
        current.add(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);
        current.remove(current.size() - 1);
    }
}
\`\`\`

### Generate Parentheses (LC 22)

\`\`\`
n = 3: generate all valid combinations of 3 pairs of parentheses

Decision: at each step, add '(' or ')' if valid

Constraints:
  open < n:       can add '('
  close < open:   can add ')'

Tree:
                          ""
                         /
                        (
                      /    \
                    ((      ()
                   / \       \
                 (((  (()     ()(
                  |   / \      \
               ((()  (()( (()) ()((
                 |    |    |     |
              ((())) (()() (())( ()(()
                       |    |     |
                     (()()) (())() ()(()?No
                                   ()(()
                                     |
                                   ()(())

Results: ((())), (()()),  (())(), ()(()),  ()()()
\`\`\`

\`\`\`java
public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    backtrackParens("", 0, 0, n, result);
    return result;
}

void backtrackParens(String current, int open, int close,
                     int n, List<String> result) {
    if (current.length() == 2 * n) {
        result.add(current);
        return;
    }
    if (open < n) {
        backtrackParens(current + "(", open + 1, close, n, result);
    }
    if (close < open) {
        backtrackParens(current + ")", open, close + 1, n, result);
    }
}
\`\`\`

### Word Search (LC 79)

\`\`\`java
public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(board, word, i, j, 0)) return true;
        }
    }
    return false;
}

boolean dfs(char[][] board, String word, int i, int j, int k) {
    if (k == word.length()) return true;
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return false;
    if (board[i][j] != word.charAt(k)) return false;

    char temp = board[i][j];
    board[i][j] = '#';  // Mark visited

    boolean found = dfs(board, word, i+1, j, k+1)
                 || dfs(board, word, i-1, j, k+1)
                 || dfs(board, word, i, j+1, k+1)
                 || dfs(board, word, i, j-1, k+1);

    board[i][j] = temp;  // Unmark (backtrack!)
    return found;
}
\`\`\`

---

## 🔍 More Binary Search Applications

### Koko Eating Bananas (LC 875)

\`\`\`
piles = [3, 6, 7, 11], hours = 8

Binary search on eating speed k:
  min speed = 1, max speed = max(piles) = 11

mid=6: hours needed = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
       = 1+1+2+2 = 6 ≤ 8 → feasible, try lower  R=6
mid=3: hours = 1+2+3+4 = 10 > 8 → too slow  L=4
mid=5: hours = 1+2+2+3 = 8 ≤ 8 → feasible  R=5
mid=4: hours = 1+2+2+3 = 8 ≤ 8 → feasible  R=4
L=4 == R=4 → Answer: k=4
\`\`\`

\`\`\`java
public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 1;
    for (int p : piles) right = Math.max(right, p);

    while (left < right) {
        int mid = left + (right - left) / 2;
        int hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;  // ceil division
        if (hours <= h) right = mid;
        else left = mid + 1;
    }
    return left;
}
\`\`\`

### Find Minimum in Rotated Sorted Array (LC 153)

\`\`\`
nums = [3, 4, 5, 1, 2]

Step 1: L=0 R=4 mid=2 val=5
  nums[mid]=5 > nums[R]=2 → min is in right half
  L=3

Step 2: L=3 R=4 mid=3 val=1
  nums[mid]=1 ≤ nums[R]=2 → min is in left half (including mid)
  R=3

L=3 == R=3 → Answer: nums[3] = 1
\`\`\`

\`\`\`java
public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right]) {
            left = mid + 1;  // Min is in right half
        } else {
            right = mid;  // Min is in left half (or at mid)
        }
    }
    return nums[left];
}
\`\`\`

### Median of Two Sorted Arrays (LC 4)

\`\`\`
BINARY SEARCH ON PARTITION

nums1 = [1, 3, 8, 9, 15]
nums2 = [7, 11, 18, 19, 21, 25]

Total elements = 11, so median is at position 6

Binary search on partition of smaller array:
  Try cutting nums1 at position 2: [1,3 | 8,9,15]
  Then nums2 cut at position 4: [7,11,18,19 | 21,25]

  Left side: [1,3,7,11,18,19]  Right: [8,9,15,21,25]
  Check: max(left) ≤ min(right)?
  max(left of nums1)=3, max(left of nums2)=19
  min(right of nums1)=8, min(right of nums2)=21
  19 > 8? YES → bad partition, adjust
\`\`\`

---

## 💡 More Bit Manipulation Tricks

### Missing Number (LC 268)

\`\`\`
nums = [3, 0, 1]  (missing number from 0..3)

XOR approach:
  (0^1^2^3) ^ (3^0^1) = 2

  0 ^ 0 = 0 (cancel)
  1 ^ 1 = 0 (cancel)
  3 ^ 3 = 0 (cancel)
  2 remains!
\`\`\`

\`\`\`java
public int missingNumber(int[] nums) {
    int xor = nums.length;
    for (int i = 0; i < nums.length; i++) {
        xor ^= i ^ nums[i];
    }
    return xor;
}
\`\`\`

### Counting Bits (LC 338)

\`\`\`
For each number 0..n, count set bits:

n:     0    1    2    3    4    5    6    7    8
bits:  0    1    1    2    1    2    2    3    1
       0   01   10   11  100  101  110  111  1000

Pattern: dp[i] = dp[i >> 1] + (i & 1)
  dp[6] = dp[3] + 0 = 2 + 0 = 2
  dp[7] = dp[3] + 1 = 2 + 1 = 3
\`\`\`

\`\`\`java
public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
}
\`\`\`

### Subsets Using Bitmask

\`\`\`
nums = [1, 2, 3]
Use numbers 0..2^n-1 as bitmasks:

000 = 0: []
001 = 1: [1]
010 = 2: [2]
011 = 3: [1,2]
100 = 4: [3]
101 = 5: [1,3]
110 = 6: [2,3]
111 = 7: [1,2,3]
\`\`\`

\`\`\`java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                subset.add(nums[i]);
            }
        }
        result.add(subset);
    }
    return result;
}
\`\`\`

---

## 📊 Sorting Applications in Interviews

### Custom Comparators

\`\`\`java
// Sort by multiple criteria
Arrays.sort(intervals, (a, b) -> {
    if (a[0] != b[0]) return a[0] - b[0];  // By start
    return a[1] - b[1];                      // Then by end
});

// Largest Number (LC 179)
// "9" > "30" because "930" > "309"
Arrays.sort(nums, (a, b) -> {
    String s1 = a + "" + b;
    String s2 = b + "" + a;
    return s2.compareTo(s1);  // Descending
});

// Sort by frequency, then by value
Map<Integer, Integer> freq = new HashMap<>();
for (int n : nums) freq.merge(n, 1, Integer::sum);
Integer[] arr = Arrays.stream(nums).boxed().toArray(Integer[]::new);
Arrays.sort(arr, (a, b) -> {
    if (!freq.get(a).equals(freq.get(b)))
        return freq.get(a) - freq.get(b);
    return b - a;
});
\`\`\`

### Quick Select (Kth Largest Element)

\`\`\`java
public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;
    return quickSelect(nums, 0, nums.length - 1, target);
}

int quickSelect(int[] nums, int left, int right, int target) {
    int pivot = nums[right];
    int i = left;
    for (int j = left; j < right; j++) {
        if (nums[j] <= pivot) {
            swap(nums, i, j);
            i++;
        }
    }
    swap(nums, i, right);

    if (i == target) return nums[i];
    else if (i < target) return quickSelect(nums, i + 1, right, target);
    else return quickSelect(nums, left, i - 1, target);
}
\`\`\`

---

## 💡 Interview Strategy for Advanced Topics

\`\`\`
WHEN TO USE WHAT:

Backtracking:
  "Generate ALL valid..." -> definitely backtracking
  Key: always ask about constraints. n ≤ 15? Backtracking OK.

Binary Search:
  "Minimum X that satisfies..." -> BS on answer
  Sorted array + O(log n) hint -> standard BS
  "Rotated sorted" -> modified BS

Bit Manipulation:
  "Without extra space" + integers -> probably bits
  "Single element among duplicates" -> XOR
  "Power of 2" -> n & (n-1) == 0

Sorting:
  "Merge intervals" -> sort by start
  "Custom ordering" -> comparator
  "Kth element" -> quickselect O(n) avg

Math:
  "Count primes" -> Sieve
  "GCD/LCM" -> Euclidean
  "Power/modular" -> fast exponentiation
\`\`\`


---

## 💡 More Backtracking Problems

### Palindrome Partitioning (LC 131)

\`\`\`
s = "aab"

Decision tree: where to cut?
""
  "a" + partition("ab")
    "a" + "a" + partition("b")
      "a" + "a" + "b" ✓ -> ["a","a","b"]
    "a" + "ab" (not palindrome, skip)
  "aa" + partition("b")
    "aa" + "b" ✓ -> ["aa","b"]
  "aab" (not palindrome, skip)

Answer: [["a","a","b"], ["aa","b"]]
\`\`\`

\`\`\`java
public List<List<String>> partition(String s) {
    List<List<String>> result = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), result);
    return result;
}

void backtrack(String s, int start, List<String> current,
               List<List<String>> result) {
    if (start == s.length()) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int end = start + 1; end <= s.length(); end++) {
        String sub = s.substring(start, end);
        if (isPalindrome(sub)) {
            current.add(sub);
            backtrack(s, end, current, result);
            current.remove(current.size() - 1);
        }
    }
}

boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l++) != s.charAt(r--)) return false;
    }
    return true;
}
\`\`\`

### Letter Combinations of a Phone Number (LC 17)

\`\`\`
digits = "23"
2 -> "abc", 3 -> "def"

Tree:
            ""
     /      |      \
    a        b       c
  / | \   / | \   / | \
 ad ae af bd be bf cd ce cf

Answer: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
\`\`\`

\`\`\`java
private static final String[] MAPPING = {
    "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
};

public List<String> letterCombinations(String digits) {
    List<String> result = new ArrayList<>();
    if (digits.isEmpty()) return result;
    backtrack(digits, 0, new StringBuilder(), result);
    return result;
}

void backtrack(String digits, int idx, StringBuilder sb, List<String> result) {
    if (idx == digits.length()) {
        result.add(sb.toString());
        return;
    }
    String letters = MAPPING[digits.charAt(idx) - '0'];
    for (char c : letters.toCharArray()) {
        sb.append(c);
        backtrack(digits, idx + 1, sb, result);
        sb.deleteCharAt(sb.length() - 1);
    }
}
\`\`\`

---

## 🔍 More Binary Search Patterns

### Find First and Last Position (LC 34)

\`\`\`
nums = [5,7,7,8,8,10], target = 8

Find first: lower bound
  L=0 R=6 mid=3 val=8 >= 8  R=3
  L=0 R=3 mid=1 val=7 < 8   L=2
  L=2 R=3 mid=2 val=7 < 8   L=3
  L=3 R=3 done. First = 3

Find last: upper bound
  L=0 R=6 mid=3 val=8 <= 8  L=4
  L=4 R=6 mid=5 val=10 > 8  R=4
  L=4 R=4 done. Last = 4

Answer: [3, 4]
\`\`\`

\`\`\`java
public int[] searchRange(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
    int last = lowerBound(nums, target + 1) - 1;
    return new int[]{first, last};
}

int lowerBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}
\`\`\`

### Search a 2D Matrix (LC 74)

\`\`\`
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]
target = 3

Treat as 1D sorted array of size m*n:
  index 5 -> row = 5/4 = 1, col = 5%4 = 1 -> matrix[1][1] = 11

Binary search on virtual 1D array:
  L=0 R=11 mid=5 val=11 > 3  R=4
  L=0 R=4  mid=2 val=5 > 3   R=1
  L=0 R=1  mid=0 val=1 < 3   L=1
  L=1 R=1  mid=1 val=3 == 3  FOUND!
\`\`\`

\`\`\`java
public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int left = 0, right = m * n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}
\`\`\`

---

## 🔢 More Math Utilities

### Reverse Integer (LC 7)

\`\`\`java
public int reverse(int x) {
    int result = 0;
    while (x != 0) {
        int digit = x % 10;
        // Check overflow BEFORE multiplication
        if (result > Integer.MAX_VALUE / 10 ||
            result < Integer.MIN_VALUE / 10) return 0;
        result = result * 10 + digit;
        x /= 10;
    }
    return result;
}
\`\`\`

### Factorial Trailing Zeroes (LC 172)

\`\`\`
Trailing zeros come from factors of 10 = 2 × 5.
Since factors of 2 are more common, count factors of 5.

n = 25:
  25/5 = 5  (numbers divisible by 5: 5,10,15,20,25)
  25/25 = 1 (25 contributes an extra factor of 5)
  Total: 5 + 1 = 6 trailing zeros
\`\`\`

\`\`\`java
public int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        count += n / 5;
        n /= 5;
    }
    return count;
}
\`\`\`

### Happy Number (LC 202)

\`\`\`java
public boolean isHappy(int n) {
    int slow = n, fast = n;
    do {
        slow = digitSquareSum(slow);
        fast = digitSquareSum(digitSquareSum(fast));
    } while (slow != fast);
    return slow == 1;
}

int digitSquareSum(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}
\`\`\`

---

## 💡 Comprehensive Interview Tips

\`\`\`
TOP 10 INTERVIEW TIPS FOR ADVANCED TOPICS

1. KNOW YOUR COMPLEXITY: Always state time and space complexity.
   Interviewers ALWAYS ask.

2. BACKTRACKING: Draw the decision tree on whiteboard FIRST.
   It clarifies the solution before you code.

3. BINARY SEARCH: If the answer is monotonic (if x works,
   x+1 also works), use binary search on the answer.

4. BIT MANIPULATION: Mention it proactively when you see
   "without extra space" or "single element" hints.

5. SORT FIRST: Many problems become easy after sorting.
   "Can I sort the input?" is always worth asking.

6. EDGE CASES: Empty arrays, single elements, all same elements,
   overflow with large numbers.

7. JAVA SPECIFICS:
   - Arrays.sort() for primitives: dual-pivot quicksort
   - Collections.sort() for objects: TimSort
   - Use Arrays.sort(arr, (a,b) -> ...) for custom ordering

8. BACKTRACKING OPTIMIZATION: Prune early!
   Sort the input and skip invalid branches ASAP.

9. PRACTICE IMPLEMENTATION: Some problems (N-Queens, Sudoku)
   have long code. Practice writing them cleanly.

10. COMBINE TECHNIQUES: Many hard problems combine
    binary search + greedy, backtracking + DP, etc.
\`\`\`


---

## 💡 Advanced Backtracking Patterns

### Combination Sum (LC 39)

\`\`\`
candidates = [2, 3, 6, 7], target = 7

Decision tree (can reuse elements):
                        target=7
                    /    |    |    \
                  -2    -3   -6    -7
               t=5   t=4   t=1   t=0 ✓ [7]
              / | \   / | \    |
            -2 -3 -6 -2 -3 -6  No valid
           t=3 t=2 ...  t=2 t=1
          / |     |    / |
        -2 -3    -2   -2 -3
       t=1 t=0✓ t=0✓  t=0✓ No
            [2,2,3] [3,2,2]?
            Skip (avoid duplicates by starting from current index)

Results: [2,2,3], [7]
\`\`\`

\`\`\`java
public List<List<Integer>> combinationSum(int[] candidates, int target) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(candidates, target, 0, new ArrayList<>(), result);
    return result;
}

void backtrack(int[] candidates, int remaining, int start,
               List<Integer> current, List<List<Integer>> result) {
    if (remaining == 0) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = start; i < candidates.length; i++) {
        if (candidates[i] > remaining) continue;
        current.add(candidates[i]);
        backtrack(candidates, remaining - candidates[i], i, current, result);
        current.remove(current.size() - 1);
    }
}
\`\`\`

### Generate Parentheses (LC 22)

\`\`\`
n = 3: generate all valid combinations of 3 pairs of parentheses

Decision: at each step, add '(' or ')' if valid

Constraints:
  open < n:       can add '('
  close < open:   can add ')'

Tree:
                          ""
                         /
                        (
                      /    \
                    ((      ()
                   / \       \
                 (((  (()     ()(
                  |   / \      \
               ((()  (()( (()) ()((
                 |    |    |     |
              ((())) (()() (())( ()(()
                       |    |     |
                     (()()) (())() ()(()?No
                                   ()(()
                                     |
                                   ()(())

Results: ((())), (()()),  (())(), ()(()),  ()()()
\`\`\`

\`\`\`java
public List<String> generateParenthesis(int n) {
    List<String> result = new ArrayList<>();
    backtrackParens("", 0, 0, n, result);
    return result;
}

void backtrackParens(String current, int open, int close,
                     int n, List<String> result) {
    if (current.length() == 2 * n) {
        result.add(current);
        return;
    }
    if (open < n) {
        backtrackParens(current + "(", open + 1, close, n, result);
    }
    if (close < open) {
        backtrackParens(current + ")", open, close + 1, n, result);
    }
}
\`\`\`

### Word Search (LC 79)

\`\`\`java
public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (dfs(board, word, i, j, 0)) return true;
        }
    }
    return false;
}

boolean dfs(char[][] board, String word, int i, int j, int k) {
    if (k == word.length()) return true;
    if (i < 0 || i >= board.length || j < 0 || j >= board[0].length) return false;
    if (board[i][j] != word.charAt(k)) return false;

    char temp = board[i][j];
    board[i][j] = '#';  // Mark visited

    boolean found = dfs(board, word, i+1, j, k+1)
                 || dfs(board, word, i-1, j, k+1)
                 || dfs(board, word, i, j+1, k+1)
                 || dfs(board, word, i, j-1, k+1);

    board[i][j] = temp;  // Unmark (backtrack!)
    return found;
}
\`\`\`

---

## 🔍 More Binary Search Applications

### Koko Eating Bananas (LC 875)

\`\`\`
piles = [3, 6, 7, 11], hours = 8

Binary search on eating speed k:
  min speed = 1, max speed = max(piles) = 11

mid=6: hours needed = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
       = 1+1+2+2 = 6 ≤ 8 → feasible, try lower  R=6
mid=3: hours = 1+2+3+4 = 10 > 8 → too slow  L=4
mid=5: hours = 1+2+2+3 = 8 ≤ 8 → feasible  R=5
mid=4: hours = 1+2+2+3 = 8 ≤ 8 → feasible  R=4
L=4 == R=4 → Answer: k=4
\`\`\`

\`\`\`java
public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 1;
    for (int p : piles) right = Math.max(right, p);

    while (left < right) {
        int mid = left + (right - left) / 2;
        int hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;  // ceil division
        if (hours <= h) right = mid;
        else left = mid + 1;
    }
    return left;
}
\`\`\`

### Find Minimum in Rotated Sorted Array (LC 153)

\`\`\`
nums = [3, 4, 5, 1, 2]

Step 1: L=0 R=4 mid=2 val=5
  nums[mid]=5 > nums[R]=2 → min is in right half
  L=3

Step 2: L=3 R=4 mid=3 val=1
  nums[mid]=1 ≤ nums[R]=2 → min is in left half (including mid)
  R=3

L=3 == R=3 → Answer: nums[3] = 1
\`\`\`

\`\`\`java
public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] > nums[right]) {
            left = mid + 1;  // Min is in right half
        } else {
            right = mid;  // Min is in left half (or at mid)
        }
    }
    return nums[left];
}
\`\`\`

### Median of Two Sorted Arrays (LC 4)

\`\`\`
BINARY SEARCH ON PARTITION

nums1 = [1, 3, 8, 9, 15]
nums2 = [7, 11, 18, 19, 21, 25]

Total elements = 11, so median is at position 6

Binary search on partition of smaller array:
  Try cutting nums1 at position 2: [1,3 | 8,9,15]
  Then nums2 cut at position 4: [7,11,18,19 | 21,25]

  Left side: [1,3,7,11,18,19]  Right: [8,9,15,21,25]
  Check: max(left) ≤ min(right)?
  max(left of nums1)=3, max(left of nums2)=19
  min(right of nums1)=8, min(right of nums2)=21
  19 > 8? YES → bad partition, adjust
\`\`\`

---

## 💡 More Bit Manipulation Tricks

### Missing Number (LC 268)

\`\`\`
nums = [3, 0, 1]  (missing number from 0..3)

XOR approach:
  (0^1^2^3) ^ (3^0^1) = 2

  0 ^ 0 = 0 (cancel)
  1 ^ 1 = 0 (cancel)
  3 ^ 3 = 0 (cancel)
  2 remains!
\`\`\`

\`\`\`java
public int missingNumber(int[] nums) {
    int xor = nums.length;
    for (int i = 0; i < nums.length; i++) {
        xor ^= i ^ nums[i];
    }
    return xor;
}
\`\`\`

### Counting Bits (LC 338)

\`\`\`
For each number 0..n, count set bits:

n:     0    1    2    3    4    5    6    7    8
bits:  0    1    1    2    1    2    2    3    1
       0   01   10   11  100  101  110  111  1000

Pattern: dp[i] = dp[i >> 1] + (i & 1)
  dp[6] = dp[3] + 0 = 2 + 0 = 2
  dp[7] = dp[3] + 1 = 2 + 1 = 3
\`\`\`

\`\`\`java
public int[] countBits(int n) {
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    return dp;
}
\`\`\`

### Subsets Using Bitmask

\`\`\`
nums = [1, 2, 3]
Use numbers 0..2^n-1 as bitmasks:

000 = 0: []
001 = 1: [1]
010 = 2: [2]
011 = 3: [1,2]
100 = 4: [3]
101 = 5: [1,3]
110 = 6: [2,3]
111 = 7: [1,2,3]
\`\`\`

\`\`\`java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    int n = nums.length;
    for (int mask = 0; mask < (1 << n); mask++) {
        List<Integer> subset = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if ((mask & (1 << i)) != 0) {
                subset.add(nums[i]);
            }
        }
        result.add(subset);
    }
    return result;
}
\`\`\`

---

## 📊 Sorting Applications in Interviews

### Custom Comparators

\`\`\`java
// Sort by multiple criteria
Arrays.sort(intervals, (a, b) -> {
    if (a[0] != b[0]) return a[0] - b[0];  // By start
    return a[1] - b[1];                      // Then by end
});

// Largest Number (LC 179)
// "9" > "30" because "930" > "309"
Arrays.sort(nums, (a, b) -> {
    String s1 = a + "" + b;
    String s2 = b + "" + a;
    return s2.compareTo(s1);  // Descending
});

// Sort by frequency, then by value
Map<Integer, Integer> freq = new HashMap<>();
for (int n : nums) freq.merge(n, 1, Integer::sum);
Integer[] arr = Arrays.stream(nums).boxed().toArray(Integer[]::new);
Arrays.sort(arr, (a, b) -> {
    if (!freq.get(a).equals(freq.get(b)))
        return freq.get(a) - freq.get(b);
    return b - a;
});
\`\`\`

### Quick Select (Kth Largest Element)

\`\`\`java
public int findKthLargest(int[] nums, int k) {
    int target = nums.length - k;
    return quickSelect(nums, 0, nums.length - 1, target);
}

int quickSelect(int[] nums, int left, int right, int target) {
    int pivot = nums[right];
    int i = left;
    for (int j = left; j < right; j++) {
        if (nums[j] <= pivot) {
            swap(nums, i, j);
            i++;
        }
    }
    swap(nums, i, right);

    if (i == target) return nums[i];
    else if (i < target) return quickSelect(nums, i + 1, right, target);
    else return quickSelect(nums, left, i - 1, target);
}
\`\`\`

---

## 💡 Interview Strategy for Advanced Topics

\`\`\`
WHEN TO USE WHAT:

Backtracking:
  "Generate ALL valid..." -> definitely backtracking
  Key: always ask about constraints. n ≤ 15? Backtracking OK.

Binary Search:
  "Minimum X that satisfies..." -> BS on answer
  Sorted array + O(log n) hint -> standard BS
  "Rotated sorted" -> modified BS

Bit Manipulation:
  "Without extra space" + integers -> probably bits
  "Single element among duplicates" -> XOR
  "Power of 2" -> n & (n-1) == 0

Sorting:
  "Merge intervals" -> sort by start
  "Custom ordering" -> comparator
  "Kth element" -> quickselect O(n) avg

Math:
  "Count primes" -> Sieve
  "GCD/LCM" -> Euclidean
  "Power/modular" -> fast exponentiation
\`\`\`


---

## 💡 More Backtracking Problems

### Palindrome Partitioning (LC 131)

\`\`\`
s = "aab"

Decision tree: where to cut?
""
  "a" + partition("ab")
    "a" + "a" + partition("b")
      "a" + "a" + "b" ✓ -> ["a","a","b"]
    "a" + "ab" (not palindrome, skip)
  "aa" + partition("b")
    "aa" + "b" ✓ -> ["aa","b"]
  "aab" (not palindrome, skip)

Answer: [["a","a","b"], ["aa","b"]]
\`\`\`

\`\`\`java
public List<List<String>> partition(String s) {
    List<List<String>> result = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), result);
    return result;
}

void backtrack(String s, int start, List<String> current,
               List<List<String>> result) {
    if (start == s.length()) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int end = start + 1; end <= s.length(); end++) {
        String sub = s.substring(start, end);
        if (isPalindrome(sub)) {
            current.add(sub);
            backtrack(s, end, current, result);
            current.remove(current.size() - 1);
        }
    }
}

boolean isPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l++) != s.charAt(r--)) return false;
    }
    return true;
}
\`\`\`

### Letter Combinations of a Phone Number (LC 17)

\`\`\`
digits = "23"
2 -> "abc", 3 -> "def"

Tree:
            ""
     /      |      \
    a        b       c
  / | \   / | \   / | \
 ad ae af bd be bf cd ce cf

Answer: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
\`\`\`

\`\`\`java
private static final String[] MAPPING = {
    "", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"
};

public List<String> letterCombinations(String digits) {
    List<String> result = new ArrayList<>();
    if (digits.isEmpty()) return result;
    backtrack(digits, 0, new StringBuilder(), result);
    return result;
}

void backtrack(String digits, int idx, StringBuilder sb, List<String> result) {
    if (idx == digits.length()) {
        result.add(sb.toString());
        return;
    }
    String letters = MAPPING[digits.charAt(idx) - '0'];
    for (char c : letters.toCharArray()) {
        sb.append(c);
        backtrack(digits, idx + 1, sb, result);
        sb.deleteCharAt(sb.length() - 1);
    }
}
\`\`\`

---

## 🔍 More Binary Search Patterns

### Find First and Last Position (LC 34)

\`\`\`
nums = [5,7,7,8,8,10], target = 8

Find first: lower bound
  L=0 R=6 mid=3 val=8 >= 8  R=3
  L=0 R=3 mid=1 val=7 < 8   L=2
  L=2 R=3 mid=2 val=7 < 8   L=3
  L=3 R=3 done. First = 3

Find last: upper bound
  L=0 R=6 mid=3 val=8 <= 8  L=4
  L=4 R=6 mid=5 val=10 > 8  R=4
  L=4 R=4 done. Last = 4

Answer: [3, 4]
\`\`\`

\`\`\`java
public int[] searchRange(int[] nums, int target) {
    int first = lowerBound(nums, target);
    if (first == nums.length || nums[first] != target) return new int[]{-1, -1};
    int last = lowerBound(nums, target + 1) - 1;
    return new int[]{first, last};
}

int lowerBound(int[] nums, int target) {
    int left = 0, right = nums.length;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] < target) left = mid + 1;
        else right = mid;
    }
    return left;
}
\`\`\`

### Search a 2D Matrix (LC 74)

\`\`\`
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]
target = 3

Treat as 1D sorted array of size m*n:
  index 5 -> row = 5/4 = 1, col = 5%4 = 1 -> matrix[1][1] = 11

Binary search on virtual 1D array:
  L=0 R=11 mid=5 val=11 > 3  R=4
  L=0 R=4  mid=2 val=5 > 3   R=1
  L=0 R=1  mid=0 val=1 < 3   L=1
  L=1 R=1  mid=1 val=3 == 3  FOUND!
\`\`\`

\`\`\`java
public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int left = 0, right = m * n - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        int val = matrix[mid / n][mid % n];
        if (val == target) return true;
        else if (val < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}
\`\`\`

---

## 🔢 More Math Utilities

### Reverse Integer (LC 7)

\`\`\`java
public int reverse(int x) {
    int result = 0;
    while (x != 0) {
        int digit = x % 10;
        // Check overflow BEFORE multiplication
        if (result > Integer.MAX_VALUE / 10 ||
            result < Integer.MIN_VALUE / 10) return 0;
        result = result * 10 + digit;
        x /= 10;
    }
    return result;
}
\`\`\`

### Factorial Trailing Zeroes (LC 172)

\`\`\`
Trailing zeros come from factors of 10 = 2 × 5.
Since factors of 2 are more common, count factors of 5.

n = 25:
  25/5 = 5  (numbers divisible by 5: 5,10,15,20,25)
  25/25 = 1 (25 contributes an extra factor of 5)
  Total: 5 + 1 = 6 trailing zeros
\`\`\`

\`\`\`java
public int trailingZeroes(int n) {
    int count = 0;
    while (n >= 5) {
        count += n / 5;
        n /= 5;
    }
    return count;
}
\`\`\`

### Happy Number (LC 202)

\`\`\`java
public boolean isHappy(int n) {
    int slow = n, fast = n;
    do {
        slow = digitSquareSum(slow);
        fast = digitSquareSum(digitSquareSum(fast));
    } while (slow != fast);
    return slow == 1;
}

int digitSquareSum(int n) {
    int sum = 0;
    while (n > 0) {
        int d = n % 10;
        sum += d * d;
        n /= 10;
    }
    return sum;
}
\`\`\`

---

## 💡 Comprehensive Interview Tips

\`\`\`
TOP 10 INTERVIEW TIPS FOR ADVANCED TOPICS

1. KNOW YOUR COMPLEXITY: Always state time and space complexity.
   Interviewers ALWAYS ask.

2. BACKTRACKING: Draw the decision tree on whiteboard FIRST.
   It clarifies the solution before you code.

3. BINARY SEARCH: If the answer is monotonic (if x works,
   x+1 also works), use binary search on the answer.

4. BIT MANIPULATION: Mention it proactively when you see
   "without extra space" or "single element" hints.

5. SORT FIRST: Many problems become easy after sorting.
   "Can I sort the input?" is always worth asking.

6. EDGE CASES: Empty arrays, single elements, all same elements,
   overflow with large numbers.

7. JAVA SPECIFICS:
   - Arrays.sort() for primitives: dual-pivot quicksort
   - Collections.sort() for objects: TimSort
   - Use Arrays.sort(arr, (a,b) -> ...) for custom ordering

8. BACKTRACKING OPTIMIZATION: Prune early!
   Sort the input and skip invalid branches ASAP.

9. PRACTICE IMPLEMENTATION: Some problems (N-Queens, Sudoku)
   have long code. Practice writing them cleanly.

10. COMBINE TECHNIQUES: Many hard problems combine
    binary search + greedy, backtracking + DP, etc.
\`\`\`
`,
  }
];
