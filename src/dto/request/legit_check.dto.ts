import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LegitCheckStatus, LegitStatus } from '@prisma/client';
import { string } from 'zod';

export class LegitCheckBrandCategoryDto {
  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  brand_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  category_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  subcategory_id: string;
}

export class LegitCheckImageDto {
  // empty string to create or fill the id to update
  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  legit_check_image_id: string;
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
  @ApiProperty({
    type: String,
    default: 'Inside Label',
    description: 'Outer Shoes, Inside Label, Insole, Additional, etc',
  })
  name: string;
  @ApiProperty({
    type: Boolean,
    default: 'true',
  })
  status?: boolean;
}

export class LegitCheckImagesDto {
  @ApiProperty({
    type: String,
    default: 'Nike Cortez',
  })
  product_name: string;
  @ApiProperty({
    type: [LegitCheckImageDto],
    default: [
      {
        legit_check_image_id: '00000000-0000-0000-0000-000000000001',
        file_id: '00000000-0000-0000-0000-000000000001',
        name: 'Outer Shoes',
      },
      {
        legit_check_image_id: '00000000-0000-0000-0000-000000000002',
        file_id: '00000000-0000-0000-0000-000000000002',
        name: 'Insole',
      },
    ],
    description: 'List of FileID',
  })
  legit_check_images: LegitCheckImageDto[];
  @ApiProperty({
    type: String,
    default: 'This is client note',
  })
  client_note: string;
}

export class LegitCheckValidateDataDto {
  @ApiProperty({
    type: [LegitCheckImageDto],
    default: [
      {
        legit_check_image_id: '00000000-0000-0000-0000-000000000001',
        status: false,
      },
      {
        legit_check_image_id: '00000000-0000-0000-0000-000000000002',
        status: true,
      },
    ],
    description: 'List of FileID',
  })
  legit_check_images: LegitCheckImageDto[];
  @ApiProperty({
    type: String,
    default: 'This is admin note',
  })
  admin_note: string;
}

export class LegitCheckCompletedDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  cover_id: string;
  @ApiProperty({
    type: String,
    default: 'authentic',
  })
  legit_status: LegitStatus;
  @ApiProperty({
    type: String,
    default: 'This is admin note',
  })
  admin_note: string;
}

export class LegitCheckPaginationQuery {
  @ApiProperty({
    type: String,
    default: '1',
  })
  page?: string;

  @ApiProperty({
    type: String,
    default: '10',
  })
  limit?: string;

  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  user_id: string;

  @ApiProperty({
    enum: LegitCheckStatus,
    isArray: true,
    default: [LegitCheckStatus.brand_category],
  })
  check_status?: LegitCheckStatus[];
}
