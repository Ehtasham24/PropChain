import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  User,
  UserDocument,
} from 'src/modules/feature/user/schema/user.schema';
import { JWT } from 'src/types/common.type';
import { comparePassword } from 'src/utils/hashing/bcrypt';
import { JwtUserService } from '../../jwt/services/jwt-user.service';
import { SignInDto } from '../dto/sign-in.dto';

import { UserSignupDTO } from 'src/modules/feature/user/dto/user-signup-.dto';
import { UserService } from 'src/modules/feature/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtUserService,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // ======================================================= REGISTER BUYER (SIGN UP)  =======================================================================

  async registerUser(userSignupDto: UserSignupDTO) {
    console.time('registerUser');

    const { email } = userSignupDto;
    try {
      // const userExists = await this.userModel.findOne({
      //   where: { email, deletedAt: null },
      //   select: { id: true, email: true },
      // });

      // if (userExists) {
      //   throw new HttpException('Buyer already exists', HttpStatus.BAD_REQUEST);
      // }

      const userCreated = await this.userService.createUser(userSignupDto);

      console.timeEnd('registerUser');
      return {
        message: 'User created successfully',
        user: userCreated,
      };
    } catch (err) {
      console.log('ERROR IN [user auth service] in registerUser method', err);
      throw new BadRequestException(err.message);
    }
  }

  // ======================================================= RESET PASSWORD FOR USER ========================================================================

  // async resetPassword({
  //   email,
  //   otpCode,
  //   newPassword,
  // }: {
  //   email: string;
  //   otpCode: number;
  //   newPassword: string;
  // }) {
  //   try {
  //     const user = await this.userModel.findOne(
  //       { email, deletedAt: null },
  //       'id email password deletedAt',
  //     );

  //     if (!user) {
  //       throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  //     }

  //     const { message, status } = await this.otpService.verifyOTPCode({
  //       otpCode,
  //       email,
  //       type: OTP_REASON_ENUM.FORGOT_PASSWORD,
  //     });

  //     if (!status) {
  //       throw new HttpException(message, HttpStatus.BAD_REQUEST);
  //     }

  //     if (comparePassword(newPassword, user?.password)) {
  //       throw new BadRequestException(
  //         'Old password cannot be same as New password',
  //       );
  //     }

  //     const hashedPassword = hashPassword(newPassword);

  //     const updatedUser = await this.userModel.findOneAndUpdate(
  //       { email },
  //       {
  //         password: hashedPassword,
  //       },
  //       { new: true },
  //     );

  //     return {
  //       user: updatedUser,
  //       message: 'Password has been successfully reset.',
  //     };
  //   } catch (err) {
  //     throw new BadRequestException(err.message);
  //   }
  // }

  //======================================================= LOGIN BUYER METHOD  =======================================================================

  async loginUser({ email, password }: SignInDto) {
    try {
      const userFound = await this.userModel.findOne(
        { email, deletedAt: null },
        'id name password walletAddress email deletedAt',
      );

      if (!userFound) {
        throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
      }

      const isPasswordValid = comparePassword(password, userFound?.password);

      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
      }

      const payload: JWT = {
        id: userFound.id,
        email: userFound.email,
        // walletAddress: userFound?.walletAddress,
        walletAddress: userFound?.walletAddress,
      };
      const accessToken = this.jwtService.generateAuthToken({ payload });

      const { password: _, ...userWithoutPassword } = userFound.toObject();

      return {
        message: 'Login successful',
        token: accessToken,
        user: userWithoutPassword,
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
