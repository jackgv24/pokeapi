import { handlerPath } from '@libs/handler-resolver';

export const fnSync = {
  handler: `${handlerPath(__dirname)}/handler.sync`,
  events: [
    {
      http: {
        path: 'sync',
        method: 'get'
      },
    },
  ],
};

export const fnPokedex = {
  handler: `${handlerPath(__dirname)}/handler.pokedex`,
  events: [
    {
      http: {
        path: 'pokemon',
        method: 'get'
      },
    },
  ],
};

export const fnPokemonNameById = {
  handler: `${handlerPath(__dirname)}/handler.pokemonNameById`,
  events: [
    {
      http: {
        path: 'pokemon/{id}/pokemon-name',
        method: 'get'
      },
    },
  ],
};

export const fnPokemonListByType = {
  handler: `${handlerPath(__dirname)}/handler.pokemonListByType`,
  events: [
    {
      http: {
        path: 'pokemon/type/{type}',
        method: 'get'
      },
    },
  ],
};
