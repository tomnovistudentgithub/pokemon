import axios from "axios";


export async function getPokemon(signal, offset = 0) {
    console.log('Offset:', offset);

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`, {signal: signal});
    const data = await response.json();

    const urls = data.results.map(pokemon => pokemon.url);
   const pokemonsWithDetails = await getAllPokemonDetails(urls);

    return {details: pokemonsWithDetails, count: data.count};
//}

export async function getPokemonByUrl(url) {
    const response = await axios.get(url);
    return response.data;
}

export async function getAllPokemonDetails(urls) {
    const promises = urls.map(url => getPokemonByUrl(url));

    const allDetails = await Promise.all(promises);


    return allDetails;
}





