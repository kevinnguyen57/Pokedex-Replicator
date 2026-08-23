
/* Fetching Poke API v2 data */
async function getPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151&offset=0")
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}