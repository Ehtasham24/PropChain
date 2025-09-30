import { OTP_REASON_ENUM } from '../Enums/auth.enum';

export type USER_REGISTRATION_PAYLOAD = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type VERIFY_OTP_PAYLOAD = {
  email: string;
  code: number;
  type: OTP_REASON_ENUM;
};

export type SEND_OTP_PAYLOAD = {
  email: string;
  reason: OTP_REASON_ENUM;
};

export type USER_LOGIN_PAYLOAD = {
  email: string;
  password: string;
};

export type RESET_PASSWORD_PAYLOAD = {
  email: string;
  otpCode: number;
  newPassword: string;
};
