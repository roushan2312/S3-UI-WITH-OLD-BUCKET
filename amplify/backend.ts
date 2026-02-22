import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { Policy, PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

const backend = defineBackend({
  auth,
});

const customBucketName = "replica-test-1vp-s3"; 
const customBucketName2 = "1vp-test-textract";

backend.addOutput({
  version: "1.3",
  storage: {
    aws_region: "ap-south-1",
    bucket_name: customBucketName, // primary bucket
    buckets: [
      {
        name: customBucketName,
        bucket_name: customBucketName,
        aws_region: "ap-south-1",
        paths: {
          "invoices/*": {
            groupsadmin: ["get", "list", "write", "delete"],
            groupsops: ["get", "list", "write"],
          },
        },
      },
      {
        name: customBucketName2,
        bucket_name: customBucketName2,
        aws_region: "ap-south-1",
        paths: {
          "test-folder/*": {
            groupsadmin: ["get", "list", "write", "delete"],
            groupsops: ["get", "list", "write"],
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
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      resources: [
        `arn:aws:s3:::${customBucketName}/invoices/*`,
        `arn:aws:s3:::${customBucketName2}/test-folder/*`
      ],
    }),

    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `arn:aws:s3:::${customBucketName}`,
        `arn:aws:s3:::${customBucketName2}`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": ["invoices/*", "invoices/", "test-folder/*", "test-folder/"],
        },
      },
    }),
  ],
});


const OPSPolicy = new Policy(backend.stack, "customBucketOPSPolicy", {
  statements: [
    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:GetObject", "s3:PutObject", ],
      resources: [
        `arn:aws:s3:::${customBucketName}/invoices/*`,
        `arn:aws:s3:::${customBucketName2}/test-folder/*`
      ],
    }),

    new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [
        `arn:aws:s3:::${customBucketName}`,
        `arn:aws:s3:::${customBucketName2}`
      ],
      conditions: {
        StringLike: {
          "s3:prefix": ["invoices/*", "invoices/", "test-folder/*", "test-folder/"],
        },
      },
    }),
  ],
});


// Add the policies to the admin user role
backend.auth.resources.groups["admin"].role.attachInlinePolicy(adminPolicy);
backend.auth.resources.groups["ops"].role.attachInlinePolicy(OPSPolicy);