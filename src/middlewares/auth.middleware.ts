import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { verifyToken } from 'src/helpers/jwt';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthenticationMiddleware
  implements NestMiddleware<Request, Response>
{
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookies = req.cookies;
    const token = cookies['JWT'] as string;

    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }

    let payload;
    try {
      payload = verifyToken(token, this.configService);
    } catch (err) {
      if (err.message === 'jwt expired') {
        throw new HttpException('Token has expired', 401);
      } else {
        throw new HttpException('Invalid token', 401);
      }
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    req.user = user;
    next();
  }
}

@Injectable()
export class IsOwnerMiddleware implements NestMiddleware<Request, Response> {
  constructor(private prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new HttpException('Unauthorized: User not authenticated', 401);
    }

    const identifier = req.params.id;

    if (!identifier) {
      throw new HttpException('Bad Request: Missing identifier', 400);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: identifier,
      },
    });

    if (!user) {
      throw new HttpException('Not Found: User not found', 404);
    }

    if (user.id !== loggedInUser.id && loggedInUser.role !== 'admin') {
      throw new HttpException('Forbidden: Not authorized', 403);
    }

    next();
  }
}
