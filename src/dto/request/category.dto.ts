import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    default: 'footwear',
  })
  name: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
