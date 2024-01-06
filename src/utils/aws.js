import { TranslateClient } from "@aws-sdk/client-translate";
import "dotenv/config";

export const client = new TranslateClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
