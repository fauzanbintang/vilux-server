import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateSubcategoryInstructionDto {
  @ApiProperty({
    type: String,
    default: 'Outer Shoes',
  })
  name: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  subcategory_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  icon_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  example_image_id: string;
}

export class UpdateSubcategoryInstructionDto extends PartialType(
  CreateSubcategoryInstructionDto,
) {}

export class SubcategoryInstructionsQuery {
  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  subcategory_id: string;
}
