// index.ts

interface ClickConfig {
  name: string
  expirationMs?: number
  maxClicks?: number
}

interface TrackerOptions {
  storageKey?: string
  clickIdConfigs: ClickConfig[]
  debug?: boolean
  checkHash?: boolean
  decodeValues?: boolean
  callbacks?: {
    onLoaded?: (clicks: Record<string, ClickData | ClickData[]>) => void
    onNewClickId?: (click: ClickData) => void
    onUpdatedClickId?: (click: ClickData) => void
  }
}

interface ClickData {
  value: string
  timestamp: number
  expiresAt: number
  landing: string
  referrer: string
}

class AdsClickTracker {
  private clicks: Record<string, ClickData[]> = {}
  private configs: Map<string, { expires: number, max: number }> = new Map()
  private options: TrackerOptions

  constructor(options: TrackerOptions) {
    this.options = {
      storageKey: '_act_',
      debug: false,
      checkHash: true,
      decodeValues: true,
      ...options,
    }

    // Initialize configurations
    options.clickIdConfigs.forEach(({ name, expirationMs = 2592000000, maxClicks = 100 }) => {
      this.configs.set(name, { expires: expirationMs, max: maxClicks })
      this.clicks[name] = this.clicks[name] || []
    })

    this.load()
    if (typeof this.options.callbacks?.onLoaded === 'function') {
      this.options.callbacks.onLoaded(this.get(true))
    }
    this.checkUrl()
  }

  private log(msg: string): void {
    // eslint-disable-next-line no-console
    this.options.debug && console.info(`[Tracker] ${msg}`)
  }

  private load(): void {
    try {
      const data = localStorage.getItem(this.options.storageKey!)
      if (data) {
        const parsed = JSON.parse(data)
        this.configs.forEach((_, name) => {
          this.clicks[name] = Array.isArray(parsed[name]) ? parsed[name] : []
        })
      }
      this.cleanup()
    }
    catch (e) {
      this.log(`Load error: ${e}`)
    }
  }

  private save(): void {
    try {
      localStorage.setItem(this.options.storageKey!, JSON.stringify(this.clicks))
    }
    catch (e) {
      this.log(`Save error: ${e}`)
    }
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.clicks).forEach((source) => {
      if (!Array.isArray(this.clicks[source])) {
        this.clicks[source] = [] // Ensure it's always an array
      }
      const config = this.configs.get(source)
      this.clicks[source] = this.clicks[source]
        .filter(c => c && c.expiresAt > now) // Filter null/expired
        .slice(-(config?.max || 100)) // Enforce max clicks
    })
  }

  private checkUrl(): void {
    if (typeof window === 'undefined')
      return

    try {
      const url = new URL(window.location.href)
      this.processParams(url.searchParams)
      this.options.checkHash && url.hash
      && this.processParams(new URLSearchParams(url.hash.substring(1)))
    }
    catch (e) {
      this.log(`URL parse error: ${e}`)
    }
  }

  private processParams(params: URLSearchParams): void {
    this.configs.forEach((config, name) => {
      const val = params.get(name)
      if (val) {
        this.recordClick(
          name,
          this.options.decodeValues ? decodeURIComponent(val) : val,
          config.expires,
        )
      }
    })
  }

  private recordClick(source: string, value: string, expiresMs: number): void {
    const now = Date.now()
    const landing = typeof window !== 'undefined' ? window.location.href : ''
    const referrer = typeof document !== 'undefined' ? document.referrer : ''

    // Create click data object once
    const clickData = {
      value,
      timestamp: now,
      expiresAt: now + expiresMs,
      landing,
      referrer,
    }

    // Initialize array if not exists
    this.clicks[source] = this.clicks[source] || []

    // Update existing or add new
    const existingIndex = this.clicks[source].findIndex(c => c.value === value)

    if (existingIndex >= 0) {
      this.clicks[source][existingIndex] = clickData
      typeof this.options.callbacks?.onUpdatedClickId === 'function'
      && this.options.callbacks.onUpdatedClickId(clickData)
    }
    else {
      this.clicks[source].push(clickData)
      typeof this.options.callbacks?.onNewClickId === 'function'
      && this.options.callbacks.onNewClickId(clickData)
    }

    this.save()
  }

  // Public API
  track(source: string, value: string, expiresMs?: number): void {
    const config = this.configs.get(source) || { expires: expiresMs || 2592000000, max: 100 }
    this.recordClick(source, value, config.expires)
  }

  get(latest?: boolean): Record<string, ClickData[]> {
    // If latest is false or not provided, return all clicks
    if (!latest || latest !== true) {
      return this.clicks
    }

    // Helper function to get the latest click
    const getLatestClick = (clicks: ClickData[] = []): ClickData[] => {
      if (!clicks.length)
        return []

      const latest = clicks.reduce((newest, current) =>
        current.timestamp > newest.timestamp ? current : newest, clicks[0])

      return [latest]
    }

    // If latest is true, return object with arrays containing single items or empty arrays
    const result: Record<string, ClickData[]> = {}

    // Process all sources and ensure they all exist in the result
    const allSources = Array.from(this.configs.keys())

    allSources.forEach((sourceName) => {
      result[sourceName] = getLatestClick(this.clicks[sourceName])
    })

    return result
  }

  clear(source?: string): void {
    if (source) {
      this.clicks[source] = []
    }
    else {
      Object.keys(this.clicks).forEach((key) => {
        this.clicks[key] = []
      })
    }
    this.save()
  }
}

// Singleton export
let instance: AdsClickTracker
export default function initTracker(options: TrackerOptions): AdsClickTracker {
  return instance || (instance = new AdsClickTracker(options))
}
