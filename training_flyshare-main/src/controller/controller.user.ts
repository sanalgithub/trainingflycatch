import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../guard/auth.guard';
import { CreateUserRequest } from '../payload/request/createrequest';
import { CreateUserResponse } from '../payload/response/createresponse';
import { UserService } from '../service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async reguserdata(@Body() req: CreateUserRequest) {
    const regresponse = await this.userService.registeruser(req);
    const response = new CreateUserResponse();
    response.id = regresponse.id;
    response.email = regresponse.email;
    return response;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getUserData(@Req() req) {
    const userData = req.user;
    return { email: userData.name };
  }
}
