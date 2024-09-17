import { Module } from '@nestjs/common';
import { LegitCheckService } from './legit_check.service';
import { LegitCheckController } from './legit_check.controller';

@Module({
  controllers: [LegitCheckController],
  providers: [LegitCheckService],
})

export class LegitCheckModule {}
