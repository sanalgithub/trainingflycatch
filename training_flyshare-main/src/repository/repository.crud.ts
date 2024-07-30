import { Injectable } from '@nestjs/common';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { PageDto } from '../dto/page.dto';
import { PageMetaDto } from '../dto/page.meta';
import { PageOptionsDto } from '../dto/page.options';
import { ConfigDatabase } from '../config/config.database';
import { UserGroup } from '../model/group';
import { GroupSearchParams } from '../dto/search/group-search-params';
import { UpdateGroupRequest } from '../payload/request/update-group-request';

@Injectable()
export class GroupRepository {
  private repository: Repository<UserGroup>;
  constructor(private configdatabase: ConfigDatabase) {
    this.repository = configdatabase.source.getRepository(UserGroup);
  }
  async create(group: UserGroup): Promise<UserGroup> {
    return this.repository.save(group);
  }
  async find(id: number): Promise<UserGroup> {
    return this.repository.findOne({ where: { id }, loadEagerRelations: true });
  }

  async update(id: number, data: UpdateGroupRequest): Promise<UpdateResult> {
    return this.repository
      .createQueryBuilder()
      .update()
      .set({
        name: data.name,
        description: data.description,
        status: data.status,
        // USERS: data.users,
        // ADMIN: data.admin,
        // MODERATOR: data.moderator,
      })
      .where('id = :id', { id })
      .execute();
  }
  async delete(id: number): Promise<DeleteResult> {
    return await this.configdatabase.source
      .createQueryBuilder()
      .delete()
      .from(UserGroup)
      .where('id = :id', { id })
      .execute();
  }

  async getPublicGroup(): Promise<UserGroup[]> {
    return this.repository
      .createQueryBuilder('group')
      .where('group.status = :status', { status: 'public' })
      .getMany();
  }
  async getPrivateGroup(): Promise<UserGroup[]> {
    return this.repository
      .createQueryBuilder('group')
      .where('group.status = :status', { status: 'private' })
      .getMany();
  }
  async paginate(
    pageOptionsDto: PageOptionsDto,
    searchParams: GroupSearchParams,
  ): Promise<PageDto<UserGroup>> {
    const queryBuilder = this.repository.createQueryBuilder('group');
    const queryParams = {};
    if (searchParams.groupTag) {
      queryParams['groupTag'] = {
        groupTag: Like(`%${searchParams.groupTag}`),
      };
    }
    const entities = await this.repository.find({
      where: {
        groupTag: {
          tag: searchParams.groupTag,
        },
      },
    });
    const itemCount = await queryBuilder.getCount();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
