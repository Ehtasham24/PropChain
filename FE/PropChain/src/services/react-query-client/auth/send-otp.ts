import { useMutation } from '@tanstack/react-query';
import { URL } from '@/services/api-base-urls';
import { POST } from '@/services/axios-request-handler';
import { SEND_OTP_PAYLOAD } from '@/types/types/auth-payload';

interface SendOtpResponse {
  message: string;
  sucess: boolean;
}

export const SendOtpHook = () => {
  return useMutation({
    mutationFn: async (payload: SEND_OTP_PAYLOAD) => {
      const response = await POST(URL.SEND_OTP, payload);
      return response as SendOtpResponse;
    },
    // ,
    // onSettled: () => {
    //   //queryClient.invalidateQueries({ queryKey: ['user'] });
    // },
  });
};
