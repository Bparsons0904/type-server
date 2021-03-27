import nodemailer from "nodemailer";

/**
 * Service to handle sending emails
 */
export class EmailService {
  private host: string;
  private port: number;
  private secure: boolean;
  private user: string;
  private password: string;

  private transporter;

  constructor() {
    this.host = process.env.EMAIL_HOST ?? "";
    const portString: string = process.env.EMAIL_PORT ?? "465";
    this.port = parseInt(portString);
    this.secure = process.env.EMAIL_SECURE === "true" ? true : false;
    this.user = process.env.EMAIL_USER ?? "";
    this.password = process.env.EMAIL_PASSWORD ?? "";

    this.transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.secure,
      auth: {
        user: this.user,
        pass: this.password,
      },
    });
  }

  public resetPassword(email: string, link: string): void {
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
      <p>A request has been made to change the password for ${email}.</p><div><a href="http://localhost:4200/user/passwordreset/${link}">Reset Password</a></div>`,
    };

    this.transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
