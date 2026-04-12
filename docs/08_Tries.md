# Tries (Prefix Trees)

## 1. Trie Fundamentals

A **Trie** (pronounced "try") is a tree-like data structure for efficiently storing and retrieving strings by their prefixes. Each node represents a single character, and paths from root to marked nodes form complete words.

```
Insert: "app", "apple", "apt", "bat"

         (root)
        /      \
       a        b
       |        |
       p        a
      / \       |
     p   t*     t*
     |
     l
     |
     e*

  * = end of word
```

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

```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}
```

- **Pros**: O(1) child access, simple indexing
- **Cons**: Wastes space if alphabet is large or children are sparse
- **Space per node**: 26 pointers + boolean ≈ 208 bytes (on 64-bit JVM)

### HashMap-Based Children

```java
class TrieNode {
    Map<Character, TrieNode> children = new HashMap<>();
    boolean isEndOfWord = false;
}
```

- **Pros**: Memory-efficient for sparse nodes, supports any character set
- **Cons**: Slightly slower due to hashing overhead
- **Best for**: Unicode, mixed-case, or large alphabets

> **Interview default**: Use array-based for lowercase English letters. Mention HashMap-based as an alternative.

---

## 3. Complete Trie Implementation

```java
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
```

---

## 4. Operations Complexity

| Operation | Time | Space |
|-----------|------|-------|
| `insert(word)` | O(m) | O(m) worst case — creates m new nodes |
| `search(word)` | O(m) | O(1) |
| `startsWith(prefix)` | O(m) | O(1) |
| `delete(word)` | O(m) | O(m) — recursion stack |
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

```
Standard Trie:           Compressed Trie:

     (root)                  (root)
       |                    /     \
       r                 "romane" "rub"
       o                    |     / \
       m                  "us"  "er" "ic"
       a                        |     |
       n                       "s"   "on"
      / \
     e   u
          |
          s

Words: romane, romanus, ruber, rubicon, rubric
```

### When to Use

- **Large datasets** with many shared prefixes (IP routing tables, file systems)
- **Memory-constrained** environments
- Harder to implement — usually not required in coding interviews

---

## 6. Applications and Interview Patterns

### Autocomplete System

```java
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
```

### Word Search II (Trie + DFS on Grid)

Find all words from a dictionary that exist in a character grid.

```java
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
```

> **Key insight**: Using a Trie to prune the DFS. Instead of searching for each word independently (O(words × cells × 4^L)), we search once, guided by the Trie.

### Word Break Problem

Determine if a string can be segmented into dictionary words.

```java
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
```

### Replace Words (Prefix Replacement)

Replace words in a sentence with their shortest root from a dictionary.

```java
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
```

### Implement a Spell Checker

Find words within edit distance 1 (simplified).

```java
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
```

### Map Sum Pairs

```java
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
```

---

## 7. Trie with Additional Node Data

Depending on the problem, you may store extra data at each node:

```java
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
```

### Counting Words with a Given Prefix

```java
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
```

---

## 8. Collecting All Words with a Prefix

```java
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
```

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

- **Simple exact lookups**: `HashSet` is simpler and equally fast
- **Small dictionaries**: Overhead of trie nodes outweighs benefits
- **No prefix queries**: If you never need `startsWith`, use a set

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
2. **Decide what to store at each node**: `isEnd`, `word`, `count`, etc.
3. **Handle edge cases**: Empty string, single character, duplicate insertions
4. **Consider deletion**: Do you need it? It adds complexity
5. **Optimize**: Prune dead branches in backtracking problems
