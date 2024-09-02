import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';

export class CreateBrandDto {
  @ApiProperty({
    type: String,
    default: 'Nike',
  })
  name: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
