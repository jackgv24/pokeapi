import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { PokemonList } from "@interface/index"
import { POKEMON_LIST_TABLE } from "@constants/index"
import { NamedAPIResource as PokemonApiList } from "pokenode-ts";

class PokedexDb {
    private db = new DynamoDB.DocumentClient()

    public async get(): Promise<PokemonList[]> {
        try {
            const params: DocumentClient.ScanInput = {
                TableName : POKEMON_LIST_TABLE
            };
            const tableScan = await this.db.scan(params).promise();
            return tableScan.Items as PokemonList[];
        } catch (e: unknown) {
            console.error(`PokedexDb - get - ${String(e)}`);
            return [];
        }
    }

    public async create(pokemonListItem: PokemonApiList): Promise<PokemonList | undefined> {
        try {
            const id:number = +pokemonListItem.url.split("/").reverse()[1];
            const item: PokemonList = {
                ...pokemonListItem,
                id
            }
            const params: DocumentClient.PutItemInput = {
                TableName: POKEMON_LIST_TABLE,
                Item: item
            }
            await this.db.put(params);
        } catch (e) {
            console.error(`PokedexDb - create - ${String(e)}`);
            return undefined;
        }
    }
}

export default PokedexDb;
