import * as s3 from "../aws/s3";
import { v4 as uuidv4 } from "uuid";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

vi.mock("uuid");
vi.mock("@aws-sdk/client-s3", () => ({
  S3Client: vi.fn().mockImplementation(() => ({ send: vi.fn() })),
}));
vi.stubEnv("AWS_BUCKET_NAME", "test_aws_bucket");
describe("uploadToS3()", () => {
  let file;
  beforeAll(() => {
    file = { buffer: "testBuffer", mimetype: "image/png" };
    uuidv4.mockImplementation(() => "uuidv4");
    PutObjectCommand = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should input params to the PutObjectCommand", async () => {
    const uploadObjParams = {
      Bucket: "test_aws_bucket",
      Body: file.buffer,
      Key: "uuidv4.png",
      ContentType: file.mimetype,
    };

    await s3.uploadToS3(file);

    expect(PutObjectCommand).toHaveBeenLastCalledWith(uploadObjParams);
  });

  test("should generate a uuidName for the image file", async () => {
    const result = await s3.uploadToS3(file);

    expect(result).toBe("uuidv4.png");
  });
});

describe("deleteFileFromS3()", () => {
  let send;
  beforeAll(() => {
    send = vi.fn();
    DeleteObjectCommand = vi.fn();
    // S3Client.mockImplementation(() => ({ send }));
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test("should input params to the GetObjectCommand", async () => {
    const fileName = "testFileName";
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
    };

    await s3.deleteFileFromS3(fileName);

    expect(DeleteObjectCommand).toHaveBeenLastCalledWith(params);
  });

//   test("should send the DeleteObjectCommand", async () => {
//     const fileName = "testFileName";
//     DeleteObjectCommand.mockImplementationOnce(() => "deleteCommand");

//     await s3.deleteFileFromS3(fileName);

//     expect(send).toHaveBeenLastCalledWith("deleteCommand");
//   });
});
