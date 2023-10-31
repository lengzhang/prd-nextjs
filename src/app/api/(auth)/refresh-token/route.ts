import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type {
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/aws/cognito";
import {
  AuthFlowType,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { setAuthenticationResultToCookies } from "@/app/api/utils";
import { COGNITO_CLIENT_ID } from "@/utils/aws/constants";

export const processRefreshToken = async () => {
  const refreshToken = cookies().get("refreshToken");
  if (!refreshToken || !refreshToken.value) {
    throw new Error("Refresh token is not found");
  }

  const initiateAuthCommandInput: InitiateAuthCommandInput = {
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    AuthParameters: { REFRESH_TOKEN: refreshToken.value },
    ClientId: COGNITO_CLIENT_ID,
  };
  const command = new InitiateAuthCommand(initiateAuthCommandInput);
  const response: InitiateAuthCommandOutput = await cognitoClient.send(command);

  if (!response.AuthenticationResult) {
    throw new Error("Authentication result is not found.");
  }

  setAuthenticationResultToCookies({
    ...response.AuthenticationResult,
    RefreshToken: refreshToken.value,
  });
};

export const GET = async (): Promise<NextResponse<{ message: string }>> => {
  try {
    await processRefreshToken();
    return NextResponse.json(
      { message: "Refresh token success." },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
