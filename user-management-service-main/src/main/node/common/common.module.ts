import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@app/common/config';
import { DatabaseModule } from '@app/common/database';
import { SharedModule } from '@app/common/shared';

@Global()
@Module({
  imports: [ConfigModule, DatabaseModule.forRoot(), SharedModule],
  exports: [ConfigModule, SharedModule],
})
export class CommonModule {}
