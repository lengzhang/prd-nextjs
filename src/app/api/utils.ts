import { cookies } from "next/headers";
import { AuthenticationResultType } from "@aws-sdk/client-cognito-identity-provider";

export const setAuthenticationResultToCookies = (
  result: AuthenticationResultType
) => {
  const expiresIn = (result.ExpiresIn || 0) * 1000 + Date.now();
  cookies().set("accessToken", result.AccessToken || "");
  cookies().set("expiresIn", expiresIn.toString() || "");
  cookies().set("refreshToken", result.RefreshToken || "");
  cookies().set("idToken", result.IdToken || "");
};

export const deleteAuthenticationResultFromCookies = () => {
  cookies().delete("accessToken");
  cookies().delete("expiresIn");
  cookies().delete("refreshToken");
  cookies().delete("idToken");
};
