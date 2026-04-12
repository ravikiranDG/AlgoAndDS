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
    content: '# Heaps and Priority Queues — Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## 📌 Core Concepts\n\n### What is a Heap?\n\nA **heap** is a **complete binary tree** that satisfies the **heap property**, stored compactly as an **array**. "Complete" means every level is fully filled except possibly the last, which is filled left to right.\n\n| Type | Property | Root holds |\n|------|----------|------------|\n| **Min-Heap** | Every parent <= its children | Minimum element |\n| **Max-Heap** | Every parent >= its children | Maximum element |\n\n### Why Heaps?\n\nHeaps solve a fundamental problem: maintaining quick access to the extreme element (min or max) while supporting efficient insertions and deletions.\n\n| Operation | Sorted Array | Unsorted Array | Heap |\n|-----------|-------------|---------------|------|\n| Find min/max | O(1) | O(n) | **O(1)** |\n| Insert | O(n) | O(1) | **O(log n)** |\n| Delete min/max | O(n) | O(n) | **O(log n)** |\n| Build from n items | O(n log n) | O(n) | **O(n)** |\n\n### Java Classes\n\n\`\`\`java\n// Min-Heap (default)\nPriorityQueue<Integer> minHeap = new PriorityQueue<>();\n\n// Max-Heap\nPriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n\n// Custom Comparator — by frequency, then alphabetical\nPriorityQueue<String> pq = new PriorityQueue<>((a, b) -> {\n    if (freq.get(a) != freq.get(b)) return freq.get(b) - freq.get(a);\n    return a.compareTo(b);\n});\n\n// Comparator.comparing pattern\nPriorityQueue<int[]> pq2 = new PriorityQueue<>(\n    Comparator.comparingInt((int[] a) -> a[0])\n              .thenComparingInt(a -> a[1])\n);\n\`\`\`\n\n**Key PriorityQueue methods:**\n- \`offer(e)\` / \`add(e)\` — insert element, O(log n)\n- \`poll()\` — remove and return min/max, O(log n)\n- \`peek()\` — view min/max without removing, O(1)\n- \`remove(obj)\` — remove arbitrary element, O(n) (linear search!)\n- \`size()\`, \`isEmpty()\` — O(1)\n\n---\n\n## 🔍 Visual Deep Dive\n\n### Array Representation of a Heap\n\nA complete binary tree maps perfectly to an array with **zero wasted space**:\n\n\`\`\`\nTree View:                    Array View (0-indexed):\n                              Index: [0] [1] [2] [3] [4] [5] [6]\n        10                    Value: [10, 20, 15, 30, 40, 50, 25]\n       /  \\\n     20    15                 Parent-Child Formulas (0-indexed):\n    /  \\   / \\                ─────────────────────────────────\n  30   40 50  25              Parent of i    : (i - 1) / 2\n                              Left child of i : 2 * i + 1\n                              Right child of i: 2 * i + 2\n\nMapping:\n  Tree Node → Array Index\n  10 (root)  → [0]         parent(-) left(1) right(2)\n  20         → [1]         parent(0) left(3) right(4)\n  15         → [2]         parent(0) left(5) right(6)\n  30         → [3]         parent(1) left(-) right(-)\n  40         → [4]         parent(1) left(-) right(-)\n  50         → [5]         parent(2) left(-) right(-)\n  25         → [6]         parent(2) left(-) right(-)\n\`\`\`\n\n**Why arrays?** No pointer overhead, perfect cache locality, and parent/child navigation is simple arithmetic.\n\n### Heapify Up (Sift Up) — Used during Insert\n\nWhen we insert a new element, it goes to the **end** of the array (next available position in the complete tree). Then we "bubble it up" by comparing with its parent and swapping if the heap property is violated.\n\n**Example: Insert 5 into this min-heap:**\n\n\`\`\`\nStep 0 — Starting heap:         Array: [10, 20, 15, 30, 40]\n        10\n       /  \\\n     20    15\n    /  \\\n  30   40\n\nStep 1 — Add 5 at next position (index 5 = left child of 15):\n        10                      Array: [10, 20, 15, 30, 40, 5]\n       /  \\\n     20    15\n    /  \\   /\n  30  40  5\n  \n  Compare 5 with parent 15 (index 2): 5 < 15 → SWAP\n\nStep 2 — After first swap:\n        10                      Array: [10, 20, 5, 30, 40, 15]\n       /  \\\n     20     5\n    /  \\   /\n  30  40  15\n  \n  Compare 5 with parent 10 (index 0): 5 < 10 → SWAP\n\nStep 3 — After second swap (DONE — 5 is now root):\n         5                      Array: [5, 20, 10, 30, 40, 15]\n       /  \\\n     20    10\n    /  \\   /\n  30  40  15\n\`\`\`\n\n**Time: O(log n)** — at most we traverse the height of the tree.\n\n### Heapify Down (Sift Down) — Used during Extract/Delete\n\nWhen we remove the root (min or max), we replace it with the **last element** and then "bubble it down" by swapping with the **smaller child** (min-heap) or **larger child** (max-heap).\n\n**Example: Extract min from this min-heap:**\n\n\`\`\`\nStep 0 — Starting heap:         Array: [5, 20, 10, 30, 40, 15]\n         5\n       /  \\\n     20    10\n    /  \\   /\n  30  40  15\n\nStep 1 — Remove root, move last element (15) to root:\n        15                      Array: [15, 20, 10, 30, 40]\n       /  \\\n     20    10\n    /  \\\n  30   40\n  \n  Compare 15 with children: left=20, right=10\n  Smallest child is 10 (right): 15 > 10 → SWAP with right\n\nStep 2 — After swap:\n        10                      Array: [10, 20, 15, 30, 40]\n       /  \\\n     20    15\n    /  \\\n  30   40\n  \n  15 is now at index 2. Children would be at index 5, 6 → out of bounds.\n  No more children → DONE\n\`\`\`\n\n**Time: O(log n)** — at most we traverse the height of the tree.\n\n### Build Heap in O(n) — Why Not O(n log n)?\n\n**Approach:** Start from the last non-leaf node and heapify-down each node.\n\n\`\`\`\nInput array: [4, 10, 3, 5, 1]\n\nTree view:\n       4\n      / \\\n    10    3\n   /  \\\n  5    1\n\nLast non-leaf = index (n/2 - 1) = index 1 (value 10)\n\nStep 1: Heapify-down index 1 (value 10):\n  Children: 5, 1. Min child = 1. Swap 10 ↔ 1.\n       4                After: [4, 1, 3, 5, 10]\n      / \\\n     1    3\n   /  \\\n  5   10\n\nStep 2: Heapify-down index 0 (value 4):\n  Children: 1, 3. Min child = 1. Swap 4 ↔ 1.\n       1\n      / \\\n     4    3              After: [1, 4, 3, 5, 10]\n   /  \\\n  5   10\n  Children of 4: 5, 10. Min = 5. 4 < 5 → STOP.\n\nFinal min-heap: [1, 4, 3, 5, 10] ✓\n\`\`\`\n\n**Mathematical Proof that Build Heap is O(n), not O(n log n):**\n\n\`\`\`\nHeight h of a complete binary tree with n nodes: h = floor(log₂ n)\n\nNumber of nodes at height k: at most ceil(n / 2^(k+1))\n\nWork for each node at height k: O(k) — heapify-down traverses at most k levels\n\nTotal work = Σ (k=0 to h) [ceil(n / 2^(k+1)) × k]\n           ≤ n × Σ (k=0 to h) [k / 2^(k+1)]\n           = n × Σ (k=0 to ∞) [k / 2^(k+1)]\n           = n × 1                               (by the identity Σ k·x^k = x/(1-x)² with x=1/2)\n           = O(n)\n\nKey insight: Most nodes are near the bottom (many leaves, few high nodes),\nand bottom nodes do LITTLE work (height 0 = no sifting), while the\nfew nodes near the top do more work but there are exponentially fewer of them.\n\nContrast with inserting one-by-one:\n  Each of n inserts does O(log n) work → O(n log n) total.\n  Build-heap is faster because it processes bottom-up!\n\`\`\`\n\n---\n\n## ⚡ Key Algorithms & Techniques\n\n### 1. Java PriorityQueue Internals & Patterns\n\n**Internal structure:** Java\'s \`PriorityQueue\` uses a **binary min-heap** backed by a resizable \`Object[]\` array. Initial capacity is 11; grows by 50% when small (< 64), doubles when large.\n\n\`\`\`java\n// === Common Comparator patterns ===\n\n// 1. Natural order min-heap (default)\nPriorityQueue<Integer> minPQ = new PriorityQueue<>();\n\n// 2. Max-heap via reverseOrder\nPriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());\n\n// 3. Lambda comparator — sort by second element of array\nPriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);\n\n// 4. Comparator.comparing — cleaner for complex keys\nPriorityQueue<Map.Entry<String, Integer>> pq2 = new PriorityQueue<>(\n    Map.Entry.<String, Integer>comparingByValue().reversed()\n);\n\n// 5. Multi-level sort: by frequency desc, then alphabetical\nPriorityQueue<String> pq3 = new PriorityQueue<>((a, b) -> {\n    int freqDiff = freq.get(b) - freq.get(a);\n    return freqDiff != 0 ? freqDiff : a.compareTo(b);\n});\n\`\`\`\n\n**Complexity:**\n| Operation | Time | Notes |\n|-----------|------|-------|\n| \`offer()\` | O(log n) | Sift up |\n| \`poll()\` | O(log n) | Sift down |\n| \`peek()\` | O(1) | Return root |\n| \`remove(Object)\` | O(n) | Linear search + sift |\n| \`contains()\` | O(n) | Linear search |\n\n**Warning:** \`remove(Object)\` is O(n)! If you need frequent arbitrary removal, consider a TreeMap or indexed priority queue.\n\n### 2. Top-K Pattern (Min-Heap of Size K)\n\n**Idea:** To find the K largest elements, maintain a **min-heap of size K**. As you process each element, if it is larger than the heap\'s min, evict the min and insert the new element. At the end, the heap contains the K largest.\n\n\`\`\`\nFinding Top-3 from stream: [7, 2, 9, 1, 5, 8, 3]\n\nProcess 7: heap = [7]              size < 3, just add\nProcess 2: heap = [2, 7]           size < 3, just add\nProcess 9: heap = [2, 7, 9]        size == 3, heap full\nProcess 1: 1 < peek(2)?  YES → skip (1 is too small)\nProcess 5: 5 > peek(2)?  YES → poll 2, offer 5 → heap = [5, 7, 9]\nProcess 8: 8 > peek(5)?  YES → poll 5, offer 8 → heap = [7, 8, 9]\nProcess 3: 3 < peek(7)?  YES → skip\n\nResult: heap = [7, 8, 9] — the top 3 elements ✓\n\`\`\`\n\n\`\`\`java\npublic int[] topK(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) {\n            minHeap.poll();  // Evict smallest — too small to be top-K\n        }\n    }\n    int[] result = new int[k];\n    for (int i = k - 1; i >= 0; i--) {\n        result[i] = minHeap.poll();\n    }\n    return result;\n}\n\`\`\`\n\n**Why min-heap for top-K (not max-heap)?** A min-heap lets us efficiently check and evict the smallest of our K candidates. If a new element is bigger than the current smallest candidate, it replaces it.\n\n**Time:** O(n log k) — each of n elements may trigger O(log k) insert/remove on a heap of size k.\n**Space:** O(k)\n\n### 3. Two-Heap Pattern (Find Median)\n\n**Idea:** Maintain two heaps that split the data into a lower half and upper half:\n- **maxHeap** (left half) — stores the smaller half, max at top\n- **minHeap** (right half) — stores the larger half, min at top\n\nThe median is derived from the tops of these two heaps.\n\n**Balance rule:** \`maxHeap.size() >= minHeap.size()\` and \`maxHeap.size() - minHeap.size() <= 1\`\n\n\`\`\`\nInsert sequence: 5, 15, 1, 3, 8\n\nStep 1: Insert 5\n  maxHeap: [5]     minHeap: []\n  Median = 5\n\nStep 2: Insert 15\n  15 > maxHeap.peek(5) → goes to minHeap\n  maxHeap: [5]     minHeap: [15]\n  Sizes equal → Median = (5 + 15) / 2 = 10.0\n\nStep 3: Insert 1\n  1 ≤ maxHeap.peek(5) → goes to maxHeap\n  maxHeap: [5, 1]  minHeap: [15]\n  maxHeap bigger by 1 → OK\n  Median = 5\n\nStep 4: Insert 3\n  3 ≤ maxHeap.peek(5) → goes to maxHeap\n  maxHeap: [5, 3, 1]  minHeap: [15]\n  maxHeap bigger by 2! → Rebalance: move 5 to minHeap\n  maxHeap: [3, 1]     minHeap: [5, 15]\n  Sizes equal → Median = (3 + 5) / 2 = 4.0\n\nStep 5: Insert 8\n  8 > maxHeap.peek(3) → goes to minHeap\n  maxHeap: [3, 1]     minHeap: [5, 8, 15]\n  minHeap bigger! → Rebalance: move 5 to maxHeap\n  maxHeap: [5, 3, 1]  minHeap: [8, 15]\n  maxHeap bigger by 1 → OK\n  Median = 5\n\`\`\`\n\n\`\`\`java\nclass MedianFinder {\n    private PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n    private PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n\n    public void addNum(int num) {\n        maxHeap.offer(num);\n        // Ensure max of left <= min of right\n        minHeap.offer(maxHeap.poll());\n        // Keep maxHeap same size or one bigger\n        if (minHeap.size() > maxHeap.size()) {\n            maxHeap.offer(minHeap.poll());\n        }\n    }\n\n    public double findMedian() {\n        if (maxHeap.size() > minHeap.size()) {\n            return maxHeap.peek();\n        }\n        return (maxHeap.peek() + minHeap.peek()) / 2.0;\n    }\n}\n\`\`\`\n\n**Time:** O(log n) per addNum, O(1) per findMedian.\n**Space:** O(n) total.\n\n### 4. Merge K Sorted Lists/Arrays\n\n**Idea:** Use a min-heap to always extract the globally smallest element among the current heads of all K lists.\n\n\`\`\`\nK=3 sorted lists:\n  L0: [1, 4, 7]\n  L1: [2, 5, 8]\n  L2: [3, 6, 9]\n\nInitial heap (value, listIndex, elementIndex):\n  heap = [(1,0,0), (2,1,0), (3,2,0)]\n\nStep 1: Poll (1,0,0) → output 1. Push L0 next: (4,0,1)\n  heap = [(2,1,0), (3,2,0), (4,0,1)]\n\nStep 2: Poll (2,1,0) → output 2. Push L1 next: (5,1,1)\n  heap = [(3,2,0), (4,0,1), (5,1,1)]\n\nStep 3: Poll (3,2,0) → output 3. Push L2 next: (6,2,1)\n  heap = [(4,0,1), (5,1,1), (6,2,1)]\n\n...continues until all elements processed...\n\nOutput: [1, 2, 3, 4, 5, 6, 7, 8, 9]\n\`\`\`\n\n\`\`\`java\npublic ListNode mergeKLists(ListNode[] lists) {\n    PriorityQueue<ListNode> pq = new PriorityQueue<>(\n        Comparator.comparingInt(n -> n.val));\n    \n    for (ListNode head : lists) {\n        if (head != null) pq.offer(head);\n    }\n    \n    ListNode dummy = new ListNode(0), tail = dummy;\n    while (!pq.isEmpty()) {\n        ListNode min = pq.poll();\n        tail.next = min;\n        tail = tail.next;\n        if (min.next != null) pq.offer(min.next);\n    }\n    return dummy.next;\n}\n\`\`\`\n\n**Time:** O(N log K) where N = total elements across all lists, K = number of lists.\n**Space:** O(K) for the heap.\n\n### 5. Heap Sort (In-Place)\n\n**Idea:** Build a max-heap in-place, then repeatedly extract the max and place it at the end.\n\n\`\`\`\nInput: [4, 10, 3, 5, 1]\n\nPhase 1 — Build Max-Heap (in-place, O(n)):\n  [4, 10, 3, 5, 1] → [10, 5, 3, 4, 1]\n  \n       10\n      /  \\\n     5    3\n    / \\\n   4   1\n\nPhase 2 — Extract max repeatedly:\n  \n  Swap root(10) with last(1), reduce heap size:\n  [1, 5, 3, 4, | 10]  heapify-down index 0\n  [5, 4, 3, 1, | 10]\n  \n  Swap root(5) with last(1), reduce heap size:\n  [1, 4, 3, | 5, 10]  heapify-down index 0\n  [4, 1, 3, | 5, 10]\n  \n  Swap root(4) with last(3), reduce heap size:\n  [3, 1, | 4, 5, 10]  heapify-down index 0\n  [3, 1, | 4, 5, 10]\n  \n  Swap root(3) with last(1), reduce heap size:\n  [1, | 3, 4, 5, 10]\n  \n  Done: [1, 3, 4, 5, 10] ✓\n\`\`\`\n\n\`\`\`java\npublic void heapSort(int[] arr) {\n    int n = arr.length;\n    // Build max-heap\n    for (int i = n / 2 - 1; i >= 0; i--) {\n        heapifyDown(arr, n, i);\n    }\n    // Extract elements one by one\n    for (int i = n - 1; i > 0; i--) {\n        // Move current root to end\n        int temp = arr[0]; arr[0] = arr[i]; arr[i] = temp;\n        // Heapify reduced heap\n        heapifyDown(arr, i, 0);\n    }\n}\n\nprivate void heapifyDown(int[] arr, int heapSize, int i) {\n    int largest = i;\n    int left = 2 * i + 1, right = 2 * i + 2;\n    if (left < heapSize && arr[left] > arr[largest]) largest = left;\n    if (right < heapSize && arr[right] > arr[largest]) largest = right;\n    if (largest != i) {\n        int temp = arr[i]; arr[i] = arr[largest]; arr[largest] = temp;\n        heapifyDown(arr, heapSize, largest);\n    }\n}\n\`\`\`\n\n**Time:** O(n log n) always. **Space:** O(1) — in-place. **Not stable.**\n\n---\n\n## 🎯 Pattern Recognition\n\n\`\`\`\nProblem Keywords → Technique:\n\n"Kth largest/smallest"             → Min/Max heap of size K\n"Top K frequent"                   → HashMap + Min-heap of size K\n"Find median" / "streaming data"   → Two-Heap pattern (max + min)\n"Merge K sorted"                   → Min-heap with K entries\n"Closest K points"                 → Max-heap of size K (by distance)\n"Task scheduler" / "cooldown"      → Max-heap + greedy\n"Reorganize string"                → Max-heap by frequency\n"Sliding window maximum"           → Monotonic deque (NOT heap — O(n) vs O(n log n))\n"Minimum cost to connect"          → Min-heap (greedy / Prim\'s MST)\n"Smallest range covering K lists"  → Min-heap + sliding window\n"Ugly number / Super ugly"         → Min-heap for candidate generation\n"Sort almost sorted array"         → Min-heap of size K\n\`\`\`\n\n---\n\n## 📊 Complexity Cheat Sheet\n\n| Operation | Min/Max Heap | Notes |\n|-----------|-------------|-------|\n| Build Heap | **O(n)** | Bottom-up heapify |\n| Insert (offer) | O(log n) | Sift up |\n| Extract min/max (poll) | O(log n) | Sift down |\n| Peek | O(1) | Return root |\n| Delete arbitrary | O(n) | Find O(n) + sift O(log n) |\n| Search | O(n) | No ordering among siblings |\n| Heap Sort | O(n log n) | In-place, not stable |\n| Top-K | O(n log k) | k-sized heap |\n| Merge K sorted | O(N log K) | N total, K lists |\n\n| Pattern | Time | Space |\n|---------|------|-------|\n| Kth Largest (quickselect) | O(n) avg | O(1) |\n| Kth Largest (heap) | O(n log k) | O(k) |\n| Find Median (two heaps) | O(log n) per add | O(n) |\n| Task Scheduler | O(n log 26) ≈ O(n) | O(1) |\n\n---\n\n## 🧠 Interview Deep Dive: Worked Examples\n\n### Example 1: Kth Largest Element in an Array (LC 215)\n\n**Problem:** Find the kth largest element in an unsorted array.\n\n**Input:** nums = [3,2,1,5,6,4], k = 2\n**Output:** 5\n\n**Approach: Min-Heap of Size K**\n\n\`\`\`\nProcess each element, maintain min-heap of size k=2:\n\nProcess 3: heap = [3]         (size < k, add)\nProcess 2: heap = [2, 3]      (size == k, heap full)\nProcess 1: 1 < peek(2)? YES → skip\nProcess 5: 5 > peek(2)? YES → poll 2, offer 5 → heap = [3, 5]\nProcess 6: 6 > peek(3)? YES → poll 3, offer 6 → heap = [5, 6]\nProcess 4: 4 < peek(5)? YES → skip\n\nAnswer: peek() = 5 ✓ (2nd largest)\n\`\`\`\n\n\`\`\`java\npublic int findKthLargest(int[] nums, int k) {\n    PriorityQueue<Integer> minHeap = new PriorityQueue<>();\n    for (int num : nums) {\n        minHeap.offer(num);\n        if (minHeap.size() > k) {\n            minHeap.poll();\n        }\n    }\n    return minHeap.peek();\n}\n// Time: O(n log k), Space: O(k)\n\`\`\`\n\n**Alternative: QuickSelect** — O(n) average, O(n²) worst. Better for one-time queries; heap is better for streaming.\n\n### Example 2: Find Median from Data Stream (LC 295)\n\n**Problem:** Design a data structure that supports adding numbers and finding the median.\n\n**Trace with insertions [41, 35, 62, 5, 97, 108]:**\n\n\`\`\`\naddNum(41):\n  maxHeap: []  →  offer 41 → [41]\n  Move to minHeap: maxHeap.poll → minHeap.offer(41)\n  maxHeap: []    minHeap: [41]\n  Rebalance (minHeap bigger): minHeap.poll → maxHeap.offer(41)\n  maxHeap: [41]  minHeap: []\n  Median = 41.0\n\naddNum(35):\n  maxHeap: [41]  →  offer 35 → [41, 35]\n  Move to minHeap: maxHeap.poll → minHeap.offer(41)\n  maxHeap: [35]  minHeap: [41]\n  Sizes equal → OK\n  Median = (35 + 41) / 2 = 38.0\n\naddNum(62):\n  maxHeap: [35]  minHeap: [41]  →  offer 62 to maxHeap → [62, 35]\n  Move to minHeap: maxHeap.poll(62) → minHeap.offer(62) → [41, 62]\n  maxHeap: [35]  minHeap: [41, 62]\n  Rebalance (minHeap bigger): minHeap.poll(41) → maxHeap.offer(41)\n  maxHeap: [41, 35]  minHeap: [62]\n  Median = 41.0\n\naddNum(5):\n  maxHeap: [41, 35]  →  offer 5 → [41, 35, 5]\n  Move to minHeap: maxHeap.poll(41) → minHeap.offer(41) → [41, 62]\n  maxHeap: [35, 5]  minHeap: [41, 62]\n  Sizes equal → OK\n  Median = (35 + 41) / 2 = 38.0\n\nSorted so far: [5, 35, 41, 62] → median = (35+41)/2 = 38.0 ✓\n\`\`\`\n\n\`\`\`java\nclass MedianFinder {\n    PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder()); // max-heap\n    PriorityQueue<Integer> hi = new PriorityQueue<>(); // min-heap\n\n    public void addNum(int num) {\n        lo.offer(num);\n        hi.offer(lo.poll());       // ensure lo\'s max <= hi\'s min\n        if (hi.size() > lo.size()) // keep lo same size or +1\n            lo.offer(hi.poll());\n    }\n\n    public double findMedian() {\n        return lo.size() > hi.size()\n            ? lo.peek()\n            : (lo.peek() + hi.peek()) / 2.0;\n    }\n}\n\`\`\`\n\n### Example 3: Task Scheduler (LC 621)\n\n**Problem:** Given tasks and cooldown n, find minimum intervals to execute all tasks.\n\n**Input:** tasks = [A,A,A,B,B,B], n = 2\n**Output:** 8\n\n**Approach: Max-Heap + Greedy**\n\nThe most frequent task dictates the schedule. Use a max-heap to always pick the most frequent available task.\n\n\`\`\`\nFrequencies: A=3, B=3. Cooldown n=2.\nmaxHeap: [(A,3), (B,3)]   cooldownQueue: []\n\nTime 0: Poll (A,3) → execute A. Dec to (A,2). Cooldown until time 3.\n  Schedule: [A]  cooldownQueue: [(A,2,available@3)]\n\nTime 1: Poll (B,3) → execute B. Dec to (B,2). Cooldown until time 4.\n  Schedule: [A,B]  cooldownQueue: [(A,2,@3), (B,2,@4)]\n\nTime 2: Heap empty, no task available → idle\n  Schedule: [A,B,idle]\n\nTime 3: (A,2) available → push to heap. Poll (A,2) → execute A.\n  Schedule: [A,B,idle,A]  cooldownQueue: [(B,2,@4), (A,1,@6)]\n\nTime 4: (B,2) available → push to heap. Poll (B,2) → execute B.\n  Schedule: [A,B,idle,A,B]  cooldownQueue: [(A,1,@6), (B,1,@7)]\n\nTime 5: Heap empty → idle\n  Schedule: [A,B,idle,A,B,idle]\n\nTime 6: (A,1) available. Execute A. Count=0, don\'t re-add.\n  Schedule: [A,B,idle,A,B,idle,A]\n\nTime 7: (B,1) available. Execute B. Count=0, don\'t re-add.\n  Schedule: [A,B,idle,A,B,idle,A,B]\n\nTotal intervals = 8 ✓\n\`\`\`\n\n\`\`\`java\npublic int leastInterval(char[] tasks, int n) {\n    int[] freq = new int[26];\n    for (char c : tasks) freq[c - \'A\']++;\n    \n    PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());\n    for (int f : freq) if (f > 0) maxHeap.offer(f);\n    \n    Queue<int[]> cooldown = new LinkedList<>(); // [remaining_count, available_time]\n    int time = 0;\n    \n    while (!maxHeap.isEmpty() || !cooldown.isEmpty()) {\n        time++;\n        if (!maxHeap.isEmpty()) {\n            int cnt = maxHeap.poll() - 1;\n            if (cnt > 0) cooldown.offer(new int[]{cnt, time + n});\n        }\n        if (!cooldown.isEmpty() && cooldown.peek()[1] == time) {\n            maxHeap.offer(cooldown.poll()[0]);\n        }\n    }\n    return time;\n}\n// Time: O(n * total_tasks), Space: O(26) = O(1)\n\`\`\`\n\n### Example 4: K Closest Points to Origin (LC 973)\n\n**Problem:** Find the K closest points to the origin.\n\n**Approach:** Max-heap of size K, keyed by distance. The heap evicts the farthest of our K candidates.\n\n\`\`\`java\npublic int[][] kClosest(int[][] points, int k) {\n    // Max-heap by distance\n    PriorityQueue<int[]> maxHeap = new PriorityQueue<>(\n        (a, b) -> (b[0]*b[0] + b[1]*b[1]) - (a[0]*a[0] + a[1]*a[1])\n    );\n    for (int[] p : points) {\n        maxHeap.offer(p);\n        if (maxHeap.size() > k) maxHeap.poll();\n    }\n    return maxHeap.toArray(new int[k][]);\n}\n// Time: O(n log k), Space: O(k)\n\`\`\`\n\n---\n\n## ⚠️ Common Mistakes\n\n1. **Confusing min-heap and max-heap for top-K:** Use a **min-heap** of size K for the K **largest** (so you can evict the smallest candidate). Use a **max-heap** of size K for the K **smallest**.\n\n2. **Using \`remove(Object)\` in a loop:** PriorityQueue\'s \`remove(Object)\` is **O(n)**. If you need this frequently, use a **TreeMap** or **lazy deletion** (mark as deleted, skip during poll).\n\n3. **Assuming PriorityQueue is sorted:** Iterating a PriorityQueue does **NOT** give elements in sorted order! Only \`poll()\` gives the min/max. To get sorted output, poll repeatedly.\n\n4. **Integer overflow in comparators:** \`(a, b) -> a[0] - b[0]\` can overflow. Use \`Integer.compare(a[0], b[0])\` instead for safety.\n\n5. **Forgetting that Java PriorityQueue is a min-heap:** The default is min-heap. For max-heap, you must explicitly use \`Collections.reverseOrder()\` or a reversed comparator.\n\n6. **Not handling equal elements properly in two-heap:** When elements equal the max-heap\'s top, be consistent about which heap they go to. The standard pattern (always insert to maxHeap first, then move to minHeap) handles this correctly.\n\n7. **Using heap when simpler solution exists:** "Kth largest in a stream" needs a heap, but "Kth largest in a static array" can use QuickSelect O(n).\n\n8. **Build heap one-by-one instead of using heapify:** Inserting n elements one-by-one is O(n log n). Building with bottom-up heapify is O(n). For PriorityQueue, pass the collection to the constructor: \`new PriorityQueue<>(list)\`.\n\n---\n\n## 💡 Java-Specific Tips\n\n- **PriorityQueue constructor with collection** — \`new PriorityQueue<>(Arrays.asList(...))\` builds the heap in O(n), not O(n log n).\n\n- **TreeMap as an alternative** — When you need \`O(log n)\` deletion by value, use \`TreeMap<Integer, Integer>\` (value → count). Supports \`firstKey()\`, \`lastKey()\`, \`pollFirstEntry()\`.\n\n- **Lazy deletion pattern** — Instead of removing from heap (O(n)), keep a separate \`HashMap<Integer, Integer>\` of "pending removals". When you \`poll()\`, check if that element is pending removal before using it.\n\n\`\`\`java\n// Lazy deletion example\nMap<Integer, Integer> toRemove = new HashMap<>();\n// To "remove" val from heap:\ntoRemove.merge(val, 1, Integer::sum);\n// When polling:\nwhile (!heap.isEmpty() && toRemove.getOrDefault(heap.peek(), 0) > 0) {\n    toRemove.merge(heap.poll(), -1, Integer::sum);\n}\n\`\`\`\n\n- **Custom objects in PriorityQueue** — Either implement \`Comparable<T>\` or provide a \`Comparator<T>\`. Don\'t mix both — the comparator takes precedence.\n\n- **PriorityQueue does NOT support \`index-based access\`** — No \`get(i)\`. If you need indexed access, use a sorted structure like \`TreeSet\` or maintain a parallel array.\n\n---\n\n## 🔗 Comparison Tables\n\n### Heap vs Other Data Structures\n\n| Feature | PriorityQueue (Heap) | TreeMap | TreeSet | Sorted Array |\n|---------|---------------------|---------|---------|-------------|\n| Find min/max | O(1) | O(log n) | O(log n) | O(1) |\n| Insert | O(log n) | O(log n) | O(log n) | O(n) |\n| Delete min/max | O(log n) | O(log n) | O(log n) | O(1) or O(n) |\n| Delete arbitrary | **O(n)** | O(log n) | O(log n) | O(n) |\n| Search | **O(n)** | O(log n) | O(log n) | O(log n) |\n| Sorted iteration | O(n log n) | O(n) | O(n) | O(n) |\n| Duplicates | ✅ Yes | ✅ (via count) | ❌ No | ✅ Yes |\n| Space | O(n) | O(n) | O(n) | O(n) |\n\n### When to Use What?\n\n| Scenario | Best Choice | Why |\n|----------|------------|-----|\n| Top-K elements | Min-Heap (size K) | O(n log k) time, O(k) space |\n| Running median | Two Heaps | O(log n) per insert, O(1) median |\n| Merge K sorted | Min-Heap (size K) | O(N log K), only K elements in memory |\n| Priority scheduling | PriorityQueue | O(log n) insert/extract |\n| Sorted iteration needed | TreeMap/TreeSet | O(n) in-order traversal |\n| Frequent arbitrary deletes | TreeMap | O(log n) delete by key |\n| Sliding window max/min | **Monotonic Deque** | O(n) total, NOT heap |\n| Dijkstra\'s shortest path | PriorityQueue | O((V+E) log V) |\n',
  },
  {
    slug: 'hashmaps-and-sets',
    title: 'HashMaps & Sets',
    icon: 'Hash',
    description: 'Exploit O(1) lookups for frequency counting, grouping, caching, and classic design problems like LRU cache.',
    color: 'red',
    content: '# HashMaps and Sets — Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## 📌 Core Concepts\n\n### What is a HashMap?\n\nA **HashMap** maps **keys** to **values** using a **hash function** to compute an index into an internal bucket array. This achieves **O(1) average-case** lookup, insertion, and deletion.\n\n### What is a HashSet?\n\nA **HashSet** is a collection of **unique elements**, implemented internally as a HashMap where only keys matter (values are a dummy constant). It provides O(1) average-case \`add\`, \`remove\`, and \`contains\`.\n\n### Why HashMaps & Sets?\n\n| Problem | Without HashMap | With HashMap |\n|---------|----------------|-------------|\n| Check if element exists | O(n) scan | **O(1)** lookup |\n| Count frequencies | O(n²) nested loop | **O(n)** single pass |\n| Find pairs with target sum | O(n²) or O(n log n) | **O(n)** |\n| Group by property | O(n² or n log n) | **O(n)** grouping |\n| Detect duplicates | O(n log n) sort | **O(n)** set check |\n\n### Java Classes Overview\n\n\`\`\`java\n// === HashMap ===\nMap<String, Integer> map = new HashMap<>();\nmap.put("key", 1);                    // Insert/update\nmap.get("key");                       // Returns 1 (or null)\nmap.getOrDefault("missing", 0);       // Returns 0\nmap.containsKey("key");               // true\nmap.remove("key");                    // Remove entry\nmap.entrySet();                       // Set<Map.Entry<K,V>>\n\n// === HashSet ===\nSet<String> set = new HashSet<>();\nset.add("hello");                     // Add element\nset.contains("hello");                // true\nset.remove("hello");                  // Remove element\n\n// === LinkedHashMap (insertion order) ===\nMap<String, Integer> lhm = new LinkedHashMap<>();\n\n// === TreeMap (sorted keys, O(log n)) ===\nTreeMap<Integer, String> tm = new TreeMap<>();\ntm.firstKey();  tm.lastKey();         // Min/max key\ntm.floorKey(5); tm.ceilingKey(5);     // <= 5 and >= 5\n\`\`\`\n\n---\n\n## 🔍 Visual Deep Dive\n\n### Hash Function: Key → hashCode → Bucket Index\n\n\`\`\`\nKey: "hello"\n  │\n  ▼\nhashCode(): "hello".hashCode() = 99162322\n  │\n  ▼\nSpread/Perturb: h ^ (h >>> 16)  [reduces collisions]\n  = 99162322 ^ (99162322 >>> 16)\n  = 99162322 ^ 1513\n  = 99163803\n  │\n  ▼\nBucket Index: hash & (capacity - 1)   [capacity is power of 2]\n  = 99163803 & 15  (if capacity = 16)\n  = 11\n  │\n  ▼\nBucket[11]: Store (key="hello", value=...)\n\nVisual of bucket array (capacity=16):\n┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬─────────────┬────┬────┬────┬────┐\n│ 0  │ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │     11     │ 12 │ 13 │ 14 │ 15 │\n│null│null│null│null│null│null│null│null│null│null│null│("hello",42)│null│null│null│null│\n└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴─────────────┴────┴────┴────┴────┘\n\`\`\`\n\n### Collision Resolution: Chaining\n\nWhen multiple keys hash to the same bucket, Java uses a **linked list** (or **red-black tree** when the chain grows long):\n\n\`\`\`\nBucket[3]:  ("apple",1) → ("grape",7) → ("mango",3) → null\n            [Linked list chain — each node has (key, value, next)]\n\nLookup "grape" at bucket 3:\n  1. Hash "grape" → bucket 3\n  2. Compare "apple".equals("grape")? NO → follow next\n  3. Compare "grape".equals("grape")? YES → return value 7\n\nWhen chain length > 8 and capacity >= 64:\n  Java 8+ converts chain to RED-BLACK TREE (O(log n) lookup within bucket)\n\nBucket[3]:  Linked List    →    Red-Black Tree\n            O(n) search         O(log n) search\n\`\`\`\n\n### Collision Resolution: Open Addressing (Linear Probing)\n\nAlternative approach (used in Python dicts, not Java HashMap):\n\n\`\`\`\nInsert keys that hash to same index:\n\nhash("cat") = 3, hash("dog") = 3, hash("rat") = 3\n\nStep 1: Insert "cat" at index 3\n  [_, _, _, "cat", _, _, _, _]\n\nStep 2: Insert "dog" → index 3 occupied → probe index 4 → empty → insert\n  [_, _, _, "cat", "dog", _, _, _]\n\nStep 3: Insert "rat" → index 3 occupied → index 4 occupied → index 5 → insert\n  [_, _, _, "cat", "dog", "rat", _, _]\n\nLookup "dog": hash→3 → check "cat"≠"dog" → check index 4 → "dog" found!\n\nProblem: Clustering — consecutive filled slots degrade performance.\n\`\`\`\n\n### Java HashMap Internals: Capacity, Load Factor, Rehashing\n\n\`\`\`\nDEFAULT_INITIAL_CAPACITY = 16 (always power of 2)\nDEFAULT_LOAD_FACTOR = 0.75\n\nRehashing trigger: size > capacity × loadFactor\n  With defaults: rehash when size > 16 × 0.75 = 12\n\nRehashing process:\n  1. Create new array of 2× capacity (16 → 32)\n  2. Redistribute ALL entries (bucket index changes because capacity changed)\n  3. Old linked lists may split (some entries stay, others move to old_index + old_capacity)\n\nExample: capacity 4 → 8\n  Key "A" hash=5: bucket = 5 & 3 = 1  →  bucket = 5 & 7 = 5  (MOVED)\n  Key "B" hash=9: bucket = 9 & 3 = 1  →  bucket = 9 & 7 = 1  (STAYED)\n\nTreeification (Java 8+):\n  When a single bucket\'s chain length > TREEIFY_THRESHOLD (8)\n  AND total capacity >= MIN_TREEIFY_CAPACITY (64):\n    Linked list → Red-black tree\n  When chain shrinks below UNTREEIFY_THRESHOLD (6):\n    Red-black tree → Linked list\n\`\`\`\n\n### The equals() and hashCode() Contract\n\n\`\`\`\nTHE CONTRACT:\n  1. If a.equals(b) is true → a.hashCode() == b.hashCode() MUST be true\n  2. If a.hashCode() != b.hashCode() → a.equals(b) MUST be false\n  3. If a.hashCode() == b.hashCode() → a.equals(b) MAY be true or false (collision)\n\nWhat breaks when the contract is violated:\n\nCase: Override equals() but NOT hashCode()\n\n  class Point {\n      int x, y;\n      @Override public boolean equals(Object o) {\n          Point p = (Point) o;\n          return x == p.x && y == p.y;\n      }\n      // hashCode() NOT overridden — uses Object.hashCode() (memory address)\n  }\n\n  Point p1 = new Point(1, 2);\n  Point p2 = new Point(1, 2);\n\n  p1.equals(p2) → TRUE   (same x, y)\n  p1.hashCode() → 135721  (memory address)\n  p2.hashCode() → 984532  (different memory address!)\n\n  HashMap<Point, String> map = new HashMap<>();\n  map.put(p1, "origin");\n  map.get(p2) → NULL!   // Different hashCode → different bucket → not found!\n\nFIX: Always override hashCode() when overriding equals():\n  @Override public int hashCode() {\n      return Objects.hash(x, y);\n  }\n\`\`\`\n\n---\n\n## ⚡ Key Algorithms & Techniques\n\n### 1. Frequency Counting\n\nThe foundational HashMap pattern. Count occurrences of each element.\n\n\`\`\`java\n// Pattern 1: getOrDefault\nMap<Character, Integer> freq = new HashMap<>();\nfor (char c : s.toCharArray()) {\n    freq.put(c, freq.getOrDefault(c, 0) + 1);\n}\n\n// Pattern 2: merge (more concise)\nMap<Character, Integer> freq = new HashMap<>();\nfor (char c : s.toCharArray()) {\n    freq.merge(c, 1, Integer::sum);\n}\n\n// Pattern 3: computeIfAbsent for grouping\nMap<String, List<String>> groups = new HashMap<>();\nfor (String word : words) {\n    String key = sortedKey(word);\n    groups.computeIfAbsent(key, k -> new ArrayList<>()).add(word);\n}\n\`\`\`\n\n**Time:** O(n), **Space:** O(k) where k = distinct elements.\n\n### 2. Two Sum Pattern: Complement Lookup\n\n**Idea:** For each element, check if its complement (target - element) exists in the map.\n\n\`\`\`\nInput: nums = [2, 7, 11, 15], target = 9\n\nStep 1: num=2, complement=7, map={}. 7 not in map. Store map={2→0}\nStep 2: num=7, complement=2, map={2→0}. 2 IS in map at index 0!\n  Return [0, 1] ✓\n\nVisual trace:\n  Index:  0   1    2    3\n  Value:  2   7   11   15\n          ↓\n  map={} → Looking for 7? NO → map={2:0}\n              ↓\n  map={2:0} → Looking for 2? YES! → return [0, 1]\n\`\`\`\n\n\`\`\`java\npublic int[] twoSum(int[] nums, int target) {\n    Map<Integer, Integer> seen = new HashMap<>();\n    for (int i = 0; i < nums.length; i++) {\n        int complement = target - nums[i];\n        if (seen.containsKey(complement)) {\n            return new int[]{seen.get(complement), i};\n        }\n        seen.put(nums[i], i);\n    }\n    return new int[]{};\n}\n// Time: O(n), Space: O(n)\n\`\`\`\n\n### 3. Prefix Sum + HashMap Pattern\n\n**Idea:** To find subarrays with a given sum, use running prefix sums. If \`prefix[j] - prefix[i] = k\`, then the subarray from \`i+1\` to \`j\` has sum \`k\`. Store prefix sums in a HashMap to find matches in O(1).\n\n\`\`\`\nProblem: Count subarrays with sum = 7\nInput: [3, 4, 7, 2, -3, 1, 4, 2]\n\nIndex:    0  1  2  3   4  5  6  7\nValue:    3  4  7  2  -3  1  4  2\nPrefix:   3  7 14 16  13 14 18 20\n                                    \nprefixMap starts with {0: 1} (empty prefix)\n\ni=0: prefix=3.  Need 3-7=-4.  Not in map. map={0:1, 3:1}\ni=1: prefix=7.  Need 7-7=0.   0 IS in map(count=1)! count+=1. map={0:1, 3:1, 7:1}\n  → subarray [0..1] = [3,4] sums to 7 ✓\ni=2: prefix=14. Need 14-7=7.  7 IS in map(count=1)! count+=1. map={..., 14:1}\n  → subarray [2..2] = [7] sums to 7 ✓\ni=3: prefix=16. Need 16-7=9.  Not in map. map={..., 16:1}\ni=4: prefix=13. Need 13-7=6.  Not in map. map={..., 13:1}\ni=5: prefix=14. Need 14-7=7.  7 IS in map(count=1)! count+=1. map={..., 14:2}\n  → subarray [2..5] = [7,2,-3,1] sums to 7 ✓\ni=6: prefix=18. Need 18-7=11. Not in map.\ni=7: prefix=20. Need 20-7=13. 13 IS in map(count=1)! count+=1.\n  → subarray [5..7] = [1,4,2] sums to 7 ✓\n\nTotal count = 4\n\`\`\`\n\n\`\`\`java\npublic int subarraySum(int[] nums, int k) {\n    Map<Integer, Integer> prefixCount = new HashMap<>();\n    prefixCount.put(0, 1);  // Empty prefix has sum 0\n    int sum = 0, count = 0;\n    for (int num : nums) {\n        sum += num;\n        count += prefixCount.getOrDefault(sum - k, 0);\n        prefixCount.merge(sum, 1, Integer::sum);\n    }\n    return count;\n}\n// Time: O(n), Space: O(n)\n\`\`\`\n\n### 4. LRU Cache: HashMap + Doubly Linked List\n\n**Idea:** Combine O(1) HashMap lookups with O(1) DLL reordering to implement an LRU (Least Recently Used) cache.\n\n\`\`\`\nCapacity = 3\n\nOperations and state after each:\n\nput(1,A):  DLL: [1] ←→ null     Map: {1→node1}\nput(2,B):  DLL: [2] ←→ [1]     Map: {1→node1, 2→node2}\nput(3,C):  DLL: [3] ←→ [2] ←→ [1]   Map: {1,2,3}\n  (most recent at head, least recent at tail)\n\nget(1):    Move node1 to head:\n  DLL: [1] ←→ [3] ←→ [2]     Map: {1,2,3}\n\nput(4,D):  Cache full! Evict tail (key=2):\n  DLL: [4] ←→ [1] ←→ [3]     Map: {1,3,4}\n\nget(2):    Returns -1 (evicted!)\n\nInternal structure:\n  HashMap<Key, DLLNode>     DLL: Head ←→ ←→ ←→ Tail\n  ┌─────────────┐           (sentinels)\n  │ key → node  │ ←───────→ ┌─────┐ ←→ ┌─────┐ ←→ ┌─────┐\n  │ 4 → node4   │           │  4  │    │  1  │    │  3  │\n  │ 1 → node1   │           │ (D) │    │ (A) │    │ (C) │\n  │ 3 → node3   │           └─────┘    └─────┘    └─────┘\n  └─────────────┘           Most Recent          Least Recent\n\`\`\`\n\n\`\`\`java\nclass LRUCache {\n    class Node {\n        int key, val;\n        Node prev, next;\n        Node(int k, int v) { key = k; val = v; }\n    }\n    \n    private Map<Integer, Node> map = new HashMap<>();\n    private Node head = new Node(0, 0), tail = new Node(0, 0);\n    private int capacity;\n    \n    public LRUCache(int capacity) {\n        this.capacity = capacity;\n        head.next = tail;\n        tail.prev = head;\n    }\n    \n    public int get(int key) {\n        if (!map.containsKey(key)) return -1;\n        Node node = map.get(key);\n        remove(node);\n        insertHead(node);\n        return node.val;\n    }\n    \n    public void put(int key, int value) {\n        if (map.containsKey(key)) {\n            remove(map.get(key));\n        }\n        Node node = new Node(key, value);\n        insertHead(node);\n        map.put(key, node);\n        if (map.size() > capacity) {\n            Node lru = tail.prev;\n            remove(lru);\n            map.remove(lru.key);\n        }\n    }\n    \n    private void remove(Node n) {\n        n.prev.next = n.next;\n        n.next.prev = n.prev;\n    }\n    \n    private void insertHead(Node n) {\n        n.next = head.next;\n        n.prev = head;\n        head.next.prev = n;\n        head.next = n;\n    }\n}\n// All operations: O(1) time\n\`\`\`\n\n### 5. Longest Consecutive Sequence (Set)\n\n**Idea:** Use a HashSet. For each number, only start counting a sequence if \`num - 1\` is NOT in the set (meaning \`num\` is the start of a sequence).\n\n\`\`\`java\npublic int longestConsecutive(int[] nums) {\n    Set<Integer> set = new HashSet<>();\n    for (int n : nums) set.add(n);\n    \n    int maxLen = 0;\n    for (int num : set) {\n        if (!set.contains(num - 1)) {  // Start of sequence\n            int len = 1;\n            while (set.contains(num + len)) len++;\n            maxLen = Math.max(maxLen, len);\n        }\n    }\n    return maxLen;\n}\n// Time: O(n), Space: O(n)\n\`\`\`\n\n---\n\n## 🎯 Pattern Recognition\n\n\`\`\`\nProblem Keywords → Technique:\n\n"Two sum" / "pair with target"        → HashMap (complement lookup)\n"Count frequency" / "most common"     → HashMap frequency count\n"Group by" / "anagrams"               → HashMap with computed key + computeIfAbsent\n"Subarray sum equals K"               → Prefix Sum + HashMap\n"Longest subarray with at most K"     → HashMap (sliding window + freq)\n"Contains duplicate"                  → HashSet\n"Intersection / union"                → HashSet operations\n"First non-repeating"                 → LinkedHashMap (preserves order)\n"LRU / LFU Cache"                    → HashMap + Doubly Linked List\n"Longest consecutive sequence"        → HashSet (find sequence starts)\n"Isomorphic / pattern matching"       → Two HashMaps (bidirectional mapping)\n"Substring with all chars"            → HashMap + sliding window\n"Design" / "O(1) insert/delete/random"→ HashMap + ArrayList\n\`\`\`\n\n---\n\n## 📊 Complexity Cheat Sheet\n\n| Operation | HashMap | TreeMap | LinkedHashMap | HashSet | TreeSet |\n|-----------|---------|---------|--------------|---------|---------|\n| put/add | O(1) avg | O(log n) | O(1) avg | O(1) avg | O(log n) |\n| get/contains | O(1) avg | O(log n) | O(1) avg | O(1) avg | O(log n) |\n| remove | O(1) avg | O(log n) | O(1) avg | O(1) avg | O(log n) |\n| Iteration order | Undefined | Sorted by key | Insertion order | Undefined | Sorted |\n| Worst case (single op) | O(n)* | O(log n) | O(n)* | O(n)* | O(log n) |\n| Space | O(n) | O(n) | O(n) | O(n) | O(n) |\n\n*O(n) worst case for hash structures with many collisions; O(log n) with treeification.\n\n| Pattern | Time | Space | Key Insight |\n|---------|------|-------|------------|\n| Two Sum | O(n) | O(n) | Complement lookup |\n| Frequency Count | O(n) | O(k) | merge() or getOrDefault() |\n| Group Anagrams | O(n × k log k) | O(n × k) | Sorted string as key |\n| Subarray Sum K | O(n) | O(n) | Prefix sum + map |\n| Longest Consecutive | O(n) | O(n) | Only start from sequence heads |\n| LRU Cache | O(1) per op | O(capacity) | HashMap + DLL |\n\n---\n\n## 🧠 Interview Deep Dive: Worked Examples\n\n### Example 1: Group Anagrams (LC 49)\n\n**Problem:** Group strings that are anagrams of each other.\n\n**Input:** ["eat","tea","tan","ate","nat","bat"]\n**Output:** [["eat","tea","ate"],["tan","nat"],["bat"]]\n\n**Key insight:** Anagrams have the same sorted characters. Use sorted string as HashMap key.\n\n\`\`\`\n"eat" → sort → "aet"\n"tea" → sort → "aet"  → same group!\n"tan" → sort → "ant"\n"ate" → sort → "aet"  → same group as eat, tea!\n"nat" → sort → "ant"  → same group as tan!\n"bat" → sort → "abt"\n\nHashMap after processing:\n  "aet" → ["eat", "tea", "ate"]\n  "ant" → ["tan", "nat"]\n  "abt" → ["bat"]\n\`\`\`\n\n\`\`\`java\npublic List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] arr = s.toCharArray();\n        Arrays.sort(arr);\n        String key = new String(arr);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}\n// Time: O(n × k log k), Space: O(n × k) where k = max string length\n\`\`\`\n\n**Alternative key strategy — frequency array as string (avoids sorting):**\n\n\`\`\`java\n// O(n × k) instead of O(n × k log k)\nString key = Arrays.toString(count); // e.g., "[1,0,0,...,1,0,...,1]" for "eat"\n\`\`\`\n\n### Example 2: Subarray Sum Equals K (LC 560)\n\n**Problem:** Find total number of continuous subarrays whose sum equals k.\n\n**Input:** nums = [1,1,1], k = 2\n**Output:** 2\n\n**Detailed trace:**\n\n\`\`\`\nprefixMap = {0: 1} (base case: empty subarray)\nsum = 0, count = 0\n\ni=0: num=1, sum=1\n  Need sum-k = 1-2 = -1 in map? NO\n  map = {0:1, 1:1}\n\ni=1: num=1, sum=2\n  Need sum-k = 2-2 = 0 in map? YES (count=1) → count += 1 = 1\n  map = {0:1, 1:1, 2:1}\n  (subarray [0..1] = [1,1] has sum 2 ✓)\n\ni=2: num=1, sum=3\n  Need sum-k = 3-2 = 1 in map? YES (count=1) → count += 1 = 2\n  map = {0:1, 1:1, 2:1, 3:1}\n  (subarray [1..2] = [1,1] has sum 2 ✓)\n\nTotal count = 2 ✓\n\`\`\`\n\n**Why prefix sum works:** If prefix[j] - prefix[i] = k, then sum(i+1..j) = k. The HashMap stores how many times each prefix sum has occurred, so we can count all valid i values in O(1).\n\n### Example 3: Longest Consecutive Sequence (LC 128)\n\n**Problem:** Find the length of the longest consecutive element sequence. Must run in O(n).\n\n**Input:** nums = [100, 4, 200, 1, 3, 2]\n**Output:** 4 (sequence: [1, 2, 3, 4])\n\n**Trace:**\n\n\`\`\`\nSet: {100, 4, 200, 1, 3, 2}\n\nCheck each number:\n\n100: Is 99 in set? NO → 100 is a sequence start\n  Count: 100 ✓, 101? NO → length = 1\n\n4:   Is 3 in set? YES → 4 is NOT a sequence start, skip\n\n200: Is 199 in set? NO → 200 is a sequence start\n  Count: 200 ✓, 201? NO → length = 1\n\n1:   Is 0 in set? NO → 1 IS a sequence start\n  Count: 1 ✓, 2 ✓, 3 ✓, 4 ✓, 5? NO → length = 4 ★\n\n3:   Is 2 in set? YES → skip (not a start)\n\n2:   Is 1 in set? YES → skip (not a start)\n\nmaxLen = 4 ✓\n\`\`\`\n\n**Key insight:** Only start counting from sequence heads (numbers without a predecessor). This ensures each number is visited at most twice — once in the outer loop, once in the inner while loop. Total: O(n).\n\n### Example 4: Design RandomizedSet (LC 380)\n\n**Problem:** Implement insert, remove, and getRandom, all in O(1) average time.\n\n**Insight:** Use ArrayList for O(1) random access + HashMap for O(1) lookup. On remove, swap the element with the last element to avoid O(n) shifting.\n\n\`\`\`java\nclass RandomizedSet {\n    List<Integer> list = new ArrayList<>();\n    Map<Integer, Integer> valToIdx = new HashMap<>();\n    Random rand = new Random();\n    \n    public boolean insert(int val) {\n        if (valToIdx.containsKey(val)) return false;\n        valToIdx.put(val, list.size());\n        list.add(val);\n        return true;\n    }\n    \n    public boolean remove(int val) {\n        if (!valToIdx.containsKey(val)) return false;\n        int idx = valToIdx.get(val);\n        int last = list.get(list.size() - 1);\n        list.set(idx, last);            // Overwrite with last\n        valToIdx.put(last, idx);        // Update last\'s index\n        list.remove(list.size() - 1);   // Remove last (O(1))\n        valToIdx.remove(val);\n        return true;\n    }\n    \n    public int getRandom() {\n        return list.get(rand.nextInt(list.size()));\n    }\n}\n\`\`\`\n\n---\n\n## ⚠️ Common Mistakes\n\n1. **Modifying a HashMap while iterating:** Using \`map.remove()\` inside a for-each loop causes \`ConcurrentModificationException\`. Use \`Iterator.remove()\` or \`removeIf()\` instead.\n\n2. **Using mutable objects as HashMap keys:** If you modify an object after inserting it as a key, its hashCode changes and the entry becomes unreachable. Always use immutable keys (String, Integer, etc.) or never modify keys after insertion.\n\n3. **Forgetting the \`{0: 1}\` base case in prefix sum:** The prefix sum pattern requires initializing the map with \`{0: 1}\` to handle subarrays starting from index 0.\n\n4. **Confusing \`hashCode()\` contract:** Override both \`equals()\` and \`hashCode()\` or neither. Overriding just \`equals()\` breaks HashMap lookups.\n\n5. **Comparing Integer objects with \`==\`:** In Java, \`Integer\` objects cached only for values -128 to 127. Use \`.equals()\` for Integer comparisons: \`map.get(a).equals(map.get(b))\`, not \`map.get(a) == map.get(b)\`.\n\n6. **Assuming HashMap preserves insertion order:** HashMap has NO order guarantee. Use \`LinkedHashMap\` for insertion order or \`TreeMap\` for sorted order.\n\n7. **Using \`int[]\` as HashMap key:** Arrays don\'t override \`hashCode()\` and \`equals()\` in Java — they use object identity. Convert to \`String\` via \`Arrays.toString()\` or use a \`List<Integer>\` instead.\n\n8. **Not pre-sizing HashMap for known sizes:** When you know the number of entries, initialize with capacity: \`new HashMap<>((int)(n / 0.75) + 1)\` to avoid rehashing.\n\n---\n\n## 💡 Java-Specific Tips\n\n- **\`computeIfAbsent\`** — The cleanest way to do "get or create":\n  \`\`\`java\n  map.computeIfAbsent(key, k -> new ArrayList<>()).add(value);\n  // vs. verbose alternative:\n  if (!map.containsKey(key)) map.put(key, new ArrayList<>());\n  map.get(key).add(value);\n  \`\`\`\n\n- **\`merge()\`** — The cleanest way to update counts:\n  \`\`\`java\n  map.merge(key, 1, Integer::sum);  // increment by 1\n  map.merge(key, -1, Integer::sum); // decrement by 1\n  \`\`\`\n\n- **\`Map.entry()\` (Java 9+)** — Create immutable entries:\n  \`\`\`java\n  Map<String, Integer> map = Map.of("a", 1, "b", 2); // Immutable map\n  \`\`\`\n\n- **\`LinkedHashMap\` for LRU** — Override \`removeEldestEntry()\` for a simple LRU cache:\n  \`\`\`java\n  Map<K, V> lru = new LinkedHashMap<>(capacity, 0.75f, true) {\n      protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {\n          return size() > capacity;\n      }\n  };\n  \`\`\`\n\n- **\`TreeMap\` navigation methods:**\n  \`\`\`java\n  TreeMap<Integer, V> tm = new TreeMap<>();\n  tm.floorKey(k);    // greatest key <= k\n  tm.ceilingKey(k);  // smallest key >= k\n  tm.subMap(lo, hi); // keys in [lo, hi)\n  tm.headMap(k);     // keys < k\n  tm.tailMap(k);     // keys >= k\n  \`\`\`\n\n- **Iterating entrySet() is faster than keySet() + get():**\n  \`\`\`java\n  // Good — single traversal\n  for (Map.Entry<K, V> e : map.entrySet()) { use e.getKey(), e.getValue(); }\n  // Bad — two lookups per entry\n  for (K key : map.keySet()) { V val = map.get(key); }\n  \`\`\`\n\n---\n\n## 🔗 Comparison Tables\n\n### Java Map/Set Collection Hierarchy\n\n| Type | Ordering | Null Keys | Null Values | Thread-Safe | Use When |\n|------|----------|-----------|-------------|-------------|----------|\n| HashMap | None | 1 allowed | Yes | No | Default O(1) map |\n| LinkedHashMap | Insertion (or access) | 1 allowed | Yes | No | Need order; LRU cache |\n| TreeMap | Sorted (natural/comparator) | No | Yes | No | Need sorted keys; range queries |\n| Hashtable | None | No | No | Yes (slow) | Legacy — avoid |\n| ConcurrentHashMap | None | No | No | Yes (fast) | Multi-threaded |\n| HashSet | None | 1 allowed | N/A | No | Default O(1) set |\n| LinkedHashSet | Insertion | 1 allowed | N/A | No | Ordered unique elements |\n| TreeSet | Sorted | No | N/A | No | Sorted unique; range queries |\n\n### When to Use Which Map?\n\n| Scenario | Best Choice | Why |\n|----------|------------|-----|\n| General-purpose key-value | HashMap | O(1) avg, most common |\n| Need sorted keys | TreeMap | O(log n), navigable |\n| Need insertion order | LinkedHashMap | O(1) + ordering |\n| LRU cache (simple) | LinkedHashMap (access-order) | Built-in eviction |\n| LRU cache (full control) | HashMap + DLL | Custom eviction logic |\n| Frequency counting | HashMap<T, Integer> | merge() pattern |\n| Bidirectional mapping | Two HashMaps | map and reverseMap |\n| Multi-threaded | ConcurrentHashMap | Lock striping, no ConcurrentModEx |\n| Range queries on keys | TreeMap | subMap, floorKey, ceilingKey |\n| Unique elements + order | LinkedHashSet | O(1) + insertion order |\n',
  },
  {
    slug: 'graphs',
    title: 'Graphs',
    icon: 'Network',
    description: 'Master BFS, DFS, shortest paths, topological sort, MST, and advanced graph algorithms.',
    color: 'cyan',
    content: '# Graphs — Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## 📌 Core Concepts\n\n### What is a Graph?\n\nA **graph** G = (V, E) consists of:\n- **V** (vertices/nodes): the entities\n- **E** (edges): connections between entities\n\n| Type | Description | Example |\n|------|-------------|---------|\n| **Undirected** | Edges have no direction | Friendships, roads |\n| **Directed** | Edges have direction (u → v) | Following, dependencies |\n| **Weighted** | Edges have numeric costs | Road distances, latencies |\n| **Unweighted** | All edges have equal cost | Social connections |\n| **Cyclic** | Contains at least one cycle | General graphs |\n| **Acyclic** | No cycles | Trees, DAGs |\n| **DAG** | Directed Acyclic Graph | Task dependencies, course prereqs |\n| **Connected** | Path between every pair (undirected) | Single component |\n\n### Why Graphs?\n\nGraphs model relationships and are fundamental to:\n- Shortest path (GPS, networking)\n- Dependency resolution (build systems, course planning)\n- Social networks (friend suggestions, influence)\n- Grid/maze problems (treated as implicit graphs)\n- Network flow, matching, scheduling\n\n### Java Classes\n\n\`\`\`java\n// === Adjacency List (most common) ===\nMap<Integer, List<int[]>> graph = new HashMap<>(); // node → [(neighbor, weight)]\n// Or for unweighted:\nList<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n\n// === Edge List ===\nint[][] edges; // [[u, v, weight], ...]\n\n// === Adjacency Matrix ===\nint[][] matrix = new int[n][n]; // matrix[u][v] = weight (0 if no edge)\nboolean[][] connected = new boolean[n][n];\n\n// === Grid as Graph (implicit) ===\nint[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}}; // 4-directional\n\`\`\`\n\n---\n\n## 🔍 Visual Deep Dive\n\n### Graph Representations\n\nGiven this graph:\n\n\`\`\`\n    1 --- 2\n    |   / |\n    |  /  |\n    3 --- 4\n      \\\n       5\n\`\`\`\n\n**Adjacency List** (best for sparse graphs — most interview problems):\n\n\`\`\`\n1: [2, 3]\n2: [1, 3, 4]\n3: [1, 2, 4, 5]\n4: [2, 3]\n5: [3]\n\nSpace: O(V + E)\nAdd edge: O(1)\nCheck edge (u,v): O(degree(u))\nIterate neighbors: O(degree(u))\n\`\`\`\n\n\`\`\`java\n// Build adjacency list from edge list\nList<List<Integer>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());\nfor (int[] edge : edges) {\n    adj.get(edge[0]).add(edge[1]);\n    adj.get(edge[1]).add(edge[0]); // undirected\n}\n\`\`\`\n\n**Adjacency Matrix** (best for dense graphs or when checking edge existence frequently):\n\n\`\`\`\n    1  2  3  4  5\n1 [ 0  1  1  0  0 ]\n2 [ 1  0  1  1  0 ]\n3 [ 1  1  0  1  1 ]\n4 [ 0  1  1  0  0 ]\n5 [ 0  0  1  0  0 ]\n\nSpace: O(V²)\nAdd edge: O(1)\nCheck edge (u,v): O(1)  ← advantage\nIterate neighbors: O(V)  ← disadvantage for sparse\n\`\`\`\n\n**Edge List** (best for algorithms that process edges, like Kruskal\'s MST or Bellman-Ford):\n\n\`\`\`\nedges = [(1,2), (1,3), (2,3), (2,4), (3,4), (3,5)]\n\nSpace: O(E)\nAdd edge: O(1)\nCheck edge: O(E)\nBest for: Kruskal, Bellman-Ford\n\`\`\`\n\n### BFS: Breadth-First Search (Level by Level)\n\nBFS explores all nodes at distance d before exploring nodes at distance d+1. Uses a **queue**.\n\n\`\`\`\nGraph:        BFS from node 1:\n  1 --- 2\n  |   / |     Queue states and visited order:\n  |  /  |     \n  3 --- 4     Step 0: queue=[1]        visited={1}\n    \\         \n     5        Step 1: Dequeue 1. Neighbors: 2,3\n              queue=[2,3]    visited={1,2,3}    dist: 2→1, 3→1\n              \n              Step 2: Dequeue 2. Neighbors: 1(visited),3(visited),4\n              queue=[3,4]    visited={1,2,3,4}  dist: 4→2\n              \n              Step 3: Dequeue 3. Neighbors: 1(v),2(v),4(v),5\n              queue=[4,5]    visited={1,2,3,4,5} dist: 5→2\n              \n              Step 4: Dequeue 4. All neighbors visited.\n              queue=[5]\n              \n              Step 5: Dequeue 5. All neighbors visited.\n              queue=[] → DONE\n\nBFS order: 1, 2, 3, 4, 5\nDistance from 1: {1:0, 2:1, 3:1, 4:2, 5:2}\n\nLevel-by-level view:\n  Level 0: [1]\n  Level 1: [2, 3]\n  Level 2: [4, 5]\n\`\`\`\n\n\`\`\`java\npublic int[] bfs(List<List<Integer>> adj, int start, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, -1);\n    dist[start] = 0;\n    Queue<Integer> queue = new LinkedList<>();\n    queue.offer(start);\n    \n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        for (int neighbor : adj.get(node)) {\n            if (dist[neighbor] == -1) {\n                dist[neighbor] = dist[node] + 1;\n                queue.offer(neighbor);\n            }\n        }\n    }\n    return dist;\n}\n// Time: O(V + E), Space: O(V)\n\`\`\`\n\n**BFS gives shortest path in unweighted graphs!**\n\n### DFS: Depth-First Search (Go Deep, Then Backtrack)\n\nDFS explores as far as possible along each branch before backtracking. Uses **recursion** (implicit stack) or an explicit stack.\n\n\`\`\`\nGraph:        DFS from node 1:\n  1 --- 2\n  |   / |     Recursion stack trace:\n  |  /  |     \n  3 --- 4     dfs(1) → visit 1\n    \\           dfs(2) → visit 2     stack: [1, 2]\n     5            dfs(3) → visit 3   stack: [1, 2, 3]\n                    dfs(4) → visit 4 stack: [1, 2, 3, 4]\n                      all neighbors visited → backtrack\n                    dfs(5) → visit 5 stack: [1, 2, 3, 5]\n                      backtrack → backtrack → backtrack → backtrack\n\nDFS order: 1, 2, 3, 4, 5\n\nPre-order numbering (discovery time):\n  Node: 1→1, 2→2, 3→3, 4→4, 5→5\nPost-order numbering (finish time):\n  Node: 4→1, 5→2, 3→3, 2→4, 1→5\n\`\`\`\n\n\`\`\`java\n// Recursive DFS\nboolean[] visited;\npublic void dfs(List<List<Integer>> adj, int node) {\n    visited[node] = true;\n    // Pre-order processing here (before visiting children)\n    for (int neighbor : adj.get(node)) {\n        if (!visited[neighbor]) {\n            dfs(adj, neighbor);\n        }\n    }\n    // Post-order processing here (after all children done)\n}\n\n// Iterative DFS (with explicit stack)\npublic void dfsIterative(List<List<Integer>> adj, int start) {\n    boolean[] visited = new boolean[adj.size()];\n    Deque<Integer> stack = new ArrayDeque<>();\n    stack.push(start);\n    while (!stack.isEmpty()) {\n        int node = stack.pop();\n        if (visited[node]) continue;\n        visited[node] = true;\n        for (int neighbor : adj.get(node)) {\n            if (!visited[neighbor]) stack.push(neighbor);\n        }\n    }\n}\n// Time: O(V + E), Space: O(V)\n\`\`\`\n\n### Topological Sort: Kahn\'s Algorithm (BFS-based)\n\nFor a DAG, topological sort produces a linear ordering where for every edge u → v, u comes before v. **Kahn\'s algorithm** uses in-degree tracking:\n\n\`\`\`\nCourse prerequisites (DAG):\n  0 → 1       (must take 0 before 1)\n  0 → 2       (must take 0 before 2)\n  1 → 3       (must take 1 before 3)\n  2 → 3       (must take 2 before 3)\n\nIn-degrees: node 0=0, node 1=1, node 2=1, node 3=2\n\nStep 1: Enqueue nodes with in-degree 0: queue=[0]\n\nStep 2: Dequeue 0. Output: [0]\n  Reduce in-degree of neighbors:\n  node 1: 1→0 (enqueue!)\n  node 2: 1→0 (enqueue!)\n  queue=[1,2]\n\nStep 3: Dequeue 1. Output: [0,1]\n  Reduce in-degree:\n  node 3: 2→1\n  queue=[2]\n\nStep 4: Dequeue 2. Output: [0,1,2]\n  Reduce in-degree:\n  node 3: 1→0 (enqueue!)\n  queue=[3]\n\nStep 5: Dequeue 3. Output: [0,1,2,3]\n  queue=[] → DONE\n\nTopological order: [0, 1, 2, 3] ✓\nAll 4 nodes processed → no cycle → valid ordering!\n(If output.size() < V → cycle exists!)\n\`\`\`\n\n\`\`\`java\npublic int[] topologicalSort(int numCourses, int[][] prerequisites) {\n    List<List<Integer>> adj = new ArrayList<>();\n    int[] inDegree = new int[numCourses];\n    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n    \n    for (int[] pre : prerequisites) {\n        adj.get(pre[1]).add(pre[0]);\n        inDegree[pre[0]]++;\n    }\n    \n    Queue<Integer> queue = new LinkedList<>();\n    for (int i = 0; i < numCourses; i++) {\n        if (inDegree[i] == 0) queue.offer(i);\n    }\n    \n    int[] order = new int[numCourses];\n    int idx = 0;\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        order[idx++] = node;\n        for (int next : adj.get(node)) {\n            if (--inDegree[next] == 0) queue.offer(next);\n        }\n    }\n    return idx == numCourses ? order : new int[0]; // empty if cycle\n}\n// Time: O(V + E), Space: O(V + E)\n\`\`\`\n\n### Dijkstra\'s Algorithm: Shortest Path with Weights\n\nFinds shortest paths from a source to all other nodes in a graph with **non-negative weights**. Uses a **priority queue** for greedy selection.\n\n\`\`\`\nWeighted graph:\n  0 --4-- 1\n  |       |  \\\n  2       1    6\n  |       |  /\n  2 --3-- 3\n\nAdjacency: 0→[(1,4),(2,2)], 1→[(0,4),(3,1),(3,6)], 2→[(0,2),(3,3)], 3→[(1,1),(2,3),(1,6)]\n\nDijkstra from node 0:\n\nInitial: dist=[0, ∞, ∞, ∞]  PQ=[(0,node0)]\n\nStep 1: Poll (cost=0, node=0).\n  Relax edge 0→1: dist[1]=min(∞, 0+4)=4.  PQ=[(2,2), (4,1)]\n  Relax edge 0→2: dist[2]=min(∞, 0+2)=2.\n  dist=[0, 4, 2, ∞]\n\nStep 2: Poll (cost=2, node=2).\n  Relax edge 2→0: dist[0]=min(0, 2+2)=0. No change.\n  Relax edge 2→3: dist[3]=min(∞, 2+3)=5.  PQ=[(4,1), (5,3)]\n  dist=[0, 4, 2, 5]\n\nStep 3: Poll (cost=4, node=1).\n  Relax edge 1→3: dist[3]=min(5, 4+1)=5. No change.\n  dist=[0, 4, 2, 5]\n\nStep 4: Poll (cost=5, node=3).\n  No improvements possible.\n  dist=[0, 4, 2, 5] → DONE ✓\n\nShortest paths from 0: to 1=4, to 2=2, to 3=5\n\`\`\`\n\n\`\`\`java\npublic int[] dijkstra(Map<Integer, List<int[]>> graph, int src, int n) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    \n    // PQ of [distance, node]\n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    pq.offer(new int[]{0, src});\n    \n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n        if (d > dist[u]) continue;  // Skip outdated entries\n        \n        for (int[] edge : graph.getOrDefault(u, List.of())) {\n            int v = edge[0], w = edge[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    return dist;\n}\n// Time: O((V + E) log V), Space: O(V + E)\n\`\`\`\n\n### Bellman-Ford Algorithm: Handles Negative Weights\n\nRelaxes all edges V-1 times. Detects negative cycles on the Vth pass.\n\n\`\`\`\nGraph with negative edge:\n  0 --4-→ 1\n  |        ↓\n  2       -2\n  ↓        ↓\n  2 --3-→ 3\n\nEdges: (0,1,4), (0,2,2), (1,3,-2), (2,3,3)\n\ndist = [0, ∞, ∞, ∞]\n\nRound 1 (relax all edges):\n  Edge(0,1,4): dist[1] = min(∞, 0+4) = 4\n  Edge(0,2,2): dist[2] = min(∞, 0+2) = 2\n  Edge(1,3,-2): dist[3] = min(∞, 4+(-2)) = 2\n  Edge(2,3,3): dist[3] = min(2, 2+3) = 2 (no change)\n  dist = [0, 4, 2, 2]\n\nRound 2 (relax all edges):\n  No changes → converged early.\n  dist = [0, 4, 2, 2] ✓\n\nRound V (= round 4, cycle detection):\n  If any distance decreases → NEGATIVE CYCLE exists!\n  No changes here → no negative cycle.\n\`\`\`\n\n\`\`\`java\npublic int[] bellmanFord(int n, int[][] edges, int src) {\n    int[] dist = new int[n];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[src] = 0;\n    \n    for (int i = 0; i < n - 1; i++) {\n        boolean changed = false;\n        for (int[] e : edges) {\n            int u = e[0], v = e[1], w = e[2];\n            if (dist[u] != Integer.MAX_VALUE && dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                changed = true;\n            }\n        }\n        if (!changed) break;  // Early termination\n    }\n    \n    // Check for negative cycles\n    for (int[] e : edges) {\n        if (dist[e[0]] != Integer.MAX_VALUE && dist[e[0]] + e[2] < dist[e[1]]) {\n            throw new RuntimeException("Negative cycle detected!");\n        }\n    }\n    return dist;\n}\n// Time: O(V × E), Space: O(V)\n\`\`\`\n\n### Cycle Detection\n\n**Directed graph — DFS Coloring (3 states):**\n\n\`\`\`\nStates: WHITE (unvisited), GRAY (in current DFS path), BLACK (finished)\n\nIf we encounter a GRAY node → BACK EDGE → CYCLE!\n\nExample:  0 → 1 → 2 → 0 (cycle!)\n\ndfs(0): color[0]=GRAY\n  dfs(1): color[1]=GRAY\n    dfs(2): color[2]=GRAY\n      neighbor 0: color[0]==GRAY → CYCLE DETECTED!\n\`\`\`\n\n\`\`\`java\n// Directed cycle detection\nint[] color; // 0=WHITE, 1=GRAY, 2=BLACK\npublic boolean hasCycle(List<List<Integer>> adj, int n) {\n    color = new int[n];\n    for (int i = 0; i < n; i++) {\n        if (color[i] == 0 && dfs(adj, i)) return true;\n    }\n    return false;\n}\n\nprivate boolean dfs(List<List<Integer>> adj, int u) {\n    color[u] = 1; // GRAY\n    for (int v : adj.get(u)) {\n        if (color[v] == 1) return true;       // Back edge → cycle\n        if (color[v] == 0 && dfs(adj, v)) return true;\n    }\n    color[u] = 2; // BLACK\n    return false;\n}\n\`\`\`\n\n**Undirected graph — Parent tracking:**\n\n\`\`\`java\n// Undirected cycle detection\npublic boolean hasCycleUndirected(List<List<Integer>> adj, int n) {\n    boolean[] visited = new boolean[n];\n    for (int i = 0; i < n; i++) {\n        if (!visited[i] && dfsUndirected(adj, i, -1, visited)) return true;\n    }\n    return false;\n}\n\nprivate boolean dfsUndirected(List<List<Integer>> adj, int u, int parent, boolean[] visited) {\n    visited[u] = true;\n    for (int v : adj.get(u)) {\n        if (!visited[v]) {\n            if (dfsUndirected(adj, v, u, visited)) return true;\n        } else if (v != parent) {\n            return true; // Visited and not parent → cycle\n        }\n    }\n    return false;\n}\n\`\`\`\n\n### Grid Problems: Treating Grid as Graph\n\n\`\`\`\nGrid:          Implicit Graph:\n1 1 0          (0,0)─(0,1)    (0,2)\n1 1 0           │  ╲   │\n0 0 1          (1,0)─(1,1)    (1,2)\n\n               (2,0) (2,1)   (2,2)\n\nEach cell is a node. Adjacent cells (4-directional) with value 1 are connected.\n\`\`\`\n\n\`\`\`java\nint[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n\nvoid dfsGrid(int[][] grid, int r, int c, boolean[][] visited) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;\n    if (visited[r][c] || grid[r][c] == 0) return;\n    visited[r][c] = true;\n    for (int[] d : dirs) {\n        dfsGrid(grid, r + d[0], c + d[1], visited);\n    }\n}\n\`\`\`\n\n### Union-Find Integration\n\n**When to use Union-Find vs BFS/DFS:**\n- **Union-Find:** Dynamic connectivity queries ("are A and B connected?"), especially with incremental edge additions\n- **BFS/DFS:** When you need traversal order, shortest paths, or to explore the graph structure\n\n\`\`\`java\nclass UnionFind {\n    int[] parent, rank;\n    int components;\n    \n    UnionFind(int n) {\n        parent = new int[n];\n        rank = new int[n];\n        components = n;\n        for (int i = 0; i < n; i++) parent[i] = i;\n    }\n    \n    int find(int x) {\n        if (parent[x] != x) parent[x] = find(parent[x]); // path compression\n        return parent[x];\n    }\n    \n    boolean union(int a, int b) {\n        int ra = find(a), rb = find(b);\n        if (ra == rb) return false;\n        if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }\n        parent[rb] = ra;\n        if (rank[ra] == rank[rb]) rank[ra]++;\n        components--;\n        return true;\n    }\n}\n\`\`\`\n\n---\n\n## ⚡ Key Algorithms & Techniques\n\n### Algorithm Summary Table\n\n| Algorithm | Use Case | Time | Space | Works With |\n|-----------|----------|------|-------|------------|\n| BFS | Shortest path (unweighted), level order | O(V+E) | O(V) | Unweighted |\n| DFS | Connectivity, cycle detection, topo sort | O(V+E) | O(V) | Any |\n| Topological Sort (Kahn) | Dependency ordering | O(V+E) | O(V+E) | DAGs only |\n| Topological Sort (DFS) | Dependency ordering | O(V+E) | O(V) | DAGs only |\n| Dijkstra | Shortest path (non-negative weights) | O((V+E)logV) | O(V+E) | Non-negative |\n| Bellman-Ford | Shortest path (negative weights ok) | O(V×E) | O(V) | Any (detects neg cycles) |\n| Floyd-Warshall | All-pairs shortest path | O(V³) | O(V²) | Any |\n| Union-Find | Dynamic connectivity | O(α(n))≈O(1) | O(V) | Undirected |\n| Prim\'s MST | Minimum spanning tree | O(E logV) | O(V+E) | Weighted undirected |\n| Kruskal\'s MST | Minimum spanning tree | O(E logE) | O(V+E) | Weighted undirected |\n\n---\n\n## 🎯 Pattern Recognition\n\n\`\`\`\nProblem Keywords → Technique:\n\n"Shortest path" (unweighted)          → BFS\n"Shortest path" (weighted, +)         → Dijkstra\n"Shortest path" (negative weights)    → Bellman-Ford\n"All-pairs shortest path"             → Floyd-Warshall\n"Number of islands / components"      → DFS/BFS or Union-Find\n"Course schedule / prerequisites"     → Topological Sort (Kahn\'s)\n"Detect cycle" (directed)             → DFS coloring (3 states)\n"Detect cycle" (undirected)           → DFS with parent / Union-Find\n"Bipartite check"                     → BFS/DFS 2-coloring\n"Minimum spanning tree"               → Prim\'s or Kruskal\'s\n"Network delay / time"                → Dijkstra from source\n"Word ladder / transformation"        → BFS (each word = node)\n"Clone graph"                         → DFS/BFS + HashMap\n"Grid problem" (connected regions)    → DFS/BFS on grid\n"Alien dictionary"                    → Topological sort from orderings\n"Redundant connection"                → Union-Find (find cycle edge)\n"Is graph a tree?"                    → V-1 edges + connected (Union-Find)\n\`\`\`\n\n---\n\n## 📊 Complexity Cheat Sheet\n\n| Representation | Space | Add Edge | Check Edge | Iterate Neighbors |\n|---------------|-------|----------|------------|-------------------|\n| Adjacency List | O(V+E) | O(1) | O(degree) | O(degree) |\n| Adjacency Matrix | O(V²) | O(1) | **O(1)** | O(V) |\n| Edge List | O(E) | O(1) | O(E) | O(E) |\n\n| Problem Type | Algorithm | Time | Space |\n|-------------|-----------|------|-------|\n| Connected components | DFS/BFS | O(V+E) | O(V) |\n| Shortest path (unweighted) | BFS | O(V+E) | O(V) |\n| Shortest path (Dijkstra) | PQ-based | O((V+E)logV) | O(V) |\n| Topological sort | Kahn\'s BFS | O(V+E) | O(V+E) |\n| Cycle detection (directed) | DFS coloring | O(V+E) | O(V) |\n| Cycle detection (undirected) | DFS/Union-Find | O(V+E)/O(Eα(V)) | O(V) |\n| MST (Prim\'s) | PQ-based | O(ElogV) | O(V+E) |\n| MST (Kruskal\'s) | Sort + Union-Find | O(ElogE) | O(V+E) |\n\n---\n\n## 🧠 Interview Deep Dive: Worked Examples\n\n### Example 1: Number of Islands (LC 200)\n\n**Problem:** Given a 2D grid of \'1\'s (land) and \'0\'s (water), count the number of islands.\n\n**Input:**\n\`\`\`\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1\n\`\`\`\n\n**DFS Trace:**\n\n\`\`\`\nStart scanning from top-left:\n\n(0,0)=\'1\' → NEW ISLAND! DFS to mark entire island:\n  Visit (0,0) → mark \'0\'\n  Visit (0,1) → mark \'0\'\n  Visit (1,0) → mark \'0\'\n  Visit (1,1) → mark \'0\'\n  All neighbors are \'0\' or out of bounds → done\n  Island count = 1\n\n(0,1) already \'0\', skip\n(0,2) is \'0\', skip\n...\n(2,2)=\'1\' → NEW ISLAND!\n  Visit (2,2) → mark \'0\'\n  No unvisited \'1\' neighbors → done\n  Island count = 2\n\n(3,3)=\'1\' → NEW ISLAND!\n  Visit (3,3) → mark \'0\'\n  Visit (3,4) → mark \'0\'\n  No more → done\n  Island count = 3\n\nAnswer: 3 ✓\n\`\`\`\n\n\`\`\`java\npublic int numIslands(char[][] grid) {\n    int count = 0;\n    for (int r = 0; r < grid.length; r++) {\n        for (int c = 0; c < grid[0].length; c++) {\n            if (grid[r][c] == \'1\') {\n                count++;\n                dfs(grid, r, c);\n            }\n        }\n    }\n    return count;\n}\n\nprivate void dfs(char[][] grid, int r, int c) {\n    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return;\n    if (grid[r][c] != \'1\') return;\n    grid[r][c] = \'0\'; // mark visited\n    dfs(grid, r + 1, c);\n    dfs(grid, r - 1, c);\n    dfs(grid, r, c + 1);\n    dfs(grid, r, c - 1);\n}\n// Time: O(R × C), Space: O(R × C) recursion stack worst case\n\`\`\`\n\n### Example 2: Course Schedule II (LC 210)\n\n**Problem:** Given numCourses and prerequisites, return ordering of courses. Return empty if impossible (cycle).\n\n**Input:** numCourses=4, prerequisites=[[1,0],[2,0],[3,1],[3,2]]\n(Meaning: to take 1, need 0 first; to take 2, need 0; to take 3, need 1 and 2)\n\n**Topological Sort Trace:**\n\n\`\`\`\nBuild graph and in-degrees:\n  0 → [1, 2]     in-degree: 0=0, 1=1, 2=1, 3=2\n  1 → [3]\n  2 → [3]\n\nQueue (in-degree = 0): [0]\n\nPoll 0: output=[0]\n  Reduce: in[1]=1→0 (enqueue!), in[2]=1→0 (enqueue!)\n  Queue: [1, 2]\n\nPoll 1: output=[0, 1]\n  Reduce: in[3]=2→1\n  Queue: [2]\n\nPoll 2: output=[0, 1, 2]\n  Reduce: in[3]=1→0 (enqueue!)\n  Queue: [3]\n\nPoll 3: output=[0, 1, 2, 3]\n  Queue: []\n\nAll 4 courses processed → valid order: [0, 1, 2, 3] ✓\n\`\`\`\n\n\`\`\`java\npublic int[] findOrder(int numCourses, int[][] prerequisites) {\n    List<List<Integer>> adj = new ArrayList<>();\n    int[] inDeg = new int[numCourses];\n    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n    \n    for (int[] p : prerequisites) {\n        adj.get(p[1]).add(p[0]);\n        inDeg[p[0]]++;\n    }\n    \n    Queue<Integer> q = new LinkedList<>();\n    for (int i = 0; i < numCourses; i++)\n        if (inDeg[i] == 0) q.offer(i);\n    \n    int[] result = new int[numCourses];\n    int idx = 0;\n    while (!q.isEmpty()) {\n        int course = q.poll();\n        result[idx++] = course;\n        for (int next : adj.get(course))\n            if (--inDeg[next] == 0) q.offer(next);\n    }\n    return idx == numCourses ? result : new int[0];\n}\n// Time: O(V + E), Space: O(V + E)\n\`\`\`\n\n### Example 3: Network Delay Time (LC 743)\n\n**Problem:** Given a network of n nodes and weighted edges, find time for signal from source k to reach all nodes. Return -1 if impossible.\n\n**Input:** times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2\n\n**Dijkstra Trace:**\n\n\`\`\`\nGraph (from edges):\n  2 → [(1,1), (3,1)]\n  3 → [(4,1)]\n\ndist = [∞, ∞, 0, ∞, ∞]  (1-indexed, source=2, dist[2]=0)\nPQ = [(0, node2)]\n\nPoll (0, 2): Process node 2\n  Edge 2→1 (w=1): dist[1] = min(∞, 0+1) = 1. PQ: [(1,1), (1,3)]\n  Edge 2→3 (w=1): dist[3] = min(∞, 0+1) = 1.\n  dist = [∞, 1, 0, 1, ∞]\n\nPoll (1, 1): Process node 1\n  No outgoing edges.\n  dist = [∞, 1, 0, 1, ∞]\n\nPoll (1, 3): Process node 3\n  Edge 3→4 (w=1): dist[4] = min(∞, 1+1) = 2. PQ: [(2,4)]\n  dist = [∞, 1, 0, 1, 2]\n\nPoll (2, 4): Process node 4\n  No outgoing edges.\n\nAll reachable. Answer = max(dist[1..4]) = max(1, 0, 1, 2) = 2 ✓\n\`\`\`\n\n\`\`\`java\npublic int networkDelayTime(int[][] times, int n, int k) {\n    Map<Integer, List<int[]>> graph = new HashMap<>();\n    for (int[] t : times) {\n        graph.computeIfAbsent(t[0], x -> new ArrayList<>())\n             .add(new int[]{t[1], t[2]});\n    }\n    \n    int[] dist = new int[n + 1];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[k] = 0;\n    \n    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);\n    pq.offer(new int[]{0, k});\n    \n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int d = curr[0], u = curr[1];\n        if (d > dist[u]) continue;\n        for (int[] e : graph.getOrDefault(u, List.of())) {\n            int v = e[0], w = e[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{dist[v], v});\n            }\n        }\n    }\n    \n    int maxDist = 0;\n    for (int i = 1; i <= n; i++) {\n        if (dist[i] == Integer.MAX_VALUE) return -1;\n        maxDist = Math.max(maxDist, dist[i]);\n    }\n    return maxDist;\n}\n// Time: O((V + E) log V), Space: O(V + E)\n\`\`\`\n\n---\n\n## ⚠️ Common Mistakes\n\n1. **Forgetting to mark visited BEFORE enqueuing in BFS:** If you mark after dequeuing, a node can be enqueued multiple times, causing TLE.\n   \`\`\`java\n   // WRONG: visited[v] = true after poll()\n   // RIGHT: visited[v] = true when offering to queue\n   \`\`\`\n\n2. **Using BFS for weighted shortest paths:** BFS gives shortest path only for **unweighted** graphs. For weighted graphs, use Dijkstra\'s.\n\n3. **Dijkstra with negative edges:** Results are WRONG. Use Bellman-Ford for graphs with negative weights.\n\n4. **Not detecting cycles in topological sort:** If processed count < V, a cycle exists. Always check this.\n\n5. **Grid problems — not checking bounds FIRST:** Always check \`r >= 0 && r < rows && c >= 0 && c < cols\` before accessing \`grid[r][c]\`.\n\n6. **Modifying input grid permanently without being asked:** If the problem needs the original grid later, clone it or use a separate visited array.\n\n7. **Confusing directed vs undirected cycle detection:** Directed needs 3-state coloring; undirected needs parent tracking. Using undirected detection on directed graphs gives false positives.\n\n8. **Stack overflow on large grids with recursive DFS:** For very large grids (1000×1000), use iterative DFS or BFS to avoid stack overflow.\n\n---\n\n## 💡 Java-Specific Tips\n\n- **Adjacency list creation pattern:**\n  \`\`\`java\n  // For numbered nodes [0..n-1]:\n  List<List<Integer>> adj = new ArrayList<>();\n  for (int i = 0; i < n; i++) adj.add(new ArrayList<>());\n  \n  // For arbitrary labels:\n  Map<String, List<String>> adj = new HashMap<>();\n  adj.computeIfAbsent(u, k -> new ArrayList<>()).add(v);\n  \`\`\`\n\n- **Weighted graph with PQ:**\n  \`\`\`java\n  // Use int[] {distance, node} with Comparator\n  PriorityQueue<int[]> pq = new PriorityQueue<>((a,b) -> a[0] - b[0]);\n  // IMPORTANT: check if d > dist[u] after polling to skip stale entries\n  \`\`\`\n\n- **2D boolean array for visited (grid problems):**\n  \`\`\`java\n  boolean[][] visited = new boolean[rows][cols];\n  // Or modify grid in-place if allowed (saves space)\n  \`\`\`\n\n- **Directions array for grid traversal:**\n  \`\`\`java\n  int[][] dirs4 = {{0,1},{0,-1},{1,0},{-1,0}};       // 4-directional\n  int[][] dirs8 = {{0,1},{0,-1},{1,0},{-1,0},         // 8-directional\n                    {1,1},{1,-1},{-1,1},{-1,-1}};\n  \`\`\`\n\n- **Graph from edge list:**\n  \`\`\`java\n  // Undirected weighted\n  Map<Integer, List<int[]>> g = new HashMap<>();\n  for (int[] e : edges) {\n      g.computeIfAbsent(e[0], k -> new ArrayList<>()).add(new int[]{e[1], e[2]});\n      g.computeIfAbsent(e[1], k -> new ArrayList<>()).add(new int[]{e[0], e[2]});\n  }\n  \`\`\`\n\n---\n\n## 🔗 Comparison Tables\n\n### BFS vs DFS\n\n| Feature | BFS | DFS |\n|---------|-----|-----|\n| Data structure | Queue | Stack / Recursion |\n| Traversal order | Level by level | Deep first |\n| Shortest path (unweighted) | ✅ Yes | ❌ No |\n| Space (worst case) | O(width of graph) | O(height/depth) |\n| Cycle detection | Possible | ✅ Preferred |\n| Topological sort | ✅ Kahn\'s | ✅ Post-order reverse |\n| Best for | Shortest path, levels | Components, cycles, topo sort |\n\n### Shortest Path Algorithms\n\n| Algorithm | Graph Type | Negative Weights | Negative Cycles | Time | Space |\n|-----------|-----------|-----------------|-----------------|------|-------|\n| BFS | Unweighted | N/A | N/A | O(V+E) | O(V) |\n| Dijkstra | Weighted (non-neg) | ❌ | N/A | O((V+E)logV) | O(V) |\n| Bellman-Ford | Any weighted | ✅ | Detects | O(V×E) | O(V) |\n| Floyd-Warshall | All pairs | ✅ | Detects | O(V³) | O(V²) |\n| 0-1 BFS | Weights 0 or 1 | N/A | N/A | O(V+E) | O(V) |\n\n### When to Use What\n\n| Scenario | Algorithm | Why |\n|----------|----------|-----|\n| Unweighted shortest path | BFS | O(V+E), optimal |\n| Weighted shortest path (no neg) | Dijkstra | O((V+E)logV) |\n| Has negative weights | Bellman-Ford | Handles negatives |\n| All pairs, small V | Floyd-Warshall | O(V³), simple |\n| Dynamic connectivity | Union-Find | Near O(1) per query |\n| Task ordering | Topo Sort | Linear time for DAGs |\n| Connected components | DFS/BFS | O(V+E) |\n| Minimum spanning tree | Prim\'s/Kruskal\'s | Greedy on weights |\n| Grid connected regions | DFS (in-place marking) | Simple + fast |\n| Bipartite check | BFS 2-coloring | Level-based coloring |\n',
  },
  {
    slug: 'tries',
    title: 'Tries',
    icon: 'Type',
    description: 'Build prefix trees for autocomplete, word search, and dictionary-based string problems.',
    color: 'pink',
    content: '# Tries (Prefix Trees) — Comprehensive Guide\n\n## Table of Contents\n1. [Core Concepts](#-core-concepts)\n2. [Visual Deep Dive](#-visual-deep-dive)\n3. [Key Algorithms & Techniques](#-key-algorithms--techniques)\n4. [Pattern Recognition](#-pattern-recognition)\n5. [Complexity Cheat Sheet](#-complexity-cheat-sheet)\n6. [Interview Deep Dive: Worked Examples](#-interview-deep-dive-worked-examples)\n7. [Common Mistakes](#-common-mistakes)\n8. [Java-Specific Tips](#-java-specific-tips)\n9. [Comparison Tables](#-comparison-tables)\n\n---\n\n## 📌 Core Concepts\n\n### What is a Trie?\n\nA **Trie** (pronounced "try", from re**trie**val) is a tree-like data structure where each node represents a **single character**, and paths from root to marked nodes form complete words. Unlike BSTs that compare entire keys, tries decompose keys character by character.\n\n### Why Tries?\n\n| Operation | HashSet | Sorted Array | Trie |\n|-----------|---------|-------------|------|\n| Search word | O(L) avg | O(L log n) | **O(L)** guaranteed |\n| Insert word | O(L) avg | O(n) | **O(L)** guaranteed |\n| Prefix search | O(n × L) | O(L log n + k) | **O(P + k)** |\n| Autocomplete (top-k) | O(n × L) | O(L log n + k) | **O(P + k)** |\n| Lexicographic sort | O(n log n) | Already sorted | **O(total chars)** |\n\nWhere L = word length, P = prefix length, n = number of words, k = number of results.\n\n**Key advantage:** Tries excel at **prefix-based operations** — finding all words with a given prefix is O(prefix_length), not O(n).\n\n### Java Classes\n\n\`\`\`java\n// Basic Trie Node — Array-based (lowercase English letters)\nclass TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    boolean isEndOfWord = false;\n    // Optional: count, word reference, etc.\n}\n\n// HashMap-based node (arbitrary characters / large alphabets)\nclass TrieNodeMap {\n    Map<Character, TrieNodeMap> children = new HashMap<>();\n    boolean isEndOfWord = false;\n}\n\n// With word storage (useful for Word Search II)\nclass TrieNodeWithWord {\n    TrieNode[] children = new TrieNode[26];\n    String word = null;  // Store full word at end nodes\n}\n\`\`\`\n\n---\n\n## 🔍 Visual Deep Dive\n\n### Trie Node Structure\n\n\`\`\`\nEach node contains:\n┌──────────────────────────────────────┐\n│ TrieNode                             │\n│ ┌──────────────────────────────────┐ │\n│ │ children[26] (a-z)               │ │\n│ │  [a] [b] [c] ... [p] ... [z]    │ │\n│ │  │    │    ×      │       ×      │ │\n│ │  ↓    ↓           ↓             │ │\n│ │ node node       node            │ │\n│ └──────────────────────────────────┘ │\n│ isEndOfWord: true/false              │\n└──────────────────────────────────────┘\n\nArray-based: children[ch - \'a\'] for lowercase letters\nHashMap-based: children.get(ch) for any character\n\`\`\`\n\n### Insert Operation: Building the Trie Character by Character\n\n**Inserting words: "app", "apple", "ape", "bat"**\n\n\`\`\`\nStart with empty root: (root)\n\nInsert "app":\n  root → \'a\' → \'p\' → \'p\'*\n  \n  (root)\n    │\n    a\n    │\n    p\n    │\n    p ★ (isEndOfWord = true)\n\nInsert "apple":\n  root → \'a\' → \'p\' → \'p\' → \'l\' → \'e\'*\n  Reuse existing path a→p→p, then add l→e\n  \n  (root)\n    │\n    a\n    │\n    p\n    │\n    p ★\n    │\n    l\n    │\n    e ★\n\nInsert "ape":\n  root → \'a\' → \'p\' → \'e\'*\n  Reuse a→p, branch at p with new child \'e\'\n  \n  (root)\n    │\n    a\n    │\n    p\n   / \\\n  p ★  e ★\n  │\n  l\n  │\n  e ★\n\nInsert "bat":\n  root → \'b\' → \'a\' → \'t\'*\n  New branch from root\n  \n  (root)\n   / \\\n  a    b\n  │    │\n  p    a\n / \\   │\np ★ e ★ t ★\n│\nl\n│\ne ★\n\nWords stored: app★, apple★, ape★, bat★\n\`\`\`\n\n### Search vs StartsWith: Traversal Difference\n\n\`\`\`\nTrie contains: app★, apple★, ape★, bat★\n\nsearch("app"):\n  root → a ✓ → p ✓ → p ✓ (isEndOfWord=true) → TRUE ✓\n\nsearch("ap"):\n  root → a ✓ → p ✓ (isEndOfWord=false) → FALSE ✗\n  (Path exists but \'p\' is not marked as word end)\n\nstartsWith("ap"):\n  root → a ✓ → p ✓ (node exists) → TRUE ✓\n  (Only checks if the path exists, doesn\'t need isEndOfWord)\n\nsearch("application"):\n  root → a ✓ → p ✓ → p ✓ → l ✓ → i → NULL → FALSE ✗\n  (Path breaks at \'i\' — no child node)\n\nstartsWith("ba"):\n  root → b ✓ → a ✓ (node exists) → TRUE ✓\n\`\`\`\n\n**Key difference:**\n- \`search(word)\`: Follow path AND check \`isEndOfWord == true\` at final node\n- \`startsWith(prefix)\`: Just check if the path exists (can reach the last character)\n\n### Delete Operation: When to Remove Nodes vs Just Unmark\n\n\`\`\`\nTrie: app★, apple★, ape★\n\nDelete "apple":\n  Traverse: root→a→p→p→l→e★\n  \n  Can we remove the \'e\' node? \n    \'e\' has no children → YES, remove it\n  Can we remove the \'l\' node?\n    \'l\' has no children (after removing \'e\') → YES, remove it\n  Can we remove second \'p\' node?\n    \'p\' is isEndOfWord=true ("app" ends here) → STOP removing!\n  \n  Result: app★, ape★ remain. "apple" deleted.\n\n  Before:           After:\n  (root)            (root)\n    │                 │\n    a                 a\n    │                 │\n    p                 p\n   / \\               / \\\n  p ★  e ★         p ★  e ★\n  │\n  l                (l and e removed)\n  │\n  e ★\n\nDelete "app":\n  Traverse: root→a→p→p★\n  \n  Can we remove second \'p\'?\n    \'p\' has no children → but wait, is it shared?\n    In this trie, \'p\' (second) has no children (after apple was deleted)\n    Remove the \'p\' node... but it was endpoint for "app".\n    Actually: Just unmark isEndOfWord = false.\n    Since no children after unmarking → then remove node.\n  Can we remove first \'p\'?\n    \'p\' still has child \'e\' (for "ape") → STOP removing!\n    \n  Result: only ape★ remains.\n\`\`\`\n\n### Array-Based vs HashMap-Based Children\n\n\`\`\`\nArray-based (TrieNode[] children = new TrieNode[26]):\n  ┌─────────────────────────────────────────────┐\n  │ [a][b][c][d][e][f]...[x][y][z]              │\n  │  ↓  ×  ×  ×  ↓  × ...  ×  ×  ×             │\n  │ node       node                              │\n  └─────────────────────────────────────────────┘\n  \n  Pros:\n  + O(1) child access: children[ch - \'a\']\n  + Better cache locality (contiguous memory)\n  + Simpler code\n  \n  Cons:\n  - Wastes memory: 26 pointers per node even if only 2 used\n  - Fixed alphabet size\n  - 26 × 8 bytes = 208 bytes per node (64-bit JVM)\n\nHashMap-based (Map<Character, TrieNode> children):\n  ┌─────────────────────┐\n  │ {\'a\' → node,        │\n  │  \'e\' → node}        │\n  └─────────────────────┘\n  \n  Pros:\n  + Memory efficient: only stores actual children\n  + Supports ANY character set (Unicode, numbers, etc.)\n  \n  Cons:\n  - HashMap overhead per node (~48 bytes for empty HashMap)\n  - O(1) average but with higher constant factor\n  - Worse cache behavior\n\nRule of thumb:\n  - Lowercase letters only → Array-based (26)\n  - Alphanumeric → Array-based (62) or HashMap\n  - Unicode / large alphabet → HashMap\n  - Memory-constrained → HashMap\n\`\`\`\n\n### Compressed Trie (Radix Tree / Patricia Tree)\n\n\`\`\`\nStandard Trie for: "romane", "romanus", "romulus", "rubens"\n\nStandard Trie:              Compressed Trie (Radix Tree):\n     (root)                       (root)\n      │                          /     \\\n      r                       "r"       \n      │                       / \\        \n      o                    "om"  "ub"    \n      │                    / \\     │     \n      m                 "an" "ulus" "ens" \n     / \\               / \\   ★      ★    \n    a   u            "e" "us"            \n    │   │             ★    ★             \n    n   l                                \n   / \\  │                                \n  e   u u                                \n  ★   s s                                \n      ★ ★                                \n\nCompression: Merge chains of single-child nodes into one edge\nwith a substring label instead of a single character.\n\nBenefits:\n  - Fewer nodes → less memory\n  - Faster traversal (skip multi-char edges)\n  \nTradeoffs:\n  - More complex insert/delete (may need to split edges)\n  - Better for long common prefixes\n\`\`\`\n\n### Trie + DFS: Word Search II Strategy\n\n\`\`\`\nBoard:              Words: ["oath", "pea", "eat", "rain"]\no a a n\ne t a e             Build trie from words:\ni h k r                  (root)\ni f l v                 /  |   \\\n                       o   p    e   r\n                       │   │    │   │\n                       a   e    a   a\n                       │   │    │   │\n                       t   a★   t★  i\n                       │              │\n                       h★             n★\n\nStrategy: For each cell, if the character matches a trie child,\nDFS on the board while simultaneously descending the trie.\n\nStarting at (0,0)=\'o\':\n  Trie root has child \'o\' → descend trie to \'o\', DFS on board\n  (0,0)=\'o\' → (0,1)=\'a\': trie \'o\' has child \'a\' → continue\n  (0,1)=\'a\' → (1,1)=\'t\': trie \'a\' has child \'t\' → continue\n  (1,1)=\'t\' → (2,1)=\'h\': trie \'t\' has child \'h\' → continue\n  (2,1)=\'h\': trie \'h\' is endOfWord → FOUND "oath"!\n  \n  Prune: After finding "oath", mark trie node to avoid duplicates.\n\nKey optimization: \n  The trie prunes the DFS — we only explore board paths \n  that could lead to valid words!\n\`\`\`\n\n---\n\n## ⚡ Key Algorithms & Techniques\n\n### 1. Basic Trie Implementation\n\n\`\`\`java\nclass Trie {\n    private TrieNode root = new TrieNode();\n    \n    static class TrieNode {\n        TrieNode[] children = new TrieNode[26];\n        boolean isEnd = false;\n    }\n    \n    // Insert a word — O(L)\n    public void insert(String word) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null) {\n                node.children[idx] = new TrieNode();\n            }\n            node = node.children[idx];\n        }\n        node.isEnd = true;\n    }\n    \n    // Search for exact word — O(L)\n    public boolean search(String word) {\n        TrieNode node = findNode(word);\n        return node != null && node.isEnd;\n    }\n    \n    // Check if any word starts with prefix — O(P)\n    public boolean startsWith(String prefix) {\n        return findNode(prefix) != null;\n    }\n    \n    private TrieNode findNode(String s) {\n        TrieNode node = root;\n        for (char c : s.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null) return null;\n            node = node.children[idx];\n        }\n        return node;\n    }\n}\n\`\`\`\n\n### 2. Trie with Delete Operation\n\n\`\`\`java\n// Returns true if the node should be deleted (no children, not end of another word)\npublic boolean delete(TrieNode node, String word, int depth) {\n    if (depth == word.length()) {\n        if (!node.isEnd) return false; // Word not found\n        node.isEnd = false;\n        return isEmpty(node); // Delete node if no children\n    }\n    \n    int idx = word.charAt(depth) - \'a\';\n    if (node.children[idx] == null) return false; // Word not found\n    \n    boolean shouldDeleteChild = delete(node.children[idx], word, depth + 1);\n    if (shouldDeleteChild) {\n        node.children[idx] = null;\n        return !node.isEnd && isEmpty(node);\n    }\n    return false;\n}\n\nprivate boolean isEmpty(TrieNode node) {\n    for (TrieNode child : node.children) {\n        if (child != null) return false;\n    }\n    return true;\n}\n\`\`\`\n\n### 3. Autocomplete with Trie\n\n**Idea:** Navigate to the prefix node, then DFS to find all words below it.\n\n\`\`\`\nTrie contains: "apple", "app", "application", "ape", "apex", "bat"\n\nautocomplete("ap"):\n  Navigate: root → \'a\' → \'p\' (prefix node found)\n  DFS from \'p\' node to collect all words:\n    p → p → (isEnd: "app") → l → e → (isEnd: "apple")\n                                   → i → c → a → t → i → o → n → (isEnd: "application")\n    p → e → (isEnd: "ape") → x → (isEnd: "apex")\n  \n  Results: ["app", "apple", "application", "ape", "apex"]\n\`\`\`\n\n\`\`\`java\npublic List<String> autocomplete(String prefix) {\n    List<String> results = new ArrayList<>();\n    TrieNode node = findNode(prefix);\n    if (node == null) return results;\n    \n    dfsCollect(node, new StringBuilder(prefix), results);\n    return results;\n}\n\nprivate void dfsCollect(TrieNode node, StringBuilder sb, List<String> results) {\n    if (node.isEnd) results.add(sb.toString());\n    for (int i = 0; i < 26; i++) {\n        if (node.children[i] != null) {\n            sb.append((char) (\'a\' + i));\n            dfsCollect(node.children[i], sb, results);\n            sb.deleteCharAt(sb.length() - 1);\n        }\n    }\n}\n\`\`\`\n\n### 4. Word Search II (LC 212) — Trie + Backtracking\n\n\`\`\`java\npublic List<String> findWords(char[][] board, String[] words) {\n    // Build trie from words\n    TrieNode root = new TrieNode();\n    for (String word : words) {\n        TrieNode node = root;\n        for (char c : word.toCharArray()) {\n            int idx = c - \'a\';\n            if (node.children[idx] == null)\n                node.children[idx] = new TrieNode();\n            node = node.children[idx];\n        }\n        node.word = word; // Store complete word at end node\n    }\n    \n    List<String> result = new ArrayList<>();\n    for (int r = 0; r < board.length; r++) {\n        for (int c = 0; c < board[0].length; c++) {\n            dfs(board, r, c, root, result);\n        }\n    }\n    return result;\n}\n\nprivate void dfs(char[][] board, int r, int c, TrieNode node, List<String> result) {\n    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return;\n    \n    char ch = board[r][c];\n    if (ch == \'#\' || node.children[ch - \'a\'] == null) return;\n    \n    node = node.children[ch - \'a\'];\n    if (node.word != null) {\n        result.add(node.word);\n        node.word = null; // Avoid duplicates\n    }\n    \n    board[r][c] = \'#\'; // Mark visited\n    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n    for (int[] d : dirs) {\n        dfs(board, r + d[0], c + d[1], node, result);\n    }\n    board[r][c] = ch; // Restore\n    \n    // Optimization: prune empty trie branches\n    // (if node has no children left, remove it from parent)\n}\n\nstatic class TrieNode {\n    TrieNode[] children = new TrieNode[26];\n    String word = null;\n}\n\`\`\`\n\n### 5. Applications of Tries\n\n**Autocomplete System:**\n\`\`\`\nUser types "pro"\n  → Trie navigates to node for "pro"\n  → DFS collects: "program", "programming", "project", "process", ...\n  → Rank by frequency/popularity\n  → Return top-k suggestions\n\`\`\`\n\n**Spell Checker:**\n\`\`\`\nWord "progrm" not in trie.\nGenerate candidates within edit distance 1:\n  Insert: "progrm" → "program" ✓ (insert \'a\')\n  Delete: "progrm" → "progrm" (delete chars)\n  Replace: "progrm" → "program" ✓ (replace \'m\' → \'am\')\nUse trie to quickly validate candidates.\n\`\`\`\n\n**IP Routing (Longest Prefix Match):**\n\`\`\`\nRouting table as binary trie:\n  192.168.1.0/24   → Route A\n  192.168.0.0/16   → Route B\n  10.0.0.0/8       → Route C\n\nPacket to 192.168.1.42:\n  Traverse binary trie for "11000000.10101000.00000001.00101010"\n  Longest matching prefix: 192.168.1.0/24 → Route A\n\`\`\`\n\n---\n\n## 🎯 Pattern Recognition\n\n\`\`\`\nProblem Keywords → Technique:\n\n"Prefix search / autocomplete"        → Trie + DFS collect\n"Word dictionary with wildcards"       → Trie + DFS (branch on \'.\')\n"Word search in grid (multiple)"       → Trie + Backtracking (Word Search II)\n"Longest common prefix"                → Trie (traverse until branch/end)\n"Count words with prefix"              → Trie with prefix count at each node\n"Replace words with prefixes"          → Trie lookup for shortest prefix\n"Palindrome pairs"                     → Trie of reversed words\n"Maximum XOR"                          → Bitwise Trie (binary trie)\n"Concatenated words"                   → Trie + DP\n"Search autocomplete system"           → Trie + frequency + top-k\n"Spell checker"                        → Trie + edit distance\n"Stream of characters"                 → Trie built from reversed patterns\n\`\`\`\n\n---\n\n## 📊 Complexity Cheat Sheet\n\n| Operation | Time | Space | Notes |\n|-----------|------|-------|-------|\n| Insert word | O(L) | O(L) | L = word length, creates at most L nodes |\n| Search word | O(L) | O(1) | Follow existing path |\n| Prefix search | O(P) | O(1) | P = prefix length |\n| Delete word | O(L) | O(1) | May remove up to L nodes |\n| Autocomplete (all) | O(P + K) | O(K) | K = total chars in results |\n| Build trie (N words) | O(N × L) | O(N × L) | Worst case all unique chars |\n| Word Search II | O(R×C × 4^L) | O(N×L + R×C) | Pruned by trie |\n\n| Trie Type | Space per Node | Child Access | Best For |\n|-----------|---------------|-------------|----------|\n| Array[26] | 26 pointers (208B) | O(1) | Lowercase only, speed |\n| Array[128] | 128 pointers (1KB) | O(1) | ASCII characters |\n| HashMap | ~48B base + entries | O(1) avg | Large/dynamic alphabets |\n| Compressed | Varies | O(edge length) | Long common prefixes |\n\n---\n\n## 🧠 Interview Deep Dive: Worked Examples\n\n### Example 1: Implement Trie (LC 208)\n\n**Problem:** Implement a trie with insert, search, and startsWith.\n\n**Step-by-step trace:**\n\n\`\`\`\nTrie trie = new Trie();\n\ntrie.insert("apple"):\n  root → [a]=new → [p]=new → [p]=new → [l]=new → [e]=new, isEnd=true\n  \n  (root)─a─p─p─l─e★\n\ntrie.search("apple"):\n  root → a ✓ → p ✓ → p ✓ → l ✓ → e ✓, isEnd=true → TRUE ✓\n\ntrie.search("app"):\n  root → a ✓ → p ✓ → p ✓, isEnd=false → FALSE ✗\n\ntrie.startsWith("app"):\n  root → a ✓ → p ✓ → p ✓, node exists → TRUE ✓\n\ntrie.insert("app"):\n  root → a(exists) → p(exists) → p(exists), isEnd=true\n  \n  (root)─a─p─p★─l─e★\n\ntrie.search("app"):\n  root → a ✓ → p ✓ → p ✓, isEnd=true → TRUE ✓\n\`\`\`\n\nSee implementation in Key Algorithms section above.\n\n### Example 2: Word Search II (LC 212)\n\n**Problem:** Given a board and list of words, find all words that can be formed by adjacent cells.\n\n**Input:**\n\`\`\`\nBoard:        Words: ["oath", "pea", "eat", "rain"]\no a a n\ne t a e\ni h k r\ni f l v\n\`\`\`\n\n**Trace:**\n\n\`\`\`\nBuild trie from words:\n  Insert "oath": root→o→a→t→h★\n  Insert "pea":  root→p→e→a★\n  Insert "eat":  root→e→a→t★\n  Insert "rain": root→r→a→i→n★\n\nScan board (r,c), try each cell as starting point:\n\n(0,0)=\'o\': Trie root has child \'o\' ✓\n  DFS: (0,0)=\'o\' → trie at \'o\'\n  \n  Neighbors of (0,0): (0,1)=\'a\', (1,0)=\'e\'\n  \n  (0,1)=\'a\': trie \'o\' has child \'a\' ✓ → trie at \'o\'→\'a\'\n    (1,1)=\'t\': trie \'a\' has child \'t\' ✓ → trie at \'o\'→\'a\'→\'t\'\n      (2,1)=\'h\': trie \'t\' has child \'h\' ✓ → trie at \'o\'→\'a\'→\'t\'→\'h\'★\n      FOUND "oath"! ★ Add to results. Null out word to prevent dupes.\n      \n  (1,0)=\'e\': trie \'o\' has child \'e\'? NO → skip\n\n(1,0)=\'e\': Trie root has child \'e\' ✓\n  DFS: (1,0)=\'e\' → trie at \'e\'\n  (1,1)=\'t\': trie \'e\' has child... NO (\'e\' has child \'a\', not \'t\') → skip\n  (0,0)=\'o\': trie \'e\' has child \'o\'? NO → skip\n  No valid paths.\n\n(1,1)=\'t\': Trie root has child \'t\'? NO → skip\n\n...continue scanning...\n\n(1,0)=\'e\': Try path e→a→t\n  Actually: (1,0)→(0,0) not matching, but (1,0)→(0,1) or (1,0)→(1,1)→...\n  Need e→a→t: (1,0)=\'e\' → up to (0,0)=\'o\' NO\n               (1,0)=\'e\' → right (1,1)=\'t\' → trie \'e\' needs \'a\' not \'t\'\n               \n  The word "eat" can be found starting from a different position.\n  (Let\'s find it from a cell with \'e\' that has path e→a→t)\n\nBoard scan finds: "oath", "eat"\nResult: ["oath", "eat"]\n\`\`\`\n\n### Example 3: Design Search Autocomplete System (LC 642)\n\n**Problem:** Design an autocomplete system. Given a sentence history with frequencies, support:\n- \`input(char c)\`: User types a character. Return top-3 sentences matching current prefix, sorted by frequency (then lexicographic). \'#\' marks end of input.\n\n**Approach:** Trie where each node stores a map of \`{sentence → frequency}\` for all sentences passing through that node. On each character input, descend the trie and return sorted results.\n\n\`\`\`java\nclass AutocompleteSystem {\n    class TrieNode {\n        Map<Character, TrieNode> children = new HashMap<>();\n        Map<String, Integer> counts = new HashMap<>();\n    }\n    \n    TrieNode root = new TrieNode();\n    TrieNode curr;          // Current position in trie\n    StringBuilder sb;       // Current input being typed\n    \n    public AutocompleteSystem(String[] sentences, int[] times) {\n        root = new TrieNode();\n        for (int i = 0; i < sentences.length; i++) {\n            addSentence(sentences[i], times[i]);\n        }\n        curr = root;\n        sb = new StringBuilder();\n    }\n    \n    private void addSentence(String sentence, int count) {\n        TrieNode node = root;\n        for (char c : sentence.toCharArray()) {\n            node.children.putIfAbsent(c, new TrieNode());\n            node = node.children.get(c);\n            node.counts.merge(sentence, count, Integer::sum);\n        }\n    }\n    \n    public List<String> input(char c) {\n        if (c == \'#\') {\n            addSentence(sb.toString(), 1);\n            curr = root;\n            sb = new StringBuilder();\n            return new ArrayList<>();\n        }\n        \n        sb.append(c);\n        if (curr != null) {\n            curr = curr.children.get(c);\n        }\n        if (curr == null) return new ArrayList<>();\n        \n        // Get top 3 by frequency (desc), then lexicographic (asc)\n        PriorityQueue<Map.Entry<String, Integer>> pq = new PriorityQueue<>(\n            (a, b) -> a.getValue() != b.getValue()\n                ? a.getValue() - b.getValue()\n                : b.getKey().compareTo(a.getKey())\n        );\n        \n        for (Map.Entry<String, Integer> entry : curr.counts.entrySet()) {\n            pq.offer(entry);\n            if (pq.size() > 3) pq.poll();\n        }\n        \n        LinkedList<String> result = new LinkedList<>();\n        while (!pq.isEmpty()) result.addFirst(pq.poll().getKey());\n        return result;\n    }\n}\n\`\`\`\n\n**Trace:**\n\n\`\`\`\nInit: sentences=["i love you","island","iroman","i love leetcode"], times=[5,3,2,2]\n\nTrie built. Let\'s trace input:\n\ninput(\'i\'):\n  curr = root → \'i\' node\n  Counts at \'i\': {"i love you":5, "island":3, "iroman":2, "i love leetcode":2}\n  Top 3 by freq: ["i love you", "island", "i love leetcode"]\n  (iroman and i love leetcode both freq 2, "i love leetcode" < "iroman" lex)\n\ninput(\' \'):\n  curr = \'i\' → \' \' node\n  Counts: {"i love you":5, "i love leetcode":2}\n  Top 3: ["i love you", "i love leetcode"]\n\ninput(\'a\'):\n  curr = \' \' → \'a\'? No child \'a\' → curr = null\n  Return []\n\ninput(\'#\'):\n  Save "i a" with count 1. Reset.\n  Return []\n\`\`\`\n\n---\n\n## ⚠️ Common Mistakes\n\n1. **Confusing search() and startsWith():** \`search\` requires \`isEndOfWord == true\` at the final node. \`startsWith\` only requires the path to exist. Forgetting the \`isEnd\` check makes search return true for prefixes.\n\n2. **Not pruning in Word Search II:** After finding a word, mark \`node.word = null\` to avoid adding duplicates. Also prune empty branches for performance.\n\n3. **Memory waste with array[26] for large alphabets:** If the alphabet is large (Unicode, mixed case), using a 26-size array either wastes memory or causes bugs. Use HashMap for flexible alphabets.\n\n4. **Deletion complexity — not checking shared nodes:** When deleting a word, don\'t blindly remove nodes. Check if a node is part of another word\'s path (has other children or is another word\'s endpoint).\n\n5. **Not considering empty string edge cases:** An empty string should typically return true for startsWith("") and search("") only if empty string was explicitly inserted.\n\n6. **Allocating new StringBuilder in DFS collect:** In autocomplete DFS, create ONE StringBuilder and use append/deleteCharAt. Don\'t create new strings at each level — that causes O(L²) per path instead of O(L).\n\n7. **Forgetting to restore board state in Word Search II:** When using the board itself for visited marking (\`board[r][c] = \'#\'\`), always restore the original character during backtracking.\n\n8. **Building a new trie per query in autocomplete:** The trie should be built once and maintained. Only the current traversal position changes per character input.\n\n---\n\n## 💡 Java-Specific Tips\n\n- **Array vs HashMap children — performance:**\n  \`\`\`java\n  // Array: ~3-5x faster due to no hashing/boxing\n  TrieNode[] children = new TrieNode[26];\n  children[ch - \'a\'];  // Direct index, no overhead\n  \n  // HashMap: more flexible but slower\n  Map<Character, TrieNode> children = new HashMap<>();\n  children.get(ch);    // Hash computation, autoboxing char→Character\n  \`\`\`\n\n- **Store the full word at end nodes** (avoids rebuilding):\n  \`\`\`java\n  class TrieNode {\n      TrieNode[] children = new TrieNode[26];\n      String word = null;  // null if not end of word\n  }\n  // During insert: node.word = word; (instead of isEnd = true)\n  // During search: found word = node.word\n  \`\`\`\n\n- **Count prefix occurrences with a counter at each node:**\n  \`\`\`java\n  class TrieNode {\n      TrieNode[] children = new TrieNode[26];\n      int prefixCount = 0;  // How many words pass through this node\n      int wordCount = 0;    // How many words end at this node\n  }\n  \`\`\`\n\n- **Trie iteration for lexicographic sort:**\n  \`\`\`java\n  // DFS traversal of a trie yields words in lexicographic order!\n  // Because children[0]=\'a\' < children[1]=\'b\' < ... < children[25]=\'z\'\n  void lexSort(TrieNode node, StringBuilder sb, List<String> sorted) {\n      if (node.isEnd) sorted.add(sb.toString());\n      for (int i = 0; i < 26; i++) {\n          if (node.children[i] != null) {\n              sb.append((char)(\'a\' + i));\n              lexSort(node.children[i], sb, sorted);\n              sb.deleteCharAt(sb.length() - 1);\n          }\n      }\n  }\n  \`\`\`\n\n- **Bitwise Trie for Maximum XOR:**\n  \`\`\`java\n  // Each "character" is a bit (0 or 1), from MSB to LSB\n  // To maximize XOR, at each bit position, try to go in the opposite direction\n  class BitTrieNode {\n      BitTrieNode[] children = new BitTrieNode[2]; // [0] and [1]\n  }\n  \`\`\`\n\n---\n\n## 🔗 Comparison Tables\n\n### Trie vs Other String Data Structures\n\n| Feature | Trie | HashSet | Sorted Array | BST (of strings) |\n|---------|------|---------|-------------|------------------|\n| Search word | O(L) | O(L) avg | O(L log n) | O(L log n) |\n| Insert | O(L) | O(L) avg | O(n) | O(L log n) |\n| Prefix search | **O(P)** ★ | O(n×L) | O(L log n) | O(L log n) |\n| Autocomplete | **O(P+K)** ★ | O(n×L) | O(L log n + K) | O(L log n + K) |\n| Space | O(N×L) | O(N×L) | O(N×L) | O(N×L) |\n| Wildcard search | **O(26^w × L)** | O(n×L) | O(n×L) | O(n×L) |\n| Lexicographic order | **DFS = sorted** | No order | Already sorted | In-order |\n| Memory overhead | High (node pointers) | Moderate (hash table) | Low | Moderate |\n\n### When to Use Trie vs Alternatives\n\n| Scenario | Best Choice | Why |\n|----------|------------|-----|\n| Exact word lookup only | HashSet | Simpler, same O(L) |\n| Prefix-based search | **Trie** | O(P) prefix lookup |\n| Autocomplete / suggestions | **Trie** + frequency | Natural prefix traversal |\n| Word search on grid | **Trie** | Prunes DFS branches |\n| Spell checking | **Trie** + edit distance | Efficient candidate generation |\n| Dictionary with wildcard \'.\' | **Trie** + DFS branching | Handle wildcards naturally |\n| Simple frequency counting | HashMap | No prefix structure needed |\n| Range queries on strings | TreeSet / Sorted Array | subSet(), binary search |\n| Maximum XOR of two numbers | **Bitwise Trie** | Greedy bit-by-bit decisions |\n| IP routing (longest prefix) | **Compressed Trie** | Longest prefix match |\n\n### Trie Implementation Variants\n\n| Variant | Description | Best For |\n|---------|-------------|----------|\n| Standard Trie | One char per node | General purpose |\n| Compressed (Radix) | Multi-char edges | Long common prefixes |\n| Ternary Search Tree | 3 children (lt, eq, gt) | Memory efficient |\n| DAFSA / DAWG | Shared suffixes too | Static dictionaries |\n| Bitwise Trie | Binary (0/1) per node | XOR problems, IP routing |\n| Double-Array Trie | Array-based compact | Very fast lookup, static |\n',
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
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Interview Deep Dive: Worked Examples](#interview-deep-dive-worked-examples)
- [Common Mistakes](#common-mistakes)
- [Java-Specific Tips](#java-specific-tips)
- [Comparison Tables](#comparison-tables)

---

## 📌 Core Concepts

Union-Find (also called Disjoint Set Union — DSU) is a data structure that tracks a collection of **disjoint (non-overlapping) sets**. It supports two primary operations:

1. **Find(x):** Determine which set element \`x\` belongs to (returns the **root/representative** of the set).
2. **Union(x, y):** Merge the sets containing \`x\` and \`y\` into a single set.

### Why Union-Find Matters

Union-Find is the go-to structure when you need to:
- Track **connected components** as edges are added dynamically
- Detect **cycles** in an undirected graph
- Build a **Minimum Spanning Tree** (Kruskal's algorithm)
- Solve **equivalence/grouping** problems (accounts merge, synonymous sentences)

### The Key Insight

Instead of storing explicit groups, each element points to a **parent**. Following parent pointers leads to a **root** (an element that points to itself). Two elements are in the same set if and only if they share the same root.

\`\`\`
Initial state: each element is its own root
┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐
│ 0 │ │ 1 │ │ 2 │ │ 3 │ │ 4 │
└─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘ └─┬─┘
  ↓      ↓      ↓      ↓      ↓
 self   self   self   self   self

parent: [0, 1, 2, 3, 4]
\`\`\`

---

## 🔍 Visual Deep Dive

### Basic Find & Union Operations

**Union(0, 1):** Make 1's parent point to 0 (or vice versa)
\`\`\`
Before Union(0, 1):          After Union(0, 1):
┌───┐ ┌───┐ ┌───┐           ┌───┐   ┌───┐
│ 0 │ │ 1 │ │ 2 │           │ 0 │   │ 2 │
└───┘ └───┘ └───┘           └─┬─┘   └───┘
                               │
                             ┌─┴─┐
                             │ 1 │
                             └───┘

parent: [0, 1, 2]  ──►  parent: [0, 0, 2]
\`\`\`

**Find(1):** Follow parent pointers until root
\`\`\`
find(1):  1 → parent[1] = 0 → parent[0] = 0 (root!)
Answer: 0
\`\`\`

**Union(1, 2):** First find roots, then merge
\`\`\`
find(1) = 0,  find(2) = 2
Make parent[2] = 0

Before:                 After Union(1, 2):
  ┌───┐   ┌───┐           ┌───┐
  │ 0 │   │ 2 │           │ 0 │
  └─┬─┘   └───┘           └─┬─┘
    │                      ┌─┴──┐
  ┌─┴─┐                 ┌─┴─┐┌─┴─┐
  │ 1 │                 │ 1 ││ 2 │
  └───┘                 └───┘└───┘

parent: [0, 0, 2]  ──►  parent: [0, 0, 0]
\`\`\`

### The Problem with Naive Union: Tall Trees

Without optimization, unions can create **degenerate chains**:
\`\`\`
Union(0,1), Union(1,2), Union(2,3), Union(3,4) naively:

        ┌───┐
        │ 0 │
        └─┬─┘
        ┌─┴─┐
        │ 1 │
        └─┬─┘
        ┌─┴─┐
        │ 2 │
        └─┬─┘
        ┌─┴─┐
        │ 3 │
        └─┬─┘
        ┌─┴─┐
        │ 4 │
        └───┘

find(4) requires traversing 4 edges → O(n) per find!
\`\`\`

### Path Compression — Flattening the Tree

**Idea:** When we call \`find(x)\`, make every node on the path point directly to the root.

\`\`\`
Before find(4):                After find(4) with path compression:

        ┌───┐                     ┌─────────────────┐
        │ 0 │                     │        0        │
        └─┬─┘                     └─┬──┬──┬──┬─────┘
        ┌─┴─┐                       │  │  │  │
        │ 1 │                      ┌┴┐┌┴┐┌┴┐┌┴┐
        └─┬─┘                      │1││2││3││4│
        ┌─┴─┐                      └─┘└─┘└─┘└─┘
        │ 2 │
        └─┬─┘                 All nodes now point directly to root!
        ┌─┴─┐                 parent: [0, 0, 0, 0, 0]
        │ 3 │
        └─┬─┘
        ┌─┴─┐
        │ 4 │
        └───┘
\`\`\`

**Step-by-step trace of find(4):**
\`\`\`
Step 1: Visit 4 → parent[4] = 3 (not root)
Step 2: Visit 3 → parent[3] = 2 (not root)
Step 3: Visit 2 → parent[2] = 1 (not root)
Step 4: Visit 1 → parent[1] = 0 (not root)
Step 5: Visit 0 → parent[0] = 0 (root found!)

Now flatten — set parent of every visited node to 0:
  parent[4] = 0
  parent[3] = 0
  parent[2] = 0
  parent[1] = 0  (already was 0)

Future find(4): 4 → 0  (just 1 hop!)
\`\`\`

### Union by Rank — Balanced Merging

**Idea:** Always attach the shorter tree under the taller tree. This keeps trees shallow.

\`\`\`
Tree A (rank 2):      Tree B (rank 1):
      ┌───┐                ┌───┐
      │ 0 │                │ 5 │
      └─┬─┘                └─┬─┘
     ┌──┴──┐              ┌─┴─┐
   ┌─┴─┐ ┌─┴─┐           │ 6 │
   │ 1 │ │ 2 │           └───┘
   └─┬─┘ └───┘
   ┌─┴─┐
   │ 3 │
   └───┘

Union by rank: attach B under A (rank A >= rank B)

         ┌─────┐
         │  0  │   rank stays 2
         └──┬──┘
      ┌─────┼─────┐
    ┌─┴─┐ ┌─┴─┐ ┌─┴─┐
    │ 1 │ │ 2 │ │ 5 │
    └─┬─┘ └───┘ └─┬─┘
    ┌─┴─┐        ┌─┴─┐
    │ 3 │        │ 6 │
    └───┘        └───┘

If we had attached A under B instead:
         ┌───┐
         │ 5 │    rank would increase to 3!
         └─┬─┘
        ┌──┴──┐
      ┌─┴─┐ ┌─┴─┐
      │ 6 │ │ 0 │      ← taller tree, worse!
      └───┘ └─┬─┘
           ┌──┴──┐
         ┌─┴─┐ ┌─┴─┐
         │ 1 │ │ 2 │
         └─┬─┘ └───┘
         ┌─┴─┐
         │ 3 │
         └───┘
\`\`\`

### Union by Size (Alternative to Rank)

Instead of tree height, track **number of elements** in each set:
\`\`\`
Tree A (size 4):      Tree B (size 2):
      ┌───┐                ┌───┐
      │ 0 │                │ 5 │
      └─┬─┘                └─┬─┘
     ┌──┴──┐              ┌─┴─┐
   ┌─┴─┐ ┌─┴─┐           │ 6 │
   │ 1 │ │ 2 │           └───┘
   └─┬─┘ └───┘
   ┌─┴─┐
   │ 3 │
   └───┘

Union by size: attach smaller (B) under larger (A)
→ parent[5] = 0, size[0] = 6
\`\`\`

**Rank vs Size:**
| Aspect | Union by Rank | Union by Size |
|---|---|---|
| What's tracked | Upper bound on height | Exact element count |
| When to update | Only when equal ranks merge | Always (add sizes) |
| Guarantee | Height ≤ log n | Height ≤ log n |
| Practical use | Slightly simpler | Useful when set size needed |

---

## ⚡ Key Algorithms & Techniques

### Complete Java Implementation

\`\`\`java
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int count; // number of connected components

    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i; // every element is its own root
        }
    }

    // Find with path compression (recursive)
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }

    // Find with path compression (iterative — avoids stack overflow)
    public int findIterative(int x) {
        int root = x;
        while (parent[root] != root) root = parent[root];
        // Path compression: point all nodes to root
        while (parent[x] != root) {
            int next = parent[x];
            parent[x] = root;
            x = next;
        }
        return root;
    }

    // Union by rank
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false; // already connected

        // Attach smaller rank tree under larger rank tree
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        count--;
        return true; // successfully merged two components
    }

    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }

    public int getCount() {
        return count;
    }
}
\`\`\`

### Inverse Ackermann Function — Why It's Nearly O(1)

With **both** path compression and union by rank, each operation takes **O(α(n))** amortized time, where α is the inverse Ackermann function.

**Intuitive explanation:**
\`\`\`
α(n) grows INCREDIBLY slowly:

n                    α(n)
─────────────────────────
1                      0
2                      1
4                      2
16                     3
65536                  4
2^65536 (>>> atoms     5
 in universe)

For any practical input size, α(n) ≤ 4.
So Union-Find is effectively O(1) per operation!
\`\`\`

**Why it works:** Path compression flattens trees aggressively. Union by rank limits how tall trees can grow. Together, they guarantee that after some initial restructuring, nearly every find is a single parent lookup.

### Weighted Union-Find (for Equation Problems)

Used when edges carry **weight/ratio** information (e.g., a/b = 2.0, b/c = 3.0, find a/c).

\`\`\`java
class WeightedUnionFind {
    private int[] parent;
    private double[] weight; // weight[i] = ratio from i to parent[i]

    public WeightedUnionFind(int n) {
        parent = new int[n];
        weight = new double[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            weight[i] = 1.0; // i/parent[i] = 1.0 (self)
        }
    }

    // Returns {root, weight_to_root}
    public int find(int x) {
        if (parent[x] != x) {
            int originalParent = parent[x];
            parent[x] = find(parent[x]);
            weight[x] *= weight[originalParent]; // chain the ratios
        }
        return parent[x];
    }

    // Union x and y with the relation x/y = value
    public void union(int x, int y, double value) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;
        parent[rootX] = rootY;
        // weight[rootX] = (y/rootY) * value * (rootX/ x) ... derive:
        weight[rootX] = weight[y] * value / weight[x];
    }

    // Query: what is x/y? Returns -1.0 if not connected
    public double query(int x, int y) {
        if (find(x) != find(y)) return -1.0;
        return weight[x] / weight[y];
    }
}
\`\`\`

**Visual example — Evaluate Division:**
\`\`\`
Given: a/b = 2.0,  b/c = 3.0
Query: a/c = ?

Build weighted Union-Find:
  union(a, b, 2.0):  a ──2.0──► b
  union(b, c, 3.0):  b ──3.0──► c

After path compression for find(a):
  a ──6.0──► c   (2.0 * 3.0 = 6.0)

query(a, c) = weight[a] / weight[c] = 6.0 / 1.0 = 6.0 ✓
\`\`\`

### Application: Kruskal's MST Algorithm

\`\`\`
Graph with edges:
  A─B: 4,  A─C: 2,  B─C: 1,  B─D: 5,  C─D: 8,  C─E: 10,  D─E: 2

Step 1: Sort edges by weight
  B─C:1, A─C:2, D─E:2, A─B:4, B─D:5, C─D:8, C─E:10

Step 2: Process edges with Union-Find

  Edge B─C (w=1): find(B)≠find(C) → union(B,C)  ✓ MST
  ┌─┐ ┌─┐ ┌───┐ ┌─┐ ┌─┐
  │A│ │B─────C│ │D│ │E│     Components: {A},{B,C},{D},{E}
  └─┘ └─┘ └───┘ └─┘ └─┘

  Edge A─C (w=2): find(A)≠find(C) → union(A,C)  ✓ MST
  ┌───────────┐ ┌─┐ ┌─┐
  │A───B───C  │ │D│ │E│     Components: {A,B,C},{D},{E}
  └───────────┘ └─┘ └─┘

  Edge D─E (w=2): find(D)≠find(E) → union(D,E)  ✓ MST
  ┌───────────┐ ┌─────┐
  │A───B───C  │ │D───E│     Components: {A,B,C},{D,E}
  └───────────┘ └─────┘

  Edge A─B (w=4): find(A)==find(B) → SKIP (cycle!) ✗

  Edge B─D (w=5): find(B)≠find(D) → union(B,D)  ✓ MST
  ┌─────────────────────┐
  │A───B───C───D───E    │   Components: {A,B,C,D,E}
  └─────────────────────┘

  DONE! n-1 = 4 edges added. MST weight = 1+2+2+5 = 10
\`\`\`

\`\`\`java
// Kruskal's MST using Union-Find
public int kruskalMST(int n, int[][] edges) {
    // edges[i] = {u, v, weight}
    Arrays.sort(edges, (a, b) -> a[2] - b[2]);
    UnionFind uf = new UnionFind(n);
    int mstWeight = 0, edgesUsed = 0;

    for (int[] edge : edges) {
        if (uf.union(edge[0], edge[1])) {
            mstWeight += edge[2];
            edgesUsed++;
            if (edgesUsed == n - 1) break;
        }
    }
    return edgesUsed == n - 1 ? mstWeight : -1; // -1 if not connected
}
\`\`\`

### Cycle Detection in Undirected Graphs

\`\`\`java
public boolean hasCycle(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    for (int[] edge : edges) {
        // If two nodes share the same root, adding this edge creates a cycle
        if (!uf.union(edge[0], edge[1])) {
            return true; // cycle detected!
        }
    }
    return false;
}
\`\`\`

---

## 🎯 Pattern Recognition

| Problem Signal | Union-Find Application |
|---|---|
| "Connected components" / "number of groups" | Track count in Union-Find |
| "Are X and Y connected?" | find(x) == find(y) |
| "Adding edges dynamically" | Union as edges arrive |
| "Find redundant connection" | Edge that creates a cycle (union returns false) |
| "Merge accounts/groups" | Union elements sharing a key |
| "Equations with ratios" | Weighted Union-Find |
| "Minimum spanning tree" | Kruskal's with Union-Find |
| "Earliest time all connected" | Process edges in time order, check count==1 |
| "Number of islands" (grid) | Union adjacent land cells |
| "Lexicographically smallest equivalent" | Union characters, find returns smallest in group |

### When Union-Find Excels vs Alternatives

**Union-Find is BEST when:**
- Edges/connections are added over time (dynamic connectivity)
- You only need to answer "same component?" queries
- You need cycle detection during graph construction
- The graph is too large for adjacency list + BFS/DFS

**BFS/DFS is BETTER when:**
- You need shortest paths or distances
- You need to enumerate all nodes in a component
- The graph is static (built once, queried once)
- You need to find articulation points or bridges

---

## 📊 Complexity Cheat Sheet

| Operation | Naive | Path Compression Only | Union by Rank Only | Both Optimizations |
|---|---|---|---|---|
| Find | O(n) | O(log n) amortized | O(log n) | O(α(n)) ≈ O(1) |
| Union | O(n) | O(log n) amortized | O(log n) | O(α(n)) ≈ O(1) |
| Space | O(n) | O(n) | O(n) | O(n) |
| Connected | O(n) | O(log n) amortized | O(log n) | O(α(n)) ≈ O(1) |

| Problem | Time Complexity | Space |
|---|---|---|
| Number of Connected Components | O(n · α(n)) | O(n) |
| Kruskal's MST | O(E log E + E · α(V)) | O(V) |
| Cycle Detection | O(E · α(V)) | O(V) |
| Accounts Merge | O(NK · α(NK)) | O(NK) |
| Redundant Connection | O(n · α(n)) | O(n) |

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Number of Connected Components in an Undirected Graph

**Problem:** Given \`n\` nodes labeled \`0\` to \`n-1\` and a list of undirected edges, find the number of connected components.

\`\`\`
n = 5, edges = [[0,1],[1,2],[3,4]]

Visual:
  0 ── 1 ── 2      3 ── 4
  (component 1)    (component 2)

Answer: 2
\`\`\`

**Trace with Union-Find:**
\`\`\`
Initialize: parent = [0,1,2,3,4], count = 5

Process edge [0,1]:
  find(0) = 0, find(1) = 1 → different roots
  union: parent[1] = 0, count = 4
  parent = [0,0,2,3,4]

Process edge [1,2]:
  find(1) → 1→0 (root=0), find(2) = 2 → different roots
  union: parent[2] = 0, count = 3
  parent = [0,0,0,3,4]

Process edge [3,4]:
  find(3) = 3, find(4) = 4 → different roots
  union: parent[4] = 3, count = 2
  parent = [0,0,0,3,3]

Final count = 2 ✓
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

### Example 2: Redundant Connection

**Problem:** A tree of \`n\` nodes has one extra edge added. Find the edge that, if removed, results in a tree.

\`\`\`
Input: edges = [[1,2],[1,3],[2,3]]

  1 ── 2
  │  ╱
  3

Edge [2,3] creates the cycle → return [2,3]
\`\`\`

**Trace with Union-Find:**
\`\`\`
Initialize: parent = [0,1,2,3], count = 3 (using 1-indexed)

Process edge [1,2]:
  find(1) = 1, find(2) = 2 → different → union(1,2)
  parent = [0,1,1,3]

Process edge [1,3]:
  find(1) = 1, find(3) = 3 → different → union(1,3)
  parent = [0,1,1,1]

Process edge [2,3]:
  find(2) → 2→1 (root=1)
  find(3) → 3→1 (root=1)
  SAME ROOT! → This edge is redundant → return [2,3] ✓
\`\`\`

\`\`\`java
public int[] findRedundantConnection(int[][] edges) {
    int n = edges.length;
    UnionFind uf = new UnionFind(n + 1); // 1-indexed nodes
    for (int[] edge : edges) {
        if (!uf.union(edge[0], edge[1])) {
            return edge; // this edge creates a cycle
        }
    }
    return new int[0];
}
\`\`\`

### Example 3: Accounts Merge

**Problem:** Given accounts where each has a name and list of emails, merge accounts that share any email.

\`\`\`
Input:
  Account 0: ["John", "john@mail.com", "john_newyork@mail.com"]
  Account 1: ["John", "john@mail.com", "john00@mail.com"]
  Account 2: ["Mary", "mary@mail.com"]
  Account 3: ["John", "johnnybravo@mail.com"]

Accounts 0 and 1 share "john@mail.com" → merge

Output:
  ["John", "john00@mail.com", "john@mail.com", "john_newyork@mail.com"]
  ["Mary", "mary@mail.com"]
  ["John", "johnnybravo@mail.com"]
\`\`\`

**Strategy:**
\`\`\`
1. Map each email to an account index
2. For each account, union all its emails' indices
3. Group emails by their root account
4. Sort and format output

Step 1 — email → first account seen:
  "john@mail.com"         → 0
  "john_newyork@mail.com" → 0
  "john00@mail.com"       → 1
  "mary@mail.com"         → 2
  "johnnybravo@mail.com"  → 3

  But "john@mail.com" appears in account 0 AND 1
  → union(0, 1)

Step 2 — Union-Find after processing:
  parent: [0, 0, 2, 3]
  Account 0 and 1 merged, 2 and 3 separate

Step 3 — Group emails by root:
  Root 0: john@mail.com, john_newyork@mail.com, john00@mail.com
  Root 2: mary@mail.com
  Root 3: johnnybravo@mail.com
\`\`\`

\`\`\`java
public List<List<String>> accountsMerge(List<List<String>> accounts) {
    int n = accounts.size();
    UnionFind uf = new UnionFind(n);
    // email -> first account index that owns it
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

    // Group emails by root account
    Map<Integer, TreeSet<String>> groups = new HashMap<>();
    for (Map.Entry<String, Integer> entry : emailToId.entrySet()) {
        int root = uf.find(entry.getValue());
        groups.computeIfAbsent(root, k -> new TreeSet<>()).add(entry.getKey());
    }

    // Build result
    List<List<String>> result = new ArrayList<>();
    for (Map.Entry<Integer, TreeSet<String>> entry : groups.entrySet()) {
        List<String> account = new ArrayList<>();
        account.add(accounts.get(entry.getKey()).get(0)); // name
        account.addAll(entry.getValue());
        result.add(account);
    }
    return result;
}
\`\`\`

### Example 4: Earliest Time When Everyone Becomes Friends

**Problem:** Given friendship events \`[timestamp, personA, personB]\`, find the earliest time when all people are in one connected component.

\`\`\`
Input: n = 6, logs = [[0,2,0],[1,0,1],[3,0,3],[4,1,2],[7,4,5],[8,3,4]]
(sorted by timestamp)

Trace:
  t=0: union(2,0) → {0,2},{1},{3},{4},{5}  count=5
  t=1: union(0,1) → {0,1,2},{3},{4},{5}    count=4
  t=3: union(0,3) → {0,1,2,3},{4},{5}      count=3
  t=4: union(1,2) → already connected       count=3
  t=7: union(4,5) → {0,1,2,3},{4,5}        count=2
  t=8: union(3,4) → {0,1,2,3,4,5}          count=1 ← Answer: 8
\`\`\`

\`\`\`java
public int earliestAcq(int[][] logs, int n) {
    Arrays.sort(logs, (a, b) -> a[0] - b[0]);
    UnionFind uf = new UnionFind(n);
    for (int[] log : logs) {
        uf.union(log[1], log[2]);
        if (uf.getCount() == 1) return log[0];
    }
    return -1; // never all connected
}
\`\`\`

---

## ⚠️ Common Mistakes

1. **Comparing nodes instead of roots:** Always call \`find()\` before comparing.
\`\`\`java
// WRONG
if (parent[x] == parent[y]) ...
// CORRECT
if (find(x) == find(y)) ...
\`\`\`

2. **Forgetting \`parent[i] = i\` initialization:** Every element must start as its own root.
\`\`\`java
// WRONG — parent array defaults to all 0s
parent = new int[n];
// CORRECT
for (int i = 0; i < n; i++) parent[i] = i;
\`\`\`

3. **Rank increment error:** Only increment rank when merging trees of **equal** rank.
\`\`\`java
// WRONG — always incrementing
rank[rootX]++;
// CORRECT — only when equal
if (rank[rootX] == rank[rootY]) rank[rootX]++;
\`\`\`

4. **Union without find:** Must find roots first, then merge roots.
\`\`\`java
// WRONG
parent[x] = y;
// CORRECT
int rootX = find(x), rootY = find(y);
parent[rootX] = rootY;
\`\`\`

5. **Off-by-one with 1-indexed nodes:** If nodes are labeled 1 to n, allocate array of size n+1.

6. **Expecting split/delete:** Union-Find does **NOT** support disconnecting nodes. If you need removal, consider different data structures.

7. **Forgetting to check \`rootX == rootY\` before union:** Skipping this can corrupt rank or count.

8. **Using Union-Find for shortest paths:** Union-Find only tracks connectivity, not distances.

---

## 💡 Java-Specific Tips

### Array vs HashMap for Parent Storage

\`\`\`java
// For integer nodes 0..n-1 — use array (faster)
int[] parent = new int[n];

// For string/object keys — use HashMap
Map<String, String> parent = new HashMap<>();

public String find(String x) {
    if (!parent.containsKey(x)) parent.put(x, x);
    if (!parent.get(x).equals(x)) {
        parent.put(x, find(parent.get(x)));
    }
    return parent.get(x);
}
\`\`\`

### Practical Tips

- **Always use both optimizations** (path compression + union by rank/size) in interviews.
- **The \`union\` method returning boolean** is extremely useful — indicates whether a merge actually happened (true) or nodes were already connected (false).
- **Count tracking:** Decrement count in union only when \`rootX != rootY\`.
- **Iterative find** is safer than recursive for very large inputs (avoids StackOverflowError).
- **For grid problems**, map 2D coordinates to 1D: \`id = row * cols + col\`.

\`\`\`java
// 2D grid to Union-Find mapping
int rows = grid.length, cols = grid[0].length;
UnionFind uf = new UnionFind(rows * cols);
// Cell (r,c) maps to index r * cols + c
int id = r * cols + c;
\`\`\`

### Common Interview Template

\`\`\`java
// Template: count connected components using Union-Find
public int solve(int n, int[][] connections) {
    UnionFind uf = new UnionFind(n);
    for (int[] conn : connections) {
        uf.union(conn[0], conn[1]);
    }
    return uf.getCount();
}
\`\`\`

---

## 🔗 Comparison Tables

### Union-Find vs BFS/DFS for Connectivity

| Criteria | Union-Find | BFS/DFS |
|---|---|---|
| Dynamic edges (added over time) | ✅ Excellent | ❌ Must rebuild |
| Static graph, one-time query | ⚠️ Works but overkill | ✅ Natural fit |
| "Is X connected to Y?" | ✅ O(α(n)) | ⚠️ O(V+E) per query |
| Count all components | ✅ Tracked automatically | ✅ Count DFS starts |
| Find all nodes in a component | ❌ Must iterate all nodes | ✅ Single DFS/BFS |
| Shortest path between nodes | ❌ Not supported | ✅ BFS for unweighted |
| Cycle detection (undirected) | ✅ O(E · α(V)) | ✅ O(V + E) |
| Cycle detection (directed) | ❌ Not applicable | ✅ DFS with coloring |
| Minimum Spanning Tree | ✅ Kruskal's | ❌ Use Prim's instead |
| Space complexity | O(V) | O(V + E) for adj list |

### When to Choose What

| Scenario | Best Choice | Why |
|---|---|---|
| Edges arrive one by one, query connectivity | Union-Find | Incremental updates are O(α(n)) |
| Given full graph, find components once | DFS/BFS | Simpler, one pass |
| Need to detect cycle while building graph | Union-Find | Natural: union returns false = cycle |
| Need shortest path in component | BFS | Union-Find cannot do paths |
| Grid connectivity (islands) | Either | UF if dynamic; DFS if static |
| Kruskal's MST | Union-Find | Core part of the algorithm |
| Accounts merge / grouping | Union-Find | Dynamic merging of groups |
| Evaluate equations (ratios) | Weighted UF | Tracks edge weights through path |

### Common LeetCode Problems by Category

| Problem | Key Idea | Difficulty |
|---|---|---|
| 323. Number of Connected Components | Basic component count | Medium |
| 684. Redundant Connection | Cycle detection | Medium |
| 721. Accounts Merge | Group by shared key | Medium |
| 399. Evaluate Division | Weighted Union-Find | Medium |
| 1135. Connecting Cities With Min Cost | Kruskal's MST | Medium |
| 1202. Smallest String With Swaps | Union + sort within components | Medium |
| 990. Satisfiability of Equality Equations | == means union, != means check | Medium |
| 1319. Number of Operations to Make Network Connected | Components - 1 extra edges | Medium |
| 952. Largest Component Size by Common Factor | Union numbers sharing factors | Hard |
| 803. Bricks Falling When Hit | Reverse time + Union-Find | Hard |
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
- [Visual Deep Dive](#visual-deep-dive)
- [The DP Framework](#the-dp-framework)
- [All DP Patterns](#all-dp-patterns)
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Interview Deep Dive: Worked Examples](#interview-deep-dive-worked-examples)
- [Common Mistakes](#common-mistakes)
- [Java-Specific Tips](#java-specific-tips)
- [Comparison Tables](#comparison-tables)

---

## 📌 Core Concepts

Dynamic Programming is **THE most important interview topic**. It appears in roughly 30-40% of hard-level questions and many medium-level ones. Mastering DP patterns is non-negotiable for top tech interviews.

### What Is Dynamic Programming?

DP is an optimization technique for problems with:
1. **Optimal substructure:** The optimal solution contains optimal solutions to sub-problems.
2. **Overlapping sub-problems:** The same sub-problems are solved repeatedly.

**Key Insight:** Instead of recomputing results, **store them** (memoize) and reuse.

### The DP Framework (5 Steps)

Every DP problem follows this framework:

\`\`\`
Step 1: DEFINE THE STATE
  → What does dp[i] (or dp[i][j]) represent?
  → This is the hardest and most important step.

Step 2: RECURRENCE RELATION
  → How does dp[i] relate to previous states?
  → dp[i] = f(dp[i-1], dp[i-2], ...)

Step 3: BASE CASES
  → What are the known values? (dp[0], dp[1], etc.)

Step 4: COMPUTATION ORDER
  → Fill dp array so dependencies are computed first.
  → Bottom-up: usually left-to-right, top-to-bottom.

Step 5: SPACE OPTIMIZATION
  → Can we reduce from O(n^2) to O(n) or O(1)?
  → If dp[i] only depends on dp[i-1], use rolling variables.
\`\`\`

---

## 🔍 Visual Deep Dive

### Top-Down (Memoization) vs Bottom-Up (Tabulation)

**Fibonacci Example: F(5)**

**Top-Down — Recursion + Cache:**
\`\`\`
                    fib(5)
                  /        \\
              fib(4)       fib(3)  ← already cached!
             /      \\
         fib(3)    fib(2)  ← already cached!
        /     \\
    fib(2)   fib(1)
   /     \\
fib(1) fib(0)

Call order: fib(5)→fib(4)→fib(3)→fib(2)→fib(1)→fib(0)
            ↑ return 1  ↑ return 1
            fib(2)=1, fib(3)=2, back to fib(4)
            fib(2) cached! → fib(4)=3
            fib(3) cached! → fib(5)=5

Only 6 unique calls instead of 15 recursive calls!
\`\`\`

**Bottom-Up — Iterative Table Fill:**
\`\`\`
dp: [0, 1, _, _, _, _]

i=2: dp[2] = dp[1] + dp[0] = 1 + 0 = 1
     [0, 1, 1, _, _, _]

i=3: dp[3] = dp[2] + dp[1] = 1 + 1 = 2
     [0, 1, 1, 2, _, _]

i=4: dp[4] = dp[3] + dp[2] = 2 + 1 = 3
     [0, 1, 1, 2, 3, _]

i=5: dp[5] = dp[4] + dp[3] = 3 + 2 = 5
     [0, 1, 1, 2, 3, 5]  ✓
\`\`\`

**Space-Optimized — Rolling Variables:**
\`\`\`
Only need prev2 and prev1:

prev2=0, prev1=1
i=2: curr = 0+1 = 1, prev2=1, prev1=1
i=3: curr = 1+1 = 2, prev2=1, prev1=2
i=4: curr = 2+1 = 3, prev2=2, prev1=3
i=5: curr = 3+2 = 5, prev2=3, prev1=5  ✓

Space: O(n) → O(1)!
\`\`\`

### Comparison: Top-Down vs Bottom-Up

| Aspect | Top-Down (Memoization) | Bottom-Up (Tabulation) |
|---|---|---|
| Implementation | Recursive + HashMap/array | Iterative + array |
| Ease of writing | Often more intuitive | Requires careful ordering |
| States computed | Only reachable states | All states in range |
| Stack overflow risk | Yes (deep recursion) | No |
| Space optimization | Harder | Easier (rolling array) |
| Performance | Slight overhead (recursion) | Slightly faster (no call stack) |
| When to prefer | Complex state transitions | When space opt needed |

---

## ⚡ All DP Patterns

### Pattern 1: Linear DP

**State:** \`dp[i]\` depends on \`dp[i-1]\`, \`dp[i-2]\`, etc.

**Climbing Stairs — Visual:**
\`\`\`
dp[i] = number of ways to reach step i

     Step:  0   1   2   3   4   5
     Ways:  1   1   2   3   5   8
                 ↑   ↑
                 │   └── dp[2] = dp[1] + dp[0] = 1 + 1
                 └────── dp[1] = 1 (one way: single step)

dp[i] = dp[i-1] + dp[i-2]  (take 1 step or 2 steps)
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

**House Robber — Visual State Table:**
\`\`\`
Houses: [2, 7, 9, 3, 1]
dp[i] = max money robbing from houses 0..i

  i=0: dp[0] = 2             (rob house 0)
  i=1: dp[1] = max(2,7) = 7  (rob house 0 or 1, not both)
  i=2: dp[2] = max(dp[1], dp[0]+9) = max(7, 11) = 11  (skip 1, rob 0+2)
  i=3: dp[3] = max(dp[2], dp[1]+3) = max(11, 10) = 11 (skip 3)
  i=4: dp[4] = max(dp[3], dp[2]+1) = max(11, 12) = 12 (rob 0,2,4)

dp:   [2, 7, 11, 11, 12]
                       ↑ Answer: 12
Recurrence: dp[i] = max(dp[i-1], dp[i-2] + nums[i])
\`\`\`

\`\`\`java
public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < nums.length; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
\`\`\`

### Pattern 2: Knapsack Variants

**0/1 Knapsack — Visual 2D Table Fill:**
\`\`\`
Items: weights=[1,3,4,5], values=[1,4,5,7], capacity=7

dp[i][w] = max value using items 0..i-1 with capacity w

       w:  0  1  2  3  4  5  6  7
item 0:    0  1  1  1  1  1  1  1   (w=1, v=1)
item 1:    0  1  1  4  5  5  5  5   (w=3, v=4)
item 2:    0  1  1  4  5  6  6  9   (w=4, v=5)
item 3:    0  1  1  4  5  7  8  9   (w=5, v=7)
                                 ↑ Answer: 9

Arrows show decisions (← skip item, ↖ take item):

For dp[2][7]: max(dp[1][7], dp[1][3]+5) = max(5, 4+5) = 9 ↖ take
For dp[3][7]: max(dp[2][7], dp[2][2]+7) = max(9, 1+7) = 9 ← skip

Recurrence:
  dp[i][w] = max(dp[i-1][w],                    // skip item i
                 dp[i-1][w-weight[i]] + value[i]) // take item i
  if w >= weight[i], else dp[i][w] = dp[i-1][w]
\`\`\`

\`\`\`java
// 0/1 Knapsack - space optimized
public int knapsack01(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        // MUST iterate capacity backwards for 0/1 knapsack
        for (int w = capacity; w >= weights[i]; w--) {
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
\`\`\`

**Unbounded Knapsack (items can be reused):**
\`\`\`java
// Only difference: iterate capacity FORWARDS
public int knapsackUnbounded(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++) {
        for (int w = weights[i]; w <= capacity; w++) { // FORWARD
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
        }
    }
    return dp[capacity];
}
\`\`\`

**Subset Sum — Special case of 0/1 Knapsack:**
\`\`\`
Can we pick elements from nums to sum to target?

nums = [2, 3, 7, 8, 10], target = 11

dp[j] = true if we can form sum j

Process item 2:  dp = [T, F, T, F, F, F, F, F, F, F, F, F]
Process item 3:  dp = [T, F, T, T, F, T, F, F, F, F, F, F]
Process item 7:  dp = [T, F, T, T, F, T, F, T, F, T, T, F]
Process item 8:  dp = [T, F, T, T, F, T, F, T, T, F, T, T]
                                                          ↑ dp[11]=true!
\`\`\`

### Pattern 3: String DP

**Edit Distance — Visual Table with Operation Arrows:**
\`\`\`
word1 = "horse", word2 = "ros"

dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1]

      ""  r  o  s
  ""   0  1  2  3    ← base: inserting into empty
  h    1  1  2  3
  o    2  2  1  2
  r    3  2  2  2
  s    4  3  3  2  ← Answer
  e    5  4  4  3  ← Answer: 3

Trace back from dp[5][3] = 3:
  dp[5][3]=3 ← dp[4][3]+1 (delete 'e')
  dp[4][3]=2 ← dp[3][2] (match 's'='s', diagonal, no cost)
  dp[3][2]=2 ← dp[2][1]+1 (replace 'r' with 'o')
  dp[2][1]=1 ← dp[1][0] (match... no)
  Actually: dp[2][1] = dp[1][0]+1? Let me re-trace.
  
Operations: horse → rorse (replace h→r) → ros (delete r, delete e)
           or: horse → rose (replace h→r, delete r) → ros (delete e)

Recurrence:
  If word1[i-1] == word2[j-1]:
    dp[i][j] = dp[i-1][j-1]           // characters match, no cost
  Else:
    dp[i][j] = 1 + min(
      dp[i-1][j],     // delete from word1
      dp[i][j-1],     // insert into word1
      dp[i-1][j-1]    // replace
    )
\`\`\`

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
                dp[i][j] = 1 + Math.min(dp[i - 1][j - 1],
                                Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
    }
    return dp[m][n];
}
\`\`\`

**Longest Common Subsequence (LCS):**
\`\`\`
text1 = "abcde", text2 = "ace"

      ""  a  c  e
  ""   0  0  0  0
  a    0  1  1  1
  b    0  1  1  1
  c    0  1  2  2
  d    0  1  2  2
  e    0  1  2  3  ← Answer: 3 ("ace")

Recurrence:
  match:    dp[i][j] = dp[i-1][j-1] + 1
  mismatch: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
\`\`\`

### Pattern 4: Interval DP

**Matrix Chain Multiplication — Subproblem Breakdown:**
\`\`\`
Matrices: A1(10x30), A2(30x5), A3(5x60)

Possible orderings:
  (A1 * A2) * A3: 10*30*5 + 10*5*60 = 1500 + 3000 = 4500
  A1 * (A2 * A3): 30*5*60 + 10*30*60 = 9000 + 18000 = 27000

dp[i][j] = min cost to multiply matrices i through j

Split at k (i <= k < j):
  dp[i][j] = min over all k of:
    dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]

Fill order: by increasing chain length
  len=1: dp[0][0]=0, dp[1][1]=0, dp[2][2]=0
  len=2: dp[0][1]=1500, dp[1][2]=9000
  len=3: dp[0][2]=min(1500+0+3000, 0+9000+18000) = 4500
\`\`\`

\`\`\`java
public int matrixChainOrder(int[] dims) {
    int n = dims.length - 1; // number of matrices
    int[][] dp = new int[n][n];

    for (int len = 2; len <= n; len++) {
        for (int i = 0; i <= n - len; i++) {
            int j = i + len - 1;
            dp[i][j] = Integer.MAX_VALUE;
            for (int k = i; k < j; k++) {
                int cost = dp[i][k] + dp[k + 1][j]
                         + dims[i] * dims[k + 1] * dims[j + 1];
                dp[i][j] = Math.min(dp[i][j], cost);
            }
        }
    }
    return dp[0][n - 1];
}
\`\`\`

### Pattern 5: Grid DP

**Unique Paths — Visual Grid with Values:**
\`\`\`
dp[i][j] = number of ways to reach cell (i,j) from (0,0)
Only move right or down.

  ┌───┬───┬───┬───┬───┬───┬───┐
  │ 1 │ 1 │ 1 │ 1 │ 1 │ 1 │ 1 │  ← top row: only one way (all right)
  ├───┼───┼───┼───┼───┼───┼───┤
  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │
  ├───┼───┼───┼───┼───┼───┼───┤
  │ 1 │ 3 │ 6 │10 │15 │21 │28 │  ← Answer: 28
  └───┴───┴───┴───┴───┴───┴───┘
    ↑
  left column: only one way (all down)

dp[i][j] = dp[i-1][j] + dp[i][j-1]
\`\`\`

**Minimum Path Sum:**
\`\`\`
grid:           dp (min sum to reach each cell):
┌───┬───┬───┐   ┌───┬───┬───┐
│ 1 │ 3 │ 1 │   │ 1 │ 4 │ 5 │
├───┼───┼───┤   ├───┼───┼───┤
│ 1 │ 5 │ 1 │   │ 2 │ 7 │ 6 │
├───┼───┼───┤   ├───┼───┼───┤
│ 4 │ 2 │ 1 │   │ 6 │ 8 │ 7 │ ← Answer: 7
└───┴───┴───┘   └───┴───┴───┘

Path: 1→3→1→1→1 = 7  or  1→1→5→1→1 = 9
Best: 1→3→1→1→1 = 7 ✓
\`\`\`

\`\`\`java
public int minPathSum(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    // Modify grid in-place to save space
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) continue;
            else if (i == 0) grid[i][j] += grid[i][j - 1];
            else if (j == 0) grid[i][j] += grid[i - 1][j];
            else grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
        }
    }
    return grid[m - 1][n - 1];
}
\`\`\`

### Pattern 6: Tree DP

**House Robber III — Recursion on Tree:**
\`\`\`
      3
     / \\
    2    3
     \\    \\
      3    1

Option 1: Rob root(3) + grandchildren(3+1) = 7 ✓
Option 2: Rob children(2+3) = 5

For each node, return [notRob, rob]:
  Leaf 3 (left-left):  [0, 3]
  Leaf 1 (right-right): [0, 1]
  Node 2: [max(0,3), 2+0] = [3, 2]
  Node 3r: [max(0,1), 3+0] = [1, 3]
  Root 3: [max(3,2)+max(1,3), 3+3+1] = [3+3, 3+3+1] = [6, 7]

Answer: max(6, 7) = 7
\`\`\`

\`\`\`java
public int rob(TreeNode root) {
    int[] result = robHelper(root);
    return Math.max(result[0], result[1]);
}

// returns [notRob, rob]
private int[] robHelper(TreeNode node) {
    if (node == null) return new int[]{0, 0};

    int[] left = robHelper(node.left);
    int[] right = robHelper(node.right);

    int notRob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);
    int rob = node.val + left[0] + right[0];

    return new int[]{notRob, rob};
}
\`\`\`

**Binary Tree Diameter:**
\`\`\`
For each node, diameter through it = leftDepth + rightDepth
Track global maximum.

        1
       / \\
      2    3       depth(4)=0, depth(5)=0
     / \\           depth(2) = 1 + max(0,0) = 1
    4   5          diameter through 2 = 0+0 = 0
                   depth(3) = 0
                   diameter through 1 = 1+0+depth(3)
                   Actually: leftDepth=2, rightDepth=1
                   diameter through 1 = 2 + 1 = 3
\`\`\`

### Pattern 7: Bitmask DP

**Traveling Salesman Problem (TSP) — State as Bits:**
\`\`\`
4 cities: 0, 1, 2, 3
State = bitmask of visited cities

mask = 0b1010 means cities 1 and 3 visited
mask = 0b1111 means all 4 cities visited

dp[mask][i] = min cost to visit cities in mask, ending at city i

Example transitions from dp[0b0101][2] (visited {0,2}, at city 2):
  → Visit city 1: dp[0b0111][1] = dp[0b0101][2] + dist[2][1]
  → Visit city 3: dp[0b1101][3] = dp[0b0101][2] + dist[2][3]

Total states: 2^n * n = 2^4 * 4 = 64
Much better than n! = 24 brute force permutations!
\`\`\`

\`\`\`java
public int tsp(int[][] dist) {
    int n = dist.length;
    int[][] dp = new int[1 << n][n];
    for (int[] row : dp) Arrays.fill(row, Integer.MAX_VALUE);
    dp[1][0] = 0; // start at city 0, only city 0 visited

    for (int mask = 1; mask < (1 << n); mask++) {
        for (int u = 0; u < n; u++) {
            if (dp[mask][u] == Integer.MAX_VALUE) continue;
            if ((mask & (1 << u)) == 0) continue;
            for (int v = 0; v < n; v++) {
                if ((mask & (1 << v)) != 0) continue; // already visited
                int newMask = mask | (1 << v);
                dp[newMask][v] = Math.min(dp[newMask][v],
                                          dp[mask][u] + dist[u][v]);
            }
        }
    }

    int allVisited = (1 << n) - 1;
    int ans = Integer.MAX_VALUE;
    for (int u = 0; u < n; u++) {
        if (dp[allVisited][u] != Integer.MAX_VALUE) {
            ans = Math.min(ans, dp[allVisited][u] + dist[u][0]);
        }
    }
    return ans;
}
\`\`\`

### Pattern 8: State Machine DP

**Best Time to Buy and Sell Stock with Cooldown — State Transitions:**
\`\`\`
States at each day:
  HELD:    holding a stock
  SOLD:    just sold (cooldown tomorrow)
  REST:    not holding, not in cooldown

Transitions:
  ┌──────┐    sell      ┌──────┐   cooldown   ┌──────┐
  │ HELD │───────────►  │ SOLD │─────────────► │ REST │
  └──┬───┘              └──────┘               └──┬───┘
     │   ▲                                        │
     │   │              buy                       │
     │   └────────────────────────────────────────┘
     │
     │ hold (do nothing)
     └──────────┐
                │
     ┌──────────┘
     ↓

Day-by-day:
  held[i] = max(held[i-1], rest[i-1] - price[i])  // hold or buy
  sold[i] = held[i-1] + price[i]                   // sell
  rest[i] = max(rest[i-1], sold[i-1])              // rest or cooldown done
\`\`\`

\`\`\`java
public int maxProfit(int[] prices) {
    int n = prices.length;
    if (n < 2) return 0;
    int held = -prices[0], sold = 0, rest = 0;
    for (int i = 1; i < n; i++) {
        int newHeld = Math.max(held, rest - prices[i]);
        int newSold = held + prices[i];
        int newRest = Math.max(rest, sold);
        held = newHeld;
        sold = newSold;
        rest = newRest;
    }
    return Math.max(sold, rest);
}
\`\`\`

**Stock Problem Variants — State Machine Overview:**
\`\`\`
│ Problem              │ States          │ Transitions              │
│ Buy/Sell Once        │ noStock, held   │ buy once, sell once      │
│ Buy/Sell Unlimited   │ noStock, held   │ buy/sell any time        │
│ With Cooldown        │ held,sold,rest  │ sold→rest (cooldown)     │
│ With Fee             │ noStock, held   │ sell incurs fee          │
│ At Most K Trades     │ [k][2] states   │ k buy-sell cycles        │
\`\`\`

### Pattern 9: Digit DP

**Concept:** Count numbers from 0 to N that satisfy some digit-level property.

\`\`\`
How many numbers from 1 to N have digit sum = S?

State: dp[pos][sum][tight][started]
  pos:     current digit position (left to right)
  sum:     running digit sum so far
  tight:   are we still bounded by N's digits?
  started: have we placed a non-zero digit yet?

Example: count numbers <= 235 with digit sum = 5
  Process digit by digit:
    Position 0: digit can be 0-2 (tight) or 0-9 (not tight)
    Position 1: if pos0=2, digit can be 0-3 (tight)
    Position 2: if pos0=2,pos1=3, digit can be 0-5 (tight)

This avoids iterating through all numbers 1..N!
Time: O(digits * maxSum * 2 * 2) instead of O(N)
\`\`\`

### Space Optimization: Rolling Array (2D → 1D)

\`\`\`
Many 2D DP problems have: dp[i][j] depends only on dp[i-1][...]

Original 2D:
  ┌─────────────────────┐
  │ dp[0][0..n]         │ ← row 0
  ├─────────────────────┤
  │ dp[1][0..n]         │ ← depends only on row 0
  ├─────────────────────┤
  │ dp[2][0..n]         │ ← depends only on row 1
  ├─────────────────────┤
  │ ...                 │
  └─────────────────────┘

Rolling array — only keep 2 rows:
  ┌─────────────────────┐
  │ prev[0..n]          │ ← previous row
  ├─────────────────────┤
  │ curr[0..n]          │ ← current row
  └─────────────────────┘
  After each row: prev = curr

Or even better — just 1 row (if iteration order is correct):
  ┌─────────────────────┐
  │ dp[0..n]            │ ← update in-place
  └─────────────────────┘
  For 0/1 knapsack: iterate j from right to left
  For unbounded knapsack: iterate j from left to right
\`\`\`

---

## 🎯 Pattern Recognition

| Problem Signal | DP Pattern |
|---|---|
| "Maximum/minimum cost/ways to reach end" | Linear DP |
| "Select items with weight constraint" | Knapsack |
| "Can we partition into equal subsets?" | Subset Sum (Knapsack) |
| "Edit distance / string matching" | String DP |
| "Longest common subsequence/substring" | String DP |
| "Parenthesize expression optimally" | Interval DP |
| "Min/max moves in a grid" | Grid DP |
| "Rob houses on a tree" | Tree DP |
| "Visit all nodes exactly once" | Bitmask DP |
| "Stock buy/sell with conditions" | State Machine DP |
| "Count numbers with digit property" | Digit DP |
| "Can it be broken into dictionary words?" | Linear DP (word break) |
| "Number of ways to decode" | Linear DP |
| "Longest increasing subsequence" | Linear DP / Binary Search |

### How to Identify DP Problems

**Strong signals:**
1. "Find the **minimum/maximum** ..."
2. "**How many ways** to ..."
3. "**Is it possible** to ..." (boolean DP)
4. "Find the **longest/shortest** subsequence/substring ..."

**Red flags — NOT DP:**
- "Find all possible results" → likely Backtracking
- "Find shortest path in graph" → BFS/Dijkstra
- "Find connected components" → DFS/Union-Find

---

## 📊 Complexity Cheat Sheet

| Pattern | Time | Space | Space Optimized |
|---|---|---|---|
| Linear (1D) | O(n) | O(n) | O(1) rolling vars |
| 0/1 Knapsack | O(n * W) | O(n * W) | O(W) 1D array |
| Unbounded Knapsack | O(n * W) | O(W) | O(W) |
| String DP (2 strings) | O(m * n) | O(m * n) | O(min(m,n)) |
| Interval DP | O(n^3) | O(n^2) | Usually not optimizable |
| Grid DP | O(m * n) | O(m * n) | O(n) single row |
| Tree DP | O(n) | O(h) stack | — |
| Bitmask DP | O(2^n * n) | O(2^n * n) | — |
| State Machine | O(n * states) | O(states) | O(states) |
| Digit DP | O(d * S * 2 * 2) | O(d * S * 4) | — |

| Classic Problem | Time | Space |
|---|---|---|
| Fibonacci | O(n) | O(1) |
| Climbing Stairs | O(n) | O(1) |
| House Robber | O(n) | O(1) |
| Coin Change | O(n * amount) | O(amount) |
| LCS | O(m * n) | O(min(m,n)) |
| Edit Distance | O(m * n) | O(min(m,n)) |
| LIS | O(n log n) | O(n) |
| Unique Paths | O(m * n) | O(n) |

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Coin Change — Table Fill Walkthrough

**Problem:** Given coins = [1, 3, 4] and amount = 6, find minimum coins needed.

\`\`\`
dp[i] = minimum coins to make amount i

dp:  [0, INF, INF, INF, INF, INF, INF]
     amount: 0   1    2    3    4    5    6

Process coin=1:
  dp[1] = min(INF, dp[0]+1) = 1
  dp[2] = min(INF, dp[1]+1) = 2
  dp[3] = min(INF, dp[2]+1) = 3
  dp[4] = min(INF, dp[3]+1) = 4
  dp[5] = min(INF, dp[4]+1) = 5
  dp[6] = min(INF, dp[5]+1) = 6
  dp: [0, 1, 2, 3, 4, 5, 6]

Process coin=3:
  dp[3] = min(3, dp[0]+1) = 1  ✓ improved!
  dp[4] = min(4, dp[1]+1) = 2  ✓ improved!
  dp[5] = min(5, dp[2]+1) = 3  ✓ improved!
  dp[6] = min(6, dp[3]+1) = 2  ✓ improved!
  dp: [0, 1, 2, 1, 2, 3, 2]

Process coin=4:
  dp[4] = min(2, dp[0]+1) = 1  ✓ improved!
  dp[5] = min(3, dp[1]+1) = 2  ✓ improved!
  dp[6] = min(2, dp[2]+1) = 2  (no improvement)
  dp: [0, 1, 2, 1, 1, 2, 2]

Answer: dp[6] = 2 (coins: 3+3 or 4+2? No: 3+3=6 ✓ using two 3s)
Wait: actually it's using coin 4 + coin... hmm.
Let me verify: dp[6]=2. With coins [1,3,4]:
  3+3 = 6 (2 coins) ✓ or 4+1+1 = 6 (3 coins)
  So 2 coins is correct!
\`\`\`

\`\`\`java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // use amount+1 as "infinity"
    dp[0] = 0;

    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
\`\`\`

### Example 2: Edit Distance — Full Trace

**Problem:** Convert "intention" to "execution". Minimum operations?

\`\`\`
      ""  e  x  e  c  u  t  i  o  n
  ""   0  1  2  3  4  5  6  7  8  9
  i    1  1  2  3  4  5  6  6  7  8
  n    2  2  2  3  4  5  6  7  7  7
  t    3  3  3  3  4  5  5  6  7  8
  e    4  3  4  3  4  5  6  6  7  8
  n    5  4  4  4  4  5  6  7  7  7
  t    6  5  5  5  5  5  5  6  7  8
  i    7  6  6  6  6  6  6  5  6  7
  o    8  7  7  7  7  7  7  6  5  6
  n    9  8  8  8  8  8  8  7  6  5

Answer: 5

Trace back the operations:
  intention → execution
  1. Replace i→e: "entention"
  2. Replace n→x: "extention"
  3. Replace t→c: "excention"  ... actually let me just note it's 5 operations.
\`\`\`

### Example 3: Longest Increasing Subsequence (LIS)

**O(n^2) approach — Visual:**
\`\`\`
nums = [10, 9, 2, 5, 3, 7, 101, 18]
dp[i] = length of LIS ending at index i

i=0: dp[0]=1  [10]
i=1: dp[1]=1  [9]  (9 < 10, no extension)
i=2: dp[2]=1  [2]
i=3: dp[3]=2  [2,5]  (5 > 2)
i=4: dp[4]=2  [2,3]  (3 > 2)
i=5: dp[5]=3  [2,5,7] or [2,3,7]
i=6: dp[6]=4  [2,5,7,101] or [2,3,7,101]
i=7: dp[7]=4  [2,5,7,18] or [2,3,7,18]

Answer: max(dp) = 4
\`\`\`

**O(n log n) approach — Patience Sorting Visual:**
\`\`\`
Maintain array tails[] where tails[i] = smallest tail of all
increasing subsequences of length i+1.

nums = [10, 9, 2, 5, 3, 7, 101, 18]

Process 10:  tails = [10]              (start new pile)
Process 9:   tails = [9]               (replace 10, since 9 < 10)
Process 2:   tails = [2]               (replace 9, since 2 < 9)
Process 5:   tails = [2, 5]            (extend: 5 > 2)
Process 3:   tails = [2, 3]            (replace 5 with 3, keeps options open)
Process 7:   tails = [2, 3, 7]         (extend: 7 > 3)
Process 101: tails = [2, 3, 7, 101]    (extend: 101 > 7)
Process 18:  tails = [2, 3, 7, 18]     (replace 101 with 18)

Answer: tails.length = 4

Key: use binary search to find where to place each element!
\`\`\`

\`\`\`java
// O(n log n) LIS
public int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int num : nums) {
        int pos = Collections.binarySearch(tails, num);
        if (pos < 0) pos = -(pos + 1);
        if (pos == tails.size()) {
            tails.add(num);
        } else {
            tails.set(pos, num);
        }
    }
    return tails.size();
}
\`\`\`

### Example 4: Word Break

**Problem:** Can "leetcode" be segmented into ["leet","code"]?

\`\`\`
s = "leetcode", dict = {"leet", "code"}

dp[i] = true if s[0..i-1] can be segmented

dp[0] = true (empty string)
dp[1]: check s[0..0]="l" → not in dict → false
dp[2]: "le" → false
dp[3]: "lee" → false
dp[4]: check all splits:
  dp[0] && s[0..3]="leet" in dict? → true && true → TRUE!
dp[5]: dp[1]&&"eetc"? No. dp[2]&&"etc"? No. etc. → false
dp[6]: false
dp[7]: false
dp[8]: check all splits:
  dp[4] && s[4..7]="code" in dict? → true && true → TRUE!

Answer: dp[8] = true ✓
\`\`\`

\`\`\`java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    boolean[] dp = new boolean[s.length() + 1];
    dp[0] = true;

    for (int i = 1; i <= s.length(); i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    return dp[s.length()];
}
\`\`\`

---

## ⚠️ Common Mistakes

1. **Wrong base case:** Always define \`dp[0]\` or \`dp[0][0]\` carefully. Many bugs come from incorrect initialization.
\`\`\`java
// Coin Change: dp[0] = 0 (zero coins for amount 0)
// Knapsack:    dp[0][w] = 0 for all w (no items)
// Edit Dist:   dp[i][0] = i, dp[0][j] = j
\`\`\`

2. **Wrong iteration order:** Bottom-up must fill dependencies first.
\`\`\`java
// 0/1 Knapsack: iterate capacity BACKWARDS (right to left)
// Unbounded Knapsack: iterate capacity FORWARDS (left to right)
// String DP: fill row by row, left to right
\`\`\`

3. **Off-by-one in string DP:** DP table is usually \`(m+1) x (n+1)\` with empty string base cases at index 0.

4. **Not considering negative values:** Affects subset sum and partition problems. Cannot use the "optimization" of skipping negative targets.

5. **Stack overflow in top-down:** For large inputs (\`n > 10000\`), convert to bottom-up. Or increase stack size with \`-Xss\`.

6. **Forgetting space optimization:** Many 2D DP problems only need the previous row. Interviewers expect you to mention this.

7. **Confusing subsequence vs substring:** Subsequence allows gaps; substring must be contiguous. This changes the recurrence relation.

8. **Wrong state definition:** The state must capture ALL information needed for the recurrence. If you find yourself unable to write the recurrence, your state definition is incomplete.

---

## 💡 Java-Specific Tips

### Common Initialization Patterns

\`\`\`java
// Fill array with "infinity"
int[] dp = new int[n];
Arrays.fill(dp, Integer.MAX_VALUE);
dp[0] = 0;

// Fill 2D array
int[][] dp = new int[m][n];
for (int[] row : dp) Arrays.fill(row, -1); // for memoization

// Boolean DP
boolean[] dp = new boolean[n + 1];
dp[0] = true;
\`\`\`

### Memoization with HashMap (for complex states)

\`\`\`java
// When state is complex (e.g., string + index + flag)
Map<String, Integer> memo = new HashMap<>();

private int solve(int i, int j, boolean flag) {
    String key = i + "," + j + "," + flag;
    if (memo.containsKey(key)) return memo.get(key);
    // ... compute result
    memo.put(key, result);
    return result;
}
\`\`\`

### Using Arrays vs Collections

\`\`\`java
// For known small dimensions — use arrays (faster)
int[] dp = new int[amount + 1];

// For variable-size sequences — use ArrayList
List<Integer> tails = new ArrayList<>();

// For memoization — use int array with sentinel
int[][] memo = new int[m][n];
for (int[] row : memo) Arrays.fill(row, -1);
\`\`\`

### Common Tricks

- **Coin Change sentinel:** Use \`amount + 1\` instead of \`Integer.MAX_VALUE\` to avoid overflow when adding 1.
- **Modular arithmetic:** When the answer requires \`% 1000000007\`, apply mod at every addition.
- **Reconstruct path:** Store choices alongside DP values, trace back from the answer.

\`\`\`java
// Modular DP example
int MOD = 1_000_000_007;
dp[i] = ((long)dp[i - 1] + dp[i - 2]) % MOD;
\`\`\`

---

## 🔗 Comparison Tables

### DP Pattern Selection Guide

| If the problem says... | Use this pattern | Key characteristic |
|---|---|---|
| "Maximum amount from linear array" | Linear DP | \`dp[i]\` depends on \`dp[i-1]\`, \`dp[i-2]\` |
| "Fill a capacity with items" | Knapsack | 2D: items x capacity |
| "Transform string A to B" | String DP | 2D: lengths of both strings |
| "Optimal split of a sequence" | Interval DP | 3 nested loops, O(n^3) |
| "Best path through a grid" | Grid DP | 2D: rows x cols |
| "Optimize on a tree structure" | Tree DP | Post-order DFS |
| "Visit all exactly once (n < 20)" | Bitmask DP | State = bitmask |
| "Buy/sell with rules" | State Machine DP | States for each condition |
| "Count numbers up to N with property" | Digit DP | Digit-by-digit construction |

### Top-Down vs Bottom-Up Decision Guide

| Scenario | Recommended | Why |
|---|---|---|
| Many states, few reachable | Top-Down | Only computes needed states |
| Need space optimization | Bottom-Up | Easier rolling array |
| Complex recurrence | Top-Down | More natural recursive thinking |
| Simple 1D or 2D DP | Bottom-Up | Faster, no recursion overhead |
| Interview (general) | Start Top-Down | Easier to get right, optimize later |
| Large input (n > 10K) | Bottom-Up | Avoid stack overflow |

### Classic DP Problems Reference

| Problem | Pattern | Time | Key Insight |
|---|---|---|---|
| Climbing Stairs | Linear | O(n) | dp[i] = dp[i-1] + dp[i-2] |
| House Robber | Linear | O(n) | Rob or skip current house |
| Coin Change | Knapsack | O(n*amount) | Unbounded, minimize coins |
| Partition Equal Subset | Knapsack | O(n*sum) | 0/1, target = sum/2 |
| Edit Distance | String | O(m*n) | Insert, delete, or replace |
| LCS | String | O(m*n) | Match or skip |
| LIS | Linear+BS | O(n log n) | Patience sorting |
| Unique Paths | Grid | O(m*n) | Sum from top and left |
| Word Break | Linear | O(n^2) | Check all split points |
| Decode Ways | Linear | O(n) | 1-digit or 2-digit decode |
| Maximum Subarray | Linear | O(n) | Kadane's algorithm |
| Palindrome Substrings | Interval | O(n^2) | Expand from center |
| Stock Buy/Sell | State Machine | O(n) | State per condition |
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
- [Visual Deep Dive](#visual-deep-dive)
- [Key Algorithms & Techniques](#key-algorithms--techniques)
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Interview Deep Dive: Worked Examples](#interview-deep-dive-worked-examples)
- [Common Mistakes](#common-mistakes)
- [Java-Specific Tips](#java-specific-tips)
- [Comparison Tables](#comparison-tables)

---

## 📌 Core Concepts

Two Pointers and Sliding Window are **O(n)** techniques that replace brute-force **O(n^2)** or **O(n^3)** approaches by maintaining a window or pointer pair that intelligently moves through the data.

### Two Pointers — Core Idea

Maintain two pointers that move through the data based on conditions. Three main variants:

1. **Opposite Direction:** Start from both ends, converge toward the middle.
2. **Same Direction (Slow/Fast):** Both start at the beginning, move at different speeds.
3. **Three Pointers:** Extension for problems requiring three elements.

### Sliding Window — Core Idea

Maintain a **window** (contiguous subarray/substring) and slide it through the data. Three main variants:

1. **Fixed-size window:** Window size is constant, slide one element at a time.
2. **Variable window (shrinkable):** Expand right, shrink left when condition violated.
3. **Variable window (non-shrinkable):** Window only grows or stays same size, never shrinks.

### Key Insight: Why These Are O(n)

\`\`\`
Brute force (all subarrays): O(n^2)
  for i in 0..n:
    for j in i..n:       ← O(n^2) pairs
      check subarray(i,j)

Two Pointers / Sliding Window: O(n)
  Each pointer moves at most n times total.
  Left pointer: moves right 0 to n times
  Right pointer: moves right 0 to n times
  Total work: O(n) + O(n) = O(n)
\`\`\`

---

## 🔍 Visual Deep Dive

### Two Pointers: Opposite Direction

**Sorted Two Sum — Find two numbers that sum to target:**
\`\`\`
nums = [2, 7, 11, 15], target = 9

  left=0  right=3
  [2, 7, 11, 15]
   ↑           ↑
   L           R     sum = 2+15 = 17 > 9 → move R left

  [2, 7, 11, 15]
   ↑       ↑
   L       R         sum = 2+11 = 13 > 9 → move R left

  [2, 7, 11, 15]
   ↑   ↑
   L   R             sum = 2+7 = 9 = target → FOUND! [0,1]

Why this works: array is sorted.
  If sum > target: need smaller sum → move right pointer left
  If sum < target: need larger sum → move left pointer right
\`\`\`

**Container With Most Water:**
\`\`\`
height = [1, 8, 6, 2, 5, 4, 8, 3, 7]

  L=0                          R=8
  [1, 8, 6, 2, 5, 4, 8, 3, 7]
   ↑                          ↑
   area = min(1,7) * (8-0) = 1 * 8 = 8
   height[L]=1 < height[R]=7 → move L right

  L=1                       R=8
  [1, 8, 6, 2, 5, 4, 8, 3, 7]
      ↑                     ↑
   area = min(8,7) * (8-1) = 7 * 7 = 49  ← max so far!
   height[L]=8 > height[R]=7 → move R left

  L=1                    R=7
  [1, 8, 6, 2, 5, 4, 8, 3, 7]
      ↑                 ↑
   area = min(8,3) * (7-1) = 3 * 6 = 18
   height[R]=3 < height[L]=8 → move R left

  ... continue until L >= R

  Answer: 49

Key insight: always move the pointer at the shorter line,
because moving the taller one can only decrease the area.
\`\`\`

### Two Pointers: Same Direction (Slow/Fast)

**Remove Duplicates from Sorted Array (in-place):**
\`\`\`
nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]

slow=0, fast=0

  fast=0: nums[0]=0 == nums[0]=0 → skip (same as slow)
          Actually: start slow=0, fast=1

  fast=1: nums[1]=0 == nums[slow=0]=0 → skip
  fast=2: nums[2]=1 != nums[slow=0]=0 → slow++, nums[slow]=nums[fast]
          slow=1, nums = [0, 1, 1, 1, 1, 2, 2, 3, 3, 4]
  fast=3: nums[3]=1 == nums[slow=1]=1 → skip
  fast=4: nums[4]=1 == nums[slow=1]=1 → skip
  fast=5: nums[5]=2 != nums[slow=1]=1 → slow++, copy
          slow=2, nums = [0, 1, 2, 1, 1, 2, 2, 3, 3, 4]
  fast=6: skip (2==2)
  fast=7: nums[7]=3 != nums[slow=2]=2 → slow++, copy
          slow=3, nums = [0, 1, 2, 3, 1, 2, 2, 3, 3, 4]
  fast=8: skip (3==3)
  fast=9: nums[9]=4 != nums[slow=3]=3 → slow++, copy
          slow=4, nums = [0, 1, 2, 3, 4, 2, 2, 3, 3, 4]

  Answer: slow+1 = 5 unique elements [0, 1, 2, 3, 4, ...]
\`\`\`

### Two Pointers: Three Pointers (3Sum)

\`\`\`
nums = [-1, 0, 1, 2, -1, -4], target = 0
Sort: [-4, -1, -1, 0, 1, 2]

Fix i=0 (nums[i]=-4), find two-sum = 4 in remaining:
  L=1, R=5: -1+2 = 1 < 4 → L++
  L=2, R=5: -1+2 = 1 < 4 → L++
  L=3, R=5: 0+2 = 2 < 4 → L++
  L=4, R=5: 1+2 = 3 < 4 → L++ → L > R, done

Fix i=1 (nums[i]=-1), find two-sum = 1:
  L=2, R=5: -1+2 = 1 == 1 → FOUND! [-1,-1,2]
    L++, R-- → L=3, R=4
  L=3, R=4: 0+1 = 1 == 1 → FOUND! [-1,0,1]
    L++, R-- → L=4, R=3 → done

Fix i=2 (nums[i]=-1), SKIP! Same as nums[i-1]=-1

Answer: [[-1,-1,2], [-1,0,1]]

Key: Sort first. Fix one element, two-sum the rest.
     Skip duplicate values for i, L, and R.
\`\`\`

### Sliding Window: Fixed Size

**Maximum Sum of Subarray of Size K:**
\`\`\`
nums = [2, 1, 5, 1, 3, 2], k = 3

Initialize window [0..2]: sum = 2+1+5 = 8
  [2, 1, 5, 1, 3, 2]
   └──────┘
   window sum = 8, maxSum = 8

Slide right: remove nums[0], add nums[3]
  [2, 1, 5, 1, 3, 2]
      └──────┘
   sum = 8 - 2 + 1 = 7, maxSum = 8

Slide right: remove nums[1], add nums[4]
  [2, 1, 5, 1, 3, 2]
         └──────┘
   sum = 7 - 1 + 3 = 9, maxSum = 9  ✓

Slide right: remove nums[2], add nums[5]
  [2, 1, 5, 1, 3, 2]
            └──────┘
   sum = 9 - 5 + 2 = 6, maxSum = 9

Answer: 9

Key: Maintain running sum. Add new element, remove old.
     O(n) instead of O(n*k)!
\`\`\`

### Sliding Window: Variable (Shrinkable)

**Template — Finding Minimum/Longest Window:**
\`\`\`
General pattern for variable shrinkable window:

left = 0
for right in 0..n-1:
    ADD element at right to window state

    while (window is INVALID or oversized):
        REMOVE element at left from window state
        left++

    UPDATE answer with current window [left..right]

Visual:
  ──────────────────────────────────
  [                                ]  array
  ──────────────────────────────────
   L         R →                      expand right
   └─────────┘                        window

  If window condition violated:
   L →       R                        shrink from left
     └───────┘                        smaller window
\`\`\`

### Sliding Window: Variable (Non-Shrinkable)

**Key Difference:** The window size never decreases. If the current element makes the window invalid, we slide the whole window (move both L and R), maintaining the maximum valid window size seen so far.

\`\`\`
Non-shrinkable template:

left = 0
for right in 0..n-1:
    ADD element at right to window state

    if (window is INVALID):      // NOTE: 'if' not 'while'!
        REMOVE element at left
        left++

    UPDATE answer with (right - left + 1)

This ensures the window size only grows or stays the same.
Used when we want the MAXIMUM window size.

Visual comparison:

Shrinkable (while):          Non-shrinkable (if):
  L───────────R              L───────────R
  L may jump far right       L moves at most 1 step
  Window can shrink a lot    Window maintains max size
  Good for: minimum window   Good for: maximum window
\`\`\`

---

## ⚡ Key Algorithms & Techniques

### Template 1: Opposite Direction Two Pointers

\`\`\`java
// Template: opposite direction pointers on sorted array
public int[] twoSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;   // need larger sum
        } else {
            right--;  // need smaller sum
        }
    }
    return new int[]{-1, -1}; // not found
}
\`\`\`

### Template 2: Same Direction Two Pointers

\`\`\`java
// Template: slow/fast pointer for in-place modification
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

### Template 3: Three Pointers (3Sum)

\`\`\`java
public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> result = new ArrayList<>();

    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue; // skip duplicates

        int left = i + 1, right = nums.length - 1;
        int target = -nums[i];

        while (left < right) {
            int sum = nums[left] + nums[right];
            if (sum == target) {
                result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}
\`\`\`

### Template 4: Fixed-Size Sliding Window

\`\`\`java
// Template: fixed window of size k
public int maxSumSubarray(int[] nums, int k) {
    int windowSum = 0, maxSum = Integer.MIN_VALUE;

    for (int i = 0; i < nums.length; i++) {
        windowSum += nums[i]; // add new element

        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
            windowSum -= nums[i - k + 1]; // remove oldest element
        }
    }
    return maxSum;
}
\`\`\`

### Template 5: Variable Window (Shrinkable) — Minimum Window

\`\`\`java
// Template: find MINIMUM window satisfying condition
// Use "while" to shrink as much as possible
public int minWindowSize(int[] nums, int condition) {
    int left = 0, minLen = Integer.MAX_VALUE;
    // window state variables here

    for (int right = 0; right < nums.length; right++) {
        // EXPAND: add nums[right] to window state

        while (/* window satisfies condition */) {
            minLen = Math.min(minLen, right - left + 1);
            // SHRINK: remove nums[left] from window state
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? 0 : minLen;
}
\`\`\`

### Template 6: Variable Window (Shrinkable) — Maximum Window

\`\`\`java
// Template: find MAXIMUM window satisfying condition
// Use "while" to shrink until valid again
public int maxWindowSize(int[] nums, int condition) {
    int left = 0, maxLen = 0;
    // window state variables here

    for (int right = 0; right < nums.length; right++) {
        // EXPAND: add nums[right] to window state

        while (/* window violates condition */) {
            // SHRINK: remove nums[left] from window state
            left++;
        }

        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Template 7: Variable Window (Non-Shrinkable) — Maximum Window

\`\`\`java
// Template: non-shrinkable window for maximum length
// Window only grows or slides (never shrinks)
public int maxWindowNonShrink(int[] nums, int condition) {
    int left = 0;
    // window state variables here

    for (int right = 0; right < nums.length; right++) {
        // EXPAND: add nums[right] to window state

        if (/* window violates condition */) {  // NOTE: 'if' not 'while'
            // SHRINK: remove nums[left] from window state
            left++;
        }
    }
    return nums.length - left; // window size at the end
}
\`\`\`

### HashMap + Window Combo: Character Frequency Tracking

\`\`\`
Pattern: Track character frequencies in the window using a map.

Example: "ADOBECODEBANC" with target "ABC"

Window state: HashMap<Character, Integer> windowCount
Target state: HashMap<Character, Integer> targetCount = {A:1, B:1, C:1}

Track "have" = number of characters meeting target frequency
Track "need" = number of unique chars in target = 3

Visual:
  A D O B E C O D E B A N C
  L       R
  window: {A:1,D:1,O:1,B:1} have=2(A,B) need=3
  
  A D O B E C O D E B A N C
  L           R
  window: {A:1,D:1,O:1,B:1,E:1,C:1} have=3 need=3 → VALID!
  Now shrink from left to minimize.
\`\`\`

---

## 🎯 Pattern Recognition

| Problem Signal | Technique | Template |
|---|---|---|
| Sorted array, find pair with sum | Opposite 2-pointer | Template 1 |
| Remove duplicates in-place | Same direction | Template 2 |
| Find triplets/quadruplets | Three+ pointers | Template 3 |
| Maximum/average of all size-k subarrays | Fixed window | Template 4 |
| "Minimum window/subarray containing..." | Variable shrinkable | Template 5 |
| "Longest substring/subarray with at most..." | Variable shrinkable | Template 6 |
| "Maximum length with constraint" (optimization) | Non-shrinkable | Template 7 |
| "Substring with all characters of..." | HashMap + window | Template 5 + HashMap |
| "Permutation/anagram in string" | Fixed window + HashMap | Template 4 + HashMap |
| "Longest with at most K distinct" | Variable + HashMap | Template 6 + HashMap |

### Quick Decision Guide

\`\`\`
Is the array SORTED?
  ├─ YES: Use Two Pointers (opposite direction)
  │       → Two Sum, Container With Most Water
  └─ NO: Is it about a CONTIGUOUS subarray/substring?
         ├─ YES: Use Sliding Window
         │       Fixed size known? → Fixed Window
         │       Find minimum? → Shrinkable (while)
         │       Find maximum? → Shrinkable or Non-shrinkable
         └─ NO: Probably not a window/pointer problem
\`\`\`

---

## 📊 Complexity Cheat Sheet

| Technique | Time | Space | When to Use |
|---|---|---|---|
| Opposite Two Pointers | O(n) | O(1) | Sorted array, pair search |
| Same Direction | O(n) | O(1) | In-place array modification |
| Three Pointers (3Sum) | O(n^2) | O(1) | Triplet search |
| Fixed Sliding Window | O(n) | O(1) or O(k) | Size-k subarray problems |
| Variable Window + Set | O(n) | O(k) | Distinct elements |
| Variable Window + HashMap | O(n) | O(k) | Frequency tracking |
| Variable Window + Deque | O(n) | O(k) | Sliding max/min |

| Problem | Time | Space | Technique |
|---|---|---|---|
| Two Sum (sorted) | O(n) | O(1) | Opposite pointers |
| Container With Most Water | O(n) | O(1) | Opposite pointers |
| 3Sum | O(n^2) | O(1) | Sort + three pointers |
| Remove Duplicates | O(n) | O(1) | Same direction |
| Max Sum Subarray Size K | O(n) | O(1) | Fixed window |
| Longest Substring No Repeat | O(n) | O(min(n,26)) | Variable + HashSet |
| Minimum Window Substring | O(n) | O(k) | Variable + HashMap |
| Permutation in String | O(n) | O(26) | Fixed + freq array |
| Longest with K Distinct | O(n) | O(k) | Variable + HashMap |
| Sliding Window Maximum | O(n) | O(k) | Monotonic deque |

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Longest Substring Without Repeating Characters

**Problem:** Find the length of the longest substring without repeating characters.

\`\`\`
s = "abcabcbb"

Using HashSet to track characters in window:

  Step 1: right=0, char='a'
    set = {a}, window = "a", maxLen = 1
    [a] b c a b c b b
     L
     R

  Step 2: right=1, char='b'
    set = {a,b}, window = "ab", maxLen = 2
    [a b] c a b c b b
     L R

  Step 3: right=2, char='c'
    set = {a,b,c}, window = "abc", maxLen = 3
    [a b c] a b c b b
     L   R

  Step 4: right=3, char='a' ← DUPLICATE!
    'a' in set → shrink from left:
      remove 'a' from set, left++
    set = {b,c}, add 'a'
    set = {b,c,a}, window = "bca", maxLen = 3
     a [b c a] b c b b
        L   R

  Step 5: right=4, char='b' ← DUPLICATE!
    'b' in set → shrink from left:
      remove 'b', left++
    set = {c,a}, add 'b'
    set = {c,a,b}, window = "cab", maxLen = 3
     a  b [c a b] c b b
           L   R

  Step 6: right=5, char='c' ← DUPLICATE!
    'c' in set → shrink:
      remove 'c', left++
    set = {a,b}, add 'c'
    set = {a,b,c}, window = "abc", maxLen = 3
     a  b  c [a b c] b b
              L   R

  Step 7: right=6, char='b' ← DUPLICATE!
    shrink until 'b' removed:
      remove 'a', left++ → set = {b,c}
      remove 'b', left++ → set = {c}
    add 'b', set = {c,b}, window = "cb", maxLen = 3
     a  b  c  a  b [c b] b
                    L  R

  Step 8: right=7, char='b' ← DUPLICATE!
    shrink: remove 'c', left++ → set = {b}
    'b' still in set! remove 'b', left++ → set = {}
    add 'b', set = {b}, window = "b", maxLen = 3
     a  b  c  a  b  c  b [b]
                          LR

  Answer: maxLen = 3 ("abc")
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

// Optimized: use HashMap to jump left pointer directly
public int lengthOfLongestSubstringOpt(String s) {
    Map<Character, Integer> lastSeen = new HashMap<>();
    int left = 0, maxLen = 0;

    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen.containsKey(c) && lastSeen.get(c) >= left) {
            left = lastSeen.get(c) + 1; // jump past the duplicate
        }
        lastSeen.put(c, right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}
\`\`\`

### Example 2: Minimum Window Substring

**Problem:** Find the minimum window in \`s\` that contains all characters of \`t\`.

\`\`\`
s = "ADOBECODEBANC", t = "ABC"
Need: A:1, B:1, C:1 (3 unique chars)

  Step-by-step with frequency matching:

  Expand right, tracking have/need:

  R=0 'A': windowFreq={A:1} have=1 need=3
  R=1 'D': windowFreq={A:1,D:1} have=1
  R=2 'O': have=1
  R=3 'B': windowFreq={..,B:1} have=2
  R=4 'E': have=2
  R=5 'C': windowFreq={..,C:1} have=3 ← ALL MATCHED!
    Window: "ADOBEC" len=6
    [A D O B E C] O D E B A N C
     L           R
    Shrink left:
      Remove A: have=2 → stop shrinking
    minWindow = "ADOBEC" (len=6), L=1

  R=6 'O': have=2
  R=7 'D': have=2
  R=8 'E': have=2
  R=9 'B': windowFreq={..,B:1} have=2 (already had B from shrink)
    Actually let me reconsider with exact freq tracking...

  Let me use the correct tracking:
  targetFreq = {A:1, B:1, C:1}, need = 3, have = 0

  R=0 'A': winFreq[A]=1 >= target[A]=1 → have=1
  R=1 'D': not in target
  R=2 'O': not in target
  R=3 'B': winFreq[B]=1 >= target[B]=1 → have=2
  R=4 'E': not in target
  R=5 'C': winFreq[C]=1 >= target[C]=1 → have=3 = need!
    Window "ADOBEC" [0,5] len=6 → result="ADOBEC"
    Shrink: L=0 'A': winFreq[A]=0 < target → have=2, L=1
  R=6 'O': not in target
  R=7 'D': not in target
  R=8 'E': not in target
  R=9 'B': winFreq[B]=2, have still 2
  R=10 'A': winFreq[A]=1 >= target → have=3!
    Window "DOBECODEBA NC"[1,10] len=10 → no improvement
    Shrink: L=1 'D', L=2 'O', L=3 'B': winFreq[B]=1 >= 1 → have=3
    Window [3,10] len=8 → no improvement
    Continue shrink: L=3 is still... wait.
    Let me re-trace more carefully.
    
    After have=3 at R=10:
    Shrink while have==3:
      L=1 'D': not target char, L=2
      L=2 'O': not target, L=3
      L=3 'B': winFreq[B]-- = 1, still >= 1 → have=3, L=4
      L=4 'E': not target, L=5
      L=5 'C': winFreq[C]-- = 0, < 1 → have=2, L=6
    Window just before losing validity: [5,10] len=6 "CODEBA"
    Hmm not shorter. Result still "ADOBEC".

  R=11 'N': not in target
  R=12 'C': winFreq[C]=1 >= 1 → have=3!
    Window [6,12] len=7 "ODEBANC"
    Shrink while have==3:
      L=6 'O': L=7
      L=7 'D': L=8
      L=8 'E': L=9
      L=9 'B': winFreq[B]--=0 < 1 → have=2, L=10
    Window [9,12]="BANC" len=4 ← NEW MIN!
    Wait: before have dropped, window was [9,12].
    Result = "BANC" len=4

  Answer: "BANC" ✓
\`\`\`

\`\`\`java
public String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";

    Map<Character, Integer> targetFreq = new HashMap<>();
    for (char c : t.toCharArray()) {
        targetFreq.merge(c, 1, Integer::sum);
    }

    Map<Character, Integer> windowFreq = new HashMap<>();
    int have = 0, need = targetFreq.size();
    int left = 0, minLen = Integer.MAX_VALUE, minStart = 0;

    for (int right = 0; right < s.length(); right++) {
        char rc = s.charAt(right);
        windowFreq.merge(rc, 1, Integer::sum);

        if (targetFreq.containsKey(rc) &&
            windowFreq.get(rc).intValue() == targetFreq.get(rc).intValue()) {
            have++;
        }

        while (have == need) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            char lc = s.charAt(left);
            windowFreq.merge(lc, -1, Integer::sum);
            if (targetFreq.containsKey(lc) &&
                windowFreq.get(lc) < targetFreq.get(lc)) {
                have--;
            }
            left++;
        }
    }
    return minLen == Integer.MAX_VALUE ? ""
         : s.substring(minStart, minStart + minLen);
}
\`\`\`

### Example 3: Permutation in String

**Problem:** Check if \`s2\` contains a permutation of \`s1\`.

\`\`\`
s1 = "ab", s2 = "eidbaooo"
s1 freq: {a:1, b:1}

Fixed window of size 2 sliding through s2:

  "ei" → freq={e:1,i:1} → no match
  "id" → freq={i:1,d:1} → no match
  "db" → freq={d:1,b:1} → no match
  "ba" → freq={b:1,a:1} → MATCH! ✓

Answer: true

Efficient approach: use int[26] frequency array.
Compare window freq with target freq at each step.
\`\`\`

\`\`\`java
public boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;

    int[] s1Freq = new int[26];
    int[] windowFreq = new int[26];

    for (char c : s1.toCharArray()) s1Freq[c - 'a']++;

    int k = s1.length();
    for (int i = 0; i < s2.length(); i++) {
        windowFreq[s2.charAt(i) - 'a']++;

        if (i >= k) {
            windowFreq[s2.charAt(i - k) - 'a']--;
        }

        if (i >= k - 1 && Arrays.equals(s1Freq, windowFreq)) {
            return true;
        }
    }
    return false;
}

// Optimized: track matches count instead of comparing arrays
public boolean checkInclusionOpt(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    int[] freq = new int[26];
    for (char c : s1.toCharArray()) freq[c - 'a']++;

    int k = s1.length(), matches = 0;
    // Count how many of 26 chars already match (both 0)
    for (int i = 0; i < 26; i++) {
        if (freq[i] == 0) matches++;
    }

    for (int i = 0; i < s2.length(); i++) {
        int idx = s2.charAt(i) - 'a';
        freq[idx]--;
        if (freq[idx] == 0) matches++;
        else if (freq[idx] == -1) matches--;

        if (i >= k) {
            idx = s2.charAt(i - k) - 'a';
            freq[idx]++;
            if (freq[idx] == 0) matches++;
            else if (freq[idx] == 1) matches--;
        }

        if (matches == 26) return true;
    }
    return false;
}
\`\`\`

### Example 4: Longest Repeating Character Replacement

**Problem:** Given string \`s\` and int \`k\`, find the longest substring where you can replace at most \`k\` characters to make all characters the same.

\`\`\`
s = "AABABBA", k = 1

Non-shrinkable window approach:
  Track maxFreq = frequency of most common char in window

  Window valid when: (windowLen - maxFreq) <= k
  (i.e., chars to replace <= k)

  R=0 'A': freq={A:1}, maxFreq=1, len=1, replace=0 ≤ 1 ✓
  R=1 'A': freq={A:2}, maxFreq=2, len=2, replace=0 ≤ 1 ✓
  R=2 'B': freq={A:2,B:1}, maxFreq=2, len=3, replace=1 ≤ 1 ✓
  R=3 'A': freq={A:3,B:1}, maxFreq=3, len=4, replace=1 ≤ 1 ✓
  R=4 'B': freq={A:3,B:2}, maxFreq=3, len=5, replace=2 > 1 ✗
    Slide: remove s[L=0]='A', freq={A:2,B:2}, L=1
    len still=4 (non-shrinkable: window maintains max size)
  R=5 'B': freq={A:2,B:3}, maxFreq=3, len=5, replace=2 > 1 ✗
    Slide: remove s[L=1]='A', freq={A:1,B:3}, L=2
  R=6 'A': freq={A:2,B:3}, maxFreq=3, len=5, replace=2 > 1 ✗
    Slide: remove s[L=2]='B', freq={A:2,B:2}, L=3

  Answer: max window size = 4 (e.g., "AABA" → replace B with A)
\`\`\`

\`\`\`java
public int characterReplacement(String s, int k) {
    int[] freq = new int[26];
    int left = 0, maxFreq = 0;

    for (int right = 0; right < s.length(); right++) {
        freq[s.charAt(right) - 'A']++;
        maxFreq = Math.max(maxFreq, freq[s.charAt(right) - 'A']);

        // Non-shrinkable: use 'if' instead of 'while'
        if ((right - left + 1) - maxFreq > k) {
            freq[s.charAt(left) - 'A']--;
            left++;
        }
    }
    return s.length() - left;
}
\`\`\`

---

## ⚠️ Common Mistakes

1. **Off-by-one in window boundaries:** The window \`[left, right]\` is inclusive. Length = \`right - left + 1\`.

2. **Forgetting to update window state when shrinking:** Always remove \`nums[left]\` or update frequency before incrementing \`left\`.

3. **Using \`if\` when \`while\` is needed (or vice versa):**
\`\`\`java
// For MINIMUM window: use while (shrink as much as possible)
while (windowIsValid) { updateMin; shrink; }

// For MAXIMUM window (non-shrinkable): use if (slide, don't shrink)
if (windowIsInvalid) { slide; }
\`\`\`

4. **HashMap overhead when array works:** For character frequency, \`int[128]\` or \`int[26]\` beats \`HashMap<Character, Integer>\`.

5. **Forgetting to skip duplicates in 3Sum:** After finding a valid triplet, skip identical values for both left and right pointers.

6. **Wrong shrink condition:**
\`\`\`java
// For "minimum length subarray with sum >= target":
while (windowSum >= target) { ... } // shrink WHILE valid

// For "longest subarray with sum <= target":
while (windowSum > target) { ... } // shrink WHILE invalid
\`\`\`

7. **Not handling empty input or window larger than array:** Always check edge cases first.

8. **Confusing HashMap.get() autoboxing:** In Java, comparing Integer objects with \`==\` fails for values > 127. Use \`.intValue()\` or \`.equals()\`.

---

## 💡 Java-Specific Tips

### Frequency Array vs HashMap

\`\`\`java
// For lowercase letters only — fastest
int[] freq = new int[26];
freq[c - 'a']++;

// For all ASCII characters
int[] freq = new int[128];
freq[c]++;

// For Unicode or sparse character sets
Map<Character, Integer> freq = new HashMap<>();
freq.merge(c, 1, Integer::sum);
\`\`\`

### String Operations

\`\`\`java
// charAt is O(1) for String — no need to convert to char[]
char c = s.charAt(i);

// substring is O(n) in modern Java — creates new String
String sub = s.substring(left, right + 1);

// For heavy string manipulation, use char[]
char[] chars = s.toCharArray();
\`\`\`

### Useful Java Methods

\`\`\`java
// HashMap merge — clean frequency counting
map.merge(key, 1, Integer::sum);       // increment
map.merge(key, -1, Integer::sum);      // decrement

// HashMap getOrDefault
map.getOrDefault(key, 0);

// Arrays comparison for fixed window
Arrays.equals(freq1, freq2);  // compare two frequency arrays

// Collections for 3Sum result
Arrays.asList(nums[i], nums[left], nums[right]);
\`\`\`

### Performance Tips

\`\`\`java
// Pre-compute character array for tight loops
char[] chars = s.toCharArray();
for (int i = 0; i < chars.length; i++) {
    // chars[i] is faster than s.charAt(i) in hot loops
}

// Use int variables instead of Integer for window state
int windowSum = 0;  // not Integer windowSum
int maxFreq = 0;    // not Integer maxFreq
\`\`\`

---

## 🔗 Comparison Tables

### Two Pointers vs Sliding Window

| Aspect | Two Pointers | Sliding Window |
|---|---|---|
| Typical input | Sorted array | Array or string |
| Pointers move | Based on comparison | Right always moves right |
| Window meaning | Elements at pointer positions | Contiguous range [L,R] |
| Common use | Pair/triplet search | Subarray/substring |
| Requires sorted? | Often yes | Usually no |

### Shrinkable vs Non-Shrinkable Window

| Aspect | Shrinkable (while) | Non-Shrinkable (if) |
|---|---|---|
| Loop type | \`while\` (multi-step shrink) | \`if\` (single-step slide) |
| Window can | Grow and shrink freely | Only grow or stay same |
| Use for | Min window, exact match | Max window |
| Answer location | Update inside while loop | After loop: \`n - left\` |
| Example | Min Window Substring | Longest Repeating Char |

### Problem Classification Table

| Problem | Category | Key Data Structure | Time |
|---|---|---|---|
| Two Sum (sorted) | Opposite 2-ptr | None | O(n) |
| Container With Most Water | Opposite 2-ptr | None | O(n) |
| 3Sum | Three pointers | Sort first | O(n^2) |
| Trapping Rain Water | Opposite 2-ptr | Track maxLeft/maxRight | O(n) |
| Remove Duplicates | Same dir 2-ptr | None | O(n) |
| Move Zeroes | Same dir 2-ptr | None | O(n) |
| Max Sum Subarray K | Fixed window | Running sum | O(n) |
| Longest No Repeat | Variable + Set | HashSet/HashMap | O(n) |
| Min Window Substring | Variable + Map | 2 HashMaps | O(n) |
| Permutation in String | Fixed + freq | int[26] array | O(n) |
| Longest K Distinct | Variable + Map | HashMap | O(n) |
| Longest Repeating Char | Non-shrinkable | int[26] + maxFreq | O(n) |
| Sliding Window Max | Fixed + deque | Monotonic deque | O(n) |
| Subarray Product < K | Variable + math | Running product | O(n) |
| Fruit Into Baskets | Variable + Map | HashMap (k=2) | O(n) |

### Template Quick Reference

| Goal | Template | Shrink Style | Answer Update |
|---|---|---|---|
| Find minimum valid window | Variable shrinkable | \`while (valid)\` shrink | Inside while |
| Find maximum valid window | Variable shrinkable | \`while (invalid)\` shrink | After while |
| Find maximum valid window (opt) | Non-shrinkable | \`if (invalid)\` slide | At end |
| Check if permutation exists | Fixed window | N/A (fixed size) | Compare freqs |
| Sum/avg of all k-size windows | Fixed window | N/A (fixed size) | Each slide |
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
- [Sorting Deep Dive](#sorting-deep-dive)
- [Math & Number Theory](#math--number-theory)
- [Pattern Recognition](#pattern-recognition)
- [Complexity Cheat Sheet](#complexity-cheat-sheet)
- [Interview Deep Dive: Worked Examples](#interview-deep-dive-worked-examples)
- [Common Mistakes](#common-mistakes)
- [Java-Specific Tips](#java-specific-tips)
- [Comparison Tables](#comparison-tables)

---

## 📌 Core Concepts

This section covers the remaining critical topics that appear frequently in technical interviews. Each deserves its own deep dive, but together they form the foundation for handling the trickiest interview problems.

**What's covered:**
1. **Backtracking** — Generate all valid combinations, permutations, subsets
2. **Binary Search (Advanced)** — Boundary search, rotated arrays, search on answer
3. **Bit Manipulation** — XOR tricks, counting bits, power of two
4. **Sorting** — Java's sorting internals, when to use which sort
5. **Math & Number Theory** — GCD, primes, modular arithmetic

---

## 🔍 Backtracking

### Core Idea: Decision Tree

Backtracking is **controlled recursion** — explore all possibilities by making choices, and **undo** choices that lead to dead ends.

\`\`\`
Mental model: DECISION TREE

For generating subsets of [1, 2, 3]:
At each element, choose: INCLUDE or EXCLUDE

                        []
                    /         \\
               [1]              []
             /     \\          /    \\
          [1,2]    [1]      [2]     []
         /    \\   /   \\    /   \\   /  \\
     [1,2,3][1,2][1,3][1][2,3][2][3] []

All leaf nodes are valid subsets!
Subsets: [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
\`\`\`

### Backtracking Template

\`\`\`java
// General backtracking template
void backtrack(List<List<Integer>> result, List<Integer> current,
               int[] candidates, int start) {
    // 1. Goal: add current state to results
    result.add(new ArrayList<>(current)); // MUST copy!

    // 2. Choices: iterate over remaining options
    for (int i = start; i < candidates.length; i++) {
        // 3. Constraint: skip invalid choices (pruning)
        if (/* invalid condition */) continue;

        // 4. Make choice
        current.add(candidates[i]);

        // 5. Explore further
        backtrack(result, current, candidates, i + 1);

        // 6. UNDO choice (backtrack)
        current.remove(current.size() - 1);
    }
}
\`\`\`

### Subsets — Decision Tree Trace

\`\`\`
nums = [1, 2, 3]

backtrack([], start=0):
  Add [] to result
  
  i=0: choose 1 → current=[1]
    backtrack([1], start=1):
      Add [1] to result
      
      i=1: choose 2 → current=[1,2]
        backtrack([1,2], start=2):
          Add [1,2] to result
          
          i=2: choose 3 → current=[1,2,3]
            backtrack([1,2,3], start=3):
              Add [1,2,3] to result
              (no more elements)
            undo: current=[1,2]
          
        undo: current=[1]
      
      i=2: choose 3 → current=[1,3]
        backtrack([1,3], start=3):
          Add [1,3] to result
        undo: current=[1]
    
    undo: current=[]
  
  i=1: choose 2 → current=[2]
    backtrack([2], start=2):
      Add [2] to result
      
      i=2: choose 3 → current=[2,3]
        backtrack([2,3], start=3):
          Add [2,3] to result
        undo: current=[2]
    
    undo: current=[]
  
  i=2: choose 3 → current=[3]
    backtrack([3], start=3):
      Add [3] to result
    undo: current=[]

Result: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
\`\`\`

\`\`\`java
public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums, 0);
    return result;
}

private void backtrack(List<List<Integer>> result, List<Integer> current,
                       int[] nums, int start) {
    result.add(new ArrayList<>(current));
    for (int i = start; i < nums.length; i++) {
        current.add(nums[i]);
        backtrack(result, current, nums, i + 1);
        current.remove(current.size() - 1);
    }
}
\`\`\`

### Permutations

\`\`\`
nums = [1, 2, 3]

Decision tree (at each level, pick from remaining):

                      []
              /        |        \\
           [1]        [2]       [3]
          /   \\      /   \\     /   \\
       [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
         |     |     |     |     |     |
      [1,2,3][1,3,2][2,1,3][2,3,1][3,1,2][3,2,1]

Use a boolean[] used array to track which elements are chosen.
\`\`\`

\`\`\`java
public List<List<Integer>> permute(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrackPerm(result, new ArrayList<>(), nums, used);
    return result;
}

private void backtrackPerm(List<List<Integer>> result, List<Integer> current,
                           int[] nums, boolean[] used) {
    if (current.size() == nums.length) {
        result.add(new ArrayList<>(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;
        // For duplicates: skip if same value as previous unused element
        if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;

        used[i] = true;
        current.add(nums[i]);
        backtrackPerm(result, current, nums, used);
        current.remove(current.size() - 1);
        used[i] = false;
    }
}
\`\`\`

### N-Queens — Board State Visualization

\`\`\`
N = 4

Place queens row by row, checking column/diagonal conflicts:

Step 1: Place Q at (0,1)     Step 2: Place Q at (1,3)
  . Q . .                      . Q . .
  . . . .                      . . . Q
  . . . .                      . . . .
  . . . .                      . . . .

Step 3: Try row 2...          Step 4: Q at (2,0) works!
  (2,0)? Check col 0: OK       . Q . .
  Check diagonals:              . . . Q
    (0,1)→(1,0)→(2,-1) no      Q . . .
    (1,3)→(2,2) no conflict     . . . .
  Place Q at (2,0)!

Step 5: Try row 3...          Final valid solution 1:
  (3,0)? col 0 taken            . Q . .
  (3,1)? col 1 taken            . . . Q
  (3,2)? check diag with        Q . . .
    (2,0): same diag! skip       . . Q .
  (3,2)? Actually:
    |3-2|==|2-0|? 1==2 no      Second valid solution:
  Wait: (3,2) col OK,            . . Q .
  diag (2,0): |3-2|=1,           Q . . .
  |2-0|=2 → not same diag        . . . Q
  diag (1,3): |3-1|=2,           . Q . .
  |2-3|=1 → not same diag
  diag (0,1): |3-0|=3,
  |2-1|=1 → not same diag
  Place Q at (3,2)! ✓
\`\`\`

\`\`\`java
public List<List<String>> solveNQueens(int n) {
    List<List<String>> result = new ArrayList<>();
    boolean[] cols = new boolean[n];
    boolean[] diag1 = new boolean[2 * n]; // row - col + n
    boolean[] diag2 = new boolean[2 * n]; // row + col
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');
    placeQueen(result, board, 0, n, cols, diag1, diag2);
    return result;
}

private void placeQueen(List<List<String>> result, char[][] board, int row,
                        int n, boolean[] cols, boolean[] diag1, boolean[] diag2) {
    if (row == n) {
        List<String> solution = new ArrayList<>();
        for (char[] r : board) solution.add(new String(r));
        result.add(solution);
        return;
    }
    for (int col = 0; col < n; col++) {
        int d1 = row - col + n, d2 = row + col;
        if (cols[col] || diag1[d1] || diag2[d2]) continue;

        board[row][col] = 'Q';
        cols[col] = diag1[d1] = diag2[d2] = true;

        placeQueen(result, board, row + 1, n, cols, diag1, diag2);

        board[row][col] = '.';
        cols[col] = diag1[d1] = diag2[d2] = false;
    }
}
\`\`\`

---

## ⚡ Binary Search Advanced

### Standard Binary Search — Pointer Movement Visual

\`\`\`
Find target = 7 in [1, 3, 5, 7, 9, 11, 13]

Step 1: lo=0, hi=6, mid=3
  [1, 3, 5, 7, 9, 11, 13]
   lo       mid         hi
  nums[3]=7 == target → FOUND at index 3!

Find target = 8 (not present):
Step 1: lo=0, hi=6, mid=3, nums[3]=7 < 8 → lo=4
  [1, 3, 5, 7, 9, 11, 13]
                  lo  mid  hi
Step 2: lo=4, hi=6, mid=5, nums[5]=11 > 8 → hi=4
  [1, 3, 5, 7, 9, 11, 13]
                  lo
                  hi
Step 3: lo=4, hi=4, mid=4, nums[4]=9 > 8 → hi=3
  lo > hi → NOT FOUND
\`\`\`

### Lower Bound & Upper Bound

\`\`\`
Find FIRST occurrence of 5 in [1, 3, 5, 5, 5, 7, 9]
                                0  1  2  3  4  5  6

Lower Bound (first >= target):
  lo=0, hi=6, mid=3: nums[3]=5 >= 5 → hi=3 (could be answer, go left)
  lo=0, hi=3, mid=1: nums[1]=3 < 5 → lo=2
  lo=2, hi=3, mid=2: nums[2]=5 >= 5 → hi=2
  lo=2, hi=2 → answer: index 2 (first 5)

Upper Bound (first > target):
  lo=0, hi=6, mid=3: nums[3]=5, not > 5 → lo=4
  lo=4, hi=6, mid=5: nums[5]=7 > 5 → hi=5
  lo=4, hi=5, mid=4: nums[4]=5, not > 5 → lo=5
  lo=5, hi=5 → answer: index 5 (first element after all 5s)

Number of 5s = upperBound - lowerBound = 5 - 2 = 3 ✓
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

### Search in Rotated Sorted Array

\`\`\`
nums = [4, 5, 6, 7, 0, 1, 2], target = 0

Key insight: one half is ALWAYS sorted!

Step 1: lo=0, hi=6, mid=3
  [4, 5, 6, 7, 0, 1, 2]
   lo       mid       hi
  nums[lo]=4 <= nums[mid]=7 → LEFT half [4,5,6,7] is sorted
  Is target in [4..7]? No (target=0 < 4) → search RIGHT: lo=4

Step 2: lo=4, hi=6, mid=5
  [4, 5, 6, 7, 0, 1, 2]
                  lo mid hi
  nums[lo]=0 <= nums[mid]=1 → LEFT half [0,1] is sorted
  Is target in [0..1]? Yes (0 >= 0 and 0 <= 1) → search LEFT: hi=5

Step 3: lo=4, hi=5, mid=4
  nums[4]=0 == target → FOUND at index 4!

Decision tree at each step:
  Is LEFT half sorted? (nums[lo] <= nums[mid])
    YES → Is target in [nums[lo], nums[mid]]?
      YES → search left (hi = mid - 1)
      NO  → search right (lo = mid + 1)
    NO → RIGHT half must be sorted
      Is target in [nums[mid], nums[hi]]?
        YES → search right (lo = mid + 1)
        NO  → search left (hi = mid - 1)
\`\`\`

\`\`\`java
public int search(int[] nums, int target) {
    int lo = 0, hi = nums.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;

        if (nums[lo] <= nums[mid]) { // left half is sorted
            if (target >= nums[lo] && target < nums[mid]) {
                hi = mid - 1;
            } else {
                lo = mid + 1;
            }
        } else { // right half is sorted
            if (target > nums[mid] && target <= nums[hi]) {
                lo = mid + 1;
            } else {
                hi = mid - 1;
            }
        }
    }
    return -1;
}
\`\`\`

### Binary Search on Answer

**Concept:** When the answer space is monotonic, binary search the answer itself.

\`\`\`
Problem: "Koko Eating Bananas"
Piles = [3, 6, 7, 11], H = 8 hours
Find minimum eating speed k.

Answer space: k can be 1 to max(piles) = 11
For each k, compute hours needed:
  k=1:  3+6+7+11 = 27 hours (too slow)
  k=6:  1+1+2+2 = 6 hours (fast enough)
  k=11: 1+1+1+1 = 4 hours (too fast, wasteful)

Binary search for minimum k where hours <= H:

  lo=1, hi=11
  mid=6: hours(6)=ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
                  = 1+1+2+2 = 6 <= 8 → could work, try smaller: hi=6
  mid=3: hours(3)=1+2+3+4 = 10 > 8 → too slow: lo=4
  mid=5: hours(5)=1+2+2+3 = 8 <= 8 → try smaller: hi=5
  mid=4: hours(4)=1+2+2+3 = 8 <= 8 → try smaller: hi=4
  lo=4, hi=4 → answer: k=4

Verify: k=4 → ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4)
             = 1+2+2+3 = 8 <= 8 ✓
\`\`\`

\`\`\`java
public int minEatingSpeed(int[] piles, int h) {
    int lo = 1, hi = 0;
    for (int p : piles) hi = Math.max(hi, p);

    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canFinish(piles, mid, h)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    return lo;
}

private boolean canFinish(int[] piles, int speed, int h) {
    int hours = 0;
    for (int p : piles) {
        hours += (p + speed - 1) / speed; // ceiling division
    }
    return hours <= h;
}
\`\`\`

---

## 🧩 Bit Manipulation

### Common Operations Visual

\`\`\`
AND (&):  Keep bits where BOTH are 1
  1 0 1 1        11
& 1 1 0 1        13
─────────
  1 0 0 1         9

OR (|):   Set bits where EITHER is 1
  1 0 1 1        11
| 1 1 0 1        13
─────────
  1 1 1 1        15

XOR (^):  Flip bits where they DIFFER
  1 0 1 1        11
^ 1 1 0 1        13
─────────
  0 1 1 0         6

NOT (~):  Flip ALL bits
~ 0 0 0 0 1 0 1 1   11
─────────────────
  1 1 1 1 0 1 0 0  -12 (two's complement)

Left Shift (<<):  Multiply by 2^k
  0 0 1 0 1 1       11
  << 2
  1 0 1 1 0 0       44  (11 * 4)

Right Shift (>>):  Divide by 2^k
  0 0 1 0 1 1       11
  >> 1
  0 0 0 1 0 1        5  (11 / 2, floor)
\`\`\`

### Essential Bit Tricks

\`\`\`
1. n & (n-1): Clear the lowest set bit
   n   = 1 0 1 0 0    (20)
   n-1 = 1 0 0 1 1    (19)
   &   = 1 0 0 0 0    (16)  ← lowest set bit (bit 2) cleared!

   Use: count set bits, check power of 2

2. n & (-n): Isolate the lowest set bit
   n  = 1 0 1 0 0     (20)
   -n = 0 1 1 0 0     (-20, two's complement)
   &  = 0 0 1 0 0     (4)   ← only the lowest set bit!

   Use: Binary Indexed Tree (Fenwick Tree)

3. XOR properties:
   a ^ a = 0          (self-cancellation)
   a ^ 0 = a          (identity)
   a ^ b ^ a = b      (cancels out a)

   Use: find single number in array of pairs

4. Check if power of 2:
   n > 0 && (n & (n-1)) == 0
   Powers: 1=1, 2=10, 4=100, 8=1000 → only 1 bit set!

5. Check ith bit:
   (n >> i) & 1    or    n & (1 << i) != 0

6. Set ith bit:
   n | (1 << i)

7. Clear ith bit:
   n & ~(1 << i)

8. Toggle ith bit:
   n ^ (1 << i)
\`\`\`

### Counting Bits (Brian Kernighan's Algorithm)

\`\`\`
Count set bits in n = 13 (binary: 1101)

Step 1: n = 1101, n-1 = 1100, n & (n-1) = 1100, count=1
Step 2: n = 1100, n-1 = 1011, n & (n-1) = 1000, count=2
Step 3: n = 1000, n-1 = 0111, n & (n-1) = 0000, count=3
Step 4: n = 0 → done!  Answer: 3 bits set

Each step removes exactly one set bit → O(number of set bits)
\`\`\`

\`\`\`java
public int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        n &= (n - 1); // clear lowest set bit
        count++;
    }
    return count;
}

// Alternative: Integer.bitCount(n) in Java
\`\`\`

### Single Number (XOR)

\`\`\`
nums = [4, 1, 2, 1, 2]

XOR all elements:
  4 ^ 1 ^ 2 ^ 1 ^ 2
= 4 ^ (1 ^ 1) ^ (2 ^ 2)    (XOR is commutative & associative)
= 4 ^ 0 ^ 0
= 4

Pairs cancel out, leaving the single number!
\`\`\`

\`\`\`java
public int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) result ^= n;
    return result;
}
\`\`\`

---

## 📐 Sorting Deep Dive

### Comparison of All Sorts

| Algorithm | Best | Average | Worst | Space | Stable? | In-Place? | Notes |
|---|---|---|---|---|---|---|---|
| Bubble Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes | Yes | Educational only |
| Selection Sort | O(n^2) | O(n^2) | O(n^2) | O(1) | No | Yes | Minimum swaps |
| Insertion Sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes | Yes | Best for nearly sorted / small |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | No | Guaranteed performance |
| Quick Sort | O(n log n) | O(n log n) | O(n^2) | O(log n) | No | Yes | Fastest in practice |
| Heap Sort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Yes | Poor cache locality |
| Counting Sort | O(n+k) | O(n+k) | O(n+k) | O(k) | Yes | No | Bounded integers only |
| Radix Sort | O(d*n) | O(d*n) | O(d*n) | O(n) | Yes | No | d = number of digits |

### Java's Built-in Sorting

\`\`\`
Arrays.sort() behavior:
  
  Primitives (int[], double[], etc.):
    → Dual-Pivot Quicksort
    → NOT stable
    → O(n log n) average, O(n^2) worst case
    → In-place, O(log n) stack space
    → Switches to insertion sort for small arrays (< 47)
  
  Objects (Integer[], String[], etc.):
    → TimSort (hybrid merge sort + insertion sort)
    → STABLE (preserves order of equal elements)
    → O(n log n) guaranteed
    → O(n) extra space
    → Exploits partially sorted data ("runs")
  
  Collections.sort():
    → TimSort (delegates to Arrays.sort for the underlying array)
    → STABLE

Key differences:
  ┌──────────────────┬──────────────────┬──────────────────┐
  │                  │ Arrays.sort(int[])│ Arrays.sort(T[]) │
  ├──────────────────┼──────────────────┼──────────────────┤
  │ Algorithm        │ Dual-Pivot QSort │ TimSort          │
  │ Stability        │ NOT stable       │ Stable           │
  │ Worst case       │ O(n^2)           │ O(n log n)       │
  │ Extra space      │ O(log n)         │ O(n)             │
  │ Best for         │ Raw performance  │ Object sorting   │
  └──────────────────┴──────────────────┴──────────────────┘
\`\`\`

### When to Use Which Sort

\`\`\`
Nearly sorted data → Insertion Sort or TimSort (built-in)
Small array (< 50) → Insertion Sort (built-in switches to this)
Guaranteed O(n log n) → Merge Sort or Heap Sort
Need stability → Merge Sort / TimSort
Memory constrained → Quick Sort / Heap Sort (in-place)
Bounded integer range → Counting Sort
Large integers, fixed digits → Radix Sort
Interview (general) → Just use Arrays.sort() and explain why
\`\`\`

---

## 🔢 Math & Number Theory

### GCD — Euclidean Algorithm Visual

\`\`\`
GCD(48, 18):

Step 1: 48 = 2 * 18 + 12    → GCD(48,18) = GCD(18,12)
Step 2: 18 = 1 * 12 + 6     → GCD(18,12) = GCD(12,6)
Step 3: 12 = 2 * 6  + 0     → GCD(12,6)  = 6

Answer: GCD(48, 18) = 6

Visual:
  48 │████████████████████████████████████████████████│
  18 │██████████████████│██████████████████│ remainder=12
  12 │████████████│████████████│ remainder=6
   6 │██████│██████│ remainder=0 → DONE!

LCM(a,b) = a * b / GCD(a,b)
LCM(48,18) = 48 * 18 / 6 = 144
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

// Or recursively:
public int gcdRecursive(int a, int b) {
    return b == 0 ? a : gcd(b, a % b);
}

public int lcm(int a, int b) {
    return a / gcd(a, b) * b; // divide first to avoid overflow
}
\`\`\`

### Sieve of Eratosthenes — Visual

\`\`\`
Find all primes up to 30:

Start: all marked as prime
 2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30

Cross out multiples of 2:
 2  3  X  5  X  7  X  9  X 11  X 13  X 15  X 17  X 19  X 21  X 23  X 25  X 27  X 29  X

Cross out multiples of 3:
 2  3  X  5  X  7  X  X  X 11  X 13  X  X  X 17  X 19  X  X  X 23  X 25  X  X  X 29  X

Cross out multiples of 5:
 2  3  X  5  X  7  X  X  X 11  X 13  X  X  X 17  X 19  X  X  X 23  X  X  X  X  X 29  X

Done! (sqrt(30) ≈ 5.5, so we only check up to 5)

Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29
\`\`\`

\`\`\`java
public List<Integer> sieveOfEratosthenes(int n) {
    boolean[] isComposite = new boolean[n + 1];
    List<Integer> primes = new ArrayList<>();

    for (int i = 2; i <= n; i++) {
        if (!isComposite[i]) {
            primes.add(i);
            // Start from i*i (smaller multiples already marked)
            for (long j = (long) i * i; j <= n; j += i) {
                isComposite[(int) j] = true;
            }
        }
    }
    return primes;
}
\`\`\`

### Modular Arithmetic

\`\`\`
Key rules (mod m):
  (a + b) % m = ((a % m) + (b % m)) % m
  (a * b) % m = ((a % m) * (b % m)) % m
  (a - b) % m = ((a % m) - (b % m) + m) % m  ← add m to handle negative

Common mod value in interviews: 10^9 + 7 = 1_000_000_007

Why 10^9 + 7?
  - It's prime (needed for modular inverse)
  - Fits in 32-bit int
  - Two values multiplied fit in 64-bit long: (10^9)^2 < 2^63

Fast modular exponentiation: compute a^b % m in O(log b)
\`\`\`

\`\`\`java
// Fast power: compute base^exp % mod
public long modPow(long base, long exp, long mod) {
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

// Modular addition (safe from overflow)
int MOD = 1_000_000_007;
long sum = ((long) a + b) % MOD;

// Modular multiplication
long prod = ((long) a * b) % MOD;
\`\`\`

---

## 🎯 Pattern Recognition

| Keywords / Signals | Think... |
|---|---|
| "All possible combinations/subsets" | Backtracking |
| "Generate all valid" | Backtracking with pruning |
| "Find in sorted / rotated sorted" | Binary search |
| "Minimum/maximum of something" with monotonic condition | Binary search on answer |
| "Single number / missing number" | Bit manipulation (XOR) |
| "Power of 2" | \`n & (n-1) == 0\` |
| "Count set bits" | Brian Kernighan's |
| "GCD / prime factors" | Number theory |
| "N-Queens / Sudoku" | Backtracking with constraint checking |
| "Kth smallest/largest" | Binary search or Heap |
| "Sort with custom order" | Custom comparator |
| "Count numbers with digit property" | Digit DP (see DP section) |
| "Minimum speed/capacity/time" (answer is monotonic) | Binary search on answer |

---

## 📊 Complexity Cheat Sheet

| Algorithm | Time | Space | Notes |
|---|---|---|---|
| Subsets | O(n * 2^n) | O(n) | 2^n subsets, O(n) each |
| Permutations | O(n * n!) | O(n) | n! permutations |
| N-Queens | O(n!) | O(n) | Pruning reduces significantly |
| Combination Sum | O(2^target) | O(target) | Depends on target/min coin |
| Binary Search | O(log n) | O(1) | Standard |
| BS on Answer | O(n * log(range)) | O(1) | n = validation cost |
| Counting Bits | O(set bits) | O(1) | Brian Kernighan |
| Single Number | O(n) | O(1) | XOR all elements |
| Sieve of Eratosthenes | O(n log log n) | O(n) | Find primes up to n |
| GCD (Euclidean) | O(log(min(a,b))) | O(1) | Very fast |
| Modular Exponentiation | O(log exp) | O(1) | Fast power |

---

## 🧠 Interview Deep Dive: Worked Examples

### Example 1: Subsets — Decision Tree Trace

**Problem:** Generate all subsets of [1, 2, 3].

\`\`\`
Decision tree (include/exclude):

Level 0 (element 1):   include      exclude
                        [1]          []

Level 1 (element 2):   [1,2]  [1]   [2]   []

Level 2 (element 3):   [1,2,3][1,2] [1,3][1] [2,3][2] [3] []

Result (via backtracking with start index):
  start=0: add []
    pick 1 → start=1: add [1]
      pick 2 → start=2: add [1,2]
        pick 3 → start=3: add [1,2,3]
      pick 3 → start=3: add [1,3]
    pick 2 → start=2: add [2]
      pick 3 → start=3: add [2,3]
    pick 3 → start=3: add [3]

Final: [[], [1], [1,2], [1,2,3], [1,3], [2], [2,3], [3]]
\`\`\`

### Example 2: Search in Rotated Sorted Array — Binary Search Trace

**Problem:** Find target=0 in [4, 5, 6, 7, 0, 1, 2].

\`\`\`
  index: 0  1  2  3  4  5  6
  value: 4  5  6  7  0  1  2

Step 1: lo=0, hi=6, mid=3
  nums[mid]=7, target=0, not equal
  nums[lo]=4 <= nums[mid]=7 → LEFT is sorted [4,5,6,7]
  target=0 in [4..7]? NO (0 < 4)
  → Search RIGHT: lo = mid+1 = 4

Step 2: lo=4, hi=6, mid=5
  nums[mid]=1, target=0, not equal
  nums[lo]=0 <= nums[mid]=1 → LEFT is sorted [0,1]
  target=0 in [0..1]? YES (0 >= 0 and 0 <= 1)
  → Search LEFT: hi = mid-1 = 4

Step 3: lo=4, hi=4, mid=4
  nums[mid]=0 == target → FOUND at index 4!

Total comparisons: 3 (O(log n) confirmed)
\`\`\`

### Example 3: Single Number — XOR Trace

**Problem:** Find the single number in [2, 2, 1].

\`\`\`
result = 0

Step 1: result = 0 ^ 2 = 2
  Binary: 00 ^ 10 = 10

Step 2: result = 2 ^ 2 = 0
  Binary: 10 ^ 10 = 00  (pair cancels!)

Step 3: result = 0 ^ 1 = 1
  Binary: 00 ^ 01 = 01

Answer: 1 ✓

Another example: [4, 1, 2, 1, 2]
  0 ^ 4 = 4  (100)
  4 ^ 1 = 5  (101)
  5 ^ 2 = 7  (111)
  7 ^ 1 = 6  (110)  ← 1 cancels
  6 ^ 2 = 4  (100)  ← 2 cancels

Answer: 4 ✓
\`\`\`

### Example 4: Koko Eating Bananas — Binary Search on Answer

**Problem:** Piles = [30, 11, 23, 4, 20], H = 5 hours. Find minimum speed.

\`\`\`
Answer space: lo=1, hi=max(piles)=30

Step 1: lo=1, hi=30, mid=15
  hours = ceil(30/15)+ceil(11/15)+ceil(23/15)+ceil(4/15)+ceil(20/15)
        = 2+1+2+1+2 = 8 > 5 → too slow: lo=16

Step 2: lo=16, hi=30, mid=23
  hours = ceil(30/23)+ceil(11/23)+ceil(23/23)+ceil(4/23)+ceil(20/23)
        = 2+1+1+1+1 = 6 > 5 → too slow: lo=24

Step 3: lo=24, hi=30, mid=27
  hours = 2+1+1+1+1 = 6 > 5 → too slow: lo=28

Step 4: lo=28, hi=30, mid=29
  hours = 2+1+1+1+1 = 6 > 5 → too slow: lo=30

Step 5: lo=30, hi=30 → answer: 30

Verify: speed=30 → 1+1+1+1+1 = 5 <= 5 ✓
        speed=29 → 2+1+1+1+1 = 6 > 5 ✗
\`\`\`

---

## ⚠️ Common Mistakes

1. **Backtracking: forgetting to undo choices:**
\`\`\`java
// WRONG — never removes the element
current.add(nums[i]);
backtrack(result, current, nums, i + 1);
// MISSING: current.remove(current.size() - 1);

// CORRECT
current.add(nums[i]);
backtrack(result, current, nums, i + 1);
current.remove(current.size() - 1); // UNDO!
\`\`\`

2. **Backtracking: adding reference instead of copy:**
\`\`\`java
// WRONG — all entries point to same list
result.add(current);

// CORRECT — create a snapshot
result.add(new ArrayList<>(current));
\`\`\`

3. **Binary search: wrong loop condition:**
\`\`\`java
// Exact search: lo <= hi (can check single element)
while (lo <= hi) { ... if (found) return mid; ... }

// Boundary search: lo < hi (converge to answer)
while (lo < hi) { ... hi = mid OR lo = mid + 1; ... }
\`\`\`

4. **Binary search: infinite loop with wrong mid update:**
\`\`\`java
// If lo = mid (not mid+1), infinite loop when lo+1 == hi
// Fix: use mid = lo + (hi - lo + 1) / 2 (ceiling)
\`\`\`

5. **Bit manipulation: assuming 32-bit:**
\`\`\`java
// Java int is 32-bit, long is 64-bit
// Know which you need! Especially for left shift:
1 << 31   // negative! (int overflow)
1L << 31  // correct (long)
\`\`\`

6. **Not handling empty input** in any algorithm.

7. **GCD: not handling zero:**
\`\`\`java
// GCD(0, n) = n, GCD(n, 0) = n
// The Euclidean algorithm handles this naturally
\`\`\`

8. **Modular arithmetic: negative results:**
\`\`\`java
// (a - b) % MOD can be negative in Java!
int result = ((a - b) % MOD + MOD) % MOD; // correct
\`\`\`

---

## 💡 Java-Specific Tips

### Backtracking Utilities

\`\`\`java
// Swap for in-place permutation
private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

// StringBuilder for string backtracking (efficient)
StringBuilder sb = new StringBuilder();
sb.append(c);           // make choice
backtrack(sb, ...);
sb.deleteCharAt(sb.length() - 1); // undo choice
\`\`\`

### Binary Search Built-ins

\`\`\`java
// Arrays.binarySearch — returns index or -(insertion point) - 1
int idx = Arrays.binarySearch(arr, target);
if (idx < 0) {
    int insertionPoint = -(idx + 1); // where it would be inserted
}

// Collections.binarySearch — same for Lists
int idx = Collections.binarySearch(list, target);

// For custom comparator:
Arrays.sort(arr, (a, b) -> a[0] - b[0]);
\`\`\`

### Bit Manipulation Methods

\`\`\`java
Integer.bitCount(n);           // count set bits
Integer.highestOneBit(n);      // isolate highest set bit
Integer.lowestOneBit(n);       // isolate lowest set bit
Integer.numberOfLeadingZeros(n);
Integer.numberOfTrailingZeros(n);
Integer.toBinaryString(n);     // "1010" string representation
\`\`\`

### Math Utilities

\`\`\`java
Math.abs(x);                   // absolute value
Math.max(a, b);               // maximum
Math.min(a, b);               // minimum
Math.pow(base, exp);          // returns double!
Math.sqrt(x);                 // returns double
Math.ceil(x);                 // ceiling (returns double)
Math.floor(x);                // floor (returns double)

// Integer ceiling division (avoid floating point)
int ceil = (a + b - 1) / b;   // ceiling of a/b for positive a,b

// Overflow-safe multiplication check
if (a != 0 && b > Integer.MAX_VALUE / a) { /* overflow */ }
\`\`\`

### Performance Notes

\`\`\`java
// Bit operations are MUCH faster than multiplication/division
n << 1   // equivalent to n * 2
n >> 1   // equivalent to n / 2
n & 1    // equivalent to n % 2

// Use long for intermediate calculations
long product = (long) a * b;  // avoid int overflow
long square = (long) n * n;
\`\`\`

---

## 🔗 Comparison Tables

### Backtracking Problem Variants

| Problem | Decision at Each Step | Pruning Strategy | Time |
|---|---|---|---|
| Subsets | Include or exclude element | None needed | O(n * 2^n) |
| Subsets (with dups) | Include/exclude + skip dups | Sort, skip same as prev | O(n * 2^n) |
| Permutations | Pick unused element | boolean[] used | O(n * n!) |
| Permutations (dups) | Pick unused + skip dups | Sort + skip condition | O(n * n!) |
| Combination Sum | Pick current or move on | Sort, skip if > remaining | varies |
| N-Queens | Place queen in current row | Column + diagonal checks | O(n!) |
| Sudoku | Place 1-9 in empty cell | Row+col+box validation | O(9^empty) |
| Palindrome Partition | Split at each position | Check palindrome before | O(n * 2^n) |
| Word Search | Move in 4 directions | Bounds + visited check | O(m*n * 4^L) |

### Binary Search Variants

| Variant | Loop Condition | Return | Use When |
|---|---|---|---|
| Exact match | \`lo <= hi\` | mid or -1 | Find specific value |
| Lower bound | \`lo < hi\` | lo | First >= target |
| Upper bound | \`lo < hi\` | lo | First > target |
| Rotated array | \`lo <= hi\` | mid or -1 | Sorted then rotated |
| Search on answer | \`lo < hi\` | lo | Answer space is monotonic |
| Peak element | \`lo < hi\` | lo | Find local max |
| Minimum in rotated | \`lo < hi\` | lo | Find rotation point |

### Bit Manipulation Cheat Sheet

| Operation | Code | Description |
|---|---|---|
| Check ith bit | \`(n >> i) & 1\` | Is bit i set? |
| Set ith bit | \`n \\| (1 << i)\` | Turn on bit i |
| Clear ith bit | \`n & ~(1 << i)\` | Turn off bit i |
| Toggle ith bit | \`n ^ (1 << i)\` | Flip bit i |
| Clear lowest set bit | \`n & (n-1)\` | Remove rightmost 1 |
| Isolate lowest set bit | \`n & (-n)\` | Keep only rightmost 1 |
| Check power of 2 | \`n > 0 && (n & (n-1)) == 0\` | Exactly one bit set |
| Count set bits | Loop with \`n &= (n-1)\` | Brian Kernighan |
| All 1s mask for n bits | \`(1 << n) - 1\` | e.g., n=3 → 111 |
| Swap two values | \`a ^= b; b ^= a; a ^= b;\` | XOR swap trick |

### When to Use What — Master Decision Table

| Problem Type | First Choice | Why |
|---|---|---|
| Generate all subsets | Backtracking | Decision tree, O(2^n) |
| Generate all permutations | Backtracking | Pick from remaining, O(n!) |
| Constraint satisfaction (N-Queens) | Backtracking + pruning | Eliminate branches early |
| Find in sorted array | Binary search | O(log n) |
| Find minimum satisfying condition | Binary search on answer | Monotonic answer space |
| Find single/missing number | XOR | O(n) time, O(1) space |
| Check power of 2 | Bit trick | O(1) |
| Find GCD | Euclidean algorithm | O(log n) |
| Find all primes up to n | Sieve of Eratosthenes | O(n log log n) |
| Sort in interview | Arrays.sort | O(n log n), explain choice |
| Custom sort order | Comparator | Lambda: (a,b) -> a-b |
`,
  },
];
