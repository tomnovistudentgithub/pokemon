import React, {useEffect, useState} from 'react';

import {getPokemon} from "../api/getPokemon.js";
import './PokemonCard.modules.css';


function PokemonCard() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    let abrtController;


    useEffect(() => {

        let isMounted = true;

        const fetchData = async () => {
            abrtController = new AbortController();
          let signal = abrtController.signal;
            try {
                const response = await getPokemon(signal, (currentPage - 1) * 20);
                if (isMounted) {
                    const pokemonDetails = response.details;
                    setData(pokemonDetails);
                    setTotalPages(Math.ceil(response.count / 20));

            setLoading(false);
                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Request aborted');
                    setLoading(false);
                } else {
                    setLoading(false);
                    setError(error);
                    throw error;

                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
            if (abrtController) {
                abrtController.abort();
            }
        };
    }, [currentPage]);


    const handleNext = () => {
        console.log(loading);
        if (!loading && currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (!loading && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };






    return (

        <div>
            {error && <div className="error">{error.message}</div>}
            <button className="button-card" onClick={handlePrevious} disabled={loading || currentPage === 1}>Previous</button>
            <button className="button-card" onClick={handleNext} disabled={loading || currentPage === totalPages}>Next</button>
            <div className="pokemon-card-wrapper">

                {data && data.map((pokemon, index) => {
                    return <>
                        <React.Fragment key={index}>

                            <div className="pokemon-card">
                                <h2>{pokemon.name}</h2>
                                <img src={pokemon.sprites.front_default} alt={pokemon.name}/>
                                <p>Moves: {pokemon.moves.length}</p>
                                <p>Weight: {pokemon.weight}</p>
                                <p>Abilities:</p>
                                <ul>
                                    {pokemon.abilities.map((ability, index) => (
                                        <li key={index}>{ability.ability.name}</li>
                                    ))}
                                </ul>
                            </div>

                        </React.Fragment>

                    </>
                })}
            </div>
        </div>

    );
}


export default PokemonCard;