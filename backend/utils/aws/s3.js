import dotenv from "dotenv";
dotenv.config();

import { v4 as uuidv4 } from "uuid";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/jfif": "jfif",
  "image/gif": "gif",
};

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRECT_ACCESS_KEY,
  },
  region: process.env.AWS_BUCKET_REGION,
});

// upload file to S3
export async function uploadToS3(file) {
  const uuidName = uuidv4() + "." + MIME_TYPE_MAP[file.mimetype];

  const uploadObjParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: file.buffer,
    Key: uuidName,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadObjParams);
  await s3.send(command);

  return uuidName;
}

// get file from S3
export async function getFileFromS3(fileName) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  const command = new GetObjectCommand(params);
  // const url = await getSignedUrl(s3, command, { expiresIn: 2 * 24 * 60 * 60 });
  const url = await getSignedUrl(s3, command, { expiresIn: 2 * 24 * 60 * 60 });

  return url;
}

// delete file from S3
export async function deleteFileFromS3(fileName) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  const command = new DeleteObjectCommand(params);
  await s3.send(command);
}
