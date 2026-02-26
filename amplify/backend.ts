import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
// import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
});

const customBucketName = process.env.BUCKET_NAME;

// 1. Tell Amplify about the bucket for the frontend to see it
backend.addOutput({
  version: "1.3",
  storage: {
    aws_region: "ap-south-1",
    bucket_name: customBucketName,
    buckets: [
      {
        name: customBucketName,
        bucket_name: customBucketName,
        aws_region: "ap-south-1",
        paths: {
          "invoices/*": {
            authenticated: ["get", "list", "write", "delete"],
          },
        },
      } as any
    ],
  },
});
