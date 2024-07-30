import { Injectable, Logger } from '@nestjs/common';
import { AppConfig } from '../../config/app.config';
import { NotificationService } from './notification.service';
import { MailConfig } from '../../config/config.mail';

@Injectable()
export class DefaultNotificationService extends NotificationService {
  private readonly logger = new Logger(DefaultNotificationService.name);
  constructor(private mailConfig: MailConfig, private appConfig: AppConfig) {
    super();
  }

  async sendUserMail(from: string, to: string, subject: string, text: string) {
    this.logger.log('Sending a reset password link with a token');
    const mailOptions = {
      from,
      to,
      subject,
      text,
    };

    await this.mailConfig.transporter.sendMail(
      mailOptions,
      function (error, info) {
        if (error) {
          this.logger.log(error);
        } else {
          this.logger.log('Email sent: ' + info.response);
        }
      },
    );
  }
}
