// ============================================================================
// problems.ts - 45 DS&A Interview Problems (Problem Definitions Only)
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
