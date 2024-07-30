import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserForgotPasswordRequest } from '../payload/request/user-forgot-password-request';
import { LoginRequest } from '../payload/request/loginrequest';
import { AuthService } from '../service/auth/auth.service';
import { PasswordResetRequest } from '../payload/request/user-reset-password';
import { ChangePasswordRequest } from '../payload/request/user-reset-oldpassword';
import { AuthGuard } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async userlogin(@Body() req: LoginRequest) {
    return this.authService.userlogin(req);
  }
  @Post('forgetpassword')
  async passwordforget(@Body() req: UserForgotPasswordRequest) {
    return this.authService.forgetpassword(req);
  }

  @Post('resetpassword')
  async passwordReset(@Body() req: PasswordResetRequest) {
    return this.authService.resetPassword(req);
  }
  @UseGuards(AuthGuard)
  @Post('oldresetpassword')
  async oldPasswordReset(@Body() req: ChangePasswordRequest) {
    return this.authService.resetOldPassword(req);
  }
}
