'use client';

import { Fragment, useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ButtonComponent from '@/components/custom/button';
import { useForgotPassword } from '@/context/forgot-password-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { SetNewPasswordHook } from '@/services/react-query-client/auth/set-new-password';
import toast from 'react-hot-toast';
import { LoaderComponent } from '@/components/custom/loader';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SetNewPasswordView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email, otp } = useForgotPassword();
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  // Formik Validation Schema
  interface InitialValues {
    password: string;
    confirmPassword: string;
  }

  // Formik Initial Values
  const initialValues: InitialValues = {
    password: '',
    confirmPassword: '',
  };

  //FORMIK

  const { errors, touched, resetForm, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: Yup.object({
        password: Yup.string().required('Password is required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), ''], 'Passwords must match')
          .required('Confirm Password is required'),
      }),
      onSubmit: values => {
        handleRegisterClick(values);
      },
    });

  // React Query Hook for Reset Password
  const { mutate, isPending } = SetNewPasswordHook();

  //Handle Register Click
  const handleRegisterClick = async (values: InitialValues) => {
    const payload = {
      email: email,
      otpCode: Number(otp),
      newPassword: values.password,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success('Password Reset Successfully');
        resetForm();
        router.push('/login');
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
        onClick={handleGoBack}
        className='mb-6'
      >
        <GoArrowLeft className='text-[33px]' />
      </button>

      <div className='mb-5'>
        <h1 className='text-[28px] font-bold mb-1'>Set New Password</h1>
        <p className='text-[16px] text-neutral_grey_two ml-[1px]'>
          Enter a new password and remember it
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <div className='mb-1'>
            <Label required>New Password</Label>
          </div>

          <div className='relative'>
            <Lock
              size={22}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type={showPassword ? 'text' : 'password'}
              name='password'
              id='password'
              placeholder='Password'
              className='h-[50px]'
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.password && touched.password && (
              <p className='text-red-500 text-sm'>{errors.password} </p>
            )}

            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors duration-200'
            >
              {showPassword ? (
                <EyeOff
                  size={20}
                  strokeWidth={1.5}
                  className='transition-all duration-200'
                />
              ) : (
                <Eye
                  size={20}
                  strokeWidth={1.5}
                  className='transition-all duration-200'
                />
              )}
            </button>
          </div>
        </div>

        <div className='mt-4'>
          <div className='mb-1'>
            <Label required>Confirm New Password</Label>
          </div>

          <div className='relative'>
            <Mail
              size={22}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              id='confirmPassword'
              placeholder='Password'
              className='h-[50px]'
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className='text-red-500 text-sm'>{errors.confirmPassword} </p>
            )}
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary transition-colors duration-200'
            >
              {showConfirmPassword ? (
                <EyeOff
                  size={20}
                  strokeWidth={1.5}
                  className='transition-all duration-200'
                />
              ) : (
                <Eye
                  size={20}
                  strokeWidth={1.5}
                  className='transition-all duration-200'
                />
              )}
            </button>
          </div>

          <ButtonComponent
            size='lg'
            variant={isPending ? 'outline' : 'primary'}
            className={`relative h-[50px] mt-7 ${isPending ? 'overflow-hidden' : ''}`}
            type='submit'
          >
            {isPending ? (
              <LoaderComponent text='Save' />
            ) : (
              <span className='text-[18px]'>Save</span>
            )}
          </ButtonComponent>
        </div>
      </form>
    </Fragment>
  );
};

export default SetNewPasswordView;
