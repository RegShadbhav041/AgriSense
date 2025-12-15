/**
 * AgriSense - Main Application JavaScript
 * 
 * Professional farmer-friendly web application for crop recommendations,
 * weather forecasting, market information, and government notices.
 * 
 * @version 1.0.0
 * @author AgriSense Development Team
 * @license MIT
 */

/* ============================================
   GLOBAL STATE MANAGEMENT
   ============================================ */

/** Current application language ('en' or 'ne') */
let currentLang = localStorage.getItem('agriLang') || 'en';

/** Last fetched weather data */
let lastWeather = null; // {temp, rain, temps[], rains[], dates[], fallback}

/** Last recommended crops */
let lastCrops = [];

/* Analytics data storage */
let analyticsData = {
  cropRecommendations: JSON.parse(localStorage.getItem('agriAnalytics_crops') || '[]'),
  farmerBehavior: JSON.parse(localStorage.getItem('agriAnalytics_behavior') || '[]'),
  regionalData: JSON.parse(localStorage.getItem('agriAnalytics_regional') || '[]'),
  surveyResponses: JSON.parse(localStorage.getItem('agriAnalytics_surveys') || '[]')
};

/* ============================================
   DATA STRUCTURES
   ============================================ */

/**
 * Crop database with images, Nepali names, and cultivation info
 * @type {Object<string, {name: string, image: string, sow: string, water: string}>}
 */
const cropDB = {
  Rice: { name: 'Rice (धान)', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=60', sow: 'Monsoon', water: 'High' },
  Maize: { name: 'Maize (मकै)', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60', sow: 'Spring/Monsoon', water: 'Medium' },
  Millet: { name: 'Millet (कोदो)', image: 'https://images.unsplash.com/photo-1560858278-d2d23a57a47a?auto=format&fit=crop&w=600&q=60', sow: 'Monsoon', water: 'Low/Medium' },
  Lentils: { name: 'Lentils (मसुरो)', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=60', sow: 'Winter', water: 'Low' },
  Groundnuts: { name: 'Groundnuts (बदाम)', image: 'https://images.unsplash.com/photo-1506611543331-35de0b614023?auto=format&fit=crop&w=600&q=60', sow: 'Spring', water: 'Low/Medium' },
  Potato: { name: 'Potato (आलु)', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60', sow: 'Spring/Winter', water: 'Medium' },
  Barley: { name: 'Barley (जौ)', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60', sow: 'Winter', water: 'Medium' },
  Buckwheat: { name: 'Buckwheat (फापर)', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&w=600&q=60', sow: 'Monsoon', water: 'Low/Medium' },
  Ginger: { name: 'Ginger (अदुवा)', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60', sow: 'Monsoon', water: 'High' },
  Turmeric: { name: 'Turmeric (बेसार)', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60', sow: 'Monsoon', water: 'High' },
  Vegetables: { name: 'Vegetables (सागसब्जी)', image: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=600&q=60', sow: 'Year-round', water: 'Medium' }
};

/**
 * Default yield per hectare (tons) for common crops
 * @type {Object<string, number>}
 */
const yieldTable = {
  Rice: 4.5,
  Maize: 3.8,
  Wheat: 3.5,
  Millet: 2.5,
  Vegetables: 8
};

/**
 * Market items with prices and stock status
 * @type {Array<{name: string, price: number, stock: string, type: string}>}
 */
const marketItems = [
  { name: 'Paddy (per kg)', price: 45, stock: 'High', type: 'grain' },
  { name: 'Maize (per kg)', price: 38, stock: 'Medium', type: 'grain' },
  { name: 'Potato (per kg)', price: 32, stock: 'High', type: 'vegetable' },
  { name: 'Tomato (per kg)', price: 55, stock: 'Low', type: 'vegetable' },
  { name: 'Urea (50kg bag)', price: 1800, stock: 'Available', type: 'input' },
  { name: 'DAP (50kg bag)', price: 3000, stock: 'Low', type: 'input' },
  { name: 'MoP (50kg bag)', price: 2600, stock: 'Medium', type: 'input' }
];

/**
 * Translation strings for English and Nepali
 * @type {Object<string, Object<string, string>>}
 */
const t = {
  en: {
    titleText: 'AgriSense 🌱',
    subtitleText: 'Smart Farming for Smarter Policy',
    creditsLabel: 'Credits',
    btnLocateText: 'Get My Location & Recommend Crop',
    btnManualLocationText: 'Manual Location',
    btnSurveyText: 'Take Survey (Earn Credits)',
    btnPollText: 'Farmer Polls (Create & Vote)',
    locHeader: '📍 Location-Based Crop Recommendation',
    locSubtext: 'Use your location and local weather to get the best crops.',
    soilLabel: 'Soil Type',
    moistureLabel: 'Moisture Level',
    landLabel: 'Land Size (ha)',
    elevLabel: 'Elevation (m)',
    elevHint: '(optional)',
    btnRecommendText: 'Recommend Now',
    forecastHeader: '☁️ Next 5-Day Forecast',
    surveyHeader: '📋 Government Survey',
    surveySubtext: 'Answer 6 quick questions to earn credits.',
    pollHeader: '🗳️ Farmer Polls',
    pollQuestionLabel: 'Poll Question',
    noticesHeader: '📢 Government Notices & Policy Updates',
    nav_home: 'Home',
    nav_reco: 'Advice',
    nav_weather: 'Weather',
    nav_market: 'Market',
    nav_policy: 'Policy',
    footerText: 'AgriSense Prototype • Built for farmers • Stay green 🌾'
  },
  ne: {
    titleText: 'एग्रीयसेन्स 🌱',
    subtitleText: 'स्मार्ट खेती, स्मार्ट नीति',
    creditsLabel: 'क्रेडिट',
    btnLocateText: 'मेरो स्थान लिनुहोस् र बाली सुझाउनुहोस्',
    btnManualLocationText: 'म्यानुअल स्थान',
    btnSurveyText: 'सर्वे गर्नुहोस् (क्रेडिट कमाउनुहोस्)',
    btnPollText: 'किसान मतदान (सिर्जना/मत)',
    locHeader: '📍 स्थान आधारित बाली सिफारिस',
    locSubtext: 'तपाईंको स्थान र मौसमले राम्रो बाली सुझाउँछ।',
    soilLabel: 'माटो प्रकार',
    moistureLabel: 'आर्द्रता स्तर',
    landLabel: 'जग्गा साइज (हे)',
    elevLabel: 'उचाइ (मिटर)',
    elevHint: '(ऐच्छिक)',
    btnRecommendText: 'अब सिफारिस',
    forecastHeader: '☁️ आगामी ५ दिनको मौसम',
    surveyHeader: '📋 सरकारी सर्वे',
    surveySubtext: '६ छोटा प्रश्न, क्रेडिट पाउनुहोस्।',
    pollHeader: '🗳️ किसान मतदान',
    pollQuestionLabel: 'मतदान प्रश्न',
    noticesHeader: '📢 सरकारी सूचना र नीतिगत अपडेट',
    nav_home: 'गृह',
    nav_reco: 'सल्लाह',
    nav_weather: 'मौसम',
    nav_market: 'बजार',
    nav_policy: 'अनुदान',
    footerText: 'एग्रीयसेन्स प्रोटोटाइप • किसानका लागि • हरियो रहनुहोस् 🌾'
  }
};

/**
 * Government notices database
 * @type {Array<{id: number, title: string, date: string, content: string, type: string, urgent: boolean}>}
 */
const governmentNotices = [
  {
    id: 1,
    title: 'USAID Agricultural Direct Financing Project',
    date: 'September 2024',
    content: '$21 million initiative launched to support 69,000 households across 53,000 hectares. Focus on new technologies and agricultural practices for food security.',
    type: 'funding',
    urgent: true
  },
  {
    id: 2,
    title: 'Fiscal Year 2025/26 Budget Allocation',
    date: '2024',
    content: 'Rs. 57.48 billion allocated to Ministry of Agriculture and Livestock Development. Emphasis on increased production and productivity.',
    type: 'budget',
    urgent: false
  },
  {
    id: 3,
    title: 'Fertilizer Subsidy Scheme Extended',
    date: '2024',
    content: '50% subsidy on Urea, DAP, and MoP fertilizers continues. Apply at local agricultural office with land certificate.',
    type: 'subsidy',
    urgent: true
  },
  {
    id: 4,
    title: 'Seed Certification Program',
    date: '2024',
    content: 'Free certified seeds available for paddy, maize, and vegetables. Distribution centers open in all districts.',
    type: 'program',
    urgent: false
  },
  {
    id: 5,
    title: 'Climate Resilience Training',
    date: '2024',
    content: 'Free training workshops on climate-smart agriculture. Register at district agriculture office or online portal.',
    type: 'training',
    urgent: false
  },
  {
    id: 6,
    title: 'Minimum Support Price (MSP) Update',
    date: '2024',
    content: 'MSP for paddy: NPR 45/kg, Maize: NPR 38/kg, Wheat: NPR 42/kg. Procurement centers operational.',
    type: 'pricing',
    urgent: true
  }
];

/* ============================================
   CREDIT SYSTEM
   ============================================ */

/**
 * Load credits from localStorage
 * @returns {number} Current credit count
 */
function loadCredits() {
  const saved = Number(localStorage.getItem('agriCredits') || 0);
  const creditEl = document.getElementById('creditCount');
  if (creditEl) creditEl.textContent = saved;
  return saved;
}

/**
 * Save credits to localStorage and update UI
 * @param {number} value - Credit count to save
 */
function saveCredits(value) {
  localStorage.setItem('agriCredits', String(value));
  const creditEl = document.getElementById('creditCount');
  if (creditEl) creditEl.textContent = value;
}

/* ============================================
   INTERNATIONALIZATION (i18n)
   ============================================ */

/**
 * Toggle between English and Nepali language
 */
function translateToNepali() {
  currentLang = currentLang === 'en' ? 'ne' : 'en';
  localStorage.setItem('agriLang', currentLang);
  applyTranslations();
  // Re-render dynamic sections with selected language
  renderCropResults(lastCrops);
  renderPolls();
}

/**
 * Apply translations to all translatable elements
 */
function applyTranslations() {
  const map = t[currentLang];
  if (!map) return;
  Object.keys(map).forEach((key) => {
    const el = document.getElementById(key);
    if (el) el.textContent = map[key];
  });
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const k = el.getAttribute('data-i18n');
    if (map[k]) el.textContent = map[k];
  });
}

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Format ISO date string to friendly format
 * @param {string} iso - ISO date string
 * @returns {string} Formatted date string
 */
function friendlyDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(currentLang === 'ne' ? 'ne-NP' : 'en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Build weather warnings based on temperature and rainfall thresholds
 * @param {Array<number>} dailyTemps - Array of daily max temperatures
 * @param {Array<number>} dailyRain - Array of daily rainfall amounts
 * @returns {Array<string>} Array of warning messages
 */
function buildWarnings(dailyTemps, dailyRain) {
  const warnings = [];
  dailyRain.forEach((r, idx) => {
    if (r > 20) warnings.push(`⚠️ ${idx === 0 ? 'आज' : `${idx} दिनमा`} भारी वर्षा (${r} mm)`);
  });
  dailyTemps.forEach((t, idx) => {
    if (t > 32) warnings.push(`⚠️ ${idx === 0 ? 'आज' : `${idx} दिनमा`} उच्च तापक्रम (${t}°C)`);
  });
  return warnings;
}

/**
 * Get icon for notice type
 * @param {string} type - Notice type
 * @returns {string} Emoji icon
 */
function getNoticeIcon(type) {
  const icons = {
    funding: '💰',
    budget: '📊',
    subsidy: '🎁',
    program: '🌾',
    training: '📚',
    pricing: '💵'
  };
  return icons[type] || '📋';
}

/* ============================================
   WEATHER & LOCATION SERVICES
   ============================================ */

/**
 * Get user's current location using Geolocation API
 * @returns {Promise<GeolocationPosition>} Position promise
 */
function getLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 12000 });
  });
}

/**
 * Fetch weather data from Open-Meteo API
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Weather data object
 */
async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_sum&timezone=auto`;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Weather fetch failed');
    const data = await resp.json();
    const temps = data.daily.temperature_2m_max || [];
    const rains = data.daily.precipitation_sum || [];
    const dates = data.daily.time || [];
    return {
      temp: temps[0] ?? 26,
      rain: rains[0] ?? 10,
      temps,
      rains,
      dates,
      fallback: false
    };
  } catch (e) {
    console.warn('Weather fallback', e);
    // Fallback average climate so farmer still gets a suggestion
    const dates = Array.from({ length: 5 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d.toISOString();
    });
    const temps = [26, 27, 28, 27, 26];
    const rains = [10, 8, 6, 5, 12];
    return { temp: 26, rain: 10, temps, rains, dates, fallback: true };
  }
}

function nearestDistrict(lat, lon) {
  const pts = [
    { d: 'Kathmandu', lat: 27.7172, lon: 85.3240 },
    { d: 'Kaski', lat: 28.2096, lon: 83.9856 },
    { d: 'Morang', lat: 26.4870, lon: 87.2846 },
    { d: 'Banke', lat: 28.0500, lon: 81.6167 },
    { d: 'Lalitpur', lat: 27.6667, lon: 85.3333 },
    { d: 'Chitwan', lat: 27.5291, lon: 84.3542 },
    { d: 'Rupandehi', lat: 27.5760, lon: 83.5070 }
  ];
  let best = pts[0], bd = Infinity;
  pts.forEach((p) => {
    const dl = lat - p.lat, dn = lon - p.lon;
    const dist = Math.hypot(dl, dn);
    if (dist < bd) { bd = dist; best = p; }
  });
  return best;
}

/* ============================================
   CROP RECOMMENDATION ENGINE
   ============================================ */

/**
 * Recommend crops based on weather, soil, and elevation
 * @param {Object} params - Recommendation parameters
 * @param {number} params.temp - Temperature in Celsius
 * @param {number} params.rain - Rainfall in mm
 * @param {string} params.soil - Soil type (Clay, Sandy, Loam)
 * @param {string} params.moisture - Moisture level (Low, Medium, High)
 * @param {number} params.elevation - Elevation in meters
 * @returns {Array<Object>} Array of recommended crops (top 3)
 */
function recommendCrop({ temp, rain, soil, moisture, elevation }) {
  const picks = [];
  const isLoam = soil === 'Loam';
  const isSandy = soil === 'Sandy';
  const isClay = soil === 'Clay';
  const highAlt = elevation && elevation > 1500;

  /**
   * Helper function to add crop to recommendations
   * @param {string} name - Crop name
   * @param {string} reason - Reason for recommendation
   */
  const push = (name, reason) => {
    const info = cropDB[name] || { name, image: '', sow: '', water: '' };
    picks.push({
      name: info.name,
      image: info.image,
      reason,
      sow: info.sow,
      water: info.water
    });
  };

  // Rule-based crop recommendation logic
  if (temp >= 20 && temp <= 30 && rain >= 8 && rain <= 20 && isLoam) {
    push('Rice', 'Warm (20-30°C) with medium rain and loam soil fits Rice.');
    push('Maize', 'Medium rain + loam soil keeps maize steady.');
  }
  if ((temp < 18 || highAlt) && elevation > 1500) {
    push('Potato', 'Cool climate + high altitude suits potato.');
    push('Barley', 'Highland cool weather favors barley.');
    push('Buckwheat', 'Hardy grain for cool hills.');
  }
  if (rain < 8 && isSandy) {
    push('Millet', 'Low rain and sandy soil matches millet.');
    push('Lentils', 'Low water need; good for dry fields.');
    push('Groundnuts', 'Sandy, low rain areas support groundnuts.');
  }
  if (rain >= 20 && temp > 28) {
    push('Rice', 'High rain + warm temp benefits paddy.');
    push('Ginger', 'Moist heat helps ginger growth.');
    push('Turmeric', 'Warm, wet spells suit turmeric.');
  }
  if (rain >= 8 && rain < 20 && temp >= 18 && temp < 28) {
    push('Maize', 'Mild temp, moderate rain balances maize.');
    push('Millet', 'Tolerant to varied rainfall.');
    push('Vegetables', 'Balanced climate for mixed vegetables.');
  }
  
  // Fallback recommendations if no rules match
  if (!picks.length) {
    push('Maize', 'General fit crop for mixed climates.');
    push('Vegetables', 'Flexible option with broad suitability.');
    push('Millet', 'Resilient choice with low inputs.');
  }

  lastCrops = picks.slice(0, 3);
  return lastCrops;
}

function startMarketTicker() {
  setInterval(() => {
    marketItems.forEach((i) => {
      const delta = Math.round(Math.random() * 6 - 2);
      i.price = Math.max(10, i.price + delta);
    });
    renderMarket();
  }, 10000);
}

function setupBottomNav() {
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach((b) => {
    b.addEventListener('click', () => {
      navButtons.forEach((n) => n.classList.remove('active'));
      b.classList.add('active');
      const target = b.dataset.target;
      if (target === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function setupManualLocation() {
  const navLocateBtn = document.getElementById('navLocateBtn');
  const dialog = document.getElementById('locationDialog');
  const cancelBtn = document.getElementById('dialogCancel');
  const setBtn = document.getElementById('dialogSet');
  const manualBtn = document.getElementById('manualLocationBtn');
  if (navLocateBtn && dialog) {
    navLocateBtn.addEventListener('dblclick', () => {
      dialog.showModal();
    });
  }
  if (manualBtn && dialog) {
    manualBtn.addEventListener('click', () => dialog.showModal());
  }
  if (cancelBtn && dialog) {
    cancelBtn.addEventListener('click', () => dialog.close());
  }
  if (setBtn && dialog) {
    setBtn.addEventListener('click', async () => {
      const sel = document.getElementById('districtSelect');
      const dSel = sel ? sel.value : '';
      const map = {
        Kathmandu: { lat: 27.7172, lon: 85.3240 },
        Kaski: { lat: 28.2096, lon: 83.9856 },
        Morang: { lat: 26.4870, lon: 87.2846 },
        Banke: { lat: 28.0500, lon: 81.6167 },
        Lalitpur: { lat: 27.6667, lon: 85.3333 },
        Chitwan: { lat: 27.5291, lon: 84.3542 },
        Rupandehi: { lat: 27.5760, lon: 83.5070 }
      };
      const p = map[dSel];
      if (!p) { dialog.close(); return; }
      const weather = await fetchWeather(p.lat, p.lon);
      weather.lat = p.lat;
      weather.lon = p.lon;
      lastWeather = weather;
      renderForecast(weather.dates, weather.temps, weather.rains);
      showToast('Location set');
      dialog.close();
    });
  }
}

/* ============================================
   RENDERING FUNCTIONS
   ============================================ */

/**
 * Render crop recommendations to UI
 * @param {Array<Object>} crops - Array of crop objects
 */
function renderCropResults(crops) {
  const container = document.getElementById('cropResults');
  if (!container) return;
  if (!crops || !crops.length) {
    container.innerHTML = '<div class="muted">No recommendations yet.</div>';
    return;
  }
  container.innerHTML = crops
    .slice(0, 3)
    .map(
      (c, idx) => `
      <div class="crop-card">
        <div><strong>${idx + 1}. ${c.name}</strong></div>
        <div class="muted">${c.reason}</div>
        <div class="muted">Sowing: ${c.sow} • Water: ${c.water}</div>
        <img src="${c.image}" alt="${c.name}" style="width:100%; border-radius:10px; margin-top:6px;" loading="lazy">
      </div>
    `
    )
    .join('');
}

/**
 * Render 5-day weather forecast
 * @param {Array<string>} dates - Array of date strings
 * @param {Array<number>} temps - Array of temperatures
 * @param {Array<number>} rains - Array of rainfall amounts
 */
function renderForecast(dates, temps, rains) {
  const list = document.getElementById('forecastList');
  const warnBox = document.getElementById('weatherWarnings');
  const iconMap = {
    sun: '☀️',
    cloud: '⛅',
    rain: '🌧️',
    storm: '⛈️'
  };
  if (!dates.length) {
    if (list) list.innerHTML = '<div class="muted">No forecast yet.</div>';
    if (warnBox) warnBox.textContent = '';
    renderGlobalWarning([]);
    return;
  }
  if (list) {
    list.innerHTML = dates
      .slice(0, 5)
      .map((date, idx) => {
        const icon =
          rains[idx] > 20 ? iconMap.storm : rains[idx] > 5 ? iconMap.rain : temps[idx] > 30 ? iconMap.sun : iconMap.cloud;
        return `
          <div class="forecast-item">
            <span class="weather-icon">${icon}</span>
            <div>${friendlyDate(date)}</div>
            <div>High: ${temps[idx]}°C</div>
            <div>Rain: ${rains[idx]} mm</div>
          </div>
        `;
      })
      .join('');
  }

  const warnings = buildWarnings(temps.slice(0, 5), rains.slice(0, 5));
  if (warnBox) {
    warnBox.innerHTML = warnings.length ? warnings.map((w) => `<div>${w}</div>`).join('') : '';
  }
  renderGlobalWarning(warnings);
  renderInsights(warnings);
}

/**
 * Render government notices
 */
function renderNotices() {
  const container = document.getElementById('noticesList');
  if (!container) return;
  
  const urgentNotices = governmentNotices.filter(n => n.urgent);
  const regularNotices = governmentNotices.filter(n => !n.urgent);
  
  let html = '';
  
  if (urgentNotices.length > 0) {
    html += '<div class="notices-urgent">';
    urgentNotices.forEach(notice => {
      html += `
        <div class="notice-card urgent" data-type="${notice.type}">
          <div class="notice-header">
            <span class="notice-badge urgent-badge">⚠️ URGENT</span>
            <span class="notice-date">${notice.date}</span>
          </div>
          <h3>${notice.title}</h3>
          <p>${notice.content}</p>
        </div>
      `;
    });
    html += '</div>';
  }
  
  if (regularNotices.length > 0) {
    html += '<div class="notices-regular">';
    regularNotices.forEach(notice => {
      html += `
        <div class="notice-card" data-type="${notice.type}">
          <div class="notice-header">
            <span class="notice-badge badge-${notice.type}">${getNoticeIcon(notice.type)}</span>
            <span class="notice-date">${notice.date}</span>
          </div>
          <h3>${notice.title}</h3>
          <p>${notice.content}</p>
        </div>
      `;
    });
    html += '</div>';
  }
  
  container.innerHTML = html;
}

/**
 * Render market items and summary
 */
function renderMarket() {
  const list = document.getElementById('marketList');
  const summary = document.getElementById('marketSummary');
  if (!list || !summary) return;
  
  list.innerHTML = marketItems
    .map(
      (item) => `
      <div class="market-item">
        <div class="market-item-header">
          <span class="market-item-name">${item.name}</span>
          <span class="market-item-price">NPR ${item.price}</span>
        </div>
        <div class="market-item-type type-${item.type}">${item.type}</div>
        <div class="market-item-stock stock-${item.stock.toLowerCase().replace(' ', '-')}">Stock: ${item.stock}</div>
      </div>
    `
    )
    .join('');
    
  const produceItems = marketItems.filter((i) => i.type === 'grain' || i.type === 'vegetable');
  const avg = produceItems.length > 0
    ? (produceItems.reduce((sum, i) => sum + i.price, 0) / produceItems.length).toFixed(1)
    : 0;
  summary.innerHTML = `
    <h3>Market Summary</h3>
    <p>Average produce price: <strong>NPR ${avg}</strong> per kg</p>
    <p>Input prices reflect current co-op rates</p>
  `;
}

/**
 * Render global warning banner
 * @param {Array<string>} warnings - Array of warning messages
 */
function renderGlobalWarning(warnings) {
  const el = document.getElementById('globalWarning');
  if (!el) return;
  if (warnings && warnings.length) {
    el.style.display = 'block';
    el.textContent = `⚠ ${warnings[0]}`;
  } else {
    el.style.display = 'none';
    el.textContent = '';
  }
}

/**
 * Render smart insights
 * @param {Array<string>} warnings - Array of warning messages
 */
function renderInsights(warnings = []) {
  const el = document.getElementById('insightContent');
  if (!el) return;
  const weatherText = lastWeather
    ? `Temp ~ ${lastWeather.temp}°C, Rain ~ ${lastWeather.rain}mm (${lastWeather.fallback ? 'avg' : 'live'})`
    : 'Run recommendation to fetch weather.';
  const cropText = lastCrops && lastCrops.length ? `Top crop: ${lastCrops[0].name}` : 'No crops yet.';
  const warnText = warnings && warnings.length ? warnings[0] : 'No severe alerts.';
  el.innerHTML = `
    <div class="crop-card">
      <strong>Climate Snapshot:</strong> ${weatherText}<br>
      <strong>Focus:</strong> ${cropText}<br>
      <strong>Alert:</strong> ${warnText}
    </div>
  `;
}

/* ============================================
   SURVEY SYSTEM
   ============================================ */

/**
 * Handle survey form submission
 * @param {Event} event - Form submit event
 */
function takeSurvey(event) {
  event.preventDefault();
  const form = event.target;
  const requiredFilled = Array.from(form.querySelectorAll('input[required]')).every((input) =>
    form.querySelector(`input[name="${input.name}"]:checked`)
  );
  if (!requiredFilled) {
    const statusEl = document.getElementById('surveyStatus');
    if (statusEl) {
      statusEl.textContent =
        currentLang === 'ne' ? 'कृपया सबै प्रश्न भर्नुहोस्।' : 'Please answer all questions.';
    }
    return;
  }
  // Collect survey data for analytics
  const surveyData = {
    timestamp: new Date().toISOString(),
    responses: {}
  };
  Array.from(form.querySelectorAll('input[type="radio"]:checked')).forEach(input => {
    surveyData.responses[input.name] = input.value;
  });
  
  // Track analytics
  trackFarmerBehavior('survey_completed', surveyData);
  
  const current = loadCredits();
  const newCredits = current + 20;
  saveCredits(newCredits);
  const statusEl = document.getElementById('surveyStatus');
  if (statusEl) {
    statusEl.textContent =
      currentLang === 'ne' ? 'धन्यवाद! तपाईंले २० क्रेडिट पाउनुभयो।' : '✔ Thank you! You earned 20 credit points.';
  }
  form.reset();
  updateAnalytics();
}

/* ============================================
   POLL SYSTEM
   ============================================ */

/**
 * Read polls from localStorage
 * @returns {Array<Object>} Array of poll objects
 */
function readPolls() {
  return JSON.parse(localStorage.getItem('agriPolls') || '[]');
}

/**
 * Write polls to localStorage
 * @param {Array<Object>} polls - Array of poll objects
 */
function writePolls(polls) {
  localStorage.setItem('agriPolls', JSON.stringify(polls));
}

/**
 * Read votes from localStorage
 * @returns {Array<number>} Array of poll IDs that user has voted on
 */
function readVotes() {
  return JSON.parse(localStorage.getItem('agriPollVotes') || '[]');
}

/**
 * Write votes to localStorage
 * @param {Array<number>} votes - Array of poll IDs
 */
function writeVotes(votes) {
  localStorage.setItem('agriPollVotes', JSON.stringify(votes));
}

/**
 * Create a new poll
 */
function createPoll() {
  const questionEl = document.getElementById('pollQuestion');
  const question = questionEl ? questionEl.value.trim() : '';
  const opts = [1, 2, 3, 4]
    .map((i) => {
      const optEl = document.getElementById(`pollOpt${i}`);
      return optEl ? optEl.value.trim() : '';
    })
    .filter((v) => v);
  if (!question || opts.length < 2) {
    const statusEl = document.getElementById('pollStatus');
    if (statusEl) {
      statusEl.textContent =
        currentLang === 'ne' ? 'प्रश्न र कम्तिमा २ विकल्प दिनुहोस्।' : 'Add a question and at least 2 options.';
    }
    return;
  }
  const polls = readPolls();
  polls.push({
    id: Date.now(),
    question,
    options: opts.map((text) => ({ text, votes: 0 }))
  });
  writePolls(polls);
  const statusEl = document.getElementById('pollStatus');
  if (statusEl) {
    statusEl.textContent =
      currentLang === 'ne' ? 'मतदान सिर्जना भयो।' : 'Poll created.';
  }
  ['pollQuestion', 'pollOpt1', 'pollOpt2', 'pollOpt3', 'pollOpt4'].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    }
  );
  renderPolls();
  trackFarmerBehavior('poll_created', { pollId: polls[polls.length - 1].id });
  updateAnalytics();
}

/**
 * Vote on a poll (global function for onclick handlers)
 * @param {number} pollId - Poll ID
 * @param {number} optionIndex - Option index
 */
window.votePoll = function(pollId, optionIndex) {
  const votes = readVotes();
  if (votes.includes(pollId)) return;
  const polls = readPolls();
  const poll = polls.find((p) => p.id === pollId);
  if (!poll) return;
  poll.options[optionIndex].votes += 1;
  votes.push(pollId);
  writePolls(polls);
  writeVotes(votes);
  renderPolls();
  // Track analytics
  trackFarmerBehavior('poll_vote', { pollId, optionIndex });
};

/**
 * Render all polls
 */
function renderPolls() {
  const container = document.getElementById('pollList');
  if (!container) return;
  const polls = readPolls();
  const votes = readVotes();
  if (!polls.length) {
    container.innerHTML = '<div class="muted">No polls yet.</div>';
    return;
  }
  container.innerHTML = polls
    .map((poll) => {
      const voted = votes.includes(poll.id);
      return `
      <div class="poll-card">
        <strong>${poll.question}</strong>
        <div class="poll-options">
          ${poll.options
            .map(
              (opt, idx) => `
              <button class="secondary-btn mini-btn" ${voted ? 'disabled' : ''} onclick="votePoll(${poll.id}, ${idx})">
                ${opt.text} (${opt.votes})
              </button>`
            )
            .join('')}
        </div>
        ${voted ? '<div class="muted">You already voted.</div>' : ''}
      </div>`;
    })
    .join('');
}

/* ============================================
   YIELD ESTIMATOR
   ============================================ */

/**
 * Update yield default value based on selected crop
 */
function updateYieldDefault() {
  const crop = document.getElementById('yieldCrop');
  const perHa = document.getElementById('yieldPerHa');
  if (!crop || !perHa) return;
  const val = yieldTable[crop.value] || 3.0;
  perHa.placeholder = `${val} (t/ha default)`;
}

/**
 * Compute estimated yield
 */
function computeYield() {
  const crop = document.getElementById('yieldCrop');
  const land = document.getElementById('yieldLand');
  const perHa = document.getElementById('yieldPerHa');
  const status = document.getElementById('yieldStatus');
  if (!crop || !land || !perHa || !status) return;
  const landVal = Number(land.value || 0);
  if (!landVal) {
    status.textContent = 'Enter land size.';
    return;
  }
  const base = yieldTable[crop.value] || 3.0;
  const perVal = Number(perHa.value || base);
  const total = (landVal * perVal).toFixed(2);
  status.textContent = `Estimated yield: ${total} tons (using ${perVal} t/ha).`;
}

/* ============================================
   MAIN APPLICATION LOGIC
   ============================================ */

/**
 * Handle location and weather fetch
 */
async function handleLocationAndWeather() {
  const status = document.getElementById('locationStatus');
  if (!status) return;
  
  status.textContent = currentLang === 'ne' ? 'स्थान लिँदै...' : 'Getting location...';
  try {
    const pos = await getLocation();
    const { latitude, longitude } = pos.coords;
    status.textContent = `${currentLang === 'ne' ? 'स्थान पत्ता लाग्यो' : 'Location found'} (${latitude.toFixed(
      3
    )}, ${longitude.toFixed(3)}). ${currentLang === 'ne' ? 'मौसम ल्याउँदै...' : 'Fetching weather...'}`;
    lastWeather = await fetchWeather(latitude, longitude);
    lastWeather.lat = latitude;
    lastWeather.lon = longitude;
    renderForecast(lastWeather.dates, lastWeather.temps, lastWeather.rains);
    status.textContent = lastWeather.fallback
      ? currentLang === 'ne'
        ? 'मौसम सेवा उपलब्ध भएन, औसत डाटा प्रयोग।'
        : 'Weather service unavailable, using average data.'
      : currentLang === 'ne'
      ? 'मौसम प्राप्त भयो, कृपया सिफारिस हेर्नुहोस्।'
      : 'Weather ready, see recommendations.';
    runRecommendation();
  } catch (err) {
    status.textContent =
      currentLang === 'ne'
        ? 'स्थान लिन सकेन। कृपया म्यानुअल उचाइ भरी पुन: प्रयास गर्नुहोस्।'
        : 'Could not get location. Enter elevation and try again.';
    console.error(err);
    // Still attempt recommendation using fallback weather
    lastWeather = await fetchWeather(0, 0);
    renderForecast(lastWeather.dates, lastWeather.temps, lastWeather.rains);
  }
}

/**
 * Run crop recommendation based on current inputs
 * Works independently - can use manual weather or fetch location
 */
function runRecommendation() {
  const soilEl = document.getElementById('soilType');
  const moistureEl = document.getElementById('moistureLevel');
  const elevationEl = document.getElementById('elevation');
  const statusEl = document.getElementById('locationStatus');
  
  if (!soilEl || !moistureEl) {
    if (statusEl) statusEl.textContent = 'UI missing inputs.';
    return;
  }
  
  const soil = soilEl.value;
  const moisture = moistureEl.value;
  const elevationInput = elevationEl ? elevationEl.value : '';
  
  if (!soil || !moisture) {
    if (statusEl) {
      statusEl.textContent =
        currentLang === 'ne' ? 'माटो र आर्द्रता छनोट गर्नुहोस्।' : 'Select soil type and moisture level.';
    }
    return;
  }
  
  // Use existing weather or default values
  const weather = lastWeather || { temp: 26, rain: 10, temps: [], rains: [], dates: [] };
  const elevation = elevationInput ? Number(elevationInput) : 0;
  
  const crops = recommendCrop({
    temp: weather.temp,
    rain: weather.rain,
    soil,
    moisture,
    elevation
  });
  
  renderCropResults(crops);
  if (statusEl) {
    statusEl.textContent = currentLang === 'ne' ? 'सिफारिस तयार।' : 'Recommendations ready.';
  }
  renderInsights(buildWarnings(weather.temps || [], weather.rains || []));
  
  // Track analytics
  trackCropRecommendation(crops, { soil, moisture, elevation, temp: weather.temp, rain: weather.rain });
  updateAnalytics();
}

/* ============================================
   INITIALIZATION
   ============================================ */

/**
 * Initialize application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Apply translations
  applyTranslations();
  
  // Load saved credits
  loadCredits();
  
  // Render initial data
  renderPolls();
  renderNotices();
  renderMarket();
  
  // Event listeners
  const locateBtn = document.getElementById('locateBtn');
  const recommendBtn = document.getElementById('recommendBtn');
  const languageBtn = document.getElementById('languageBtn');
  const surveyForm = document.getElementById('surveyForm');
  const createPollBtn = document.getElementById('createPollBtn');
  const yieldCrop = document.getElementById('yieldCrop');
  const yieldBtn = document.getElementById('yieldBtn');
  
  if (locateBtn) {
    locateBtn.addEventListener('click', handleLocationAndWeather);
  }
  
  if (recommendBtn) {
    recommendBtn.addEventListener('click', runRecommendation);
  }
  
  if (languageBtn) {
    languageBtn.addEventListener('click', translateToNepali);
  }
  
  if (surveyForm) {
    surveyForm.addEventListener('submit', takeSurvey);
  }
  
  if (createPollBtn) {
    createPollBtn.addEventListener('click', createPoll);
  }
  
  
  if (yieldCrop) {
    yieldCrop.addEventListener('change', updateYieldDefault);
    updateYieldDefault();
  }
  
  if (yieldBtn) {
    yieldBtn.addEventListener('click', (e) => {
      e.preventDefault();
      computeYield();
    });
  }
  
  // Analytics tab navigation
  const analyticsTabs = document.querySelectorAll('.analytics-tab');
  analyticsTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      switchAnalyticsTab(targetTab);
    });
  });
  
  // Navbar quick actions
  const navLocateBtn = document.getElementById('navLocateBtn');
  const navSurveyBtn = document.getElementById('navSurveyBtn');
  const navPollBtn = document.getElementById('navPollBtn');
  const navAnalyticsBtn = document.getElementById('navAnalyticsBtn');
  
  if (navLocateBtn) {
    navLocateBtn.addEventListener('click', () => {
      document.getElementById('locationSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  if (navSurveyBtn) {
    navSurveyBtn.addEventListener('click', () => {
      const surveySection = document.getElementById('surveySection');
      if (surveySection) {
        if (surveySection.style.display === 'none' || !surveySection.style.display) {
          surveySection.style.display = 'block';
          surveySection.scrollIntoView({ behavior: 'smooth' });
          surveySection.style.opacity = '0';
          surveySection.style.transform = 'translateY(20px)';
          setTimeout(() => {
            surveySection.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            surveySection.style.opacity = '1';
            surveySection.style.transform = 'translateY(0)';
          }, 10);
        } else {
          surveySection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
  
  if (navPollBtn) {
    navPollBtn.addEventListener('click', () => {
      document.getElementById('pollSection')?.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  if (navAnalyticsBtn) {
    navAnalyticsBtn.addEventListener('click', () => {
      document.getElementById('analyticsSection')?.scrollIntoView({ behavior: 'smooth' });
      switchAnalyticsTab('trends');
    });
  }

  // Initialize analytics
  initializeAnalytics();
  updateAnalytics();
  setupBottomNav();
  setupManualLocation();
  startMarketTicker();
});

/* ============================================
   ANALYTICS & DATA VISUALIZATION
   ============================================ */

/**
 * Track crop recommendation for analytics
 */
function trackCropRecommendation(crops, params) {
  const data = {
    timestamp: new Date().toISOString(),
    crops: crops.map(c => c.name),
    params: params,
    location: lastWeather ? { lat: lastWeather.lat, lon: lastWeather.lon } : null
  };
  analyticsData.cropRecommendations.push(data);
  if (analyticsData.cropRecommendations.length > 100) {
    analyticsData.cropRecommendations.shift(); // Keep last 100
  }
  localStorage.setItem('agriAnalytics_crops', JSON.stringify(analyticsData.cropRecommendations));
}

/**
 * Track farmer behavior
 */
function trackFarmerBehavior(type, data) {
  const behavior = {
    timestamp: new Date().toISOString(),
    type: type,
    data: data
  };
  analyticsData.farmerBehavior.push(behavior);
  if (analyticsData.farmerBehavior.length > 200) {
    analyticsData.farmerBehavior.shift();
  }
  localStorage.setItem('agriAnalytics_behavior', JSON.stringify(analyticsData.farmerBehavior));
}

/**
 * Switch analytics tab
 */
function switchAnalyticsTab(tabName) {
  document.querySelectorAll('.analytics-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.analytics-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  const activeContent = document.getElementById(`${tabName}Tab`);
  
  if (activeTab) activeTab.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
  
  updateAnalytics();
}

/**
 * Initialize analytics
 */
function initializeAnalytics() {
  // Load analytics data
  analyticsData = {
    cropRecommendations: JSON.parse(localStorage.getItem('agriAnalytics_crops') || '[]'),
    farmerBehavior: JSON.parse(localStorage.getItem('agriAnalytics_behavior') || '[]'),
    regionalData: JSON.parse(localStorage.getItem('agriAnalytics_regional') || '[]'),
    surveyResponses: JSON.parse(localStorage.getItem('agriAnalytics_surveys') || '[]')
  };
}

/**
 * Update all analytics displays
 */
function updateAnalytics() {
  renderCropTrends();
  renderRegionalProductivity();
  renderFarmerBehavior();
  renderGovernanceInsights();
}

/**
 * Render crop trends chart with pie and bar charts
 */
function renderCropTrends() {
  const container = document.getElementById('trendsSummary');
  const pieCanvas = document.getElementById('cropTrendsPieChart');
  const barCanvas = document.getElementById('cropTrendsBarChart');
  
  const crops = analyticsData.cropRecommendations;
  if (!crops.length) {
    if (container) container.innerHTML = '<div class="muted">No data yet. Get crop recommendations to see trends.</div>';
    if (pieCanvas) clearCanvas(pieCanvas);
    if (barCanvas) clearCanvas(barCanvas);
    return;
  }
  
  // Count crop frequencies
  const cropCounts = {};
  crops.forEach(rec => {
    rec.crops.forEach(crop => {
      cropCounts[crop] = (cropCounts[crop] || 0) + 1;
    });
  });
  
  const sorted = Object.entries(cropCounts).sort((a, b) => b[1] - a[1]);
  const total = crops.length;
  
  // Draw pie chart
  if (pieCanvas) {
    drawPieChart(pieCanvas, sorted, 'Crop Distribution');
  }
  
  // Draw bar chart
  if (barCanvas) {
    drawBarChart(barCanvas, sorted, 'Crop Popularity', 'Recommendations');
  }
  
  if (container) {
    container.innerHTML = `
      <div class="trends-list">
        ${sorted.map(([crop, count]) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return `
            <div class="trend-item">
              <div class="trend-bar-container">
                <div class="trend-bar" style="width: ${percentage}%"></div>
                <span class="trend-label">${crop}</span>
                <span class="trend-value">${count} (${percentage}%)</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="trends-stats">
        <strong>Total Recommendations:</strong> ${total} | 
        <strong>Most Popular:</strong> ${sorted[0] ? sorted[0][0] : 'N/A'}
      </div>
    `;
  }
}

/**
 * Render regional productivity map with charts
 */
function renderRegionalProductivity() {
  const container = document.getElementById('productivityGrid');
  const stats = document.getElementById('productivityStats');
  const pieCanvas = document.getElementById('productivityPieChart');
  const lineCanvas = document.getElementById('productivityLineChart');
  
  if (!container) return;
  
  // Group by region (simplified - using elevation ranges)
  const regions = {
    'Lowland': { count: 0, crops: [], label: 'Lowland (< 500m)' },
    'Midland': { count: 0, crops: [], label: 'Midland (500-1500m)' },
    'Highland': { count: 0, crops: [], label: 'Highland (> 1500m)' }
  };
  
  analyticsData.cropRecommendations.forEach(rec => {
    const elev = rec.params.elevation || 0;
    let regionKey = 'Lowland';
    if (elev > 1500) regionKey = 'Highland';
    else if (elev > 500) regionKey = 'Midland';
    
    regions[regionKey].count++;
    regions[regionKey].crops.push(...rec.crops);
  });
  
  const regionData = Object.entries(regions).map(([key, data]) => [data.label, data.count]);
  
  // Draw pie chart
  if (pieCanvas) {
    drawPieChart(pieCanvas, regionData, 'Regional Distribution');
  }
  
  // Draw line chart (time series simulation)
  if (lineCanvas) {
    const timeData = generateTimeSeriesData(regions);
    drawLineChart(lineCanvas, timeData, 'Productivity Trends', 'Days', 'Recommendations');
  }
  
  container.innerHTML = Object.entries(regions).map(([key, data]) => {
    const topCrops = {};
    data.crops.forEach(crop => {
      topCrops[crop] = (topCrops[crop] || 0) + 1;
    });
    const topCrop = Object.entries(topCrops).sort((a, b) => b[1] - a[1])[0];
    
    return `
      <div class="productivity-card">
        <h4>${data.label}</h4>
        <div class="productivity-value">${data.count} recommendations</div>
        <div class="productivity-crop">Top crop: ${topCrop ? topCrop[0] : 'N/A'}</div>
      </div>
    `;
  }).join('');
  
  if (stats) {
    const total = Object.values(regions).reduce((sum, r) => sum + r.count, 0);
    stats.innerHTML = `
      <p><strong>Total Regional Data Points:</strong> ${total}</p>
      <p>Data helps identify regional crop preferences and productivity patterns.</p>
    `;
  }
}

/**
 * Render farmer behavior patterns with charts
 */
function renderFarmerBehavior() {
  const container = document.getElementById('behaviorCards');
  const insights = document.getElementById('behaviorInsights');
  const pieCanvas = document.getElementById('behaviorPieChart');
  const barCanvas = document.getElementById('behaviorBarChart');
  
  if (!container) return;
  
  const behaviors = analyticsData.farmerBehavior;
  if (!behaviors.length) {
    container.innerHTML = '<div class="muted">No behavior data yet.</div>';
    if (pieCanvas) clearCanvas(pieCanvas);
    if (barCanvas) clearCanvas(barCanvas);
    return;
  }
  
  const behaviorTypes = {};
  behaviors.forEach(b => {
    behaviorTypes[b.type] = (behaviorTypes[b.type] || 0) + 1;
  });
  
  const behaviorData = Object.entries(behaviorTypes).map(([type, count]) => {
    const label = type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return [label, count];
  });
  
  // Draw pie chart
  if (pieCanvas) {
    drawPieChart(pieCanvas, behaviorData, 'Behavior Distribution');
  }
  
  // Draw bar chart
  if (barCanvas) {
    drawBarChart(barCanvas, behaviorData, 'Engagement Levels', 'Actions');
  }
  
  container.innerHTML = behaviorData.map(([label, count], idx) => {
    const type = Object.keys(behaviorTypes)[idx];
    return `
      <div class="behavior-card">
        <div class="behavior-icon">${getBehaviorIcon(type)}</div>
        <div class="behavior-label">${label}</div>
        <div class="behavior-count">${count}</div>
      </div>
    `;
  }).join('');
  
  if (insights) {
    const surveys = behaviors.filter(b => b.type === 'survey_completed').length;
    const polls = behaviors.filter(b => b.type === 'poll_vote').length;
    insights.innerHTML = `
      <div class="insight-card">
        <h4>Key Insights</h4>
        <ul>
          <li><strong>${surveys}</strong> surveys completed - shows engagement level</li>
          <li><strong>${polls}</strong> poll votes - indicates participation</li>
          <li>Behavior patterns help optimize app features and government programs</li>
        </ul>
      </div>
    `;
  }
}

/**
 * Get icon for behavior type
 */
function getBehaviorIcon(type) {
  const icons = {
    'survey_completed': '📋',
    'poll_vote': '🗳️',
    'crop_recommendation': '🌾',
    'location_access': '📍'
  };
  return icons[type] || '📊';
}

/**
 * Render governance insights with charts
 */
function renderGovernanceInsights() {
  const dashboard = document.getElementById('governanceDashboard');
  const targeting = document.getElementById('subsidyTargeting');
  const coordination = document.getElementById('coordinationInsights');
  const pieCanvas = document.getElementById('governancePieChart');
  const barCanvas = document.getElementById('governanceBarChart');
  
  if (!dashboard) return;
  
  const crops = analyticsData.cropRecommendations;
  const surveys = analyticsData.farmerBehavior.filter(b => b.type === 'survey_completed');
  const polls = analyticsData.farmerBehavior.filter(b => b.type === 'poll_vote' || b.type === 'poll_created');
  
  // Prepare chart data
  const dataSources = [
    ['Crop Recommendations', crops.length],
    ['Surveys', surveys.length],
    ['Polls', polls.length]
  ];
  
  // Draw pie chart
  if (pieCanvas) {
    drawPieChart(pieCanvas, dataSources, 'Data Sources');
  }
  
  // Prepare metrics for bar chart
  const metrics = [
    ['Data Points', crops.length + surveys.length],
    ['Active Regions', new Set(crops.map(c => c.params.elevation > 1500 ? 'Highland' : c.params.elevation > 500 ? 'Midland' : 'Lowland')).size],
    ['Engagement', surveys.length + polls.length]
  ];
  
  // Draw bar chart
  if (barCanvas) {
    drawBarChart(barCanvas, metrics, 'Governance Metrics', 'Count');
  }
  
  // Governance dashboard
  dashboard.innerHTML = `
    <div class="governance-metrics">
      <div class="metric-card">
        <h4>Data Points Collected</h4>
        <div class="metric-value">${crops.length + surveys.length}</div>
        <div class="metric-label">Evidence for policy decisions</div>
      </div>
      <div class="metric-card">
        <h4>Active Regions</h4>
        <div class="metric-value">${new Set(crops.map(c => c.params.elevation > 1500 ? 'Highland' : c.params.elevation > 500 ? 'Midland' : 'Lowland')).size}</div>
        <div class="metric-label">Geographic coverage</div>
      </div>
      <div class="metric-card">
        <h4>Farmer Engagement</h4>
        <div class="metric-value">${surveys.length}</div>
        <div class="metric-label">Surveys completed</div>
      </div>
    </div>
  `;
  
  // Subsidy targeting
  if (targeting) {
    const soilTypes = {};
    crops.forEach(c => {
      const soil = c.params.soil;
      if (soil) soilTypes[soil] = (soilTypes[soil] || 0) + 1;
    });
    
    const topSoil = Object.entries(soilTypes).sort((a, b) => b[1] - a[1])[0];
    
    targeting.innerHTML = `
      <h4>Targeted Subsidy Recommendations</h4>
      <div class="targeting-card">
        <p><strong>Most Common Soil Type:</strong> ${topSoil ? topSoil[0] : 'N/A'}</p>
        <p>Subsidies should prioritize inputs suitable for ${topSoil ? topSoil[0].toLowerCase() : 'common'} soil conditions.</p>
        <p><strong>Regional Focus:</strong> Data shows ${topSoil ? topSoil[1] : 0} farmers using ${topSoil ? topSoil[0].toLowerCase() : 'this'} soil type.</p>
      </div>
    `;
  }
  
  // Coordination insights
  if (coordination) {
    coordination.innerHTML = `
      <h4>Intergovernmental Coordination Insights</h4>
      <div class="coordination-card">
        <ul>
          <li><strong>Data Sharing:</strong> ${crops.length} crop recommendations provide insights for agricultural planning</li>
          <li><strong>Regional Patterns:</strong> Identify which regions need more support</li>
          <li><strong>Policy Alignment:</strong> Survey data helps align subsidies with farmer needs</li>
          <li><strong>Resource Allocation:</strong> Evidence-based distribution of agricultural resources</li>
        </ul>
      </div>
    `;
  }
}

/* ============================================
   CHART DRAWING FUNCTIONS
   ============================================ */

/**
 * Draw pie chart on canvas
 */
function drawPieChart(canvas, data, title) {
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 20;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!data || data.length === 0) {
    ctx.fillStyle = '#999';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('No data available', centerX, centerY);
    return;
  }
  
  // Calculate total
  const total = data.reduce((sum, [, value]) => sum + value, 0);
  if (total === 0) {
    ctx.fillStyle = '#999';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('No data available', centerX, centerY);
    return;
  }
  
  // Colors
  const colors = ['#2f8f2f', '#41b66a', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9', '#4caf50', '#66bb6a'];
  
  let currentAngle = -Math.PI / 2;
  
  // Draw pie slices
  data.forEach(([label, value], index) => {
    const sliceAngle = (value / total) * 2 * Math.PI;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = colors[index % colors.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
    const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
    
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(`${((value / total) * 100).toFixed(0)}%`, labelX, labelY);
    
    currentAngle += sliceAngle;
  });
  
  // Draw title
  ctx.fillStyle = '#123015';
  ctx.font = 'bold 14px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(title, centerX, 20);
  
  // Draw legend
  let legendY = canvas.height - 20;
  data.forEach(([label, value], index) => {
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(20, legendY - 10, 15, 15);
    ctx.fillStyle = '#123015';
    ctx.font = '11px Poppins';
    ctx.textAlign = 'left';
    ctx.fillText(`${label} (${value})`, 40, legendY);
    legendY -= 20;
  });
}

/**
 * Draw bar chart on canvas
 */
function drawBarChart(canvas, data, title, yLabel) {
  const ctx = canvas.getContext('2d');
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!data || data.length === 0) {
    ctx.fillStyle = '#999';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  const maxValue = Math.max(...data.map(([, value]) => value), 1);
  const barWidth = chartWidth / data.length - 10;
  const colors = ['#2f8f2f', '#41b66a', '#66bb6a', '#81c784', '#a5d6a7'];
  
  // Draw title
  ctx.fillStyle = '#123015';
  ctx.font = 'bold 14px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, 20);
  
  // Draw bars
  data.forEach(([label, value], index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * (chartWidth / data.length) + 5;
    const y = canvas.height - padding - barHeight;
    
    // Draw bar
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw value on top
    ctx.fillStyle = '#123015';
    ctx.font = 'bold 12px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    
    // Draw label
    ctx.save();
    ctx.translate(x + barWidth / 2, canvas.height - padding + 15);
    ctx.rotate(-Math.PI / 4);
    ctx.font = '10px Poppins';
    ctx.textAlign = 'left';
    ctx.fillText(label, 0, 0);
    ctx.restore();
  });
  
  // Draw Y-axis label
  ctx.save();
  ctx.translate(15, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#5a6b5c';
  ctx.font = '12px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();
  
  // Draw grid lines
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = '#5a6b5c';
    ctx.font = '10px Poppins';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round((maxValue / 5) * (5 - i)).toString(), padding - 10, y + 4);
  }
}

/**
 * Draw line chart on canvas
 */
function drawLineChart(canvas, data, title, xLabel, yLabel) {
  const ctx = canvas.getContext('2d');
  const padding = 60;
  const chartWidth = canvas.width - padding * 2;
  const chartHeight = canvas.height - padding * 2;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (!data || data.length === 0) {
    ctx.fillStyle = '#999';
    ctx.font = '16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
    return;
  }
  
  const maxValue = Math.max(...data.map(d => Math.max(...d.values)), 1);
  const colors = ['#2f8f2f', '#41b66a', '#66bb6a', '#81c784'];
  
  // Draw title
  ctx.fillStyle = '#123015';
  ctx.font = 'bold 14px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, 20);
  
  // Draw grid
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = padding + (chartHeight / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }
  
  // Draw lines
  data.forEach((series, seriesIndex) => {
    ctx.strokeStyle = colors[seriesIndex % colors.length];
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    series.values.forEach((value, index) => {
      const x = padding + (chartWidth / (series.values.length - 1)) * index;
      const y = canvas.height - padding - (value / maxValue) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw points
    series.values.forEach((value, index) => {
      const x = padding + (chartWidth / (series.values.length - 1)) * index;
      const y = canvas.height - padding - (value / maxValue) * chartHeight;
      
      ctx.fillStyle = colors[seriesIndex % colors.length];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  });
  
  // Draw legend
  let legendX = canvas.width - 150;
  let legendY = 40;
  data.forEach((series, index) => {
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(legendX, legendY, 15, 15);
    ctx.fillStyle = '#123015';
    ctx.font = '11px Poppins';
    ctx.textAlign = 'left';
    ctx.fillText(series.label, legendX + 20, legendY + 12);
    legendY += 20;
  });
}

/**
 * Generate time series data for line chart
 */
function generateTimeSeriesData(regions) {
  const days = 7;
  const series = [];
  
  Object.entries(regions).forEach(([key, data]) => {
    const values = [];
    const baseValue = data.count / days;
    for (let i = 0; i < days; i++) {
      values.push(Math.max(0, baseValue + (Math.random() - 0.5) * baseValue * 0.5));
    }
    series.push({ label: data.label, values });
  });
  
  return series;
}

/**
 * Clear canvas
 */
function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#999';
  ctx.font = '16px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
}
