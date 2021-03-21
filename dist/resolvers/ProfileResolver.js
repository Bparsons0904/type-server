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
exports.ProfileResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Profile_1 = require("../entities/Profile");
const User_1 = require("../entities/User");
const isAuth_1 = require("../middleware/isAuth");
let ProfileInput = class ProfileInput {
};
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ProfileInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "firstName", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "lastName", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], ProfileInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ProfileInput.prototype, "image", void 0);
__decorate([
    type_graphql_1.Field({ nullable: true }),
    __metadata("design:type", String)
], ProfileInput.prototype, "role", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], ProfileInput.prototype, "phone", void 0);
ProfileInput = __decorate([
    type_graphql_1.InputType()
], ProfileInput);
let ProfileResolver = class ProfileResolver {
    createProfile(createProfile, { me }) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield Profile_1.Profile.create(createProfile).save();
            const user = yield User_1.User.findOne({ id: me.id });
            if (user) {
                user.profile = profile;
                yield User_1.User.save(user);
                return true;
            }
            throw new Error("Unable to retrieve user or create profile");
        });
    }
    updateProfile(updateProfile) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = yield Profile_1.Profile.findOne({
                id: updateProfile.id,
            });
            if (!profile) {
                return Error("Profile not found");
            }
            yield Profile_1.Profile.update({ id: profile.id }, updateProfile);
            return true;
        });
    }
    profiles() {
        return Profile_1.Profile.find();
    }
};
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("createProfile", () => ProfileInput)),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProfileInput, Object]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "createProfile", null);
__decorate([
    type_graphql_1.UseMiddleware(isAuth_1.isAuth),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("updateProfile", () => ProfileInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ProfileInput]),
    __metadata("design:returntype", Promise)
], ProfileResolver.prototype, "updateProfile", null);
__decorate([
    type_graphql_1.Query(() => [Profile_1.Profile]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfileResolver.prototype, "profiles", null);
ProfileResolver = __decorate([
    type_graphql_1.Resolver()
], ProfileResolver);
exports.ProfileResolver = ProfileResolver;
//# sourceMappingURL=ProfileResolver.js.map