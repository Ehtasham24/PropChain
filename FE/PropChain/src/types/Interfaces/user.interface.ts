interface User {
  id: string | null;
  email: string | null;
  isEmailVerified: boolean | null;
  emailVerifiedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

export default User;
