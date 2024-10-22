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
import { PaymentModule } from './payment/payment.module';
import { VoucherModule } from './voucher/voucher.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { SubcategoryInstructionModule } from './subcategory_instruction/subcategory_instruction.module';
import { OrderModule } from './order/order.module';
import { LegitCheckModule } from './legit_check/legit_check.module';
import { ServiceModule } from './service/service.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    FileModule,
    PaymentModule,
    VoucherModule,
    BrandModule,
    CategoryModule,
    SubcategoryModule,
    SubcategoryInstructionModule,
    OrderModule,
    LegitCheckModule,
    ServiceModule,
    MailModule,
  ],
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
        { path: '/api/payments/notification', method: RequestMethod.POST },
      )
      .forRoutes('/api/*');
    consumer
      .apply(IsOwnerMiddleware)
      .forRoutes(
        { path: '/api/users/:id', method: RequestMethod.PUT },
        { path: '/api/users/change-password/:id', method: RequestMethod.PUT },
      );
  }
}
