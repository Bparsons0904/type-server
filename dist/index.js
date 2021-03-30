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
const path_1 = __importDefault(require("path"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const UserResolver_1 = require("./resolvers/UserResolver");
const ProfileResolver_1 = require("./resolvers/ProfileResolver");
const ProductResolver_1 = require("./resolvers/ProductResolver");
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const app = express_1.default();
    app.use(cors_1.default({
        origin: true,
        credentials: true,
    }));
    const database_sync = process.env.DATABASE_SYNC == "true" ? true : false;
    const database_ssl = process.env.DATABASE_SSL == "true" ? true : false;
    const database_unauth = process.env.DATABASE_UNAUTH == "true" ? true : false;
    yield typeorm_1.createConnection({
        type: "postgres",
        url: process.env.DATABASE_URL,
        synchronize: database_sync,
        logging: false,
        entities: [path_1.default.join(__dirname, "entities", "*.js")],
        extra: {
            ssl: database_ssl,
            rejectUnauthorized: database_unauth,
        },
    })
        .then((connection) => {
        console.log(`${connection.options.type} database connection has been established successfully.`);
    })
        .catch((err) => {
        console.error(`Unable to connect to the database: ${err}`);
    });
    const getMe = (token) => __awaiter(void 0, void 0, void 0, function* () {
        if (token) {
            const secret = process.env.SECRET;
            try {
                return (yield jsonwebtoken_1.default.verify(token, secret));
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
            resolvers: [UserResolver_1.UserResolver, ProfileResolver_1.ProfileResolver, ProductResolver_1.ProductResolver],
            emitSchemaFile: path_1.default.resolve(__dirname, "schema.gql"),
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
    const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
    app.listen(port, () => {
        console.log(`Server active on http://localhost:${port}/graphql`);
    });
}))();
//# sourceMappingURL=index.js.map