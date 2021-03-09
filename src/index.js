import './styles.css';
import fetchCountries from './fetchCountries';
import countryTemplate from './templates/country-template.hbs';
import '@pnotify/core/dist/BrightTheme.css';
import { alert, notice, info, success, error } from '@pnotify/core';
import debounce from 'lodash.debounce';

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
  let searchQuery = refs.input.value;

  fetchCountries(searchQuery)
    .then(response => {
      return response.json();
    })
    .then(result => {
      refs.searchList.innerHTML = '';
      if (result.length > 10) {
        info({
          text: 'Too many matches found. Please entry more specific query!',
          delay: 1000,
          sticker: false,
        });
        return;
      }
      if (result.length > 1) {
        clearCountryDescription();

        let markup = result.reduce((acc, item) => {
          acc += `<li>${item.name}</li>`;
          return acc;
        }, '');
        refs.searchList.innerHTML = markup;
        return;
      }

      addCountryMarkup(...result);
    })
    .catch(errorQuery => {
      if(searchQuery){
      clearCountryDescription();
      error({
        text: 'Please enter the correct country name!',
        delay: 1000,
        sticker: false,
      });
      console.log(errorQuery);}
    });
};

refs.input.addEventListener('input', debounce(onInput, 500));
