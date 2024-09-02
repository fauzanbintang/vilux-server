import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { LogMiddleware } from './middlewares/log.middleware';
import { AuthModule } from './auth/auth.module';
import {
  AuthenticationMiddleware,
  IsOwnerMiddleware,
} from './middlewares/auth.middleware';
import { FileModule } from './file/file.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [CommonModule, UserModule, AuthModule, FileModule, BrandModule],
  controllers: [],
  providers: [LogMiddleware, AuthenticationMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('/api/*');
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/api/auth/login', method: RequestMethod.POST },
        { path: '/api/auth/register', method: RequestMethod.POST },
      )
      .forRoutes('/api/*');
    // consumer
    //   .apply(IsOwnerMiddleware)
    //   .forRoutes({ path: '/api/users', method: RequestMethod.GET });
  }
}
