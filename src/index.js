import './css/styles.css';
import {fetchCountries} from "./fetchCountries";
import Notiflix from 'notiflix';
var debounce = require('lodash.debounce');

const refs = {
    searchBox: document.querySelector('[id="search-box"]'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info')
};

const debounceOnSearch = debounce(onSearch, 300);
refs.searchBox.addEventListener('input', debounceOnSearch);

function onSearch(e) {
    e.preventDefault();
    const value = refs.searchBox.value.trim();
    
    if (!value) {
        refs.countryList.style.visibility = 'hidden';
        refs.countryInfo.style.visibility = 'hidden';
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }
  
    fetchCountries(value)
    .then(countriesList => {
        if (countriesList.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
            return;
        };
        renderCountries(countriesList);
    })
    .catch(err => {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
    });
}
  
function generateCountryInfo(result) {
    const resultCountryInfo = result.map(({ flags, name, capital, population, languages }) => {
    const language = Object.values(languages).join(', ');
    return `<img src="${flags.svg}" alt="${name}" width="320">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${language}</span></p>`;
    }).join('');
    refs.countryInfo.innerHTML = resultCountryInfo;
    return resultCountryInfo;
};
  
function generateCountryList(result) {
    const resultCountryList = result.map(({ flags, name }) => {
      return `<li>
                <img src="${flags.svg}" alt="${name}" width="30">
                <span>${name.common}</span>
            </li>`
    }).join('');
    refs.countryList.innerHTML = resultCountryList;
    return resultCountryList;
}
  
function renderCountries(result) {
    if (2 <= result.length <= 10) {
        refs.countryInfo.innerHTML = '';
        refs.countryInfo.style.visibility = 'hidden';
        refs.countryList.style.visibility = 'visible';
        refs.countryList.innerHTML = generateCountryList(result);
    }
    if (result.length === 1) {
        refs.countryList.innerHTML = '';
        refs.countryList.style.visibility = 'hidden';
        refs.countryInfo.style.visibility = 'visible';
        refs.countryInfo.innerHTML = generateCountryInfo(result);
    }
}