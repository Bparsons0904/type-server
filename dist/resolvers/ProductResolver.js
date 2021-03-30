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
exports.ProductResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Product_1 = require("../entities/Product");
const User_1 = require("../entities/User");
const isAuth_1 = require("../middleware/isAuth");
const types_1 = require("../helpers/types");
let ProductResolver = class ProductResolver {
    getProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = (yield Product_1.Product.findOne({ id }));
            if (!product)
                throw new Error("Unable to find product.");
            return product;
        });
    }
    getProducts({ me }) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield Product_1.Product.find({
                relations: ["user"],
                where: { user: me.id },
            });
            if (!products)
                throw new Error("Unable to find any products.");
            return products;
        });
    }
    createProduct(createProduct, { me }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield User_1.User.findOne({ id: me.id }));
            if (!user)
                throw new Error("Unable to find user.");
            createProduct.user = user;
            const product = yield Product_1.Product.create(createProduct).save();
            const products = yield Product_1.Product.find({
                relations: ["user"],
                where: { user: me.id },
            });
            if (!product || !products)
                throw new Error("Unable to retrieve user or create profile");
            return products;
        });
    }
    deleteProduct(id, { me }) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id);
            const product = (yield Product_1.Product.findOne({
                where: { id },
                relations: ["user"],
            }));
            console.log("Post product", product);
            if (!product)
                throw new Error("Unable to find product.");
            if (product.user.id !== me.id)
                throw new Error("User can not delete this product");
            try {
                yield product.remove();
            }
            catch (error) {
                throw new Error("Error trying to remove product");
            }
            return true;
        });
    }
    profiles() {
        return Product_1.Product.find();
    }
};
__decorate([
    type_graphql_1.Query(() => Product_1.Product),
    __param(0, type_graphql_1.Arg("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProduct", null);
__decorate([
    type_graphql_1.Query(() => [Product_1.Product]),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "getProducts", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => [Product_1.Product]),
    __param(0, type_graphql_1.Arg("createProduct", () => types_1.ProductInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.ProductInput, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "createProduct", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("id")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductResolver.prototype, "deleteProduct", null);
__decorate([
    type_graphql_1.Query(() => [Product_1.Product]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductResolver.prototype, "profiles", null);
ProductResolver = __decorate([
    type_graphql_1.Resolver()
], ProductResolver);
exports.ProductResolver = ProductResolver;
//# sourceMappingURL=ProductResolver.js.map