interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map()
  private readonly WINDOW_MS = 60 * 1000 // 1 minute
  private readonly MAX_REQUESTS = 100 // 100 requests per minute per IP

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const entry = this.limits.get(identifier)

    if (!entry || now > entry.resetTime) {
      // Create new entry
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      })
      return true
    }

    // Increment counter
    entry.count++
    return entry.count <= this.MAX_REQUESTS
  }

  getRemaining(identifier: string): number {
    const entry = this.limits.get(identifier)
    if (!entry || Date.now() > entry.resetTime) {
      return this.MAX_REQUESTS
    }
    return Math.max(0, this.MAX_REQUESTS - entry.count)
  }
}

const globalForRateLimit = global as unknown as { rateLimiter: RateLimiter }
export const rateLimiter = globalForRateLimit.rateLimiter || new RateLimiter()

if (process.env.NODE_ENV === 'development') {
  globalForRateLimit.rateLimiter = rateLimiter
}
