import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { generateToken } from 'src/helpers/jwt';
import { comparePassword, hashPassword } from 'src/helpers/bcrypt';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { LoginRes, UserDto } from 'src/dto/response/user.dto';
import { LoginUserDto, RegisterUserDto } from 'src/dto/request/auth.dto';
import { AuthValidate } from './auth.validation';
import { Gender, Role } from '@prisma/client';

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
        role: Role[registerUserDto.role],
        full_name: registerUserDto.full_name,
        date_of_birth: new Date(registerUserDto.date_of_birth),
        gender: Gender[registerUserDto.gender],
        phone_number: registerUserDto.phone_number || null,
      },
    });

    return {
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      full_name: createdUser.full_name,
      date_of_birth: createdUser.date_of_birth,
      gender: createdUser.gender,
      role: createdUser.role,
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginRes> {
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

    if (user.verified_email === false) {
      throw new HttpException('email is not verified', 401);
    }

    const isMatch = await comparePassword(
      validatedLogin.password,
      user.password,
    );

    if (!isMatch) {
      throw new HttpException('email or password is incorrect', 401);
    }

    const token = generateToken(user, this.configService);

    delete user.password;

    const fmc_token = await this.prismaService.fCMToken.findFirst({
      select: { id: true },
      where: {
        user_id: user.id,
        token: loginUserDto.fcm_token,
      },
    });
    if (!fmc_token) {
      await this.prismaService.fCMToken.create({
        data: {
          token: loginUserDto.fcm_token,
          user_id: user.id,
          role: user.role
        },
      });
    }

    return {
      ...user,
      token,
    };
  }
}
