// ============================================================================
// test-runners.ts - Test Runner Configurations for Java Code Execution
// Maps problem slugs to their compile/run configuration with test cases.
// ============================================================================

import type { TestRunnerConfig } from '../lib/executor';

export const testRunners: Record<string, TestRunnerConfig> = {
  // ===========================================================================
  // Arrays & Strings
  // ===========================================================================

  'two-sum': {
    className: 'Solution',
    methodName: 'twoSum',
    returnType: 'int[]',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'nums = [2,7,11,15], target = 9',
        args: 'new int[]{2,7,11,15}, 9',
        expected: 'new int[]{0,1}',
        expectedDisplay: '[0, 1]',
      },
      {
        name: 'Middle elements',
        inputDisplay: 'nums = [3,2,4], target = 6',
        args: 'new int[]{3,2,4}, 6',
        expected: 'new int[]{1,2}',
        expectedDisplay: '[1, 2]',
      },
      {
        name: 'Duplicate values',
        inputDisplay: 'nums = [3,3], target = 6',
        args: 'new int[]{3,3}, 6',
        expected: 'new int[]{0,1}',
        expectedDisplay: '[0, 1]',
      },
      {
        name: 'Negative numbers',
        inputDisplay: 'nums = [-1,-2,-3,-4,-5], target = -8',
        args: 'new int[]{-1,-2,-3,-4,-5}, -8',
        expected: 'new int[]{2,4}',
        expectedDisplay: '[2, 4]',
      },
    ],
  },

  'product-except-self': {
    className: 'Solution',
    methodName: 'productExceptSelf',
    returnType: 'int[]',
    expectedComplexity: { time: 'O(n)', space: 'O(1)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'nums = [1,2,3,4]',
        args: 'new int[]{1,2,3,4}',
        expected: 'new int[]{24,12,8,6}',
        expectedDisplay: '[24, 12, 8, 6]',
      },
      {
        name: 'Contains zero',
        inputDisplay: 'nums = [-1,1,0,-3,3]',
        args: 'new int[]{-1,1,0,-3,3}',
        expected: 'new int[]{0,0,9,0,0}',
        expectedDisplay: '[0, 0, 9, 0, 0]',
      },
      {
        name: 'Two elements',
        inputDisplay: 'nums = [2,3]',
        args: 'new int[]{2,3}',
        expected: 'new int[]{3,2}',
        expectedDisplay: '[3, 2]',
      },
    ],
  },

  'merge-intervals': {
    className: 'Solution',
    methodName: 'merge',
    returnType: 'int[][]',
    expectedComplexity: { time: 'O(n log n)', space: 'O(n)' },
    tests: [
      {
        name: 'Multiple merges',
        inputDisplay: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        args: 'new int[][]{{1,3},{2,6},{8,10},{15,18}}',
        expected: 'new int[][]{{1,6},{8,10},{15,18}}',
        expectedDisplay: '[[1,6],[8,10],[15,18]]',
      },
      {
        name: 'Touching intervals',
        inputDisplay: 'intervals = [[1,4],[4,5]]',
        args: 'new int[][]{{1,4},{4,5}}',
        expected: 'new int[][]{{1,5}}',
        expectedDisplay: '[[1,5]]',
      },
      {
        name: 'Overlapping at start',
        inputDisplay: 'intervals = [[1,4],[0,4]]',
        args: 'new int[][]{{1,4},{0,4}}',
        expected: 'new int[][]{{0,4}}',
        expectedDisplay: '[[0,4]]',
      },
      {
        name: 'Single interval',
        inputDisplay: 'intervals = [[1,5]]',
        args: 'new int[][]{{1,5}}',
        expected: 'new int[][]{{1,5}}',
        expectedDisplay: '[[1,5]]',
      },
    ],
  },

  'trapping-rain-water': {
    className: 'Solution',
    methodName: 'trap',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(1)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        args: 'new int[]{0,1,0,2,1,0,1,3,2,1,2,1}',
        expected: '6',
        expectedDisplay: '6',
      },
      {
        name: 'V-shaped',
        inputDisplay: 'height = [4,2,0,3,2,5]',
        args: 'new int[]{4,2,0,3,2,5}',
        expected: '9',
        expectedDisplay: '9',
      },
      {
        name: 'Ascending - no water',
        inputDisplay: 'height = [1,2,3,4,5]',
        args: 'new int[]{1,2,3,4,5}',
        expected: '0',
        expectedDisplay: '0',
      },
      {
        name: 'Empty array',
        inputDisplay: 'height = []',
        args: 'new int[]{}',
        expected: '0',
        expectedDisplay: '0',
      },
    ],
  },

  'longest-substring-no-repeat': {
    className: 'Solution',
    methodName: 'lengthOfLongestSubstring',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(min(m,n))' },
    tests: [
      {
        name: 'Mixed repeats',
        inputDisplay: 's = "abcabcbb"',
        args: '"abcabcbb"',
        expected: '3',
        expectedDisplay: '3',
      },
      {
        name: 'All same characters',
        inputDisplay: 's = "bbbbb"',
        args: '"bbbbb"',
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'Repeat in middle',
        inputDisplay: 's = "pwwkew"',
        args: '"pwwkew"',
        expected: '3',
        expectedDisplay: '3',
      },
      {
        name: 'Empty string',
        inputDisplay: 's = ""',
        args: '""',
        expected: '0',
        expectedDisplay: '0',
      },
    ],
  },

  'container-with-most-water': {
    className: 'Solution',
    methodName: 'maxArea',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(1)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'height = [1,8,6,2,5,4,8,3,7]',
        args: 'new int[]{1,8,6,2,5,4,8,3,7}',
        expected: '49',
        expectedDisplay: '49',
      },
      {
        name: 'Two elements',
        inputDisplay: 'height = [1,1]',
        args: 'new int[]{1,1}',
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'Symmetric with tall ends',
        inputDisplay: 'height = [4,3,2,1,4]',
        args: 'new int[]{4,3,2,1,4}',
        expected: '16',
        expectedDisplay: '16',
      },
    ],
  },

  'three-sum': {
    className: 'Solution',
    methodName: 'threeSum',
    returnType: 'List<List<Integer>>',
    expectedComplexity: { time: 'O(n^2)', space: 'O(n)' },
    tests: [
      {
        name: 'Two triplets',
        inputDisplay: 'nums = [-1,0,1,2,-1,-4]',
        args: 'new int[]{-1,0,1,2,-1,-4}',
        expected: 'Arrays.asList(Arrays.asList(-1,-1,2), Arrays.asList(-1,0,1))',
        expectedDisplay: '[[-1,-1,2],[-1,0,1]]',
      },
      {
        name: 'No triplets',
        inputDisplay: 'nums = [0,1,1]',
        args: 'new int[]{0,1,1}',
        expected: 'new ArrayList<>()',
        expectedDisplay: '[]',
      },
      {
        name: 'All zeros',
        inputDisplay: 'nums = [0,0,0]',
        args: 'new int[]{0,0,0}',
        expected: 'Arrays.asList(Arrays.asList(0,0,0))',
        expectedDisplay: '[[0,0,0]]',
      },
    ],
  },

  // ===========================================================================
  // Stacks & Queues
  // ===========================================================================

  'valid-parentheses': {
    className: 'Solution',
    methodName: 'isValid',
    returnType: 'boolean',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Simple pair',
        inputDisplay: 's = "()"',
        args: '"()"',
        expected: 'true',
        expectedDisplay: 'true',
      },
      {
        name: 'Multiple bracket types',
        inputDisplay: 's = "()[]{}"',
        args: '"()[]{}"',
        expected: 'true',
        expectedDisplay: 'true',
      },
      {
        name: 'Mismatched',
        inputDisplay: 's = "(]"',
        args: '"(]"',
        expected: 'false',
        expectedDisplay: 'false',
      },
      {
        name: 'Interleaved invalid',
        inputDisplay: 's = "([)]"',
        args: '"([)]"',
        expected: 'false',
        expectedDisplay: 'false',
      },
    ],
  },

  'largest-rectangle-histogram': {
    className: 'Solution',
    methodName: 'largestRectangleArea',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'heights = [2,1,5,6,2,3]',
        args: 'new int[]{2,1,5,6,2,3}',
        expected: '10',
        expectedDisplay: '10',
      },
      {
        name: 'Two bars',
        inputDisplay: 'heights = [2,4]',
        args: 'new int[]{2,4}',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'Single bar',
        inputDisplay: 'heights = [1]',
        args: 'new int[]{1}',
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'Uniform height span',
        inputDisplay: 'heights = [2,1,2]',
        args: 'new int[]{2,1,2}',
        expected: '3',
        expectedDisplay: '3',
      },
    ],
  },

  'daily-temperatures': {
    className: 'Solution',
    methodName: 'dailyTemperatures',
    returnType: 'int[]',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Mixed temperatures',
        inputDisplay: 'temperatures = [73,74,75,71,69,72,76,73]',
        args: 'new int[]{73,74,75,71,69,72,76,73}',
        expected: 'new int[]{1,1,4,2,1,1,0,0}',
        expectedDisplay: '[1, 1, 4, 2, 1, 1, 0, 0]',
      },
      {
        name: 'Strictly increasing',
        inputDisplay: 'temperatures = [30,40,50,60]',
        args: 'new int[]{30,40,50,60}',
        expected: 'new int[]{1,1,1,0}',
        expectedDisplay: '[1, 1, 1, 0]',
      },
      {
        name: 'Short increasing',
        inputDisplay: 'temperatures = [30,60,90]',
        args: 'new int[]{30,60,90}',
        expected: 'new int[]{1,1,0}',
        expectedDisplay: '[1, 1, 0]',
      },
    ],
  },

  // ===========================================================================
  // Heaps
  // ===========================================================================

  'kth-largest-element': {
    className: 'Solution',
    methodName: 'findKthLargest',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(1)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'nums = [3,2,1,5,6,4], k = 2',
        args: 'new int[]{3,2,1,5,6,4}, 2',
        expected: '5',
        expectedDisplay: '5',
      },
      {
        name: 'Duplicates present',
        inputDisplay: 'nums = [3,2,3,1,2,4,5,5,6], k = 4',
        args: 'new int[]{3,2,3,1,2,4,5,5,6}, 4',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'Single element',
        inputDisplay: 'nums = [1], k = 1',
        args: 'new int[]{1}, 1',
        expected: '1',
        expectedDisplay: '1',
      },
    ],
  },

  'top-k-frequent-elements': {
    className: 'Solution',
    methodName: 'topKFrequent',
    returnType: 'int[]',
    sortBeforeCompare: true,
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'nums = [1,1,1,2,2,3], k = 2',
        args: 'new int[]{1,1,1,2,2,3}, 2',
        expected: 'new int[]{1,2}',
        expectedDisplay: '[1, 2]',
      },
      {
        name: 'Single element',
        inputDisplay: 'nums = [1], k = 1',
        args: 'new int[]{1}, 1',
        expected: 'new int[]{1}',
        expectedDisplay: '[1]',
      },
      {
        name: 'Clear frequency ordering',
        inputDisplay: 'nums = [1,1,1,2,2,3,3,3,3], k = 2',
        args: 'new int[]{1,1,1,2,2,3,3,3,3}, 2',
        expected: 'new int[]{1,3}',
        expectedDisplay: '[1, 3]',
      },
    ],
  },

  // ===========================================================================
  // HashMaps
  // ===========================================================================

  'subarray-sum-equals-k': {
    className: 'Solution',
    methodName: 'subarraySum',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Multiple subarrays',
        inputDisplay: 'nums = [1,1,1], k = 2',
        args: 'new int[]{1,1,1}, 2',
        expected: '2',
        expectedDisplay: '2',
      },
      {
        name: 'Contiguous sum',
        inputDisplay: 'nums = [1,2,3], k = 3',
        args: 'new int[]{1,2,3}, 3',
        expected: '2',
        expectedDisplay: '2',
      },
      {
        name: 'No matching subarray',
        inputDisplay: 'nums = [1], k = 0',
        args: 'new int[]{1}, 0',
        expected: '0',
        expectedDisplay: '0',
      },
      {
        name: 'Negatives and zeros',
        inputDisplay: 'nums = [1,-1,0], k = 0',
        args: 'new int[]{1,-1,0}, 0',
        expected: '3',
        expectedDisplay: '3',
      },
    ],
  },

  'longest-consecutive-sequence': {
    className: 'Solution',
    methodName: 'longestConsecutive',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'nums = [100,4,200,1,3,2]',
        args: 'new int[]{100,4,200,1,3,2}',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'Long consecutive run',
        inputDisplay: 'nums = [0,3,7,2,5,8,4,6,0,1]',
        args: 'new int[]{0,3,7,2,5,8,4,6,0,1}',
        expected: '9',
        expectedDisplay: '9',
      },
      {
        name: 'Empty array',
        inputDisplay: 'nums = []',
        args: 'new int[]{}',
        expected: '0',
        expectedDisplay: '0',
      },
      {
        name: 'Single element',
        inputDisplay: 'nums = [7]',
        args: 'new int[]{7}',
        expected: '1',
        expectedDisplay: '1',
      },
    ],
  },

  // ===========================================================================
  // Graphs
  // ===========================================================================

  'number-of-islands': {
    className: 'Solution',
    methodName: 'numIslands',
    returnType: 'int',
    expectedComplexity: { time: 'O(m*n)', space: 'O(m*n)' },
    tests: [
      {
        name: 'Single island',
        inputDisplay: 'grid 4x5 with one connected land mass',
        args: `new char[][]{{'1','1','1','1','0'},{'1','1','0','1','0'},{'1','1','0','0','0'},{'0','0','0','0','0'}}`,
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'Three islands',
        inputDisplay: 'grid 4x5 with three separate land masses',
        args: `new char[][]{{'1','1','0','0','0'},{'1','1','0','0','0'},{'0','0','1','0','0'},{'0','0','0','1','1'}}`,
        expected: '3',
        expectedDisplay: '3',
      },
      {
        name: 'Single cell island',
        inputDisplay: 'grid = [["1"]]',
        args: `new char[][]{{'1'}}`,
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'All water',
        inputDisplay: 'grid = [["0","0"],["0","0"]]',
        args: `new char[][]{{'0','0'},{'0','0'}}`,
        expected: '0',
        expectedDisplay: '0',
      },
    ],
  },

  'course-schedule': {
    className: 'Solution',
    methodName: 'canFinish',
    returnType: 'boolean',
    expectedComplexity: { time: 'O(V+E)', space: 'O(V+E)' },
    tests: [
      {
        name: 'Simple prerequisite',
        inputDisplay: 'numCourses = 2, prerequisites = [[1,0]]',
        args: '2, new int[][]{{1,0}}',
        expected: 'true',
        expectedDisplay: 'true',
      },
      {
        name: 'Circular dependency',
        inputDisplay: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        args: '2, new int[][]{{1,0},{0,1}}',
        expected: 'false',
        expectedDisplay: 'false',
      },
      {
        name: 'Chain of prerequisites',
        inputDisplay: 'numCourses = 3, prerequisites = [[1,0],[2,1]]',
        args: '3, new int[][]{{1,0},{2,1}}',
        expected: 'true',
        expectedDisplay: 'true',
      },
      {
        name: 'No prerequisites',
        inputDisplay: 'numCourses = 1, prerequisites = []',
        args: '1, new int[][]{}',
        expected: 'true',
        expectedDisplay: 'true',
      },
    ],
  },

  // ===========================================================================
  // Union-Find
  // ===========================================================================

  'number-connected-components': {
    className: 'Solution',
    methodName: 'countComponents',
    returnType: 'int',
    expectedComplexity: { time: 'O(V+E)', space: 'O(V)' },
    tests: [
      {
        name: 'Two components',
        inputDisplay: 'n = 5, edges = [[0,1],[1,2],[3,4]]',
        args: '5, new int[][]{{0,1},{1,2},{3,4}}',
        expected: '2',
        expectedDisplay: '2',
      },
      {
        name: 'All connected',
        inputDisplay: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]',
        args: '5, new int[][]{{0,1},{1,2},{2,3},{3,4}}',
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'No edges - all isolated',
        inputDisplay: 'n = 3, edges = []',
        args: '3, new int[][]{}',
        expected: '3',
        expectedDisplay: '3',
      },
    ],
  },

  'redundant-connection': {
    className: 'Solution',
    methodName: 'findRedundantConnection',
    returnType: 'int[]',
    expectedComplexity: { time: 'O(n)', space: 'O(n)' },
    tests: [
      {
        name: 'Triangle cycle',
        inputDisplay: 'edges = [[1,2],[1,3],[2,3]]',
        args: 'new int[][]{{1,2},{1,3},{2,3}}',
        expected: 'new int[]{2,3}',
        expectedDisplay: '[2, 3]',
      },
      {
        name: 'Longer cycle',
        inputDisplay: 'edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]',
        args: 'new int[][]{{1,2},{2,3},{3,4},{1,4},{1,5}}',
        expected: 'new int[]{1,4}',
        expectedDisplay: '[1, 4]',
      },
      {
        name: 'Last edge creates cycle',
        inputDisplay: 'edges = [[1,2],[1,3],[1,4],[3,4]]',
        args: 'new int[][]{{1,2},{1,3},{1,4},{3,4}}',
        expected: 'new int[]{3,4}',
        expectedDisplay: '[3, 4]',
      },
    ],
  },

  // ===========================================================================
  // Dynamic Programming
  // ===========================================================================

  'longest-increasing-subsequence': {
    className: 'Solution',
    methodName: 'lengthOfLIS',
    returnType: 'int',
    expectedComplexity: { time: 'O(n log n)', space: 'O(n)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'nums = [10,9,2,5,3,7,101,18]',
        args: 'new int[]{10,9,2,5,3,7,101,18}',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'Partially increasing',
        inputDisplay: 'nums = [0,1,0,3,2,3]',
        args: 'new int[]{0,1,0,3,2,3}',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'All same values',
        inputDisplay: 'nums = [7,7,7,7,7]',
        args: 'new int[]{7,7,7,7,7}',
        expected: '1',
        expectedDisplay: '1',
      },
      {
        name: 'Already sorted',
        inputDisplay: 'nums = [1,2,3,4,5]',
        args: 'new int[]{1,2,3,4,5}',
        expected: '5',
        expectedDisplay: '5',
      },
    ],
  },

  'coin-change': {
    className: 'Solution',
    methodName: 'coinChange',
    returnType: 'int',
    expectedComplexity: { time: 'O(n*amount)', space: 'O(amount)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'coins = [1,2,5], amount = 11',
        args: 'new int[]{1,2,5}, 11',
        expected: '3',
        expectedDisplay: '3',
      },
      {
        name: 'Impossible amount',
        inputDisplay: 'coins = [2], amount = 3',
        args: 'new int[]{2}, 3',
        expected: '-1',
        expectedDisplay: '-1',
      },
      {
        name: 'Zero amount',
        inputDisplay: 'coins = [1], amount = 0',
        args: 'new int[]{1}, 0',
        expected: '0',
        expectedDisplay: '0',
      },
      {
        name: 'Exact denomination',
        inputDisplay: 'coins = [1,5,10,25], amount = 30',
        args: 'new int[]{1,5,10,25}, 30',
        expected: '2',
        expectedDisplay: '2',
      },
    ],
  },

  'edit-distance': {
    className: 'Solution',
    methodName: 'minDistance',
    returnType: 'int',
    expectedComplexity: { time: 'O(m*n)', space: 'O(m*n)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'word1 = "horse", word2 = "ros"',
        args: '"horse", "ros"',
        expected: '3',
        expectedDisplay: '3',
      },
      {
        name: 'Longer words',
        inputDisplay: 'word1 = "intention", word2 = "execution"',
        args: '"intention", "execution"',
        expected: '5',
        expectedDisplay: '5',
      },
      {
        name: 'Empty to non-empty',
        inputDisplay: 'word1 = "", word2 = "abc"',
        args: '"", "abc"',
        expected: '3',
        expectedDisplay: '3',
      },
      {
        name: 'Identical strings',
        inputDisplay: 'word1 = "abc", word2 = "abc"',
        args: '"abc", "abc"',
        expected: '0',
        expectedDisplay: '0',
      },
    ],
  },

  'longest-palindromic-substring': {
    className: 'Solution',
    methodName: 'longestPalindrome',
    returnType: 'String',
    expectedComplexity: { time: 'O(n^2)', space: 'O(1)' },
    tests: [
      {
        name: 'Even-length palindrome',
        inputDisplay: 's = "cbbd"',
        args: '"cbbd"',
        expected: '"bb"',
        expectedDisplay: 'bb',
      },
      {
        name: 'Single character',
        inputDisplay: 's = "a"',
        args: '"a"',
        expected: '"a"',
        expectedDisplay: 'a',
      },
      {
        name: 'Entire string is palindrome',
        inputDisplay: 's = "racecar"',
        args: '"racecar"',
        expected: '"racecar"',
        expectedDisplay: 'racecar',
      },
      {
        name: 'Odd-length palindrome',
        inputDisplay: 's = "bananas"',
        args: '"bananas"',
        expected: '"anana"',
        expectedDisplay: 'anana',
      },
    ],
  },

  'knapsack-problem': {
    className: 'Solution',
    methodName: 'knapsack',
    returnType: 'int',
    expectedComplexity: { time: 'O(n*W)', space: 'O(n*W)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'weights = [1,2,3], values = [6,10,12], capacity = 5',
        args: 'new int[]{1,2,3}, new int[]{6,10,12}, 5',
        expected: '22',
        expectedDisplay: '22',
      },
      {
        name: 'Must choose subset',
        inputDisplay: 'weights = [2,3,4,5], values = [3,4,5,6], capacity = 5',
        args: 'new int[]{2,3,4,5}, new int[]{3,4,5,6}, 5',
        expected: '7',
        expectedDisplay: '7',
      },
      {
        name: 'Classic weights and values',
        inputDisplay: 'weights = [10,20,30], values = [60,100,120], capacity = 50',
        args: 'new int[]{10,20,30}, new int[]{60,100,120}, 50',
        expected: '220',
        expectedDisplay: '220',
      },
      {
        name: 'Zero capacity',
        inputDisplay: 'weights = [1], values = [1], capacity = 0',
        args: 'new int[]{1}, new int[]{1}, 0',
        expected: '0',
        expectedDisplay: '0',
      },
    ],
  },

  'house-robber': {
    className: 'Solution',
    methodName: 'rob',
    returnType: 'int',
    expectedComplexity: { time: 'O(n)', space: 'O(1)' },
    tests: [
      {
        name: 'Basic case',
        inputDisplay: 'nums = [1,2,3,1]',
        args: 'new int[]{1,2,3,1}',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'Alternating high values',
        inputDisplay: 'nums = [2,7,9,3,1]',
        args: 'new int[]{2,7,9,3,1}',
        expected: '12',
        expectedDisplay: '12',
      },
      {
        name: 'Symmetric values',
        inputDisplay: 'nums = [2,1,1,2]',
        args: 'new int[]{2,1,1,2}',
        expected: '4',
        expectedDisplay: '4',
      },
      {
        name: 'Single house',
        inputDisplay: 'nums = [5]',
        args: 'new int[]{5}',
        expected: '5',
        expectedDisplay: '5',
      },
    ],
  },

  // ===========================================================================
  // Sliding Window
  // ===========================================================================

  'minimum-window-substring': {
    className: 'Solution',
    methodName: 'minWindow',
    returnType: 'String',
    expectedComplexity: { time: 'O(m+n)', space: 'O(m+n)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 's = "ADOBECODEBANC", t = "ABC"',
        args: '"ADOBECODEBANC", "ABC"',
        expected: '"BANC"',
        expectedDisplay: 'BANC',
      },
      {
        name: 'Exact match',
        inputDisplay: 's = "a", t = "a"',
        args: '"a", "a"',
        expected: '"a"',
        expectedDisplay: 'a',
      },
      {
        name: 'No valid window',
        inputDisplay: 's = "a", t = "aa"',
        args: '"a", "aa"',
        expected: '""',
        expectedDisplay: '(empty)',
      },
      {
        name: 'Whole string is window',
        inputDisplay: 's = "abc", t = "cba"',
        args: '"abc", "cba"',
        expected: '"abc"',
        expectedDisplay: 'abc',
      },
    ],
  },

  'sliding-window-maximum': {
    className: 'Solution',
    methodName: 'maxSlidingWindow',
    returnType: 'int[]',
    expectedComplexity: { time: 'O(n)', space: 'O(k)' },
    tests: [
      {
        name: 'Classic case',
        inputDisplay: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        args: 'new int[]{1,3,-1,-3,5,3,6,7}, 3',
        expected: 'new int[]{3,3,5,5,6,7}',
        expectedDisplay: '[3, 3, 5, 5, 6, 7]',
      },
      {
        name: 'Window size 1',
        inputDisplay: 'nums = [1,-1], k = 1',
        args: 'new int[]{1,-1}, 1',
        expected: 'new int[]{1,-1}',
        expectedDisplay: '[1, -1]',
      },
      {
        name: 'Single element',
        inputDisplay: 'nums = [1], k = 1',
        args: 'new int[]{1}, 1',
        expected: 'new int[]{1}',
        expectedDisplay: '[1]',
      },
      {
        name: 'Window covers entire array',
        inputDisplay: 'nums = [9,11], k = 2',
        args: 'new int[]{9,11}, 2',
        expected: 'new int[]{11}',
        expectedDisplay: '[11]',
      },
    ],
  },
};

// =============================================================================
// Lookup helpers
// =============================================================================

export function getTestRunner(slug: string): TestRunnerConfig | undefined {
  return testRunners[slug];
}

export function hasTestRunner(slug: string): boolean {
  return slug in testRunners;
}
