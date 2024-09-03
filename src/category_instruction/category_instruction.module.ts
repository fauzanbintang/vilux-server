import { Module } from '@nestjs/common';
import { CategoryInstructionService } from './category_instruction.service';
import { CategoryInstructionController } from './category_instruction.controller';

@Module({
  controllers: [CategoryInstructionController],
  providers: [CategoryInstructionService],
})
export class CategoryInstructionModule {}
