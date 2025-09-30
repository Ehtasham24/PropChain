import { URL } from '@/services/api-base-urls';
import { POST } from '@/services/axios-request-handler';
import User from '@/types/Interfaces/user.interface';
import { RESET_PASSWORD_PAYLOAD } from '@/types/types/auth-payload';
import { useMutation } from '@tanstack/react-query';

interface SetNewPasswordResponse {
  user: User;
  message: string;
}

export const SetNewPasswordHook = () => {
  return useMutation({
    mutationFn: async (payload: RESET_PASSWORD_PAYLOAD) => {
      const response = await POST(URL.SET_NEW_PASSWORD, payload);
      return response as SetNewPasswordResponse;
    },
  });
};
