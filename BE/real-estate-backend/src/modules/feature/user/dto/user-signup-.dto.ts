// Nest JS
import { ApiProperty } from '@nestjs/swagger';

// Class-validator
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Custom decorator
import { PasswordMatch } from 'src/decorators/password-match.decorator';
import { Role } from 'src/types/common.type';

export class UserSignupDTO {
  @ApiProperty({
    description: 'Name of the user',
    example: 'Alex',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'alex@yopmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  //   @isUnique(
  //     { tableName: 'users', column: 'email' },
  //     { message: 'Email is already registered' },
  //   )
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    example: Role.BUYER,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role:Role;

  @ApiProperty({
    description: 'Password of the user',
    example: 'MyStrongPassword22@',
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @IsString({ message: 'Password must be a string.' })
  @MinLength(8)
  @MaxLength(20)
  @Matches(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.',
  })
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.',
  })
  @Matches(/\d/, { message: 'Password must contain at least one number.' })
  password: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'Password1!',
  })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  @IsString({ message: 'Password must be a string.' })
  @PasswordMatch('password', { message: 'Passwords does not match.' })
  confirmPassword: string;
}
