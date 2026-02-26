import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: process.env.USER_POOL_ID!, 
  identityPoolId: process.env.IDENTITY_POOL_ID!,
  userPoolClientId: process.env.USER_POOL_CLIENT_ID!,
  authRoleArn: process.env.AUTH_ROLE_ARN!,
  unauthRoleArn: process.env.UNAUTH_ROLE_ARN!,
  groups: {
    // Note: This must be the full ARN for the group's IAM role
    admin: process.env.ADMIN_ROLE_ARN!, 
  },
});
    // userPoolId: 'ap-south-1_SiaNdQ74c', // Your existing User Pool ID
    // identityPoolId: 'ap-south-1:099654cd-840a-4f7b-90fc-5981764a269b', // Your existing Identity Pool ID
    // authRoleArn: 'arn:aws:iam::137068221002:role/service-role/new-role-cognito-s3-ui', // Existing Auth Role
    // unauthRoleArn: 'arn:aws:iam::137068221002:role/service-role/guest-role', // Existing Unauth Role
    // userPoolClientId: 'oh1r6jvq692e98rp521k6p44g', // Your existing User Pool Client ID
    // groups: {
    //   admin: 'arn:aws:iam::137068221002:role/admin-role-s3-ui', 
    // },