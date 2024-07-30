import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { GroupRepository } from './repository.crud';
import { FileRepository } from './repository.file';
import { TokenRepository } from './repository.token';
import { UserRepository } from './repository.user';

@Module({
  imports: [ConfigModule],
  providers: [UserRepository, TokenRepository, FileRepository, GroupRepository],
  exports: [UserRepository, TokenRepository, FileRepository, GroupRepository],
})
export class RepositoryModule {}
