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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Movie_1 = require("../entity/Movie");
let MovieInput = class MovieInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], MovieInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], MovieInput.prototype, "minutes", void 0);
MovieInput = __decorate([
    type_graphql_1.InputType()
], MovieInput);
let MovieUpdateInput = class MovieUpdateInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], MovieUpdateInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], MovieUpdateInput.prototype, "minutes", void 0);
MovieUpdateInput = __decorate([
    type_graphql_1.InputType()
], MovieUpdateInput);
let MovieResolver = class MovieResolver {
    createMovie(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield Movie_1.Movie.create(options).save();
            return movie;
        });
    }
    updateMovie(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Movie_1.Movie.update({ id }, input);
            return true;
        });
    }
    deleteMovie(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Movie_1.Movie.delete({ id });
            return true;
        });
    }
    movies() {
        return Movie_1.Movie.find();
    }
};
__decorate([
    type_graphql_1.Mutation(() => Movie_1.Movie),
    __param(0, type_graphql_1.Arg("options", () => MovieInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MovieInput]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "createMovie", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __param(1, type_graphql_1.Arg("input", () => MovieUpdateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, MovieUpdateInput]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "updateMovie", null);
__decorate([
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id", () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MovieResolver.prototype, "deleteMovie", null);
__decorate([
    type_graphql_1.Query(() => [Movie_1.Movie]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MovieResolver.prototype, "movies", null);
MovieResolver = __decorate([
    type_graphql_1.Resolver()
], MovieResolver);
exports.MovieResolver = MovieResolver;
//# sourceMappingURL=MovieResolver.js.map