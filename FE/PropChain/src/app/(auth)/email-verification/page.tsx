'use client';

import { OTP_REASON_ENUM } from '@/types/Enums/auth.enum';
import EmailVerificationView from '@/views/Authentication/Otp/Email-Verification';
import React from 'react';

const EmailVerification = ({
  searchParams,
}: {
  searchParams: { email: string };
}) => {
  return (
    <EmailVerificationView
      mainHeading='Email Verification'
      paragraphHeading='Please enter the 6-digit verification code sent to your email address'
      reasonForOtp={OTP_REASON_ENUM.VERIFY_EMAIL}
      emailFromParams={searchParams.email}
      routeTo='/home'
    />
  );
};

export default EmailVerification;
