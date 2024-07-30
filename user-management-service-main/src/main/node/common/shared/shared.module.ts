import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionHandler } from '@app/common/shared/filters/exception.filter';
import { LoggerMiddleware } from '@app/common/shared/middleware/logger.middleware';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionHandler,
    },
    LoggerMiddleware,
  ],
  exports: [],
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('/*');
  }
}
