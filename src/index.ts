import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import path from "path";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { UserResolver } from "./resolvers/UserResolver";
import { ProfileResolver } from "./resolvers/ProfileResolver";
import { ProductResolver } from "./resolvers/ProductResolver";

(async () => {
  const app: express.Application = express();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  const database_sync: boolean =
    process.env.DATABASE_SYNC == "true" ? true : false;
  const database_ssl: boolean =
    process.env.DATABASE_SSL == "true" ? true : false;
  const database_unauth: boolean =
    process.env.DATABASE_UNAUTH == "true" ? true : false;

  await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: database_sync,
    logging: false,
    entities: [__dirname + "/entities/*.js"],
    extra: {
      ssl: database_ssl,
      rejectUnauthorized: database_unauth,
    },
  })
    .then((connection) => {
      console.log(
        `${connection.options.type} database connection has been established successfully.`
      );
    })
    .catch((err) => {
      console.error(`Unable to connect to the database: ${err}`);
    });

  // Get active user from header token
  const getMe = async (token: string): Promise<string | undefined> => {
    if (token) {
      // Verify token matches secret token
      const secret: string = process.env.SECRET as string;
      try {
        return (await jwt.verify(token, secret)) as string;
      } catch (e) {
        throw new AuthenticationError("Your session expired. Sign in again.");
      }
    }

    return;
  };

  // Start instance of ApolloServer
  const server: ApolloServer = new ApolloServer({
    introspection: true,
    playground: true,
    schema: await buildSchema({
      resolvers: [UserResolver, ProfileResolver, ProductResolver],
      emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    }),
    context: async ({ req, res }) => {
      if (req.body.operationName === "IntrospectionQuery") {
        return {};
      }

      // Set token and get user if exist
      const token: string = req.headers["x-token"] as string;
      const me: string | undefined = await getMe(token);

      return {
        req,
        res,
        me,
        token,
      };
    },
  });

  server.applyMiddleware({ app, cors: false });

  // Set port and listen for incoming
  const port = process.env.PORT ?? 8000;
  app.listen(port, () => {
    console.log(`Server active on http://localhost:${port}/graphql`);
  });
})();
