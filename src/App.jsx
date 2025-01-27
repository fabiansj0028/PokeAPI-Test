import React, { useEffect, useState } from "react";
import PokemonEvolutions from "./components/PokemonEvolutions";
import PokemonInfo from "./components/PokemonInfo";
import PokemonList from "./components/PokemonList";
import "./App.css";

function App() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);
  const [pokemonSpecies, setPokemonSpecies] = useState(null);

  useEffect(() => {
    if (currentPokemon) {
      fetch(currentPokemon.url)
        .then((response) => response.json())
        .then((data) => {
          setPokemonData(data);
        })
        .catch((error) => {
          console.error("Error fetching Pokémon data:", error);
        });
    }
  }, [currentPokemon]);

  useEffect(() => {
    if (pokemonData) {
      fetch(pokemonData.species.url)
        .then((response) => response.json())
        .then((data) => {
          setPokemonSpecies(data);
        })
        .catch((error) => {
          console.error("Error fetching Pokémon species data:", error);
        });
    }
  }, [pokemonData]);

  return (
    <main>
      <div className="container">
        <PokemonList
          currentPokemon={currentPokemon}
          setCurrentPokemon={setCurrentPokemon}
        />
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
