import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateSubcategoryDto {
  @ApiProperty({
    type: String,
    default: 'sneakers',
  })
  name: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  category_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {}
