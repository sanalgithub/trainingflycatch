import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { File } from '../model/file';
import { ConfigDatabase } from '../config/config.database';
import { PageDto } from '../dto/page.dto';
import { PageMetaDto } from '../dto/page.meta';
import { PageOptionsDto } from '../dto/page.options';
import { FileSearchParams } from '../dto/search/file-search-params';

@Injectable()
export class FileRepository {
  private repository: Repository<File>;
  constructor(private configdatabase: ConfigDatabase) {
    this.repository = configdatabase.source.getRepository(File);
  }
  async save(fileStorage: File): Promise<File> {
    return this.repository.save(fileStorage);
  }
  async findFileById(id: number): Promise<File> {
    return this.repository.findOneBy({ id });
  }

  async getFiles(
    pageOptionsDto: PageOptionsDto,
    FileSearchParams: FileSearchParams,
  ): Promise<PageDto<File>> {
    const queryBuilder = this.repository.createQueryBuilder('file');
    const queryParams = {};
    if (FileSearchParams.originalname) {
      queryParams['originalname'] = Like(`%${FileSearchParams.originalname}`);
    }
    if (FileSearchParams.size) {
      queryParams['size'] = Like(`%${FileSearchParams.size}`);
    }
    if (FileSearchParams.status) {
      queryParams['status'] = Like(`%${FileSearchParams.status}`);
    }
    queryBuilder
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take)
      .where(queryParams);
    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }
}
