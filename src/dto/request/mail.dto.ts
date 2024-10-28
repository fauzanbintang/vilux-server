import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateMailDto {
  @ApiProperty({
    type: String,
    default: 'test@mail.com',
  })
  email: string;
}
