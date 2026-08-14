import { SupportedLanguage, CodeSample } from '../types';

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  {
    id: 'python',
    name: 'Python',
    extension: '.py',
    monacoId: 'python',
    sampleCode: `def find_max(numbers):
    """
    Finds the maximum integer from a list of numbers.
    """
    if not numbers:
        return None
    max_value = numbers[0]
    for n in numbers:
        if n > max_value:
            max_value = n
    return max_value


# Example execution
data = [14, 58, 29, 93, 7, 42]
print(f"Max value: {find_max(data)}")`,
    samples: [
      {
        title: "Find Maximum Element (Linear O(n))",
        code: `def find_max(numbers):
    """
    Finds the maximum integer from a list of numbers.
    """
    if not numbers:
        return None
    max_value = numbers[0]
    for n in numbers:
        if n > max_value:
            max_value = n
    return max_value


data = [14, 58, 29, 93, 7, 42]
print(f"Max value: {find_max(data)}")`
      },
      {
        title: "LRU Cache (Least Recently Used)",
        code: `class Node:
    def __init__(self, key: int, val: int):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}  # map key to node
        self.left, self.right = Node(0, 0), Node(0, 0)
        self.left.next, self.right.prev = self.right, self.left

    def remove(self, node: Node):
        prev, nxt = node.prev, node.next
        prev.next, nxt.prev = nxt, prev

    def insert(self, node: Node):
        prev, nxt = self.right.prev, self.right
        prev.next = nxt.prev = node
        node.next, node.prev = nxt, prev

    def get(self, key: int) -> int:
        if key in self.cache:
            self.remove(self.cache[key])
            self.insert(self.cache[key])
            return self.cache[key].val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.remove(self.cache[key])
        self.cache[key] = Node(key, value)
        self.insert(self.cache[key])

        if len(self.cache) > self.cap:
            lru = self.left.next
            self.remove(lru)
            del self.cache[lru.key]`
      },
      {
        title: "Async Token Bucket Rate Limiter",
        code: `import time
import asyncio

class TokenBucketRateLimiter:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # tokens added per second
        self.last_update = time.monotonic()
        self._lock = asyncio.Lock()

    async def acquire(self, tokens: int = 1) -> bool:
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self.last_update
            self.last_update = now
            
            # Replenish tokens based on elapsed time
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            return False`
      },
      {
        title: "Merge Intervals (Greedy O(n log n))",
        code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """
    Given an array of intervals [start, end], merge all overlapping intervals.
    """
    if not intervals:
        return []

    # Sort intervals by starting time
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for current in intervals[1:]:
        prev = merged[-1]
        if current[0] <= prev[1]:
            # Overlap detected: merge by taking maximum end time
            prev[1] = max(prev[1], current[1])
        else:
            merged.append(current)

    return merged

# Example
sample = [[1, 3], [2, 6], [8, 10], [15, 18]]
print("Merged:", merge_intervals(sample))`
      },
      {
        title: "Vulnerable SQL & Secret Risk Pattern",
        code: `import sqlite3

def authenticate_user(username: str, password_hash: str):
    # WARNING: Vulnerable to SQL Injection and Hardcoded Secret!
    JWT_SECRET_KEY = "SUPER_SECRET_UNSECURE_DEFAULT_KEY_12345"
    
    conn = sqlite3.connect("app_database.db")
    cursor = conn.cursor()
    
    # Flaw: String formatting instead of parameterized query
    query = f"SELECT id, username, email FROM users WHERE username = '{username}' AND password = '{password_hash}'"
    cursor.execute(query)
    
    user = cursor.fetchone()
    conn.close()
    return user`
      },
      {
        title: "Graph Breadth-First Search (BFS)",
        code: `from collections import deque

def shortest_path_bfs(graph: dict, start_node: str, target_node: str):
    """
    Finds the shortest unweighted path between start_node and target_node.
    """
    queue = deque([[start_node]])
    visited = {start_node}

    while queue:
        path = queue.popleft()
        current = path[-1]

        if current == target_node:
            return path

        for neighbor in graph.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                new_path = list(path)
                new_path.append(neighbor)
                queue.append(new_path)

    return None

# Graph adjacency list
network = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
print("Shortest path A->F:", shortest_path_bfs(network, 'A', 'F'))`
      },
      {
        title: "Recursive Fibonacci with Memoization (DP)",
        code: `def fibonacci_memo(n: int, memo: dict = None) -> int:
    """
    Calculates the nth Fibonacci number in O(n) time and O(n) space.
    """
    if memo is None:
        memo = {}
        
    if n in memo:
        return memo[n]
    if n <= 0:
        return 0
    if n == 1:
        return 1
        
    memo[n] = fibonacci_memo(n - 1, memo) + fibonacci_memo(n - 2, memo)
    return memo[n]

print([fibonacci_memo(i) for i in range(10)])`
      }
    ]
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    extension: '.js',
    monacoId: 'javascript',
    sampleCode: `// Two Sum problem - finds two indices that add up to target
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const numbers = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(numbers, target));`,
    samples: [
      {
        title: "Two Sum Hash Map (O(n) Time)",
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`
      },
      {
        title: "Custom Promise.all Implementation",
        code: `function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }
        
        const results = [];
        let completed = 0;
        
        if (promises.length === 0) {
            return resolve(results);
        }

        promises.forEach((p, index) => {
            Promise.resolve(p)
                .then((value) => {
                    results[index] = value;
                    completed += 1;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject);
        });
    });
}`
      },
      {
        title: "Debounce Function with Immediate Trigger",
        code: `function debounce(func, wait, immediate = false) {
    let timeout;
    
    return function executedFunction(...args) {
        const context = this;
        const callNow = immediate && !timeout;
        
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        
        if (callNow) func.apply(context, args);
    };
}`
      },
      {
        title: "Deep Object Clone (Circular Reference Safe)",
        code: `function deepClone(obj, hash = new WeakMap()) {
    if (Object(obj) !== obj) return obj; // Primitives
    if (hash.has(obj)) return hash.get(obj); // Circular reference
    
    const result = Array.isArray(obj) 
        ? [] 
        : obj.constructor ? new obj.constructor() : Object.create(null);
        
    hash.set(obj, result);
    
    for (const key of Reflect.ownKeys(obj)) {
        result[key] = (typeof obj[key] === 'object' && obj[key] !== null)
            ? deepClone(obj[key], hash)
            : obj[key];
    }
    return result;
}`
      },
      {
        title: "Event Emitter Pub/Sub Pattern",
        code: `class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, new Set());
        }
        this.events.get(event).add(listener);
        return () => this.off(event, listener);
    }

    off(event, listener) {
        if (this.events.has(event)) {
            this.events.get(event).delete(listener);
        }
    }

    emit(event, ...args) {
        if (this.events.has(event)) {
            for (const listener of this.events.get(event)) {
                listener(...args);
            }
        }
    }
}`
      },
      {
        title: "Async Task Retry with Exponential Backoff",
        code: `async function retryWithBackoff(fn, retries = 3, delay = 500, factor = 2) {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        
        console.warn(\`Operation failed, retrying in \${delay}ms...\`);
        await new Promise((res) => setTimeout(res, delay));
        return retryWithBackoff(fn, retries - 1, delay * factor, factor);
    }
}`
      }
    ]
  },
  {
    id: 'java',
    name: 'Java',
    extension: '.java',
    monacoId: 'java',
    sampleCode: `public class BinarySearch {
    public static int search(int[] array, int target) {
        int left = 0;
        int right = array.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (array[mid] == target) {
                return mid;
            } else if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] sorted = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
        System.out.println("Index: " + search(sorted, 23));
    }
}`,
    samples: [
      {
        title: "Binary Search (O(log n))",
        code: `public class BinarySearch {
    public static int search(int[] array, int target) {
        int left = 0;
        int right = array.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (array[mid] == target) {
                return mid;
            } else if (array[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}`
      },
      {
        title: "Thread-Safe Singleton Double-Checked Locking",
        code: `public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;
    private final String connectionString;

    private DatabaseConnectionPool() {
        this.connectionString = "jdbc:postgresql://localhost:5432/production_db";
    }

    public static DatabaseConnectionPool getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
}`
      }
    ]
  },
  {
    id: 'c',
    name: 'C',
    extension: '.c',
    monacoId: 'c',
    sampleCode: `#include <stdio.h>
#include <string.h>

void reverseString(char str[]) {
    int n = strlen(str);
    for (int i = 0; i < n / 2; i++) {
        char temp = str[i];
        str[i] = str[n - i - 1];
        str[n - i - 1] = temp;
    }
}

int main() {
    char greeting[] = "CodeLens AI";
    reverseString(greeting);
    printf("Reversed: %s\\n", greeting);
    return 0;
}`,
    samples: [
      {
        title: "String In-Place Reversal (O(n))",
        code: `#include <stdio.h>
#include <string.h>

void reverseString(char str[]) {
    int n = strlen(str);
    for (int i = 0; i < n / 2; i++) {
        char temp = str[i];
        str[i] = str[n - i - 1];
        str[n - i - 1] = temp;
    }
}`
      }
    ]
  },
  {
    id: 'cpp',
    name: 'C++',
    extension: '.cpp',
    monacoId: 'cpp',
    sampleCode: `#include <iostream>
#include <vector>
#include <algorithm>

class QuickSort {
public:
    static void sort(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

private:
    static int partition(std::vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        return (i + 1);
    }
};`,
    samples: [
      {
        title: "In-Place QuickSort (O(n log n))",
        code: `#include <iostream>
#include <vector>
#include <algorithm>

class QuickSort {
public:
    static void sort(std::vector<int>& arr, int low, int high) {
        if (low < high) {
            int pi = partition(arr, low, high);
            sort(arr, low, pi - 1);
            sort(arr, pi + 1, high);
        }
    }

private:
    static int partition(std::vector<int>& arr, int low, int high) {
        int pivot = arr[high];
        int i = (low - 1);
        for (int j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                std::swap(arr[i], arr[j]);
            }
        }
        std::swap(arr[i + 1], arr[high]);
        return (i + 1);
    }
};`
      }
    ]
  },
  {
    id: 'html',
    name: 'HTML',
    extension: '.html',
    monacoId: 'html',
    sampleCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Hero Section</title>
</head>
<body>
    <header class="navbar">
        <div class="logo">CodeLens AI</div>
        <nav>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
        </nav>
    </header>
</body>
</html>`
  },
  {
    id: 'css',
    name: 'CSS',
    extension: '.css',
    monacoId: 'css',
    sampleCode: `:root {
    --primary: #6366f1;
    --primary-hover: #4f46e5;
    --background: #090d16;
}

.hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15), transparent 70%);
}`
  },
  {
    id: 'sql',
    name: 'SQL',
    extension: '.sql',
    monacoId: 'sql',
    sampleCode: `-- Retrieve top performing engineers with active repository contributions
WITH UserContributions AS (
    SELECT 
        u.id AS user_id,
        u.username,
        u.email,
        COUNT(c.id) AS total_commits,
        SUM(c.additions - c.deletions) AS net_lines_changed
    FROM users u
    INNER JOIN commits c ON u.id = c.author_id
    WHERE c.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY u.id, u.username, u.email
)
SELECT 
    user_id,
    username,
    email,
    total_commits,
    net_lines_changed,
    DENSE_RANK() OVER (ORDER BY total_commits DESC) as rank
FROM UserContributions
WHERE total_commits > 10
ORDER BY total_commits DESC;`
  }
];

export const getLanguageById = (id: string): SupportedLanguage => {
  return SUPPORTED_LANGUAGES.find(l => l.id.toLowerCase() === id.toLowerCase()) || SUPPORTED_LANGUAGES[0];
};

export const getRandomSample = (languageId: string, currentCode?: string): { title: string; code: string } => {
  const langConfig = getLanguageById(languageId);
  const sampleList: CodeSample[] = langConfig.samples && langConfig.samples.length > 0
    ? langConfig.samples
    : [{ title: `${langConfig.name} Demo Snippet`, code: langConfig.sampleCode }];

  if (sampleList.length === 1) {
    return sampleList[0];
  }

  // Filter out current code to avoid picking the same consecutive sample
  const candidates = sampleList.filter(s => s.code.trim() !== (currentCode || '').trim());
  const pool = candidates.length > 0 ? candidates : sampleList;
  
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
};
