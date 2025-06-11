const apiKey = '';
const weatherform = document.getElementById('weatherform');
const cityInput = document.getElementById('cityInput');
const weatherInfo = document.querySelector('.weatherInfo');
const errorDisplay = document.getElementById('errorDisplay');
const weatherContent = document.querySelector('.weathercontent');
const forecast = document.querySelector('.forecast');

weatherform.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!navigator.onLine) {
    displayError("You're offline. Please check your internet connection.");
    return;
  }

  const city = cityInput.value.trim();
  if (!city) {
    displayError('Please enter a city.');
    return;
  }

  fetchWeatherByCity(city);
});

async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayWeatherInfo(data);
  } catch (error) {
    displayError(error.message);
  }
}

function displayWeatherInfo(data) {
  errorDisplay.style.display = 'none';
  weatherContent.style.display = 'block';
  forecast.style.display = 'block';
  weatherInfo.style.display = 'flex';

  const cityName = data.city.name;
  const countryCode = data.city.country;
  const flagUrl = `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
  const weather = data.list[0];

  document.getElementById('cityDisplay').innerHTML = `${cityName} <img src="${flagUrl}" alt="${countryCode}" id="flag">`;
  document.getElementById('dateDisplay').textContent = new Date(weather.dt_txt).toDateString();
  document.getElementById('temperatureDisplay').innerHTML = `${Math.round(weather.main.temp)} &deg;C`;
  document.getElementById('description').textContent = weather.weather[0].description;
  document.getElementById('humidityDisplay').innerHTML = `💧 <small id="small">${weather.main.humidity}%</small>`;
  document.getElementById('weatherEmoji').textContent = getWeatherEmoji(weather.weather[0].main);

  displayForecast(data);
}

function displayForecast(data) {
  const forecastContainer = document.getElementById('forecastContent');
  forecastContainer.innerHTML = '';

  for (let i = 8; i <= 24; i += 8) {
    const forecast = data.list[i];
    const date = new Date(forecast.dt_txt).toDateString().slice(0, 10);
    const emoji = getWeatherEmoji(forecast.weather[0].main);
    const temp = Math.round(forecast.main.temp);

    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecastItem';
    forecastItem.innerHTML = `
      <div>${date}</div>
      <h1>${emoji}</h1>
      <div>${temp}°C</div>
    `;

    forecastContainer.appendChild(forecastItem);
  }
}

function getWeatherEmoji(condition) {
  const emojis = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧',
    Drizzle: '🌦',
    Thunderstorm: '⛈',
    Snow: '❄️',
    Mist: '🌫',
  };
  return emojis[condition] || '🌈';
}

function displayError(message) {
  weatherContent.style.display = 'none';
  forecast.style.display = 'none';
  errorDisplay.style.display = 'block';
  errorDisplay.textContent = message;
  weatherInfo.style.display = 'flex';
}

//  Default location weather on page load
window.addEventListener('load', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!response.ok) throw new Error('Could not fetch your location weather');
        const data = await response.json();
        displayWeatherInfo(data);
      } catch (error) {
        displayError('Failed to get weather for your location');
      }
    }, () => {
      displayError('Permission denied for location access');
    });
  } else {
    displayError('Geolocation not supported in your browser');
  }
});
