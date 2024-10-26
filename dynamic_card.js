async function fetchPokemon() {
    const pokemonName = document.getElementById('pokemonName').value.toLowerCase();
    const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`;

    try {
        const pokeResponse = await fetch(pokeUrl);
        const pokeData = await pokeResponse.json();

        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();

        


        
        let pokeGen = speciesData.generation.name
        let statTotal = getStatsTotal(pokeData.stats)
        let pokemonType = pokeData.types[0].type.name.toLowerCase()
        let pokeName = capitalize(pokeData.name)
        let primaryType = pokeData.types[0].type.name.toLowerCase()

        let pokeball = getPokeballType(primaryType, statTotal, speciesData.is_baby, speciesData.is_legendary, speciesData.is_mythical)

        
        setWallpaper(pokemonType, statTotal, pokeGen)
        createPokemonCard(pokeData, speciesData);
        createPokeLinker(pokeName, pokeball);
    } catch (error) {
        alert('Pokémon not found! Please check the name.');
        console.error(error);
    }
}


function createPokeLinker( pokemonName, pokeball) {
    const cardContainer = document.getElementById('pokemon-card-container');
    let pokeLinker = document.createElement('a');

    pokeLinker.href = `https://bulbapedia.bulbagarden.net/wiki/${pokemonName}`
    pokeLinker.innerHTML = `<img src="pokeballs/${pokeball}" alt="Descriptive Text" class="corner-image">`
    pokeLinker.classList.add('image-link')

    cardContainer.appendChild(pokeLinker)
}

function createPokemonCard(data, species) {
    const cardContainer = document.getElementById('pokemon-card-container');
    cardContainer.innerHTML = ''; // Clear any existing card

    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    //Abilities
    const abilities = data.abilities.map(ability =>
        `${capitalize(ability.ability.name)}${ability.is_hidden ? ' (Hidden Ability)' : ''}`
    ).join(', ');

    
    //Type Elements
    types = data.types.map(type => capitalize(type.type.name))
    let typeElements = ''
    for (let type of types){
        typeElements += `<span class="type ${type.toLowerCase()}" id="typebox" >${type}</span>`
    }

    let primaryType = types[0].toLowerCase()
    let primaryTypeID = `${primaryType}-image-container`

    pokemonCard.classList.add(`${primaryType}-pokemon`)




    //Stat Elements
    const stats = data.stats.map(stat => `
        <div class="stat">
            <span class="stat-name" >${capitalize(stat.stat.name)}</span>
            <span class="stat-value" style="color: ${ getStatColor(data.stats, stat.base_stat)};">${stat.base_stat}</span>
        </div>
    `).join('');



    // Game Sprite Elements
    sprites = getSprites(data)


    //Gender Ratio Values
    const genderRatioFemale = 100 - species.gender_rate * 12.5;
    const genderRatioMale = 100 - genderRatioFemale;


    //Main Image URL
    let main_image = data?.sprites?.versions?.['generation-v']?.['black-white']?.front_default;
    const pokemonHTML = `
        <div class="header">
            <h1>${capitalize(data.name)}</h1>
            <p>#${data.id.toString().padStart(4, '0')}</p>
        </div>
        <div class="image-section" id="${primaryTypeID}" style=>
            <img src="${main_image}" alt="${data.name}">
        </div>
        <div class="info-section">
            <p><strong>Type:</strong> ${typeElements}</p>
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
            ${stats}
        </div>
        <div class="game-sprites-section">
            <p><strong>Game Sprites:</strong></p>
            ${sprites}
        </div>
    `;

    pokemonCard.innerHTML = pokemonHTML;
    cardContainer.appendChild(pokemonCard);
}


function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function getSprites(data){
    choices = [['generation-v', 'black-white'], ['generation-viii','icons'], ['generation-vi' , 'x-y']]

    let sprites = ""

    for (let choice of choices){
        let sprite = data?.sprites?.versions?.[choice[0]]?.[choice[1]]?.front_default;
        if (sprite){
            sprites += `<img src=${sprite}></img>`

        }
    }

    return sprites

}



function getMaxMinStats(data){
    let stats = data.map(stat => stat.base_stat)
    let max = Math.max(...stats);
    let min = Math.min(...stats);
    return [max, min]
}



function getStatColor(stats, statVal){

    let [maxValue, minValue] = getMaxMinStats(stats)
    
    if (statVal == maxValue){
        return "#66ff00"
    } else if (statVal == minValue){
        return "#ff000d"
    }

}


function getStatsTotal(stats){
    let statsTotal = 0
    stats.forEach(stat => statsTotal += stat.base_stat)
    return statsTotal

}



function getPokeballType(primaryType, statsTotal, isBaby, isLegendary, isMythical){
    let pokeBall

    if (isBaby){
        pokeBall= "DREAMBALL.png"
        return pokeBall
    }
    if (isLegendary || isMythical){
        pokeBall = "MASTERBALL.png"
        return pokeBall
    }


    if (statsTotal <= 350){
        pokeBall = 'POKEBALL.png'
        if (primaryType === 'bug') {
            pokeBall= 'BUGBALL.png'
        } else if (primaryType === 'water'){
            pokeBall = 'WATERBALL.png'
        }
    } else if (statsTotal <= 500){
        pokeBall = 'GREATBALL.png'
        if (primaryType === 'bug') {
            pokeBall= 'BUGBALL.png'
        } else if (primaryType === 'water'){
            pokeBall = 'WATERBALL.png'
        }
    } else if (statsTotal <= 580){
        pokeBall = 'ULTRABALL.png'
    } else {
        pokeBall = "MEGABALL.png"

    }
    return pokeBall


}

function setWallpaper(type, baseStat, generation){
    
    let body = document.querySelector("body")
    console.log(body.classList)
    body.classList.length > 10 ? body.classList.remove('bug_background', 'ice_background', 'grass_background', 'dragon_background', '') : undefined
    

    body.classList.add(`${type.toLowerCase()}_background`)
    
    
    
    

}