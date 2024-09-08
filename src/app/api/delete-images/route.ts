import { createS3Client } from "@/lib/s3/createClient";
import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = createS3Client();

export async function POST(request: Request) {
  const { url, prefix } = await request.json();

  if (!prefix && !url) {
    return Response.json(
      { error: "Either tableKey and id, or url is required" },
      { status: 400 }
    );
  }

  try {
    let objectsToDelete;

    if (url) {
      // If URL is provided, delete the specific object
      const key = new URL(url).pathname.slice(1); // Remove leading slash
      objectsToDelete = [{ Key: key }];
    } else {
      // Original behavior: delete all objects with the given prefix
      const listParams = {
        Bucket: process.env.S3_BUCKET!,
        Prefix: prefix,
      };
      const listedObjects = await s3Client.send(
        new ListObjectsV2Command(listParams)
      );

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        return Response.json({ message: "No objects found to delete" });
      }

      objectsToDelete = listedObjects.Contents.map(({ Key }) => ({ Key }));
    }

    // Prepare and execute the delete command
    const deleteParams = {
      Bucket: process.env.S3_BUCKET!,
      Delete: { Objects: objectsToDelete },
    };

    await s3Client.send(new DeleteObjectsCommand(deleteParams));
    return Response.json({ message: "Objects deleted successfully" });
  } catch (error: any) {
    console.error("S3 Delete Error:", error);
    return Response.json(
      { error: "Failed to delete objects" },
      { status: 500 }
    );
  }
}
