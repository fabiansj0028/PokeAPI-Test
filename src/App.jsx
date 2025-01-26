import React, { useState } from "react";
import PokemonList from "./components/PokemonList";
import "./App.css";

function App() {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  return (
    <main>
      <div className="container">
        <PokemonList
          currentPokemon={currentPokemon}
          setCurrentPokemon={setCurrentPokemon}
        />
        <section></section>
      </div>
    </main>
  );
}

export default App;
