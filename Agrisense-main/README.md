# AgriSense - Farmer Dashboard

**Professional web application for improved governance systems and better policy decisions in agriculture.**

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/agrisense/dashboard)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

---

## 🌾 Overview

AgriSense is a mobile-friendly, farmer-centric web application designed to provide location-based crop recommendations, weather forecasting, market information, and government agricultural notices. Built with pure HTML, CSS, and JavaScript (no frameworks), it works offline except for geolocation and weather API calls.

### Key Objectives

- **Improved Governance**: Better policy decisions through farmer data collection
- **Accessibility**: Simple UI optimized for rural farmers
- **Offline-First**: Works without internet for most features
- **Multilingual**: English and Nepali language support
- **Mobile-First**: Responsive design for smartphones and tablets

---

## ✨ Features

### Core Features

1. **📍 Location-Based Crop Recommendation**
   - Uses browser geolocation API
   - Fetches weather data from Open-Meteo API
   - AI-powered crop suggestion engine
   - Considers soil type, moisture, elevation, and climate

2. **☁️ Weather Forecast**
   - 5-day weather forecast with visual icons
   - Climate warnings (heavy rain, high temperature)
   - Automatic fallback to average climate data

3. **📢 Government Notices**
   - Real agricultural announcements
   - Urgent notices highlighted
   - Categorized by type (funding, subsidy, training, etc.)

4. **🛰 Market & Input Board**
   - Current market prices for produce
   - Input prices (fertilizers, seeds)
   - Stock status indicators
   - Average price calculations

5. **📋 Survey System**
   - 6-question government survey
   - Credit reward system (20 credits per completion)
   - LocalStorage persistence

6. **🗳️ Farmer Polls**
   - Create polls with up to 4 options
   - Vote on existing polls
   - One vote per poll per user
   - Offline storage

7. **📈 Yield Estimator**
   - Calculate expected yield based on crop and land size
   - Default yield values per crop
   - Customizable yield per hectare

8. **🔮 Smart Insights**
   - Climate snapshot summary
   - Top crop recommendations
   - Weather alerts

### UI/UX Features

- **Premium Design**: Glassmorphism effects, smooth animations
- **Responsive Layout**: Mobile-first design
- **Accessibility**: Keyboard navigation, focus indicators
- **Animations**: Smooth transitions and hover effects
- **Color Scheme**: Green theme optimized for agricultural context

---

## 📁 Project Structure

```
agrisense/
├── index.html                 # Main dashboard page
├── README.md                  # Project documentation
├── LICENSE                    # License file
├── assets/
│   ├── css/
│   │   └── main.css          # Main stylesheet
│   └── js/
│       └── main.js            # Main application logic
├── pages/
│   ├── subsidy.html          # Subsidy information page
│   └── gov-info.html         # Government information page
└── docs/
    ├── API.md                # API documentation
    ├── ARCHITECTURE.md       # Architecture overview
    └── CONTRIBUTING.md       # Contribution guidelines
```

---

## 🚀 Installation

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- HTTPS connection (required for geolocation API)
- Internet connection (for weather API and fonts)

### Setup

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/agrisense/dashboard.git
   cd dashboard
   ```

2. **Open in browser**
   - Simply open `index.html` in a web browser
   - For HTTPS (required for geolocation), use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server -p 8000
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the application**
   - Navigate to `http://localhost:8000` (or your chosen port)
   - Allow location access when prompted

---

## 💻 Usage

### Getting Started

1. **Open the Dashboard**
   - Launch `index.html` in your browser
   - Allow location access when prompted

2. **Get Crop Recommendations**
   - Click "Get My Location & Recommend Crop"
   - Select soil type and moisture level
   - Optionally enter elevation
   - Click "Recommend Now"
   - View top 3 crop recommendations with images

3. **View Weather Forecast**
   - Weather forecast appears automatically after location fetch
   - Check 5-day forecast with icons
   - Review weather warnings

4. **Complete Survey**
   - Click "Take Survey (Earn Credits)"
   - Answer 6 questions
   - Submit to earn 20 credits

5. **Create/Vote on Polls**
   - Navigate to "Farmer Polls" section
   - Create a poll with question and options
   - Vote on existing polls

6. **Check Market Prices**
   - View current market prices in "Market & Input Board"
   - See stock status and average prices

### Language Toggle

- Click "नेपाली / English" button in header
- All text switches between English and Nepali
- Preference saved in localStorage

---

## 📚 API Documentation

### External APIs Used

#### Open-Meteo Weather API

**Endpoint**: `https://api.open-meteo.com/v1/forecast`

**Parameters**:
- `latitude` (number): Latitude coordinate
- `longitude` (number): Longitude coordinate
- `daily` (string): Comma-separated daily parameters
- `timezone` (string): Timezone (auto)

**Example**:
```javascript
const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;
const response = await fetch(url);
const data = await response.json();
```

**Response Structure**:
```json
{
  "daily": {
    "temperature_2m_max": [26, 27, 28, ...],
    "precipitation_sum": [10, 8, 6, ...],
    "time": ["2024-01-01", "2024-01-02", ...]
  }
}
```

### Browser APIs Used

- **Geolocation API**: `navigator.geolocation.getCurrentPosition()`
- **LocalStorage API**: `localStorage.getItem()`, `localStorage.setItem()`
- **Fetch API**: `fetch()` for weather data

### Internal Functions

See [docs/API.md](docs/API.md) for detailed function documentation.

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Opera | 76+ | ✅ Full |

**Note**: Geolocation requires HTTPS connection (except localhost).

---

## 🤝 Contributing

We welcome contributions! Please see [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

### Development Guidelines

1. Follow existing code style
2. Add comments for complex logic
3. Test on multiple browsers
4. Ensure mobile responsiveness
5. Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Open-Meteo**: Free weather API service
- **Unsplash**: Crop images
- **Google Fonts**: Poppins font family
- **Nepal Government**: Agricultural notices and data

---

## 📞 Support

For issues, questions, or suggestions:
- **Email**: support@agrisense.org
- **Issues**: [GitHub Issues](https://github.com/agrisense/dashboard/issues)

---

## 🔄 Version History

- **v1.0.0** (2024) - Initial release
  - Location-based crop recommendations
  - Weather forecasting
  - Government notices
  - Market information
  - Survey and poll systems
  - Multilingual support

---

**Built with ❤️ for farmers**

#   A g r i s e n s e  
 