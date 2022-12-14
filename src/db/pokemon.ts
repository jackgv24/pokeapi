import { DynamoDB } from "aws-sdk";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";
import { Pokemon } from "@interface/index"
import { POKEMON_TABLE } from "@constants/index"
import { Pokemon as PokemonApi } from "pokenode-ts";

class PokemonDb {
    private static db = new DynamoDB.DocumentClient()

    public static async getById(id: number): Promise<Pokemon | undefined> {
        try {
            const params: DocumentClient.GetItemInput = {
                TableName: POKEMON_TABLE,
                Key: {
                    id: `POKEMON_${id}`
                }
            };
            const tableQuery = await this.db.get(params).promise();

            if (!tableQuery.Item) return undefined;
            return tableQuery.Item as Pokemon;
        } catch (e: unknown) {
            console.error(`Pokedex - getById - ${String(e)}`);
            return undefined;
        }
    }

    public static async getByType(type: string): Promise<Pokemon[]> {
        try {
            const params: DocumentClient.ScanInput = {
                TableName : POKEMON_TABLE,
                FilterExpression: "contains(#type, :type)",
                ExpressionAttributeNames: {
                    "#type": "type",
                },
                ExpressionAttributeValues: {
                    ":type": type,
                }
            };
            const tableScan = await this.db.scan(params).promise();
            return tableScan.Items as Pokemon[];
        } catch (e: unknown) {
            console.error(`Pokedex - getByType - ${String(e)}`);
            return [];
        }
    }

    public static async create(pokemon: PokemonApi): Promise< Pokemon | undefined> {
        try {
            const item: Pokemon = {
                ...pokemon,
                id: `POKEMON_${pokemon.id}`,
                type: pokemon.types.map(x => x.type.name).join("_")
            }

            const params: DocumentClient.PutItemInput = {
                TableName: POKEMON_TABLE,
                Item: item,
                ReturnConsumedCapacity: "TOTAL",
            }
            const result = await this.db.put(params).promise();
            console.log(result);
            return item;
        } catch (e) {
            console.error(`Pokedex - getByType - ${String(e)}`);
            return undefined;
        }
    }
}

export default PokemonDb;
