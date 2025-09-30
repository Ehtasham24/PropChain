import { Request } from 'express';
// import { User, UserDocument } from 'src/schemas/user/user.schema';

// export interface RequestUser {
//   user?: User | UserDocument;
// }

// export interface CustomRequest extends Request {
//   user: RequestUser;
// }

export enum AuthorizationHeader {
  BEARER = 'Bearer Authorization',
  BASIC = 'Authorization',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
} 
