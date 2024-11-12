document.getElementById('weatherButton').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value;
    const apiKey = '7ded80d91f2b280ec979100cc8bbba94';

    if (!city) {
        alert('Proszę wprowadzić nazwę miasta!');
        return;
    }

    // Pobieranie bieżącej pogody za pomocą XMLHttpRequest
    const currentWeatherRequest = new XMLHttpRequest();
    currentWeatherRequest.open('GET', `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
    currentWeatherRequest.onload = function () {
        if (this.status === 200) {
            const response = JSON.parse(this.responseText);
            document.getElementById('currentWeather').innerHTML = `
                <h2>Bieżąca pogoda w ${response.name}</h2>
                <p>Temperatura: ${response.main.temp} °C</p>
                <p>Opis: ${response.weather[0].description}</p>
            `;
        } else {
            alert('Nie udało się pobrać bieżącej pogody. Sprawdź nazwę miasta.');
        }
    };
    currentWeatherRequest.send();

    // Pobieranie prognozy pięciodniowej za pomocą Fetch API
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = '<h2>Prognoza pięciodniowa</h2>';
            data.list.forEach(item => {
                forecastDiv.innerHTML += `
                    <div>
                        <p>${item.dt_txt}: ${item.main.temp} °C, ${item.weather[0].description}</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error('Błąd pobierania prognozy:', error);
            alert('Nie udało się pobrać prognozy pogody.');
        });
});
