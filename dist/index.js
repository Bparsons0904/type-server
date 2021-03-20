"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const UserResolver_1 = require("./resolvers/UserResolver");
const ProfileResolver_1 = require("./resolvers/ProfileResolver");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = express_1.default();
    app.use(cors_1.default({
        origin: true,
        credentials: true,
    }));
    if (process.env.DATABASE_URL) {
        yield typeorm_1.createConnection({
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
            console.log(`${connection.options.database} database connection has been established successfully.`);
        })
            .catch((err) => {
            console.error(`Unable to connect to the database: ${err}`);
        });
    }
    else {
        yield typeorm_1.createConnection({
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
            console.log(`${connection.options.database} database connection has been established successfully.`);
        })
            .catch((err) => {
            console.error(`Unable to connect to the database: ${err}`);
        });
    }
    const getMe = (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (token) {
            const secret = process.env.SECRET;
            try {
                return yield jsonwebtoken_1.default.verify(token, secret);
            }
            catch (e) {
                throw new apollo_server_express_1.AuthenticationError("Your session expired. Sign in again.");
            }
        }
        return;
    });
    const server = new apollo_server_express_1.ApolloServer({
        introspection: true,
        playground: true,
        schema: yield type_graphql_1.buildSchema({
            resolvers: [UserResolver_1.UserResolver, ProfileResolver_1.ProfileResolver],
        }),
        context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () {
            if (req.body.operationName === "IntrospectionQuery") {
                return {};
            }
            const token = req.headers["x-token"];
            const me = yield getMe(token);
            return {
                req,
                res,
                me,
                token,
            };
        }),
    });
    server.applyMiddleware({ app, cors: false });
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
        console.log(`Server active on http://localhost:${port}/graphql`);
    });
}))();
//# sourceMappingURL=index.js.map