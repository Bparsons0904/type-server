"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth_1 = require("../middleware/isAuth");
const isAdmin_1 = require("../middleware/isAdmin");
const types_1 = require("../types");
const createToken = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id, email, username } = user;
    const secret = (_a = process.env.SECRET) !== null && _a !== void 0 ? _a : "";
    const days = (_b = process.env.TOKEN_DAYS) !== null && _b !== void 0 ? _b : "90";
    const expiresIn = `${days} days`;
    const token = yield jsonwebtoken_1.default.sign({ id, email, username }, secret, {
        expiresIn,
    });
    return token;
});
let UserResolver = class UserResolver {
    getMe({ me }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ id: me.id }, { relations: ["profile"] });
            if (user) {
                return user;
            }
            throw new Error("Unable to retrieve user");
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.User.find({
                select: ["username", "email"],
            });
            if ((users === null || users === void 0 ? void 0 : users.length) > 0) {
                return users;
            }
            throw new Error("No users were found");
        });
    }
    createUser(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.create({ username, email, password }).save();
            const token = yield createToken(user);
            return { token, user };
        });
    }
    loginUser(login, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield User_1.User.findOne({ username: login }, { relations: ["profile"] });
            if (!user) {
                user = yield User_1.User.findOne({ email: login }, { relations: ["profile"] });
            }
            if (!user) {
                throw new Error("Invalid username or email");
            }
            const isValid = yield user.validatePassword(password);
            if (!isValid) {
                throw new Error("Invalid password.");
            }
            const token = yield createToken(user);
            return { user, token };
        });
    }
    hello() {
        return "Hello World!";
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Query(() => User_1.User, { nullable: true }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getMe", null);
__decorate([
    type_graphql_1.UseMiddleware(isAdmin_1.isAdmin),
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "getUsers", null);
__decorate([
    type_graphql_1.UseMiddleware(isAdmin_1.isAdmin),
    type_graphql_1.Mutation(() => types_1.UserLogin),
    __param(0, type_graphql_1.Arg("username")),
    __param(1, type_graphql_1.Arg("email")),
    __param(2, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "createUser", null);
__decorate([
    type_graphql_1.UseMiddleware(isAdmin_1.isAdmin),
    type_graphql_1.Mutation(() => types_1.UserLogin),
    __param(0, type_graphql_1.Arg("login")),
    __param(1, type_graphql_1.Arg("password")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "loginUser", null);
__decorate([
    type_graphql_1.Query(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=UserResolver.js.map