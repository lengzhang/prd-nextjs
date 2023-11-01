import { REPORT_BUCKET_NAME } from "@/utils/aws/constants";
import { getS3Client } from "@/utils/aws/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key) throw new Error("Key is not found.");

    const s3Client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: REPORT_BUCKET_NAME,
      Key: `${key}`,
    });
    const url = await getSignedUrl(s3Client, command);

    return NextResponse.json({ url });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
