import { ApiProperty } from '@nestjs/swagger';
import { CategoryName } from '@prisma/client';

export class CategoryDto {
  @ApiProperty({
    enum: CategoryName,
    default: CategoryName.sneakers,
  })
  name: CategoryName;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}
