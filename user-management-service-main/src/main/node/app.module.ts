import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { UserModule } from '@app/user';
@Module({
  imports: [CommonModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
