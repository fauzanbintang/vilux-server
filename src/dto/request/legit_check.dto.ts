import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LegitCheckStatus, LegitStatus, PaymentStatus } from '@prisma/client';
import { string } from 'zod';

export class LegitCheckBrandCategoryDto {
  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id?: string;

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
    default: '00000000-0000-0000-0000-000000000000',
  })
  subcategory_instruction_id?: string;

  @ApiProperty({
    type: Boolean,
    default: null,
  })
  status?: boolean;
}

export class LegitCheckImagesDto {
  @ApiProperty({
    type: String,
    default: 'Armani Clutch',
  })
  product_name: string;

  @ApiProperty({
    type: [LegitCheckImageDto],
    default: [
      {
        file_id: '00000000-0000-0000-0000-000000000001',
        subcategory_instruction_id: '00000000-0000-0000-0000-000000000001',
      },
      {
        file_id: '00000000-0000-0000-0000-000000000002',
        subcategory_instruction_id: '00000000-0000-0000-0000-000000000002',
      },
    ],
    description: 'List of LegitCheckImage',
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
    enum: LegitStatus,
    default: LegitStatus.authentic,
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

  @ApiPropertyOptional({
    enum: PaymentStatus,
    isArray: true,
    default: [PaymentStatus.pending],
  })
  payment_status?: PaymentStatus[];
}
