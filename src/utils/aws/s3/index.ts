import { S3Client } from "@aws-sdk/client-s3";
import { getCognitoIdentityCredentialProvider } from "../credential-provider";
import { AWS_REGION } from "../constants";

export const getS3Client = () => {
  const cognitoIdentityCredentialProvider =
    getCognitoIdentityCredentialProvider();
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: cognitoIdentityCredentialProvider,
  });
  return s3Client;
};
