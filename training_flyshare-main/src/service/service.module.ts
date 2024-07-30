import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { RepositoryModule } from '../repository/repository.module';
import { DefaultUserService } from './user/defaultuser.service';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { DefaultAuthService } from './auth/defaultauth.service';
import { NotificationService } from './notification/notification.service';
import { DefaultNotificationService } from './notification/defaultnotification.service';
import { TokenService } from './token/token.service';
import { DefaultTokenService } from './token/defaulttoken.service';
import { FileService } from './file/file.service';
import { DefaultFileService } from './file/defaultfile.service';
import { DefaultGroupService } from './group/defaultgroup.service';
import { GroupService } from './group/group.service';

@Module({
  imports: [ConfigModule, RepositoryModule],
  providers: [
    { provide: UserService, useClass: DefaultUserService },
    { provide: AuthService, useClass: DefaultAuthService },
    { provide: NotificationService, useClass: DefaultNotificationService },
    { provide: TokenService, useClass: DefaultTokenService },
    { provide: FileService, useClass: DefaultFileService },
    { provide: GroupService, useClass: DefaultGroupService },
  ],
  exports: [UserService, AuthService, FileService, GroupService],
})
export class ServiceModule {}
