import {
  CognitoIdentityCredentialProvider,
  fromCognitoIdentityPool,
} from "@aws-sdk/credential-providers";
import {
  AWS_REGION,
  COGNITO_IDENTITY_POOL_ID,
  COGNITO_USER_POOL_ID,
} from "../constants";
import { cookies } from "next/headers";

const loginUserPoolId = `cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
export const getCognitoIdentityCredentialProvider = () => {
  const idToken = cookies().get("idToken")?.value || "";
  const cognitoIdentityCredentialProvider: CognitoIdentityCredentialProvider =
    fromCognitoIdentityPool({
      clientConfig: { region: AWS_REGION },
      identityPoolId: COGNITO_IDENTITY_POOL_ID,
      logins: { [loginUserPoolId]: idToken },
    });
  return cognitoIdentityCredentialProvider;
};
