import Notiflix from 'notiflix';

function fetchCountries(name) {
	const url = `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`;

	return fetch(url).then(response => {
        if(response.status === 404) {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        }
        return response.json();
    })
};

export {fetchCountries}