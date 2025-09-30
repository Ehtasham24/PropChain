// 'use client';

// import ButtonComponent from '@/components/custom/button';
// import { LoaderComponent } from '@/components/custom/loader';
// import { Input } from '@/components/ui/input';
// import { sendOtpHook } from '@/services/react-query-client/auth/send-otp';
// import { OTP_REASON_ENUM } from '@/types/Enums/auth.enum';
// import { Label } from '@radix-ui/react-label';
// import axios from 'axios';
// import { useFormik } from 'formik';
// import { Mail } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { Fragment } from 'react';
// import toast from 'react-hot-toast';
// import { GoArrowLeft } from 'react-icons/go';
// import * as Yup from 'yup';

// const ForgotPasswordView = () => {
//   const router = useRouter();

//   // Formik Validation Schema
//   interface InitialValues {
//     email: string;
//   }

//   // Formik Initial Values
//   const initialValues: InitialValues = {
//     email: '',
//   };

//   // React Query Hook for Send OTP
//   const { mutate, isPending } = sendOtpHook();

//   //FORMIK
//   const {
//     values,
//     errors,
//     touched,
//     resetForm,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//   } = useFormik({
//     initialValues,
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email('Invalid email format')
//         .matches(
//           /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//           'Invalid email address',
//         )
//         .test(
//           'no-double-domain',
//           'Email contains invalid domain structure',
//           value => {
//             if (!value) return true;

//             const atSymbols = (value.match(/@/g) || []).length;
//             if (atSymbols !== 1) return false;

//             const domainPart = value.split('@')[1];

//             const dots = (domainPart.match(/\./g) || []).length;
//             if (dots > 2) return false;

//             const domainSegments = domainPart.split('.');
//             const tldSegments = domainSegments.slice(1);

//             for (let i = 0; i < tldSegments.length - 1; i++) {
//               if (tldSegments[i] === tldSegments[i + 1]) return false;
//             }

//             return true;
//           },
//         )
//         .required('Email is required'),
//     }),
//     onSubmit: values => {
//       handleSendOtpClick(values);
//     },
//   });

//   // Handle Send OTP Click
//   const handleSendOtpClick = (values: InitialValues) => {
//     console.log("Submitting email:", values.email);

//     const payload = {
//       email: values.email,
//       reason: OTP_REASON_ENUM.FORGOT_PASSWORD,
//     };

//     console.log("Sending payload:", payload);

//     mutate(payload, {
//       onSuccess: (response) => {
//         console.log("OTP sent successfully:", response);
//         toast.success('OTP sent successfully');
//         // Store email in localStorage or sessionStorage to access it in OTP verification page
//         sessionStorage.setItem('forgotPasswordEmail', values.email);
//         resetForm();
//         router.push('/otp-verification');
//       },
//       onError: (error) => {
//         if (axios.isAxiosError(error)) {
//           toast.error(error.response?.data.message || 'Something went wrong');
//         } else {
//           toast.error('Something went wrong');
//         }
//       }
//     });
//   };

//   return (
//     <Fragment>
//       <form onSubmit={handleSubmit}>
//         <button type="button" onClick={() => router.back()}>
//           <GoArrowLeft className='text-[33px]' />
//         </button>

//         <div>
//           <h1 className='font-medium text-[30px] mb-2'>Forgot Password</h1>
//           <p className='font-light'>
//             Please enter your email address for verification
//           </p>
//         </div>

//         <div className='mt-7'>
//           <div className='mb-1'>
//             <Label htmlFor="email">Email</Label>
//           </div>

//           <div className='relative'>
//             <Mail
//               size={22}
//               strokeWidth={2}
//               color='#9EA9AA'
//               className='color-grey-500 absolute left-[8px] top-[13px]'
//             />
//             <Input
//               type='email'
//               name='email'
//               id='email'
//               placeholder='Email'
//               className='h-[50px] pl-10'
//               value={values.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//             />

//             {errors.email && touched.email && (
//               <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
//             )}
//           </div>
//         </div>

//         <ButtonComponent
//           variant='primary'
//           size='lg'
//           type='submit'
//           className='h-[61px] mt-8'
//           disabled={isPending}
//         >
//           {isPending ? (
//             <LoaderComponent text='Sending Code...' />
//           ) : (
//             <span className='text-[20px]'>Send Code</span>
//           )}
//         </ButtonComponent>
//       </form>
//     </Fragment>
//   );
// };

// export default ForgotPasswordView;
'use client';

import ButtonComponent from '@/components/custom/button';
import { LoaderComponent } from '@/components/custom/loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForgotPassword } from '@/context/forgot-password-context';
import { SendOtpHook } from '@/services/react-query-client/auth/send-otp';
import { OTP_REASON_ENUM } from '@/types/Enums/auth.enum';
import axios from 'axios';
import { useFormik } from 'formik';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { GoArrowLeft } from 'react-icons/go';
import * as Yup from 'yup';

const ForgotPasswordView = () => {
  const router = useRouter();
  const { setEmail } = useForgotPassword();

  const handleGoBack = () => {
    router.back();
  };

  // Formik Validation Schema
  interface InitialValues {
    email: string;
  }

  // Formik Initial Values
  const initialValues: InitialValues = {
    email: '',
  };

  // React Query Hook for Send OTP
  const { mutate, isPending } = SendOtpHook();

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
    }),
    onSubmit: values => {
      handleSendOtpClick(values);
    },
  });

  // Handle Send OTP Click
  const handleSendOtpClick = (values: InitialValues) => {
    const payload = {
      email: values.email,
      reason: OTP_REASON_ENUM.FORGOT_PASSWORD,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success('OTP sent successfully');
        setEmail(values.email);
        resetForm();
        router.push(`/otp-verify/?email=${values.email}`);
      },
      onError: error => {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || 'Something went wrong');
        } else {
          toast.error('Something went wrong');
        }
      },
    });
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <button
          type='button'
          onClick={handleGoBack}
        >
          <GoArrowLeft className='text-[33px] mb-4' />
        </button>

        <div>
          <h1 className='font-bold text-[28px] mb-2'>Forgot Password</h1>
          <p className='text-neutral_grey_two text-[16px]'>
            Please enter your email address for verification
          </p>
        </div>

        <div className='mt-7'>
          <div className='mb-1'>
            <Label
              htmlFor='email'
              required
            >
              Email
            </Label>
          </div>

          <div className='relative'>
            <Mail
              size={22}
              strokeWidth={2}
              color='#9EA9AA'
              className='color-grey-500 absolute left-[8px] top-[13px]'
            />
            <Input
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              className='h-[50px] pl-10'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.email && touched.email && (
              <p className='text-red-500 text-sm mt-1'>{errors.email}</p>
            )}
          </div>
        </div>

        <ButtonComponent
          variant={isPending ? 'outline' : 'primary'}
          size='lg'
          type='submit'
          className={`h-[61px] mt-8 relative ${isPending ? 'overflow-hidden' : ''}`}
          disabled={isPending}
        >
          {isPending ? (
            <LoaderComponent text='Send Code...' />
          ) : (
            <span className='text-[18px]'>Send Code</span>
          )}
        </ButtonComponent>
      </form>
    </Fragment>
  );
};

export default ForgotPasswordView;
