import type { AWS } from '@serverless/typescript';
import { POKEMON_LIST_TABLE, POKEMON_TABLE } from "@constants/index";
import { fnSync, fnPokemonListByType, fnPokemonNameById, fnPokedex } from '@functions/pokedex';

const serverlessConfiguration: AWS = {
  service: 'pokedex',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: "*",
          }
        ]
      }
    }
  },
  functions: { fnSync, fnPokemonListByType, fnPokemonNameById, fnPokedex },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  resources: {
    Resources: {
      PokemonListTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "N",
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 1,
          },
          TableName: POKEMON_LIST_TABLE,
        },
      },
      PokemonTable: {
        Type: "AWS::DynamoDB::Table",
        DeletionPolicy: "Retain",
        Properties: {
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "N",
            }
          ],
          KeySchema: [
            {
              AttributeName: "id",
              KeyType: "HASH",
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 1,
          },
          TableName: POKEMON_TABLE,
        },
      },
    },
  }
};

module.exports = serverlessConfiguration;
