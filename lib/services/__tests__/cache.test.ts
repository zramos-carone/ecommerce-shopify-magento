import { cache } from '../cache'

describe('Cache Manager', () => {
  beforeEach(() => {
    cache.clear()
  })

  test('should store and retrieve data', () => {
    const data = { id: 1, name: 'Test' }
    cache.set('test-key', data)

    const retrieved = cache.get('test-key')
    expect(retrieved).toEqual(data)
  })

  test('should return null for expired entries', async () => {
    const data = { id: 1, name: 'Test' }
    cache.set('test-key', data, 100) // 100ms TTL

    await new Promise((resolve) => setTimeout(resolve, 150))

    const retrieved = cache.get('test-key')
    expect(retrieved).toBeNull()
  })

  test('should clear by pattern', () => {
    cache.set('search:laptop', { results: [] })
    cache.set('search:desktop', { results: [] })
    cache.set('user:123', { name: 'John' })

    cache.clear('search:')

    expect(cache.get('search:laptop')).toBeNull()
    expect(cache.get('search:desktop')).toBeNull()
    expect(cache.get('user:123')).not.toBeNull()
  })

  test('should track cache size', () => {
    expect(cache.size()).toBe(0)

    cache.set('key1', { data: 1 })
    cache.set('key2', { data: 2 })

    expect(cache.size()).toBe(2)

    cache.clear()
    expect(cache.size()).toBe(0)
  })
})
