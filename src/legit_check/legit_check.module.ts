import { Module } from '@nestjs/common';
import { LegitCheckService } from './legit_check.service';
import { LegitCheckController } from './legit_check.controller';
import { FileModule } from 'src/file/file.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  controllers: [LegitCheckController],
  providers: [LegitCheckService],
  imports: [FileModule, PaymentModule],
})

export class LegitCheckModule { }
