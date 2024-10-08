import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';

export class UserDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;
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
  gender?: Gender;
  @ApiProperty({
    enum: Role,
    default: Role.client,
  })
  role?: Role;
  @ApiProperty({
    type: String,
    default: '+1234567890',
  })
  phone_number?: string;
  @ApiProperty({
    type: String,
    default: 'VLX',
  })
  certificate_prefix?: string;
  @ApiProperty({
    type: Date,
    default: new Date('01-01-1999'),
  })
  created_at?: Date;
  @ApiProperty({
    type: String,
    default: 'JF839H0S'
  })
  referral?: string;
  @ApiProperty({
    type: String,
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJle...',
  })
  token?: string;
}

export class LoginRes {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

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
    enum: Role,
    default: Role.client,
  })
  role: string;

  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    type: Date,
  })
  updated_at: Date;

  @ApiProperty({
    type: String,
    default: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJle...',
  })
  token?: string;
}
