import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';

export class RegisterUserDto {
  @ApiProperty({
    type: String,
    default: 'test',
  })
  username: string;
  @ApiProperty({
    type: String,
    default: 'test@mail.com',
  })
  email: string;
  @ApiProperty({
    type: String,
    default: 'Pass123!',
  })
  password: string;
  @ApiProperty({
    enum: Role,
    default: Role.client,
  })
  role: Role;
  @ApiProperty({
    type: String,
    default: 'Test Test',
  })
  full_name: string;
  @ApiProperty({
    type: Date,
    default: new Date('01-01-1999'),
  })
  date_of_birth: Date;
  @ApiProperty({
    enum: Gender,
    default: 'male',
  })
  gender: Gender;
  @ApiProperty({
    type: String,
    default: '+1234567890',
  })
  phone_number?: string;
}

export class LoginUserDto {
  @ApiProperty({
    type: String,
    default: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    default: 'Pass123!',
  })
  password: string;

  @ApiProperty({
    type: String,
  })
  fcm_token: string;
}

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  @ApiProperty({
    type: String,
    default: 'test',
  })
  username: string;

  @ApiProperty({
    type: String,
    default: 'test@mail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    default: 'Test Test',
  })
  full_name: string;

  @ApiProperty({
    type: Date,
    default: new Date('01-01-1999'),
  })
  date_of_birth: Date;

  @ApiProperty({
    enum: Gender,
    default: 'male',
  })
  gender: Gender;

  @ApiProperty({
    type: String,
    default: 'VLX',
  })
  certificate_prefix: string;

  @ApiPropertyOptional({
    type: String,
  })
  referral_code: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty({
    type: String,
    default: 'Pass123!',
  })
  oldPassword: string;
  @ApiProperty({
    type: String,
    default: 'Pass123!',
  })
  newPassword: string;
}

export class UpdateUserForgotPasswordDto {
  @ApiProperty({
    type: String,
    default: 'Pass123!',
  })
  newPassword: string;
}

export class UserQuery {
  @ApiProperty({
    type: String,
    default: '1',
  })
  page?: string;

  @ApiProperty({
    type: String,
    default: '10',
  })
  limit?: string;

  @ApiProperty({
    enum: Role,
    isArray: true,
    default: [Role.vip_client],
  })
  role?: Role[];

  @ApiPropertyOptional({
    type: String,
    default: 'test',
  })
  search?: string;
}
