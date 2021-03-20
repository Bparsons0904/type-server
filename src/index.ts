import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./resolvers/UserResolver";
import { ProfileResolver } from "./resolvers/ProfileResolver";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";

(async () => {
  const app = express();
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  if (process.env.DATABASE_URL) {
    await createConnection({
      type: "postgres",
      url: process.env.DATABASE_URL,
      synchronize: true,
      logging: false,
      entities: ["dist/entity/**/*.js"],
      migrations: ["dist/migration/**/*.js"],
      subscribers: ["dist/subscriber/**/*.js"],
      extra: {
        ssl: true,
        rejectUnauthorized: false,
      },
    })
      .then((connection) => {
        console.log(
          `${connection.options.database} database connection has been established successfully.`
        );
      })
      .catch((err) => {
        console.error(`Unable to connect to the database: ${err}`);
      });
  } else {
    await createConnection({
      type: "postgres",
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: false,
      entities: ["dist/entity/**/*.js"],
      migrations: ["dist/migration/**/*.js"],
      subscribers: ["dist/subscriber/**/*.js"],
      extra: {
        ssl: false,
        rejectUnauthorized: true,
      },
    })
      .then((connection) => {
        console.log(
          `${connection.options.database} database connection has been established successfully.`
        );
      })
      .catch((err) => {
        console.error(`Unable to connect to the database: ${err}`);
      });
  }

  // Get active user from header token
  const getMe = async (token: string) => {
    if (token) {
      // Verify token matches secret token
      const secret: any = process.env.SECRET;
      try {
        return await jwt.verify(token, secret);
      } catch (e) {
        throw new AuthenticationError("Your session expired. Sign in again.");
      }
    }

    return;
  };

  // Start instance of ApolloServer
  const server = new ApolloServer({
    introspection: true,
    playground: true,
    schema: await buildSchema({
      resolvers: [UserResolver, ProfileResolver],
    }),
    context: async ({ req, res }) => {
      if (req.body.operationName === "IntrospectionQuery") {
        return {};
      }

      // Set token and get user if exist
      const token: string = req.headers["x-token"] as string;
      const me = await getMe(token);

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
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`Server active on http://localhost:${port}/graphql`);
  });
})();
