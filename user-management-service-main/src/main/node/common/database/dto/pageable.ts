import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';
import { constants } from '@app/common/database/constants';
import { Sort } from '@app/common/database/dto/sort';

export class Pageable {
  @IsOptional()
  @Min(0, { message: constants.PAGE_SHOULD_BE_POSITIVE })
  @IsInt({ message: constants.PAGE_SHOULD_BE_INTEGER })
  @Transform(({ value }) => parseInt(value))
  page!: number;

  @IsOptional()
  @Min(0, { message: constants.SIZE_SHOULD_BE_POSITIVE })
  @IsInt({ message: constants.SIZE_SHOULD_BE_INTEGER })
  @Transform(({ value }) => parseInt(value))
  size!: number;

  @IsOptional()
  @IsString({ message: constants.SORT_SHOULD_BE_A_STRING })
  @Matches(constants.SORT_STRING_PATTERN, {
    message: constants.INVALID_SORT_STRING,
  })
  @IsOptional()
  sort!: string | Sort<any>[];

  constructor(pageable: Partial<Pageable>) {
    Object.assign(this, pageable);
  }

  static of(page: number, size: number, sort?: Sort<any>[]): Pageable {
    return new Pageable({ page, size, sort });
  }
}
