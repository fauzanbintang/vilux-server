import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof ZodError) {
      return response.status(400).json({
        errors: exception.issues,
      });
    } else if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      return response.status(exception.getStatus()).json({
        message: exception.message,
        data:
          typeof exceptionResponse === 'object' && 'data' in exceptionResponse
            ? exceptionResponse['data']
            : null,
      });
    } else {
      return response.status(500).json({
        errors: exception,
      });
    }
  }
}
