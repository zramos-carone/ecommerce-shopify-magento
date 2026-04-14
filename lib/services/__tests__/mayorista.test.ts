import { searchAllMayoristas } from '../mayoristas'
import { SearchQuery } from '../../types/mayorista'
import { cache } from '../cache'

describe('Mayorista Search', () => {
  beforeEach(() => {
    cache.clear()
  })

  test('should search and return products', async () => {
    const result = await searchAllMayoristas({})
    expect(result.products.length).toBeGreaterThan(0)
    expect(result.total).toBeGreaterThan(0)
  })

  test('should search by text query', async () => {
    const result = await searchAllMayoristas({ q: 'laptop' })
    expect(result.products.length).toBeGreaterThan(0)
    result.products.forEach((product) => {
      expect(
        product.name.toLowerCase().includes('laptop') ||
        product.description?.toLowerCase().includes('laptop')
      ).toBe(true)
    })
  })

  test('should filter by price range', async () => {
    const result = await searchAllMayoristas({
      minPrice: 500,
      maxPrice: 1500,
    })

    result.products.forEach((product) => {
      expect(product.price).toBeGreaterThanOrEqual(500)
      expect(product.price).toBeLessThanOrEqual(1500)
    })
  })

  test('should filter by brand', async () => {
    const result = await searchAllMayoristas({ brand: 'Dell' })

    if (result.products.length > 0) {
      result.products.forEach((product) => {
        expect(product.brand?.toLowerCase()).toBe('dell')
      })
    }
  })

  test('should filter by stock availability', async () => {
    const result = await searchAllMayoristas({ minStock: 50 })

    result.products.forEach((product) => {
      expect(product.stock).toBeGreaterThanOrEqual(50)
    })
  })

  test('should filter by rating', async () => {
    const result = await searchAllMayoristas({ minRating: 4.5 })

    result.products.forEach((product) => {
      if (product.rating) {
        expect(product.rating).toBeGreaterThanOrEqual(4.5)
      }
    })
  })

  test('should handle pagination', async () => {
    const page1 = await searchAllMayoristas({ page: 1, limit: 5 })
    const page2 = await searchAllMayoristas({ page: 2, limit: 5 })

    expect(page1.products.length).toBeLessThanOrEqual(5)
    expect(page2.page).toBe(2)
    expect(page2.limit).toBe(5)

    if (page1.products.length > 0 && page2.products.length > 0) {
      expect(page1.products[0].id).not.toBe(page2.products[0].id)
    }
  })

  test('should sort by price ascending', async () => {
    const result = await searchAllMayoristas({})

    for (let i = 0; i < result.products.length - 1; i++) {
      expect(result.products[i].price).toBeLessThanOrEqual(result.products[i + 1].price)
    }
  })

  test('should show pagination metadata', async () => {
    const result = await searchAllMayoristas({ page: 1, limit: 5 })

    expect(result.page).toBe(1)
    expect(result.limit).toBe(5)
    expect(typeof result.hasMore).toBe('boolean')
    expect(result.mayoristas).toHaveProperty('ingram')
    expect(result.mayoristas).toHaveProperty('distribuido')
    expect(result.mayoristas).toHaveProperty('synnex')
  })

  test('should use cache for repeated queries', async () => {
    const query: SearchQuery = { q: 'laptop' }

    const result1 = await searchAllMayoristas(query)
    const result2 = await searchAllMayoristas(query)

    expect(result1.timestamp).toBe(result2.timestamp)
    expect(cache.size()).toBeGreaterThan(0)
  })
})
