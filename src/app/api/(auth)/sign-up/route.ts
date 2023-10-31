import { NextRequest, NextResponse } from "next/server";
import type {
  SignUpCommandInput,
  SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/aws/cognito";
import {
  AttributeType,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { COGNITO_CLIENT_ID } from "@/utils/aws/constants";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<SignUpCommandOutput | { message: string }>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    if (!email) throw new Error("Email is not found.");
    if (!password) throw new Error("Password is not found.");
    if (!username) throw new Error("Username is not found.");

    const now = Date.now().toString();

    const userAttributes: AttributeType[] = [
      { Name: "preferred_username", Value: username },
      { Name: "updated_at", Value: now },
      { Name: "custom:created_at", Value: now },
    ];

    const signUpCommandInput: SignUpCommandInput = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: userAttributes,
    };
    const command = new SignUpCommand(signUpCommandInput);
    const response = await cognitoClient.send(command);

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
