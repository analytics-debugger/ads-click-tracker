# 🎯 Ads Click Tracker

[![npm version](https://img.shields.io/npm/v/@analytics-debugger/ads-click-tracker)](https://www.npmjs.com/package/@analytics-debugger/ads-click-tracker)
[![bundle size](https://bundlephobia.com/package/@analytics-debugger/ads-click-tracker)](https://bundlephobia.com/package/@analytics-debugger/ads-click-tracker@latest)
[![license](https://img.shields.io/npm/l/@analytics-debugger/ads-click-tracker)](LICENSE)
[![Downloads](https://img.shields.io/npm/dm/@analytics-debugger/ads-click-tracker)](https://www.npmjs.com/package/@analytics-debugger/ads-click-tracker)

# @analytics-debugger/ads-click-tracker

A lightweight, client-side library for tracking and managing ad click IDs across user sessions.

## Features

- **💡 Comprehensive Attribution Tracking**
  - Automatically capture click IDs from various sources
  - Track landing pages and referrer URLs with precision
  - Store and manage marketing touchpoints effortlessly

- **⏰ Flexible Expiration Management**
  - Set custom expiration times for different click sources
  - Automatic cleanup of stale click data
  - Configurable click limits per source

- **🔍 Intelligent URL Parsing**
  - Detect parameters in both URL and hash fragments
  - Support for multiple click ID formats (Google, Facebook, custom UTM)

- **💾 Efficient Storage Handling**
  - Lightweight localStorage persistence
  - Automatic data management and cleanup
  - Minimal performance overhead

- **🪝  Event callbacks**
   - For onLoad, New Click Id found, Updated ClickID

- **🚀 Developer-Friendly**
  - Zero dependencies
  - Full TypeScript support
  - < 912 bytes gzipped
  - Simple, intuitive API

## Installation

```bash
npm install @analytics-debugger/ads-click-tracker
# or
yarn add @analytics-debugger/ads-click-tracker
```

## Quick Start

```javascript
import AdsClickTracker from '@analytics-debugger/ads-click-tracker'

// Initialize the tracker
const tracker = AdsClickTracker({
  debug: true,
  clickIdConfigs: [
    { name: 'gclid', ttl: 30 * 24 * 60 * 60 * 1000, maxClicks: 100 }, // Google Ads (30 days)
    { name: 'fbclid', ttl: 7 * 24 * 60 * 60 * 1000, maxClicks: 50 }, // Facebook (7 days)
    { name: 'ttclid', ttl: 14 * 24 * 60 * 60 * 1000, maxClicks: 50 }, // TikTok (14 days)
    { name: 'msclkid', ttl: 30 * 24 * 60 * 60 * 1000, maxClicks: 100 } // Microsoft (30 days)
  ],
  callbacks: {
    onLoaded: (clicks) => {
      console.log('Tracker initialized with clicks:', clicks)
    },
    onNewClickId: (click) => {
      console.log('New click ID detected:', click)
    },
    onUpdatedClickId: (click) => {
      console.log('Click ID updated:', click)
    }
  }
})

// Get all tracked clicks
const allClicks = tracker.get()

// Get only the latest click for each source
const latestClicks = tracker.get(true)

// Manually track a click
tracker.track('gclid', 'EAIaIQobChMIh76p9Y3', 2592000000) // value, expiration in ms

// Clear clicks for a specific source
tracker.clear('fbclid')

// Clear all clicks
tracker.clear()
```

## API Reference

### Initialization

```typescript
AdsClickTracker(options: TrackerOptions): AdsClickTracker
```

#### TrackerOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `storageKey` | string | `'_act_'` | Key used for localStorage |
| `clickIdConfigs` | ClickConfig[] | *required* | Array of click ID configurations |
| `debug` | boolean | `false` | Enable debug logging |
| `checkHash` | boolean | `true` | Check hash fragment for click IDs |
| `decodeValues` | boolean | `true` | URL decode click ID values |
| `callbacks` | object | `{}` | Callback functions |

#### ClickConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | *required* | Parameter name to track (e.g., 'gclid') |
| `ttl` | number | `2592000000` (30 days) | Time in milliseconds before click expires |
| `maxClicks` | number | `100` | Maximum number of clicks to store per source |

### Methods

#### get(latest?: boolean): Record<string, ClickData[]>

Get all tracked clicks. If `latest` is `true`, returns only the most recent click for each source.

#### track(source: string, value: string, ttl?: number): void

Manually track a click ID.

#### clear(source?: string): void

Clear clicks for a specific source or all sources if no source is provided.

### ClickData Structure

```typescript
interface ClickData {
  value: string // Click ID value
  timestamp: number // When the click was recorded
  expiresAt: number // When the click data expires
  landing: string // Landing page URL
  referrer: string // Referrer URL
}
```

## Use Cases

### Attribution Tracking

Track which ad campaigns are driving conversions by capturing click IDs when users arrive on your site.

```javascript
// On your conversion/thank you page
import AdsClickTracker from '@analytics-debugger/ads-click-tracker'

const tracker = AdsClickTracker({
  clickIdConfigs: [
    { name: 'gclid' },
    { name: 'fbclid' }
  ]
})

// Get the latest clicks to include in your conversion tracking
const latestClicks = tracker.get(true)

// Send this data to your analytics or CRM system
sendToAnalytics({
  conversion: true,
  value: 100,
  adClicks: latestClicks
})
```

### Integration with Forms

Automatically include ad click data in your form submissions for attribution.

```javascript
document.querySelector('#leadForm').addEventListener('submit', (event) => {
  const tracker = initTracker({
    clickIdConfigs: [
      { name: 'gclid' },
      { name: 'fbclid' },
      { name: 'ttclid' },
      { name: 'msclkid' }
    ]
  })

  const latestClicks = tracker.get(true)

  // Add hidden fields to your form with click data
  Object.entries(latestClicks).forEach(([source, clicks]) => {
    if (clicks.length > 0) {
      const hiddenField = document.createElement('input')
      hiddenField.type = 'hidden'
      hiddenField.name = source
      hiddenField.value = clicks[0].value
      event.target.appendChild(hiddenField)
    }
  })
})
```

## Browser Support

AdsClickTracker works in all modern browsers that support localStorage and ES6 features. For older browsers, consider using a transpiler like Babel.

## License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/yourusername/ads-click-tracker/issues).

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!
