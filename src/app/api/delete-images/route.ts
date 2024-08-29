import {
  S3Client,
  DeleteObjectsCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  const { campaignId } = await request.json();

  if (!campaignId) {
    return Response.json({ error: "campaignId is required" }, { status: 400 });
  }

  try {
    const prefix = `${campaignId}/images/`;

    // List objects with the given prefix
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

    // Prepare the delete command
    const deleteParams = {
      Bucket: process.env.S3_BUCKET!,
      Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
    };

    // Delete the objects
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
