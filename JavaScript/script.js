
const API_KEY = 'bf734b2d4fb1953bd7b616c057956233';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';


const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};


function getCurrentDate() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
}


function changeBackground(weatherMain, icon) {
    const body = document.body;
    body.className = ''; 
    
    if (icon.includes('n')) {
        body.classList.add('clear-night');
    } else if (weatherMain.includes('Clear')) {
        body.classList.add('sunny');
    } else if (weatherMain.includes('Cloud')) {
        body.classList.add('cloudy');
    } else if (weatherMain.includes('Rain') || weatherMain.includes('Drizzle')) {
        body.classList.add('rainy');
    } else if (weatherMain.includes('Snow')) {
        body.classList.add('snowy');
    } else {
        body.classList.add('default');
    }
}


function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weatherInfo').classList.remove('show');
    document.getElementById('error').style.display = 'none';
}


function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}


function showError() {
    document.getElementById('error').style.display = 'block';
    document.getElementById('weatherInfo').classList.remove('show');
    hideLoading();
}


function displayWeather(data) {
    const location = document.getElementById('location');
    const date = document.getElementById('date');
    const weatherIcon = document.getElementById('weatherIcon');
    const temperature = document.getElementById('temperature');
    const description = document.getElementById('description');
    const feelsLike = document.getElementById('feelsLike');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const pressure = document.getElementById('pressure');

    location.textContent = `${data.name}, ${data.sys.country}`;
    date.textContent = getCurrentDate();    
    weatherIcon.textContent = weatherIcons[data.weather[0].icon] || '🌤️';
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;

    changeBackground(data.weather[0].main, data.weather[0].icon);

    hideLoading();
    document.getElementById('weatherInfo').classList.add('show');
    document.getElementById('error').style.display = 'none';
}

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    if (!API_KEY || API_KEY === 'bf734b2d4fb1953bd7b616c057956233   ') {
        alert('error : API key is not found');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        
        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showError();
    }
}

// Allow Enter key to trigger search
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        getWeather();
    }
});


window.addEventListener('load', function() {
   
    document.getElementById('cityInput').value = 'London';
  
});