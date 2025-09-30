'user client';

import ButtonComponent from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Fragment, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserLoginHook } from '@/services/react-query-client/auth/user-login';
import axios from 'axios';
import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { LoaderComponent } from '@/components/custom/loader';
import { setCookieClientSideFn } from '@/utils/storage.util';
import { CustomJwtPayload, jwtDecode } from 'jwt-decode';
import { useWalletAddress } from '@/context/set-wallet-address.context';
// import { useWalletAddress } from '../context/set-wallet-address.context';

const LoginView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setWalletAddress } = useWalletAddress();
  const router = useRouter();

  // Formik Validation Schema
  interface InitialValues {
    email: string;
    password: string;
  }

  // Formik Initial Values
  const initialValues: InitialValues = {
    email: '',
    password: '',
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
  } = useFormik({
    initialValues,
    validationSchema: Yup.object({
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
    }),
    onSubmit: (values: InitialValues) => {
      handleRegisterClick(values);
    },
  });

  // React Query Hook for Register User
  const { mutateAsync, isPending } = UserLoginHook();

  // Handle Register Click
  // const handleRegisterClick = async (values: InitialValues) => {
  //   const payload = {
  //     email: values.email,
  //     password: values.password,
  //   };

  //   try {
  //     const response = await mutateAsync(payload);

  //     setCookieClientSideFn('accessToken', response.token);

  //     toast.success(response.message);
  //     resetForm();
  //     router.push(`/home`);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       toast.error(error.response?.data.message || 'Something went wrong');
  //     } else {
  //       toast.error('Something went wrong');
  //     }
  //   }
  // };

  // Handle Register Click
  const handleRegisterClick = async (values: InitialValues) => {
    const payload = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await mutateAsync(payload);

      setCookieClientSideFn('accessToken', response.token);

      // Decode the JWT token
      // const decodedToken = jwtDecode(response.token);

      const decodedToken = jwtDecode<CustomJwtPayload>(response.token);
      const waddress = decodedToken?.walletAddress || '';
      console.log('decoded token', decodedToken);

      // const waddress = decodedToken?.walletAddress || '';

      localStorage.setItem('walletAddress', waddress);
      setWalletAddress(waddress);
      // console.log("wallet address after setup",walletAddress);

      toast.success(response.message);
      resetForm();
      router.push(`/home`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || 'Something went wrong');
      } else {
        toast.error('Something went wrong');
      }
    }
  };
  return (
    <Fragment>
      <h1 className='text-[30px] font-bold mb-6'>Login</h1>

      <form onSubmit={handleSubmit}>
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

        <div className='mt-4'>
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

        <div className='text-end mt-1'>
          <button
            type='button'
            className='text-primary'
            onClick={() => router.push('/forgot-password')}
          >
            <span className=' text-[15px] ml-1 font-[500] text-black'>
              Forgot Password?
            </span>
          </button>
        </div>

        <ButtonComponent
          variant={isPending ? 'outline' : 'primary'}
          size='lg'
          type='submit'
          disabled={isPending}
          className={`relative h-[56px] mt-7 ${isPending ? 'overflow-hidden' : ''}`}
        >
          {isPending ? (
            <LoaderComponent text='Sign up' />
          ) : (
            <span className='text-[18px]'>Login</span>
          )}
        </ButtonComponent>
      </form>

      <p className='text-center text-[16px] mt-1'>
        Don&apos;t have an account?
        <button
          className='text-primary'
          onClick={() => {
            router.push('/signup');
          }}
        >
          <span className=' text-[16px] ml-1  text-black font-bold'>
            Sign up
          </span>
        </button>
      </p>
    </Fragment>
  );
};

export default LoginView;
