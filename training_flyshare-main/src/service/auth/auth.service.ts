import { UserForgotPasswordRequest } from '../../payload/request/user-forgot-password-request';
import { LoginRequest } from '../../payload/request/loginrequest';
import { PasswordResetRequest } from '../../payload/request/user-reset-password';
import { ChangePasswordRequest } from '../../payload/request/user-reset-oldpassword';

export abstract class AuthService {
  abstract userlogin(req: LoginRequest);
  abstract forgetpassword(req: UserForgotPasswordRequest);
  abstract resetPassword(req: PasswordResetRequest);
  abstract resetOldPassword(req: ChangePasswordRequest);
}
