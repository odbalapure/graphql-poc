const continentSelect = document.getElementById("continent-select");
const countryList = document.getElementById("country-list");
const warning = document.getElementById("warning");

/**
 * @desc Get list of continents and their codes
 */
queryFetch(`
  query {
    continents {
        name
        code
      }
    }
  `)
  .then(data => {
    data.data.continents.forEach(continent => {
      const option = document.createElement("option");
      option.value = continent.code;
      option.innerText = continent.name;

      continentSelect.append(option);
    });
  })
  .catch(error => console.log(`Error: ${error}`));

/**
 * @desc Get countries by passing a country code
 */
async function getCountries(event) {
  if (event.target.value === "Select a continent") {
    countryList.innerHTML = "";
    warning.innerHTML = `Please select a continent!`;
    return;
  }

  const code = event.target.value;
  const countries = await getContinentCountries(code);

  countryList.innerHTML = "";
  warning.innerHTML = "";
  countries.forEach(country => {
    const element = document.createElement("div");
    element.innerText = country.name;
    countryList.append(element);
  });
}

/**
 * @desc Get countries in a continent
 * @param {*} code 
 * @returns List of countries
 */
function getContinentCountries(code) {
  return queryFetch(
    `
      query ($code: ID!) {
        continent(code: $code) {
            countries {
              name,
              phone,
              native,
            }
         } 
      }
    `, { code }).then(data => {
      return data.data.continent.countries
    });
}

/**
 * @desc Calls a GraphQL API
 * @param {*} query 
 * @param {*} variables 
 * @returns List of continents data
 */
function queryFetch(query, variables) {
  return fetch("https://countries.trevorblades.com/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: query,
      variables: variables
    })
  }).then((res) => res.json())
}