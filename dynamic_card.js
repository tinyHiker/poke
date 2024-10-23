async function fetchPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;

    try {
        const pokeResponse = await fetch(pokeUrl);
        const pokeData = await pokeResponse.json();

        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();

        console.log(speciesData)
        
        
        createPokemonCard(pokeData);
    } catch (error) {
        alert('Pokémon not found! Please check the name.');
        console.error(error);
    }
}

function createPokemonCard(data) {
    const cardContainer = document.getElementById('pokemon-card-container');
    cardContainer.innerHTML = ''; // Clear any existing card

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    const abilities = data.abilities.map(ability =>
        `${capitalize(ability.ability.name)}${ability.is_hidden ? ' (Hidden Ability)' : ''}`
    ).join(', ');

    const types = data.types.map(type => capitalize(type.type.name)).join(', ');
    const primaryType = data.types[0].type.name; // The primary type is the first one in the array

    
    


    const genderRatioFemale = 100 - data.gender_rate * 12.5;
    const genderRatioMale = 100 - genderRatioFemale;

    const pokemonHTML = `
        <div class="header">
            <h1>${capitalize(data.name)}</h1>
            <p>#${data.id.toString().padStart(4, '0')}</p>
        </div>
        <div class="image-section">
            <img src="${data.sprites.other['official-artwork'].front_default}" alt="${data.name}">
        </div>
        <div class="info-section">
            <p><strong>Type:</strong> <span class="type ${primaryType}">${types}</span></p>
            <p><strong>Abilities:</strong> ${abilities}</p>
        </div>
        <div class="details-section">
            <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
            <p><strong>Height:</strong> ${data.height / 10} m</p>
        </div>
        <div class="breeding-section">
            <p><strong>Gender Ratio:</strong></p>
            <div class="gender-ratio">
                <div class="gender-bar female" style="width: ${genderRatioFemale}%;"></div>
                <div class="gender-bar male" style="width: ${genderRatioMale}%;"></div>
            </div>
            <p>${genderRatioFemale.toFixed(1)}% Female, ${genderRatioMale.toFixed(1)}% Male</p>
        </div>
        <div class="stats-section">
            <p><strong>Base Stats:</strong></p>
        </div>
        <div class="game-sprites-section">
            <p><strong>Game Sprites:</strong></p>
        </div>
    `;

    pokemonCard.innerHTML = pokemonHTML;
    cardContainer.appendChild(pokemonCard);
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


