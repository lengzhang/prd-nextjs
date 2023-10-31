import { NextRequest, NextResponse } from "next/server";
import type { InitiateAuthCommandInput } from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/aws/cognito";
import {
  AuthFlowType,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { setAuthenticationResultToCookies } from "@/app/api/utils";
import { COGNITO_CLIENT_ID } from "@/utils/aws/constants";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ message: string }>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email) throw new Error("Email is not found.");
    if (!password) throw new Error("Password is not found.");

    const initiateAuthCommandInput: InitiateAuthCommandInput = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: { USERNAME: email, PASSWORD: password },
      ClientId: COGNITO_CLIENT_ID,
    };
    const command = new InitiateAuthCommand(initiateAuthCommandInput);
    const response = await cognitoClient.send(command);

    if (!response.AuthenticationResult) {
      throw new Error("Authentication result is not found.");
    }

    setAuthenticationResultToCookies(response.AuthenticationResult);

    return NextResponse.json({ message: "Sign in success." }, { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
