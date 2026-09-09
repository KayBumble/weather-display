import './App.css';

async function displayWeather(){
  const weather = await getWeather("New York, NY");
}

function App() {

  const API_KEY=

  return(
    <div className="wrapper">
      <div className="header">
        <h1 className="city">London</h1>
        <p className="temperature">30°C</p>
        <p className="condition">Sunny</p>
        <h2 className="date">Monday, 1 January</h2>
        
      </div>
      <div className="weather-details">
        <div>
          <p>Humidity: 60%</p>
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
