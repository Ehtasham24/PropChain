'use client';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import React, { Fragment, useEffect, useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import ButtonComponent from '../button';
import axios from 'axios';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { VerifyOtpHook } from '@/services/react-query-client/auth/verify-otp';
import { OTP_REASON_ENUM } from '@/types/Enums/auth.enum';
import { LoaderComponent } from '../loader';
import { SendOtpHook } from '@/services/react-query-client/auth/send-otp';
import { useForgotPassword } from '@/context/forgot-password-context';

interface OtpProps {
  heading?: string;
  subHeading?: string;
  reasonForOtp?: OTP_REASON_ENUM;
  emailFromParams?: string;
  routeTo?: string;
}

const OtpComponent: React.FC<OtpProps> = ({
  heading,
  subHeading,
  reasonForOtp,
  emailFromParams,
  routeTo,
}) => {
  const [remainingTime, setRemainingTime] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  const { setOtp } = useForgotPassword();

  //function for routing back
  const handleGoBack = () => {
    router.back();
  };

  // Formik Initial Values
  const initialValues = {
    code: '',
    type: reasonForOtp,
  };

  const {
    values,
    errors,
    touched,
    resetForm,
    setFieldValue,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      code: Yup.string()
        .required('OTP is required')
        .length(6, 'OTP must be 6 digits'),
    }),
    onSubmit: values => {
      handleVerifyClick(values);
    },
  });

  // React Query Hook for Verify OTP
  const { mutateAsync, isPending } = VerifyOtpHook();

  // Hook for Sending OTP
  const { mutateAsync: sendOtp } = SendOtpHook();

  // Handle OTP verification
  const handleVerifyClick = async (values: typeof initialValues) => {
    const payload = {
      code: Number(values.code),
      type: reasonForOtp ?? OTP_REASON_ENUM.VERIFY_EMAIL,
      email: emailFromParams ?? '',
    };

    try {
      await mutateAsync(payload);
      toast.success('OTP verified successfully');
      setOtp(values.code);
      resetForm();
      router.push(`${routeTo}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Verification failed');
      } else {
        toast.error('An error occurred during verification');
      }
    }
  };

  // Handle OTP change
  const handleOtpChange = (value: string) => {
    setFieldValue('code', value);
  };

  useEffect(() => {
    if (remainingTime <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => {
      setRemainingTime(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remainingTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  //handle resend otp
  const handleResendOtp = () => {
    if (!canResend) return;

    const payload = {
      email: emailFromParams ?? '',
      reason: reasonForOtp ?? OTP_REASON_ENUM.VERIFY_EMAIL,
    };

    sendOtp(payload, {
      onSuccess: () => {
        toast.success('OTP sent successfully');
        resetForm();

        setRemainingTime(60);
        setCanResend(false);
      },
      onError: (error: unknown) => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      },
    });
  };

  return (
    <Fragment>
      <button
        className='ml-4 mb-4'
        onClick={handleGoBack}
      >
        <GoArrowLeft className='text-[33px]' />
      </button>

      <h1 className='font-bold text-[27px] ml-6 mb-2'>{heading}</h1>
      <p className='text-neutral_grey_two  text-[13px] md:text-[16px] max-w-[90%] text-wrap ml-6 mb-6'>
        {subHeading}
      </p>

      <form onSubmit={handleSubmit}>
        <div className='flex justify-center items-center mb-2'>
          <InputOTP
            maxLength={6}
            value={values.code}
            onChange={handleOtpChange}
            name='code'
            onBlur={handleBlur}
          >
            <InputOTPGroup className='flex gap-2'>
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className='input-otp-slot'
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {errors.code && touched.code && (
          <p className='text-red-500 text-sm text-center mt-2'>{errors.code}</p>
        )}

        <div className='flex flex-col items-center justify-center max-w-[80%] w-auto ml-14'>
          {remainingTime !== 60 ? (
            <p className='text-[14px] md:text-[15px] mt-3'>
              Remaining Time: {formatTime(remainingTime)}
            </p>
          ) : (
            <></>
          )}

          <p className='mt-2 text-[14px] md:text-[15px]'>
            Didn&apos;t receive the code?
            <button
              type='button'
              onClick={handleResendOtp}
            >
              <span
                className={`ml-1 ${canResend ? 'text-primary cursor-pointer' : 'text-gray-400'}`}
              >
                Resend it
              </span>
            </button>
          </p>
        </div>

        <ButtonComponent
          variant={isPending ? 'outline' : 'primary'}
          size='md'
          type='submit'
          //className=''
          className={`ml-5 w-full h-[60px] mt-3 relative ${isPending ? 'overflow-hidden' : ''}`}
          disabled={isPending || values.code.length !== 6}
        >
          {isPending ? (
            <LoaderComponent text='Verify' />
          ) : (
            <span className='text-[18px]'>Verify</span>
          )}
        </ButtonComponent>
      </form>
    </Fragment>
  );
};

export default OtpComponent;
