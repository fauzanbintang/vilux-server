export class ResponseDto<T, U = string> {
  message?: U;
  data?: T;
  errors?: string;
}