import { ApolloServer, gql } from "apollo-server-koa";
import Koa from "koa";
import {MongooseService} from "./config/mongo"

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;
const resolvers = {
  Query: {
    books: () => books,
  },
};
(async () => {
  const app = new Koa();

  const server = new ApolloServer({ typeDefs, resolvers });

  async function Connect(){
    const connect = MongooseService()
    return connect
 } 

  await server.start();
  server.applyMiddleware({ app });

  const port = process.env.PORT || 5000;

  app.listen(port, async () => {
    await Connect()

    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
  return { server, app };
})();
