"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        var _a, _b, _c, _d;
        this.host = (_a = process.env.EMAIL_HOST) !== null && _a !== void 0 ? _a : "";
        const portString = (_b = process.env.EMAIL_PORT) !== null && _b !== void 0 ? _b : "465";
        this.port = parseInt(portString);
        this.secure = process.env.EMAIL_SECURE === "true" ? true : false;
        this.user = (_c = process.env.EMAIL_USER) !== null && _c !== void 0 ? _c : "";
        this.password = (_d = process.env.EMAIL_PASSWORD) !== null && _d !== void 0 ? _d : "";
        this.transporter = nodemailer_1.default.createTransport({
            host: this.host,
            port: this.port,
            secure: this.secure,
            auth: {
                user: this.user,
                pass: this.password,
            },
        });
    }
    resetPassword(email, link) {
        const mailOptions = {
            from: this.user,
            to: email,
            subject: "Type-Server Account Recovery",
            html: `
      <style>
        p, a {
          font-size: 14px,
        }
        div {
          width: 250px,
          height: 100px,
          background-color: #3483eb,
          color: #ffffff,
          border-radius: 15px
        }
      </style>
      <p>A request has been made to change the password for ${email}.</p><div><a href="http://localhost:4200/auth/passwordreset/${link}">Reset Password</a></div>`,
        };
        this.transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
    }
}
exports.EmailService = EmailService;
//# sourceMappingURL=EmailService.js.map