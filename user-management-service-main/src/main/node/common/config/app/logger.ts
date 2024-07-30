import { ConsoleLogger, HttpException } from '@nestjs/common';

export class CustomLogger extends ConsoleLogger {
  error(
    message: unknown,
    stack?: unknown,
    context?: unknown,
    ...rest: unknown[]
  ): void {
    if (message instanceof Error || message instanceof HttpException) {
      super.error(this.getStack(message));
      return;
    }
    if (stack instanceof Error || stack instanceof HttpException) {
      super.error(message + '\n' + this.getStack(stack));
      return;
    }
    super.error(message, stack, context, rest);
  }

  private getStack(exception: HttpException | Error): string | undefined {
    if (exception instanceof HttpException) {
      let message = exception.stack as string;
      const cause = exception.cause;
      if (cause && typeof cause === 'object' && !Array.isArray(cause)) {
        message += '\n Caused By ' + this.getStack(cause);
      }
      return message;
    }

    if (exception instanceof Error) {
      return exception.stack as string;
    }
    return undefined;
  }
}
