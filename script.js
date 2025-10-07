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
    return cityCoords_array;

}



async function getWeatherInfos(longitude, latitude) {

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&models=meteofrance_seamless&current=temperature_2m,is_day,rain,snowfall,cloud_cover,wind_speed_10m`);
    const weatherInfos = await response.json();

    console.log("getweatherInfos: donnée retournée: ", weatherInfos);

    return weatherInfos;
}


async function getCityNameByCoords(longitude, latitude) {
    console.log("Latitude recu : ", latitude);
    console.log("Latitude recu : ", longitude);
    const response = await fetch(` https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json&`);
    const cityInfos = await response.json();
    console.log("getCityNameByCoords:donnée retournée ", cityInfos);

    const cityName = cityInfos.address.city;
    console.log("getCityNameByCoords : ville retournée : ", cityName)
    return cityName;
}

async function getWeatherIcon(weatherInfos) {
    if (weatherInfos.current.snowfall > 0) {
        return "/images/neige.png";
    }else if (weatherInfos.current.rain > 0) {
        return "/images/pluvieux."
    }else if (weatherInfos.current.cloud_cover > 65) {
        return "/images/soleil-leger-nuage.png";
    }else if (weatherInfos.current.cloud_cover > 85) {
        return "/images/pluvieux.png";
    }else {
        return "/images/soleil.png";
    }
}


async function createWeatherInfosCards(weatherInfo, cityName) {
    // creation du container
    const weatherInfosContainer = document.createElement('div');
    // creation des elements necésaire
    const cityName_elem = document.createElement('h1');
    const iconeWeather_elem = document.createElement('img')
    const cityTemperature_elem = document.createElement("h1");
    // ajout de classe sur les element
    weatherInfosContainer.classList.add('weather-infos-container');
    cityName_elem.classList.add('city-name');
    iconeWeather_elem.classList.id = "icone-weather";
    cityTemperature_elem.classList.add('temperature-ville');

    // insertion des données dans les elements 
    cityName_elem.innerText = cityName;
    iconeWeather_elem.setAttribute("src", await getWeatherIcon(weatherInfo));
    cityTemperature_elem.innerText = weatherInfo.current.temperature_2m + "°C";
    //insertion des elements dans le container
    weatherInfosContainer.appendChild(cityName_elem);
    weatherInfosContainer.appendChild(iconeWeather_elem);
    weatherInfosContainer.appendChild(cityTemperature_elem);

    console.log(" createWeatherInfosCards : div retournée : ", weatherInfosContainer);


    return weatherInfosContainer;

};

function displayWeatherInfosByCity() {
    // on recupere le formulaire par son name
    const form = document.querySelector('#search-form');
    // on écoute l'event submit sur le form
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        // On recupère l'input de recherche
        const formData = new FormData(form);
        const searchValue = formData.get("search-city");
        console.log("Resultat de recherche utilisateur : ", searchValue);
        const cityName = searchValue;
        const cityCoords = await getCoordsByCityName(cityName);
        console.log("Coordonnées retournés par recherche par ville : ", cityCoords);
        const cityLatitude = cityCoords.latitude;
        const cityLongitude = cityCoords.longitude;
        const weatherInfos = await getWeatherInfos(cityLongitude, cityLatitude);
        console.log("weather infos by cityname: " , weatherInfos);
        // on recupere la cards contenant les infos weather.
        const weatherInfosCard = await createWeatherInfosCards(weatherInfos, cityName);
        // je recupere ma section weatherInfos 
        const weatherInfoSection = document.querySelector('.weather-infos');
        // j'insere la card dans  ma section.
        weatherInfoSection.appendChild(weatherInfosCard);

    })

}

function displayWeatherInfosByCoords() {

const form = document.querySelector('#search-form')   
form.addEventListener('submit', async function (event){
event.preventDefault();
const formData = new FormData(form);
const cityLatitude = formData.get('latitude');
const cityLongitude = formData.get('longitude');
console.log("Latitude rechercher : ", cityLatitude)
console.log("Longitude rechercher : ", cityLongitude)

const weatherInfos = await getWeatherInfos(cityLongitude, cityLatitude);
const cityName = await getCityNameByCoords(cityLongitude, cityLatitude);
console.log(cityName);

const weatherInfosCard = await createWeatherInfosCards(weatherInfos, cityName);
const weatherInfosSection = document.querySelector('.weather-infos');

weatherInfosSection.appendChild(weatherInfosCard);

})

}

function getUserGeoloc() {

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position => {
                const userLatitude = position.coords.latitude;
                const userLongitude = position.coords.longitude;
                resolve({ userLatitude, userLongitude});
                console.log(resolve) ;

            }),
            reject
        );
        
    });
}

function displayweatherInfosByGeoloc(){

    const btnGeoloc = document.querySelector('.btn-geoloc');
    btnGeoloc.addEventListener('click', async function(){

        const userPosition = await getUserGeoloc();
        console.log("Position utilisateur ", userPosition);
        // recuperation des position utilisateur latitude et longitude
        const userLatitude = userPosition.userLatitude;
        const userLongitude = userPosition.userLongitude;
        const weatherInfo = await getWeatherInfos(userLongitude, userLatitude);

        const cityName = await getCityNameByCoords(userLongitude, userLatitude);
        const weatherInfosCard = await createWeatherInfosCards(weatherInfo, cityName);
        const weatherInfoSection = document.querySelector('.weather-infos');
        weatherInfoSection.appendChild(weatherInfosCard);
        })

}

// EXEC






// DEBUG
// getCoordsByCityName("Oran");
// getweatherInfos("35.69906", "-0.63588");
// getCityNameByCoords("35.69906", "-0.63588");
// const cityInfos = getCoordsByCityName("Oran");
// const cityLat = cityInfos.latitude

async function debugTest() {
    // const weatherInfo = await getWeatherInfos("35.69906", "-0.63588");
    // const cityName = await getCityNameByCoords("35.69906", "-0.63588");
    // createWeatherInfosCards(weatherInfo, cityName);
    displayWeatherInfosByCity();
    displayWeatherInfosByCoords();
    displayweatherInfosByGeoloc();
}

debugTest();







