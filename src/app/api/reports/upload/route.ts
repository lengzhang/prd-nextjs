import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { REPORT_BUCKET_NAME } from "@/utils/aws/constants";
import { idTokenVerifier } from "@/utils/aws/jwt";
import { getS3Client } from "@/utils/aws/s3";

export const POST = async (
  request: NextRequest
): Promise<
  NextResponse<
    { jsonSignedUrl: string; pdfSignedUrl: string } | { message: string }
  >
> => {
  try {
    const formData = await request.formData();
    const address = formData.get("address") as string;
    const year = formData.get("year") as string;
    const month = formData.get("month") as string;
    if (!address) throw new Error("Address is not found.");
    if (!year) throw new Error("Year is not found.");
    if (!month) throw new Error("Month is not found.");

    const idToken = cookies().get("idToken")?.value || "";
    if (!idToken) throw new Error("ID token is not found.");

    const { sub: userId } = await idTokenVerifier.verify(idToken);

    const keyPrefix = `${userId}/${address}/${year.padStart(
      4,
      "0"
    )}/${month.padStart(2, "0")}`;

    const s3Client = getS3Client();

    const jsonCommand = new PutObjectCommand({
      Bucket: REPORT_BUCKET_NAME,
      Key: `${keyPrefix}/json`,
    });

    const pdfCommand = new PutObjectCommand({
      Bucket: REPORT_BUCKET_NAME,
      Key: `${keyPrefix}/pdf`,
    });

    const jsonSignedUrl = await getSignedUrl(s3Client, jsonCommand, {
      expiresIn: 3600,
    });

    const pdfSignedUrl = await getSignedUrl(s3Client, pdfCommand, {
      expiresIn: 3600,
    });

    return NextResponse.json({ jsonSignedUrl, pdfSignedUrl }, { status: 200 });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
