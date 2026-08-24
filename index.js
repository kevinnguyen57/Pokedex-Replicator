
// Fetching Poke API v2 data
async function getPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
    /* -- Basic API call
    .then(response => response.json())  // json parses the API into readable data (converts response to JavaScript Object)
    .then(data => {
        console.log(data);
    });
       -- Use this API call to make it easier making a pokedex */
    const data = await response.json();

    // console.log(data); -- pokemon data works and is read correctly

    // loop through each pokemon data
    for (const pokemon of data.results) {
        // const pokemonResponse = await fetch(pokemon.url); 
        // const pokemonData = await pokemonResponse.json();
        const pokemonData = await getPokemonData(pokemon.url); // instead of the two code above, we call getPokemonData to do it and grabs the current pokemon url

        // We call createPokemonCard and pass it the current pokemon url
        createPokemonCard(pokemonData);
    }
}

// get a specific pokemon's data using their url
async function getPokemonData(url) {
    const response = await fetch(url);  // Fetch current pokemon
    const data = await response.json(); // Converts reponse to JS data

    return data;
}

// Create current pokemon card given their url
function createPokemonCard(pokemonData) {
    const card = document.createElement("div"); // Creates a new div

    // Populates the new div card
    // We use map to go through each type the pokemon has in the array
    card.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <p>#${pokemonData.id}</p>
        <img src="${pokemonData.sprites.front_default}">
        <p>${pokemonData.types.map(type => type.type.name).join(" ")}</p>
    `;

    // appends the new div card to HTML id #pokemon-container
    document.querySelector("#pokemon-container").appendChild(card);
}
