import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getCognitoIdentityCredentialProvider } from "@/utils/aws/credential-provider";
import { AWS_REGION, REPORT_BUCKET_NAME } from "@/utils/aws/constants";

export const getS3Client = () => {
  const cognitoIdentityCredentialProvider =
    getCognitoIdentityCredentialProvider();
  const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: cognitoIdentityCredentialProvider,
  });
  return s3Client;
};

export const getSignedUrlFromKey = async (s3Client: S3Client, key: string) => {
  const command = new GetObjectCommand({
    Bucket: REPORT_BUCKET_NAME,
    Key: key,
  });
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });
  return signedUrl;
};
