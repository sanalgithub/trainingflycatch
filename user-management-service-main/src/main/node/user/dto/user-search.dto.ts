import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';
import { constants } from '@app/user/constants';

export class UserSearch {
  @IsOptional()
  @IsEmail({}, { message: constants.EMAIL_SHOULD_BE_VALID })
  email!: string;

  @IsOptional()
  @IsString({ message: constants.COUNTRY_CODE_SHOULD_BE_A_STRING })
  countryCode!: string;

  @IsOptional()
  @IsString({ message: constants.PHONE_NUMBER_SHOULD_BE_A_STRING })
  phoneNumber!: string;

  @IsOptional()
  @IsString({ message: constants.FIRST_NAME_SHOULD_BE_STRING })
  firstName!: string;

  @IsOptional()
  @IsString({ message: constants.MIDDLE_NAME_SHOULD_BE_STRING })
  middleName!: string;

  @IsOptional()
  @IsString({ message: constants.LAST_NAME_SHOULD_BE_STRING })
  lastName!: string;

  @IsOptional()
  @IsBoolean({ message: constants.ENABLED_SHOULD_BE_VALID_BOOLEAN })
  @Transform(({ value }) =>
    value?.toLowerCase() === 'true'
      ? true
      : value?.toLowerCase() === 'false'
      ? false
      : value,
  )
  enabled!: boolean;

  @IsOptional()
  @IsString({ message: constants.USER_SEARCH_SHOULD_BE_STRING })
  q!: string;

  constructor(search?: Partial<UserSearch>) {
    Object.assign(this, search);
  }
}
