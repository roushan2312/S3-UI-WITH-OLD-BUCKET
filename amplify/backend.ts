import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
});

const customBucketName = "replica-test-1vp-s3"; // Replace with your existing bucket name

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
          // "public/*": {
          //   guest: ["get", "list"],
          //   authenticated: ["get", "list", "write", "delete"],
          // },
          "invoices/*": {
            groupsadmin: ["get", "list", "write", "delete"],
            // authenticated: ["get", "list", "write", "delete"],
          },
      },
    },
    ],
  },
});


/**
 * Define an inline policy to attach to Admin user role
 * This policy defines how authenticated users can access your existing bucket
 */
const adminPolicy = new Policy(backend.stack, "customBucketAdminPolicy", {
  statements: [
    // Object level access (ONLY invoices folder)
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      resources: [`arn:aws:s3:::${customBucketName}/invoices/*`],
    }),

    // Bucket level permission (needed for listing)
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [`arn:aws:s3:::${customBucketName}`],
      conditions: {
        StringLike: {
          "s3:prefix": ["invoices/*", "invoices/"],
        },
      },
    }),
  ],
});


// Add the policies to the admin user role
backend.auth.resources.groups["admin"].role.attachInlinePolicy(adminPolicy);