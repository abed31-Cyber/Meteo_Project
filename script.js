
//**FONCTION HELPERS***** */


// focntion qui créer des div avec un texte et classes

function creatDiv(classe) {

    const div = document.createElement('div');
    div.classList.add(classe);
    return div;

}

//foncton qui crer des input avec un name et une classe
function createInput(name, classe) {

    const input = document.createElement('input');
    input.setAttribute(name);
    input.classList.add(classe);
    return input;
}

// variante de fonction pour crer un input

function createInput(name, classe, placeholder) {
    const input = document.createElement('input');
    input.name = name;
    input.className = classe;
    input.placeholder = placeholder;
    return input;
}


//** CONSTRUCTION DU ARCHITECTURE SITE, SECTION , DIV , INPUT... */

// j'appelle ma fonction creer une div avec le texte et laclass et j'insere la div dans mon body 
const newdiv = creatDiv('container');
document.body.appendChild(newdiv);

//je créer un formulaire que j'insere dans ma div
const form = document.createElement('form')
form.classList.add('search-formulaire')
newdiv.appendChild(form);

// j'appele la function ceateInput et je crer un input avec name, classe et placholder;
const inputSearch = createInput('search-city', 'search-city', 'Ville...')
form.appendChild(inputSearch);


// boutton
const btn = document.createElement('button');
btn.classList.add('fa', 'fa-search'); // classes correctes
btn.type = 'submit'; // toujours utile pour un bouton dans un form
form.appendChild(btn);


// creation de la div geoloc
const div2 = creatDiv("classdiferente");
div2.setAttribute('id', "coordonnees-GPS");
form.appendChild(div2);



// creation de l'input latitude
const inputlatitude = createInput('latitude', 'latitude', 'latitude...')
div2.appendChild(inputlatitude);

//craetion de l'input longitude
const inputlongitude = createInput('longitude', 'longitude', 'longitude');
div2.appendChild(inputlongitude);

// ajout d'une div centrale pour intgrer l'affichage
const divAffichageCentrale = creatDiv('container-centrale')
document.body.appendChild(divAffichageCentrale)

//ajout d'une div pour le nom de la ville a l'affichage et ajoute au contauner centrale
const divNameCity = creatDiv('city')
divAffichageCentrale.appendChild(divNameCity);


// creation de l'icone centrale
const iconeCentrale = document.createElement('i');
iconeCentrale.classList.add('fa', 'fa-sun');
iconeCentrale.setAttribute('id', 'meteo-icon')
divAffichageCentrale.appendChild(iconeCentrale);


// creation de la div pour l'affichage de la temperature
const divtemperature = creatDiv('tempeature')
divAffichageCentrale.appendChild(divtemperature)

// creation de la div footer pour la position
const divFooter = creatDiv('footer');
document.body.appendChild(divFooter);

//creation de la prtie basse avec le titre
const p = document.createElement('p')
p.textContent = ('Chez moi ?')
divFooter.appendChild(p);

// insertion geolocalisation
const iconefooter = document.createElement('i');
iconefooter.classList.add('fa-solid', 'fa-magnifying-glass-location');
divFooter.appendChild(iconefooter);







navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log('Latitude:', position.coords.latitude);
        console.log('Longitude:', position.coords.longitude);
    },
    (error) => {
        console.error('Erreur de géolocalisation:', error);
    }
);



//***CONSTRUCTION DES EVENEMENTS *//



function searchMeteobyCity() {
    const form = document.querySelector('.search-formulaire')
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const inputSearch = formData.get('search-city');



        const cityApiResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${inputSearch}`);

        const cityData = await cityApiResponse.json();

        const firstResult = cityData.results[0];
        const latitude = firstResult.latitude;
        const longitude = firstResult.longitude;


        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const response = await fetch(url);
        const data = await response.json();
        console.log('Météo de la ville:' + inputSearch, data.current_weather);


        const current_weather = data.current_weather;

            
        if (current_weather.is_day === 1) {

            iconeCentrale.classList.add('fa-sun');
            iconeCentrale.classList.remove('fa-cloud-moon');
        } else {
            iconeCentrale.classList.remove('fa-sun');
            iconeCentrale.classList.add('fa-cloud-moon');
        }



    });
}


    //debug//

    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    console.table(cityData)


searchMeteobyCity();



