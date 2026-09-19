
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

    // Get Pokemon species information
    const speciesResponse = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`
    );

    const speciesData = await speciesResponse.json();

    // Find English description 
    const englishEntry = speciesData.flavor_text_entries.find(
        entry => entry.language.name === "en"
    );

    data.description = englishEntry.flavor_text
        .replace(/\f/g, " ")    // removes the \f \n and replace with " "
        .replace(/\n/g, " ");

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
                const statPercentage = Math.min((statValue / 180) * 100, 100); // bar percentage

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
                src="${pokemonData.sprites.versions["generation-v"]["black-white"].animated.front_default}"
                alt="${pokemonData.name}"
            >

            <div class="modal-types">
                ${types}
            </div>

            <div class="pokemon-details">
                <p><strong>Height:</strong> ${pokemonData.height / 10} m &emsp;<strong>Weight:</strong> ${pokemonData.weight / 10} kg</p>
                <p><strong>Abilities:</strong> ${abilities}</p>
            </div>

            <p class="pokemon-description">
                <strong>Details:</strong> ${pokemonData.description}
            </p>

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

// When outside of modal is clicked, close out the modal
document.querySelector("#pokemon-modal").addEventListener("click", function(event) {
    if (event.target === this) {
        this.style.display = "none";
    }
});

// Filtering
const searchInput = document.querySelector("#search-input"); // search and stores the html id search-input
let selectedType = "all";

// searchInput.addEventListener("input", function() {  
function filterPokemon() {
    const searchText = searchInput.value.toLowerCase();     // Takes the typed input, and lower cases it
    const cards = document.querySelectorAll(".pokemon-card"); // Finds all Pokemon cards

    cards.forEach(function(card) {  // Loops through each Pokemon card
        const pokemonName = card.querySelector("h2").textContent.toLowerCase(); // change the current Pokemon name to lowercase

        const pokemonTypes = Array.from(card.querySelectorAll(".type"))
            .map(type => type.textContent.toLowerCase());

        const matchesName = pokemonName.includes(searchText); // when using .includes we don't have to type the entire Pokemon name

        const matchesType =
            selectedType == "all" || pokemonTypes.includes(selectedType);

        if (matchesName && matchesType) { // Checks if Pokemon name includes searchText & correct type
            card.style.display = "";    // if true, display the Pokemon card
        } else {
            card.style.display = "none"; // if false, don't display the Pokemon card
        }
    });
}

searchInput.addEventListener("input", filterPokemon); // Detects when the user types, calls function

// Add the type button functionality
const typeButtons = document.querySelectorAll(".type-filter"); // finds all the type buttons

typeButtons.forEach(function(button) {
    button.addEventListener("click", function() {   // Listen for a click for every type button
        selectedType = button.dataset.type;         // Selected type button clicked ex: "fire"

        typeButtons.forEach(function(button) {      // Removes the active style from all buttons
            button.classList.remove("active");      // Not all type buttons are selected
        });

        button.classList.add("active");             // adds the active class to the button clicked

        filterPokemon();    // Selected type change, re-filter
    });
});

// Filtering: types
const typesContainer = document.querySelector("#types");    // Finds and stores html id types

const types = [
    "normal", "fire", "water", "electric",
    "grass", "ice", "fighting", "poison",
    "ground", "flying", "psychic", "bug",
    "rock", "ghost", "dragon"
];

// loop through all types using .map and creates a button for them
typesContainer.innerHTML = `
    <button class="type-filter active" data-type="all">All</button>
    ${types.map(type => `
        <button class="type-filter" data-type="${type}">
            ${type}
        </button>
    `).join("")}
`;

getPokemon(); /* Call getPokemon() Function to generate Pokedex */