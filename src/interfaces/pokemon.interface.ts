import { Pokemon as PokemonOrigin } from "pokenode-ts"

export interface Pokemon extends PokemonOrigin {
    type: string;
}
