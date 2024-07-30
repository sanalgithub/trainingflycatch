import { DeleteResult, UpdateResult } from 'typeorm';
import { GroupSearchParams } from '../../dto/search/group-search-params';
import { PageDto } from '../../dto/page.dto';
import { PageOptionsDto } from '../../dto/page.options';
import { UserGroup } from '../../model/group';
import { CreateGroupRequest } from '../../payload/request/create-group-request';
import { GroupTagRequest } from '../../payload/request/group-tag-request';
import { UpdateGroupRequest } from '../../payload/request/update-group-request';

export abstract class GroupService {
  abstract create(
    req: CreateGroupRequest,
    tags: string[],
    userData: string,
  ): Promise<string>;
  abstract update(id: number, req: UpdateGroupRequest): Promise<UpdateResult>;
  abstract remove(id: number): Promise<DeleteResult>;
  abstract getGroup(
    pageOptionsDto: PageOptionsDto,
    searchParams: GroupSearchParams,
  ): Promise<PageDto<UserGroup>>;
  abstract tag(id: number, req: GroupTagRequest);
  abstract findAllPublicGroups(): Promise<UserGroup[]>;
  abstract findAllPrivateGroups(): Promise<UserGroup[]>;
}
