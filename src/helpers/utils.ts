import { NamedAPIResource } from "pokenode-ts";

export function extractIdByPokemon(pokemonResource: NamedAPIResource): number | undefined {
    return +pokemonResource.url.split("/").reverse()[1];
}

export function castToNumber(content: string): number | undefined {
    const regex = /^\d+$/;
    const result = regex.test(content);
    return result ? +content : undefined;
}
