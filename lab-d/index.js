const apiKey = "7ded80d91f2b280ec979100cc8bbba94";
const currentWeatherLink = `https://api.openweathermap.org/data/2.5/weather?q={query}&appid=${apiKey}&units=metric&lang=pl`;
const forecastLink = `https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=${apiKey}&units=metric&lang=pl`;
const iconLink = "https://openweathermap.org/img/wn/{iconName}@2x.png";
const resultsBlock = document.querySelector("#weather-results-container");

const getCurrentWeather = (query) => {
    const url = currentWeatherLink.replace("{query}", query);
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.addEventListener("load", () => {
        if (req.status === 200) {
            const currentWeather = JSON.parse(req.responseText);
            console.log(currentWeather);
            drawCurrentWeather(currentWeather);
        } else {
            showError("Failed to load current weather data.");
        }
    });
    req.send();
};

const getForecast = (query) => {
    const url = forecastLink.replace("{query}", query);
    fetch(url)
        .then(response => {
            return response.json().then(data => {
                console.log("Forecast data:", data);
                return data;
            });
        })
        .then(data => drawWeather(data.list))
        .catch(error => {
            showError(error.message);
        });
};

const getWeather = (query) => {
    getCurrentWeather(query);
    getForecast(query);
};

const showError = (message) => {
    resultsBlock.innerHTML = `<div class="error">${message}</div>`;
};

const drawCurrentWeather = (currentWeather) => {
    resultsBlock.innerHTML = '';
    const weatherBlock = createWeatherBlock(
        new Date(currentWeather.dt * 1000).toLocaleString("pl-PL"),
        currentWeather.main.temp,
        currentWeather.main.feels_like,
        currentWeather.weather[0].icon,
        currentWeather.weather[0].description
    );
    resultsBlock.appendChild(weatherBlock);
};

const drawWeather = (forecast) => {
    resultsBlock.innerHTML = '';
    forecast.forEach(weather => {
        const weatherBlock = createWeatherBlock(
            new Date(weather.dt * 1000).toLocaleString("pl-PL"),
            weather.main.temp,
            weather.main.feels_like,
            weather.weather[0].icon,
            weather.weather[0].description
        );
        resultsBlock.appendChild(weatherBlock);
    });
};

const createWeatherBlock = (dateString, temperature, feelsLikeTemperature, iconName, description) => {
    const weatherBlock = document.createElement("div");
    weatherBlock.className = "weather-block";

    const dateBlock = document.createElement("div");
    dateBlock.className = "weather-date";
    dateBlock.innerText = dateString;
    weatherBlock.appendChild(dateBlock);

    const temperatureBlock = document.createElement("div");
    temperatureBlock.className = "weather-temperature";
    temperatureBlock.innerHTML = `${temperature} &deg;C`;
    weatherBlock.appendChild(temperatureBlock);

    const feelsLikeBlock = document.createElement("div");
    feelsLikeBlock.className = "weather-temperature-feels-like";
    feelsLikeBlock.innerHTML = `Odczuwalna: ${feelsLikeTemperature} &deg;C`;
    weatherBlock.appendChild(feelsLikeBlock);

    const weatherIcon = document.createElement("img");
    weatherIcon.className = "weather-icon";
    weatherIcon.src = iconLink.replace("{iconName}", iconName);
    weatherBlock.appendChild(weatherIcon);

    const weatherDescription = document.createElement("div");
    weatherDescription.className = "weather-description";
    weatherDescription.innerText = description;
    weatherBlock.appendChild(weatherDescription);

    return weatherBlock;
};

document.querySelector("#locationInput").value = "Łuck";
getCurrentWeather("Łuck");

document.querySelector("#checkButton").addEventListener("click", () => {
    const query = document.querySelector("#locationInput").value;
    query ? getWeather(query) : showError("Please enter a location.");
});
