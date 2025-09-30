'use client';

import { OTP_REASON_ENUM } from '@/types/Enums/auth.enum';
import EmailOtpVerificationView from '@/views/Authentication/Otp/Email-Verification';
import React from 'react';

const OtpVerificationPage = ({
  searchParams,
}: {
  searchParams: { email: string };
}) => {
  return (
    <EmailOtpVerificationView
      mainHeading='OTP VERIFICATION'
      paragraphHeading={`Enter verrification code sent to ${searchParams.email}`}
      reasonForOtp={OTP_REASON_ENUM.FORGOT_PASSWORD}
      emailFromParams={searchParams.email}
      routeTo='/set-new-password'
    />
  );
};

export default OtpVerificationPage;
