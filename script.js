const API_KEY = '2b10dc257ead7be2bc519cddf36cad3a';
const weatherInfoDiv = document.getElementById('weatherInfo');
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');

async function getWeatherData(city) {
    weatherInfoDiv.innerHTML = '<p>Loading weather data... ⏳</p>';

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        let errorMessage = 'Failed to fetch weather data. Please try again.';
        
        if (error.message.includes('404')) {
            errorMessage = 'City not found. Please check the spelling and try again.';
        } else if (error.message.includes('401')) {
            errorMessage = 'API Key is invalid or missing. Please ensure your API_KEY is correct.';
        }
        weatherInfoDiv.innerHTML = `<p class="error-message">${errorMessage} 😔</p>`;
    }
}


function displayWeather(data) {
    const cityName = data.name;
    const country = data.sys.country;
    const temperature = Math.round(data.main.temp); // Round temperature to nearest integer
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    const formattedDescription = description.charAt(0).toUpperCase() + description.slice(1);

    weatherInfoDiv.innerHTML = `
        <h2>${cityName}, ${country}</h2>
        <p class="temp">${temperature}°C</p>
        <p>${formattedDescription}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

getWeatherBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        weatherInfoDiv.innerHTML = '<p class="error-message">Please enter a city name! 💡</p>';
    }
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherBtn.click();
    }
});

window.onload = () => {
    weatherInfoDiv.innerHTML = '<p>Enter a city name and click "Get Weather" to see the current conditions.</p>';
};
