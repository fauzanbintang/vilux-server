import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export const generateToken = (
  payload: any,
  configService: ConfigService,
): string => {
  return jwt.sign(payload, configService.get('JWT_SECRET'), {
    expiresIn: '1d',
  });
};

export const verifyToken = (
  token: string,
  configService: ConfigService,
): any => {
  return jwt.verify(token, configService.get('JWT_SECRET'));
};
