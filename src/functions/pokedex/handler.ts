import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import {formatJSONError, formatJSONResponse} from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PokemonClient  } from "pokenode-ts";
import { PokemonDb, PokedexDb } from "@db/index"
import {castToNumber, extractIdByPokemon} from "@helpers/utils";
import schema from './schema';

const syncApi: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try {
    const api = new PokemonClient();
    const pokemonListApi = await api.listPokemons(0, 1126);

    for (const pokemonApi of pokemonListApi.results) {
      const id = extractIdByPokemon(pokemonApi);
      console.log(`pokemon with id ${id}`);
      const pokemonDetail = await api.getPokemonById(id)
      await Promise.all([PokedexDb.create(pokemonApi), PokemonDb.create(pokemonDetail)]);
    }

    return formatJSONResponse({
      message: `Everything is up to date`,
    });
  } catch (e: unknown) {
    return formatJSONError(e);
  }
};

const getPokemonList: ValidatedEventAPIGatewayProxyEvent<unknown> = async () => {
  try {
    const pokemonList = await PokedexDb.get();
    return formatJSONResponse({
      result: pokemonList
    });
  } catch (e: unknown) {
    return formatJSONError(e);
  }
};

const getPokemonNameById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const idParameter = event.pathParameters?.id;
    if (!idParameter) throw new Error("There is no Id to search");

    const id = castToNumber(idParameter);
    if (!id) throw new Error("Id must be a number");

    const pokemon = await PokemonDb.getById(id);
    if (!pokemon) throw new Error("There is no data to show");

    return formatJSONResponse({
      name: pokemon.name
    });
  } catch (e: unknown) {
    return formatJSONError(e);
  }
};

const getPokemonListByType: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const type = event.pathParameters?.type;
    if (type) throw new Error("There is no type to search");

    const pokemonList = await PokemonDb.getByType(type);
    if (!pokemonList) throw new Error("There is no data to show");

    return formatJSONResponse({
      pokemon: pokemonList
    });
  } catch (e: unknown) {
    return formatJSONError(e);
  }
};

export const sync = middyfy(syncApi);
export const pokedex = middyfy(getPokemonList)
export const pokemonNameById = middyfy(getPokemonNameById);
export const pokemonListByType = middyfy(getPokemonListByType);
