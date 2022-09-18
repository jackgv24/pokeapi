import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

const syncApi: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  return formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
};

const getPokemonList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

};

const getPokemonNameById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

};

const getPokemonListByType: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

};

export const sync = middyfy(syncApi);
export const pokedex = middyfy(getPokemonList)
export const pokemonNameById = middyfy(getPokemonNameById);
export const pokemonListByType = middyfy(getPokemonListByType);
