import nodemailer from "nodemailer";

export default class Email {
  constructor(email, name) {
    this.to = email;
    this.name = name;
    this.from = `Jim <${process.env.EMAIL_PROVIDER_ADDRESS}>`;
  }

  //Setting the email transportation info
  newTransport() {
    if (process.env.APP_ENV === "production") {
      // Sendgrid
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(subject, message) {
    await this.newTransport().sendMail({
      from: this.from,
      to: this.to,
      subject,
      html: `${message}`,
    });
  }

  async sendWelcome(host, token) {
    // 1) Render HTML based on a pug template
    const html =
      `<h1>Welcome to Blog</h1>` +
      `<h3>Please verify your email below.</h3>` +
      `<a href=${host}/auth/verifyEmail/${token}>Confirm</a>`;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: `Verify Email`,
      html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
}
