import { S3Client } from "@aws-sdk/client-s3";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

export const createS3Client = (jwtToken: string) =>
  new S3Client({
    region: process.env.NEXT_PUBLIC_S3_REGION!,
    credentials: fromCognitoIdentityPool({
      clientConfig: { region: process.env.NEXT_PUBLIC_S3_REGION! },
      identityPoolId: process.env.NEXT_PUBLIC_S3_REGION! + ":" + process.env.NEXT_PUBLIC_IDENTITY_POOL_ID!,
      logins: {
        supabase: jwtToken,
      },
    }),
  });
