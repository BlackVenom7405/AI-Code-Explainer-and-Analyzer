"""
CodeLens AI Sample File: Algorithms & Data Structures
Language: Python (.py)
"""

from typing import List, Optional, Dict

class Node:
    def __init__(self, key: int, value: int):
        self.key = key
        self.value = value
        self.prev: Optional['Node'] = None
        self.next: Optional['Node'] = None


class LRUCache:
    """
    Least Recently Used (LRU) Cache implementation using a Doubly Linked List
    and a Hash Map for O(1) time complexity on get and put operations.
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache: Dict[int, Node] = {}
        # Sentinel dummy nodes
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node):
        """Remove an existing node from the doubly linked list."""
        prev_node = node.prev
        next_node = node.next
        if prev_node and next_node:
            prev_node.next = next_node
            next_node.prev = prev_node

    def _add_to_front(self, node: Node):
        """Insert a node right after the head sentinel."""
        node.prev = self.head
        node.next = self.head.next
        if self.head.next:
            self.head.next.prev = node
        self.head.next = node

    def get(self, key: int) -> int:
        if key in self.cache:
            node = self.cache[key]
            self._remove(node)
            self._add_to_front(node)
            return node.value
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self._remove(self.cache[key])
        
        new_node = Node(key, value)
        self.cache[key] = new_node
        self._add_to_front(new_node)

        if len(self.cache) > self.capacity:
            # Evict the least recently used node (node before tail)
            lru_node = self.tail.prev
            if lru_node and lru_node != self.head:
                self._remove(lru_node)
                del self.cache[lru_node.key]


def find_max(numbers: List[int]) -> Optional[int]:
    """
    Finds maximum value in an array with O(n) time and O(1) space.
    """
    if not numbers:
        return None
    max_val = numbers[0]
    for num in numbers[1:]:
        if num > max_val:
            max_val = num
    return max_val


# Demonstration
if __name__ == "__main__":
    cache = LRUCache(2)
    cache.put(1, 100)
    cache.put(2, 200)
    print("Get 1:", cache.get(1))  # Returns 100
    cache.put(3, 300)              # Evicts key 2
    print("Get 2 (evicted):", cache.get(2))  # Returns -1
    print("Max of list:", find_max([12, 45, 78, 23, 99, 4]))
