import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { isEmpty } from 'class-validator';
import { Pageable, Page } from '@app/common/database';
import { constants } from '@app/user/constants';
import { CreateUserRequest } from '@app/user/dto/create-user.request';
import { UpdateUserRequest } from '@app/user/dto/update-user.request';
import { UserSearch } from '@app/user/dto/user-search.dto';
import { User } from '@app/user/models/user.models';
import { UserRepository } from '@app/user/repository/user.repository';
import { UserService } from '@app/user/services/user.service';
import { PasswordEncoder } from '@app/user/utils/password.encoder';

@Injectable()
export class DefaultUserService extends UserService {
  private logger = new Logger(DefaultUserService.name);
  constructor(
    private encoder: PasswordEncoder,
    private repository: UserRepository,
  ) {
    super();
  }

  async getById(id: string): Promise<User> {
    this.logger.log(`getting user by id ${id}`);
    const user = await this.repository.findById(id).catch((err) => {
      throw new InternalServerErrorException(constants.FAILED_TO_FIND_USER, {
        cause: err,
      });
    });
    if (!user) {
      throw new NotFoundException(constants.USER_NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(
    search: UserSearch,
    pageable: Pageable,
  ): Promise<Page<User>> {
    this.logger.log(`getting all users`);
    return this.repository.findBySearch(search, pageable).catch((err) => {
      throw new InternalServerErrorException(constants.FAILED_TO_LIST_USERS, {
        cause: err,
      });
    });
  }

  async create(request: CreateUserRequest): Promise<User> {
    this.logger.log('creating user');
    if (await this.exits(request.email, request.phoneNumber)) {
      throw new BadRequestException(constants.USER_EXISTS);
    }
    if (request.password === undefined) {
      throw new BadRequestException(constants.PASSWORD_IS_REQUIRED);
    }
    const user = new User({
      email: request.email,
      phoneNumber: request.phoneNumber,
      password: !isEmpty(request.password)
        ? await this.encoder.encode(request.password)
        : undefined,
      enabled: request.enabled ?? false,
      firstName: request.firstName,
      middleName: request.middleName,
      lastName: request.lastName,
    });
    return this.repository.save(user).catch((err) => {
      throw new InternalServerErrorException(constants.FAILED_TO_SAVE_USER, {
        cause: err,
      });
    });
  }

  async update(id: string, request: UpdateUserRequest): Promise<User> {
    this.logger.log(`updating user by id ${id}`);
    const user = await this.getById(id);
    if (request.password === undefined) {
      throw new BadRequestException(constants.PASSWORD_IS_REQUIRED);
    }
    user.firstName = request.firstName ?? user.firstName;
    user.middleName = request.middleName ?? user.middleName;
    user.lastName = request.lastName ?? user.lastName;
    user.enabled = request.enabled ?? user.enabled;
    user.password = !isEmpty(request.password)
      ? await this.encoder.encode(request.password)
      : user.password;
    return this.repository.save(user).catch((err) => {
      throw new InternalServerErrorException(constants.FAILED_TO_UPDATE_USER, {
        cause: err,
      });
    });
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`deleting user by id ${id}`);
    const user = await this.getById(id);
    await this.repository.deleteById(user.id).catch((err) => {
      throw new InternalServerErrorException(constants.FAILED_TO_DELETE_USER, {
        cause: err,
      });
    });
  }

  async getByPhoneNumber(phoneNumber: string): Promise<User> {
    this.logger.log(`getting user by phone number ${phoneNumber}`);
    const user = await this.repository
      .findByPhoneNumber(phoneNumber)
      .catch((err) => {
        throw new InternalServerErrorException(
          constants.FAILED_TO_FIND_BY_PHONE_NUMBER,
          {
            cause: err,
          },
        );
      });
    if (!user) {
      throw new NotFoundException(constants.USER_NOT_FOUND);
    }
    return user;
  }

  async checkEmailCredentials(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    this.logger.log(`checking credentials of ${email}`);
    const user = await this.getUserByEmail(email);
    if (!user) {
      return undefined;
    }
    return (await this.encoder.matches(user.password, password))
      ? user
      : undefined;
  }

  private getUserByEmail(email: string): Promise<User | undefined> {
    this.logger.log(`getting user by email ${email}`);
    return this.repository.findByEmail(email).catch((err) => {
      throw new InternalServerErrorException(
        constants.FAILED_TO_GET_USER_BY_EMAIL,
        {
          cause: err,
        },
      );
    });
  }

  private async exits(email?: string, phoneNumber?: string): Promise<boolean> {
    this.logger.debug(
      `checking if user exists by email or phone number ${email}, ${phoneNumber}`,
    );
    return this.repository
      .existsByEmailOrPhoneNumber(email, phoneNumber)
      .catch((err) => {
        throw new InternalServerErrorException(
          constants.FAILED_TO_CHECK_IF_USER_EXISTS,
          { cause: err },
        );
      });
  }
}
