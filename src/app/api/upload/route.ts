import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { createS3Client } from "@/lib/s3/createClient";

const s3Client = createS3Client();

export async function POST(request: Request) {
  const { contentType, filename } = await request.json();
  try {
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: process.env.S3_BUCKET!,
      Key: filename,
      Conditions: [
        ["content-length-range", 0, 10485760], // up to 10 MB
        ["starts-with", "$Content-Type", contentType],
      ],
      Fields: {
        acl: "public-read",
        "Content-Type": contentType,
      },
      Expires: 600, // Seconds before the presigned post expires. 3600 by default.
    });
    return Response.json({ url, fields });
  } catch (error: any) {
    console.error("S3 Error:", error);
    return Response.json({ error: "Api error" }, { status: 500 });
  }
}
