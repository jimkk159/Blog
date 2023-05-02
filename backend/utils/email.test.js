import { afterAll, afterEach, beforeAll, describe, expect } from "vitest";
import Email, { sendWelcomeEmail } from "./email";
import nodemailer from "nodemailer";

vi.mock(nodemailer);

describe("Class:Email", () => {
  let sendMail;
  const testUser = "Test";
  const subject = "TestSubject";
  const message = "TestMessage";
  const testEmail = "test@test.com";
  const host = "TestHost";
  const token = "TestToken";

  beforeAll(() => {
    process.env.EMAIL_HOST = "TEST_HOST";
    process.env.EMAIL_PORT = "TEST_PORT";
    process.env.EMAIL_USERNAME = "TEST_USERNAME";
    process.env.EMAIL_PASSWORD = "TEST_PASSWORD";
    process.env.EMAIL_PROVIDER_ADDRESS = "TEST_ADDRESS";
    sendMail = vi.fn();
    nodemailer.createTransport = vi.fn(() => ({ sendMail }));
  });

  afterEach(() => {
    delete process.env.APP_ENV;
    vi.clearAllMocks();
  });

  afterAll(() => {
    delete process.env.EMAIL_HOST;
    delete process.env.EMAIL_PORT;
    delete process.env.EMAIL_USERNAME;
    delete process.env.EMAIL_PASSWORD;
    delete process.env.EMAIL_PROVIDER_ADDRESS;

    vi.restoreAllMocks();
  });

  test("should has property if email and name provided", () => {
    const email = new Email(testEmail, testUser);

    expect(email.to).toBe(testEmail);
    expect(email.name).toBe(testUser);
    expect(email.from).toBe(`Jim <${process.env.EMAIL_PROVIDER_ADDRESS}>`);
  });

  test("should be called with property if mode in dev", () => {
    const email = new Email(testEmail, testUser);

    email.newTransport();

    expect(nodemailer.createTransport).toHaveBeenLastCalledWith({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  });

  test("should be called with property if mode in prod", () => {
    process.env.APP_ENV = "production";

    const email = new Email(testEmail, testUser);

    email.newTransport();
    expect(nodemailer.createTransport).toHaveBeenLastCalledWith({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_PASSWORD,
      },
    });
  });

  test("should send self-defined email", async () => {
    const email = new Email(testEmail, testUser);

    await email.send(subject, message);

    expect(sendMail).toHaveBeenLastCalledWith({
      from: `Jim <${process.env.EMAIL_PROVIDER_ADDRESS}>`,
      to: testEmail,
      subject: subject,
      html: message,
    });
  });

  test("should send welcome email", async () => {
    const email = new Email(testEmail, testUser);

    await email.sendWelcome(host, token);

    expect(sendMail).toHaveBeenLastCalledWith({
      from: `Jim <${process.env.EMAIL_PROVIDER_ADDRESS}>`,
      to: testEmail,
      subject: `Verify Email`,
      html:
        `<h1>Welcome to Blog</h1>` +
        `<h3>Please verify your email below.</h3>` +
        `<a href=${host}/auth/verifyEmail/${token}>Confirm</a>`,
    });
  });
});
