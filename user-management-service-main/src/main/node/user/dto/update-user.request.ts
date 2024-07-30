import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { constants } from '@app/user/constants';

export class UpdateUserRequest {
  @IsOptional()
  @IsString({ message: constants.FIRST_NAME_SHOULD_BE_STRING })
  firstName?: string;

  @IsOptional()
  @IsString({ message: constants.MIDDLE_NAME_SHOULD_BE_STRING })
  middleName?: string;

  @IsOptional()
  @IsString({ message: constants.LAST_NAME_SHOULD_BE_STRING })
  lastName?: string;

  @IsOptional({})
  @IsString({ message: constants.PASSWORD_SHOULD_BE_VALID_STRING })
  password?: string;

  @IsOptional()
  @IsBoolean({ message: constants.ENABLED_SHOULD_BE_VALID_BOOLEAN })
  enabled?: boolean;
}
