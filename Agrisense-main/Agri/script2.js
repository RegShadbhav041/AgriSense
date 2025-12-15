const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => Array.from(r.querySelectorAll(s));

const DICTS = {
  ne: {
    app_name: "AgriSense",
    tagline: "सही समय, सही बाली, सही बजार",
    hero_title: "Grow the right crop, at the right time, for the right market.",
    detect_location: "मेरो स्थान पहिचान गर्नुहोस्",
    crop_advice: "बाली सल्लाह",
    weather_alerts: "मौसम सूचना",
    market_prices: "बजार मूल्य",
    gov_support: "सरकारी सहयोग",
    dash_title: "स्थान-आधारित सल्लाह",
    district: "जिल्ला",
    altitude: "उचाइ",
    climate_zone: "जलवायु क्षेत्र",
    manual_location: "म्यानुअल स्थान",
    best_crops: "उत्तम बाली",
    med_plants: "औषधीय बिरुवा",
    other_income: "अन्य आम्दानी विकल्प",
    weather_title: "जलवायु तथा मौसम बुद्धिमत्ता",
    alerts: "चेतावनी",
    cult_title: "खेती मार्गदर्शन",
    voice_guidance: "भ्वाइस मार्गदर्शन",
    seed_selection: "बीउ चयन",
    fert_irrig: "मल र सिंचाइ तालिका",
    pest_disease: "कीरा र रोग सचेतना",
    market_title: "बजार रोडमैप",
    market_suggestions: "सुझाव",
    nearby_markets: "नजिकका बजार/सहकारी",
    policy_title: "नीति तथा अनुदान",
    nav_home: "गृह",
    nav_reco: "सल्लाह",
    nav_weather: "मौसम",
    nav_market: "बजार",
    nav_policy: "अनुदान",
    set_location: "स्थान चयन",
    select_district: "जिल्ला चयन:",
    cancel: "रद्द",
    set: "सेट",
  },
  en: {
    app_name: "AgriSense",
    tagline: "Right time, right crop, right market",
    hero_title: "Grow the right crop, at the right time, for the right market.",
    detect_location: "Detect My Location",
    crop_advice: "Crop Advice",
    weather_alerts: "Weather Alerts",
    market_prices: "Market Prices",
    gov_support: "Government Support",
    dash_title: "Location-based Recommendations",
    district: "District",
    altitude: "Altitude",
    climate_zone: "Climate Zone",
    manual_location: "Manual Location",
    best_crops: "Best Crops",
    med_plants: "Medicinal Plants",
    other_income: "Other Income Options",
    weather_title: "Climate & Weather Intelligence",
    alerts: "Alerts",
    cult_title: "Cultivation Guidance",
    voice_guidance: "Voice Guidance",
    seed_selection: "Seed Selection",
    fert_irrig: "Fertilizer & Irrigation",
    pest_disease: "Pest & Disease Alerts",
    market_title: "Market Roadmap",
    market_suggestions: "Suggestions",
    nearby_markets: "Nearby Markets/Cooperatives",
    policy_title: "Policy & Subsidies",
    nav_home: "Home",
    nav_reco: "Advice",
    nav_weather: "Weather",
    nav_market: "Market",
    nav_policy: "Subsidy",
    set_location: "Set Location",
    select_district: "Select District:",
    cancel: "Cancel",
    set: "Set",
  },
};

const DEFAULT_STATE = {
  lang: "ne",
  location: { lat: null, lon: null, altitude: null, district: null, climate: null },
  weather: [],
  alerts: [],
  recommendations: { crops: [], meds: [], incomes: [] },
  market: { prices: [], tips: [], nearby: [] },
  policy: [],
};

let state = loadState() || DEFAULT_STATE;

function translate() {
  const dict = DICTS[state.lang];
  qa("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (dict[k]) el.textContent = dict[k];
  });
  document.documentElement.lang = state.lang;
}

function setToast(msg) {
  const t = q("#toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2500);
}

function saveState() {
  try { localStorage.setItem("agrisense_state", JSON.stringify(state)); } catch {}
}
function loadState() {
  try {
    const s = localStorage.getItem("agrisense_state");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function navigate(target) {
  qa(".view").forEach((v) => v.classList.remove("active"));
  qa(".nav-btn").forEach((b) => b.classList.remove("active"));
  const view = q(`#${target}`);
  if (view) view.classList.add("active");
  qa(`.nav-btn[data-target="${target}"]`).forEach((b) => b.classList.add("active"));
}

function nearestDistrict(lat, lon) {
  const pts = [
    { d: "Kathmandu", lat: 27.7172, lon: 85.3240, markets: ["कलंकी", "कालीमाटी", "नयाँबजार"] },
    { d: "Kaski", lat: 28.2096, lon: 83.9856, markets: ["पोखरा", "लामाचौर", "मिलनचोक"] },
    { d: "Morang", lat: 26.4870, lon: 87.2846, markets: ["बिराटनगर", "रङ्गेली", "लेटाङ"] },
    { d: "Banke", lat: 28.0500, lon: 81.6167, markets: ["नेपालगञ्ज", "खजुरा", "कोहिलपुर"] },
    { d: "Lalitpur", lat: 27.6667, lon: 85.3333, markets: ["लगनखेल", "गोदावरी", "चापागाउँ"] },
    { d: "Chitwan", lat: 27.5291, lon: 84.3542, markets: ["भरतपुर", "रत्ननगर", "नारायणगढ"] },
    { d: "Rupandehi", lat: 27.5760, lon: 83.5070, markets: ["बुटवल", "भैरहवा", "मणिग्राम"] },
  ];
  let best = pts[0], bd = Infinity;
  pts.forEach((p) => {
    const dl = lat - p.lat, dn = lon - p.lon;
    const dist = Math.hypot(dl, dn);
    if (dist < bd) { bd = dist; best = p; }
  });
  return best;
}

function getClimateZone(lat, alt) {
  if (alt != null) {
    if (alt < 1000) return "Terai/Subtropical";
    if (alt < 2000) return "Mid-Hill/Temperate";
    return "High-Hill/Cold";
  }
  if (lat < 27) return "Terai/Subtropical";
  if (lat < 29) return "Mid-Hill/Temperate";
  return "High-Hill/Cold";
}

function renderLocationSummary() {
  q("#districtText").textContent = state.location.district || "—";
  q("#altitudeText").textContent = state.location.altitude != null ? Math.round(state.location.altitude) + " m" : "—";
  q("#climateText").textContent = state.location.climate || "—";
}

function genRecommendations() {
  const zone = state.location.climate;
  const crops = zone === "Terai/Subtropical"
    ? ["धान", "गहुँ", "मकै", "केरा", "तरकारी"]
    : zone === "Mid-Hill/Temperate"
    ? ["कोदो", "फलफुल", "मस्यौरा", "आलु", "गहुँ"]
    : ["फापर", "जौ", "आलु", "पूँजीकृत साग", "जडीबुटी"];
  const meds = zone === "High-Hill/Cold"
    ? ["यार्सागुम्बा", "जटामासी", "पाँचऔले"]
    : ["अश्वगन्धा", "तुलसी", "पुदिना"];
  const incomes = ["डेरी", "मौरी पालन", "बाख्रापालन", "जडीबुटी", "औषधीय साग"];
  state.recommendations.crops = crops.map((n) => ({
    name: n,
    profit: ["कम", "मध्यम", "उच्च"][Math.floor(Math.random() * 3)],
    trend: ["↑", "↓", "→"][Math.floor(Math.random() * 3)],
    suitability: ["★★★", "★★★★", "★★★★★"][Math.floor(Math.random() * 3)],
    sustain: ["A", "B", "C"][Math.floor(Math.random() * 3)],
  }));
  state.recommendations.meds = meds.map((n) => ({
    name: n,
    profit: ["मध्यम", "उच्च"][Math.floor(Math.random() * 2)],
    trend: ["↑", "→"][Math.floor(Math.random() * 2)],
    suitability: ["★★★★", "★★★★★"][Math.floor(Math.random() * 2)],
    sustain: ["A", "B"][Math.floor(Math.random() * 2)],
  }));
  state.recommendations.incomes = incomes.map((n) => ({
    name: n,
    profit: ["मध्यम", "उच्च"][Math.floor(Math.random() * 2)],
    trend: ["↑", "→"][Math.floor(Math.random() * 2)],
    suitability: ["★★★", "★★★★"][Math.floor(Math.random() * 2)],
    sustain: ["A", "B"][Math.floor(Math.random() * 2)],
  }));
}

function cardEl(item) {
  const el = document.createElement("div");
  el.className = "reco-card";
  const ic = document.createElement("div");
  ic.className = "reco-icon";
  ic.textContent = "🌱";
  const mid = document.createElement("div");
  mid.innerHTML = `<div class="title">${item.name}</div>
    <div class="score">Suit: ${item.suitability} • Sustain: ${item.sustain}</div>`;
  const right = document.createElement("div");
  right.innerHTML = `<div class="trend">${item.trend}</div><div class="score">${item.profit}</div>`;
  el.append(ic, mid, right);
  return el;
}

function renderRecommendations() {
  const cropWrap = q("#cropCards");
  const medWrap = q("#medCards");
  const incWrap = q("#incomeCards");
  cropWrap.innerHTML = "";
  medWrap.innerHTML = "";
  incWrap.innerHTML = "";
  state.recommendations.crops.forEach((i) => cropWrap.appendChild(cardEl(i)));
  state.recommendations.meds.forEach((i) => medWrap.appendChild(cardEl(i)));
  state.recommendations.incomes.forEach((i) => incWrap.appendChild(cardEl(i)));
}

function genWeather() {
  const days = [];
  for (let i = 0; i < 10; i++) {
    const base = state.location.climate === "High-Hill/Cold" ? 12 : state.location.climate === "Mid-Hill/Temperate" ? 22 : 30;
    const tHigh = Math.round(base + (Math.random() * 8 - 2));
    const tLow = Math.round(tHigh - (6 + Math.random() * 4));
    const rain = Math.round(Math.max(0, (Math.random() - 0.4) * 40));
    days.push({ tHigh, tLow, rain });
  }
  state.weather = days;
  const alerts = [];
  days.forEach((d, idx) => {
    if (d.rain >= 25) alerts.push({ type: "danger", text: "Heavy rainfall warning", action: "Harvest early" });
    if (d.tLow <= 3) alerts.push({ type: "warning", text: "Frost risk", action: "Protect seedlings" });
    if (d.tHigh >= 35) alerts.push({ type: "warning", text: "Heatwave & pest risk", action: "Irrigate, monitor pests" });
    if (idx > 1) {
      const a = days[idx - 1], b = days[idx - 2];
      if (d.tHigh >= 33 && (a.rain + b.rain + d.rain) >= 45) alerts.push({ type: "warning", text: "High pest risk", action: "Use traps, bio-control" });
    }
  });
  state.alerts = alerts.slice(0, 6);
}

function renderWeather() {
  const tl = q("#weatherTimeline");
  tl.innerHTML = "";
  const now = new Date();
  state.weather.forEach((d, idx) => {
    const day = document.createElement("div");
    day.className = "day-card";
    const dt = new Date(now.getTime() + idx * 86400000);
    const label = dt.toLocaleDateString(undefined, { weekday: "short", day: "numeric" });
    day.innerHTML = `<div class="day">${label}</div>
      <div class="temp">${d.tHigh}° / ${d.tLow}°C</div>
      <div class="rain">${d.rain}mm</div>`;
    tl.appendChild(day);
  });
  const al = q("#alertList");
  al.innerHTML = "";
  state.alerts.forEach((a) => {
    const el = document.createElement("div");
    el.className = `alert-card ${a.type}`;
    el.innerHTML = `<strong>${a.text}</strong><div>${a.action}</div>`;
    al.appendChild(el);
  });
}

function genMarket() {
  const prices = [];
  let p = 100 + Math.random() * 40;
  for (let i = 0; i < 14; i++) {
    p += Math.random() * 8 - 2;
    prices.push(Math.max(50, Math.round(p)));
  }
  state.market.prices = prices;
  const slope = prices[prices.length - 1] - prices[0];
  const tips = [];
  if (slope > 10) tips.push("Wait 2 weeks for higher demand");
  else if (slope < -10) tips.push("Sell early before price drops");
  else tips.push("Stable market, negotiate better transport rates");
  const near = state.location.district ? nearestDistrict(state.location.lat || 27.7, state.location.lon || 85.3).markets : ["स्थानीय सहकारी", "नगर बजार", "कृषि केन्द्र"];
  state.market.tips = tips;
  state.market.nearby = near;
}

function drawChart() {
  const cvs = q("#priceChart");
  const ctx = cvs.getContext("2d");
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  const pad = 28;
  const w = cvs.width - pad * 2;
  const h = cvs.height - pad * 2;
  const prices = state.market.prices;
  const min = Math.min(...prices), max = Math.max(...prices);
  ctx.strokeStyle = "#e0e0e0";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad + (h / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + w, y); ctx.stroke();
  }
  ctx.strokeStyle = "#2b7bd8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  prices.forEach((p, i) => {
    const x = pad + (w / (prices.length - 1)) * i;
    const y = pad + h - ((p - min) / (max - min || 1)) * h;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = "#1d7a36";
  ctx.font = "12px system-ui";
  ctx.fillText("Price Trend (Index)", pad, pad - 10);
}

function renderMarket() {
  drawChart();
  const tips = q("#marketTips");
  tips.innerHTML = "";
  state.market.tips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    tips.appendChild(li);
  });
  const mk = q("#nearbyMarkets");
  mk.innerHTML = "";
  state.market.nearby.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = m;
    mk.appendChild(li);
  });
}

function genPolicy() {
  const items = [
    { name: "बीउ अनुदान", eligible: true, desc: "प्रमाणित बीउमा आंशिक अनुदान उपलब्ध" },
    { name: "सिंचाइ अनुदान", eligible: state.location.climate !== "Terai/Subtropical", desc: "साना सिंचाइ प्रविधिमा सहयोग" },
    { name: "जैविक खेती प्रोत्साहन", eligible: true, desc: "जैविक प्रमाणीकरणमा सहायता" },
    { name: "डेरी सहुलियत ऋण", eligible: true, desc: "सहुलियत दरमा ऋण योजना" },
  ];
  state.policy = items;
}

function renderPolicy() {
  const wrap = q("#policyCards");
  wrap.innerHTML = "";
  state.policy.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    const badge = p.eligible ? "✅" : "❌";
    card.innerHTML = `<div class="title">${p.name} ${badge}</div><div class="score">${p.desc}</div>`;
    wrap.appendChild(card);
  });
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = state.lang === "ne" ? "ne-NP" : "en-US";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function initEvents() {
  q("#langToggle").addEventListener("click", () => {
    state.lang = state.lang === "ne" ? "en" : "ne";
    translate();
    saveState();
  });
  qa(".feature-card").forEach((b) => b.addEventListener("click", () => navigate(b.dataset.target)));
  qa(".nav-btn").forEach((b) => b.addEventListener("click", () => navigate(b.dataset.target)));
  q("#detectBtn").addEventListener("click", () => {
    if (!navigator.geolocation) { setToast("Location not supported"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, altitude } = pos.coords;
        state.location.lat = latitude;
        state.location.lon = longitude;
        state.location.altitude = altitude ?? null;
        const d = nearestDistrict(latitude, longitude);
        state.location.district = d.d;
        state.location.climate = getClimateZone(latitude, state.location.altitude);
        renderLocationSummary();
        genRecommendations(); renderRecommendations();
        genWeather(); renderWeather();
        genMarket(); renderMarket();
        genPolicy(); renderPolicy();
        state.market.nearby = d.markets;
        saveState();
        navigate("dashboard");
        setToast("स्थान अपडेट भयो");
      },
      () => {
        setToast("स्थान पहिचान असफल। म्यानुअल सेट गर्नुहोस्");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
  q("#manualLocationBtn").addEventListener("click", () => {
    q("#locationDialog").showModal();
  });
  q("#dialogCancel").addEventListener("click", () => q("#locationDialog").close());
  q("#dialogSet").addEventListener("click", () => {
    const dSel = q("#districtSelect").value;
    const map = {
      Kathmandu: { lat: 27.7172, lon: 85.3240 },
      Kaski: { lat: 28.2096, lon: 83.9856 },
      Morang: { lat: 26.4870, lon: 87.2846 },
      Banke: { lat: 28.0500, lon: 81.6167 },
      Lalitpur: { lat: 27.6667, lon: 85.3333 },
      Chitwan: { lat: 27.5291, lon: 84.3542 },
      Rupandehi: { lat: 27.5760, lon: 83.5070 },
    };
    const p = map[dSel];
    state.location = {
      lat: p.lat, lon: p.lon, altitude: null, district: dSel,
      climate: getClimateZone(p.lat, null),
    };
    renderLocationSummary();
    genRecommendations(); renderRecommendations();
    genWeather(); renderWeather();
    genMarket(); renderMarket();
    genPolicy(); renderPolicy();
    saveState();
    q("#locationDialog").close();
    navigate("dashboard");
    setToast("म्यानुअल स्थान सेट भयो");
  });
  q("#voiceBtn").addEventListener("click", () => {
    const panels = qa(".acc-panel");
    const text = panels.map((p) => p.textContent.trim()).join(". ");
    speak(text);
  });
  qa(".acc-header").forEach((h) => {
    h.addEventListener("click", () => {
      const panel = h.nextElementSibling;
      const open = panel.style.display === "block";
      qa(".acc-panel").forEach((p) => (p.style.display = "none"));
      panel.style.display = open ? "none" : "block";
    });
  });
}

function hydrateFromCache() {
  if (!state.location.district) return;
  translate();
  renderLocationSummary();
  if (!state.recommendations.crops.length) genRecommendations();
  renderRecommendations();
  if (!state.weather.length) genWeather();
  renderWeather();
  if (!state.market.prices.length) genMarket();
  renderMarket();
  if (!state.policy.length) genPolicy();
  renderPolicy();
}

function init() {
  translate();
  initEvents();
  hydrateFromCache();
}

document.addEventListener("DOMContentLoaded", init);
