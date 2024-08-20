import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { verifyToken } from 'src/helpers/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
  ) {}
  async use(req: Request, res: Response, next: (error?: any) => void) {
    const token = req.headers['authorization'] as string;

    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }

    const payload = verifyToken(token, this.configService);
    const user = await this.prismaService.user.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    req['user'] = user;
    next();
  }
}
