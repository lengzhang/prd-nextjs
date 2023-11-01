import { NextRequest, NextResponse } from "next/server";
import { REPORT_BUCKET_NAME } from "@/utils/aws/constants";
import {
  ListObjectsV2Command,
  GetObjectCommand,
  ListObjectsV2CommandOutput,
  GetObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { getS3Client } from "@/utils/aws/s3";
import { ReportItem } from "@/app/types";

export interface ListResponseResult {
  keys: string[];
  mapper: Record<string, ReportItem>;
}

export const GET = async (
  request: NextRequest
): Promise<NextResponse<ListResponseResult | { message: string }>> => {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (!key) throw new Error("Key is not found.");

    const s3Client = getS3Client();

    const listSet = new Set<string>();
    let nextToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: REPORT_BUCKET_NAME,
        Prefix: `${key}/`,
        MaxKeys: 100,
      });

      const response: ListObjectsV2CommandOutput = await s3Client.send(command);
      for (const content of response.Contents || []) {
        if (content.Key) listSet.add(content.Key.replace(/\/(json|pdf)$/, ""));
      }

      nextToken = response.NextContinuationToken;
    } while (nextToken);

    const keys = Array.from(listSet);
    const mapper: Record<string, ReportItem> = {};
    for (const key of keys) {
      const command = new GetObjectCommand({
        Bucket: REPORT_BUCKET_NAME,
        Key: `${key}/json`,
      });
      const response: GetObjectCommandOutput = await s3Client.send(command);
      const jsonStr = await response.Body?.transformToString();
      if (!jsonStr) continue;
      mapper[key] = JSON.parse(jsonStr);
    }

    return NextResponse.json({ keys, mapper });
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Unknown exception.";
    return NextResponse.json({ message: errorMsg }, { status: 500 });
  }
};
