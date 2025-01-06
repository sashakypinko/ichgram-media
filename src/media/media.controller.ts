import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  StatusCode,
  Streamable,
  UploadedFiles,
  Res,
  Inject,
  BadRequestException,
  Query, AuthOnly,
} from 'light-kite';
import {Response} from 'express';
import MediaService from './media.service';
import {IMedia} from './media.schema';
import TYPES from '../types';
import mongoose from 'mongoose';
import {Size} from './enums/size.enum';
import {StreamData} from './types';

@Controller()
class MediaController {
  constructor(
    @Inject(TYPES.MediaService) private readonly mediaService: MediaService,
  ) {}

  @AuthOnly()
  @Get(':id')
  async get(@Param('id') id: string): Promise<IMedia | null> {
    return this.mediaService.getById(id);
  }

  @Streamable()
  @Get('file/:id')
  async streamFile(@Param('id') id: string, @Query('size') size: keyof typeof Size, @Res() res: Response): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('You must provide a valid media id');
    }
    
    const { stream, contentType, contentLength, media }: StreamData = await this.mediaService.getStreamData(id, size);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${media.originalName}"`);
    contentLength && res.setHeader('Content-Length', contentLength);
    
    stream.pipe(res);
  }

  @AuthOnly()
  @StatusCode(201)
  @Post('store')
  store(@UploadedFiles('file') file: Express.Multer.File): Promise<IMedia> {
    return this.mediaService.store(file);
  }

  @AuthOnly()
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<IMedia> {
    return this.mediaService.delete(id);
  }
}

export default MediaController;