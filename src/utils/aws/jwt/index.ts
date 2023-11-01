import { CognitoJwtVerifier } from "aws-jwt-verify";
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from "../constants";

export const idTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  clientId: COGNITO_CLIENT_ID,
  tokenUse: "id",
});

export const accessTokenVerifier = CognitoJwtVerifier.create({
  userPoolId: COGNITO_USER_POOL_ID,
  clientId: COGNITO_CLIENT_ID,
  tokenUse: "access",
});
