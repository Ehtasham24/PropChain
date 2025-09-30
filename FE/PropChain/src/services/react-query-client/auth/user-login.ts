import { URL } from '@/services/api-base-urls';
import { POST } from '@/services/axios-request-handler';
import User from '@/types/Interfaces/user.interface';
import { USER_LOGIN_PAYLOAD } from '@/types/types/auth-payload';
import { useMutation } from '@tanstack/react-query';

interface UserLoginResponse {
  message: string;
  token: string;
  user: User;
}

export const UserLoginHook = () => {
  return useMutation({
    mutationFn: async (payload: USER_LOGIN_PAYLOAD) => {
      const response = await POST(URL.USER_LOGIN, payload);
      return response as UserLoginResponse;
    },
    // onSettled: () => {
    //  // queryClient.invalidateQueries({ queryKey: ['user'] });
    // },
  });
};
