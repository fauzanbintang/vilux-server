import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';

export class UserDto {
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
    default: 'test',
  })
  token?: string;
}