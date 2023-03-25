'use strict';
import moment from 'moment';

const $ = document;
const searchInput = $.querySelector('#search_input');
const searchBtn = $.querySelector('#search_btn');
const template = $.querySelector('#main_template');
const defaultCityName = 'Tehran';

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'bb3f843336220fe5f3eab23198735e53';

searchBtn.addEventListener('click', async function (event) {
  event.preventDefault();
  if (searchInput.value.trim() === '') {
    Swal.fire({
      title: 'Error!',
      text: 'empty value cannot be send',
      icon: 'error',
      confirmButtonText: 'ok',
      didDestroy: () => {
        searchInput.value = '';
      },
    });
  } else {
    sendApiRequest(searchInput.value).then((data) => {
      addApiResponseData(data);
    });
  }
});

async function sendApiRequest(value, usePosition = false) {
  searchInput.innerHTML = '';
  let queryTemplate = usePosition
    ? `lat=${value[0]}&lon=${value[1]}&appid=${apiKey}`
    : `q=${value}&appid=${apiKey}`;
  //
  console.log(queryTemplate);
  return await fetch(`${apiUrl}?${queryTemplate}`)
    .then((res) => {
      if (res.status === 200) return res.json();
    })
    .then((data) => {
      $.querySelector('main').innerHTML = '';
      addTemplate();
      return data;
    });
}

function addTemplate() {
  let card = template.content.cloneNode(true);
  $.querySelector('main').append(card);
}

function addApiResponseData(data) {
  $.querySelector('#name').innerHTML = data.name;
  $.querySelector('#temperature').innerHTML = `${convertFahrenheitToCelsius(
    data.main.temp
  )}&#8451;`;
  $.querySelector('#date').innerHTML = moment().format('dddd MMMM Do YYYY');
  $.querySelector('#state').innerHTML = data.weather.at(0).main;
  $.querySelector('#low_temp').innerHTML = `${convertFahrenheitToCelsius(
    data.main.temp_min
  )}&#8451;`;
  $.querySelector('#high_temp').innerHTML = `${convertFahrenheitToCelsius(
    data.main.temp_max
  )}&#8451;`;
}

function convertFahrenheitToCelsius(temp) {
  return ((temp - 32) / 1.8).toFixed(2);
}

window.addEventListener('load', function () {
  navigator.geolocation.getCurrentPosition(
    locationSuccessCallback,
    locationErrorCallback
  );
});

function locationSuccessCallback(position) {
  console.log(position);
  sendApiRequest(
    [position.coords.latitude, position.coords.longitude],
    true
  ).then((data) => {
    addApiResponseData(data);
  });
}
function locationErrorCallback(error) {
  Swal.fire({
    title: 'Error!',
    text: 'your location not found !',
    icon: 'error',
    confirmButtonText: 'ok',
    didDestroy: () => {
      sendApiRequest(defaultCityName, false).then((data) => {
        addApiResponseData(data);
      });
    },
  });
}
