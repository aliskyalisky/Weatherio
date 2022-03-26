// GEOCODE REQUEST http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid=957f632d866171f2c36adfb983e594db
// WEATHER REQUEST https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=957f632d866171f2c36adfb983e594db

const searchBtn = document.querySelector('.searchbtn');
const tempDisplay = document.querySelector('.temperature');
let tempCelcius;
let tempFahrenheit;
let currentTempUnit = 'celcius';

async function pageOpen() {
    await executeSearch();
    document.querySelector('.centerpanel').classList.remove('loading');
    document.querySelector('.bottompanel').classList.remove('loading');
}
pageOpen();

searchBtn.addEventListener('click', executeSearch);
tempDisplay.addEventListener('click', convertTemperature)

function convertTemperature() {
    if (currentTempUnit === 'celcius') {
        tempDisplay.textContent = `${tempFahrenheit}℉`;
        currentTempUnit = 'fahrenheit';
        return;
    }
    if (currentTempUnit === 'fahrenheit') {
        tempDisplay.textContent = `${tempCelcius}℃`;
        currentTempUnit = 'celcius';
        return;
    }
}

async function executeSearch() {
    let newLocation = await getLocation();
    let newWeather = await getWeather(newLocation.lat, newLocation.lon);
    updateDisplay(newLocation, newWeather);
};

async function getLocation() {
    let search = document.querySelector('.locationsearch').value
    search === '' ? search = 'helsinki' : search;
    document.querySelector('.locationsearch').value = '';
    let locationFetch = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=957f632d866171f2c36adfb983e594db`, {mode: 'cors'});
    let locationData = await locationFetch.json();
    return {
        lat: locationData[0].lat,
        lon: locationData[0].lon,
        name: locationData[0].name,
        country: locationData[0].country
    }
}

async function getWeather(lat, lon) {
    let weatherFetch = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=957f632d866171f2c36adfb983e594db`, {mode: 'cors'});
    let weatherData = await weatherFetch.json();
    console.log(weatherData);
    return weatherData;
}

async function updateDisplay(location, weather) {
    const cityDisplay = document.querySelector('.city');
    const countryDisplay = document.querySelector('.country');
    const basicDescription = document.querySelector('.basicdescription');
    const windData = document.querySelector('.winddata');
    const humidityData = document.querySelector('.humdata');
    const pressureData = document.querySelector('.presdata');
    const sunData = document.querySelector('.sundata');

    let sunsetTime = (function () {
        let sunset = new Date(weather.sys.sunset*1000);
        let sunsetHour = sunset.getHours();
        let sunsetMin = sunset.getMinutes();
        if (sunsetMin < 10) {
            sunsetMin = '0' + sunsetMin
        };
        return `${sunsetHour}:${sunsetMin}`;
    })();

    tempCelcius = weather.main.temp.toFixed(0);
    tempFahrenheit = (tempCelcius * 1.8 + 32).toFixed(0);

    cityDisplay.textContent = location.name;
    countryDisplay.textContent = location.country;

    if (currentTempUnit === 'celcius') {tempDisplay.textContent = `${tempCelcius}℃`;
    } else {tempDisplay.textContent = `${tempFahrenheit}℉`;};
    
    basicDescription.textContent = `${weather.weather[0].description}`;
    windData.textContent = `${weather.wind.speed}m/s`;
    humidityData.textContent = `${weather.main.humidity}%`;
    pressureData.textContent = `${weather.main.pressure}hPa`;
    sunData.textContent = `${sunsetTime} UTC`;
}