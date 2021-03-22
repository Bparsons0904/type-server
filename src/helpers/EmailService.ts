import nodemailer from "nodemailer";

/**
 * Service to handle sending emails
 */
export class EmailService {
  constructor() {}

  static sendEmail(link: string, email: string): void {
    const host: string = process.env.EMAIL_HOST ?? "";
    const portString: string = process.env.EMAIL_PORT ?? "465";
    const port: number = parseInt(portString);
    const secure: boolean = process.env.EMAIL_SECURE === "true" ? true : false;
    const user: string = process.env.EMAIL_USER ?? "";
    const password: string = process.env.EMAIL_PASSWORD ?? "";

    const transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: secure,
      auth: {
        user: user,
        pass: password,
      },
    });

    const mailOptions = {
      from: user,
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
      <p>A request has been made to change the password for ${email}.</p><div><a href="${link}">Reset Password</a></div>`,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
}
