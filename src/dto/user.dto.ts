import { Gender, Role } from '@prisma/client';

export class UserDto {
  username: string;
  email: string;
  full_name: string;
  date_of_birth: Date;
  gender?: Gender;
  role?: Role;
  token?: string;
}
