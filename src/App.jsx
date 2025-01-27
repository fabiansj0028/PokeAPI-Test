import React, { useEffect, useState } from "react";
import PokemonInfo from "./components/PokemonInfo";
import PokemonList from "./components/PokemonList";
import "./App.css";

function App() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    if (currentPokemon) {
      fetch(currentPokemon.url)
        .then((response) => response.json())
        .then((data) => {
          setPokemonData(data);
          console.log(data);
        })
        .catch((error) => {
          console.error("Error fetching Pokémon data:", error);
        });
    }
  }, [currentPokemon]);
  return (
    <main>
      <div className="container">
        <PokemonList
          currentPokemon={currentPokemon}
          setCurrentPokemon={setCurrentPokemon}
        />
        <section className="pokemon-info-section">
          <PokemonInfo pokemonData={pokemonData} />
          <hr />
        </section>
      </div>
    </main>
  );
}

export default App;
