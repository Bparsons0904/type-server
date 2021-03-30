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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Profile_1 = require("./Profile");
const Product_1 = require("./Product");
let User = class User extends typeorm_1.BaseEntity {
    insertNewUser() {
        return __awaiter(this, void 0, void 0, function* () {
            this.password = yield this.generatePasswordHash(this.password);
            this.username = this.username.toLowerCase();
            this.email = this.email.toLowerCase();
        });
    }
    generatePasswordHash(password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const saltRounds = (_a = process.env.SALT_ROUNDS) !== null && _a !== void 0 ? _a : "15";
            return yield bcrypt_1.default.hash(password, parseInt(saltRounds));
        });
    }
    validatePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, this.password);
        });
    }
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    typeorm_1.Index(),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ unique: true }),
    class_validator_1.Length(6, 30, {
        message: "The username must be at least 6 but not longer than 30 characters",
    }),
    class_validator_1.IsNotEmpty({ message: "Username is required" }),
    typeorm_1.Index(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    typeorm_1.Column({ unique: true }),
    class_validator_1.IsEmail({}, { message: "Incorrect email format" }),
    class_validator_1.IsNotEmpty({ message: "Email is required" }),
    class_validator_1.Length(6, 30, {
        message: "The email must be at least 6 but not longer than 30 characters",
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsNotEmpty({ message: "Password is required" }),
    class_validator_1.Length(8, 30, {
        message: "The password must be at least 8 but not longer than 30 characters",
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", String)
], User.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", String)
], User.prototype, "updatedAt", void 0);
__decorate([
    type_graphql_1.Field(() => Profile_1.Profile, { nullable: true }),
    typeorm_1.OneToOne(() => Profile_1.Profile),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Profile_1.Profile)
], User.prototype, "profile", void 0);
__decorate([
    type_graphql_1.Field(() => Product_1.Product, { nullable: true }),
    typeorm_1.OneToMany(() => Product_1.Product, (product) => product.user),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Array)
], User.prototype, "products", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "insertNewUser", null);
User = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity({ name: "users" })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map