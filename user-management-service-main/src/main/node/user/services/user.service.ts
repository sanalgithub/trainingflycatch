import { Page, Pageable } from '@app/common/database';
import { CreateUserRequest } from '@app/user/dto/create-user.request';
import { UpdateUserRequest } from '@app/user/dto/update-user.request';
import { UserSearch } from '@app/user/dto/user-search.dto';
import { User } from '@app/user/models/user.models';

export abstract class UserService {
  abstract getById(id: string): Promise<User>;
  abstract getAllUsers(
    search: UserSearch,
    pageable: Pageable,
  ): Promise<Page<User>>;

  abstract create(request: CreateUserRequest): Promise<User>;
  abstract update(id: string, request: UpdateUserRequest): Promise<User>;
  abstract delete(id: string): Promise<void>;

  abstract getByPhoneNumber(phoneNumber: string): Promise<User>;

  /**
   * checks if the provided credentials are correct.
   * @param email the email of the user
   * @param password the password of the user
   *
   * @returns the user if credentials are correct else undefined
   */
  abstract checkEmailCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined>;
}
