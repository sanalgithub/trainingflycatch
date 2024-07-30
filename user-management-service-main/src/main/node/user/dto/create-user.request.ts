import {
  IsBoolean,
  IsEmail,
  isEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { constants } from '@app/user/constants';

export class CreateUserRequest {
  @IsOptional()
  @IsString({ message: constants.FIRST_NAME_SHOULD_BE_STRING })
  firstName?: string;

  @IsOptional()
  @IsString({ message: constants.MIDDLE_NAME_SHOULD_BE_STRING })
  middleName?: string;

  @IsOptional()
  @IsString({ message: constants.LAST_NAME_SHOULD_BE_STRING })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: constants.EMAIL_SHOULD_BE_VALID })
  email?: string;

  @IsNotEmpty({ message: constants.COUNTRY_CODE_SHOULD_BE_REQURIED })
  countryCode?: string;

  @IsNotEmpty({ message: constants.EMAIL_OR_PHONENUMBER_IS_REQURIED })
  @ValidateIf((o, value) => isEmpty(o.email) || !isEmpty(value))
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: constants.PASSWORD_SHOULD_BE_VALID_STRING })
  password?: string;

  @IsOptional()
  @IsBoolean({ message: constants.ENABLED_SHOULD_BE_VALID_BOOLEAN })
  enabled?: boolean;
}
