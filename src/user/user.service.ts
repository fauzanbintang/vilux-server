import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { Role } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import {
  UpdateUserDto,
  UpdateUserPasswordDto,
  UserQuery,
} from 'src/dto/request/auth.dto';
import { UserDto } from 'src/dto/response/user.dto';
import { comparePassword, hashPassword } from 'src/helpers/bcrypt';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async getUsers(query: UserQuery): Promise<any> {
    this.logger.debug('Get all users');

    const whereClause: any = {};

    if (query.search) {
      whereClause.OR = [
        { username: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { full_name: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.role && query.role.length >= 1) {
      whereClause.role = {
        in: query.role,
      };
    }

    const count = await this.prismaService.user.count({
      where: whereClause,
    });

    const page = query.page ? Math.max(1, +query.page) : 1;
    const limit = query.limit ? Math.max(1, +query.limit) : 10;

    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereClause,
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        date_of_birth: true,
        gender: true,
        role: true,
        created_at: true,
      },
    });

    return {
      count,
      users,
    };
  }

  async getUser(id: string): Promise<UserDto> {
    this.logger.debug(`Get user by id ${id}`);

    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        full_name: true,
        date_of_birth: true,
        gender: true,
        role: true,
        phone_number: true,
        created_at: true,
        certificate_prefix: true,
      },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const voucher = await this.prismaService.voucher.findFirst({
      where: {
        user_id: user.id,
      },
      select: {
        code: true,
      },
    });

    user['referral'] = voucher ? voucher.code : null;

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    this.logger.debug(`Update user ${id} ${JSON.stringify(updateUserDto)}`);

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (updateUserDto.certificate_prefix && user.role !== 'vip_client') {
      throw new HttpException(
        'Only VIP client can change certificate prefix',
        400,
      );
    }

    if (updateUserDto.certificate_prefix.length !== 3) {
      throw new HttpException('Certificate prefix must be 3 characters', 400);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      date_of_birth: updatedUser.date_of_birth,
      gender: updatedUser.gender,
      certificate_prefix: updatedUser.certificate_prefix,
    };
  }

  async changePassword(
    id: string,
    updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    this.logger.debug(`Change password for user ${id}`);

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    const isMatch = await comparePassword(
      updateUserPasswordDto.oldPassword,
      user.password,
    );

    if (!isMatch) {
      throw new HttpException('Old password is incorrect', 400);
    }

    await this.prismaService.user.update({
      where: { id },
      data: {
        password: await hashPassword(updateUserPasswordDto.newPassword),
      },
    });
  }

  async getUserCount() {
    const counts = await this.prismaService.user.groupBy({
      by: ['role'],
      where: {
        role: {
          in: [Role.client, Role.vip_client],
        },
      },
      _count: {
        role: true,
      },
    });

    const result = counts.reduce(
      (acc, count) => {
        if (count.role === Role.client) {
          acc.count.client = count._count.role;
        } else if (count.role === Role.vip_client) {
          acc.count.vip_client = count._count.role;
        }
        return acc;
      },
      {
        count: {
          client: 0,
          vip_client: 0,
        },
      },
    );

    return result;
  }

  async removeOwnAccount(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new HttpException('user not found', 404);
    }

    await this.prismaService.user.delete({
      where: { id },
    });
  }
}
