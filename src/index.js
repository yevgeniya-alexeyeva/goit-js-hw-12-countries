import './styles.css';
import fetchCountries from './fetchCountries';
import countryTemplate from './templates/country-template.hbs';
import debounce from 'lodash.debounce';
import '@pnotify/core/dist/BrightTheme.css';
import { Stack, error, alert } from '@pnotify/core';

const refs = {
  input: document.querySelector('#search-input'),
  searchList: document.querySelector('.js-search-list'),
  article: document.querySelector('.js-country-article'),
};

const addCountryMarkup = countryDescription => {
  refs.article.innerHTML = countryTemplate({
    countryName: countryDescription.name,
    capital: countryDescription.capital,
    population: countryDescription.population,
    language: countryDescription.languages,
    flag: countryDescription.flag,
  });
};

const clearCountryDescription = () => {
  refs.article.innerHTML = '';
};

const onInput = () => {
  const searchQuery = refs.input.value.trim();
  fetchCountries(searchQuery)
    .then(response => {
      return response.json();
    })
    .then(result => {
      refs.searchList.innerHTML = '';

      if (result.status == '404') {
        error({
          text: 'Please enter the correct country name!',
          delay: 1000,
          sticker: false,
        });
        return;
      }

      if (result.length > 10) {
        clearCountryDescription();
        alert({
          text: 'Too many matches found. Please entry more specific query!',
          delay: 1000,
          sticker: false,
          stack: new Stack({
            dir1: 'up',
            dir2: 'right',
            firstpos1: 30,
            firstpos2: 30,
          }),
        });
        return;
      }
      if (result.length > 1) {
        clearCountryDescription();

        const markup = result.reduce((acc, item) => {
          acc += `<li>${item.name}</li>`;
          return acc;
        }, '');
        refs.searchList.innerHTML = markup;
      }
      if (result.length === 1) addCountryMarkup(...result);
    })
    .catch(errorQuery => {
      if (searchQuery) {
        clearCountryDescription();
        error({
          text: 'Ups! Try again!',
          delay: 1000,
          sticker: false,
        });
        console.log(errorQuery);
      }
    });
};

refs.input.addEventListener('input', debounce(onInput, 500));
