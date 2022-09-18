import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { PokemonList } from "@interface/index";
import { POKEMON_LIST_TABLE } from "@constants/index";
import { extractIdByPokemon } from "@helpers/utils";
import { NamedAPIResource as PokemonApiList } from "pokenode-ts";

class PokedexDb {
    private static db = new DynamoDB.DocumentClient()

    public static async get(): Promise<PokemonList[]> {
        try {
            const params: DocumentClient.ScanInput = {
                TableName : POKEMON_LIST_TABLE
            };
            const tableScan = await this.db.scan(params).promise();
            console.log(tableScan.Items);
            return tableScan.Items as PokemonList[];
        } catch (e: unknown) {
            console.error(`PokedexDb - get - ${String(e)}`);
            return [];
        }
    }

    public static async create(pokemonListItem: PokemonApiList): Promise<PokemonList | undefined> {
        try {
            const pokemonId = extractIdByPokemon(pokemonListItem)
            const item: PokemonList = {
                ...pokemonListItem,
                id: `POKEMON_${pokemonId}`
            }
            const params: DocumentClient.PutItemInput = {
                TableName: POKEMON_LIST_TABLE,
                Item: item
            }
            await this.db.put(params).promise();
            return item;
        } catch (e) {
            console.error(`PokedexDb - create - ${String(e)}`);
            return undefined;
        }
    }
}

export default PokedexDb;
