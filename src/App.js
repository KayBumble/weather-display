import './App.css';
import { useEffect, useState } from "react";


const WEATHER_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mostly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  61: { label: "Light rain", icon: "🌦️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  66: { label: "Freezing rain", icon: "🌧️" },
  71: { label: "Light snow", icon: "🌨️" },
  73: { label: "Snow", icon: "🌨️" },
  75: { label: "Heavy snow", icon: "❄️" },
  77: { label: "A bit of snow", icon: "🌨️" },
  80: { label: "Light showers", icon: "🌦️" },
  81: { label: "Showers", icon: "🌧️" },
  82: { label: "Heavy showers", icon: "⛈️" },
  85: { label: "Snow showers", icon: "🌨️" },
  86: { label: "Heavy snow showers", icon: "❄️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with hail", icon: "⛈️" }
};

const FORECAST_DAYS = 5;

const describe = (code) => WEATHER_CODES[code] ?? { label: "Unknown", icon: "🌡️" };

const weekdayName = (isoDate, index) =>
  index === 0
    ? "Today"
    : new Date(`${isoDate}T00:00`).toLocaleDateString("en-GB", { weekday: "short" });

//converts a place name to lat/lon
const fetchCoords = async (place) => {
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`;
  const result = await fetch(geoUrl);
  const data = await result.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No city found for "${place}"`);
  }

  const { latitude, longitude, name, country } = data.results[0];
  return { latitude, longitude, name, country };
};

const fetchWeather = async (place) => {
  const coords = await fetchCoords(place);

  const weatherUrl =
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&forecast_days=${FORECAST_DAYS}&timezone=auto`;
  const result = await fetch(weatherUrl);
  if (!result.ok) throw new Error("Couldn't load the forecast. Try again.");
  const data = await result.json();

  return {
    city: coords.name,
    country: coords.country,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    condition: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    wind: Math.round(data.current.wind_speed_10m),
    date: new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }),
    forecast: data.daily.time.map((date, i) => ({
      date,
      code: data.daily.weather_code[i],
      max: Math.round(data.daily.temperature_2m_max[i]),
      min: Math.round(data.daily.temperature_2m_min[i]),
    })),
  };
};

function App() {
  const [weather, setWeather] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadCity = async (place) => {
    setLoading(true);
    setError("");
    try {
      setWeather(await fetchWeather(place));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCity("Brighton");
  }, []); //only load default city once

  const handleSearch = (e) => {
    e.preventDefault();
    const place = input.trim();
    if (!place) return;
    loadCity(place);
    setInput("");
  };

  const current = weather && describe(weather.condition);

  return (
    <div className="wrapper">
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a city…"
          aria-label="City"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "…" : "Search"}
        </button>
      </form>

      {error && <p className="error" role="alert">{error}</p>}

      {!weather && loading && <p className="status">Loading weather…</p>}

      {weather && (
        <>
          <div className="header">
            <h1 className="city">
              {weather.city}
              {weather.country && <span className="country">, {weather.country}</span>}
            </h1>
            <p className="date">{weather.date}</p>

            <div className="current">
              <span className="current-icon" aria-hidden="true">{current.icon}</span>
              <p className="temperature">{weather.temperature}°C</p>
            </div>
            <p className="condition">{current.label}</p>
          </div>

          <div className="weather-details">
            <div className="detail">
              <span className="detail-label">Feels like</span>
              <span className="detail-value">{weather.feelsLike}°C</span>
            </div>
            <div className="detail">
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weather.humidity}%</span>
            </div>
            <div className="detail">
              <span className="detail-label">Wind</span>
              <span className="detail-value">{weather.wind} km/h</span>
            </div>
          </div>

          <div className="forecast">
            <h2 className="forecast-header">{weather.forecast.length}-day forecast</h2>

            <div className="forecast-days">
              {weather.forecast.map((day, index) => {
                const { label, icon } = describe(day.code);
                return (
                  <div className="forecast-day" key={day.date}>
                    <p className="forecast-weekday">{weekdayName(day.date, index)}</p>
                    <span className="forecast-icon" role="img" aria-label={label} title={label}>{icon}</span>
                    <p className="forecast-temp">
                      <span className="max">{day.max}°</span>
                      <span className="min">{day.min}°</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
