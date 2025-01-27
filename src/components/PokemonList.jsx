import React, { useState, useEffect, useRef } from "react";
import { capitalizeFirstLetter } from "../utils/textFormatter";
import "../styles/PokemonList.css";

export default function PokemonList({ currentPokemon, setCurrentPokemon }) {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false); // Nuevo estado para evitar múltiples fetchs
  const sidebarRef = useRef(null);
  const initialLoad = useRef(false);

  /**
   * Fetch a batch of Pokémon from the API.
   */
  const fetchPokemonBatch = async () => {
    if (isFetching) return; // If already fetching, skip the new request

    setIsFetching(true); // Set fetching flag to true

    try {
      const limit = 50;
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await response.json();

      // Append the new results to the existing list
      setPokemonList((prevList) => [...prevList, ...data.results]);

      // If there are no more results, stop fetching
      if (!data.next) {
        setHasMore(false);
      }

      // Update the offset for the next batch
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.error("Error fetching Pokémon batch:", error);
    } finally {
      // Always set fetching flag to false after the request
      setIsFetching(false); 
    }
  };

  // Fetch the first batch of Pokémon on initial load
  useEffect(() => {
    // Skip the initial fetch on first render
    if (!initialLoad.current) {
      initialLoad.current = true;
      fetchPokemonBatch();
    }
  }, []);

  // Set the first Pokémon as the current one when the list is loaded
  useEffect(() => {
    if (pokemonList.length > 0) {
      setCurrentPokemon(pokemonList[0]);
    }
  }, [pokemonList, setCurrentPokemon]);

  // Handle the click event on a Pokémon item
  const handleClick = (pokemon) => {
    setCurrentPokemon(pokemon);
  };

  // Handle the scroll event on the sidebar
  const handleScroll = (e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;

    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !isFetching) {
      fetchPokemonBatch();
    }
  };

  return (
    <aside className="sidebar" ref={sidebarRef} onScroll={handleScroll}>
      <ul className="pokemon-list">
        {pokemonList.map((pokemon, index) => {
          const pokemonId = index + 1;
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