const resultsNav = document.getElementById('results-nav');
const favoritesNav = document.getElementById('favorites-nav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const apiKey = 'DEMO_KEY';
const COUNT = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${COUNT}&hd=True`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
    if (page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    } else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    const data = page === 'favorites' ? Object.values(favorites) : resultsArray;
    data.forEach((result) => {
        // Create card container
        const card = document.createElement('div');
        card.classList.add('card');

        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';

        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');

        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;

        // Save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        saveText.textContent = page === 'favorites' ? 'Delete favorite' : 'Add to Favorites';
        saveText.setAttribute('onclick', page === 'favorites' ? `removeFavorite('${result.url}')` : `saveFavorite('${result.url}')`);

        // Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;

        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');

        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;

        // Copyright
        const copyright = document.createElement('span');
        copyright.textContent = ` ${result.copyright ? result.copyright : ''}`;

        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody, footer);
        imagesContainer.append(card);
    })
}


function updateDOM(page) {
    // Get favorites from localStorage
    if (localStorage.getItem('favorite-pictures')) {
        favorites = JSON.parse(localStorage.getItem('favorite-pictures'));
    }
    imagesContainer.textContent = '';
    showContent(page);
    createDOMNodes(page);
}

// Get 10 images from NASA API
async function getNasaPictures() {
    // Show loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    } catch (error) {
        console.log(error);
    }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    if (!favorites[itemUrl]) {
        // Loop through results array to select favorite
        resultsArray.forEach((item) => {
            if (item.url.includes(itemUrl)) {
                favorites[itemUrl] = item;

                // Show save confirmation for 2 seconds
                saveConfirmed.hidden = false;
                setTimeout(() => {
                    saveConfirmed.hidden = true;
                }, 2000);
            }
        })
        localStorage.setItem('favorite-pictures', JSON.stringify(favorites));
    }
}

// Remove item from favorites 
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem('favorite-pictures', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaPictures();