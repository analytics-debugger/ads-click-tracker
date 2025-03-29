# 🎯 Ads Click Tracker

[![npm version](https://img.shields.io/npm/v/ads-click-tracker)](https://www.npmjs.com/package/ads-click-tracker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/ads-click-tracker)](https://bundlephobia.com/package/ads-click-tracker)
[![license](https://img.shields.io/npm/l/ads-click-tracker)](LICENSE)
[![Downloads](https://img.shields.io/npm/dm/ads-click-tracker)](https://www.npmjs.com/package/ads-click-tracker)

## 📖 Overview

Ads Click Tracker is a powerful, lightweight solution for marketing attribution tracking that simplifies the complexity of capturing and managing click data across multiple advertising platforms.

## 🌟 Key Features

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

- **🚀 Developer-Friendly**
  - Zero dependencies
  - Full TypeScript support
  - < 912 bytes gzipped
  - Simple, intuitive API

## 🔧 Installation

```bash
# npm
npm install ads-click-tracker

# Yarn
yarn add ads-click-tracker

# pnpm
pnpm add ads-click-tracker
```

## 💻 Quick Start

### Basic Usage

```javascript
import { initTracker } from 'ads-click-tracker'

// Initialize with multiple click ID configurations
const tracker = initTracker({
  clickIdConfigs: [
    { name: 'gclid', expirationMs: 30 * 24 * 60 * 60 * 1000 }, // 30 days for Google Ads
    { name: 'fbclid', maxClicks: 50 } // 50 clicks limit for Facebook
  ],
  debug: true // Enable console logging
})

// Manually track a click
tracker.trackClick('affiliate', 'ref123', 24 * 60 * 60 * 1000) // 1 day expiration

// Retrieve tracked clicks
const googleClicks = tracker.getClicks('gclid')
```

## 📊 Click Data Structure

Each tracked click includes:

```typescript
interface TrackedClick {
  value: string // Click ID (e.g., "abc123")
  timestamp: number // Recording timestamp (milliseconds)
  expiresAt: number // Expiration timestamp (milliseconds)
  landing: string // Landing page URL
  referrer: string // Referring URL
}
```

## ⚙️ Configuration Options

### `initTracker(options)`

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `storageKey` | `string` | Custom storage key in localStorage | `'_ads_clicks'` |
| `clickIdConfigs` | `ClickConfig[]` | Click ID tracking configurations | `[]` |
| `debug` | `boolean` | Enable debug logging | `false` |

### `ClickConfig`

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Parameter name (e.g., 'gclid') |
| `expirationMs` | `number?` | Expiration time in milliseconds |
| `maxClicks` | `number?` | Maximum number of clicks to store |

## 📚 API Reference

### `trackClick(source, value, expirationMs?)`

Manually track a click:

```javascript
tracker.trackClick(
  'campaign_id', // Source name
  'summer_sale', // Click ID value
  7 * 24 * 60 * 60 * 1000 // Optional 7-day expiration
)
```

### `getClicks(source?)`

Retrieve tracked clicks:

```javascript
// Get all active clicks
const allClicks = tracker.getClicks()

// Get clicks for a specific source
const fbClicks = tracker.getClicks('fbclid')
```

### `clear(source?)`

Clear stored clicks:

```javascript
// Clear Google clicks
tracker.clear('gclid')

// Clear all clicks
tracker.clear()
```

## 🚀 Advanced Examples

### Marketing Attribution Setup

```javascript
const marketingTracker = initTracker({
  storageKey: 'marketing_clicks',
  clickIdConfigs: [
    { name: 'gclid', expirationMs: 30 * 24 * 60 * 60 * 1000 }, // Google (30 days)
    { name: 'fbclid', expirationMs: 7 * 24 * 60 * 60 * 1000 }, // Facebook (7 days)
    { name: 'utm_campaign', maxClicks: 200 } // Custom campaign tracking
  ]
})
```

### React Integration

```javascript
import { initTracker } from 'ads-click-tracker'
import { useEffect } from 'react'

function useClickTracker() {
  useEffect(() => {
    const tracker = initTracker({
      clickIdConfigs: [{ name: 'campaign_id' }]
    })

    return () => tracker.clear()
  }, [])
}
```

## 🌐 Browser Support

- Chrome
- Firefox
- Safari
- Edge (latest versions)

**Requirements:**
- localStorage support
- Modern browsers

**Note:** Internet Explorer 11 is not supported

## 📜 License

MIT License

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](https://github.com/yourusername/ads-click-tracker/issues).

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!
