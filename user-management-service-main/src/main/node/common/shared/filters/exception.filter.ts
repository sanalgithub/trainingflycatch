import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { isArray } from 'class-validator';
import { Response } from 'express';
import { ApiResponse } from '@app/common/shared/dto/api.response';

@Catch()
@Injectable()
export class HttpExceptionHandler
  implements ExceptionFilter<HttpException | Error>
{
  private readonly logger = new Logger(HttpExceptionHandler.name);

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      this.handleExceptions(exception, response);
    } else if (exception instanceof Error) {
      this.handleErrors(exception, response);
    }
  }

  private handleExceptions(exception: HttpException, res: Response): void {
    const status = exception.getStatus();
    this.logger.error(exception);
    const message = (exception.getResponse() as any).message;
    res.status(status).json(
      ApiResponse.create({
        code: status,
        status: false,
        message: isArray(message) ? message.join(', ') : message,
      }),
    );
  }

  private handleErrors(error: Error, res: Response): void {
    this.logger.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ApiResponse.create({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        status: false,
        message: error.message,
      }),
    );
  }
}
