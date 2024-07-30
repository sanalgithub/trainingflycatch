import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { constants } from '../../utils/constant';

export class PasswordResetRequest {
  code: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Matches(constants.PASSWORD_REGEX, { message: 'Password is too weak' })
  password: string;

  @IsNotEmpty()
  confirmpassword: string;
}
