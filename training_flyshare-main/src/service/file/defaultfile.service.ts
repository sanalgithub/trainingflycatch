import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { FileTag } from '../../model/file.tag';
import { PageDto } from '../../dto/page.dto';
import { PageOptionsDto } from '../../dto/page.options';
import { File, PrivacyStatus } from '../../model/file';
import { FileRepository } from '../../repository/repository.file';
import { FileService } from './file.service';
import { TagRequest } from '../../payload/request/tagrequest';
import { User } from '../../model/user';
import { FileSearchParams } from '../../dto/search/file-search-params';
import { UserService } from '../user/user.service';

@Injectable()
export class DefaultFileService extends FileService {
  private readonly logger = new Logger(DefaultFileService.name);
  constructor(
    private fileRepository: FileRepository,
    private userService: UserService,
  ) {
    super();
  }

  async uploadedFile(
    file: Express.Multer.File,
    tags: string[],
    userData: string,
  ): Promise<File> {
    this.logger.log('Saves the metadata and tag of uploaded file to database');
    const currentUser = await this.userService.getUserByEmail(userData);
    const fileDetails = new File();
    fileDetails.filename = file.filename;
    fileDetails.originalname = file.originalname;
    fileDetails.size = file.size;
    fileDetails.mimetype = file.mimetype;
    fileDetails.user = currentUser.id;
    fileDetails.filetag = [];
    fileDetails.filetag.push(...this.createFileTag(tags));
    return this.fileRepository.save(fileDetails);
  }
  async createReadStream(id: number) {
    this.logger.log('fetch the datas from repository using id');
    const file = await this.findFileById(id);
    return this.getFileStream(file);
  }

  async findFileById(id: number, currentUser?: User): Promise<File> {
    this.logger.log('Fetches file details by id');
    const file = await this.fileRepository.findFileById(id);
    const uploadedUserId =
      typeof file.user === 'number' ? file.user : file.user.id;
    switch (file.status) {
      case PrivacyStatus.isPrivate: {
        if (currentUser.id !== uploadedUserId) {
          break;
        }
        return file;
      }
      case PrivacyStatus.isAuthenticated: {
        if (!currentUser) {
          break;
        }
        return file;
      }
      case PrivacyStatus.isPublic: {
        return file;
      }
    }
    throw new NotFoundException('file not found');
  }

  async getFiles(
    pageOptionsDto: PageOptionsDto,
    fileSearchParams: FileSearchParams,
  ): Promise<PageDto<File>> {
    this.logger.log('Fetches file details with pagination and search params');
    return this.fileRepository.getFiles(pageOptionsDto, fileSearchParams);
  }

  private saveTag(tag: string[]) {
    const tagList = tag.map((element) => {
      const fileTag = new FileTag();
      fileTag.tag = element;
      return fileTag;
    });
    return tagList;
  }

  async saveTagFile(id: number, req: TagRequest): Promise<File> {
    this.logger.log('Saves new tags to existing file');
    const file = await this.findFileById(id);
    file.filetag = this.saveTag(req.tag);
    return this.fileRepository.save(file);
  }

  private getFileStream(file: File) {
    const filename = file.filename;
    const downloadedFile = createReadStream(
      join(process.cwd(), `uploads/${filename}`),
    );
    return downloadedFile;
  }

  private createFileTag(tag: string[]) {
    const tagList = tag.map((element) => {
      const fileTag = new FileTag();
      fileTag.tag = element;
      return fileTag;
    });
    return tagList;
  }
}
