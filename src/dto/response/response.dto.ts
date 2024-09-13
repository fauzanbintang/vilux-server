import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T, U = string> {
  @ApiProperty({
    type: String,
    example: 'Operation completed successfully',
    required: false,
  })
  message?: U;

  @ApiProperty({ required: false })
  data?: T;

  @ApiProperty({ type: String, required: false })
  errors?: string;
}
