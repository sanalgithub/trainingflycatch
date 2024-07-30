import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common/database';
import { UserController } from '@app/user/controller/user.controller';
import { User } from '@app/user/models/user.models';
import { MongooseUserRepository } from '@app/user/repository/mongoose-user.repository';
import { UserRepository } from '@app/user/repository/user.repository';
import { DefaultUserService } from '@app/user/services/default-user.service';
import { UserService } from '@app/user/services/user.service';
import { PasswordEncoder } from '@app/user/utils/password.encoder';

@Module({
  imports: [DatabaseModule.forFeature(User)],
  controllers: [UserController],
  providers: [
    { provide: UserRepository, useClass: MongooseUserRepository },
    { provide: UserService, useClass: DefaultUserService },
    PasswordEncoder,
  ],
  exports: [UserService],
})
export class UserModule {}
