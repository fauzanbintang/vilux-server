export class ResponseDto<T> {
  data?: T;
  errors?: string;
}

export class DeleteDto {
  message: string;
}
