import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { AppConfig } from './app.config';

@Injectable()
export class MailConfig {
  transporter: nodemailer.Transporter;
  constructor(private config: AppConfig) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mailer.authemail,
        pass: config.mailer.authpassword,
      },
    });
  }
}
