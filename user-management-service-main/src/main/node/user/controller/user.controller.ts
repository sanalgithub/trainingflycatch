import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Page, Pageable } from '@app/common/database';
import { ApiResponse } from '@app/common/shared';
import { User } from '@app/user';
import { constants } from '@app/user/constants';
import { CreateUserRequest } from '@app/user/dto/create-user.request';
import { UpdateUserRequest } from '@app/user/dto/update-user.request';
import { UserSearch } from '@app/user/dto/user-search.dto';
import { UserResponse } from '@app/user/dto/user.response';
import { UserService } from '@app/user/services/user.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getUserById(
    @Param('id') id: string,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.getById(id);

    return ApiResponse.create({
      code: HttpStatus.OK,
      status: true,
      message: constants.USER_FOUND,
      data: [this.mapToUserResponse(user)],
    });
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async getAllUsers(
    @Query() search: UserSearch,
    @Query() pageable: Pageable,
  ): Promise<ApiResponse<Page<UserResponse>>> {
    const page = await this.userService.getAllUsers(search, pageable);

    return ApiResponse.create({
      code: HttpStatus.OK,
      status: true,
      message: constants.USER_LISTED,
      data: [page.map((data) => this.mapToUserResponse(data))],
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async createUser(
    @Body() request: CreateUserRequest,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.create(request);
    return ApiResponse.create({
      code: HttpStatus.CREATED,
      message: constants.USER_CREATED,
      status: true,
      data: [this.mapToUserResponse(user)],
    });
  }

  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  public async updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserRequest,
  ): Promise<ApiResponse<UserResponse>> {
    const user = await this.userService.update(id, request);
    return ApiResponse.create({
      code: HttpStatus.OK,
      status: true,
      message: constants.USER_UPDATED,
      data: [this.mapToUserResponse(user)],
    });
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  public async deleteUser(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.userService.delete(id);
    return ApiResponse.create({
      code: HttpStatus.OK,
      status: true,
      message: constants.USER_DELETED,
    });
  }

  private mapToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      enabled: user.enabled,
    };
  }
}
