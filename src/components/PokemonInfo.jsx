import React, { useState, useEffect } from "react";
import {
  convertHeightToImperial,
  convertWeightToLbs,
} from "../utils/pokemonInfoFormatter";
import { capitalizeFirstLetter } from "../utils/textFormatter";
import "../styles/PokemonInfo.css";

export default function PokemonInfo({ pokemonData }) {
  const [genus, setGenus] = useState(null);
  const [eggGroups, setEggGroups] = useState(null);

  // Fetch species data for the selected Pokémon
  useEffect(() => {
    if (pokemonData) {
      fetch(pokemonData.species.url)
        .then((response) => response.json())
        .then((data) => {
          // Find the English genus name
          setGenus(data.genera.find((genus) => genus.language.name === "en"));

          // Set the egg groups
          setEggGroups(
            data.egg_groups.map((eggGroup) =>
              capitalizeFirstLetter(eggGroup.name)
            )
          );
        })
        .catch((error) => {
          console.error("Error fetching Pokémon species data:", error);
        });
    }
  }, [pokemonData]);
  return (
    <>
      {pokemonData ? (
        <div className="pokemon-info-container">
          <div className="left-column">
            <img
              className="pokemon-main-img"
              alt="pokemon-img"
              src={pokemonData.sprites.other["official-artwork"].front_default}
            />
            <h2>{capitalizeFirstLetter(pokemonData.name)}</h2>
            <div className="types-container">
              {pokemonData.types.map((type) => (
                <span key={type.type.name}>
                  {capitalizeFirstLetter(type.type.name)}
                </span>
              ))}
            </div>
          </div>
          <div className="right-column">
            <h2>Information</h2>
            <p>
              <strong>Weight: </strong>
              {convertWeightToLbs(pokemonData.weight)} lbs.
            </p>
            <p>
              <strong>Height: </strong>
              {convertHeightToImperial(pokemonData.height)}
            </p>
            <p>
              <strong>Species: </strong>
              {genus
                ? capitalizeFirstLetter(genus.genus.replace("Pokémon", ""))
                : "Loading..."}
            </p>
            <p>
              <strong>Egg Groups: </strong>
              {eggGroups
                ? eggGroups.join(", ").replace(/\d+/g, "")
                : "Loading..."}
            </p>
            <p>
              <strong>Abilities: </strong>
              {pokemonData.abilities
                .map((ability) => capitalizeFirstLetter(ability.ability.name))
                .join(", ")}
            </p>
          </div>
        </div>
      ) : (
        <p>Select a Pokémon to view more information.</p>
      )}
    </>
  );
}
