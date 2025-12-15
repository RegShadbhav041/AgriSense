# AgriSense Architecture Documentation

## Overview

AgriSense is a client-side web application built with pure HTML, CSS, and JavaScript. It follows a modular, component-based architecture without external frameworks.

## Architecture Principles

1. **Separation of Concerns**: HTML (structure), CSS (presentation), JavaScript (behavior)
2. **Progressive Enhancement**: Works without JavaScript for basic content
3. **Offline-First**: Most features work offline via localStorage
4. **Mobile-First**: Responsive design starting from mobile viewport
5. **Accessibility**: WCAG 2.1 Level AA compliance

## File Structure

```
agrisense/
├── index.html              # Main entry point
├── assets/
│   ├── css/
│   │   └── main.css       # All styles (no preprocessors)
│   └── js/
│       └── main.js         # All application logic
├── pages/
│   ├── subsidy.html       # Subsidy information page
│   └── gov-info.html      # Government info page
└── docs/
    ├── API.md             # API documentation
    ├── ARCHITECTURE.md    # This file
    └── CONTRIBUTING.md    # Contribution guidelines
```

## Component Architecture

### HTML Structure

```
index.html
├── <header>               # Hero section with navigation
├── <main>                 # Main content area
│   ├── Quick Actions      # Primary action buttons
│   ├── Location Section  # Crop recommendation form
│   ├── Weather Section   # Forecast display
│   ├── Insights Section  # Smart insights
│   ├── Notices Section   # Government notices
│   ├── Survey Section    # Survey form (hidden by default)
│   ├── Polls Section     # Poll creation/voting
│   ├── Yield Section     # Yield estimator
│   └── Market Section    # Market prices
└── <footer>               # Footer information
```

### CSS Architecture

**Methodology**: BEM-inspired naming with utility classes

**Structure**:
1. **CSS Variables** (`:root`) - Design tokens
2. **Base Styles** - Reset, typography, layout
3. **Components** - Reusable UI components
4. **Utilities** - Helper classes
5. **Responsive** - Media queries

**Key Patterns**:
- `.card` - Container component
- `.primary-btn` - Primary action button
- `.secondary-btn` - Secondary action button
- `.crop-card` - Crop recommendation card
- `.forecast-item` - Weather forecast item
- `.notice-card` - Government notice card

### JavaScript Architecture

**Pattern**: Module pattern with global namespace

**Organization**:
1. **Global State** - Application state variables
2. **Data Structures** - Constants and databases
3. **Core Functions** - Credit system, i18n
4. **Weather & Location** - API integrations
5. **Crop Recommendation** - Business logic
6. **Rendering Functions** - DOM manipulation
7. **Event Handlers** - User interactions
8. **Initialization** - DOMContentLoaded setup

**Key Functions**:
- `handleLocationAndWeather()` - Main location handler
- `recommendCrop()` - Crop recommendation engine
- `renderForecast()` - Weather rendering
- `renderNotices()` - Notice rendering
- `renderMarket()` - Market data rendering

## Data Flow

### Location-Based Recommendation Flow

```
User clicks "Get Location"
    ↓
getLocation() → Geolocation API
    ↓
fetchWeather(lat, lon) → Open-Meteo API
    ↓
renderForecast() → Display weather
    ↓
User selects soil/moisture
    ↓
runRecommendation() → recommendCrop()
    ↓
renderCropResults() → Display crops
```

### Survey Flow

```
User clicks "Take Survey"
    ↓
Survey section revealed (animated)
    ↓
User fills form
    ↓
takeSurvey() → Validate
    ↓
saveCredits() → localStorage
    ↓
Update UI → Show success message
```

## State Management

### Global State Variables

```javascript
let currentLang = 'en' | 'ne';      // Current language
let lastWeather = {...};            // Last weather data
let lastCrops = [...];              // Last recommendations
```

### LocalStorage Keys

- `agriLang` - Language preference
- `agriCredits` - Credit count
- `agriPolls` - Poll data
- `agriPollVotes` - User votes

## API Integration

### External APIs

1. **Open-Meteo Weather API**
   - Endpoint: `https://api.open-meteo.com/v1/forecast`
   - Method: GET
   - CORS: Enabled
   - Fallback: Average climate data

2. **Browser Geolocation API**
   - Method: `navigator.geolocation.getCurrentPosition()`
   - Requires: HTTPS (except localhost)
   - Fallback: Manual elevation input

### Error Handling

- **Geolocation errors**: User-friendly message, fallback weather
- **Weather API errors**: Fallback to average climate data
- **Network errors**: Graceful degradation
- **Missing DOM elements**: Null checks before manipulation

## Performance Optimization

### Loading Strategy

- **CSS**: Inline critical CSS (if needed), defer non-critical
- **JavaScript**: Defer script loading, use async where possible
- **Images**: Lazy loading with `loading="lazy"`
- **Fonts**: Preconnect to Google Fonts

### Caching Strategy

- **Weather Data**: Cached in `lastWeather` variable
- **Crop Recommendations**: Cached in `lastCrops` array
- **User Preferences**: localStorage persistence

### Rendering Optimization

- **Batch DOM Updates**: Group multiple updates
- **Debouncing**: Consider for search/filter (future)
- **Virtual Scrolling**: Not needed (small data sets)

## Security Considerations

### XSS Prevention

- **Input Sanitization**: All user inputs sanitized
- **Template Literals**: Safe string interpolation
- **No eval()**: Never use eval() or similar

### Data Privacy

- **LocalStorage Only**: No server-side data storage
- **No Tracking**: No analytics or tracking scripts
- **User Consent**: Geolocation requires user permission

## Browser Compatibility

### Required Features

- **ES6+**: Arrow functions, template literals, async/await
- **CSS Grid**: Layout system
- **CSS Custom Properties**: CSS variables
- **Fetch API**: Weather data fetching
- **LocalStorage**: Data persistence
- **Geolocation API**: Location services

### Polyfills

None required for modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

## Accessibility

### WCAG 2.1 Compliance

- **Level AA**: Target compliance level
- **Keyboard Navigation**: All interactive elements accessible
- **Focus Indicators**: Visible focus styles
- **ARIA Labels**: Semantic HTML with ARIA where needed
- **Color Contrast**: Minimum 4.5:1 ratio
- **Screen Readers**: Semantic HTML structure

### Implementation

- Semantic HTML5 elements (`<header>`, `<main>`, `<section>`)
- ARIA roles and labels where appropriate
- Keyboard event handlers
- Focus management

## Testing Strategy

### Manual Testing

- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Mobile Devices**: iOS Safari, Chrome Mobile
- **Responsive**: Various screen sizes
- **Offline Mode**: Test localStorage features

### Automated Testing

- **Future**: Unit tests with Jest
- **Future**: E2E tests with Playwright
- **Future**: Accessibility tests with axe-core

## Deployment

### Static Hosting

- **GitHub Pages**: Simple deployment
- **Netlify**: Automatic deployments
- **Vercel**: Edge deployment
- **Any Static Host**: Works anywhere

### Requirements

- HTTPS (for geolocation)
- No server-side requirements
- No build process needed

## Future Enhancements

### Planned Features

1. **Service Worker**: Offline functionality
2. **PWA**: Installable app
3. **Backend Integration**: Real-time data sync
4. **Push Notifications**: Weather alerts
5. **Advanced Analytics**: Usage tracking

### Technical Debt

- **Code Splitting**: Consider for larger codebase
- **TypeScript**: Add type safety
- **Testing**: Comprehensive test suite
- **Documentation**: More inline comments

## Maintenance

### Regular Updates

- **Weather API**: Monitor for changes
- **Browser APIs**: Watch for deprecations
- **Dependencies**: None (pure JS)
- **Security**: Regular security audits

### Version Control

- **Git**: Version control system
- **Semantic Versioning**: Version numbering
- **Changelog**: Track changes

---

For questions or contributions, see [CONTRIBUTING.md](CONTRIBUTING.md).

