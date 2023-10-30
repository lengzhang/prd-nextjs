/**
 * API Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/
 */

import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProvider({
  region: process.env.REGION || "",
});

export const cognitoUserPoolId = process.env.COGNITO_USER_POOL_ID || "";
export const cognitoClientId = process.env.COGNITO_APP_CLIENT_ID || "";
export default cognitoClient;
