import { ApiProperty } from '@nestjs/swagger';

export class BrandDto {
  @ApiProperty({
    type: String,
    default: 'Nike',
  })
  name: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  fileId: string;
}
