import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from './config/config.module';
import { ControllerModule } from './controller/controller.module';
import { TasksService } from './cronjob/cron.job';
import { AuthGuard } from './guard/auth.guard';
import { TokenRepository } from './repository/repository.token';

@Module({
  imports: [ConfigModule, ControllerModule, ScheduleModule.forRoot()],
  controllers: [],
  providers: [AuthGuard, TasksService, TokenRepository],
})
export class AppModule {}
