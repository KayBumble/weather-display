import { render, screen } from '@testing-library/react';
import App from './App';

const geoResponse = {
  results: [{ latitude: 51.5, longitude: -0.12, name: "London", country: "United Kingdom" }],
};

const weatherResponse = {
  current: {
    temperature_2m: 14.6,
    apparent_temperature: 12.2,
    relative_humidity_2m: 72,
    wind_speed_10m: 18.4,
    weather_code: 2,
  },
  daily: {
    time: ["2026-10-09", "2026-10-10", "2026-10-11", "2026-10-12", "2026-10-13"],
    weather_code: [2, 61, 3, 0, 95],
    temperature_2m_max: [16, 15, 14, 17, 13],
    temperature_2m_min: [9, 10, 8, 7, 9],
  },
};

beforeEach(() => {
  global.fetch = jest.fn((url) =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(url.includes("geocoding") ? geoResponse : weatherResponse),
    })
  );
});

test('shows labelled current weather and forecast', async () => {
  render(<App />);

  expect(await screen.findByText("London")).toBeInTheDocument();
  expect(screen.getByText("15°C")).toBeInTheDocument();
  expect(screen.getByText("Partly cloudy")).toBeInTheDocument();
  expect(screen.getByText("72%")).toBeInTheDocument();
  expect(screen.getByText("18 km/h")).toBeInTheDocument();
  expect(screen.getByText("5-day forecast")).toBeInTheDocument();
  expect(screen.getByText("Today")).toBeInTheDocument();
  expect(screen.getByText("Sat")).toBeInTheDocument();
});

test('shows an error when the city is not found', async () => {
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
  render(<App />);

  expect(await screen.findByRole("alert")).toHaveTextContent('No city found for "London"');
});
