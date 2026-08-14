/**
 * CodeLens AI Sample File: Authentication & Utility Service
 * Language: JavaScript (.js)
 */

class TokenBucketRateLimiter {
    constructor(capacity = 60, refillPerSecond = 1) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.refillPerSecond = refillPerSecond;
        this.lastRefill = Date.now();
    }

    refill() {
        const now = Date.now();
        const deltaSeconds = (now - this.lastRefill) / 1000;
        this.tokens = Math.min(this.capacity, this.tokens + deltaSeconds * this.refillPerSecond);
        this.lastRefill = now;
    }

    tryConsume(cost = 1) {
        this.refill();
        if (this.tokens >= cost) {
            this.tokens -= cost;
            return true;
        }
        return false;
    }
}

/**
 * Two Sum Lookup with Map (O(n) Time Complexity)
 * @param {number[]} nums
 * @param {number} target
 * @returns {number[]}
 */
function twoSum(nums, target) {
    const seen = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        seen.set(nums[i], i);
    }
    return [];
}

/**
 * Debounce wrapper for high-frequency event handling
 */
function debounce(fn, delayMs = 300) {
    let timerId = null;
    return function (...args) {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delayMs);
    };
}

// Example execution
const limiter = new TokenBucketRateLimiter(5, 0.5);
console.log("Can make request 1?", limiter.tryConsume());
console.log("Two Sum indices for [2, 7, 11, 15] target 9:", twoSum([2, 7, 11, 15], 9));
