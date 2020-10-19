// get elements

const container = document.querySelector('#container');

const selectDoc = container.querySelector('#docs');
const search = container.querySelector('#match');
const noMatches = container.querySelector('#no-matches');

const clearBtn = container.querySelector('#clear');
const downloadBtn = container.querySelector('#download');
const langBtn = container.querySelector('#lang');


let lang = ''; // used to control language 
const docs = []; // used to store book/document objects



function createOptionWithTitle(value, title) {
    /*
    takes a number and a title, creates an option tag and returns it
    */
    const newOption = document.createElement('option');
    newOption.textContent = title;
    newOption.setAttribute('value', value);
    return newOption;
}

function getTitleLink(t) {
    return t ? docs.filter(doc => {
        return doc['title' + lang] === t;
    })[0]['link'] : '';
}


function updateLink() {
    /*
    gets current selected item link, changes download href to link
    */

    with (downloadBtn) {
        href = getTitleLink(selectDoc.children[selectDoc.value].innerHTML);
        setAttribute('download', '');
        setAttribute('target', '_blank');
    }

}

// removes link
const resetLink = () => {
    with (downloadBtn) {
        href = '#';
        removeAttribute('download');
        removeAttribute('target');

    }
}


function findMatches(word) {
    /*
    takes a string (word) and searches object keywords for matches \
    */
    const regex = new RegExp(word, 'gi');
    return docs.filter(doc => doc.keywords.match(regex)
        || doc.title.match(regex)
        || doc.titleAr.match(regex));
}

function changeLanguage() {
    /*
    changes language for titles
    */
    if (!lang) {
        langBtn.textContent = 'Ar 🌐'
        lang = 'Ar';
    } else {
        langBtn.textContent = 'En 🌐'
        lang = '';
    }
    showMatches();

}

// hide and show elements
const hide = (element) =>
    element.style.visibility = "hidden";
const show = (element) =>
    element.style.visibility = "visible";



function showMatches() {
    /*
    shows matches in the select element
    */

    // check if no value in search field
    if (search.value === '' || !search.value) {
        hide(clearBtn);
        hide(noMatches);
        defaultSelect();
        updateLink();
        return;
    }

    show(clearBtn);
    const matches = findMatches(search.value);

    // clear select element if no matches!
    if (matches.length === 0) {
        show(noMatches);
        selectDoc.innerHTML = '';
        resetLink();
        return;
    }
    hide(noMatches);

    // clear select element, and add matches instead
    addItemsToSelect(matches);

    // update download link to match the best result
    updateLink();

}

function addItemsToSelect(items) {
    /*
    clears select HTML, adds items as options
    */
    selectDoc.innerHTML = '';
    items.forEach(doc =>
        selectDoc.appendChild(createOptionWithTitle(selectDoc.children.length, doc['title' + lang]))
    );
}


// handles default selection, don't know why honestly
const defaultSelect = () =>
    addItemsToSelect(docs);



function colorMode(mode) {
    /*
    handles light and dark mode colors
    */
    let [bgColor, textColor] = '';
    if (mode === 'dark') {
        bgColor = '#33373A';
        textColor = '#ecf0f1';
    } else {
        bgColor = '#ecf0f1';
        textColor = '#2d3436';
    }
    // set CSS variables
    with (document.documentElement.style) {
        setProperty(`--bg-color`, bgColor);
        setProperty(`--text-color`, textColor);
    }
}


// fetch and parse data into docs array
fetch('data.json')
    .then(response => response.json())
    .then(json => {
        docs.push(...Array.from(json))
        defaultSelect();
        updateLink();
    });

// hook up event listeners
selectDoc.addEventListener('change', updateLink);
search.addEventListener('input', showMatches);
langBtn.addEventListener('click', changeLanguage);




// listen for clear/cancel button
clearBtn.addEventListener('click', () => {
    search.value = '';
    showMatches();

});
// listen for dark/light mode changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const newColorScheme = e.matches ? "dark" : "light";
    colorMode(newColorScheme);
});


// decide webpage color
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)
    colorMode('light');
