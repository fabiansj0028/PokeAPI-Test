import React, { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../utils/textFormatter";
import "../styles/PokemonEvolutions.css";

export default function PokemonEvolutions({ pokemonSpecies }) {
  const [evolutionChain, setEvolutionChain] = useState([]);

  /**
   * Fetch evolution chain data and return an array of objects
   * containing each Pokémon's name and sprite URL.
   *
   * @param {object} speciesData - The full response from the species fetch.
   * @returns {Promise<Array<{ name: string, sprite: string }>>}
   */
  const fetchEvolutionChainFromSpecies = async (speciesData) => {
    try {
      // Extract evolution_chain URL from species data
      const evolutionChainUrl = speciesData.evolution_chain.url;

      // Fetch the evolution chain
      const evolutionResponse = await fetch(evolutionChainUrl);
      const evolutionData = await evolutionResponse.json();

      // Parse evolution chain into a flat array of Pokémon names
      const evolutionNames = [];
      let current = evolutionData.chain;

      while (current) {
        evolutionNames.push(current.species.name); // Add Pokémon name
        current = current.evolves_to[0]; // Move to the next evolution stage
      }

      // Fetch sprite URLs for each Pokémon in the chain
      const evolutionWithSprites = await Promise.all(
        evolutionNames.map(async (name) => {
          const pokemonResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
          );
          const pokemonData = await pokemonResponse.json();

          return {
            name,
            sprite: pokemonData.sprites.other["official-artwork"].front_default,
          };
        })
      );

      return evolutionWithSprites; // [{ name, sprite }, { name, sprite }, ...]
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadEvolutionChain = async () => {
      if (pokemonSpecies) {
        const evolutions = await fetchEvolutionChainFromSpecies(pokemonSpecies);
        console.log(evolutions);
        setEvolutionChain(evolutions);
      }
    };

    loadEvolutionChain();
  }, [pokemonSpecies]);

  return (
    <div className="pokemon-evolutions">
      <h2>Evolution Chart</h2>
      <div className="evolution-chain">
        {evolutionChain.map((pokemon) => (
          <>
            <div key={pokemon.name} className="evolution">
              <img src={pokemon.sprite} alt={pokemon.name} />
              <p>{capitalizeFirstLetter(pokemon.name)}</p>
            </div>
            {pokemon !== evolutionChain[evolutionChain.length - 1] && (
              <span>&rarr;</span>
            )}
          </>
        ))}
      </div>
    </div>
  );
}
