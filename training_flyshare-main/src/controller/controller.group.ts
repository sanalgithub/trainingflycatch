import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGroupRequest } from '../payload/request/create-group-request';
import { UserGroup } from '../model/group';
import { GroupService } from '../service/group/group.service';
import { UpdateGroupRequest } from '../payload/request/update-group-request';
import { GroupTagRequest } from '../payload/request/group-tag-request';
import { AuthGuard } from '../guard/auth.guard';
import { PageOptionsDto } from '../dto/page.options';
import { PageDto } from '../dto/page.dto';
import { GroupSearchParams } from '../dto/search/group-search-params';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post('')
  async create(
    @Body() req: CreateGroupRequest,
    @Body() body: GroupTagRequest,
    @Req() request,
  ) {
    const userData = request.email;

    return this.groupService.create(req, body.grouptag, userData);
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGroup: UpdateGroupRequest,
  ) {
    return this.groupService.update(id, updateGroup);
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.groupService.remove(id);
    return 'Group deleted';
  }

  @UseGuards(AuthGuard)
  @Get('')
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() searchParams: GroupSearchParams,
  ): Promise<PageDto<UserGroup>> {
    return this.groupService.getGroup(pageOptionsDto, searchParams);
  }

  @UseGuards(AuthGuard)
  @Post('/:id')
  async savefileTag(@Param('id') id: number, @Body() req: GroupTagRequest) {
    return this.groupService.tag(id, req);
  }

  @UseGuards(AuthGuard)
  @Get('publicgroup')
  async publicGroup() {
    return await this.groupService.findAllPublicGroups();
  }
  @UseGuards(AuthGuard)
  @Get('privategroup')
  async privategroup() {
    return await this.groupService.findAllPrivateGroups();
  }
}
