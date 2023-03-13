import nodemailer from "nodemailer";

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.nae = user.name;
    this.url = url;
    this.from = `Jim <${1234}>`;
  }

  //Setting the email transportation info
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return;
      //   return nodemailer.createTransport({
      //     service: "SendGrid",
      //     auth: {
      //       user: process.env.SENDGRID_USERNAME,
      //       pass: process.env.SENDGRID_PASSWORD,
      //     },
      //   });
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
    // 1) Render HTML based on a pug template
    const html = `${message}`;

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome(message) {
    await this.send("Welcome", message);
  }
}
