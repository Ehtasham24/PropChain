// Nest JS
import { ApiProperty } from '@nestjs/swagger';

// Class-validator
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Email',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({
    message: 'Email address is required.',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid email address',
    },
  )
  email: string;

  @ApiProperty({
    description: 'OTP code',
    example: 22446,
  })
  @IsNotEmpty({
    message: 'OTP code is required.',
  })
  @IsNumber(
    {
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'OTP code must be an integer number.',
    },
  )
  otpCode: number;

  @ApiProperty({
    name: 'newPassword',
    description: 'New password',
    example: '#MyNewStrongPassword',
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @IsString({ message: 'Password must be a string.' })
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/\d/, { message: 'Password must contain at least one number.' })
  // @Matches(/[@$!%*?&]/, {
  //   message: 'Password must contain at least one special character.',
  // })
  newPassword: string;
}
