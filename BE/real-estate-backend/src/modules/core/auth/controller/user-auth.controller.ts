//Nest JS
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/user.auth.service';

import { UserSignupDTO } from 'src/modules/feature/user/dto/user-signup-.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { SignInDto } from '../dto/sign-in.dto';

//Services

// Types

//Entities

@ApiTags('User - Auth')
@Controller('/auth/user')
export class UserAuthController {
  constructor(private readonly authService: AuthService) {}

  // ========================================== REGISTER AKA ONBOARDING OF USER ==========================================
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User has been successfully registered.',
  })
  @ApiBody({ type: UserSignupDTO })
  @Post('/register')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  async register(@Body() userSignupDto: UserSignupDTO) {
    return await this.authService.registerUser(userSignupDto);
  }

  // =============================================== RESET PASSWORD OF USER ===================================================
  /**
   * @description Reset User User Password
   * @param email
   * @param otpCode
   * @param new_password
   */
  // @ApiOperation({ summary: 'Reset password' })
  // @Post('/reset-password')
  // @UsePipes(ValidationPipe)
  // @HttpCode(HttpStatus.OK)
  // async resetPassword(
  //   @Body() { email, otpCode, newPassword }: ResetPasswordDto,
  // ) {
  //   return await this.authService.resetPassword({
  //     email,
  //     otpCode,
  //     newPassword,
  //   });
  // }

  // ================================================== LOGIN BUYER METHOD ===========================================================

  @ApiOperation({ summary: 'Login buyer' })
  @Post('/login')
  async login(@Body() signInDto: SignInDto) {
    return await this.authService.loginUser(signInDto);
  }
}
