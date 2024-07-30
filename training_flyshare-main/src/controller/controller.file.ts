import {
  Controller,
  Get,
  NotFoundException,
  Post,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  Param,
  Query,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../service/file/file.service';
import { AuthGuard } from '../guard/auth.guard';
import { File } from '..//model/file';
import { PageDto } from '../dto/page.dto';
import { PageOptionsDto } from '../dto/page.options';
import { TagRequest } from '../payload/request/tagrequest';
import { FileSearchParams } from '../dto/search/file-search-params';

@Controller('files')
export class FileController {
  constructor(private fileService: FileService) {}

  @UseGuards(AuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: 'uploads' }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: TagRequest,
    @Req() req,
  ) {
    const userData = req.email;
    if (!file) {
      throw new NotFoundException('File not found');
    }

    return this.fileService.uploadedFile(file, body.tag, userData);
  }

  @UseGuards(AuthGuard)
  @Get('getfile')
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
    @Query() fileSearchParams: FileSearchParams,
  ): Promise<PageDto<File>> {
    return this.fileService.getFiles(pageOptionsDto, fileSearchParams);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async downloadFile(
    @Param('id') id: number,
    @Res({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const file = await this.fileService.createReadStream(id);
    res.set({
      'Content-Type': `${file.filetype}`,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
    });
    return new StreamableFile(file);
  }

  @UseGuards(AuthGuard)
  @Get('getfile/:id')
  async getfileById(@Param('id') id: number) {
    const file = await this.fileService.findFileById(id);
    if (file) {
      return {
        filename: file.filename,
        filetype: file.mimetype,
        filesize: file.size,
        fileoriginalname: file.originalname,
        filetag: file.filetag,
      };
    }
    throw new NotFoundException('File not found');
  }

  @UseGuards(AuthGuard)
  @Post('/:id')
  async savefileTag(@Param('id') id: number, @Body() req: TagRequest) {
    return this.fileService.saveTagFile(id, req);
  }
}
