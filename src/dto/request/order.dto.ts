import { JsonValue } from '@prisma/client/runtime/library';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({
    type: String,
    default: 'test',
  })
  code: string;

  @ApiProperty({
    type: 'object',
    default: {
      data: 'test',
    },
  })
  client_info: JsonValue;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  payment_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  legit_check_id: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  voucher_id: string;

  @ApiProperty({
    type: String,
    default: '10000',
  })
  original_amount: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
