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

export const problems: Problem[] = [
  // ═══════════════════════════════════════════════════════════
  // ARRAYS & STRINGS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    hints: [
      'A brute force approach would check every pair — O(n²). Can you do better?',
      'Think about what value you need to find for each element. Can a data structure help you look it up in O(1)?',
      'Use a HashMap to store each number and its index as you iterate. For each element, check if (target - nums[i]) exists in the map.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return indices of the two numbers that add up to target.
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
      { input: 'nums = [1,5,3,7,2], target = 9', expectedOutput: '[1,3]' },
    ],
  },
  {
    slug: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].

The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in O(n) time and without using the division operation.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix or suffix fits in a 32-bit integer.'],
    hints: [
      'Think about the product of all elements to the LEFT of index i, and the product of all elements to the RIGHT of index i.',
      'You can compute prefix products in a left-to-right pass and suffix products in a right-to-left pass.',
      'For O(1) extra space (besides output), use the output array to store the left products first, then multiply in the right products in a second pass.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return array where each element is product of all others.
     * Do not use division. O(n) time required.
     */
    public int[] productExceptSelf(int[] nums) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3,4]', expectedOutput: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' },
      { input: 'nums = [2,3]', expectedOutput: '[3,2]' },
      { input: 'nums = [1,1,1,1]', expectedOutput: '[1,1,1,1]' },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    hints: [
      'If you sort the intervals by start time, overlapping intervals will be adjacent.',
      'After sorting, iterate through and compare each interval with the last merged interval.',
      'If the current interval overlaps with the last merged one (start <= lastEnd), merge them by updating the end to max(lastEnd, currentEnd).',
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
    ],
  },
  {
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The elevation map can trap 6 units of rain water.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' },
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    hints: [
      'The water above each bar depends on the minimum of the tallest bar to its left and the tallest bar to its right.',
      'You could precompute leftMax[] and rightMax[] arrays. Water at position i = min(leftMax[i], rightMax[i]) - height[i].',
      'For O(1) space, use two pointers from both ends. Move the pointer with the smaller max height inward, accumulating water.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Compute total water trapped between bars.
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
    ],
  },
  {
    slug: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Arrays & Strings',
    categorySlug: 'arrays-and-strings',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: [
      'Use a sliding window approach with two pointers.',
      'Use a HashSet or HashMap to track characters in the current window.',
      'When you find a duplicate, shrink the window from the left until the duplicate is removed.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find length of longest substring without repeating characters.
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
    description: `You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store. Notice that you may not slant the container.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at index 1 (height 8) and index 8 (height 7) form container with area 7 * 7 = 49.' },
      { input: 'height = [1,1]', output: '1' },
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    hints: [
      'Start with the widest container (first and last lines). Can you reason about which pointer to move?',
      'Moving the taller line inward can only decrease the width without increasing height. Move the shorter line.',
      'Two pointer approach: always move the pointer pointing to the shorter line inward.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find two lines forming the container with the most water.
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
    description: `Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    hints: [
      'Sort the array first. This enables two-pointer technique and easy duplicate skipping.',
      'Fix one element, then use two pointers on the remaining sorted subarray to find pairs.',
      'Skip duplicate values for the fixed element and both pointers to avoid duplicate triplets.',
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

  // ═══════════════════════════════════════════════════════════
  // LINKED LISTS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

Implement both an iterative and recursive solution.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the list is in the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    hints: [
      'For iterative: maintain a previous pointer and reverse each node\'s next pointer as you go.',
      'For recursive: reverse the rest of the list first, then fix the pointers.',
      'Be careful with the base case: an empty list or single node is already reversed.',
    ],
    starterCode: `/**
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
     * Reverse a singly linked list iteratively.
     */
    public ListNode reverseList(ListNode head) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'head = [1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', expectedOutput: '[2,1]' },
      { input: 'head = [1]', expectedOutput: '[1]' },
      { input: 'head = []', expectedOutput: '[]' },
    ],
  },
  {
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' },
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both lists are sorted in non-decreasing order.'],
    hints: [
      'Use a dummy head node to simplify the code — no special case for the first node.',
      'Compare the current nodes of both lists, attach the smaller one to the result.',
      'When one list is exhausted, attach the remainder of the other list.',
    ],
    starterCode: `public class Solution {
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
    description: `Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.

Do not modify the linked list. Can you solve it using O(1) memory?`,
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'Node with value 2', explanation: 'Tail connects to node index 1 (value 2).' },
      { input: 'head = [1,2], pos = 0', output: 'Node with value 1', explanation: 'Tail connects to node index 0.' },
      { input: 'head = [1], pos = -1', output: 'null', explanation: 'No cycle.' },
    ],
    constraints: ['The number of nodes is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5', 'pos is -1 or a valid index in the linked list.'],
    hints: [
      'Use Floyd\'s Cycle Detection: one slow pointer (1 step) and one fast pointer (2 steps).',
      'If they meet, there IS a cycle. The meeting point has a mathematical relationship with the cycle start.',
      'After detecting the cycle, reset one pointer to head. Move both one step at a time — they\'ll meet at the cycle start.',
    ],
    starterCode: `public class Solution {
    /**
     * Return the node where the cycle begins, or null if no cycle.
     * Use O(1) extra memory.
     */
    public ListNode detectCycle(ListNode head) {
        // Your code here
        return null;
    }
}`,
    testCases: [
      { input: 'head = [3,2,0,-4], pos = 1', expectedOutput: 'Node at index 1' },
      { input: 'head = [1,2], pos = 0', expectedOutput: 'Node at index 0' },
      { input: 'head = [1], pos = -1', expectedOutput: 'null' },
    ],
  },
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Hard',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.

Implement the LRUCache class:
- LRUCache(int capacity) Initialize the LRU cache with positive size capacity.
- int get(int key) Return the value of the key if it exists, otherwise return -1.
- void put(int key, int value) Update or insert the value. When the cache reaches capacity, evict the least recently used key before inserting.

Both get and put must run in O(1) average time complexity.`,
    examples: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]' },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls will be made to get and put.'],
    hints: [
      'You need O(1) lookup (HashMap) AND O(1) removal/insertion of the "most/least recent" element.',
      'A doubly linked list maintains order: most recent at head, least recent at tail.',
      'Combine: HashMap<key, DLL_Node> for lookup + Doubly Linked List for recency ordering.',
    ],
    starterCode: `import java.util.*;

public class LRUCache {
    /**
     * Initialize with positive capacity.
     */
    public LRUCache(int capacity) {
        // Your code here
    }

    /**
     * Return value for key, or -1 if not found. Marks as recently used.
     */
    public int get(int key) {
        // Your code here
        return -1;
    }

    /**
     * Insert or update key-value. Evict LRU if at capacity.
     */
    public void put(int key, int value) {
        // Your code here
    }
}`,
    testCases: [
      { input: 'capacity=2: put(1,1), put(2,2), get(1)', expectedOutput: '1' },
      { input: 'capacity=2: put(1,1), put(2,2), put(3,3), get(2)', expectedOutput: '-1 (evicted)' },
      { input: 'capacity=2: put(1,1), put(2,2), get(1), put(3,3), get(2)', expectedOutput: '-1' },
      { input: 'capacity=2: put(2,1), put(2,2), get(2)', expectedOutput: '2 (updated)' },
    ],
  },
  {
    slug: 'copy-list-random-pointer',
    title: 'Copy List with Random Pointer',
    difficulty: 'Medium',
    category: 'Linked Lists',
    categorySlug: 'linked-lists',
    description: `A linked list of length n is given such that each node contains an additional random pointer, which could point to any node in the list, or null.

Construct a deep copy of the list. The deep copy should consist of exactly n brand new nodes, where each new node has its value set to the value of its corresponding original node. Both the next and random pointer of the new nodes should point to new nodes in the copied list.

Return the head of the copied linked list.`,
    examples: [
      { input: 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', output: '[[7,null],[13,0],[11,4],[10,2],[1,0]]' },
      { input: 'head = [[1,1],[2,1]]', output: '[[1,1],[2,1]]' },
    ],
    constraints: ['0 <= n <= 1000', '-10^4 <= Node.val <= 10^4', 'random is null or points to a node in the linked list.'],
    hints: [
      'A HashMap mapping original nodes to their copies solves it in O(n) space.',
      'For O(1) space: interweave copied nodes between originals (A→A\'→B→B\'→...), set random pointers, then separate.',
      'The interweaving trick: copy.random = original.random.next (since each original is followed by its copy).',
    ],
    starterCode: `public class Solution {
    /**
     * Deep copy a linked list with random pointers.
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

  // ═══════════════════════════════════════════════════════════
  // STACKS & QUEUES
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([)]"', output: 'false' },
      { input: 's = "{[]}"', output: 'true' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only: \'()[]{}\''],
    hints: [
      'Use a stack: push open brackets, pop when you see a closing bracket.',
      'When you see a closing bracket, the top of the stack must be the matching open bracket.',
      'The string is valid if the stack is empty at the end.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Determine if the string of brackets is valid.
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
      { input: 's = ""', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the MinStack class:
- MinStack() initializes the stack object.
- void push(int val) pushes the element val onto the stack.
- void pop() removes the element on the top of the stack.
- int top() gets the top element of the stack.
- int getMin() retrieves the minimum element in the stack.

You must implement a solution with O(1) time complexity for each function.`,
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]' },
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'Methods pop, top and getMin will always be called on non-empty stacks.', 'At most 3 * 10^4 calls will be made.'],
    hints: [
      'The challenge is getMin in O(1). A single variable won\'t work because popping might reveal a new minimum.',
      'Use an auxiliary stack that tracks the minimum at each level of the main stack.',
      'Alternative: store pairs (value, currentMin) on a single stack.',
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
      { input: 'push(-2), push(0), push(-3), getMin()', expectedOutput: '-3' },
      { input: 'push(-2), push(0), push(-3), pop(), top()', expectedOutput: '0' },
      { input: 'push(-2), push(0), push(-3), pop(), getMin()', expectedOutput: '-2' },
      { input: 'push(1), push(2), top(), getMin()', expectedOutput: 'top=2, min=1' },
    ],
  },
  {
    slug: 'largest-rectangle-histogram',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    category: 'Stacks & Queues',
    categorySlug: 'stacks-and-queues',
    description: `Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.`,
    examples: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'The largest rectangle has area 10 (formed by heights 5 and 6, width 2).' },
      { input: 'heights = [2,4]', output: '4' },
    ],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    hints: [
      'For each bar, find how far left and right it can extend as the shortest bar. This is the "next smaller element" on both sides.',
      'A monotonic increasing stack can find the next smaller element for all bars in O(n).',
      'When popping a bar from the stack (because a shorter bar arrived), calculate the rectangle with the popped bar as the height.',
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
    description: `Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.`,
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
      { input: 'temperatures = [30,60,90]', output: '[1,1,0]' },
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: [
      'This is a classic "next greater element" problem.',
      'Use a monotonic decreasing stack that stores indices.',
      'When a warmer temperature arrives, pop all colder temperatures from the stack and calculate the gap.',
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
      { input: 'temperatures = [90,80,70,60]', expectedOutput: '[0,0,0,0]' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // TREES
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    categorySlug: 'trees-and-bst',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    hints: [
      'Use BFS with a queue. Process all nodes at the current level before moving to the next.',
      'Track the number of nodes at each level using queue.size() at the start of each level.',
      'Add each level\'s values as a list to the result.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return level order traversal as list of lists.
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
    categorySlug: 'trees-and-bst',
    description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The root node\'s value is 5 but its right child\'s value is 4.' },
    ],
    constraints: ['The number of nodes is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    hints: [
      'Checking only parent-child relationship is NOT enough. Each node must satisfy a range constraint from all ancestors.',
      'Pass down a valid range (min, max) for each node. Use Long.MIN_VALUE and Long.MAX_VALUE initially.',
      'Alternative: an inorder traversal of a BST produces a strictly increasing sequence.',
    ],
    starterCode: `public class Solution {
    /**
     * Determine if the binary tree is a valid BST.
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
    categorySlug: 'trees-and-bst',
    description: `Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

The lowest common ancestor is defined as the lowest node in the tree that has both p and q as descendants (where we allow a node to be a descendant of itself).`,
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explanation: 'Node 5 is an ancestor of node 4, and a node can be a descendant of itself.' },
    ],
    constraints: ['The number of nodes is in the range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.', 'p != q', 'p and q exist in the tree.'],
    hints: [
      'Think recursively: if the current node is p or q, it might be the LCA.',
      'Recurse on left and right subtrees. If both return non-null, the current node is the LCA.',
      'If only one side returns non-null, propagate that result upward.',
    ],
    starterCode: `public class Solution {
    /**
     * Find the lowest common ancestor of nodes p and q.
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
    categorySlug: 'trees-and-bst',
    description: `Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting a tree to a string so that it can be later restored. Deserialization reconstructs the tree from the string.

There is no restriction on how your serialization/deserialization algorithm should work. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized back to the original tree structure.`,
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes is in the range [0, 10^4].', '-1000 <= Node.val <= 1000'],
    hints: [
      'Preorder DFS traversal can encode the tree if you include null markers.',
      'Serialize: visit node → record value (or "null") → recurse left → recurse right.',
      'Deserialize: read values one by one, build nodes recursively. "null" means return null.',
    ],
    starterCode: `import java.util.*;

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
      { input: 'root = [1,2,3,null,null,4,5]', expectedOutput: 'Deserialize(Serialize(root)) == root' },
      { input: 'root = []', expectedOutput: 'Deserialize(Serialize(root)) == root' },
      { input: 'root = [1]', expectedOutput: 'Deserialize(Serialize(root)) == root' },
    ],
  },
  {
    slug: 'max-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    category: 'Trees',
    categorySlug: 'trees-and-bst',
    description: `A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. A node can only appear in the sequence at most once. Note that the path does not need to pass through the root.

The path sum of a path is the sum of the node's values in the path.

Given the root of a binary tree, return the maximum path sum of any non-empty path.`,
    examples: [
      { input: 'root = [1,2,3]', output: '6', explanation: 'The optimal path is 2 → 1 → 3 with sum 6.' },
      { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: 'The optimal path is 15 → 20 → 7 with sum 42.' },
    ],
    constraints: ['The number of nodes is in the range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],
    hints: [
      'At each node, the max path through it could include: node alone, node + left branch, node + right branch, or node + both branches.',
      'Use postorder DFS. Return the max gain from this node going downward (can only pick one branch to pass up).',
      'Track a global maximum that considers the "split" path (both branches) at each node.',
    ],
    starterCode: `public class Solution {
    /**
     * Return the maximum path sum in the binary tree.
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

  // ═══════════════════════════════════════════════════════════
  // HEAPS & PRIORITY QUEUES
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'Heaps',
    categorySlug: 'heaps-and-priority-queues',
    description: `Given an integer array nums and an integer k, return the kth largest element in the array.

Note that it is the kth largest element in the sorted order, not the kth distinct element.

Can you solve it without sorting?`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'Sorting gives O(n log n). Can you do better with a heap?',
      'Maintain a min-heap of size k. The top of the heap is the kth largest.',
      'Alternative: QuickSelect algorithm gives O(n) average case.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the kth largest element (not kth distinct).
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
    categorySlug: 'heaps-and-priority-queues',
    description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' },
      { input: 'lists = [[]]', output: '[]' },
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'Total number of nodes does not exceed 10^4.'],
    hints: [
      'Brute force: merge two at a time. O(kN) where N is total nodes.',
      'Use a min-heap of size k: always extract the smallest head, then push its next node.',
      'PriorityQueue with a custom comparator on ListNode values. O(N log k) total.',
    ],
    starterCode: `import java.util.*;

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
    categorySlug: 'heaps-and-priority-queues',
    description: `The median is the middle value in an ordered integer list. If the list size is even, the median is the mean of the two middle values.

Implement the MedianFinder class:
- MedianFinder() initializes the MedianFinder object.
- void addNum(int num) adds the integer num from the data stream.
- double findMedian() returns the median of all elements so far.`,
    examples: [
      { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', output: '[null, null, 1.5, null, 2.0]' },
    ],
    constraints: ['-10^5 <= num <= 10^5', 'There will be at least one element before calling findMedian.', 'At most 5 * 10^4 calls total.'],
    hints: [
      'Maintaining a sorted list with binary search insertion is O(n) per insert. Can you do O(log n)?',
      'Use TWO heaps: a max-heap for the lower half and a min-heap for the upper half.',
      'Balance the heaps so their sizes differ by at most 1. The median is at the top(s) of the heap(s).',
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
      { input: 'addNum(1), addNum(2), findMedian()', expectedOutput: '1.5' },
      { input: 'addNum(1), addNum(2), addNum(3), findMedian()', expectedOutput: '2.0' },
      { input: 'addNum(6), addNum(10), addNum(2), addNum(6), findMedian()', expectedOutput: '6.0' },
    ],
  },
  {
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'Heaps',
    categorySlug: 'heaps-and-priority-queues',
    description: `Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.

Your algorithm's time complexity must be better than O(n log n).`,
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, number of unique elements].', 'It is guaranteed that the answer is unique.'],
    hints: [
      'First count frequencies with a HashMap.',
      'A min-heap of size k gives O(n log k). But can you do O(n)?',
      'Bucket sort: create an array where index = frequency, value = list of elements with that frequency.',
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
      { input: 'nums = [4,1,-1,2,-1,2,3], k = 2', expectedOutput: '[-1,2]' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // HASHMAPS & SETS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'HashMaps & Sets',
    categorySlug: 'hashmaps-and-sets',
    description: `Given an array of strings strs, group the anagrams together. You can return the answer in any order.

An anagram is a word or phrase formed by rearranging the letters of a different word or phrase, using all the original letters exactly once.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    hints: [
      'Anagrams produce the same string when sorted. Use the sorted string as a HashMap key.',
      'Alternative key: a frequency count array converted to a string (avoids sorting cost).',
      'Group all strings with the same key into a list.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Group anagrams together.
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
    category: 'HashMaps & Sets',
    categorySlug: 'hashmaps-and-sets',
    description: `Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: 'nums = [1,1,1], k = 2', output: '2' },
      { input: 'nums = [1,2,3], k = 3', output: '2' },
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    hints: [
      'Brute force: check all subarrays — O(n²). Can you do better?',
      'Key insight: if prefixSum[j] - prefixSum[i] == k, then the subarray from i+1 to j sums to k.',
      'Use a HashMap to count occurrences of each prefix sum. For each new prefix sum, check how many times (prefixSum - k) has appeared.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Count the number of subarrays with sum equal to k.
     */
    public int subarraySum(int[] nums, int k) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [1,1,1], k = 2', expectedOutput: '2' },
      { input: 'nums = [1,2,3], k = 3', expectedOutput: '2' },
      { input: 'nums = [1,-1,0], k = 0', expectedOutput: '3' },
      { input: 'nums = [3,4,7,2,-3,1,4,2], k = 7', expectedOutput: '4' },
    ],
  },
  {
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    category: 'HashMaps & Sets',
    categorySlug: 'hashmaps-and-sets',
    description: `Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.

You must write an algorithm that runs in O(n) time.`,
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive sequence is [1, 2, 3, 4]. Its length is 4.' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' },
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: [
      'Sorting would give O(n log n). You need O(n). Think HashSet.',
      'Put all numbers in a HashSet. For each number, only start counting if (num - 1) is NOT in the set (this is the start of a sequence).',
      'From each sequence start, count consecutive numbers (num+1, num+2, ...) in the set.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find length of longest consecutive sequence in O(n).
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

  // ═══════════════════════════════════════════════════════════
  // GRAPHS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `Given an m x n 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are surrounded by water.`,
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' },
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    hints: [
      'Iterate over each cell. When you find a \'1\', that\'s a new island — increment count.',
      'Use DFS or BFS to mark all connected \'1\'s as visited (change to \'0\' or use a visited array).',
      'This is a classic flood-fill / connected components problem on a grid.',
    ],
    starterCode: `public class Solution {
    /**
     * Count the number of islands in the grid.
     */
    public int numIslands(char[][] grid) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' },
      { input: 'grid = [["1","0","1","0","1"]]', expectedOutput: '3' },
    ],
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.

Return true if you can finish all courses. Otherwise, return false.`,
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Circular dependency.' },
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', '0 <= ai, bi < numCourses', 'All prerequisite pairs are unique.'],
    hints: [
      'This is a cycle detection problem in a directed graph.',
      'Use topological sort (Kahn\'s algorithm): if you can process all nodes, there\'s no cycle.',
      'Start with all nodes having in-degree 0. Process them via BFS, reducing neighbors\' in-degrees.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Can you finish all courses? (Detect if the prerequisite graph has a cycle.)
     */
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Your code here
        return false;
    }
}`,
    testCases: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', expectedOutput: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', expectedOutput: 'false' },
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: 'true' },
      { input: 'numCourses = 1, prerequisites = []', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'Hard',
    category: 'Graphs',
    categorySlug: 'graphs',
    description: `A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that:
- Every adjacent pair of words differs by a single letter.
- Every si for 1 <= i <= k is in wordList.

Given two words, beginWord and endWord, and a dictionary wordList, return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.`,
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit → hot → dot → dog → cog' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0', explanation: 'endWord "cog" is not in wordList.' },
    ],
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'All words have the same length.', 'All words consist of lowercase English letters.'],
    hints: [
      'This is a shortest path problem on an unweighted graph — use BFS.',
      'Each word is a node. Two words are connected if they differ by exactly one letter.',
      'Optimization: instead of checking all pairs, for each word try replacing each character with a-z.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find length of shortest transformation sequence.
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
    description: `You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (ui, vi, wi), where ui is the source node, vi is the target node, and wi is the time it takes for a signal to travel from source to target.

We will send a signal from a given node k. Return the minimum time it takes for all the n nodes to receive the signal. If it is impossible for all the n nodes to receive the signal, return -1.`,
    examples: [
      { input: 'times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', output: '2' },
      { input: 'times = [[1,2,1]], n = 2, k = 1', output: '1' },
      { input: 'times = [[1,2,1]], n = 2, k = 2', output: '-1' },
    ],
    constraints: ['1 <= k <= n <= 100', '1 <= times.length <= 6000', 'times[i].length == 3', '1 <= ui, vi <= n', '0 <= wi <= 100'],
    hints: [
      'This is a single-source shortest path problem — use Dijkstra\'s algorithm.',
      'Build an adjacency list, use a min-heap (PriorityQueue) to process nodes by shortest distance.',
      'The answer is the maximum distance among all reachable nodes. If any node is unreachable, return -1.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find minimum time for signal to reach all nodes from node k.
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
    description: `Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.

Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.`,
    examples: [
      { input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]', output: '[[2,4],[1,3],[2,4],[1,3]]' },
      { input: 'adjList = [[]]', output: '[[]]' },
    ],
    constraints: ['The number of nodes is in the range [0, 100].', '1 <= Node.val <= 100', 'Node.val is unique for each node.', 'No repeated edges or self-loops.', 'The graph is connected.'],
    hints: [
      'Use a HashMap to map original nodes to their clones. This prevents creating duplicates.',
      'BFS or DFS: visit each node, create a clone, and copy its neighbor references (using the map).',
      'Key check: if a neighbor is already in the map, use the existing clone instead of creating a new one.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Deep copy the given graph. Return the clone of the given node.
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

  // ═══════════════════════════════════════════════════════════
  // TRIES
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    category: 'Tries',
    categorySlug: 'tries',
    description: `A trie (prefix tree) is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.

Implement the Trie class:
- Trie() Initializes the trie object.
- void insert(String word) Inserts the string word into the trie.
- boolean search(String word) Returns true if word is in the trie (exact match).
- boolean startsWith(String prefix) Returns true if any previously inserted word has the prefix.`,
    examples: [
      { input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', output: '[null, true, false, true, null, true]' },
    ],
    constraints: ['1 <= word.length, prefix.length <= 2000', 'word and prefix consist only of lowercase English letters.', 'At most 3 * 10^4 calls total.'],
    hints: [
      'Each TrieNode has an array of children (size 26 for a-z) and a boolean isEndOfWord flag.',
      'Insert: traverse/create nodes for each character. Mark the last node as end of word.',
      'Search vs startsWith: search checks isEndOfWord at the end, startsWith does not.',
    ],
    starterCode: `public class Trie {
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
      { input: 'insert("apple"), search("apple")', expectedOutput: 'true' },
      { input: 'insert("apple"), search("app")', expectedOutput: 'false' },
      { input: 'insert("apple"), startsWith("app")', expectedOutput: 'true' },
      { input: 'insert("apple"), insert("app"), search("app")', expectedOutput: 'true' },
    ],
  },
  {
    slug: 'word-search-ii',
    title: 'Word Search II',
    difficulty: 'Hard',
    category: 'Tries',
    categorySlug: 'tries',
    description: `Given an m x n board of characters and a list of strings words, return all words on the board.

Each word must be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once in a word.`,
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]' },
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10', 'All words[i] are unique.'],
    hints: [
      'Naive approach: run word search for each word — too slow with many words.',
      'Build a Trie from all words. Then DFS from each cell using the Trie to prune early.',
      'Optimization: remove words from the Trie after finding them to avoid duplicates and speed up.',
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

  // ═══════════════════════════════════════════════════════════
  // UNION-FIND
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'number-connected-components',
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    category: 'Union-Find',
    categorySlug: 'union-find',
    description: `You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph.

Return the number of connected components in the graph.`,
    examples: [
      { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1' },
    ],
    constraints: ['1 <= n <= 2000', '1 <= edges.length <= 5000', 'edges[i].length == 2', '0 <= ai, bi < n', 'ai != bi', 'No repeated edges.'],
    hints: [
      'This is a classic connectivity problem — BFS/DFS or Union-Find.',
      'Union-Find: start with n components. For each edge, union the two nodes. Count remaining components.',
      'Optimize Union-Find with path compression and union by rank for near O(1) amortized per operation.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Count the number of connected components.
     */
    public int countComponents(int n, int[][] edges) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', expectedOutput: '2' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', expectedOutput: '1' },
      { input: 'n = 4, edges = [[2,3],[1,2],[1,3]]', expectedOutput: '2' },
      { input: 'n = 1, edges = []', expectedOutput: '1' },
    ],
  },
  {
    slug: 'redundant-connection',
    title: 'Redundant Connection',
    difficulty: 'Medium',
    category: 'Union-Find',
    categorySlug: 'union-find',
    description: `In this problem, a tree is an undirected graph that is connected and has no cycles.

You are given a graph that started as a tree with n nodes labeled from 1 to n, with one additional edge added. The added edge has two different vertices chosen from 1 to n, and is not an edge that already exists.

Return an edge that can be removed so that the resulting graph is a tree. If there are multiple answers, return the answer that occurs last in the input.`,
    examples: [
      { input: 'edges = [[1,2],[1,3],[2,3]]', output: '[2,3]' },
      { input: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', output: '[1,4]' },
    ],
    constraints: ['n == edges.length', '3 <= n <= 1000', 'edges[i].length == 2', '1 <= ai, bi <= n', 'ai != bi', 'No repeated edges.', 'The graph is connected.'],
    hints: [
      'The redundant edge creates a cycle. Find which edge closes the cycle.',
      'Union-Find: process edges one by one. The first edge where both nodes are already connected is the answer.',
      'Since we want the LAST such edge in the input, Union-Find naturally gives this as we process in order.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the redundant edge that can be removed to form a tree.
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

  // ═══════════════════════════════════════════════════════════
  // DYNAMIC PROGRAMMING
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given an integer array nums, return the length of the longest strictly increasing subsequence.

A subsequence is derived from an array by deleting some or no elements without changing the order of the remaining elements.`,
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'The LIS is [2,3,7,101].' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      { input: 'nums = [7,7,7,7,7,7,7]', output: '1' },
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    hints: [
      'O(n²) DP: dp[i] = length of LIS ending at index i. For each j < i, if nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1).',
      'O(n log n) approach: maintain a "tails" array where tails[i] is the smallest tail element of all subsequences of length i+1.',
      'For the O(n log n) approach, use binary search (Arrays.binarySearch or manual) to find the insertion position.',
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
    description: `You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,5,11], amount = 15', output: '3', explanation: '15 = 5 + 5 + 5' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: [
      'Think of it as an unbounded knapsack problem.',
      'Bottom-up DP: dp[i] = minimum coins to make amount i. Initialize dp[0] = 0, rest = infinity.',
      'For each amount i, try each coin: dp[i] = min(dp[i], dp[i - coin] + 1) if i >= coin.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Find the fewest coins to make the amount. Return -1 if impossible.
     */
    public int coinChange(int[] coins, int amount) {
        // Your code here
        return -1;
    }
}`,
    testCases: [
      { input: 'coins = [1,5,11], amount = 15', expectedOutput: '3' },
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
    description: `Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.

You have the following three operations permitted on a word:
- Insert a character
- Delete a character
- Replace a character`,
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse → rorse (replace h with r) → rose (remove r) → ros (remove e)' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5' },
    ],
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    hints: [
      'Classic 2D DP problem. dp[i][j] = edit distance between word1[0..i-1] and word2[0..j-1].',
      'If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1] (no operation needed).',
      'Otherwise, dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)).',
    ],
    starterCode: `public class Solution {
    /**
     * Find minimum edit distance between two strings.
     */
    public int minDistance(String word1, String word2) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'word1 = "horse", word2 = "ros"', expectedOutput: '3' },
      { input: 'word1 = "intention", word2 = "execution"', expectedOutput: '5' },
      { input: 'word1 = "", word2 = ""', expectedOutput: '0' },
      { input: 'word1 = "abc", word2 = ""', expectedOutput: '3' },
      { input: 'word1 = "abc", word2 = "abc"', expectedOutput: '0' },
    ],
  },
  {
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    categorySlug: 'dynamic-programming',
    description: `Given a string s, return the longest palindromic substring in s.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: ['1 <= s.length <= 1000', 's consists of only digits and English letters.'],
    hints: [
      'Brute force checking all substrings is O(n³). Can you do O(n²)?',
      'Expand Around Center: for each character (and each pair), expand outward while characters match.',
      'There are 2n-1 centers (n single characters + n-1 gaps between characters).',
    ],
    starterCode: `public class Solution {
    /**
     * Find the longest palindromic substring.
     */
    public String longestPalindrome(String s) {
        // Your code here
        return "";
    }
}`,
    testCases: [
      { input: 's = "babad"', expectedOutput: '"bab" or "aba"' },
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
    description: `Given weights and values of n items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack.

Each item can be used at most once (0/1 property). You cannot break an item — either include it entirely or exclude it.`,
    examples: [
      { input: 'weights = [1,3,4,5], values = [1,4,5,7], W = 7', output: '9', explanation: 'Take items with weights 3 and 4 (values 4 and 5).' },
      { input: 'weights = [2,3,4,5], values = [3,4,5,6], W = 5', output: '7', explanation: 'Take items with weights 2 and 3 (values 3 and 4).' },
    ],
    constraints: ['1 <= n <= 1000', '1 <= weights[i] <= W', '1 <= values[i] <= 1000', '1 <= W <= 1000'],
    hints: [
      'dp[i][w] = max value using first i items with capacity w.',
      'For each item: either skip it (dp[i-1][w]) or include it (dp[i-1][w-weight[i]] + value[i]).',
      'Space optimization: use a 1D array and iterate w from W down to weight[i].',
    ],
    starterCode: `public class Solution {
    /**
     * Find maximum value that fits in knapsack of capacity W.
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
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. The only constraint stopping you from robbing each of them is that adjacent houses have security systems connected — it will automatically contact the police if two adjacent houses were broken into on the same night.

Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (money = 1) and house 3 (money = 3). Total = 4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob house 1, 3, and 5. Total = 2 + 9 + 1 = 12.' },
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    hints: [
      'At each house, you either rob it (and add to the total from 2 houses back) or skip it (keep total from previous house).',
      'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).',
      'You only need the last two values — O(1) space optimization.',
    ],
    starterCode: `public class Solution {
    /**
     * Find maximum money you can rob without robbing adjacent houses.
     */
    public int rob(int[] nums) {
        // Your code here
        return 0;
    }
}`,
    testCases: [
      { input: 'nums = [1,2,3,1]', expectedOutput: '4' },
      { input: 'nums = [2,7,9,3,1]', expectedOutput: '12' },
      { input: 'nums = [2,1,1,2]', expectedOutput: '4' },
      { input: 'nums = [0]', expectedOutput: '0' },
      { input: 'nums = [100]', expectedOutput: '100' },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SLIDING WINDOW & TWO POINTERS
  // ═══════════════════════════════════════════════════════════
  {
    slug: 'minimum-window-substring',
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    category: 'Sliding Window',
    categorySlug: 'sliding-window-two-pointers',
    description: `Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".

The testcases will be generated such that the answer is unique.`,
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
      { input: 's = "a", t = "a"', output: '"a"' },
      { input: 's = "a", t = "aa"', output: '""', explanation: 'Both \'a\'s from t must be included, but s only has one.' },
    ],
    constraints: ['m == s.length, n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    hints: [
      'Use a variable-size sliding window with two pointers and a frequency map.',
      'Expand the right pointer to include characters. When all required characters are in the window, try to shrink from the left.',
      'Track how many characters are "satisfied" (count in window >= count in t) to know when the window is valid.',
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
    categorySlug: 'sliding-window-two-pointers',
    description: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window — the maximum value in each window position.`,
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Window positions: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    hints: [
      'Brute force: scan each window for max — O(nk). Can you do O(n)?',
      'Use a monotonic decreasing deque that stores indices. The front of the deque is always the max.',
      'Remove indices that fall outside the window. Remove smaller elements from the back before adding new ones.',
    ],
    starterCode: `import java.util.*;

public class Solution {
    /**
     * Return the maximum value in each sliding window of size k.
     */
    public int[] maxSlidingWindow(int[] nums, int k) {
        // Your code here
        return new int[]{};
    }
}`,
    testCases: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', expectedOutput: '[3,3,5,5,6,7]' },
      { input: 'nums = [1], k = 1', expectedOutput: '[1]' },
      { input: 'nums = [9,11], k = 2', expectedOutput: '[11]' },
      { input: 'nums = [4,-2], k = 2', expectedOutput: '[4]' },
      { input: 'nums = [7,2,4], k = 2', expectedOutput: '[7,4]' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getProblemsByCategory(categorySlug: string): Problem[] {
  return problems.filter((p) => p.categorySlug === categorySlug);
}

export function getProblemBySlug(slug: string): Problem | undefined {
  return problems.find((p) => p.slug === slug);
}

export function getCategories(): { slug: string; name: string; count: number }[] {
  const map = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of problems) {
    const existing = map.get(p.categorySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(p.categorySlug, { slug: p.categorySlug, name: p.category, count: 1 });
    }
  }
  return Array.from(map.values());
}
