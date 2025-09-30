'use client';

import ButtonComponent from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import { Eye, EyeOff, User, Mail, Lock, Wallet } from 'lucide-react';
import { connectMetaMask } from '../../../utils/meta.mask';

// React Imports
import { FC, Fragment, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Formik
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { UserRegisterHook } from '@/services/react-query-client/auth/user-register';
import { useRouter } from 'next/navigation';
import { LoaderComponent } from '@/components/custom/loader';
import { getCookieFn, setCookieClientSideFn } from '@/utils/storage.util';

interface IRegistrationViewProps {}

const RegistrationView: FC<IRegistrationViewProps> = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userRole, setUserRole] = useState<string>('');

  const router = useRouter();
  const [walletConnected, setWalletConnected] = useState(false);

  // Formik Validation Schema
  interface InitialValues {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    walletAddress: string;
  }

  // Formik Initial Values
  const initialValues: InitialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
  };

  //FORMIK

  const {
    values,
    errors,
    touched,
    resetForm,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string()
        .email('Invalid email format')
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Invalid email address',
        )
        .test(
          'no-double-domain',
          'Email contains invalid domain structure',
          value => {
            if (!value) return true;

            const atSymbols = (value.match(/@/g) || []).length;
            if (atSymbols !== 1) return false;

            const domainPart = value.split('@')[1];

            const dots = (domainPart.match(/\./g) || []).length;
            if (dots > 2) return false;

            const domainSegments = domainPart.split('.');
            const tldSegments = domainSegments.slice(1);

            for (let i = 0; i < tldSegments.length - 1; i++) {
              if (tldSegments[i] === tldSegments[i + 1]) return false;
            }

            return true;
          },
        )
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
      walletAddress: Yup.string()
        .required('Wallet address is required')
        .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), ''], 'Passwords must match')
        .required('Confirm Password is required'),
    }),
    onSubmit: values => {
      handleRegisterClick(values);
    },
  });
  const [debugMode, setDebugMode] = useState(false);
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setDebugMode(new URLSearchParams(window.location.search).has('debug'));
  //   }
  // }, []);
  useEffect(() => {
    const role = getCookieFn('role') || '';
    setUserRole(role);

    if (typeof window !== 'undefined') {
      setDebugMode(new URLSearchParams(window.location.search).has('debug'));
    }

    if (!debugMode) return;

    console.groupCollapsed('[Registration] Component Mounted');
    console.log('Initial Form Values:', initialValues);
    console.groupEnd();

    const savedAddress = localStorage.getItem('ganacheWalletAddress');
    console.log(
      '[Wallet] Checking localStorage for saved address:',
      savedAddress,
    );

    if (savedAddress) {
      console.log('[Wallet] Found saved address, updating form...');
      setFieldValue('walletAddress', savedAddress);
      setWalletConnected(true);
    }
  }, []);

  // React Query Hook for Register User
  const { mutateAsync, isPending } = UserRegisterHook();

  const handleConnectWallet = useCallback(async () => {
    try {
      const address = await connectMetaMask();
      // Add these two lines to update the form
      setFieldValue('walletAddress', address);
      localStorage.setItem('ganacheWalletAddress', address);

      setWalletConnected(true);
      toast.success('Wallet connected successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to connect wallet',
      );
    }
  }, [setFieldValue]);
  // Handle Register Click
  const handleRegisterClick = async (values: InitialValues) => {
    console.groupCollapsed('[Registration] Submission Started');
    try {
      console.log('[Registration] Form Values:', values);
      console.log('[Registration] Building payload...');

      const payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: userRole,
        confirmPassword: values.confirmPassword,
        walletAddress: values.walletAddress,
      };

      console.log('[Registration] Payload:', payload);
      console.log('[Registration] Calling registration API...');

      await mutateAsync(payload, {
        onSuccess: () => {
          console.log('[Registration] API call successful');
          console.log('[Registration] Clearing localStorage...');
          localStorage.removeItem('ganacheWalletAddress');

          toast.success('Registration Successful');
          resetForm();
          router.push(`/email-verification?email=${values.email}`);
        },
        onError: error => {
          console.groupCollapsed('[Registration] API Error');
          console.error('Error details:', error);
          if (axios.isAxiosError(error)) {
            console.log('HTTP Status:', error.response?.status);
            console.log('Response Data:', error.response?.data);
          }
          console.groupEnd();

          toast.error(
            axios.isAxiosError(error)
              ? error.response?.data.message
              : 'Something went wrong',
          );
        },
      });
    } catch (error) {
      console.error('[Registration] Unexpected error:', error);
    } finally {
      console.groupEnd();
    }
  };

  if (debugMode) {
    console.groupCollapsed('[Debug] Current Form State');
    console.log('Form values:', values);
    console.log('Form errors:', errors);
    console.log('Touched fields:', touched);
    console.log('Wallet connected:', walletConnected);
    console.log('Submission pending:', isPending);
    console.groupEnd();
  }

  return (
    <Fragment>
      <h1 className='text-[28px] font-bold mb-6'>Sign Up</h1>

      <form
        className='grid gap-3'
        onSubmit={handleSubmit}
      >
        <div>
          <div className='mb-1'>
            <Label required>Wallet Address</Label>
          </div>
          <div className='relative flex gap-2'>
            <Wallet
              size={22}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type='text'
              name='walletAddress'
              id='walletAddress'
              placeholder='0x...'
              value={values.walletAddress}
              className='h-[50px] pl-10'
              readOnly
            />
            <ButtonComponent
              onClick={handleConnectWallet}
              variant={walletConnected ? 'outline' : 'primary'}
              className='h-[50px] min-w-[180px]'
            >
              {walletConnected ? 'Wallet Connected' : 'Connect MetaMask'}
            </ButtonComponent>
          </div>
          {errors.walletAddress && touched.walletAddress && (
            <p className='text-red-500 text-sm'>{errors.walletAddress}</p>
          )}
        </div>
        {debugMode && (
          <div className='p-4 mb-4 bg-gray-100 rounded-lg'>
            <h3 className='font-bold mb-2'>Debug Information</h3>
            <pre className='text-xs whitespace-pre-wrap'>
              {JSON.stringify(
                {
                  timestamp: new Date().toISOString(),
                  formValues: values,
                  formErrors: errors,
                  touchedFields: touched,
                  walletConnected,
                  isPending,
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}
        <div>
          <div className='mb-1'>
            <Label required>Full Name</Label>
          </div>

          <div className='relative'>
            <User
              size={22}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type='text'
              name='name'
              id='name'
              value={values.name}
              required
              placeholder='Full Name'
              className='h-[50px]'
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.name && touched.name && (
              <p className='text-red-500 text-sm'>{errors.name} </p>
            )}
          </div>
        </div>

        <div>
          <div className='mb-1'>
            <Label required>Email</Label>
          </div>

          <div className='relative'>
            <Mail
              size={20}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type='text'
              name='email'
              id='email'
              placeholder='Email'
              value={values.email}
              className='h-[50px]'
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.email && touched.email && (
              <p className='text-red-500 text-sm'>{errors.email} </p>
            )}
          </div>
        </div>

        <div>
          <div className='mb-1'>
            <Label required>Password</Label>
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
              value={values.password}
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

        <div>
          <div className='mb-1'>
            <Label required>Confirm Password</Label>
          </div>
          <div className='relative'>
            <Lock
              size={22}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirmPassword'
              id='confirmPassword'
              value={values.confirmPassword}
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
        </div>

        <div className='mt-5'>
          <ButtonComponent
            variant={isPending ? 'outline' : 'primary'}
            size='lg'
            type='submit'
            disabled={isPending || !walletConnected}
            className={`relative ${isPending ? 'overflow-hidden' : ''}`}
          >
            {isPending ? (
              <LoaderComponent text='Sign up' />
            ) : (
              <span className='text-[18px]'>Sign up</span>
            )}
          </ButtonComponent>

          <p className='text-center mt-3 text-[17px]'>
            Already have an account?{' '}
            <button
              className='text-primary'
              onClick={() => router.push('/login')}
            >
              <span className=' text-[16px] font-bold text-black'>Login</span>
            </button>
          </p>
        </div>
      </form>
    </Fragment>
  );
};

export default RegistrationView;
