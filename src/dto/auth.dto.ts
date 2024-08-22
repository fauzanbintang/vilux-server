import { Gender, Role } from '@prisma/client';

export class RegisterUserDto {
  username: string;
  email: string;
  password: string;
  role: Role;
  full_name: string;
  date_of_birth: Date;
  gender: Gender;
}

export class LoginUserDto {
  email: string;
  password: string;
}
