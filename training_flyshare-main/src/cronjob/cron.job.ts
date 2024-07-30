import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TokenRepository } from '../repository/repository.token';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private tokenRepository: TokenRepository) {}

  @Cron('0 0 0 * * *')
  async deleteToken() {
    this.logger.log('Expired token will be deleted on every day at 12:00 AM');
    await this.tokenRepository.deleteExpiredToken();
  }
}
