/**
 * Converts a Pokémon's height from decimeters to a string in feet and inches,
 * formatted like 2'04".
 *
 * @param {number} decimeters - The height in decimeters (PokéAPI format).
 * @returns {string} - A string showing feet and inches, e.g. "2'04\"".
 */
export function convertHeightToImperial(decimeters) {
  // 1 decimeter = 10 cm, 1 inch = 2.54 cm
  const totalInches = Math.round((decimeters * 10) / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${String(inches).padStart(2, "0")}"`;
}

/**
 * Converts a Pokémon's weight from hectograms to pounds, rounded to 1 decimal place.
 *
 * @param {number} hectograms - The weight in hectograms (PokéAPI format).
 * @returns {string} - A string showing weight in lbs, e.g. "15.2".
 */
export function convertWeightToLbs(hectograms) {
  // 1 hectogram = 0.1 kg, 1 kg ~ 2.20462 lbs => 1 hg ~ 0.220462 lbs
  const lbs = hectograms * 0.220462;
  return lbs.toFixed(1);
}
