export const AWS_REGION = process.env.AWS_REGION || "";

export const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "";
export const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID || "";
export const COGNITO_IDENTITY_POOL_ID =
  process.env.COGNITO_IDENTITY_POOL_ID || "";

export const REPORT_BUCKET_NAME = `${process.env.VERCEL_ENV?.slice(0, 3)}-${
  process.env.REPORT_BUCKET_NAME
}`;
