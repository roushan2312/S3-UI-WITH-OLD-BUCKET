import { referenceAuth } from '@aws-amplify/backend';

export const auth = referenceAuth({
  userPoolId: 'ap-south-1_SiaNdQ74c', // Your existing User Pool ID
  identityPoolId: 'ap-south-1:099654cd-840a-4f7b-90fc-5981764a269b', // Your existing Identity Pool ID
  authRoleArn: 'arn:aws:iam::123456789012:role/service-role/new-role-cognito-s3-ui', // Existing Auth Role
  unauthRoleArn: 'arn:aws:iam::123456789012:role/service-role/guest-role', // Existing Unauth Role
  userPoolClientId: '3uq1a3hifu8m49n6b9p9mnk7pp', // Your existing App Client ID
  groups: {
    admin: 'admin', // Maps the 'admin' reference to your existing 'admin' group name
  },
});