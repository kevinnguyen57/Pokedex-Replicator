
/* Fetching Poke API v2 data */
async function getPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0");
    /* -- Basic API call
    .then(response => response.json())  // json parses the API into readable data (converts response to JavaScript Object)
    .then(data => {
        console.log(data);
    });
       -- Use this API call to make it easier making a pokedex */
    const data = await response.json();

    // console.log(data); -- shows that fetching worked, all data in inspect

    for (const pokemon of data.results) {
        console.log(pokemon.name);
    }
}
