import {
  Page,
  Pageable,
  QueryByExampleRepository,
  ReferenceKeys,
} from '@app/common/database';
import { User } from '@app/user';
import { UserSearch } from '@app/user/dto/user-search.dto';

export abstract class UserRepository extends QueryByExampleRepository<User> {
  abstract existsByEmailOrPhoneNumber(
    email?: string,
    phoneNumber?: string,
  ): Promise<boolean>;

  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findByPhoneNumber(phoneNumber: string): Promise<User | undefined>;
  abstract findBySearch(
    search: UserSearch,
    pageable: Pageable,
    ...joins: ReferenceKeys<User>[]
  ): Promise<Page<User>>;
}
