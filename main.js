// get elements

const container = document.querySelector('#container');

const selectDoc = container.querySelector('#docs');


const search = container.querySelector('#match');


const noMatches = container.querySelector('#no-matches');

const clearBtn = container.querySelector('#clear');
const downloadBtn = container.querySelector('#download');

const langBtn = container.querySelector('#lang');
let lang = '';

let selected = 0;
const docs = [];



function createOptionWithTitle(value, title) {
    const newOption = document.createElement('option');
    newOption.textContent = title;
    newOption.setAttribute('value', value);
    return newOption;
}


function updateLink() {
    selected = parseInt(selectDoc.value);
    downloadBtn.href = docs[selected]['link'];

}

const resetLink = () =>
    downloadBtn.href = '';

function findMatches(word) {
    const regex = new RegExp(word, 'gi');
    return docs.filter(doc => doc.keywords.match(regex)
        || doc.title.match(regex)
        || doc.titleAr.match(regex));
}

function changeLanguage() {
    if (!lang) {
        langBtn.textContent = 'Ar 🌐'
        lang = 'Ar';
    } else {
        langBtn.textContent = 'En 🌐'
        lang = '';
    }
    showMatches();

}

const hide = (element) =>
    element.style.visibility = "hidden";

const show = (element) =>
    element.style.visibility = "visible";



function showMatches() {
    if (search.value === '' || !search.value) {
        hide(clearBtn);
        hide(noMatches);
        defaultSelect();
        return;
    }
    show(clearBtn);
    const matches = findMatches(search.value);

    if (matches.length === 0) {
        show(noMatches);
        selectDoc.innerHTML = '';
        resetLink();
        return;
    }
    hide(noMatches);

    selectDoc.innerHTML = '';
    matches.forEach(doc =>
        selectDoc.appendChild(createOptionWithTitle(selectDoc.children.length, doc['title' + lang]))
    );
    updateLink();

}

function defaultSelect() {
    selectDoc.innerHTML = '';
    docs.forEach(doc =>
        selectDoc.appendChild(createOptionWithTitle(selectDoc.children.length, doc['title' + lang]))
    );


}


function colorMode(mode) {
    let [bgColor, textColor] = '';
    if (mode === 'dark') {
        bgColor = '#33373A';
        textColor = '#ecf0f1';
    } else {
        bgColor = '#ecf0f1';
        textColor = '#2d3436';
    }
    document.documentElement.style.setProperty(`--bg-color`, bgColor);
    document.documentElement.style.setProperty(`--text-color`, textColor);
}



fetch('data.json')
    .then(response => response.json())
    .then(json => {
        docs.push(...Array.from(json))
        defaultSelect();
        updateLink();
    });


selectDoc.addEventListener('change', updateLink);
search.addEventListener('input', showMatches);
langBtn.addEventListener('click', changeLanguage);

clearBtn.addEventListener('click', () => {
    search.value = '';
    showMatches();

});



if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
    colorMode('light');


window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    colorMode(newColorScheme);
});

hide(clearBtn);
