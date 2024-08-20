export class RegisterUserDto {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
