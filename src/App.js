import './App.css';
import { useEffect, useState } from "react";



function App() {

const [weather, setWeather] = useState(null); //state to hold weather data

const fetchWeather = async () => { //calls api
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m,rain,wind_speed_10m,wind_direction_10m,cloud_cover,surface_pressure'

  const result = await fetch(url);
  const data = await result.json();
  setWeather(data); //sets the state with the data from the api
}

useEffect(() => { //calls the fetchWeather function when the component mounts
  fetchWeather();
}, []);

  
  return(
    <div className="wrapper">
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
          <p>Wind: 10 km/h</p>
          </div>
      </div>
      <div className="forecast">
        <h2 className="forecast-header">5 Day forecast</h2>
         <div className="forecast-days">
          <div className="forecast-day">
            <p>Monday</p>
            <p>Cloudy</p>
            <p>25°C</p>
          </div>
      </div>
      </div>
    </div>
  );
}

export default App;
