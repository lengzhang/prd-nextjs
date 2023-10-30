import { NextRequest, NextResponse } from "next/server";
import type { ConfirmForgotPasswordCommandInput } from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient, { cognitoClientId } from "@/utils/cognito/cognitoClient";
import { ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { deleteAuthenticationResultFromCookies } from "@/app/api/utils";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ message: string }>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmationCode = formData.get("confirmationCode") as string;
    if (!email) throw new Error("Email is not found.");
    if (!password) throw new Error("Password is not found.");
    if (!confirmationCode) throw new Error("Confirmation code is not found.");

    const confirmForgotPasswordCommandInput: ConfirmForgotPasswordCommandInput =
      {
        ClientId: cognitoClientId,
        Username: email,
        Password: password,
        ConfirmationCode: confirmationCode,
      };
    const command = new ConfirmForgotPasswordCommand(
      confirmForgotPasswordCommandInput
    );
    await cognitoClient.send(command);

    deleteAuthenticationResultFromCookies();

    return NextResponse.json(
      { message: "Reset password is confirmed." },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
