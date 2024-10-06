import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  legit_check_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  service_id: string;

  @ApiPropertyOptional({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  voucher_id?: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
