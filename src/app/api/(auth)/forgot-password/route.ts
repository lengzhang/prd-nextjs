import { NextRequest, NextResponse } from "next/server";
import type {
  CodeDeliveryDetailsType,
  ForgotPasswordCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient, { cognitoClientId } from "@/utils/cognito/cognitoClient";
import { ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<CodeDeliveryDetailsType | { message: string }>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    if (!email) throw new Error("Email is not found.");

    const forgotPasswordCommandInput: ForgotPasswordCommandInput = {
      ClientId: cognitoClientId,
      Username: email,
    };
    const command = new ForgotPasswordCommand(forgotPasswordCommandInput);
    const response = await cognitoClient.send(command);

    if (!response.CodeDeliveryDetails) {
      throw new Error("Code delivery details not found.");
    }

    return NextResponse.json(response.CodeDeliveryDetails, { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
