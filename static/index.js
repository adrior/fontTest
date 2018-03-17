document.addEventListener('DOMContentLoaded', init)

var App = {
    json: null,
    cards: [

    ],
    screens: [

    ]
}

function init() {
    loadData()
        .then( json => prepareImages(json) )
        .then( data => generateScreens(data) )

}

function ready() {
    let startButton = document.querySelector('.intro__start');
    startButton.disabled = false;
    startButton.innerText = 'Начать тест';
}

function loadData() {
    return fetch('data.json')
        .then( response => response.json())
}

function prepareImages(json) {
    return new Promise( (resolve, reject) => {
        let total = json.length;
        let loaded = 0;
        let loaderContainer = document.querySelector('.app__imageLoader');
        function imgLoaded() {
            loaded++;
            if (total - loaded === 0) {
                resolve(json)
            }
        }
        json.forEach( font => {
            let img = document.createElement('img');
            img.addEventListener('load', imgLoaded);
            img.src = `i/${font.fileName}.png`;
            loaderContainer.appendChild(img);
        });
    })
}

function generateScreens(data) {
    ready();
    let randomizedFonts = _.shuffle(data);
    let container = document.querySelector('.app__test');
    container.innerHTML = '';
    randomizedFonts.forEach( (font, current, arr) => {
        let card = document.createElement('div');
        card.className = "app__card";
        card.dataset.font = font.fontName;
        card.innerHTML = `
            <img src="i/${font.fileName}.png"/>
            <div class="card__options"></div>
        `;
        let optionsContainer = card.querySelector('.card__options');
        let variants = getRandomFour(arr, current);
        variants.forEach( option => {
            let fontName = randomizedFonts[option].fontName;
            optionsContainer.innerHTML += `
                <button class="button card__option ${font.fontName === fontName ? 'card__option_right' : 'card__option_wrong'}" data-font="${fontName}" onclick="checkcard(this)">${fontName}</button>
            `
        } )
        container.appendChild(card);
    })
}

function checkcard(target) {
    let correctcard = target.parentNode.parentNode.dataset.font;
    if (target.dataset.font === correctcard) {
        cardIsCorrect(correctcard);
    } else {
        cardIsFalse(correctcard);
    }
}

function showNext() {
    let container = document.querySelector('.app__test');
    let currentCard = container.querySelector('.app__card');
    currentCard.parentNode.removeChild(currentCard);
}

function cardIsCorrect(fontName) {
    console.log('Угадал');
    showNext();
}



function cardIsFalse(fontName) {
    console.log('Ошибся');
    showNext();
}


function getRandomFour(arr, current) {
    let randomed = [];
    let attempts = 0;
    while (randomed.length < 3 && attempts < 10000) {
        let i = Math.round((arr.length-1)*Math.random());
        if (i === current || randomed.includes(i)) continue;
        randomed.push(i);
    }
    randomed.push(current);
    return _.shuffle(randomed);
}