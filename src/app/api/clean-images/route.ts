import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createS3Client } from "@/lib/s3/createClient";

const s3Client = createS3Client();

export async function POST(request: Request) {
  const { urlsToKeep, prefix } = await request.json();
  if (!Array.isArray(urlsToKeep) || urlsToKeep.length === 0) {
    return Response.json(
      { error: "Invalid or missing urlsToKeep parameter" },
      { status: 400 }
    );
  }

  try {
    // List objects with the given prefix
    const listParams = {
      Bucket: process.env.S3_BUCKET!,
      Prefix: prefix,
    };
    const listedObjects = await s3Client.send(
      new ListObjectsV2Command(listParams)
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      return Response.json({ message: "No objects found to process" });
    }

    const extractKey = (url: string) => {
      const parts = url.split("/");
      return parts.slice(parts.indexOf(prefix)).join("/");
    };
    const keepKeySet = new Set(urlsToKeep.map(extractKey));

    const objectsToDelete = listedObjects.Contents.filter(({ Key }) => {
      return Key && !keepKeySet.has(Key);
    });

    if (objectsToDelete.length === 0) {
      return Response.json({ message: "No objects need to be deleted" });
    }

    const deleteParams = {
      Bucket: process.env.S3_BUCKET!,
      Delete: { Objects: objectsToDelete.map(({ Key }) => ({ Key })) },
    };

    // Delete the objects
    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    return Response.json({
      message: `${objectsToDelete.length} objects deleted successfully`,
    });
  } catch (error: any) {
    console.error("S3 Delete Error:", error);
    return Response.json(
      { error: "Failed to process and delete objects" },
      { status: 500 }
    );
  }
}
