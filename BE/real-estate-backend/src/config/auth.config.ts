import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  const authSecrets = {
    userSecret: process.env.USER_SECRET_KEY,
    userExpiry: process.env.USER_EXPIRES_IN
  };
  return authSecrets;
});