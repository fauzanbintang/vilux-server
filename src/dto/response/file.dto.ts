import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty({
    type: String,
    default: '00000000-0000-0000-0000-000000000000',
  })
  id: string;

  @ApiProperty({
    type: String,
    default: 'test',
  })
  path: string;

  @ApiProperty({
    type: String,
    default: 'test',
  })
  file_name: string;

  @ApiProperty({
    type: String,
    default: 'test',
  })
  url: string;
}
