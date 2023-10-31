/**
 * API Reference: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cognito-identity-provider/
 */

import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_REGION } from "@/utils/aws/constants";

const cognitoClient = new CognitoIdentityProvider({
  region: AWS_REGION,
});

export default cognitoClient;
