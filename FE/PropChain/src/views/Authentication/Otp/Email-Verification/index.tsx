import OtpComponent from '@/components/custom/otp';
import { OTP_REASON_ENUM } from '@/types/Enums/auth.enum';
import React from 'react';

// <div className='flex flex-col w-full min-h-screen items-center justify-center p-8'>
// <div className='w-full max-w-[620px] space-y-8'>
interface EmailVerificationProps {
  mainHeading?: string;
  paragraphHeading?: string;
  reasonForOtp: OTP_REASON_ENUM;
  emailFromParams?: string;
  routeTo?: string;
}

const EmailOtpVerificationView: React.FC<EmailVerificationProps> = ({
  mainHeading,
  paragraphHeading,
  reasonForOtp,
  emailFromParams,
  routeTo,
}) => {
  return (
    <OtpComponent
      heading={mainHeading}
      subHeading={paragraphHeading}
      reasonForOtp={reasonForOtp}
      emailFromParams={emailFromParams}
      routeTo={routeTo}
    />
  );
};

export default EmailOtpVerificationView;
