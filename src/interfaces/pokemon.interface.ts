import { Pokemon as PokemonOrigin } from "pokenode-ts"

export interface Pokemon extends Omit<PokemonOrigin, 'id'> {
    id: string;
    type: string;
}
