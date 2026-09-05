
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

    // console.log(data); -- Pokemon data works and is read correctly

    // loop through each Pokemon data
    for (const pokemon of data.results) {
        // const pokemonResponse = await fetch(pokemon.url); 
        // const pokemonData = await pokemonResponse.json();
        const pokemonData = await getPokemonData(pokemon.url); // instead of the two code above, we call getPokemonData to do it and grabs the current pokemon url

        // We call createPokemonCard and pass it the current pokemon url
        createPokemonCard(pokemonData);
    }
}

// get a specific Pokemon's data using their url
async function getPokemonData(url) {
    const response = await fetch(url);  // Fetch current pokemon
    const data = await response.json(); // Converts reponse to JS data

    // Start with the current Pokemon types
    let gen1Types = data.types;

    // Find the oldest historical type info
    if (data.past_types.length > 0) {
        gen1Types = data.past_types[data.past_types.length - 1].types;
    }

    // Replace the current types with gen 1 types
    data.types = gen1Types;

    return data;
}

// Create current pokemon card given their url
function createPokemonCard(pokemonData) {
    const card = document.createElement("div"); // Creates a new div
    card.classList.add("pokemon-card");     // Making each card it's own element for styling later

    // We use map to go through each type the pokemon has in the array
    // We then separate each type then join them and put it in innerHTML
    const types = pokemonData.types.map(type => type.type.name);
    const typeHTML = types
        .map(type => `<span class="type ${type}">${type}</span>`)
        .join(" ");

    // Populates the new div card
    // We also use padStart if we want the pokemon number like this: # 0001
    card.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <p>#${pokemonData.id.toString().padStart(4, "0")}</p>
        <img src="${pokemonData.sprites.front_default}">
        <div>${typeHTML}</div>
    `;

    // appends the new div card to HTML id #pokemon-container
    document.querySelector("#pokemon-container").appendChild(card);

    // Pokemon Modal Info
    card.addEventListener("click", function() {
        const modal = document.querySelector("#pokemon-modal"); // Takes modal ID
        const modalInfo = document.querySelector("#modal-info"); // Takes modal info ID

        // Loop and store current Pokemon abilities
        const abilities = pokemonData.abilities.map(
            ability => ability.ability.name
        ).join(", ");
        
        // Loop and store current Pokemon stats
        const stats = pokemonData.stats.map(
            stat => {
                const statName = stat.stat.name;
                const statValue = stat.base_stat;
                const statPercentage = Math.min((statValue / 255) * 100, 100);

                let statColor;

                if (statValue < 50) {
                    statColor = "low";
                } else if (statValue < 90) {
                    statColor = "medium";
                } else {
                    statColor = "high";
                }

                return `
                    <div class="stat">
                        <span class="stat-name">${statName}</span>
                        
                        <div class="stat-bar">
                            <div
                                class="stat-fill ${statColor}"
                                style="width: ${statPercentage}%">
                            </div>
                        </div>

                        <span class="stat-value">${statValue}</span>
                    </div>
                `;
            }).join("");
        
        // Loops and store current Pokemon types
        const types = pokemonData.types.map(
            type => `<span class="modal-type ${type.type.name}">${type.type.name}</span>`
        ).join(" ");
        
        // Populate modal info with what users should see when clicking on a Pokemon Card
        modalInfo.innerHTML = `
            <h2>${pokemonData.name}</h2>

            <p>#${pokemonData.id.toString().padStart(4, "0")}</p>

            <img
                class="modal-image"
                src="${pokemonData.sprites.front_default}"
                alt="${pokemonData.name}"
            >

            <div class="modal-types">
                ${types}
            </div>

            <div class="pokemon-details">
                <p><strong>Height:</strong> ${pokemonData.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemonData.weight / 10} kg</p>
                <p><strong>Abilities:</strong> ${abilities}</p>
            </div>

            <div class="pokemon-stats">
                <h3>Base Stats</h3>
                ${stats}
            </div>
        `;

        // Flex modal ID as it's currently "none"
        modal.style.display = "flex";
    });
}

// When close modal is clicked, do not display the pokemon modal
document.querySelector("#close-modal").addEventListener("click", function() {
    document.querySelector("#pokemon-modal").style.display = "none";
});
