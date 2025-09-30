import { URL } from '@/services/api-base-urls';
import { POST } from '@/services/axios-request-handler';
import User from '@/types/Interfaces/user.interface';
import { USER_REGISTRATION_PAYLOAD } from '@/types/types/auth-payload';
import { useMutation } from '@tanstack/react-query';

interface UserRegisterResponse {
  message: string;
  user: User;
}

// export const userRegisterHook = async (
//   payload: USER_REGISTRATION_PAYLOAD
// ) => {
//   const queryClient = useQueryClient();

//   const userRegisterFn = async () => {
//     const response = await POST(URL.USER_REGISTER);
//     return response as UserRegisterResponse;
//   };

//   return useMutation({
//     mutationFn: userRegisterFn,
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey: ['user'] });
//     },
//   });
// };

export const UserRegisterHook = () => {
  return useMutation({
    mutationFn: async (payload: USER_REGISTRATION_PAYLOAD) => {
      const response = await POST(URL.USER_REGISTER, payload);
      return response as UserRegisterResponse;
    },
    // onSettled: () => {
    //  // queryClient.invalidateQueries({ queryKey: ['user'] });
    // },
  });
};
