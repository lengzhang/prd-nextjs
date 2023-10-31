import { NextRequest, NextResponse } from "next/server";
import type {
  CodeDeliveryDetailsType,
  ResendConfirmationCodeCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/aws/cognito";
import { ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { COGNITO_CLIENT_ID } from "@/utils/aws/constants";

/**
 * This method only work for resend sign up confirmation code
 * @param request
 * @returns
 */
export const POST = async (
  request: NextRequest
): Promise<NextResponse<CodeDeliveryDetailsType | { message: string }>> => {
  try {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    if (!email) throw new Error("Email is not found.");

    const resendConfirmationCodeCommandInput: ResendConfirmationCodeCommandInput =
      {
        ClientId: COGNITO_CLIENT_ID,
        Username: email,
      };
    const command = new ResendConfirmationCodeCommand(
      resendConfirmationCodeCommandInput
    );
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
