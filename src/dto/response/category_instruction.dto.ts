import { ApiProperty } from '@nestjs/swagger';

export class CategoryInstructionDto {
  @ApiProperty({
    type: String,
    default: 'Outer Shoes',
  })
  name: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  category_id: string;
}
