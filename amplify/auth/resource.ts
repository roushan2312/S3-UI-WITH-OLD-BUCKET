import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: process.env.USER_POOL_ID!, 
  identityPoolId: process.env.IDENTITY_POOL_ID!,
  userPoolClientId: process.env.USER_POOL_CLIENT_ID!,
  authRoleArn: process.env.AUTH_ROLE_ARN!,
  unauthRoleArn: process.env.UNAUTH_ROLE_ARN!,
  groups: {
    admin: process.env.ADMIN_ROLE_ARN!, 
  },
});