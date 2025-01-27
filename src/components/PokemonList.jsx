import React, { useState, useEffect, useRef } from "react";
import { capitalizeFirstLetter } from "../utils/textFormatter";
import "../styles/PokemonList.css";

export default function PokemonList({ currentPokemon, setCurrentPokemon }) {

  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const sidebarRef = useRef(null);

  
  /**
   * Fetch a batch of Pokémon from the API.
   */
  const fetchPokemonBatch = async () => {
    try {
      const limit = 20; 
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();

      // Append the new results to the existing list
      setPokemonList((prevList) => [...prevList, ...data.results]);

      // If there's no next page in the response, we've reached the end
      if (!data.next) {
        setHasMore(false);
      }

      // Update offset for the next batch
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Error fetching Pokémon batch:", error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPokemonBatch();
  }, []);
  
  // Set current Pokémon to the first one in the list
    useEffect(() => {
        if (pokemonList.length > 0) {
        setCurrentPokemon(pokemonList[0]);
        }
    }, [pokemonList, setCurrentPokemon]);
    
  /**
   * Handle click event on a Pokémon list item.
   */
  const handleClick = (pokemon) => {
    setCurrentPokemon(pokemon);
  };

  /**
   * Detect when the sidebar is scrolled to the bottom.
   * @param {*} e 
   */
  const handleScroll = (e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;

    // If the user has scrolled to the bottom of the sidebar
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Fetch more Pokémon if there are more to fetch
        if (hasMore) {
        fetchPokemonBatch();
      }
    }
  };

  return (
    <aside
      className="sidebar"
      ref={sidebarRef}
      onScroll={handleScroll}
    >
      <ul className="pokemon-list">
        {pokemonList.map((pokemon, index) => {
          
          // The Pokémon ID is the index + 1
          const pokemonId = index + 1; 

          // Check if the current Pokémon is active
          const isActive = currentPokemon === pokemon;

          return (
            <li
              key={pokemonId}
              className={`pokemon-item ${isActive ? "active" : ""}`}
              onClick={() => handleClick(pokemon)}
            >
              <div className="pokemon-identifier">
                <img
                  className="pokemon-img"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                  alt={pokemon.name}
                />
                <span className="pokemon-name">
                  {capitalizeFirstLetter(pokemon.name)}
                </span>
              </div>
              <span className="pokemon-number">
                #{String(pokemonId).padStart(3, "0")}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
