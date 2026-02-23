import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
});

const customBucketName = "ai-description";

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
            groupsadmin: ["get", "list", "write", "delete"],
            authenticated: ["get", "list", "write", "delete"],
          },
        },
      } as any,
    ],
  },
});

// 2. Define the policy for regular logged-in users
// const authPolicy = new Policy(backend.stack, "customBucketAuthPolicy", {
//   statements: [
//     new PolicyStatement({
//       effect: Effect.ALLOW,
//       actions: ["s3:GetObject", "s3:PutObject", "s3:AbortMultipartUpload"],
//       resources: [`arn:aws:s3:::${customBucketName}/invoices/*`],
//     }),
//     new PolicyStatement({
//       effect: Effect.ALLOW,
//       actions: ["s3:ListBucket"],
//       resources: [`arn:aws:s3:::${customBucketName}`],
//       conditions: {
//         StringLike: { "s3:prefix": ["invoices/", "invoices/*"] },
//       },
//     }),
//   ],
// });

// 3. Attach policy to the existing Auth Role referenced in resource.ts
// backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(authPolicy);

// 4. Attach policy to the existing Admin Group Role
// Note: This relies on the "groups" key in referenceAuth
// backend.auth.resources.groups["admin"].role.attachInlinePolicy(
//   new Policy(backend.stack, "customBucketAdminPolicy", {
//     statements: [
//       new PolicyStatement({
//         effect: Effect.ALLOW,
//         actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:AbortMultipartUpload"],
//         resources: [`arn:aws:s3:::${customBucketName}/invoices/*`],
//       }),
//     ],
//   })
// );