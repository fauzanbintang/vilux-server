import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBannerDto {
  @ApiProperty({
    type: String,
    default: 'Check Legit Tips',
  })
  name: string;

  @ApiPropertyOptional({
    type: String,
    default: 'https://legitcheck.app/category/guides',
  })
  link: string;

  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  file_id: string;
}

export class UpdateBannerDto extends PartialType(CreateBannerDto) {}
