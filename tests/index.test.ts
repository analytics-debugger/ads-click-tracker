import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AdsClickTracker from '../src/index'

// Mock localStorage for Node environment
function localStorageMock() {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString() },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
}

// Temporarily replace localStorage
const originalLocalStorage = globalThis.localStorage
globalThis.localStorage = localStorageMock()

describe('ads Click Tracker', () => {
  let tracker: AdsClickTracker

  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock().clear()

    // Initialize tracker with test configuration
    tracker = AdsClickTracker({
      storageKey: 'test_clicks',
      clickIdConfigs: [
        { name: 'gclid', expirationMs: 30 * 24 * 60 * 60 * 1000 }, // 30 days
        { name: 'fbclid', maxClicks: 5 }, // 5 max Facebook clicks
      ],
    })
  })

  afterEach(() => {
    // Clear tracker and localStorage after each test
    tracker.clear()
  })

  it('should initialize tracker correctly', () => {
    expect(tracker).toBeDefined()
    expect(typeof tracker.trackClick).toBe('function')
    expect(typeof tracker.getClicks).toBe('function')
    expect(typeof tracker.clear).toBe('function')
  })

  it('should track a click manually', () => {
    const timestamp = Date.now()
    tracker.trackClick('gclid', 'test_click_1', 24 * 60 * 60 * 1000)

    const clicks = tracker.getClicks('gclid')
    expect(clicks.length).toBe(1)
    expect(clicks[0].value).toBe('test_click_1')
    expect(clicks[0].timestamp).toBeGreaterThanOrEqual(timestamp)
  })

  it('should respect max clicks limit', () => {
    // Track 6 Facebook clicks (exceeding max of 5)
    for (let i = 0; i < 6; i++) {
      tracker.trackClick('fbclid', `test_click_${i}`)
    }

    const clicks = tracker.getClicks('fbclid')
    expect(clicks.length).toBe(5) // Should only keep 5 most recent clicks
    expect(clicks[0].value).toBe('test_click_1') // First click should be removed
  })

  it('should handle click expiration', () => {
    // Create a manually expired click
    tracker = new AdsClickTracker({
      storageKey: 'expired_clicks',
      clickIdConfigs: [
        { name: 'gclid', expirationMs: 30 * 24 * 60 * 60 * 1000 },
      ],
    })

    // Add an expired click
    tracker.trackClick('gclid', 'expired_click', 30 * 24 * 60 * 60 * 1000)

    const clicks = tracker.getClicks('gclid')
    expect(clicks.length).toBe(0) // Click should be removed due to expiration
  })

  it('should clear specific source clicks', () => {
    // Track clicks for two different sources
    tracker.trackClick('gclid', 'google_click_1')
    tracker.trackClick('fbclid', 'facebook_click_1')

    // Clear only Google clicks
    tracker.clear('gclid')

    const googleClicks = tracker.getClicks('gclid')
    const facebookClicks = tracker.getClicks('fbclid')

    expect(googleClicks.length).toBe(0)
    expect(facebookClicks.length).toBe(1)
  })

  it('should clear all clicks', () => {
    // Track clicks for multiple sources
    tracker.trackClick('gclid', 'google_click_1')
    tracker.trackClick('fbclid', 'facebook_click_1')

    // Clear all clicks
    tracker.clear()

    const allClicks = tracker.getClicks()
    expect(allClicks.length).toBe(0)
  })

  it('should handle multiple click tracking for the same source', () => {
    tracker.trackClick('gclid', 'click_1')
    tracker.trackClick('gclid', 'click_2')

    const clicks = tracker.getClicks('gclid')
    expect(clicks.length).toBe(2)
    expect(clicks[0].value).toBe('click_1')
    expect(clicks[1].value).toBe('click_2')
  })
})

// Restore original localStorage after tests
afterEach(() => {
  globalThis.localStorage = originalLocalStorage
})
