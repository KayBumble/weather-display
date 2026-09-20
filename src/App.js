import './App.css';
import { useEffect, useState } from "react";



function App() {

const [weather, setWeather] = useState(null); //state to hold weather data
const [city, setCity] = useState("London");
const [input, setInput] = useState(""); //state to hold user input


//converts coords to lat and lon
const fetchCoords = async (place) => { //calls api
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${place}`;
  const result = await fetch(geoUrl);
  const data = await result.json();

if(!data.results || data.results.length === 0) {
  throw new Error("No city found");
  return null;
}

  return {
    latitude: data.results[0].latitude,
    longitude: data.results[0].longitude,
    name: data.results[0].name
  };
}



const fetchWeather = async (place) => { //fetches weather data
  const coords = await fetchCoords(place);
  if (!coords) return;

  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
  const result = await fetch(weatherUrl);
  const data = await result.json();

  setWeather({
    weekDays: data.daily.time,
    city: coords.name,
    temperature: data.current.temperature_2m,
    condition: data.current.weather_code,
    date: new Date().toLocaleDateString(),
    humidity: data.current.humidity,
    minTemp: data.daily.temperature_2m_min,
    maxTemp: data.daily.temperature_2m_max,
    wind: data.current.wind_speed
  });
};

useEffect(() => { //calls the fetchWeather function when the component mounts
  fetchWeather(city);
}, []);

const handleSearch=() => { //handles the search input
  fetchWeather(input);
  setCity(input);
};
  
  return(
    <div className="wrapper">
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Enter city" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>


      <div className="header">
        <h1 className="city">{weather?.city}</h1>
        <p className="temperature">{weather?.temperature}°C</p>
        <p className="condition">{weather?.condition}</p>
        <h2 className="date">{weather?.date}</h2>
        
      </div>
      <div className="weather-details">
        <div>
          <p>Humidity: {weather?.humidity}%</p>
          </div>
        <div>
          <p>Wind: {weather?.wind} km/h</p>
          </div>
      </div>
      <div className="forecast">
        <h2 className="forecast-header">5 Day forecast</h2>
        
        <div className="forecast-days">
        {weather?.weekDays?.map((date, index) => {
  const weekday = new Date(date).toLocaleDateString("en-GB", { weekday: "short" });

  return (
    <div className="forecast-day" key={index}>
      <p>{weekday}</p>
      <p>Max: {weather.maxTemp[index]}°C</p>
      <p>Min: {weather.minTemp[index]}°C</p>
    </div>
  );
})}
      </div>

      </div>
      </div>
  );
}

export default App;
