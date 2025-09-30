import { useMutation } from '@tanstack/react-query';
import { URL } from '@/services/api-base-urls';
import { POST } from '@/services/axios-request-handler';
import { VERIFY_OTP_PAYLOAD } from '@/types/types/auth-payload';

interface VerifyOtpResponse {
  message: string;
  status: string;
  accessToken?: string;
}

export const VerifyOtpHook = () => {
  return useMutation({
    mutationFn: async (payload: VERIFY_OTP_PAYLOAD) => {
      const response = await POST(URL.VERIFY_OTP, payload);
      return response as VerifyOtpResponse;
    },
    // ,
    // onSettled: () => {
    //   //queryClient.invalidateQueries({ queryKey: ['user'] });
    // },
  });
};
