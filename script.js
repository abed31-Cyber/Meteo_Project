// Geocoding API Link : https://geocoding-api.open-meteo.com/v1/search?name=&count=10&language=en&format=json
import { apiKey } from "./apikey.js";


async function getCoordsByCityName(CityName) {

    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${CityName}&count=10&language=en&format=json`);

    const cityInfos = await response.json();

    console.log("[getCoordsByCityName] : Données retournés : ", cityInfos);

    const longitude = cityInfos.results[0].longitude;
    const latitude = cityInfos.results[0].latitude;
    const cityCoords_array = {
        latitude: latitude,
        longitude: longitude
    }
    console.log(cityCoords_array)

}

async function getweatherInfos(longitude, latitude) {

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m`);
    const weatherInfos = await response.json();

    console.log("getweatherInfos: donnée retournée: ", weatherInfos);

    return weatherInfos;
}


async function getCityNameByCoords(longitude, latitude) {

    const response = await fetch(` https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&`);
    const cityInfos = await response.json();
    console.log("getCityNameByCoords:donnée retournée ", cityInfos);

    const cityName = cityInfos.address.city;
    console.log("getCityNameByCoords : ville retournée : ", cityName)
    return cityName;
}



async function createWeatherInfosCards(weatherInfo, cityName) {
    // creation du container
    const weatherInfosContainer = document.createElement('div');
    // creation des elements necésaire
    const cityName_elem = document.createElement('h1');
    const iconeWeather_elem = document.createElement('i')
    const cityTemperature_elem = document.createElement("h1");
    // ajout de classe sur les element
    weatherInfosContainer.classList.add('weather-infos-container');
    cityName_elem.classList.add('city-name');
    iconeWeather_elem.classList.id = "icone-weather";
    cityTemperature_elem.classList.add('temperature-ville');

    // insertion des données dans les elements 
    cityName_elem.innerText = cityName;
    cityTemperature_elem.innerText = weatherInfo.current.temperature_2m + "°C";
    //insertion des elements dans le container
    weatherInfosContainer.appendChild(cityName_elem);
    weatherInfosContainer.appendChild(iconeWeather_elem);
    weatherInfosContainer.appendChild(cityTemperature_elem);

    console.log(" createWeatherInfosCards : div retournée : ", weatherInfosContainer);


    return weatherInfosContainer;

};






// DEBUG
// getCoordsByCityName("Oran");
// getweatherInfos("35.69906", "-0.63588");
// getCityNameByCoords("35.69906", "-0.63588");
// const cityInfos = getCoordsByCityName("Oran");
// const cityLat = cityInfos.latitude

async function debugTest() {
    const weatherInfo = await getweatherInfos("35.69906", "-0.63588");
    const cityName = await getCityNameByCoords("35.69906", "-0.63588");
    createWeatherInfosCards(weatherInfo, cityName);
}

debugTest();