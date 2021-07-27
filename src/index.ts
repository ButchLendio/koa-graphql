import { ApolloServer } from "apollo-server-koa";
import Koa from "koa";
import { MongooseService } from "./config/mongo";
import { typeDefs } from "./schemas/typeDefs";
import { resolvers } from "./resolvers/resolver";
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { getDirectives, MapperKind, mapSchema } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server-errors';
import { Context } from 'koa';

function privateDirectiveTransformer(schema: GraphQLSchema) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  const directiveName = 'private';

  return mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const typeDirectives = getDirectives(schema, type);
      typeDirectiveArgumentMaps[type.name] = typeDirectives[directiveName];

      return undefined;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const fieldDirectives = getDirectives(schema, fieldConfig);
      const directiveArgumentMap =
        fieldDirectives[directiveName] ?? typeDirectiveArgumentMaps[typeName];

      if (directiveArgumentMap) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info,
        ) {
          const [type, token] = context.get('Authorization').split(' ');

          if (!type || type.toLowerCase() !== 'bearer' || !token) {
            throw new AuthenticationError('Invalid authentication header.');
          }

          // Verify token and retrieve user information
          // Add user in context

          const user = { id: 'userId' };

          return resolve(
            source,
            args,
            {
              ...context,
              user,
            },
            info,
          );
        };

        return fieldConfig;
      }
    },
  });
}


const app = new Koa();

const server = new ApolloServer({ typeDefs, resolvers });

async function Connect() {
  const connect = MongooseService();
  return connect;
}

export const SERVER = async () => {

  await server.start();
  server.applyMiddleware({ app });
};

const port = process.env.PORT || 8000;

export const startServer = app.listen(port, async () => {
    await Connect();

    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });

SERVER();
