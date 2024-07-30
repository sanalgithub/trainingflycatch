import { TagRequest } from '../../payload/request/tagrequest';
import { PageDto } from '../../dto/page.dto';
import { PageOptionsDto } from '../../dto/page.options';
import { File } from '../../model/file';
import { FileSearchParams } from '../../dto/search/file-search-params';

export abstract class FileService {
  abstract uploadedFile(
    file: Express.Multer.File,
    tags: string[],
    userData: string,
  ): Promise<File>;
  abstract findFileById(id: number): Promise<File>;
  abstract getFiles(
    pageOptionsDto: PageOptionsDto,
    fileSearchParams: FileSearchParams,
  ): Promise<PageDto<File>>;
  abstract saveTagFile(id: number, req: TagRequest): Promise<File>;
  abstract createReadStream(id: number);
}
