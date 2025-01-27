import React, { useEffect, useState } from "react";
import PokemonEvolutions from "./components/PokemonEvolutions";
import PokemonInfo from "./components/PokemonInfo";
import PokemonList from "./components/PokemonList";
import "./App.css";
import SearchIcon from "./assets/Icons"; // Your search icon

function App() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonSpecies, setPokemonSpecies] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search input
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State to toggle input visibility

  // Fetch data for the currently selected Pokémon
  useEffect(() => {
    if (currentPokemon) {
      fetch(currentPokemon.url)
        .then((response) => response.json())
        .then((data) => setPokemonData(data))
        .catch((error) => console.error("Error fetching Pokémon data:", error));
    }
  }, [currentPokemon]);

  // Fetch species data for the currently selected Pokémon
  useEffect(() => {
    if (pokemonData) {
      fetch(pokemonData.species.url)
        .then((response) => response.json())
        .then((data) => setPokemonSpecies(data))
        .catch((error) =>
          console.error("Error fetching Pokémon species data:", error)
        );
    }
  }, [pokemonData]);

  // Handle the input losing focus (close the input when blurred)
  const handleInputBlur = () => setIsSearchOpen(false);

  return (
    <main>
      <div className="container">
        {/* Search Container */}
        <div className="search-container">
          {isSearchOpen ? (
            <input
              type="text"
              className="search-input"
              placeholder="Search Pokémon"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={handleInputBlur} // Close input when losing focus
              autoFocus
            />
          ) : (
            <SearchIcon
              className="search-icon"
              onClick={() => setIsSearchOpen(true)} // Open input when clicking the icon
            />
          )}
        </div>

        {/* Pokémon List */}
        <PokemonList
          currentPokemon={currentPokemon}
          setCurrentPokemon={setCurrentPokemon}
          searchTerm={searchTerm}
        />

        {/* Pokémon Info and Evolutions */}
        <section className="pokemon-info-section">
          <PokemonInfo
            pokemonData={pokemonData}
            pokemonSpecies={pokemonSpecies}
          />
          <hr />
          <PokemonEvolutions pokemonSpecies={pokemonSpecies} />
        </section>
      </div>
    </main>
  );
}

export default App;
