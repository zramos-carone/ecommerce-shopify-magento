interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // milliseconds
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear()
      return
    }

    // Clear entries matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  size(): number {
    return this.cache.size
  }
}

// Singleton instance
const globalForCache = global as unknown as { cache: CacheManager }
export const cache = globalForCache.cache || new CacheManager()

if (process.env.NODE_ENV === 'development') {
  globalForCache.cache = cache
}
