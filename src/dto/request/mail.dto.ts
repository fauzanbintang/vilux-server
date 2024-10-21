import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateMailDto {
  @ApiProperty({
    type: String,
  })
  to: string;

  @ApiProperty({
    type: String,
  })
  subject: string;

  @ApiProperty({
    type: String,
  })
  html: string;
}

export class UpdateMailDto extends PartialType(CreateMailDto) { }
