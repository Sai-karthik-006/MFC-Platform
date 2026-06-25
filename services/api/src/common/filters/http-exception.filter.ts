import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const path = request.originalUrl;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      return response.status(status).json({
        success: false,
        statusCode: status,
        message,
        timestamp,
        path,
      });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Internal server error';

    return response.status(status).json({
      success: false,
      statusCode: status,
      message,
      timestamp,
      path,
    });
  }
}
