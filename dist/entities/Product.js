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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const User_1 = require("../entities/User");
let Product = class Product extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    typeorm_1.Index(),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({ message: "Title is required" }),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({ message: "Description is required" }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    typeorm_1.Column({ type: "float" }),
    class_validator_1.IsNotEmpty({ message: "Cost is required" }),
    __metadata("design:type", Number)
], Product.prototype, "cost", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ default: null, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ default: null, nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "video", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    typeorm_1.ManyToOne(() => User_1.User, (user) => user.products),
    typeorm_1.JoinColumn(),
    __metadata("design:type", User_1.User)
], Product.prototype, "user", void 0);
Product = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity({ name: "products" })
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map