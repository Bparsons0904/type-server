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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = void 0;
const User_1 = require("./../entities/User");
const isAdmin = ({ context }, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!(context === null || context === void 0 ? void 0 : context.me)) {
        throw new Error("No Admin Token Provided");
    }
    const user = yield User_1.User.findOne({ id: context.me.id }, { relations: ["profile"] });
    console.log((_a = user === null || user === void 0 ? void 0 : user.profile) === null || _a === void 0 ? void 0 : _a.role);
    if ((user === null || user === void 0 ? void 0 : user.profile.role) !== "admin") {
        throw new Error("Not an admin");
    }
    return next();
});
exports.isAdmin = isAdmin;
//# sourceMappingURL=isAdmin.js.map