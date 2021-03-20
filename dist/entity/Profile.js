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
exports.Profile = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let Profile = class Profile extends typeorm_1.BaseEntity {
};
__decorate([
    type_graphql_1.Field(),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    typeorm_1.Index(),
    __metadata("design:type", String)
], Profile.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    class_validator_1.Length(2, 30, {
        message: "First name must be at least 2 but not longer than 30 characters",
    }),
    class_validator_1.IsNotEmpty({ message: "First name is required" }),
    __metadata("design:type", String)
], Profile.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    class_validator_1.Length(2, 30, {
        message: "Last name must be at least 2 but not longer than 30 characters",
    }),
    class_validator_1.IsNotEmpty({ message: "Last name is required" }),
    __metadata("design:type", String)
], Profile.prototype, "lastName", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({ message: "Email is required" }),
    class_validator_1.IsEmail({}, { message: "Incorrect email format" }),
    class_validator_1.Length(8, 30, {
        message: "Email must be at least 8 but not longer than 30 characters",
    }),
    __metadata("design:type", String)
], Profile.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ type: "float" }),
    __metadata("design:type", Number)
], Profile.prototype, "phone", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({ message: "Title is required" }),
    __metadata("design:type", String)
], Profile.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Profile.prototype, "image", void 0);
__decorate([
    type_graphql_1.Field(),
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Profile.prototype, "role", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Profile.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], Profile.prototype, "updatedAt", void 0);
Profile = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity({ name: "profiles" })
], Profile);
exports.Profile = Profile;
//# sourceMappingURL=Profile.js.map