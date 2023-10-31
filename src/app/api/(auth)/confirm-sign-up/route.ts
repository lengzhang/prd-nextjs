import { NextRequest, NextResponse } from "next/server";
import type { ConfirmSignUpCommandInput } from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/aws/cognito";
import { ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { deleteAuthenticationResultFromCookies } from "@/app/api/utils";
import { COGNITO_CLIENT_ID } from "@/utils/aws/constants";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<{ message: string }>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const confirmationCode = formData.get("confirmationCode") as string;
    if (!email) throw new Error("Email is not found.");
    if (!confirmationCode) throw new Error("Confirmation code is not found.");

    const confirmSignUpCommandInput: ConfirmSignUpCommandInput = {
      ClientId: COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode,
    };
    const command = new ConfirmSignUpCommand(confirmSignUpCommandInput);
    await cognitoClient.send(command);

    deleteAuthenticationResultFromCookies();

    return NextResponse.json(
      { message: "Account is confirmed." },
      { status: 200 }
    );
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
