import NodeCache from 'node-cache';

// Initialize NodeCache with a default TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 120 });

/**
 * Sets a value in the cache
 * @param key - The unique key to store the value
 * @param value - The value to cache
 * @param ttl - Optional TTL (Time to Live) in seconds for this specific key
 */
export function setCache<T>(key: string, value: T, ttl?: number): void {
    cache.set(key, value, ttl || 120);
    console.log(`Set cache for key: ${key}`);
}

/**
 * Gets a value from the cache
 * @param key - The unique key of the cached value
 * @returns The cached value or null if the key does not exist
 */
export function getCache<T>(key: string): T | null {
    const value = cache.get<T>(key);
    if (value === undefined) {
        console.log(`Cache miss for key: ${key}`);
        return null;
    }
    console.log(`Cache hit for key: ${key}`);
    return value;
}
