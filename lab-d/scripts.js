//disclaimer:
//zadanie wymagało umieszczenia klucza API w repozytorium, zrobiłem to świadomie
//the assignment required the API key to be pushed to the repository, I did it on purpose
const API_KEY = '5e7d59f62cb1c55a15668cbd7bdcc003';
const przycisk = document.getElementById('przycisk'); //przycisk to wyszukania pogody
const city = document.getElementById('city'); //pole do wpisania miasta
const current = document.getElementById('current'); //aktualna pogoda
const weatherBox = document.getElementById('weatherBox'); //pogoda na 5 dni

przycisk.addEventListener('click', loadWeather); //kliknięcie przycisku wyszukuje pogodę
city.addEventListener('keypress', (event) => { //zatwierdzenie enterem też
    if (event.key === 'Enter') {
        loadWeather();
    }
});

function loadWeather() { //funkcja ładująca pogodę
    const cityName = city.value.trim(); //nazwa miasta
    if (!cityName) { //jeśli pole jest puste
        alert('Musisz wpisać nazwę miasta!!');
        return;
    }
    getCurrentWeather(cityName);
    getForecast(cityName);
}

function getCurrentWeather(cityName) { //wysłanie zapytania do API i pobranie danych z otrzymanego jsona
    const xhr = new XMLHttpRequest();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pl`;
    xhr.open('GET', url, true); //asynchroniczne zapytanie GET
    xhr.onload = function() {
        if (xhr.status === 200) { //200 OK
            const data = JSON.parse(xhr.responseText); //konwertuje jsona na obiekt
            console.log('odpowiedź API (obecna pogoda):');
            console.log(data);
            renderCurrentWeather(data);
        } else { //inny status
            current.innerHTML = `<p>HTTP ${xhr.status}</p>`; //wypisuje status jeśli jest inny niż 200
        }
    };
    xhr.send(null); //wysłanie zapytania
}

function getForecast(cityName) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=pl`;
    fetch(url)
        .then(response => {
            if (!response.ok) { //ok zwraca true jeśli status jest w zakresie 200 - 299
                throw new Error(`HTTP ${response.status}`); //rzuca błędem
            }
            return response.json();
        })
        .then(data => { //wypisuje dane w konsoli i przekazuje je do funkcji, która je wyświetla
            console.log('odpowiedź API (prognoza 5-dniowa):');
            console.log(data);
            renderForecast(data);
        })
        .catch(error => { //łapie i wypisuje błąd
            weatherBox.innerHTML = `<p>${error.message}</p>`;
        });
}

function renderCurrentWeather(data) { //tworzenie pola z obecną pogodą
    const iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`; //większa ikona (2x)
    current.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2> <!--nazwa miasta i kraju-->
        <div class="curWeather">
            <img src="${iconURL}" alt="ikona pogody">
            <div class="temp">${data.main.temp.toFixed(1)} °C</div> <!--temperatura do 1 miejsca po przecinku-->
            <div class="desc">
                Odczuwalna: ${data.main.feels_like.toFixed(1)} °C<br> <!--odczuwalna temperatura do 1 miejsca po przecinku-->
                <strong>${data.weather[0].description}</strong> <!--opis pogody, np. "pochmurnie"-->
            </div>
            <div style="margin-top: 10px; color: #000149FF;">
                Ciśnienie: ${data.main.pressure} hPa <br> Wilgotność: ${data.main.humidity}%
            </div>
        </div>
    `;
}

function renderForecast(data) { //tworzenie pól z prognozą 5-dniową
    const forecastsToDisplay = data.list;
    let html = `<h2>Prognoza 5-dniowa</h2>`;
    html += `<div class="forecastContainer">`; //kontener na pogodę
    forecastsToDisplay.forEach(item => { //dane do wyświetlenia w prognozie
        const dateObj = new Date(item.dt * 1000); //pobranie daty
        const day = `${dateObj.getDate().toString().padStart(2, '0')}.${(dateObj.getMonth()+1).toString().padStart(2, '0')}`; //format daty
        const time = `${dateObj.getHours().toString().padStart(2, '0')}:00`; //format czasu
        const iconURL = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`; //odpowiednia ikona ze strony openweathermap

        html += `
            <div class="forecastField">
                <p><strong>${day}</strong><br>${time}</p>
                <img src="${iconURL}" alt="ikonka pogody">
                <p class="temp">${item.main.temp.toFixed(1)} °C</p> <!--temperatura do 1 miejsca po przecinku-->
                <p class="desc">${item.weather[0].description}</p> <!--opis pogody, np. "pochmurnie"-->
            </div>
        `;
    });

    html += `</div>`;
    weatherBox.innerHTML = html;
}