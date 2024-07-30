import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from '../../payload/request/loginrequest';
import { UserForgotPasswordRequest } from '../../payload/request/user-forgot-password-request';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { AppConfig } from '../../config/app.config';
import { TokenService } from '../token/token.service';
import { PasswordResetRequest } from '../../payload/request/user-reset-password';
import { ChangePasswordRequest } from '../../payload/request/user-reset-oldpassword';

@Injectable()
export class DefaultAuthService extends AuthService {
  private readonly logger = new Logger(DefaultAuthService.name);

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private appConfig: AppConfig,
    private tokenService: TokenService,
    private jwtService: JwtService,
  ) {
    super();
  }

  async userlogin(req: LoginRequest) {
    this.logger.log('User tries to login');

    const useremail = await this.userService.getUserByEmail(req.email);
    if (!useremail) {
      throw new NotFoundException('User not found');
    }
    const password = await bcrypt.compare(req.password, useremail.password);
    if (!password) {
      throw new UnauthorizedException('Enter correct password');
    }
    const tokenmail = {
      name: req.email,
    };

    return {
      token: this.jwtService.sign(tokenmail, {
        secret: this.appConfig.jwt.token,
        expiresIn: this.appConfig.jwt.expiresin,
      }),
    };
  }

  async forgetpassword(req: UserForgotPasswordRequest) {
    this.logger.log('Reset password link sends');
    const useremail = await this.userService.getUserByEmail(req.email);
    if (!useremail) {
      throw new NotFoundException('User not found');
    }

    const otpcode = new UserForgotPasswordRequest();
    otpcode.email = req.email;

    const tokencode = await this.tokenService.createToken(otpcode);
    await this.notificationService.sendUserMail(
      this.appConfig.mailer.authemail,
      req.email,
      'Click here to change the password',
      `http://localhost:3002/resetpassword/${tokencode.code}`,
    );
    return {
      message: 'Reset link send successfully',
    };
  }

  async resetPassword(req: PasswordResetRequest) {
    this.logger.log('User tries to reset the password');
    const userToken = await this.tokenService.findToken(req.code);
    if (!userToken) {
      throw new NotFoundException('Please enter valid otp');
    }
    const istokenValid = await this.tokenService.isTokenValid(req.code);
    if (istokenValid) {
      throw new NotFoundException('Token Expired');
    }
    return this.userService.updatePassword(req.email, req.password);
  }

  async resetOldPassword(req: ChangePasswordRequest) {
    this.logger.log('User tries to reset the oldpassword');
    const useremail = await this.userService.getUserByEmail(req.email);
    if (!useremail) {
      throw new NotFoundException('User not found');
    }
    const verifyPassword = await bcrypt.compare(
      req.oldpassword,
      useremail.password,
    );
    if (!verifyPassword) {
      throw new BadRequestException('Old password is incorrect');
    }
    if (req.newpassword !== req.confirmpassword) {
      throw new BadRequestException(
        'confirm password and new password should be same',
      );
    }
    return this.userService.updatePassword(req.email, req.newpassword);
  }
}
