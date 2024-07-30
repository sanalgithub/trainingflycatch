import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@app/app.module';
import { AppConfig, AppProperties } from '@app/common/config';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.get(AppConfig).config(app);
  const logger = new Logger('main');
  const { server } = app.get(AppProperties);
  await app.listen(server.port, () => {
    logger.log(`server started on port ${server.port}`);
    // logger = null; // release the instance
  });
}
bootstrap();
