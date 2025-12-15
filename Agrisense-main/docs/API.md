# AgriSense API Documentation

## Table of Contents

- [Core Functions](#core-functions)
- [Weather & Location](#weather--location)
- [Crop Recommendation](#crop-recommendation)
- [Rendering Functions](#rendering-functions)
- [Storage Functions](#storage-functions)
- [Data Structures](#data-structures)

---

## Core Functions

### `loadCredits()`

Load credits from localStorage and update UI.

**Returns**: `number` - Current credit count

**Example**:
```javascript
const credits = loadCredits();
console.log(`Current credits: ${credits}`);
```

---

### `saveCredits(value)`

Save credits to localStorage and update UI.

**Parameters**:
- `value` (number): Credit count to save

**Example**:
```javascript
saveCredits(50);
```

---

### `translateToNepali()`

Toggle between English and Nepali language.

**Example**:
```javascript
translateToNepali(); // Switches language
```

---

### `applyTranslations()`

Apply translations to all translatable elements.

**Example**:
```javascript
applyTranslations();
```

---

## Weather & Location

### `getLocation()`

Get user's current location using Geolocation API.

**Returns**: `Promise<GeolocationPosition>`

**Example**:
```javascript
try {
  const position = await getLocation();
  const { latitude, longitude } = position.coords;
  console.log(`Location: ${latitude}, ${longitude}`);
} catch (error) {
  console.error('Location error:', error);
}
```

---

### `fetchWeather(lat, lon)`

Fetch weather data from Open-Meteo API.

**Parameters**:
- `lat` (number): Latitude
- `lon` (number): Longitude

**Returns**: `Promise<Object>` - Weather data object

**Response Structure**:
```javascript
{
  temp: 26,           // Current temperature
  rain: 10,           // Current rainfall
  temps: [26, 27, ...], // Array of temperatures
  rains: [10, 8, ...],  // Array of rainfall amounts
  dates: ["2024-01-01", ...], // Array of date strings
  fallback: false     // Whether fallback data was used
}
```

**Example**:
```javascript
const weather = await fetchWeather(27.7172, 85.3240);
console.log(`Temperature: ${weather.temp}°C`);
```

---

## Crop Recommendation

### `recommendCrop(params)`

Recommend crops based on weather, soil, and elevation.

**Parameters**:
- `params.temp` (number): Temperature in Celsius
- `params.rain` (number): Rainfall in mm
- `params.soil` (string): Soil type (Clay, Sandy, Loam)
- `params.moisture` (string): Moisture level (Low, Medium, High)
- `params.elevation` (number): Elevation in meters

**Returns**: `Array<Object>` - Array of recommended crops (top 3)

**Response Structure**:
```javascript
[
  {
    name: "Rice (धान)",
    image: "https://...",
    reason: "Warm (20-30°C) with medium rain...",
    sow: "Monsoon",
    water: "High"
  },
  // ... more crops
]
```

**Example**:
```javascript
const crops = recommendCrop({
  temp: 25,
  rain: 15,
  soil: 'Loam',
  moisture: 'Medium',
  elevation: 1200
});
console.log(`Recommended: ${crops[0].name}`);
```

---

## Rendering Functions

### `renderCropResults(crops)`

Render crop recommendations to UI.

**Parameters**:
- `crops` (Array<Object>): Array of crop objects

**Example**:
```javascript
renderCropResults([
  { name: "Rice", image: "...", reason: "...", sow: "Monsoon", water: "High" }
]);
```

---

### `renderForecast(dates, temps, rains)`

Render 5-day weather forecast.

**Parameters**:
- `dates` (Array<string>): Array of date strings
- `temps` (Array<number>): Array of temperatures
- `rains` (Array<number>): Array of rainfall amounts

**Example**:
```javascript
renderForecast(
  ["2024-01-01", "2024-01-02"],
  [26, 27],
  [10, 8]
);
```

---

### `renderNotices()`

Render government notices.

**Example**:
```javascript
renderNotices();
```

---

### `renderMarket()`

Render market items and summary.

**Example**:
```javascript
renderMarket();
```

---

### `renderPolls()`

Render all polls.

**Example**:
```javascript
renderPolls();
```

---

## Storage Functions

### `readPolls()`

Read polls from localStorage.

**Returns**: `Array<Object>` - Array of poll objects

**Example**:
```javascript
const polls = readPolls();
console.log(`Total polls: ${polls.length}`);
```

---

### `writePolls(polls)`

Write polls to localStorage.

**Parameters**:
- `polls` (Array<Object>): Array of poll objects

**Example**:
```javascript
writePolls([
  {
    id: 1234567890,
    question: "Should we increase subsidy?",
    options: [
      { text: "Yes", votes: 5 },
      { text: "No", votes: 2 }
    ]
  }
]);
```

---

### `readVotes()`

Read votes from localStorage.

**Returns**: `Array<number>` - Array of poll IDs user has voted on

**Example**:
```javascript
const votes = readVotes();
console.log(`Voted on ${votes.length} polls`);
```

---

### `writeVotes(votes)`

Write votes to localStorage.

**Parameters**:
- `votes` (Array<number>): Array of poll IDs

**Example**:
```javascript
writeVotes([1234567890, 1234567891]);
```

---

## Data Structures

### Crop Database

```javascript
const cropDB = {
  Rice: {
    name: "Rice (धान)",
    image: "https://...",
    sow: "Monsoon",
    water: "High"
  },
  // ... more crops
};
```

### Market Items

```javascript
const marketItems = [
  {
    name: "Paddy (per kg)",
    price: 45,
    stock: "High",
    type: "grain"
  },
  // ... more items
];
```

### Government Notices

```javascript
const governmentNotices = [
  {
    id: 1,
    title: "USAID Agricultural Direct Financing Project",
    date: "September 2024",
    content: "...",
    type: "funding",
    urgent: true
  },
  // ... more notices
];
```

---

## Event Handlers

### `handleLocationAndWeather()`

Main handler for location and weather fetch.

**Example**:
```javascript
document.getElementById('locateBtn').addEventListener('click', handleLocationAndWeather);
```

---

### `runRecommendation()`

Run crop recommendation based on current inputs.

**Example**:
```javascript
document.getElementById('recommendBtn').addEventListener('click', runRecommendation);
```

---

### `takeSurvey(event)`

Handle survey form submission.

**Parameters**:
- `event` (Event): Form submit event

**Example**:
```javascript
document.getElementById('surveyForm').addEventListener('submit', takeSurvey);
```

---

### `createPoll()`

Create a new poll.

**Example**:
```javascript
document.getElementById('createPollBtn').addEventListener('click', createPoll);
```

---

### `votePoll(pollId, optionIndex)`

Vote on a poll.

**Parameters**:
- `pollId` (number): Poll ID
- `optionIndex` (number): Option index

**Example**:
```javascript
votePoll(1234567890, 0); // Vote for first option
```

---

## Utility Functions

### `friendlyDate(iso)`

Format ISO date string to friendly format.

**Parameters**:
- `iso` (string): ISO date string

**Returns**: `string` - Formatted date string

**Example**:
```javascript
const date = friendlyDate("2024-01-01T00:00:00Z");
console.log(date); // "Mon, Jan 1"
```

---

### `buildWarnings(dailyTemps, dailyRain)`

Build weather warnings based on thresholds.

**Parameters**:
- `dailyTemps` (Array<number>): Array of daily max temperatures
- `dailyRain` (Array<number>): Array of daily rainfall amounts

**Returns**: `Array<string>` - Array of warning messages

**Example**:
```javascript
const warnings = buildWarnings([35, 28, 30], [5, 25, 8]);
console.log(warnings); // ["⚠️ 1 दिनमा भारी वर्षा (25 mm)", ...]
```

---

## Global Variables

### `currentLang`

Current application language ('en' or 'ne').

**Example**:
```javascript
console.log(currentLang); // "en" or "ne"
```

---

### `lastWeather`

Last fetched weather data.

**Example**:
```javascript
console.log(lastWeather.temp); // 26
```

---

### `lastCrops`

Last recommended crops.

**Example**:
```javascript
console.log(lastCrops[0].name); // "Rice (धान)"
```

---

## Error Handling

All functions include error handling:

- **Geolocation errors**: Fallback to manual elevation input
- **Weather API errors**: Fallback to average climate data
- **Missing DOM elements**: Graceful degradation with null checks
- **Invalid inputs**: User-friendly error messages

---

## Performance Considerations

- **Lazy loading**: Images loaded with `loading="lazy"`
- **LocalStorage**: Efficient data persistence
- **Debouncing**: Consider adding for search/filter functions
- **Caching**: Weather data cached in `lastWeather` variable

---

For more details, see the source code in `assets/js/main.js`.

