const IS_LIVE = true;

const PRODUCTION_URL = process.env.NEXT_PUBLIC_API_URL as string;

const LOCAL_URL = 'http://localhost:8000/v1' as string;

export const BASE_URL = LOCAL_URL;

export const URL = {
  // ======================== User Authentication ========================

  USER_LOGIN: `${BASE_URL}/auth/user/login`,
  USER_REGISTER: `${BASE_URL}/auth/user/register`,
  VERIFY_OTP: `${BASE_URL}/auth/otp/verify`,
  SEND_OTP: `${BASE_URL}/auth/otp/send`,
  GET_USER: `${BASE_URL}/auth/getUser`,
  SET_NEW_PASSWORD: `${BASE_URL}/auth/user/reset-password`,
} as const;
