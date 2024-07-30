import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../guard/auth.guard';
import { ConfigModule } from '../config/config.module';
import { ServiceModule } from '../service/service.module';
import { FileController } from './controller.file';
import { AuthController } from './controller.auth';
import { UserController } from './controller.user';
import { GroupController } from './controller.group';

@Module({
  imports: [ConfigModule, ServiceModule],
  providers: [JwtService, AuthGuard],
  controllers: [
    UserController,
    AuthController,
    FileController,
    GroupController,
  ],
  exports: [],
})
export class ControllerModule {}
