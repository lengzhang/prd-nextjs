import {
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
} from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

import { REPORT_BUCKET_NAME } from "@/utils/aws/constants";
import { getS3Client } from "@/utils/aws/s3";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) throw new Error("ID is not found.");

    const s3Client = getS3Client();

    const list: string[] = [];
    let nextToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: REPORT_BUCKET_NAME,
        Prefix: `${id}/`,
        MaxKeys: 1000,
        Delimiter: "/",
        ContinuationToken: nextToken,
      });

      const response: ListObjectsV2CommandOutput = await s3Client.send(command);
      for (const content of response.CommonPrefixes || []) {
        if (content.Prefix) list.push(content.Prefix);
      }

      nextToken = response.NextContinuationToken;
    } while (nextToken);

    return NextResponse.json(list);
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json(
      { message: errorMsg + REPORT_BUCKET_NAME },
      { status: 500 }
    );
  }
};
