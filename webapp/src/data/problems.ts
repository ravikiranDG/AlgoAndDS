// ============================================================================
// problems.ts - 99 DS&A Interview Problems (Problem Definitions Only)
// ============================================================================

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface Problem {
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  categorySlug: string;
  description: string;
  examples: Example[];
  constraints: string[];
  hints: string[];
  starterCode: string;
  testCases: TestCase[];
}

export const problems: Problem[] = [  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the **indices** of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    hints: [
      'A brute force approach checks every pair — can you do better?',
      'Think about what value you need to find for each element to reach the target.',
      'Use a HashMap to store each number and its index as you iterate. For each element, check if target - nums[i] already exists in the map.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Given an array of integers and a target, return indices of
     * the two numbers that add up to target.
     */
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1,2]' },
      { input: 'nums = [3,3], target = 6', expectedOutput: '[0,1]' },
      { input: 'nums = [-1,-2,-3,-4,-5], target = -8', expectedOutput: '[2,4]' },
      { input: 'nums = [0,4,3,0], target = 0', expectedOutput: '[0,3]' },
    ],
  },
  {
    slug: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in **O(n)** time and **without using the division operation**.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'For index 0: 2*3*4=24, index 1: 1*3*4=12, etc.' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'Product of any prefix/suffix fits in a 32-bit integer.', 'Solve without division in O(n).'],
    hints: [
      'Think about computing prefix and suffix products separately.',
      'For each index i, the answer is (product of everything left) * (product of everything right).',
      'Use two passes: left-to-right for prefix products, right-to-left for suffix products. Optimize space by using the output array for one pass.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return an array where each element is the product of all
     * other elements except itself. Do not use division.
     */
    public int[] productExceptSelf(int[] nums) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3,4]', expectedOutput: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' },
      { input: 'nums = [2,2,2,2]', expectedOutput: '[8,8,8,8]' },
      { input: 'nums = [0,0]', expectedOutput: '[0,0]' },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, merge into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    hints: [
      'What if you sort the intervals first?',
      'After sorting by start time, overlapping intervals must be adjacent.',
      'Sort by start time. Iterate and merge: if current overlaps with last merged, extend the end; otherwise add new interval.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Merge all overlapping intervals.
     */
    public int[][] merge(int[][] intervals) {
        // Your code here
        return new int[][]{};
    }
}`,
    testCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { input: 'intervals = [[1,4],[0,4]]', expectedOutput: '[[0,4]]' },
      { input: 'intervals = [[1,4],[2,3]]', expectedOutput: '[[1,4]]' },
      { input: 'intervals = [[1,2],[3,4],[5,6]]', expectedOutput: '[[1,2],[3,4],[5,6]]' },
    ],
  },
  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map traps 6 units of rain water.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    hints: [
      'For each position, the water level is determined by the shorter of the tallest bars on its left and right.',
      'Water at position i = min(maxLeft, maxRight) - height[i].',
      'Use two pointers from both ends. Maintain leftMax and rightMax. Move the pointer with the smaller max inward, calculating trapped water as you go.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Calculate how much rain water can be trapped.
     */
    public int trap(int[] height) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: 'height = [4,2,0,3,2,5]', expectedOutput: '9' },
      { input: 'height = [1,0,1]', expectedOutput: '1' },
      { input: 'height = [3,0,0,2,0,4]', expectedOutput: '10' },
      { input: 'height = [0,0,0]', expectedOutput: '0' },
    ],
  },
  {
    slug: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke". Note "pwke" is a subsequence, not a substring.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: [
      'Think about using a sliding window approach.',
      'Use a set or map to track characters in the current window.',
      'Maintain a window [left, right]. Expand right; when a duplicate is found, shrink from left. Track maximum window size.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the length of the longest substring without repeating characters.
     */
    public int lengthOfLongestSubstring(String s) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 's = "abcabcbb"', expectedOutput: '3' },
      { input: 's = "bbbbb"', expectedOutput: '1' },
      { input: 's = "pwwkew"', expectedOutput: '3' },
      { input: 's = ""', expectedOutput: '0' },
      { input: 's = " "', expectedOutput: '1' },
    ],
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the i-th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store. You may not slant the container.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 (h=8) and index 8 (h=7) form area min(8,7)*(8-1) = 49.' },
      { input: 'height = [1,1]', output: '1' },
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    hints: [
      'The area is limited by the shorter line. How can you maximize width?',
      'Start with the widest container (left=0, right=n-1).',
      'Use two pointers from both ends. Move the pointer pointing to the shorter line inward, since moving the taller one cannot increase the area.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the maximum area of water a container can store.
     */
    public int maxArea(int[] height) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      { input: 'height = [1,1]', expectedOutput: '1' },
      { input: 'height = [4,3,2,1,4]', expectedOutput: '16' },
      { input: 'height = [1,2,1]', expectedOutput: '2' },
    ],
  },
  {
    slug: 'three-sum',
    title: 'Three Sum',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'The distinct triplets are [-1,-1,2] and [-1,0,1].' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    hints: [
      'Sorting the array makes it easier to avoid duplicates and use two pointers.',
      'Fix one element and reduce to Two Sum on the remaining sorted subarray.',
      'Sort. For each nums[i], use two pointers (lo=i+1, hi=n-1) to find pairs summing to -nums[i]. Skip duplicates.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find all unique triplets that sum to zero.
     */
    public List<List<Integer>> threeSum(int[] nums) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'nums = [-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', expectedOutput: '[]' },
      { input: 'nums = [0,0,0]', expectedOutput: '[[0,0,0]]' },
      { input: 'nums = [-2,0,1,1,2]', expectedOutput: '[[-2,0,2],[-2,1,1]]' },
    ],
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: '1->2->3->4->5 becomes 5->4->3->2->1.' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: ['The number of nodes is in the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    hints: [
      'Can you reverse the pointers one by one as you traverse?',
      'Keep track of three pointers: previous, current, and next.',
      'Iteratively set current.next = prev, then advance all three pointers. Or solve it recursively.',
    ],
    starterCode: `import java.util.*;

/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
public class Solution {
    /**
     * Reverse a singly linked list.
     */
    public ListNode reverseList(ListNode head) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'head = [1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', expectedOutput: '[2,1]' },
      { input: 'head = []', expectedOutput: '[]' },
      { input: 'head = [1]', expectedOutput: '[1]' },
    ],
  },
  {
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`. Merge the two lists into one **sorted** list by splicing together the nodes. Return the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both lists are sorted in non-decreasing order.'],
    hints: [
      'Use a dummy head node to simplify edge cases.',
      'Compare nodes from both lists and append the smaller one.',
      'Create a dummy node. Always choose the smaller head between list1 and list2. Append whichever list remains.',
    ],
    starterCode: `import java.util.*;

/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
public class Solution {
    /**
     * Merge two sorted linked lists into one sorted list.
     */
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', expectedOutput: '[]' },
      { input: 'list1 = [], list2 = [0]', expectedOutput: '[0]' },
      { input: 'list1 = [5], list2 = [1,2,4]', expectedOutput: '[1,2,4,5]' },
    ],
  },
  {
    slug: 'linked-list-cycle-ii',
    title: 'Linked List Cycle II',
    difficulty: 'Medium',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Given the \`head\` of a linked list, return the node where the cycle begins. If there is no cycle, return \`null\`.

There is a cycle if some node can be reached again by continuously following the \`next\` pointer. Do not modify the linked list.

**Follow up:** Can you solve it using O(1) memory?`,
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'Node at index 1 (value 2)', explanation: 'Tail connects to node at index 1.' },
      { input: 'head = [1,2], pos = 0', output: 'Node at index 0 (value 1)' },
      { input: 'head = [1], pos = -1', output: 'null', explanation: 'No cycle.' },
    ],
    constraints: ['The number of nodes is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index.'],
    hints: [
      "Use Floyd's Tortoise and Hare algorithm to detect the cycle.",
      'Once fast and slow pointers meet, the cycle start can be found with a mathematical insight.',
      'After detecting a meeting point, reset one pointer to head. Advance both one step at a time — they meet at the cycle start.',
    ],
    starterCode: `import java.util.*;

/**
 * Definition for singly-linked list.
 * class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; next = null; }
 * }
 */
public class Solution {
    /**
     * Detect the start of a cycle in a linked list.
     */
    public ListNode detectCycle(ListNode head) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'head = [3,2,0,-4], pos = 1', expectedOutput: 'index 1' },
      { input: 'head = [1,2], pos = 0', expectedOutput: 'index 0' },
      { input: 'head = [1], pos = -1', expectedOutput: 'null' },
      { input: 'head = [1,2,3,4,5], pos = 2', expectedOutput: 'index 2' },
    ],
  },
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Hard',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Design a data structure that follows the constraints of a **Least Recently Used (LRU)** cache.

Implement the \`LRUCache\` class:

- \`LRUCache(int capacity)\` — Initialize the LRU cache with positive size capacity.
- \`int get(int key)\` — Return the value of the key if it exists, otherwise return -1.
- \`void put(int key, int value)\` — Update the value if the key exists. Otherwise, add the key-value pair. If the number of keys exceeds the capacity, evict the least recently used key.

The functions \`get\` and \`put\` must each run in **O(1)** average time complexity.`,
    examples: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]', explanation: 'Cache capacity 2. After put(3,3), key 2 is evicted. After put(4,4), key 1 is evicted.' },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls to get and put.'],
    hints: [
      'You need O(1) for both lookup and maintaining order. What two data structures give you that?',
      'Combine a HashMap for O(1) lookup with a doubly linked list for O(1) insertion/removal.',
      'Use a HashMap<Integer, Node> and a doubly linked list. On get/put, move the accessed node to the head. On eviction, remove the tail.',
    ],
    starterCode: `import java.util.*;

public class LRUCache {

    public LRUCache(int capacity) {
        // Your code here
    }

    /**
     * Return the value for the given key, or -1 if not found.
     * Marks the key as recently used.
     */
    public int get(int key) {
        // Your code here
        return -1;
    }

    /**
     * Insert or update a key-value pair.
     * Evicts the least recently used item if capacity is exceeded.
     */
    public void put(int key, int value) {
        // Your code here
    }
}`,
    testCases: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', expectedOutput: '[null,null,null,1,null,-1,null,-1,3,4]' },
      { input: '["LRUCache","put","get","put","get","get"]\n[[1],[2,1],[2],[3,2],[2],[3]]', expectedOutput: '[null,null,1,null,-1,2]' },
      { input: '["LRUCache","put","put","get","put","put","get"]\n[[2],[2,1],[2,2],[2],[1,1],[4,1],[2]]', expectedOutput: '[null,null,null,2,null,null,-1]' },
    ],
  },
  {
    slug: 'copy-list-random-pointer',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `A linked list of length \`n\` is given such that each node contains an additional random pointer, which could point to any node in the list, or \`null\`.

Construct a **deep copy** of the list. The deep copy should consist of exactly \`n\` brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the \`next\` and \`random\` pointers of the new nodes should point to new nodes in the copied list.

Return the head of the copied linked list.`,
    examples: [
      { input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]', explanation: 'Each pair is [val, random_index]. The deep copy preserves all connections.' },
      { input: 'head = [[1,1],[2,1]]', output: '[[1,1],[2,1]]' },
    ],
    constraints: ['0 <= n <= 1000', '-10^4 <= Node.val <= 10^4', 'Node.random is null or points to a node in the list.'],
    hints: [
      'How do you map original nodes to their copies for assigning random pointers?',
      'Use a HashMap to store original->copy mapping.',
      'Pass 1: Clone all nodes into a HashMap. Pass 2: Set next and random pointers using the map. Or interleave copies in the original list for O(1) space.',
    ],
    starterCode: `import java.util.*;

/*
 * class Node {
 *     int val;
 *     Node next;
 *     Node random;
 *     public Node(int val) { this.val = val; this.next = null; this.random = null; }
 * }
 */
public class Solution {
    /**
     * Create a deep copy of a linked list with random pointers.
     */
    public Node copyRandomList(Node head) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', expectedOutput: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' },
      { input: 'head = [[1,1],[2,1]]', expectedOutput: '[[1,1],[2,1]]' },
      { input: 'head = [[3,null],[3,0],[3,null]]', expectedOutput: '[[3,null],[3,0],[3,null]]' },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only: '()[]{}' ."],
    hints: [
      'Use a stack to keep track of opening brackets.',
      'When you encounter a closing bracket, check if the top of the stack is the matching opener.',
      'Push opening brackets onto stack. For each closing bracket, pop and check for match. Stack should be empty at the end.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Determine if the input string has valid bracket matching.
     */
    public boolean isValid(String s) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 's = "()"', expectedOutput: 'true' },
      { input: 's = "()[]{}"', expectedOutput: 'true' },
      { input: 's = "(]"', expectedOutput: 'false' },
      { input: 's = "([)]"', expectedOutput: 'false' },
      { input: 's = "{[]}"', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in **constant time**.

Implement the \`MinStack\` class:

- \`MinStack()\` — Initializes the stack object.
- \`void push(int val)\` — Pushes val onto the stack.
- \`void pop()\` — Removes the top element.
- \`int top()\` — Gets the top element.
- \`int getMin()\` — Retrieves the minimum element in the stack.

All functions must have **O(1)** time complexity.`,
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]' },
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'pop, top, getMin will always be called on non-empty stacks.', 'At most 3 * 10^4 calls will be made.'],
    hints: [
      'How can you track the minimum as elements are pushed and popped?',
      'Maintain a second stack that tracks the minimum at each level.',
      'Use an auxiliary min-stack. Push current minimum whenever a new min is encountered. Pop from min-stack when popped value equals current min.',
    ],
    starterCode: `import java.util.*;

public class MinStack {

    public MinStack() {
        // Your code here
    }

    public void push(int val) {
        // Your code here
    }

    public void pop() {
        // Your code here
    }

    public int top() {
        // Your code here
        return 0;
    }

    public int getMin() {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', expectedOutput: '[null,null,null,null,-3,null,0,-2]' },
      { input: '["MinStack","push","push","getMin","push","getMin","pop","getMin"]\n[[],[1],[2],[],[0],[],[],[]]', expectedOutput: '[null,null,null,1,null,0,null,1]' },
    ],
  },
  {
    slug: 'largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.`,
    examples: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'The largest rectangle has area 10 (height=5, width=2 spanning indices 2-3).' },
      { input: 'heights = [2,4]', output: '4' },
    ],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    hints: [
      'For each bar, what is the widest rectangle that includes this bar at full height?',
      'Find the nearest smaller bar on left and right for each bar.',
      'Use a monotonic stack of indices with increasing heights. When a shorter bar is encountered, pop and calculate area.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the area of the largest rectangle in the histogram.
     */
    public int largestRectangleArea(int[] heights) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'heights = [2,1,5,6,2,3]', expectedOutput: '10' },
      { input: 'heights = [2,4]', expectedOutput: '4' },
      { input: 'heights = [1]', expectedOutput: '1' },
      { input: 'heights = [2,1,2]', expectedOutput: '3' },
      { input: 'heights = [5,4,3,2,1]', expectedOutput: '9' },
    ],
  },
  {
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Given an array of integers \`temperatures\`, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the i-th day to get a warmer temperature. If there is no future warmer day, keep \`answer[i] == 0\`.`,
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
      { input: 'temperatures = [30,60,90]', output: '[1,1,0]' },
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: [
      'Brute force is O(n^2). Can you use a stack?',
      'Process from right to left, or use a monotonic stack.',
      'Use a monotonic decreasing stack of indices. For each day, pop smaller elements and set their answer. Push current index.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * For each day, find how many days until a warmer temperature.
     */
    public int[] dailyTemperatures(int[] temperatures) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', expectedOutput: '[1,1,4,2,1,1,0,0]' },
      { input: 'temperatures = [30,40,50,60]', expectedOutput: '[1,1,1,0]' },
      { input: 'temperatures = [30,60,90]', expectedOutput: '[1,1,0]' },
      { input: 'temperatures = [100,100,100]', expectedOutput: '[0,0,0]' },
    ],
  },
  {
    slug: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'Level 0: [3], Level 1: [9,20], Level 2: [15,7].' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    hints: [
      'Think about BFS — processing nodes level by level.',
      'Use a queue. Process all nodes at the current level before moving to the next.',
      'Use a Queue. For each level, record queue size, poll that many nodes, add their children.',
    ],
    starterCode: `import java.util.*;

/**
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val; this.left = left; this.right = right;
 *     }
 * }
 */
public class Solution {
    /**
     * Return the level order traversal of the binary tree.
     */
    public List<List<Integer>> levelOrder(TreeNode root) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'root = [3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', expectedOutput: '[[1]]' },
      { input: 'root = []', expectedOutput: '[]' },
      { input: 'root = [1,2,3,4,5]', expectedOutput: '[[1],[2,3],[4,5]]' },
    ],
  },
  {
    slug: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, determine if it is a valid **binary search tree** (BST).

A valid BST is defined as:
- The left subtree of a node contains only nodes with keys **less than** the node's key.
- The right subtree contains only nodes with keys **greater than** the node's key.
- Both subtrees must also be valid BSTs.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The right child 4 is less than root 5.' },
    ],
    constraints: ['The number of nodes is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    hints: [
      'Simply checking left < parent < right at each node is not enough.',
      'Each node must fall within a valid range determined by ancestors.',
      'Recurse with min/max bounds. Or use in-order traversal — a valid BST produces a strictly increasing sequence.',
    ],
    starterCode: `import java.util.*;

/**
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 * }
 */
public class Solution {
    /**
     * Determine if a binary tree is a valid BST.
     */
    public boolean isValidBST(TreeNode root) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'root = [2,1,3]', expectedOutput: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', expectedOutput: 'false' },
      { input: 'root = [1]', expectedOutput: 'true' },
      { input: 'root = [5,4,6,null,null,3,7]', expectedOutput: 'false' },
    ],
  },
  {
    slug: 'lowest-common-ancestor',
    title: 'Lowest Common Ancestor of a Binary Tree',
    difficulty: 'Medium',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given a binary tree, find the **lowest common ancestor (LCA)** of two given nodes \`p\` and \`q\`.

The LCA is the lowest node that has both \`p\` and \`q\` as descendants (a node can be a descendant of itself). All node values are **unique**, and both \`p\` and \`q\` exist in the tree.`,
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explanation: 'LCA of 5 and 1 is 3.' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explanation: 'A node can be a descendant of itself.' },
      { input: 'root = [1,2], p = 1, q = 2', output: '1' },
    ],
    constraints: ['Number of nodes in range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All values are unique.', 'p != q', 'p and q exist in the tree.'],
    hints: [
      'Think recursively: if a node is p or q, it could be the LCA.',
      'If p and q are in different subtrees, that node is the LCA.',
      'Recursively search left and right. If both return non-null, current node is LCA. If one returns non-null, propagate upward.',
    ],
    starterCode: `import java.util.*;

/**
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
public class Solution {
    /**
     * Find the lowest common ancestor of two nodes.
     */
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', expectedOutput: '3' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', expectedOutput: '5' },
      { input: 'root = [1,2], p = 1, q = 2', expectedOutput: '1' },
    ],
  },
  {
    slug: 'serialize-deserialize-bt',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Design an algorithm to serialize and deserialize a binary tree.

- \`String serialize(TreeNode root)\` — Encodes a tree to a single string.
- \`TreeNode deserialize(String data)\` — Decodes encoded data back to the original tree.

There is no restriction on how the algorithm should work — just ensure that a tree can be serialized then deserialized back to the same structure.`,
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]', explanation: 'serialize then deserialize returns the same tree.' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['Number of nodes in range [0, 10^4].', '-1000 <= Node.val <= 1000'],
    hints: [
      'Think about what traversal order preserves enough info to reconstruct the tree.',
      'BFS or pre-order DFS with null markers both work.',
      'Use pre-order DFS: serialize each node value or "null" separated by commas. Deserialize by reading tokens in the same order using a queue.',
    ],
    starterCode: `import java.util.*;

/**
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
public class Codec {

    /**
     * Encodes a tree to a single string.
     */
    public String serialize(TreeNode root) {
        // Your code here
        return "";
    }

    /**
     * Decodes your encoded data to tree.
     */
    public TreeNode deserialize(String data) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'root = [1,2,3,null,null,4,5]', expectedOutput: '[1,2,3,null,null,4,5]' },
      { input: 'root = []', expectedOutput: '[]' },
      { input: 'root = [1]', expectedOutput: '[1]' },
    ],
  },
  {
    slug: 'max-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    category: 'Trees',
    categorySlug: 'trees',
    description: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear at most once. The path does not need to pass through the root.

The **path sum** is the sum of the node values in the path.

Given the \`root\` of a binary tree, return the maximum path sum of any **non-empty** path.`,
    examples: [
      { input: 'root = [1,2,3]', output: '6', explanation: 'Optimal path is 2 -> 1 -> 3 = 6.' },
      { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: 'Optimal path is 15 -> 20 -> 7 = 42.' },
    ],
    constraints: ['Number of nodes in range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],
    hints: [
      'For each node, the max path through it could use left, right, or both children.',
      'A node can be the "turning point" (both children) or pass upward (at most one child).',
      'Recursively compute max gain from each subtree. At each node, update global max with val + leftGain + rightGain. Return val + max(leftGain, rightGain) to parent.',
    ],
    starterCode: `import java.util.*;

/**
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 * }
 */
public class Solution {
    /**
     * Find the maximum path sum in a binary tree.
     */
    public int maxPathSum(TreeNode root) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'root = [1,2,3]', expectedOutput: '6' },
      { input: 'root = [-10,9,20,null,null,15,7]', expectedOutput: '42' },
      { input: 'root = [-3]', expectedOutput: '-3' },
      { input: 'root = [2,-1]', expectedOutput: '2' },
    ],
  },
  {
    slug: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'Heaps',
    categorySlug: 'heaps',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the k-th largest element in the array. Note that it is the k-th largest in **sorted order**, not the k-th distinct element. Can you solve it without sorting?`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: 'Sorted: [1,2,3,4,5,6]. 2nd largest is 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Sorting works but is O(n log n). Can you do better?',
      'Consider using a min-heap of size k, or Quickselect.',
      'Use a min-heap of size k: add elements; if heap size > k, poll smallest. Top of heap is the k-th largest. Or use Quickselect for average O(n).',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the k-th largest element in an unsorted array.
     */
    public int findKthLargest(int[] nums, int k) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', expectedOutput: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', expectedOutput: '4' },
      { input: 'nums = [1], k = 1', expectedOutput: '1' },
      { input: 'nums = [7,6,5,4,3,2,1], k = 5', expectedOutput: '3' },
    ],
  },
  {
    slug: 'merge-k-sorted-lists',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    category: 'Heaps',
    categorySlug: 'heaps',
    description: `You are given an array of \`k\` linked lists \`lists\`, each sorted in ascending order. Merge all lists into one sorted linked list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
      { input: 'lists = [[]]', output: '[]' },
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'Each list is sorted ascending.', 'Sum of all list lengths <= 10^4.'],
    hints: [
      'You could merge lists two at a time, but a heap is more efficient.',
      'Use a min-heap to always pick the smallest element across all lists.',
      'Add the head of each list to a min-heap. Repeatedly extract the minimum, add it to result, and push that node\'s next into the heap.',
    ],
    starterCode: `import java.util.*;

/**
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
public class Solution {
    /**
     * Merge k sorted linked lists into one sorted list.
     */
    public ListNode mergeKLists(ListNode[] lists) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', expectedOutput: '[]' },
      { input: 'lists = [[]]', expectedOutput: '[]' },
      { input: 'lists = [[1],[2],[3]]', expectedOutput: '[1,2,3]' },
    ],
  },
  {
    slug: 'find-median-data-stream',
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    category: 'Heaps',
    categorySlug: 'heaps',
    description: `The **median** is the middle value in an ordered integer list. If the list size is even, the median is the average of the two middle values.

Implement the \`MedianFinder\` class:

- \`MedianFinder()\` — Initializes the object.
- \`void addNum(int num)\` — Adds the integer num from the data stream.
- \`double findMedian()\` — Returns the median of all elements so far.`,
    examples: [
      { input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', output: '[null,null,null,1.5,null,2.0]', explanation: 'After 1,2: median=(1+2)/2=1.5. After 1,2,3: median=2.' },
    ],
    constraints: ['-10^5 <= num <= 10^5', 'At least one element before calling findMedian.', 'At most 5 * 10^4 calls to addNum and findMedian.'],
    hints: [
      'Sorting after each insertion is expensive. Can you maintain order more efficiently?',
      'Split the data into a lower half and an upper half.',
      'Use a max-heap for the lower half and a min-heap for the upper half. Balance so they differ by at most 1. Median is from the top(s) of the heaps.',
    ],
    starterCode: `import java.util.*;

public class MedianFinder {

    public MedianFinder() {
        // Your code here
    }

    public void addNum(int num) {
        // Your code here
    }

    public double findMedian() {
        // Your code here
        return 0.0;
    }
}`,
    testCases: [
      { input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', expectedOutput: '[null,null,null,1.5,null,2.0]' },
      { input: '["MedianFinder","addNum","findMedian"]\n[[],[5],[]]', expectedOutput: '[null,null,5.0]' },
      { input: '["MedianFinder","addNum","addNum","addNum","addNum","findMedian"]\n[[],[1],[2],[3],[4],[]]', expectedOutput: '[null,null,null,null,null,2.5]' },
    ],
  },
  {
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'Heaps',
    categorySlug: 'heaps',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` most frequent elements. You may return the answer in **any order**.`,
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: '1 appears 3 times, 2 appears 2 times.' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in [1, number of unique elements].', 'Answer is unique.'],
    hints: [
      'First count frequencies using a HashMap.',
      'Use a heap or bucket sort to find top k.',
      'Count frequencies with HashMap. Use a min-heap of size k keyed by frequency. Or use bucket sort where bucket index = frequency.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the k most frequent elements.
     */
    public int[] topKFrequent(int[] nums, int k) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', expectedOutput: '[1,2]' },
      { input: 'nums = [1], k = 1', expectedOutput: '[1]' },
      { input: 'nums = [4,4,4,1,1,2,2,2,3], k = 2', expectedOutput: '[4,2]' },
      { input: 'nums = [1,2], k = 2', expectedOutput: '[1,2]' },
    ],
  },
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'HashMaps',
    categorySlug: 'hashmaps',
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in any order.

An anagram is a word formed by rearranging the letters of another word, using all original letters exactly once.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    hints: [
      'Two strings are anagrams if they have the same character counts.',
      'What key can you use to group anagrams?',
      'Sort each string as a canonical key, group by key using a HashMap. Or use character frequency array as key.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Group anagrams from the input array.
     */
    public List<List<String>> groupAnagrams(String[] strs) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', expectedOutput: '[[""]]' },
      { input: 'strs = ["a"]', expectedOutput: '[["a"]]' },
      { input: 'strs = ["abc","bca","cab","xyz","zyx"]', expectedOutput: '[["abc","bca","cab"],["xyz","zyx"]]' },
    ],
  },
  {
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    category: 'HashMaps',
    categorySlug: 'hashmaps',
    description: `Given an array of integers \`nums\` and an integer \`k\`, return the total number of subarrays whose sum equals \`k\`.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: 'nums = [1,1,1], k = 2', output: '2', explanation: 'Subarrays [1,1] at indices 0-1 and 1-2.' },
      { input: 'nums = [1,2,3], k = 3', output: '2', explanation: 'Subarrays [1,2] and [3].' },
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    hints: [
      'Brute force checks every subarray — O(n^2). Can prefix sums help?',
      'If prefixSum[j] - prefixSum[i] == k, the subarray from i to j sums to k.',
      'Use a HashMap counting prefix sums. For each index, check how many times (prefixSum - k) appeared before.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Count the number of subarrays that sum to k.
     */
    public int subarraySum(int[] nums, int k) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [1,1,1], k = 2', expectedOutput: '2' },
      { input: 'nums = [1,2,3], k = 3', expectedOutput: '2' },
      { input: 'nums = [1], k = 0', expectedOutput: '0' },
      { input: 'nums = [0,0,0,0], k = 0', expectedOutput: '10' },
      { input: 'nums = [-1,-1,1], k = 0', expectedOutput: '1' },
    ],
  },
  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    category: 'HashMaps',
    categorySlug: 'hashmaps',
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in **O(n)** time.`,
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'Longest consecutive sequence is [1,2,3,4]. Length is 4.' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9', explanation: 'Sequence [0..8]. Length 9.' },
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Sorting gives O(n log n). How to do O(n)?',
      'Put all numbers in a HashSet. For each number, check if it starts a sequence.',
      'For each n, if (n-1) is NOT in the set, n starts a sequence. Count consecutive numbers from n. Track max.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the length of the longest consecutive elements sequence.
     */
    public int longestConsecutive(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [100,4,200,1,3,2]', expectedOutput: '4' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', expectedOutput: '9' },
      { input: 'nums = []', expectedOutput: '0' },
      { input: 'nums = [1,2,0,1]', expectedOutput: '3' },
    ],
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `Given an \`m x n\` 2D binary grid which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. All four edges of the grid are surrounded by water.`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', "grid[i][j] is '0' or '1'."],
    hints: [
      'Think of this as a graph where land cells connect to 4 neighbors.',
      'When you find an unvisited land cell, explore the entire island with DFS/BFS.',
      'Iterate grid. On finding a \'1\', increment count and DFS/BFS to mark all connected \'1\'s as \'0\'.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Count the number of islands in a 2D grid.
     */
    public int numIslands(char[][] grid) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
      { input: 'grid = [["0","0","0"],["0","0","0"]]', expectedOutput: '0' },
      { input: 'grid = [["1"]]', expectedOutput: '1' },
    ],
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `There are \`numCourses\` courses labeled \`0\` to \`numCourses - 1\`. You are given \`prerequisites\` where \`prerequisites[i] = [a_i, b_i]\` means you must take course \`b_i\` before \`a_i\`.

Return \`true\` if you can finish all courses, otherwise \`false\`.`,
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take 0, then 1.' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Cycle exists.' },
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', '0 <= a_i, b_i < numCourses', 'All pairs are unique.'],
    hints: [
      'This is a cycle detection problem in a directed graph.',
      'Model courses as nodes and prerequisites as directed edges.',
      'Use topological sort (BFS with in-degree, or DFS with cycle detection). If all nodes processed, no cycle.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Determine if all courses can be finished given prerequisites.
     */
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', expectedOutput: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', expectedOutput: 'false' },
      { input: 'numCourses = 3, prerequisites = [[1,0],[2,1]]', expectedOutput: 'true' },
      { input: 'numCourses = 1, prerequisites = []', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `A **transformation sequence** from \`beginWord\` to \`endWord\` using \`wordList\` is a sequence where:

- Every adjacent pair differs by a single letter.
- Every intermediate word is in \`wordList\`.
- The last word is \`endWord\`.

Return the **number of words** in the shortest transformation sequence, or \`0\` if none exists. \`beginWord\` does not need to be in \`wordList\`.`,
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit" -> "hot" -> "dot" -> "dog" -> "cog" = 5 words.' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0', explanation: '"cog" not in wordList.' },
    ],
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'All words same length, lowercase letters.', 'All words in wordList are unique.'],
    hints: [
      'Model as a graph where words differing by one letter are connected.',
      'Use BFS from beginWord for shortest path.',
      'BFS: for each word, try all one-letter variations. Check if they exist in word set. Track visited. Return depth when endWord found.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the shortest transformation sequence length.
     */
    public int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', expectedOutput: '0' },
      { input: 'beginWord = "a", endWord = "c", wordList = ["a","b","c"]', expectedOutput: '2' },
    ],
  },
  {
    slug: 'network-delay-time',
    title: 'Network Delay Time',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `You have a network of \`n\` nodes labeled \`1\` to \`n\`. Given \`times[i] = (u, v, w)\` meaning a signal takes \`w\` time from node \`u\` to \`v\`.

Send a signal from node \`k\`. Return the **minimum time** for all \`n\` nodes to receive the signal, or \`-1\` if impossible.`,
    examples: [
      { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2', explanation: 'From node 2: reach 1 in 1, 3 in 1, 4 in 2. Max = 2.' },
      { input: 'times = [[1,2,1]], n = 2, k = 1', output: '1' },
      { input: 'times = [[1,2,1]], n = 2, k = 2', output: '-1', explanation: 'Node 1 unreachable from node 2.' },
    ],
    constraints: ['1 <= k <= n <= 100', '1 <= times.length <= 6000', '0 <= w_i <= 100', 'All (u_i, v_i) pairs unique.'],
    hints: [
      'Single source shortest path problem.',
      "Dijkstra's algorithm is perfect for this.",
      'Build adjacency list. Run Dijkstra from k with min-heap. Answer is max shortest distance. If any node unreachable, return -1.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find minimum time for all nodes to receive signal from node k.
     */
    public int networkDelayTime(int[][] times, int n, int k) {
        // Your code here
        return -1;
    }
}`,
    testCases: [
      { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', expectedOutput: '2' },
      { input: 'times = [[1,2,1]], n = 2, k = 1', expectedOutput: '1' },
      { input: 'times = [[1,2,1]], n = 2, k = 2', expectedOutput: '-1' },
      { input: 'times = [[1,2,1],[2,3,2],[1,3,4]], n = 3, k = 1', expectedOutput: '3' },
    ],
  },
  {
    slug: 'clone-graph',
    title: 'Clone Graph',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `Given a reference of a node in a **connected** undirected graph, return a **deep copy** (clone) of the graph.

Each node has a value (\`int\`) and a list of neighbors (\`List<Node>\`). The given node will always be the first node (val = 1).`,
    examples: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
      { input: 'adjList = [[]]', output: '[[]]', explanation: 'Single node, no neighbors.' },
      { input: 'adjList = []', output: '[]' },
    ],
    constraints: ['Number of nodes in [0, 100].', '1 <= Node.val <= 100', 'Node.val is unique.', 'No repeated edges or self-loops.', 'Graph is connected.'],
    hints: [
      'How do you avoid cloning the same node twice?',
      'Use a HashMap to map original nodes to clones.',
      'DFS/BFS with HashMap<Node, Node>. Clone each node, recursively clone neighbors, link them.',
    ],
    starterCode: `import java.util.*;

/*
 * class Node {
 *     public int val;
 *     public List<Node> neighbors;
 *     public Node() { val = 0; neighbors = new ArrayList<>(); }
 *     public Node(int val) { this.val = val; neighbors = new ArrayList<>(); }
 * }
 */
public class Solution {
    /**
     * Clone an undirected graph.
     */
    public Node cloneGraph(Node node) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', expectedOutput: '[[2,4],[1,3],[2,4],[1,3]]' },
      { input: 'adjList = [[]]', expectedOutput: '[[]]' },
      { input: 'adjList = []', expectedOutput: '[]' },
    ],
  },
  {
    slug: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    category: 'Tries',
    categorySlug: 'tries',
    description: `A **trie** (prefix tree) efficiently stores and retrieves string keys.

Implement the Trie class:

- \`Trie()\` — Initializes the trie.
- \`void insert(String word)\` — Inserts \`word\` into the trie.
- \`boolean search(String word)\` — Returns \`true\` if \`word\` was inserted.
- \`boolean startsWith(String prefix)\` — Returns \`true\` if any inserted word has the given prefix.`,
    examples: [
      { input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', output: '[null,null,true,false,true,null,true]' },
    ],
    constraints: ['1 <= word.length, prefix.length <= 2000', 'Lowercase English letters only.', 'At most 3 * 10^4 total calls.'],
    hints: [
      'Each trie node represents a character with children for subsequent characters.',
      'Use children[26] or a HashMap at each node.',
      'Each TrieNode has children[26] and boolean isEnd. Insert: traverse/create nodes. Search: traverse, check isEnd. startsWith: traverse only.',
    ],
    starterCode: `import java.util.*;

public class Trie {

    public Trie() {
        // Your code here
    }

    public void insert(String word) {
        // Your code here
    }

    public boolean search(String word) {
        // Your code here
        return false;
    }

    public boolean startsWith(String prefix) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', expectedOutput: '[null,null,true,false,true,null,true]' },
      { input: '["Trie","insert","insert","search","search","startsWith"]\n[[],["hello"],["help"],["hell"],["help"],["hel"]]', expectedOutput: '[null,null,null,false,true,true]' },
      { input: '["Trie","search","insert","search"]\n[[],["a"],["a"],["a"]]', expectedOutput: '[null,false,null,true]' },
    ],
  },
  {
    slug: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'Hard',
    category: 'Tries',
    categorySlug: 'tries',
    description: `Given an \`m x n\` board of characters and a list of strings \`words\`, return all words on the board.

Each word must be constructed from letters of sequentially **adjacent** cells (horizontal or vertical neighbors). The same cell may not be used more than once in a word.`,
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]' },
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10', 'All strings in words are unique.'],
    hints: [
      'Searching each word independently is slow. Search all words simultaneously.',
      'Build a Trie from all words, then DFS on the board guided by the Trie.',
      'Insert all words into a Trie. For each cell, DFS following the Trie. Add complete words to results. Prune Trie branches to avoid duplicates.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find all words from the list that exist on the board.
     */
    public List<String> findWords(char[][] board, String[] words) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', expectedOutput: '["eat","oath"]' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', expectedOutput: '[]' },
      { input: 'board = [["a"]], words = ["a"]', expectedOutput: '["a"]' },
    ],
  },
  {
    slug: 'number-connected-components',
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    category: 'Union-Find',
    categorySlug: 'union-find',
    description: `You have \`n\` nodes labeled \`0\` to \`n-1\` and a list of undirected \`edges\`. Return the number of **connected components** in the graph.`,
    examples: [
      { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2', explanation: 'Components: {0,1,2} and {3,4}.' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' },
    ],
    constraints: ['1 <= n <= 2000', '1 <= edges.length <= 5000', 'edges[i].length == 2', '0 <= a_i, b_i < n', 'No repeated edges.'],
    hints: [
      'Classic connected components — use DFS, BFS, or Union-Find.',
      'With Union-Find, start with n components and merge on each edge.',
      'Initialize Union-Find with n elements. For each edge, union the two nodes. Final disjoint set count is the answer.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Count connected components in an undirected graph.
     */
    public int countComponents(int n, int[][] edges) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', expectedOutput: '2' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', expectedOutput: '1' },
      { input: 'n = 4, edges = [[0,1],[2,3]]', expectedOutput: '2' },
      { input: 'n = 1, edges = []', expectedOutput: '1' },
    ],
  },
  {
    slug: 'redundant-connection',
    title: 'Redundant Connection',
    difficulty: 'Medium',
    category: 'Union-Find',
    categorySlug: 'union-find',
    description: `A tree with \`n\` nodes (labeled \`1\` to \`n\`) has one additional edge added. Given the \`edges\` array, return an edge that can be removed so the resulting graph is a tree. If multiple answers exist, return the one that occurs **last** in the input.`,
    examples: [
      { input: 'edges = [[1,2],[1,3],[2,3]]', output: '[2,3]' },
      { input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
    ],
    constraints: ['n == edges.length', '3 <= n <= 1000', 'edges[i].length == 2', '1 <= a_i < b_i <= n', 'No repeated edges.', 'Graph is connected.'],
    hints: [
      'The redundant edge creates a cycle. How do you detect it?',
      'Process edges one by one. The first edge connecting two already-connected nodes is redundant.',
      'Use Union-Find. For each edge, if both nodes are in the same set, this is the redundant edge. Otherwise, union them.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the redundant edge that creates a cycle.
     */
    public int[] findRedundantConnection(int[][] edges) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'edges = [[1,2],[1,3],[2,3]]', expectedOutput: '[2,3]' },
      { input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', expectedOutput: '[1,4]' },
      { input: 'edges = [[1,2],[2,3],[1,3]]', expectedOutput: '[1,3]' },
    ],
  },
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given an integer array \`nums\`, return the length of the longest **strictly increasing** subsequence.

A subsequence is derived by deleting some (or no) elements without changing the order of the remaining elements.`,
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'LIS is [2,3,7,101] or [2,5,7,101], length 4.' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      { input: 'nums = [7,7,7,7,7,7,7]', output: '1' },
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Define dp[i] as the LIS length ending at index i.',
      'For each i, check all j < i where nums[j] < nums[i]: dp[i] = max(dp[j]) + 1.',
      'DP is O(n^2). For O(n log n), maintain a "tails" array and use binary search.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the length of the longest strictly increasing subsequence.
     */
    public int lengthOfLIS(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', expectedOutput: '4' },
      { input: 'nums = [0,1,0,3,2,3]', expectedOutput: '4' },
      { input: 'nums = [7,7,7,7,7,7,7]', expectedOutput: '1' },
      { input: 'nums = [1,3,6,7,9,4,10,5,6]', expectedOutput: '6' },
    ],
  },
  {
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given an integer array \`coins\` (denominations) and an integer \`amount\`, return the **fewest number of coins** needed to make up that amount. If impossible, return \`-1\`.

You have an infinite supply of each coin.`,
    examples: [
      { input: 'coins = [1,5,10], amount = 12', output: '3', explanation: '12 = 10 + 1 + 1.' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      'Greedy does not always work. This is an optimization problem.',
      'Define dp[i] = min coins for amount i.',
      'dp[0] = 0, dp[1..amount] = infinity. For each amount i, try every coin c: dp[i] = min(dp[i], dp[i-c] + 1). Return dp[amount].',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find fewest coins to make up the given amount.
     */
    public int coinChange(int[] coins, int amount) {
        // Your code here
        return -1;
    }
}`,
    testCases: [
      { input: 'coins = [1,5,10], amount = 12', expectedOutput: '3' },
      { input: 'coins = [2], amount = 3', expectedOutput: '-1' },
      { input: 'coins = [1], amount = 0', expectedOutput: '0' },
      { input: 'coins = [1,2,5], amount = 11', expectedOutput: '3' },
      { input: 'coins = [186,419,83,408], amount = 6249', expectedOutput: '20' },
    ],
  },
  {
    slug: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given two strings \`word1\` and \`word2\`, return the minimum number of operations to convert \`word1\` to \`word2\`.

Allowed operations: **Insert**, **Delete**, or **Replace** a character.`,
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse -> rose -> ros.' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5' },
    ],
    constraints: ['0 <= word1.length, word2.length <= 500', 'Lowercase English letters only.'],
    hints: [
      'Classic 2D DP problem.',
      'dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1].',
      'If chars match: dp[i][j] = dp[i-1][j-1]. Else: dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Compute minimum edit distance between two strings.
     */
    public int minDistance(String word1, String word2) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'word1 = "horse", word2 = "ros"', expectedOutput: '3' },
      { input: 'word1 = "intention", word2 = "execution"', expectedOutput: '5' },
      { input: 'word1 = "", word2 = "abc"', expectedOutput: '3' },
      { input: 'word1 = "abc", word2 = "abc"', expectedOutput: '0' },
    ],
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given a string \`s\`, return the **longest palindromic substring** in \`s\`.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also valid.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: ['1 <= s.length <= 1000', 's consists of digits and English letters.'],
    hints: [
      'Brute force O(n^3) checks all substrings. Can you do better?',
      'Expand around each center to find palindromes.',
      'For each index, expand outward for both odd-length (center=i) and even-length (center=i,i+1) palindromes. O(n^2) time, O(1) space.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the longest palindromic substring.
     */
    public String longestPalindrome(String s) {
        // Your code here
        return "";
    }
}`,
    testCases: [
      { input: 's = "babad"', expectedOutput: '"bab"' },
      { input: 's = "cbbd"', expectedOutput: '"bb"' },
      { input: 's = "a"', expectedOutput: '"a"' },
      { input: 's = "racecar"', expectedOutput: '"racecar"' },
    ],
  },
  {
    slug: 'knapsack-problem',
    title: '0/1 Knapsack Problem',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given \`n\` items each with a weight and value, and a knapsack with capacity \`W\`, determine the **maximum total value** you can carry. Each item can be taken or not (0/1), and each used at most once.`,
    examples: [
      { input: 'weights = [1,3,4,5], values = [1,4,5,7], W = 7', output: '9', explanation: 'Take items with weights 3,4 (values 4+5=9).' },
      { input: 'weights = [2,3,4,5], values = [3,4,5,6], W = 5', output: '7', explanation: 'Take items with weights 2,3 (values 3+4=7).' },
    ],
    constraints: ['1 <= n <= 1000', '1 <= weights[i], values[i] <= 1000', '1 <= W <= 1000'],
    hints: [
      'Classic DP: for each item, choose to include or exclude.',
      'dp[i][w] = max value using items 0..i-1 with capacity w.',
      'dp[i][w] = max(dp[i-1][w], dp[i-1][w-w_i] + v_i). Optimize to 1D by iterating w from W down to w_i.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Solve the 0/1 knapsack problem.
     */
    public int knapsack(int[] weights, int[] values, int W) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'weights = [1,3,4,5], values = [1,4,5,7], W = 7', expectedOutput: '9' },
      { input: 'weights = [2,3,4,5], values = [3,4,5,6], W = 5', expectedOutput: '7' },
      { input: 'weights = [10], values = [100], W = 5', expectedOutput: '0' },
      { input: 'weights = [1,2,3], values = [6,10,12], W = 5', expectedOutput: '22' },
    ],
  },
  {
    slug: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `You are a robber planning to rob houses along a street. Each house has money stashed. Adjacent houses have connected security — **robbing two adjacent houses triggers the alarm**.

Given an array \`nums\` representing money at each house, return the maximum amount you can rob **without alerting the police**.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 0 (1) + house 2 (3) = 4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob house 0 (2) + house 2 (9) + house 4 (1) = 12.' },
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    hints: [
      'For each house: rob it (skip previous) or skip it.',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
      'Only need two variables instead of a full DP array.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find maximum money robbable without robbing adjacent houses.
     */
    public int rob(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3,1]', expectedOutput: '4' },
      { input: 'nums = [2,7,9,3,1]', expectedOutput: '12' },
      { input: 'nums = [0]', expectedOutput: '0' },
      { input: 'nums = [100]', expectedOutput: '100' },
      { input: 'nums = [2,1,1,2]', expectedOutput: '4' },
    ],
  },
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    category: 'Sliding Window',
    categorySlug: 'sliding-window',
    description: `Given two strings \`s\` and \`t\`, return the **minimum window substring** of \`s\` such that every character in \`t\` (including duplicates) is included in the window.

If no such substring exists, return \`""\`. The answer is guaranteed to be **unique**.`,
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: '"BANC" is the smallest window containing A, B, and C.' },
      { input: 's = "a", t = "a"', output: '"a"' },
      { input: 's = "a", t = "aa"', output: '""', explanation: 's has only one a but t needs two.' },
    ],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    hints: [
      'Sliding window with two pointers. Expand right until all of t is covered.',
      'Once covered, shrink from left to find minimum window.',
      'Use frequency map for t. Expand right to include chars. When all of t is covered, shrink left while maintaining coverage. Track minimum.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find minimum window in s containing all characters of t.
     */
    public String minWindow(String s, String t) {
        // Your code here
        return "";
    }
}`,
    testCases: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', expectedOutput: '"BANC"' },
      { input: 's = "a", t = "a"', expectedOutput: '"a"' },
      { input: 's = "a", t = "aa"', expectedOutput: '""' },
      { input: 's = "ab", t = "b"', expectedOutput: '"b"' },
    ],
  },
  {
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    category: 'Sliding Window',
    categorySlug: 'sliding-window',
    description: `You are given an array of integers \`nums\` and a sliding window of size \`k\` moving from left to right. You can only see the \`k\` numbers in the window. Each time the window moves right by one position.

Return an array of the **maximum value** in each window position.`,
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Windows: [1,3,-1]=3, [3,-1,-3]=3, [-1,-3,5]=5, [-3,5,3]=5, [5,3,6]=6, [3,6,7]=7.' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    hints: [
      'Brute force scans k elements per window — O(nk). Can you do O(n)?',
      'Use a deque (double-ended queue) to maintain useful elements.',
      'Monotonic decreasing deque of indices. Remove smaller from back before adding. Remove front if outside window. Front is always the max.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the maximum value in each sliding window of size k.
     */
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', expectedOutput: '[3,3,5,5,6,7]' },
      { input: 'nums = [1], k = 1', expectedOutput: '[1]' },
      { input: 'nums = [1,-1], k = 1', expectedOutput: '[1,-1]' },
      { input: 'nums = [9,11], k = 2', expectedOutput: '[11]' },
      { input: 'nums = [4,-2], k = 2', expectedOutput: '[4]' },
    ],
  },
  // ===================== NEW PROBLEMS (46-73) =====================
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given a sorted array of integers \`nums\` and a target value \`target\`, return the index of \`target\` if it is found. If not, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    hints: [
      'Compare the target with the middle element of the array.',
      'If the target is less than the middle element, search the left half; if greater, search the right half.',
      'Use two pointers (left, right) and repeatedly halve the search space until you find the target or the pointers cross.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Search for target in sorted array nums.
     * Return its index or -1 if not found.
     */
    public int search(int[] nums, int target) {
        // Your code here
        return -1;
    }
}`,
    testCases: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', expectedOutput: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', expectedOutput: '-1' },
      { input: 'nums = [5], target = 5', expectedOutput: '0' },
      { input: 'nums = [2,5], target = 5', expectedOutput: '1' },
    ],
  },
  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A **subarray** is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The subarray [5,4,-1,7,8] has the largest sum 23.' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Think about when it makes sense to extend the current subarray vs. start a new one.',
      'If the running sum becomes negative, it is better to start fresh from the next element.',
      'Use Kadane\'s algorithm: maintain a current sum and a global max. At each step, currentSum = max(nums[i], currentSum + nums[i]).',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the contiguous subarray with the largest sum.
     */
    public int maxSubArray(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: 'nums = [1]', expectedOutput: '1' },
      { input: 'nums = [5,4,-1,7,8]', expectedOutput: '23' },
      { input: 'nums = [-1]', expectedOutput: '-1' },
    ],
  },
  {
    slug: 'rotate-array',
    title: 'Rotate Array',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an integer array \`nums\`, rotate the array to the right by \`k\` steps, where \`k\` is non-negative.

Return the rotated array. Try to come up with as many solutions as you can — there are at least **three** different ways to solve this problem. Could you do it in-place with \`O(1)\` extra space?`,
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotate right 1 step: [7,1,2,3,4,5,6]. Rotate right 2 steps: [6,7,1,2,3,4,5]. Rotate right 3 steps: [5,6,7,1,2,3,4].' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]', explanation: 'Rotate right 1 step: [99,-1,-100,3]. Rotate right 2 steps: [3,99,-1,-100].' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    hints: [
      'What happens if k is greater than the array length? Use k % nums.length.',
      'One approach: reverse the entire array, then reverse the first k elements, then reverse the rest.',
      'The three-reverse approach works in O(n) time and O(1) space.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Rotate array to the right by k steps.
     */
    public int[] rotate(int[] nums, int k) {
        // Your code here
        return nums;
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', expectedOutput: '[5,6,7,1,2,3,4]' },
      { input: 'nums = [-1,-100,3,99], k = 2', expectedOutput: '[3,99,-1,-100]' },
      { input: 'nums = [1,2], k = 3', expectedOutput: '[2,1]' },
      { input: 'nums = [1], k = 0', expectedOutput: '[1]' },
    ],
  },
  {
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an \`m x n\` matrix, return all elements of the matrix in **spiral order**.

Spiral order starts from the top-left corner and proceeds right across the top row, then down the right column, then left across the bottom row, then up the left column, and repeats inward.`,
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Traverse the matrix in spiral order starting from top-left.' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    hints: [
      'Maintain four boundaries: top, bottom, left, right. Process one layer at a time.',
      'After traversing each direction (right, down, left, up), shrink the corresponding boundary.',
      'Be careful with the termination condition — check boundaries after each direction to avoid duplicates.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return all elements of the matrix in spiral order.
     */
    public List<Integer> spiralOrder(int[][] matrix) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,6,9,8,7,4,5]' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expectedOutput: '[1,2,3,4,8,12,11,10,9,5,6,7]' },
      { input: 'matrix = [[1]]', expectedOutput: '[1]' },
      { input: 'matrix = [[1,2],[3,4]]', expectedOutput: '[1,2,4,3]' },
    ],
  },
  {
    slug: 'remove-nth-from-end',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Given the \`head\` of a linked list, remove the \`n\`th node from the **end** of the list and return its head.

Follow up: Could you do this in one pass?`,
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: 'The 2nd node from the end is 4. After removing it, the list becomes [1,2,3,5].' },
      { input: 'head = [1], n = 1', output: '[]', explanation: 'The only node is removed, resulting in an empty list.' },
      { input: 'head = [1,2], n = 1', output: '[1]' },
    ],
    constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    hints: [
      'Use two pointers separated by n nodes so that when the fast pointer reaches the end, the slow pointer is right before the target.',
      'Advance the fast pointer n steps first. Then move both pointers until fast reaches the end.',
      'Use a dummy head node to simplify edge cases where the head itself needs to be removed.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Definition for singly-linked list.
     */
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    /**
     * Remove the nth node from the end of the list.
     */
    public ListNode removeNthFromEnd(ListNode head, int n) {
        // Your code here
        return head;
    }
}`,
    testCases: [
      { input: 'head = [1,2,3,4,5], n = 2', expectedOutput: '[1,2,3,5]' },
      { input: 'head = [1], n = 1', expectedOutput: '[]' },
      { input: 'head = [1,2], n = 1', expectedOutput: '[1]' },
      { input: 'head = [1,2], n = 2', expectedOutput: '[2]' },
    ],
  },
  {
    slug: 'reorder-list',
    title: 'Reorder List',
    difficulty: 'Medium',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `You are given the head of a singly linked-list: L0 → L1 → … → Ln-1 → Ln.

Reorder the list to be: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …

You may not modify the values in the list's nodes. Only nodes themselves may be changed.`,
    examples: [
      { input: 'head = [1,2,3,4]', output: '[1,4,2,3]', explanation: 'The list is reordered by interleaving from front and back.' },
      { input: 'head = [1,2,3,4,5]', output: '[1,5,2,4,3]' },
    ],
    constraints: ['The number of nodes is in the range [1, 5 * 10^4].', '1 <= Node.val <= 1000'],
    hints: [
      'Break the problem into three steps: find the middle, reverse the second half, merge the two halves.',
      'Use the slow/fast pointer technique to find the middle of the linked list.',
      'After reversing the second half, merge the two lists by alternating nodes.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    static class ListNode {
        int val;
        ListNode next;
        ListNode(int val) { this.val = val; }
    }

    /**
     * Reorder list: L0→Ln→L1→Ln-1→L2→Ln-2→...
     */
    public void reorderList(ListNode head) {
        // Your code here
    }
}`,
    testCases: [
      { input: 'head = [1,2,3,4]', expectedOutput: '[1,4,2,3]' },
      { input: 'head = [1,2,3,4,5]', expectedOutput: '[1,5,2,4,3]' },
      { input: 'head = [1]', expectedOutput: '[1]' },
      { input: 'head = [1,2]', expectedOutput: '[1,2]' },
    ],
  },
  {
    slug: 'evaluate-reverse-polish',
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `You are given an array of strings \`tokens\` that represents an arithmetic expression in **Reverse Polish Notation** (postfix notation).

Evaluate the expression and return an integer that represents the value of the expression.

Note: Division between two integers should truncate toward zero. The given RPN expression is always valid.`,
    examples: [
      { input: 'tokens = ["2","1","+","3","*"]', output: '9', explanation: '((2 + 1) * 3) = 9' },
      { input: 'tokens = ["4","13","5","/","+"]', output: '6', explanation: '(4 + (13 / 5)) = 6' },
      { input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', output: '22' },
    ],
    constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is either an operator (+, -, *, /) or an integer in the range [-200, 200].'],
    hints: [
      'Use a stack. Push numbers onto it; when you see an operator, pop two numbers, compute the result, and push it back.',
      'Be careful about the order of operands for subtraction and division — the second popped element is the left operand.',
      'In Java, integer division naturally truncates toward zero, which is what we want.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Evaluate the expression in Reverse Polish Notation.
     */
    public int evalRPN(String[] tokens) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'tokens = ["2","1","+","3","*"]', expectedOutput: '9' },
      { input: 'tokens = ["4","13","5","/","+"]', expectedOutput: '6' },
      { input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', expectedOutput: '22' },
      { input: 'tokens = ["3"]', expectedOutput: '3' },
    ],
  },
  {
    slug: 'asteroid-collision',
    title: 'Asteroid Collision',
    difficulty: 'Medium',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `We are given an array \`asteroids\` of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive = moving right, negative = moving left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.`,
    examples: [
      { input: 'asteroids = [5,10,-5]', output: '[5,10]', explanation: 'The 10 and -5 collide; 10 survives. The 5 and 10 never collide.' },
      { input: 'asteroids = [8,-8]', output: '[]', explanation: 'The 8 and -8 collide and both are destroyed.' },
      { input: 'asteroids = [10,2,-5]', output: '[10]', explanation: 'The 2 and -5 collide; -5 survives. Then 10 and -5 collide; 10 survives.' },
    ],
    constraints: ['2 <= asteroids.length <= 10^4', '-1000 <= asteroids[i] <= 1000', 'asteroids[i] != 0'],
    hints: [
      'Use a stack to simulate the collisions. Push each asteroid and resolve collisions with the stack top.',
      'A collision only happens when the top of the stack is positive and the current asteroid is negative.',
      'Keep popping from the stack while there is a collision and the incoming asteroid is larger.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the state of asteroids after all collisions.
     */
    public int[] asteroidCollision(int[] asteroids) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'asteroids = [5,10,-5]', expectedOutput: '[5,10]' },
      { input: 'asteroids = [8,-8]', expectedOutput: '[]' },
      { input: 'asteroids = [10,2,-5]', expectedOutput: '[10]' },
      { input: 'asteroids = [-2,-1,1,2]', expectedOutput: '[-2,-1,1,2]' },
    ],
  },
  {
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, invert the tree (mirror it), and return its root.

Inverting a binary tree means swapping the left and right children of every node in the tree.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Every node\'s left and right children are swapped.' },
      { input: 'root = [2,1,3]', output: '[2,3,1]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    hints: [
      'Think recursively: to invert a tree, invert the left and right subtrees, then swap them.',
      'The base case is a null node — just return null.',
      'You can also solve this iteratively using a queue (BFS) and swapping children at each level.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    /**
     * Invert (mirror) the binary tree.
     */
    public TreeNode invertTree(TreeNode root) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'root = [4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' },
      { input: 'root = [2,1,3]', expectedOutput: '[2,3,1]' },
      { input: 'root = []', expectedOutput: '[]' },
      { input: 'root = [1]', expectedOutput: '[1]' },
    ],
  },
  {
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, return the length of the **diameter** of the tree.

The **diameter** of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the \`root\`. The length of a path between two nodes is represented by the number of **edges** between them.`,
    examples: [
      { input: 'root = [1,2,3,4,5]', output: '3', explanation: 'The longest path is [4,2,1,3] or [5,2,1,3], which has length 3.' },
      { input: 'root = [1,2]', output: '1' },
    ],
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-100 <= Node.val <= 100'],
    hints: [
      'The diameter through any node is the sum of the height of its left subtree and the height of its right subtree.',
      'Use a recursive function that returns the height of each subtree while updating a global maximum diameter.',
      'The height of a node is 1 + max(height of left child, height of right child). The diameter at each node is leftHeight + rightHeight.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    /**
     * Return the diameter (longest path length) of the binary tree.
     */
    public int diameterOfBinaryTree(TreeNode root) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'root = [1,2,3,4,5]', expectedOutput: '3' },
      { input: 'root = [1,2]', expectedOutput: '1' },
      { input: 'root = [1]', expectedOutput: '0' },
      { input: 'root = [1,2,3,null,null,4,5]', expectedOutput: '3' },
    ],
  },
  {
    slug: 'binary-tree-right-side-view',
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, imagine yourself standing on the **right side** of it. Return the values of the nodes you can see ordered from top to bottom.

In other words, return the last node at each level of the tree when traversing level by level.`,
    examples: [
      { input: 'root = [1,2,3,null,5,null,4]', output: '[1,3,4]', explanation: 'From the right side: level 0 shows 1, level 1 shows 3, level 2 shows 4.' },
      { input: 'root = [1,null,3]', output: '[1,3]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    hints: [
      'Use BFS (level-order traversal) and take the last element from each level.',
      'Alternatively, use DFS and visit the right subtree before the left. The first node seen at each depth is the rightmost.',
      'With BFS, use a queue and iterate through each level. The last node dequeued in each level is visible from the right.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    static class TreeNode {
        int val;
        TreeNode left, right;
        TreeNode(int val) { this.val = val; }
    }

    /**
     * Return values of nodes visible from the right side.
     */
    public List<Integer> rightSideView(TreeNode root) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'root = [1,2,3,null,5,null,4]', expectedOutput: '[1,3,4]' },
      { input: 'root = [1,null,3]', expectedOutput: '[1,3]' },
      { input: 'root = []', expectedOutput: '[]' },
      { input: 'root = [1,2,3,4]', expectedOutput: '[1,3,4]' },
    ],
  },
  {
    slug: 'task-scheduler',
    title: 'Task Scheduler',
    difficulty: 'Medium',
    category: 'Heaps',
    categorySlug: 'heaps',
    description: `You are given an array of CPU tasks, each represented by a character, and a cooling interval \`n\`. Each cycle allows completion of one task. There must be at least \`n\` intervals between two same tasks.

Return the minimum number of intervals the CPU will take to finish all the given tasks. You may complete tasks in any order.`,
    examples: [
      { input: 'tasks = ["A","A","A","B","B","B"], n = 2', output: '8', explanation: 'One possible sequence: A -> B -> idle -> A -> B -> idle -> A -> B. Total = 8.' },
      { input: 'tasks = ["A","C","A","B","D","B"], n = 1', output: '6', explanation: 'A -> B -> A -> C -> B -> D. No idle intervals needed.' },
      { input: 'tasks = ["A","A","A","B","B","B"], n = 0', output: '6', explanation: 'No cooldown required, so all 6 tasks execute consecutively.' },
    ],
    constraints: ['1 <= tasks.length <= 10^4', 'tasks[i] is an uppercase English letter.', '0 <= n <= 100'],
    hints: [
      'The task with the highest frequency dictates the minimum intervals. Think about filling slots around the most frequent task.',
      'Calculate the number of idle slots: (maxFreq - 1) * n. Then fill idle slots with other tasks.',
      'Use a greedy approach: the answer is max(tasks.length, (maxFreq - 1) * (n + 1) + countOfMaxFreqTasks).',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the minimum intervals to complete all tasks with cooldown n.
     */
    public int leastInterval(char[] tasks, int n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'tasks = ["A","A","A","B","B","B"], n = 2', expectedOutput: '8' },
      { input: 'tasks = ["A","C","A","B","D","B"], n = 1', expectedOutput: '6' },
      { input: 'tasks = ["A","A","A","B","B","B"], n = 0', expectedOutput: '6' },
      { input: 'tasks = ["A","A","A","A","A","A","B","C","D","E","F","G"], n = 1', expectedOutput: '12' },
    ],
  },
  {
    slug: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `You are given an \`m x n\` grid where each cell can have one of three values:
- \`0\` representing an empty cell,
- \`1\` representing a fresh orange,
- \`2\` representing a rotten orange.

Every minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.

Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return \`-1\`.`,
    examples: [
      { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explanation: 'It takes 4 minutes for all fresh oranges to rot via BFS from initial rotten oranges.' },
      { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explanation: 'The orange at (2,0) can never be reached.' },
      { input: 'grid = [[0,2]]', output: '0', explanation: 'No fresh oranges exist, so 0 minutes needed.' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2.'],
    hints: [
      'This is a multi-source BFS problem. Start BFS from all rotten oranges simultaneously.',
      'Add all initial rotten oranges to the queue. Each BFS layer represents one minute.',
      'After BFS completes, check if any fresh orange remains. If so, return -1.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return minutes until no fresh orange remains, or -1 if impossible.
     */
    public int orangesRotting(int[][] grid) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', expectedOutput: '4' },
      { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', expectedOutput: '-1' },
      { input: 'grid = [[0,2]]', expectedOutput: '0' },
      { input: 'grid = [[1]]', expectedOutput: '-1' },
    ],
  },
  {
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `There is an \`m x n\` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.

The island receives rain. Water can flow from a cell to an adjacent cell (up, down, left, right) if the adjacent cell's height is **less than or equal to** the current cell's height.

Return a 2D list of grid coordinates \`[r, c]\` where rain water can flow to **both** the Pacific and Atlantic ocean.`,
    examples: [
      { input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]', explanation: 'These cells can reach both the Pacific (top/left) and Atlantic (bottom/right) oceans.' },
      { input: 'heights = [[1]]', output: '[[0,0]]' },
    ],
    constraints: ['m == heights.length', 'n == heights[r].length', '1 <= m, n <= 200', '0 <= heights[r][c] <= 10^5'],
    hints: [
      'Instead of checking if each cell can reach both oceans, reverse the problem: start from each ocean and find which cells can be reached.',
      'Run BFS/DFS from all Pacific border cells and mark reachable cells. Do the same from Atlantic border cells.',
      'The answer is the intersection of cells reachable from both oceans.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return coordinates where water can flow to both oceans.
     */
    public List<List<Integer>> pacificAtlantic(int[][] heights) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', expectedOutput: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
      { input: 'heights = [[1]]', expectedOutput: '[[0,0]]' },
      { input: 'heights = [[1,1],[1,1]]', expectedOutput: '[[0,0],[0,1],[1,0],[1,1]]' },
    ],
  },
  {
    slug: 'graph-valid-tree',
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `You have a graph of \`n\` nodes labeled from \`0\` to \`n - 1\`. You are given the integer \`n\` and a list of \`edges\` where \`edges[i] = [a, b]\` indicates that there is an undirected edge between nodes \`a\` and \`b\`.

Determine if these edges make up a valid tree. A valid tree is a connected, acyclic undirected graph.`,
    examples: [
      { input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', output: 'true', explanation: 'The graph is connected and has n-1 = 4 edges with no cycle, so it is a valid tree.' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]', output: 'false', explanation: 'There is a cycle between nodes 1, 2, and 3.' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000', 'edges[i].length == 2', '0 <= a, b < n', 'a != b', 'There are no duplicate edges.'],
    hints: [
      'A valid tree with n nodes must have exactly n - 1 edges. If not, return false immediately.',
      'After confirming the edge count, check connectivity using BFS, DFS, or Union-Find.',
      'With Union-Find: for each edge, union the two nodes. If they are already in the same set, there is a cycle.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Determine if the undirected graph forms a valid tree.
     */
    public boolean validTree(int n, int[][] edges) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]', expectedOutput: 'true' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]', expectedOutput: 'false' },
      { input: 'n = 1, edges = []', expectedOutput: 'true' },
      { input: 'n = 4, edges = [[0,1],[2,3]]', expectedOutput: 'false' },
    ],
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb \`1\` or \`2\` steps.

In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: 'There are two ways: (1 step + 1 step) or (2 steps).' },
      { input: 'n = 3', output: '3', explanation: 'There are three ways: (1+1+1), (1+2), (2+1).' },
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      'This is similar to the Fibonacci sequence. The number of ways to reach step n depends on steps n-1 and n-2.',
      'Define dp[i] = number of ways to reach step i. Then dp[i] = dp[i-1] + dp[i-2].',
      'You only need the last two values, so you can optimize space to O(1).',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the number of distinct ways to climb n stairs.
     */
    public int climbStairs(int n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 2', expectedOutput: '2' },
      { input: 'n = 3', expectedOutput: '3' },
      { input: 'n = 1', expectedOutput: '1' },
      { input: 'n = 5', expectedOutput: '8' },
    ],
  },
  {
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given a string \`s\` and a dictionary of strings \`wordDict\`, return \`true\` if \`s\` can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.`,
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: '"leetcode" can be segmented as "leet code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explanation: '"applepenapple" can be segmented as "apple pen apple". Note that "apple" is reused.' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20', 's and wordDict[i] consist of only lowercase English letters.', 'All strings in wordDict are unique.'],
    hints: [
      'Use dynamic programming. Define dp[i] = true if s[0..i-1] can be segmented.',
      'For each position i, check all positions j < i: if dp[j] is true and s[j..i] is in the dictionary, then dp[i] = true.',
      'Put the dictionary words into a HashSet for O(1) lookup.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return true if s can be segmented into dictionary words.
     */
    public boolean wordBreak(String s, List<String> wordDict) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', expectedOutput: 'true' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', expectedOutput: 'true' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', expectedOutput: 'false' },
      { input: 's = "a", wordDict = ["a"]', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `There is a robot on an \`m x n\` grid. The robot is initially located at the **top-left corner** (i.e., \`grid[0][0]\`). The robot tries to move to the **bottom-right corner** (i.e., \`grid[m-1][n-1]\`). The robot can only move either **down** or **right** at any point in time.

Given the two integers \`m\` and \`n\`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.`,
    examples: [
      { input: 'm = 3, n = 7', output: '28' },
      { input: 'm = 3, n = 2', output: '3', explanation: 'From the top-left, there are 3 ways: Right→Down→Down, Down→Down→Right, Down→Right→Down.' },
    ],
    constraints: ['1 <= m, n <= 100'],
    hints: [
      'The number of unique paths to any cell is the sum of paths from the cell above and the cell to the left.',
      'Define dp[i][j] = number of unique paths to reach cell (i, j). dp[i][j] = dp[i-1][j] + dp[i][j-1].',
      'The first row and first column each have only 1 path (all right or all down). You can optimize to a 1D DP array.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the number of unique paths from top-left to bottom-right.
     */
    public int uniquePaths(int m, int n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'm = 3, n = 7', expectedOutput: '28' },
      { input: 'm = 3, n = 2', expectedOutput: '3' },
      { input: 'm = 1, n = 1', expectedOutput: '1' },
      { input: 'm = 7, n = 3', expectedOutput: '28' },
    ],
  },
  {
    slug: 'decode-ways',
    title: 'Decode Ways',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `A message containing letters from \`A-Z\` can be encoded into numbers using the mapping: 'A' → "1", 'B' → "2", …, 'Z' → "26".

Given a string \`s\` containing only digits, return the **number of ways** to decode it. The test cases are generated so that the answer fits in a 32-bit integer.

Note that groupings like "06" are not valid (leading zeros are not allowed).`,
    examples: [
      { input: 's = "12"', output: '2', explanation: '"12" can be decoded as "AB" (1 2) or "L" (12).' },
      { input: 's = "226"', output: '3', explanation: '"226" can be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).' },
      { input: 's = "06"', output: '0', explanation: '"06" cannot be decoded because "0" has no mapping and leading zero is invalid.' },
    ],
    constraints: ['1 <= s.length <= 100', 's contains only digits and may contain leading zeros.'],
    hints: [
      'Use DP where dp[i] represents the number of ways to decode the first i characters.',
      'At each position, check if the single digit (s[i-1]) and the two-digit number (s[i-2..i-1]) form valid decodings.',
      'A single digit is valid if it is 1-9. A two-digit number is valid if it is 10-26.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the number of ways to decode the digit string.
     */
    public int numDecodings(String s) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 's = "12"', expectedOutput: '2' },
      { input: 's = "226"', expectedOutput: '3' },
      { input: 's = "06"', expectedOutput: '0' },
      { input: 's = "10"', expectedOutput: '1' },
    ],
  },
  {
    slug: 'permutation-in-string',
    title: 'Permutation in String',
    difficulty: 'Medium',
    category: 'Sliding Window',
    categorySlug: 'sliding-window',
    description: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\`, or \`false\` otherwise.

In other words, return \`true\` if one of \`s1\`'s permutations is a substring of \`s2\`.`,
    examples: [
      { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: 's2 contains "ba", which is a permutation of "ab".' },
      { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false', explanation: 'No permutation of "ab" exists as a contiguous substring of s2.' },
    ],
    constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters.'],
    hints: [
      'A permutation of s1 in s2 means a window of length s1.length in s2 has the exact same character frequencies as s1.',
      'Use a sliding window of size s1.length over s2 and compare character frequency maps.',
      'Instead of rebuilding the frequency map each time, add the new character entering the window and remove the one leaving.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return true if s2 contains a permutation of s1.
     */
    public boolean checkInclusion(String s1, String s2) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 's1 = "ab", s2 = "eidbaooo"', expectedOutput: 'true' },
      { input: 's1 = "ab", s2 = "eidboaoo"', expectedOutput: 'false' },
      { input: 's1 = "a", s2 = "a"', expectedOutput: 'true' },
      { input: 's1 = "abc", s2 = "bbbca"', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'max-consecutive-ones-iii',
    title: 'Max Consecutive Ones III',
    difficulty: 'Medium',
    category: 'Sliding Window',
    categorySlug: 'sliding-window',
    description: `Given a binary array \`nums\` and an integer \`k\`, return the maximum number of consecutive \`1\`'s in the array if you can flip at most \`k\` \`0\`'s.`,
    examples: [
      { input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', output: '6', explanation: 'Flip the 0s at indices 5 and 10. The longest subarray of 1s is [1,1,1,1,1,1] of length 6.' },
      { input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', output: '10' },
    ],
    constraints: ['1 <= nums.length <= 10^5', 'nums[i] is either 0 or 1.', '0 <= k <= nums.length'],
    hints: [
      'Use a sliding window approach. Expand the right boundary and shrink the left boundary when the number of 0s in the window exceeds k.',
      'Maintain a count of zeros in the current window. When zeros > k, move the left pointer right until zeros <= k.',
      'Track the maximum window size seen during the process.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return max consecutive 1s after flipping at most k zeros.
     */
    public int longestOnes(int[] nums, int k) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', expectedOutput: '6' },
      { input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', expectedOutput: '10' },
      { input: 'nums = [1,1,1], k = 0', expectedOutput: '3' },
      { input: 'nums = [0,0,0], k = 0', expectedOutput: '0' },
    ],
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    categorySlug: 'backtracking',
    description: `Given an integer array \`nums\` of **unique** elements, return all possible subsets (the power set).

The solution set **must not** contain duplicate subsets. Return the subsets in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: 'All 2^3 = 8 subsets of [1,2,3].' },
      { input: 'nums = [0]', output: '[[],[0]]' },
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All elements of nums are unique.'],
    hints: [
      'For each element, you have two choices: include it or exclude it. This gives 2^n subsets.',
      'Use backtracking: at each index, choose to include the current element and recurse, then exclude it and recurse.',
      'Alternatively, iterate from 0 to 2^n - 1 and use each number\'s binary representation to decide which elements to include.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return all possible subsets of the array.
     */
    public List<List<Integer>> subsets(int[] nums) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3]', expectedOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: 'nums = [0]', expectedOutput: '[[],[0]]' },
      { input: 'nums = [1,2]', expectedOutput: '[[],[1],[2],[1,2]]' },
    ],
  },
  {
    slug: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    category: 'Backtracking',
    categorySlug: 'backtracking',
    description: `Given an array \`nums\` of distinct integers, return all the possible permutations. You can return the answer in **any order**.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: 'All 3! = 6 permutations of [1,2,3].' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' },
      { input: 'nums = [1]', output: '[[1]]' },
    ],
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All integers of nums are unique.'],
    hints: [
      'Use backtracking. At each step, choose an unused element to add to the current permutation.',
      'Use a boolean visited array (or swap elements in place) to track which elements have been used.',
      'The base case is when the current permutation has the same length as nums — add a copy to the result.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return all possible permutations of the array.
     */
    public List<List<Integer>> permute(int[] nums) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3]', expectedOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]', expectedOutput: '[[0,1],[1,0]]' },
      { input: 'nums = [1]', expectedOutput: '[[1]]' },
    ],
  },
  {
    slug: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    category: 'Backtracking',
    categorySlug: 'backtracking',
    description: `Given an array of **distinct** integers \`candidates\` and a target integer \`target\`, return a list of all **unique combinations** of \`candidates\` where the chosen numbers sum to \`target\`. You may return the combinations in any order.

The **same** number may be chosen from \`candidates\` an **unlimited number of times**. Two combinations are unique if the frequency of at least one of the chosen numbers is different.`,
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]', explanation: '2 + 2 + 3 = 7 and 7 = 7 are the only two combinations.' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' },
      { input: 'candidates = [2], target = 1', output: '[]', explanation: 'No combination sums to 1.' },
    ],
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'All elements of candidates are distinct.', '1 <= target <= 40'],
    hints: [
      'Use backtracking. At each step, decide how many times to use the current candidate before moving to the next.',
      'To avoid duplicates, always iterate forward (never pick a candidate before the current index).',
      'Prune the search: if the remaining target becomes negative, stop exploring that branch.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return all unique combinations that sum to target.
     */
    public List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'candidates = [2,3,6,7], target = 7', expectedOutput: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', expectedOutput: '[[2,2,2,2],[2,3,3],[3,5]]' },
      { input: 'candidates = [2], target = 1', expectedOutput: '[]' },
      { input: 'candidates = [1], target = 3', expectedOutput: '[[1,1,1]]' },
    ],
  },
  {
    slug: 'search-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values). Prior to being passed to your function, \`nums\` is **rotated** at an unknown pivot index \`k\` such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\`.

Given the rotated array \`nums\` and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      { input: 'nums = [1], target = 0', output: '-1' },
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4', 'All values of nums are unique.', 'nums is a rotated sorted array.', '-10^4 <= target <= 10^4'],
    hints: [
      'Use binary search. At each step, one half of the array is always sorted.',
      'Determine which half is sorted by comparing nums[mid] with nums[left]. Then check if the target falls in the sorted half.',
      'If the target is in the sorted half, narrow the search to that half. Otherwise, search the other half.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Search for target in a rotated sorted array.
     */
    public int search(int[] nums, int target) {
        // Your code here
        return -1;
    }
}`,
    testCases: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', expectedOutput: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', expectedOutput: '-1' },
      { input: 'nums = [1], target = 0', expectedOutput: '-1' },
      { input: 'nums = [3,1], target = 1', expectedOutput: '1' },
    ],
  },
  {
    slug: 'find-minimum-rotated-sorted-array',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times. For example, the array \`[0,1,2,4,5,6,7]\` might become \`[4,5,6,7,0,1,2]\`.

Given the sorted rotated array \`nums\` of **unique** elements, return the minimum element of this array.

You must write an algorithm that runs in \`O(log n)\` time.`,
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1', explanation: 'The original sorted array [1,2,3,4,5] was rotated 3 times.' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
      { input: 'nums = [11,13,15,17]', output: '11', explanation: 'The array was not rotated (or rotated n times).' },
    ],
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All integers of nums are unique.', 'nums is sorted and rotated between 1 and n times.'],
    hints: [
      'Use binary search. The minimum element is the only element smaller than its predecessor.',
      'Compare nums[mid] with nums[right]. If nums[mid] > nums[right], the minimum is in the right half.',
      'If nums[mid] <= nums[right], the minimum is in the left half (including mid).',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the minimum element in a rotated sorted array.
     */
    public int findMin(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [3,4,5,1,2]', expectedOutput: '1' },
      { input: 'nums = [4,5,6,7,0,1,2]', expectedOutput: '0' },
      { input: 'nums = [11,13,15,17]', expectedOutput: '11' },
      { input: 'nums = [2,1]', expectedOutput: '1' },
    ],
  },
  {
    slug: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given a **non-empty** array of integers \`nums\`, every element appears **twice** except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4', explanation: '4 appears only once while all other numbers appear twice.' },
      { input: 'nums = [1]', output: '1' },
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element appears exactly twice except for one element which appears exactly once.'],
    hints: [
      'Think about a bitwise operation that cancels out pairs of identical numbers.',
      'XOR has the property: a ^ a = 0 and a ^ 0 = a.',
      'XOR all elements together. Pairs cancel out, leaving only the single number.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the element that appears only once.
     */
    public int singleNumber(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [2,2,1]', expectedOutput: '1' },
      { input: 'nums = [4,1,2,1,2]', expectedOutput: '4' },
      { input: 'nums = [1]', expectedOutput: '1' },
      { input: 'nums = [-1,1,1]', expectedOutput: '-1' },
    ],
  },
  {
    slug: 'time-based-key-value-store',
    title: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Design a time-based key-value data structure that can store multiple values for the same key at different timestamps and retrieve the key's value at a certain timestamp.

Implement the \`TimeMap\` class:
- \`TimeMap()\` — Initializes the object.
- \`void set(String key, String value, int timestamp)\` — Stores the key \`key\` with the value \`value\` at the given time \`timestamp\`.
- \`String get(String key, int timestamp)\` — Returns the value associated with \`key\` where the stored timestamp is the **largest timestamp less than or equal to** the given \`timestamp\`. If there are no applicable values, return \`""\`.`,
    examples: [
      { input: '["set","set","get","get"]\n[["foo","bar",1],["foo","bar2",4],["foo",1],["foo",3]]', output: '["bar","bar"]', explanation: 'get("foo", 1) returns "bar". get("foo", 3) returns "bar" since the largest timestamp <= 3 is 1.' },
      { input: '["set","get","get"]\n[["foo","bar",1],["foo",1],["foo",2]]', output: '["bar","bar"]', explanation: 'get("foo", 1) returns "bar". get("foo", 2) also returns "bar" because timestamp 1 <= 2.' },
    ],
    constraints: ['1 <= key.length, value.length <= 100', 'key and value consist of lowercase English letters and digits.', '1 <= timestamp <= 10^7', 'All timestamps of set are strictly increasing for a given key.', 'At most 2 * 10^5 calls to set and get.'],
    hints: [
      'For each key, store a list of (timestamp, value) pairs. Since timestamps are strictly increasing, the list is already sorted.',
      'For the get operation, use binary search on the list of timestamps to find the largest one <= the given timestamp.',
      'In Java, you can use TreeMap or a custom binary search on an ArrayList.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Implement a time-based key-value store.
     */
    private Map<String, List<int[]>> map;
    private Map<String, List<String>> valMap;

    public Solution() {
        // Your code here
    }

    public void set(String key, String value, int timestamp) {
        // Your code here
    }

    public String get(String key, int timestamp) {
        // Your code here
        return "";
    }
}`,
    testCases: [
      { input: '["set","set","get","get"]\n[["foo","bar",1],["foo","bar2",4],["foo",1],["foo",3]]', expectedOutput: '["bar","bar"]' },
      { input: '["set","get","get"]\n[["foo","bar",1],["foo",1],["foo",2]]', expectedOutput: '["bar","bar"]' },
      { input: '["set","set","get"]\n[["a","v1",1],["a","v2",2],["a",3]]', expectedOutput: '["v2"]' },
    ],
  },

  // =====================================================================
  // Bit Manipulation (4 problems)
  // =====================================================================
  {
    slug: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    categorySlug: 'bit-manipulation',
    description: `Write a function that takes the binary representation of a positive integer and returns the number of set bits (1 bits) it has. This is also known as the **Hamming weight**.

For example, the integer 11 has binary representation \`1011\`, so the function should return 3.

This is a fundamental bit manipulation technique used in many areas including error detection, cryptography, and optimization problems.`,
    examples: [
      { input: 'n = 11', output: '3', explanation: 'The binary representation of 11 is 1011, which has three 1 bits.' },
      { input: 'n = 128', output: '1', explanation: 'The binary representation of 128 is 10000000, which has one 1 bit.' },
      { input: 'n = 2147483645', output: '30', explanation: 'The binary representation has 30 set bits.' },
    ],
    constraints: ['1 <= n <= 2^31 - 1'],
    hints: [
      'You can check the last bit using n & 1, then shift right.',
      'Think about what n & (n - 1) does — it removes the lowest set bit.',
      'Use the Brian Kernighan trick: repeatedly do n = n & (n - 1) and count iterations until n becomes 0.',
    ],
    starterCode: `public class Solution {
    /**
     * Return the number of 1 bits in the binary representation of n.
     */
    public int hammingWeight(int n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 11', expectedOutput: '3' },
      { input: 'n = 128', expectedOutput: '1' },
      { input: 'n = 2147483645', expectedOutput: '30' },
      { input: 'n = 1', expectedOutput: '1' },
    ],
  },
  {
    slug: 'counting-bits',
    title: 'Counting Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    categorySlug: 'bit-manipulation',
    description: `Given an integer \`n\`, return an array \`ans\` of length \`n + 1\` such that for each \`i\` (0 <= i <= n), \`ans[i]\` is the **number of 1 bits** in the binary representation of \`i\`.

Try to solve it in O(n) time using dynamic programming on bit patterns rather than counting bits individually for each number.

This problem combines bit manipulation with dynamic programming for an elegant solution.`,
    examples: [
      { input: 'n = 2', output: '[0,1,1]', explanation: '0 -> 0 (zero 1s), 1 -> 1 (one 1), 2 -> 10 (one 1).' },
      { input: 'n = 5', output: '[0,1,1,2,1,2]', explanation: '0->0, 1->1, 2->1, 3->2, 4->1, 5->2.' },
    ],
    constraints: ['0 <= n <= 10^5'],
    hints: [
      'You could count bits for each number independently, but can you reuse previous results?',
      'Observe that the number of 1 bits of i is related to i >> 1 (right shift by 1).',
      'Use the recurrence: ans[i] = ans[i >> 1] + (i & 1). The right shift removes the last bit, and (i & 1) tells you if the last bit was 1.',
    ],
    starterCode: `public class Solution {
    /**
     * Return an array where ans[i] is the number of 1 bits in i,
     * for each i from 0 to n.
     */
    public int[] countBits(int n) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'n = 2', expectedOutput: '[0,1,1]' },
      { input: 'n = 5', expectedOutput: '[0,1,1,2,1,2]' },
      { input: 'n = 0', expectedOutput: '[0]' },
      { input: 'n = 8', expectedOutput: '[0,1,1,2,1,2,2,3,1]' },
    ],
  },
  {
    slug: 'reverse-bits',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    categorySlug: 'bit-manipulation',
    description: `Reverse the bits of a given 32-bit unsigned integer.

For example, the input integer \`43261596\` has binary representation \`00000010100101000001111010011100\`. Reversing the bits gives \`00111001011110000010100101000000\`, which is \`964176192\`.

Note that the integer is treated as an unsigned 32-bit value, so all 32 bits must be reversed including leading zeros.`,
    examples: [
      { input: 'n = 43261596', output: '964176192', explanation: 'Binary: 00000010100101000001111010011100 reversed is 00111001011110000010100101000000 = 964176192.' },
      { input: 'n = 4294967293', output: '3221225471', explanation: 'Binary: 11111111111111111111111111111101 reversed is 10111111111111111111111111111111 = 3221225471.' },
    ],
    constraints: ['The input is a 32-bit unsigned integer.'],
    hints: [
      'Process one bit at a time — extract the last bit, place it in the reversed position.',
      'Shift the result left by 1 each step, and OR in the last bit of n, then shift n right.',
      'Loop 32 times: result = (result << 1) | (n & 1), then n >>= 1. Use unsigned shift (>>>) in Java.',
    ],
    starterCode: `public class Solution {
    /**
     * Reverse the bits of a 32-bit unsigned integer.
     */
    public long reverseBits(long n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 43261596', expectedOutput: '964176192' },
      { input: 'n = 4294967293', expectedOutput: '3221225471' },
      { input: 'n = 0', expectedOutput: '0' },
    ],
  },
  {
    slug: 'missing-number',
    title: 'Missing Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    categorySlug: 'bit-manipulation',
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return the only number in the range that is missing from the array.

For example, if \`nums = [3, 0, 1]\`, the range is [0, 3] and the missing number is 2.

Can you implement a solution using O(1) extra space and O(n) runtime? Think about XOR properties or the sum formula.`,
    examples: [
      { input: 'nums = [3,0,1]', output: '2', explanation: 'n = 3 since there are 3 numbers, so all numbers are in [0,3]. 2 is missing.' },
      { input: 'nums = [0,1]', output: '2', explanation: 'n = 2, range is [0,2]. 2 is missing.' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8', explanation: 'n = 9, range is [0,9]. 8 is missing.' },
    ],
    constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All the numbers of nums are unique.'],
    hints: [
      'One approach: use the sum formula n*(n+1)/2 and subtract the array sum.',
      'Another approach: XOR all numbers from 0 to n, then XOR all elements of the array. The result is the missing number.',
      'XOR works because a ^ a = 0 and a ^ 0 = a, so all paired numbers cancel out leaving only the missing one.',
    ],
    starterCode: `public class Solution {
    /**
     * Find the missing number in the range [0, n].
     */
    public int missingNumber(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [3,0,1]', expectedOutput: '2' },
      { input: 'nums = [0,1]', expectedOutput: '2' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', expectedOutput: '8' },
      { input: 'nums = [0]', expectedOutput: '1' },
    ],
  },

  // =====================================================================
  // Math & Number Theory (3 problems)
  // =====================================================================
  {
    slug: 'power-of-two',
    title: 'Power of Two',
    difficulty: 'Easy',
    category: 'Math & Number Theory',
    categorySlug: 'math-and-number-theory',
    description: `Given an integer \`n\`, return \`true\` if it is a power of two, otherwise return \`false\`.

An integer \`n\` is a power of two if there exists an integer \`x\` such that \`n == 2^x\`.

Think about the binary representation of powers of two — they have a special property that makes this problem solvable in O(1) time.`,
    examples: [
      { input: 'n = 1', output: 'true', explanation: '2^0 = 1.' },
      { input: 'n = 16', output: 'true', explanation: '2^4 = 16.' },
      { input: 'n = 3', output: 'false', explanation: '3 is not a power of two.' },
    ],
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    hints: [
      'Powers of two in binary have exactly one set bit: 1, 10, 100, 1000, ...',
      'What does n & (n - 1) do for a power of two?',
      'A number n is a power of two if n > 0 and n & (n - 1) == 0.',
    ],
    starterCode: `public class Solution {
    /**
     * Return true if n is a power of two.
     */
    public boolean isPowerOfTwo(int n) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'n = 1', expectedOutput: 'true' },
      { input: 'n = 16', expectedOutput: 'true' },
      { input: 'n = 3', expectedOutput: 'false' },
      { input: 'n = 0', expectedOutput: 'false' },
    ],
  },
  {
    slug: 'count-primes',
    title: 'Count Primes',
    difficulty: 'Medium',
    category: 'Math & Number Theory',
    categorySlug: 'math-and-number-theory',
    description: `Given an integer \`n\`, return the number of prime numbers that are **strictly less than** \`n\`.

A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.

The naive approach of checking each number individually is too slow for large inputs. Consider using the **Sieve of Eratosthenes** algorithm, which efficiently marks composite numbers.`,
    examples: [
      { input: 'n = 10', output: '4', explanation: 'There are 4 primes less than 10: 2, 3, 5, 7.' },
      { input: 'n = 0', output: '0', explanation: 'There are no primes less than 0.' },
      { input: 'n = 1', output: '0', explanation: 'There are no primes less than 1.' },
    ],
    constraints: ['0 <= n <= 5 * 10^6'],
    hints: [
      'The brute force approach checks each number for primality — this is O(n * sqrt(n)). Can you do better?',
      'The Sieve of Eratosthenes marks multiples of each prime as composite. Start with 2 and mark all its multiples.',
      'Create a boolean array of size n. For each prime p, mark p*p, p*p+p, p*p+2p, ... as not prime. Count remaining true entries.',
    ],
    starterCode: `public class Solution {
    /**
     * Count the number of primes strictly less than n.
     */
    public int countPrimes(int n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 10', expectedOutput: '4' },
      { input: 'n = 0', expectedOutput: '0' },
      { input: 'n = 1', expectedOutput: '0' },
      { input: 'n = 20', expectedOutput: '8' },
    ],
  },
  {
    slug: 'happy-number',
    title: 'Happy Number',
    difficulty: 'Easy',
    category: 'Math & Number Theory',
    categorySlug: 'math-and-number-theory',
    description: `Write an algorithm to determine if a number \`n\` is a **happy number**.

A happy number is defined by the following process: starting with any positive integer, replace the number by the sum of the squares of its digits. Repeat the process until the number equals 1 (where it will stay), or it loops endlessly in a cycle which does not include 1. Numbers for which this process ends in 1 are happy.

For example, 19 → 1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1. So 19 is happy!`,
    examples: [
      { input: 'n = 19', output: 'true', explanation: '19 → 82 → 68 → 100 → 1. The process reaches 1, so 19 is happy.' },
      { input: 'n = 2', output: 'false', explanation: '2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 (cycle). Never reaches 1.' },
    ],
    constraints: ['1 <= n <= 2^31 - 1'],
    hints: [
      'Use a HashSet to detect cycles — if you see a number you have seen before, it is not happy.',
      'Alternatively, use Floyd\'s cycle detection (slow/fast pointer) on the sequence of digit-square sums.',
      'To extract digits, repeatedly take n % 10 and n / 10.',
    ],
    starterCode: `public class Solution {
    /**
     * Return true if n is a happy number.
     */
    public boolean isHappy(int n) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'n = 19', expectedOutput: 'true' },
      { input: 'n = 2', expectedOutput: 'false' },
      { input: 'n = 1', expectedOutput: 'true' },
      { input: 'n = 7', expectedOutput: 'true' },
    ],
  },

  // =====================================================================
  // HashMaps — fill gaps (3 problems)
  // =====================================================================
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'HashMaps',
    categorySlug: 'hashmaps',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.

For example, "anagram" is an anagram of "nagaram", but "rat" is not an anagram of "car".`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Both strings contain the same characters with the same frequencies.' },
      { input: 's = "rat", t = "car"', output: 'false', explanation: '"rat" and "car" do not have the same character frequencies.' },
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    hints: [
      'If the lengths differ, they cannot be anagrams.',
      'Count character frequencies using a HashMap or an array of size 26.',
      'Increment counts for characters in s, decrement for characters in t, then check all counts are zero.',
    ],
    starterCode: `public class Solution {
    /**
     * Return true if t is an anagram of s.
     */
    public boolean isAnagram(String s, String t) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 's = "anagram", t = "nagaram"', expectedOutput: 'true' },
      { input: 's = "rat", t = "car"', expectedOutput: 'false' },
      { input: 's = "a", t = "a"', expectedOutput: 'true' },
      { input: 's = "ab", t = "a"', expectedOutput: 'false' },
    ],
  },
  {
    slug: 'intersection-of-two-arrays',
    title: 'Intersection of Two Arrays',
    difficulty: 'Easy',
    category: 'HashMaps',
    categorySlug: 'hashmaps',
    description: `Given two integer arrays \`nums1\` and \`nums2\`, return an array of their **intersection**. Each element in the result must be **unique**, and you may return the result in any order.

The intersection of two arrays is the set of elements that appear in both arrays.

For example, the intersection of [1,2,2,1] and [2,2] is [2].`,
    examples: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]', explanation: '2 is the only element present in both arrays.' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4,9]', explanation: 'Both 4 and 9 appear in both arrays. Order does not matter.' },
    ],
    constraints: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
    hints: [
      'Use a HashSet to store elements from one array, then check which elements of the other array are in the set.',
      'Sets automatically handle duplicates, ensuring unique results.',
      'Add all elements of nums1 to a set. Iterate nums2 and add to result if the element is in the set. Use another set for the result to avoid duplicates.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the intersection of two arrays (unique elements only).
     */
    public int[] intersection(int[] nums1, int[] nums2) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', expectedOutput: '[2]' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', expectedOutput: '[4,9]' },
      { input: 'nums1 = [1,2,3], nums2 = [4,5,6]', expectedOutput: '[]' },
    ],
  },
  {
    slug: 'isomorphic-strings',
    title: 'Isomorphic Strings',
    difficulty: 'Easy',
    category: 'HashMaps',
    categorySlug: 'hashmaps',
    description: `Given two strings \`s\` and \`t\`, determine if they are **isomorphic**. Two strings are isomorphic if the characters in \`s\` can be replaced to get \`t\`, where each character maps to exactly one other character and no two characters map to the same character.

The mapping must be a one-to-one correspondence. All occurrences of a character must be replaced with another character while preserving the order.

For example, "egg" and "add" are isomorphic (e→a, g→d), but "foo" and "bar" are not (o maps to both a and r).`,
    examples: [
      { input: 's = "egg", t = "add"', output: 'true', explanation: 'e maps to a, g maps to d. The mapping is consistent.' },
      { input: 's = "foo", t = "bar"', output: 'false', explanation: 'o cannot map to both a and r.' },
      { input: 's = "paper", t = "title"', output: 'true', explanation: 'p→t, a→i, e→l, r→e. Each character has a unique mapping.' },
    ],
    constraints: ['1 <= s.length <= 5 * 10^4', 't.length == s.length', 's and t consist of any valid ASCII character.'],
    hints: [
      'You need two maps: one from s→t and one from t→s to ensure the mapping is bijective.',
      'Iterate through both strings simultaneously and check consistency of mappings.',
      'If s[i] is already mapped to a different character than t[i], or t[i] is already mapped from a different character than s[i], return false.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return true if s and t are isomorphic.
     */
    public boolean isIsomorphic(String s, String t) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 's = "egg", t = "add"', expectedOutput: 'true' },
      { input: 's = "foo", t = "bar"', expectedOutput: 'false' },
      { input: 's = "paper", t = "title"', expectedOutput: 'true' },
      { input: 's = "badc", t = "baba"', expectedOutput: 'false' },
    ],
  },

  // =====================================================================
  // Trees — fill Easy gaps (2 problems)
  // =====================================================================
  {
    slug: 'maximum-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, return its **maximum depth**.

A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

This is one of the most fundamental tree problems and a great introduction to recursive thinking on tree structures.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'The tree has depth 3: root(3) → right(20) → left(15) or right(7).' },
      { input: 'root = [1,null,2]', output: '2', explanation: 'The tree has depth 2: root(1) → right(2).' },
    ],
    constraints: ['The number of nodes is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    hints: [
      'Think recursively: the depth of a tree is 1 + the maximum depth of its subtrees.',
      'Base case: if the node is null, the depth is 0.',
      'Return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)).',
    ],
    starterCode: `public class Solution {
    /**
     * Definition for a binary tree node.
     * public class TreeNode {
     *     int val;
     *     TreeNode left;
     *     TreeNode right;
     *     TreeNode(int val) { this.val = val; }
     * }
     */
    public int maxDepth(TreeNode root) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'root = [3,9,20,null,null,15,7]', expectedOutput: '3' },
      { input: 'root = [1,null,2]', expectedOutput: '2' },
      { input: 'root = []', expectedOutput: '0' },
    ],
  },
  {
    slug: 'symmetric-tree',
    title: 'Symmetric Tree',
    difficulty: 'Easy',
    category: 'Trees',
    categorySlug: 'trees',
    description: `Given the \`root\` of a binary tree, check whether it is a **mirror of itself** (i.e., symmetric around its center).

A tree is symmetric if the left subtree is a mirror reflection of the right subtree. This means that for every node in the left subtree, there is a corresponding node in the right subtree at the mirrored position with the same value.

Both recursive and iterative solutions are possible.`,
    examples: [
      { input: 'root = [1,2,2,3,4,4,3]', output: 'true', explanation: 'The tree is symmetric around its center.' },
      { input: 'root = [1,2,2,null,3,null,3]', output: 'false', explanation: 'The right subtree is not a mirror of the left subtree.' },
    ],
    constraints: ['The number of nodes is in the range [1, 1000].', '-100 <= Node.val <= 100'],
    hints: [
      'Compare the left and right subtrees: left.left should mirror right.right, and left.right should mirror right.left.',
      'Write a helper function isMirror(t1, t2) that checks two trees are mirrors of each other.',
      'Base cases: both null → true, one null → false, values differ → false. Recurse on mirrored children.',
    ],
    starterCode: `public class Solution {
    /**
     * Definition for a binary tree node.
     * public class TreeNode {
     *     int val;
     *     TreeNode left;
     *     TreeNode right;
     *     TreeNode(int val) { this.val = val; }
     * }
     */
    public boolean isSymmetric(TreeNode root) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'root = [1,2,2,3,4,4,3]', expectedOutput: 'true' },
      { input: 'root = [1,2,2,null,3,null,3]', expectedOutput: 'false' },
      { input: 'root = [1]', expectedOutput: 'true' },
    ],
  },

  // =====================================================================
  // Linked Lists — add Easy (1 problem)
  // =====================================================================
  {
    slug: 'palindrome-linked-list',
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Given the \`head\` of a singly linked list, return \`true\` if it is a **palindrome**, or \`false\` otherwise.

A palindrome reads the same forward and backward. For example, the list 1 → 2 → 2 → 1 is a palindrome.

Can you do it in O(n) time and O(1) space? Think about using slow/fast pointers to find the middle, then reversing the second half.`,
    examples: [
      { input: 'head = [1,2,2,1]', output: 'true', explanation: 'The list reads 1,2,2,1 forward and backward.' },
      { input: 'head = [1,2]', output: 'false', explanation: 'The list reads 1,2 forward but 2,1 backward.' },
    ],
    constraints: ['The number of nodes is in the range [1, 10^5].', '0 <= Node.val <= 9'],
    hints: [
      'A simple approach: copy values to an array and check if the array is a palindrome.',
      'For O(1) space: use slow/fast pointers to find the middle of the list.',
      'Reverse the second half in place, then compare with the first half node by node.',
    ],
    starterCode: `public class Solution {
    /**
     * Definition for singly-linked list.
     * public class ListNode {
     *     int val;
     *     ListNode next;
     *     ListNode(int val) { this.val = val; }
     * }
     */
    public boolean isPalindrome(ListNode head) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'head = [1,2,2,1]', expectedOutput: 'true' },
      { input: 'head = [1,2]', expectedOutput: 'false' },
      { input: 'head = [1]', expectedOutput: 'true' },
    ],
  },

  // =====================================================================
  // Stacks — variety (1 problem)
  // =====================================================================
  {
    slug: 'next-greater-element',
    title: 'Next Greater Element I',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `You are given two distinct 0-indexed integer arrays \`nums1\` and \`nums2\`, where \`nums1\` is a subset of \`nums2\`. For each element in \`nums1\`, find the **next greater element** of that element in \`nums2\`.

The next greater element of \`nums1[i]\` in \`nums2\` is the first element to the right of \`nums2[j]\` (where \`nums2[j] == nums1[i]\`) that is greater than \`nums2[j]\`. If no such element exists, the answer is -1.

Return an array of the next greater elements for each value in \`nums1\`.`,
    examples: [
      { input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]', output: '[-1,3,-1]', explanation: 'For 4, no next greater in nums2. For 1, next greater is 3. For 2, no next greater.' },
      { input: 'nums1 = [2,4], nums2 = [1,2,3,4]', output: '[3,-1]', explanation: 'For 2, next greater is 3. For 4, no next greater element.' },
    ],
    constraints: ['1 <= nums1.length <= nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 10^4', 'All values in nums1 and nums2 are unique.', 'All values of nums1 also appear in nums2.'],
    hints: [
      'Brute force: for each element in nums1, find it in nums2 and scan right for a greater element.',
      'Optimize: use a monotonic decreasing stack to precompute next greater elements for all values in nums2.',
      'Traverse nums2, maintain a stack. Pop elements smaller than current and map them to current as their next greater. Store results in a HashMap.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the next greater element for each element in nums1
     * based on their positions in nums2.
     */
    public int[] nextGreaterElement(int[] nums1, int[] nums2) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums1 = [4,1,2], nums2 = [1,3,4,2]', expectedOutput: '[-1,3,-1]' },
      { input: 'nums1 = [2,4], nums2 = [1,2,3,4]', expectedOutput: '[3,-1]' },
      { input: 'nums1 = [1], nums2 = [1,2]', expectedOutput: '[2]' },
    ],
  },

  // =====================================================================
  // Graphs — Easy entry (1 problem)
  // =====================================================================
  {
    slug: 'flood-fill',
    title: 'Flood Fill',
    difficulty: 'Easy',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `You are given an \`m x n\` integer grid \`image\` where \`image[i][j]\` represents the pixel value. You are also given three integers \`sr\`, \`sc\`, and \`color\`. Perform a **flood fill** on the image starting from the pixel \`image[sr][sc]\`.

To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to it that share the same original color, plus any pixels connected 4-directionally to those, and so on. Replace the color of all the connected pixels with \`color\`.

This is the same operation as the "paint bucket" tool in image editing software. Return the modified image.`,
    examples: [
      { input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', output: '[[2,2,2],[2,2,0],[2,0,1]]', explanation: 'Starting pixel is image[1][1] = 1. All 4-directionally connected pixels with value 1 are changed to 2.' },
      { input: 'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0', output: '[[0,0,0],[0,0,0]]', explanation: 'The starting pixel is already the target color, so no changes are made.' },
    ],
    constraints: ['m == image.length', 'n == image[i].length', '1 <= m, n <= 50', '0 <= image[i][j], color < 2^16', '0 <= sr < m', '0 <= sc < n'],
    hints: [
      'Use DFS or BFS starting from (sr, sc). Visit all 4-directionally connected cells with the same original color.',
      'Important edge case: if the starting pixel already has the target color, return immediately to avoid infinite loops.',
      'DFS: change current pixel to new color, then recurse on all 4 neighbors that have the original color.',
    ],
    starterCode: `public class Solution {
    /**
     * Perform flood fill starting from image[sr][sc] with the given color.
     */
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        // Your code here
        return image;
    }
}`,
    testCases: [
      { input: 'image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2', expectedOutput: '[[2,2,2],[2,2,0],[2,0,1]]' },
      { input: 'image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0', expectedOutput: '[[0,0,0],[0,0,0]]' },
      { input: 'image = [[0,0,0],[0,1,1]], sr = 1, sc = 1, color = 1', expectedOutput: '[[0,0,0],[0,1,1]]' },
    ],
  },

  // =====================================================================
  // Backtracking — more variety (3 problems)
  // =====================================================================
  {
    slug: 'letter-combinations-phone',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    category: 'Backtracking',
    categorySlug: 'backtracking',
    description: `Given a string containing digits from \`2-9\` inclusive, return all possible **letter combinations** that the number could represent. Return the answer in any order.

The mapping of digits to letters is the same as on a telephone keypad: 2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz.

Note that 1 does not map to any letters. If the input is empty, return an empty list.`,
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: 'Digit 2 maps to "abc" and digit 3 maps to "def". All combinations of one letter from each are generated.' },
      { input: 'digits = ""', output: '[]', explanation: 'Empty input produces no combinations.' },
      { input: 'digits = "2"', output: '["a","b","c"]', explanation: 'Digit 2 maps to "abc".' },
    ],
    constraints: ['0 <= digits.length <= 4', 'digits[i] is a digit in the range [2, 9].'],
    hints: [
      'Use backtracking: build combinations one digit at a time.',
      'Create a mapping from each digit to its letters. For each digit, try each possible letter and recurse.',
      'Base case: when the current combination length equals the input length, add it to results.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return all possible letter combinations for the given digits.
     */
    public List<String> letterCombinations(String digits) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'digits = "23"', expectedOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', expectedOutput: '[]' },
      { input: 'digits = "2"', expectedOutput: '["a","b","c"]' },
    ],
  },
  {
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    category: 'Backtracking',
    categorySlug: 'backtracking',
    description: `Given \`n\` pairs of parentheses, write a function to generate all combinations of **well-formed parentheses**.

A string of parentheses is well-formed if every opening parenthesis has a corresponding closing parenthesis and they are properly nested.

For example, with n=3, one valid combination is "((()))" and another is "(()())".`,
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]', explanation: 'All 5 valid combinations of 3 pairs of parentheses.' },
      { input: 'n = 1', output: '["()"]', explanation: 'Only one valid combination with 1 pair.' },
    ],
    constraints: ['1 <= n <= 8'],
    hints: [
      'Use backtracking. Track the count of open and close parentheses used so far.',
      'You can add an open parenthesis if open < n. You can add a close parenthesis if close < open.',
      'Base case: when the string length equals 2*n, add it to results.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Generate all combinations of well-formed parentheses.
     */
    public List<String> generateParenthesis(int n) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'n = 3', expectedOutput: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n = 1', expectedOutput: '["()"]' },
      { input: 'n = 2', expectedOutput: '["(())","()()"]' },
    ],
  },
  {
    slug: 'n-queens',
    title: 'N-Queens',
    difficulty: 'Hard',
    category: 'Backtracking',
    categorySlug: 'backtracking',
    description: `The **N-Queens** puzzle is the problem of placing \`n\` queens on an \`n x n\` chessboard such that no two queens attack each other. A queen attacks another if they share the same row, column, or diagonal.

Given an integer \`n\`, return all distinct solutions to the N-Queens puzzle. Each solution is a list of strings where \`'Q'\` represents a queen and \`'.'\` represents an empty space.

This is a classic backtracking problem that demonstrates constraint satisfaction and pruning.`,
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: 'There are exactly 2 distinct solutions for the 4-Queens puzzle.' },
      { input: 'n = 1', output: '[["Q"]]', explanation: 'Only one way to place 1 queen on a 1x1 board.' },
    ],
    constraints: ['1 <= n <= 9'],
    hints: [
      'Place queens row by row. For each row, try each column and check if placement is valid.',
      'Track which columns and diagonals are under attack. Two cells share a diagonal if row1-col1 == row2-col2 or row1+col1 == row2+col2.',
      'Use three sets to track attacked columns, forward diagonals (row-col), and backward diagonals (row+col). Backtrack when no valid column exists.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return all distinct N-Queens solutions.
     */
    public List<List<String>> solveNQueens(int n) {
        // Your code here
        return new ArrayList<>();
    }
}`,
    testCases: [
      { input: 'n = 4', expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: 'n = 1', expectedOutput: '[["Q"]]' },
      { input: 'n = 2', expectedOutput: '[]' },
    ],
  },

  // =====================================================================
  // DP — more variety (2 problems)
  // =====================================================================
  {
    slug: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given an integer array \`nums\`, find a subarray that has the **largest product**, and return the product.

A subarray is a contiguous non-empty sequence of elements within an array. The tricky part is handling negative numbers — a negative times a negative becomes positive.

The test cases are generated so that the answer fits in a 32-bit integer.`,
    examples: [
      { input: 'nums = [2,3,-2,4]', output: '6', explanation: 'The subarray [2,3] has the largest product 6.' },
      { input: 'nums = [-2,0,-1]', output: '0', explanation: 'The result cannot be 2, because [-2,-1] is not a contiguous subarray.' },
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10', 'The product of any subarray fits in a 32-bit integer.'],
    hints: [
      'Unlike maximum subarray sum, negatives complicate things because two negatives make a positive.',
      'Track both the maximum and minimum product ending at each position. The minimum could become the maximum when multiplied by a negative.',
      'At each step: newMax = max(nums[i], maxSoFar * nums[i], minSoFar * nums[i]). Similarly for newMin. Update global max.',
    ],
    starterCode: `public class Solution {
    /**
     * Find the contiguous subarray with the largest product.
     */
    public int maxProduct(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [2,3,-2,4]', expectedOutput: '6' },
      { input: 'nums = [-2,0,-1]', expectedOutput: '0' },
      { input: 'nums = [-2,3,-4]', expectedOutput: '24' },
      { input: 'nums = [-2]', expectedOutput: '-2' },
    ],
  },
  {
    slug: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given an integer array \`nums\`, return \`true\` if you can partition the array into two subsets such that the **sum of elements** in both subsets is equal, or \`false\` otherwise.

This is equivalent to asking: is there a subset of \`nums\` that sums to \`totalSum / 2\`? If the total sum is odd, partition is impossible.

This is a classic **0/1 Knapsack** variant that can be solved with dynamic programming.`,
    examples: [
      { input: 'nums = [1,5,11,5]', output: 'true', explanation: 'The array can be partitioned as [1,5,5] and [11], both summing to 11.' },
      { input: 'nums = [1,2,3,5]', output: 'false', explanation: 'The array cannot be partitioned into equal sum subsets.' },
    ],
    constraints: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    hints: [
      'If the total sum is odd, return false immediately.',
      'This reduces to: can we find a subset that sums to totalSum / 2? This is the subset sum problem.',
      'Use a boolean DP array where dp[j] means "can we achieve sum j?". For each num, update dp[j] = dp[j] || dp[j - num] (iterate j from target down to num).',
    ],
    starterCode: `public class Solution {
    /**
     * Return true if the array can be partitioned into two equal-sum subsets.
     */
    public boolean canPartition(int[] nums) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'nums = [1,5,11,5]', expectedOutput: 'true' },
      { input: 'nums = [1,2,3,5]', expectedOutput: 'false' },
      { input: 'nums = [1,1]', expectedOutput: 'true' },
      { input: 'nums = [2,2,1,1]', expectedOutput: 'true' },
    ],
  },

  // =====================================================================
  // Binary Search — dedicated category (3 problems)
  // =====================================================================
  {
    slug: 'first-bad-version',
    title: 'First Bad Version',
    difficulty: 'Easy',
    category: 'Binary Search',
    categorySlug: 'binary-search',
    description: `You are a product manager and currently leading a team to develop a new product. Unfortunately, the latest version of your product fails the quality check. Since each version is developed based on the previous version, all the versions after a bad version are also bad.

You are given an API \`boolean isBadVersion(int version)\` which returns whether \`version\` is bad. Implement a function to find the **first bad version**. You should minimize the number of calls to the API.

This is a classic binary search on a boolean predicate — the search space is [1, n] and the predicate transitions from false to true.`,
    examples: [
      { input: 'n = 5, bad = 4', output: '4', explanation: 'isBadVersion(3) = false, isBadVersion(4) = true, isBadVersion(5) = true. So the first bad version is 4.' },
      { input: 'n = 1, bad = 1', output: '1', explanation: 'Only one version and it is bad.' },
    ],
    constraints: ['1 <= bad <= n <= 2^31 - 1'],
    hints: [
      'Binary search: if mid is bad, the first bad version is at mid or to its left. If mid is good, it is to the right.',
      'Be careful with integer overflow when computing mid. Use lo + (hi - lo) / 2.',
      'Set lo = 1, hi = n. While lo < hi: if isBadVersion(mid), hi = mid; else lo = mid + 1. Return lo.',
    ],
    starterCode: `public class Solution {
    /**
     * Assume isBadVersion(int version) is defined.
     * Find the first bad version in [1, n].
     */
    // private boolean isBadVersion(int version) { } // provided by system

    public int firstBadVersion(int n) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 5, bad = 4', expectedOutput: '4' },
      { input: 'n = 1, bad = 1', expectedOutput: '1' },
      { input: 'n = 10, bad = 7', expectedOutput: '7' },
    ],
  },
  {
    slug: 'search-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    category: 'Binary Search',
    categorySlug: 'binary-search',
    description: `You are given an \`m x n\` integer matrix \`matrix\` with the following properties:
- Each row is sorted in non-decreasing order.
- The first integer of each row is greater than the last integer of the previous row.

Given an integer \`target\`, return \`true\` if \`target\` is in \`matrix\`, or \`false\` otherwise.

You must write a solution in O(log(m * n)) time complexity. Think of the matrix as a single sorted array.`,
    examples: [
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', output: 'true', explanation: '3 is found in the first row.' },
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', output: 'false', explanation: '13 is not present in the matrix.' },
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 100', '-10^4 <= matrix[i][j], target <= 10^4'],
    hints: [
      'The matrix is essentially a sorted 1D array laid out in rows. Can you do binary search on it?',
      'Map a 1D index to 2D coordinates: row = index / n, col = index % n.',
      'Binary search with lo = 0, hi = m*n - 1. Convert mid to (row, col) and compare matrix[row][col] with target.',
    ],
    starterCode: `public class Solution {
    /**
     * Search for target in the sorted 2D matrix.
     */
    public boolean searchMatrix(int[][] matrix, int target) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', expectedOutput: 'true' },
      { input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13', expectedOutput: 'false' },
      { input: 'matrix = [[1]], target = 1', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    category: 'Binary Search',
    categorySlug: 'binary-search',
    description: `Koko loves to eat bananas. There are \`n\` piles of bananas, the \`i-th\` pile has \`piles[i]\` bananas. The guards have gone and will come back in \`h\` hours.

Koko can decide her bananas-per-hour eating speed \`k\`. Each hour, she chooses a pile and eats \`k\` bananas from it. If the pile has less than \`k\` bananas, she eats all of them and won't eat any more during that hour.

Return the **minimum** integer \`k\` such that she can eat all the bananas within \`h\` hours. This is a classic "binary search on the answer" problem.`,
    examples: [
      { input: 'piles = [3,6,7,11], h = 8', output: '4', explanation: 'At speed 4: ceil(3/4)+ceil(6/4)+ceil(7/4)+ceil(11/4) = 1+2+2+3 = 8 hours.' },
      { input: 'piles = [30,11,23,4,20], h = 5', output: '30', explanation: 'She must eat 30 per hour to finish all 5 piles in 5 hours (one pile per hour at max speed).' },
      { input: 'piles = [30,11,23,4,20], h = 6', output: '23', explanation: 'At speed 23: 2+1+1+1+1 = 6 hours.' },
    ],
    constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    hints: [
      'The answer is in the range [1, max(piles)]. Can you binary search on k?',
      'For a given k, compute the total hours needed: sum of ceil(piles[i] / k) for each pile. If total <= h, k is feasible.',
      'Binary search: lo = 1, hi = max(piles). If canFinish(mid, h), try smaller (hi = mid). Otherwise lo = mid + 1.',
    ],
    starterCode: `public class Solution {
    /**
     * Find the minimum eating speed k to eat all bananas within h hours.
     */
    public int minEatingSpeed(int[] piles, int h) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'piles = [3,6,7,11], h = 8', expectedOutput: '4' },
      { input: 'piles = [30,11,23,4,20], h = 5', expectedOutput: '30' },
      { input: 'piles = [30,11,23,4,20], h = 6', expectedOutput: '23' },
    ],
  },

  // =====================================================================
  // Intervals — new category (2 problems)
  // =====================================================================
  {
    slug: 'meeting-rooms',
    title: 'Meeting Rooms',
    difficulty: 'Easy',
    category: 'Intervals',
    categorySlug: 'intervals',
    description: `Given an array of meeting time intervals where \`intervals[i] = [start_i, end_i]\`, determine if a person could **attend all meetings**.

A person can attend all meetings if no two meetings overlap. Two meetings overlap if one starts before the other ends.

Sort the intervals by start time and check for overlaps between consecutive meetings.`,
    examples: [
      { input: 'intervals = [[0,30],[5,10],[15,20]]', output: 'false', explanation: 'Meeting [0,30] overlaps with [5,10] and [15,20].' },
      { input: 'intervals = [[7,10],[2,4]]', output: 'true', explanation: 'After sorting: [2,4] and [7,10] do not overlap.' },
    ],
    constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i < end_i <= 10^6'],
    hints: [
      'Sort intervals by start time.',
      'After sorting, check if any interval starts before the previous one ends.',
      'If intervals[i][0] < intervals[i-1][1] for any i, return false.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return true if a person can attend all meetings without overlap.
     */
    public boolean canAttendMeetings(int[][] intervals) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'intervals = [[0,30],[5,10],[15,20]]', expectedOutput: 'false' },
      { input: 'intervals = [[7,10],[2,4]]', expectedOutput: 'true' },
      { input: 'intervals = []', expectedOutput: 'true' },
      { input: 'intervals = [[1,5],[5,10]]', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'insert-interval',
    title: 'Insert Interval',
    difficulty: 'Medium',
    category: 'Intervals',
    categorySlug: 'intervals',
    description: `You are given an array of non-overlapping intervals \`intervals\` where \`intervals[i] = [start_i, end_i]\` sorted in ascending order by \`start_i\`. You are also given an interval \`newInterval = [start, end]\`.

Insert \`newInterval\` into \`intervals\` such that \`intervals\` is still sorted in ascending order by \`start_i\` and \`intervals\` still does not have any overlapping intervals. Merge overlapping intervals if necessary.

Return \`intervals\` after the insertion.`,
    examples: [
      { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]', explanation: 'newInterval [2,5] overlaps with [1,3], merging into [1,5].' },
      { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]', explanation: 'newInterval [4,8] overlaps with [3,5],[6,7],[8,10], merging into [3,10].' },
    ],
    constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^5', 'intervals is sorted by start_i.', 'newInterval.length == 2', '0 <= start <= end <= 10^5'],
    hints: [
      'Add all intervals that end before the new interval starts (no overlap on the left).',
      'Merge all intervals that overlap with newInterval by expanding newInterval\'s start and end.',
      'Add the merged interval, then add all remaining intervals that start after newInterval ends.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Insert newInterval into intervals and merge if necessary.
     */
    public int[][] insert(int[][] intervals, int[] newInterval) {
        // Your code here
        return new int[][]{};
    }
}`,
    testCases: [
      { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', expectedOutput: '[[1,5],[6,9]]' },
      { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', expectedOutput: '[[1,2],[3,10],[12,16]]' },
      { input: 'intervals = [], newInterval = [5,7]', expectedOutput: '[[5,7]]' },
    ],
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Get all problems in a specific category.
 */
export function getProblemsByCategory(categorySlug: string): Problem[] {
  return problems.filter((p) => p.categorySlug === categorySlug);
}

/**
 * Get a single problem by its slug.
 */
export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

/**
 * Get all unique categories with their problem counts.
 */
export function getCategories(): { slug: string; name: string; count: number }[] {
  const categoryMap = new Map<string, { name: string; count: number }>();

  for (const problem of problems) {
    const existing = categoryMap.get(problem.categorySlug);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(problem.categorySlug, {
        name: problem.category,
        count: 1,
      });
    }
  }

  return Array.from(categoryMap.entries()).map(([slug, { name, count }]) => ({
    slug,
    name,
    count,
  }));
}
