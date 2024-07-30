import { Injectable, Logger } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { GroupRepository } from '../../repository/repository.crud';
import { UserGroup } from '../../model/group';
import { GroupService } from './group.service';
import { CreateGroupRequest } from '../../payload/request/create-group-request';
import { GroupTagRequest } from '../../payload/request/group-tag-request';
import { GroupTag } from '../../model/group-tag';
import { PageOptionsDto } from '../../dto/page.options';
import { PageDto } from '../../dto/page.dto';
import { GroupSearchParams } from '../../dto/search/group-search-params';
import { UpdateGroupRequest } from '../../payload/request/update-group-request';
import { UserService } from '../user/user.service';

@Injectable()
export class DefaultGroupService extends GroupService {
  private readonly logger = new Logger(DefaultGroupService.name);
  constructor(
    private groupRepository: GroupRepository,
    private userService: UserService,
  ) {
    super();
  }
  async create(
    req: CreateGroupRequest,
    tags: string[],
    userData: string,
  ): Promise<string> {
    this.logger.log('Creates a new group with name and description');
    const currentUser = await this.userService.getUserByEmail(userData);
    const group = new UserGroup();
    group.name = req.name;
    group.description = req.description;
    group.user = currentUser.id;
    // group.USERS = [];
    // group.ADMIN = [];
    // group.MODERATOR = [];
    group.groupTag = [];
    group.groupTag.push(...this.saveTag(tags));
    await this.groupRepository.create(group);
    return 'Group created';
  }

  // private saveEmail(email: string[]) {
  //   const emailList = email.map((element) => {
  //     const group = new UserGroup();
  //     group.USERS.push(element);
  //     console.log(group);
  //     return group;
  //   });

  //   return emailList;
  // }

  async update(id: number, req: UpdateGroupRequest): Promise<UpdateResult> {
    this.logger.log('Updating group');
    return this.groupRepository.update(id, req);
  }
  async remove(id: number): Promise<DeleteResult> {
    this.logger.log('Deletes group');
    return this.groupRepository.delete(id);
  }

  private saveTag(tag: string[]): GroupTag[] {
    const tagList: GroupTag[] = tag.map((element) => {
      const groupTag = new GroupTag();
      groupTag.tag = element;
      return groupTag;
    });
    return tagList;
  }
  async tag(id: number, req: GroupTagRequest) {
    this.logger.log('Saves tags into group');
    const group = await this.groupRepository.find(id);
    group.groupTag = this.saveTag(req.grouptag);
    return this.groupRepository.create(group);
  }

  async getGroup(
    pageOptionsDto: PageOptionsDto,
    searchParams: GroupSearchParams,
  ): Promise<PageDto<UserGroup>> {
    this.logger.log('Fetches group details with pagination and search params');
    return this.groupRepository.paginate(pageOptionsDto, searchParams);
  }

  async findAllPublicGroups(): Promise<UserGroup[]> {
    this.logger.log('Fetches all public groups');
    return this.groupRepository.getPublicGroup();
  }
  async findAllPrivateGroups(): Promise<UserGroup[]> {
    this.logger.log('Fetches all private groups');
    return this.groupRepository.getPrivateGroup();
  }
}
