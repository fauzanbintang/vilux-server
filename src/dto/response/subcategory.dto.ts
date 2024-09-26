import { ApiProperty } from '@nestjs/swagger';

export class SubcategoryDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

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

  @ApiProperty({
    type: String,
    format: 'date-time',
    default: '2024-01-01T01::41.495Z',
  })
  created_at: Date;

  @ApiProperty({
    type: String,
    format: 'date-time',
    default: '2024-01-01T01::41.495Z',
  })
  updated_at: Date;
}
