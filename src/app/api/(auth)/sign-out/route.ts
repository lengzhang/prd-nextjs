import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { GlobalSignOutCommandInput } from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/aws/cognito";
import { GlobalSignOutCommand } from "@aws-sdk/client-cognito-identity-provider";
import { deleteAuthenticationResultFromCookies } from "@/app/api/utils";

export const GET = async (): Promise<NextResponse<{ message: string }>> => {
  try {
    const accessToken = cookies().get("accessToken");
    if (!accessToken || !accessToken.value) {
      throw new Error("Access token is not found");
    }

    const globalSignOutCommandInput: GlobalSignOutCommandInput = {
      AccessToken: accessToken.value,
    };
    const command = new GlobalSignOutCommand(globalSignOutCommandInput);
    await cognitoClient.send(command);

    deleteAuthenticationResultFromCookies();

    return NextResponse.json({ message: "Sign out success." }, { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
