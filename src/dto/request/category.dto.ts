import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CategoryName } from '@prisma/client';

export class CreateCategoryDto {
  // cyclic dependecy if i use "categoryName"
  @ApiProperty({
    enum: CategoryName,
    default: 'sneakers',
  })
  name: CategoryName;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
