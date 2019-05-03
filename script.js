const searchBar = document.querySelector('#input');
const notification = document.querySelector('.notification--text');
const resultsDisplay = document.querySelector('.results--table-output'); 

function getResults() {
    if (searchBar.value === "") {
        resultsDisplay.innerHTML = "";
        notification.innerHTML = "";
    } else { 
    if (searchBar.value !== '') {
        
        const api = `https://cors-anywhere.herokuapp.com/iatacodes.org/api/v6/autocomplete?api_key=be58b721-1831-42fe-b963-e33bb1024ede&query=${searchBar.value}`;
        
        fetch(api)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data.response);
                const array = [...data.response.airports_by_countries, ...data.response.airports_by_cities, ...data.response.airports];
                const results = Array.from(new Set(array.map(value => value.name)))
                    .map(name => {
                        return {
                            name: name,
                            code: array.find(value => value.name === name).code,
                            country_name: array.find(value => value.name === name).country_name
                        }
                    })

                console.log(results);
                let output = '';
                for (let i = 0; i < results.length; i++) {
                    output += `<tr class="results--table-row">`;

                    output += `<td class="results--table-output"> ${results[i].country_name} </td>`;
                    output += `<td class="results--table-output"> ${results[i].code} </td>`;
                    output += `<td class="results--table-output"> ${results[i].name} </td>`;

                    output += `</tr>`;
                }

            notification.classList.remove('hidden');
            notification.innerHTML = `
                Showing <span class="text--success">
                ${results.length}</span> results for ${searchBar.value.toUpperCase()}
                `;
            resultsDisplay.innerHTML = output; 
            })
            .catch(err => {
                console.log(err);   
                return `Error: ${err}`;
        })
    }
    }
}; 

function debounced(delay, fn) {
    let timerId;
    return function (...args) {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout( () => {
            fn(...args);
            timerId = null;
        }, delay);
    }
}

const showResults = debounced(1000, getResults);

searchBar.addEventListener('input', showResults); 