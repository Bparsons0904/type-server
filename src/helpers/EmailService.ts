import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import Mail from "nodemailer/lib/mailer";

/**
 * Service to handle sending emails
 */
export class EmailService {
  private port: number;
  private host: string;
  private secure: boolean;
  private user: string;
  private password: string;
  private base: string;
  private transporter: Mail;

  constructor() {
    const portString: string = process.env.EMAIL_PORT ?? "465";
    this.port = parseInt(portString);
    this.host = process.env.EMAIL_HOST ?? "";
    this.secure = process.env.EMAIL_SECURE === "true" ? true : false;
    this.user = process.env.EMAIL_USER ?? "";
    this.password = process.env.EMAIL_PASSWORD ?? "";
    this.base = process.env.EMAIL_BASE ?? "";

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

  /**
   *  Send an email to complete the user registration process
   * @param email Email to send registration email to
   * @param link The return link to redirect the user back to complete registration
   */
  public registration(email: string, link: string): void {
    const mailOptions: MailOptions = {
      from: this.user,
      to: email,
      subject: "Power Sports Menu Account Registration",
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
      <p>A request has been made to create an account using: ${email}. 
      To complete the registration process, please <a href="${this.base}/auth/register/${link}">click here.</a></p>
      </br>
      <div>Thank you for using Power Sports Menu</div>`,
    };

    this.sendMail(mailOptions);
  }

  /**
   *  Send an email to complete the account password recovery
   * @param email Email to send password reset email to
   * @param link The return link to redirect the user to reset the password
   */
  public resetPassword(email: string, link: string): void {
    const mailOptions: MailOptions = {
      from: this.user,
      to: email,
      subject: "Power Sports Menu Account Recovery",
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
      <p>A request has been made to change the password for ${email}.</p><div><a href="${this.base}/auth/passwordreset/${link}">Reset Password</a></div>`,
    };

    this.sendMail(mailOptions);
  }

  private sendMail(mailOptions: MailOptions): void {
    this.transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
