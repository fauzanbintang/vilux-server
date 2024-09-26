import { Module } from '@nestjs/common';
import { SubcategoryInstructionService } from './subcategory_instruction.service';
import { SubcategoryInstructionController } from './subcategory_instruction.controller';

@Module({
  controllers: [SubcategoryInstructionController],
  providers: [SubcategoryInstructionService],
})
export class SubcategoryInstructionModule {}
