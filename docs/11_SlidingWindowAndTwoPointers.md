# Sliding Window & Two Pointers

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

```java
public int removeDuplicates(int[] nums) {
    int slow = 0;
    for (int fast = 1; fast < nums.length; fast++) {
        if (nums[fast] != nums[slow]) {
            nums[++slow] = nums[fast];
        }
    }
    return slow + 1;
}
```

**Move Zeroes (LC 283)**

```java
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
```

**Linked List Cycle Detection (Floyd's)**

```java
public boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}
```

---

### Opposite Direction Pointers

One pointer at each end, moving inward. Works on sorted arrays or palindrome checks.

**Two Sum II — Sorted Array (LC 167)**

```java
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
```

**Container With Most Water (LC 11)**

```java
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
```

**Valid Palindrome (LC 125)**

```java
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
```

**Trapping Rain Water (LC 42)**

```java
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
```

---

### Three Pointers

**3Sum (LC 15)** — Fix one element, then use two pointers on the rest.

```java
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
```

---

## Sliding Window Technique

Maintain a window `[left, right]` over a contiguous subarray/substring and slide it to explore all valid ranges.

### Fixed-Size Window

Window size `k` is constant. Slide by advancing both ends by 1.

**Maximum Sum Subarray of Size K**

```java
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
```

**Maximum of All Subarrays of Size K** (using deque)

```java
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
```

---

### Variable-Size Window

Window size varies to satisfy a condition. Two variants exist:

#### Template: Find Longest Subarray Meeting Condition

```java
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
```

#### Template: Find Shortest Subarray Meeting Condition

```java
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
```

**Minimum Size Subarray Sum (LC 209)**

```java
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
```

---

### Shrinkable vs Non-Shrinkable Windows

Two approaches for "find the longest" problems:

**Shrinkable** (standard): Shrink the window until it becomes valid.
```java
// Window can shrink: left moves as much as needed
while (invalid) { left++; }
result = Math.max(result, right - left + 1);
```

**Non-shrinkable** (advanced): Window never shrinks, only grows or slides.
```java
// Window never shrinks: left moves at most once per step
if (invalid) { left++; }
result = right - left + 1; // always update (window size only grows)
```

The non-shrinkable approach works because we only care about the *maximum* window size. If the current window is invalid, we don't shrink — we just slide, maintaining the largest valid size found so far.

```java
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
```

---

## Common Patterns

### Minimum Window Substring (LC 76)

Find the smallest substring of `s` containing all characters of `t`.

```java
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
```

### Longest Substring Without Repeating Characters (LC 3)

```java
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
```

### Subarrays with K Different Integers (LC 992)

**Key trick**: `exactly(K) = atMost(K) - atMost(K - 1)`

```java
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
```

### String Permutation / Anagram Matching (LC 567, LC 438)

**Find All Anagrams in a String (LC 438)**

```java
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
```

**Optimization**: Instead of comparing arrays each time, maintain a `matches` counter.

```java
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
```

---

## HashMap + Sliding Window

Many window problems need a frequency map to track the window's contents.

### Pattern: Window with Character Frequency

```java
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
```

### When to Use Array vs HashMap
| Approach | Use When |
|----------|----------|
| `int[26]` or `int[128]` | Character set is small and known (lowercase, ASCII) |
| `HashMap<K, V>` | Elements are arbitrary integers, strings, or large domain |

Array lookup is faster (O(1) with small constant) and avoids boxing overhead.

---

## Complexity Analysis

| Technique | Time | Space | Key Insight |
|-----------|------|-------|-------------|
| Two Pointers (opposite) | O(n) | O(1) | Each pointer moves at most n times |
| Two Pointers (same dir) | O(n) | O(1) | Fast pointer visits each element once |
| Fixed Window | O(n) | O(1) or O(k) | Each element enters/exits window once |
| Variable Window (shrinkable) | O(n) | O(k) | `left` and `right` each move at most n times total |
| Variable Window + HashMap | O(n) | O(min(n, alphabet)) | Map operations are O(1) amortized |
| 3Sum | O(n²) | O(1) | Outer loop × inner two-pointer pass |
| Sliding Window Maximum | O(n) | O(k) | Monotonic deque — each element pushed/popped once |

> **Why is variable window O(n)?** Both `left` and `right` only move forward. Over the entire execution, `left` moves at most `n` times and `right` moves exactly `n` times → total work is O(n).

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
4. **"Exactly K" condition?** → Convert to `atMost(K) - atMost(K-1)`

### Common Mistakes
1. **Off-by-one**: Is the window `[left, right]` inclusive on both ends? Be consistent.
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
