import { CopyObjectCommand } from "@aws-sdk/client-s3";
import { createS3Client } from "@/lib/s3/createClient";

const s3Client = createS3Client();

const extractKey = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    let pathname = parsedUrl.pathname;
    if (pathname.startsWith("/")) {
      pathname = pathname.slice(1);
    }
    return pathname;
  } catch (error) {
    throw new Error("URL processing failed: " + (error as Error).message);
  }
};

export async function POST(request: Request) {
  const { sourceUrl, destinationKey } = await request.json();
  if (!sourceUrl || !destinationKey) {
    return Response.json(
      { error: "Source URL and destination key are required" },
      { status: 400 }
    );
  }

  try {
    const sourceKey = extractKey(sourceUrl);
    const command = new CopyObjectCommand({
      Bucket: process.env.S3_BUCKET!,
      CopySource: `${process.env.S3_BUCKET}/${sourceKey}`,
      Key: destinationKey,
      ACL: "public-read",
    });
    await s3Client.send(command);

    // Construct the new URL for the copied file
    const newFileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${destinationKey}`;

    return Response.json({ url: newFileUrl }, { status: 200 });
  } catch (error: any) {
    console.error("S3 Copy Error:", error);
    return Response.json(
      { error: "Failed to copy file in S3" },
      { status: 500 }
    );
  }
}
