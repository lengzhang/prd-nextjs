import { cookies } from "next/headers";
import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

export const setAuthenticationResultToCookies = (
  result: AuthenticationResultType
) => {
  cookies().set("accessToken", result.AccessToken || "");
  cookies().set("expiresIn", result.ExpiresIn?.toString() || "");
  cookies().set("refreshToken", result.RefreshToken || "");
  cookies().set("idToken", result.IdToken || "");
};

export const deleteAuthenticationResultFromCookies = () => {
  cookies().delete("accessToken");
  cookies().delete("expiresIn");
  cookies().delete("refreshToken");
  cookies().delete("idToken");
};
