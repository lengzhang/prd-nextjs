import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import type {
  GetUserCommandInput,
  GetUserCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

import cognitoClient from "@/utils/cognito/cognitoClient";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { UserInfo } from "@/app/types";
import { deleteAuthenticationResultFromCookies } from "../../utils";

export const GET = async (): Promise<
  NextResponse<UserInfo | { message: string }>
> => {
  try {
    const accessToken = cookies().get("accessToken");
    if (!accessToken || !accessToken.value) {
      throw new Error("Access token is not found");
    }

    const getUserCommandInput: GetUserCommandInput = {
      AccessToken: accessToken.value,
    };
    const command = new GetUserCommand(getUserCommandInput);
    const response = await cognitoClient.send(command);

    return NextResponse.json(parseUserInfo(response), { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    if (errorMsg === "Access Token has expired") {
      deleteAuthenticationResultFromCookies();
    }
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};

const parseUserInfo = (data: GetUserCommandOutput): UserInfo => {
  const userAttributes =
    data.UserAttributes?.reduce<Record<string, string | undefined>>(
      (acc, { Name, Value }) => {
        if (Name) acc[Name] = Value;
        return acc;
      },
      {}
    ) || {};
  return {
    id: data.Username || "",
    email: userAttributes.email || "",
    emailVerified: Boolean(userAttributes.email_verified),
    username: userAttributes.preferred_username || "",
    updatedAt: parseInt(userAttributes.updated_at || "") || null,
    createdAt: parseInt(userAttributes["custom:created_at"] || "") || null,
  };
};
