import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { constants } from '../../utils/constant';

export class ChangePasswordRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  oldpassword: string;

  @IsNotEmpty()
  @Matches(constants.PASSWORD_REGEX, { message: 'Password is too weak' })
  newpassword: string;

  @IsNotEmpty()
  confirmpassword: string;
}
