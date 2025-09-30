import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'alex@yopmail.com',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsString({
    message: 'Invalid credentials.',
  })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    example: '#MyStrongPassword22@',
  })
  @IsNotEmpty({
    message: 'Password is required.',
  })
  @IsString({
    message: 'Invalid credentials.',
  })
  password: string;
}
