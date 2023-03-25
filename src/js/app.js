'use strict';

const $ = document;
const searchInput = $.querySelector('#search_input');
const searchBtn = $.querySelector('#search_btn');

const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'bb3f843336220fe5f3eab23198735e53';

searchBtn.addEventListener('click', function (event) {
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
    sendApiRequest(searchInput.value);
    
  }
});

async function sendApiRequest(value) {
  await fetch(`${apiUrl}?q=${value}&appid=${apiKey}`)
    .then((res) => {
      if (res.status === 200) return res.json();
    })
    .then((data) => {
      console.log(data);
    });
}

function addApiResponseData(data){}