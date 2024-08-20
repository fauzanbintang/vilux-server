import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { generateToken } from 'src/helpers/jwt';
import { comparePassword, hashPassword } from 'src/helpers/bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/dto/user.dto';
import { LoginUserDto, RegisterUserDto } from 'src/dto/auth.dto';
import { AuthValidate } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private configService: ConfigService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserDto> {
    this.logger.debug(`Register new user ${JSON.stringify(registerUserDto)}`);

    const validatedRegisterUser = this.validationService.validate(
      AuthValidate.Register,
      registerUserDto,
    );

    const user = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: validatedRegisterUser.email },
          { username: validatedRegisterUser.username },
        ],
      },
    });

    if (user) {
      throw new HttpException('email or username already exists', 400);
    }

    const createdUser = await this.prismaService.user.create({
      data: {
        username: validatedRegisterUser.username,
        email: validatedRegisterUser.email,
        password: await hashPassword(validatedRegisterUser.password),
        role: registerUserDto.role,
      },
    });

    return {
      username: createdUser.username,
      email: createdUser.email,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<UserDto> {
    this.logger.debug(`Login user ${JSON.stringify(loginUserDto)}`);

    const validatedLogin = this.validationService.validate(
      AuthValidate.Login,
      loginUserDto,
    );
    const user = await this.prismaService.user.findFirst({
      where: {
        email: validatedLogin.email,
      },
    });

    if (!user) {
      throw new HttpException('email or password is incorrect', 401);
    }

    const isMatch = comparePassword(validatedLogin.password, user.password);

    if (!isMatch) {
      throw new HttpException('email or password is incorrect', 401);
    }

    const token = generateToken(user, this.configService);

    return {
      username: user.username,
      email: user.email,
      token,
    };
  }
}
