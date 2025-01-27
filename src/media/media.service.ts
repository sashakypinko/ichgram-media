import {IMedia, Media} from './media.schema';
import path from 'path';
import fs, {ReadStream} from 'fs';
import {BadRequestException, Injectable, NotFoundException} from 'light-kite';
import {deleteTempFile, extractFirstFrameFromVideo, isImage, isVideo, resizeImage} from './media.helper';
import {Size} from './enums/size.enum';
import {StreamData} from './types';
import {Sharp} from 'sharp';

@Injectable()
class MediaService {
  async getById(id: string): Promise<IMedia | null> {
    return Media.findById(id);
  }

  async store(file: Express.Multer.File): Promise<IMedia> {
    if (!this.validateFileExtension(file)) {
      throw new BadRequestException('Unsupported file extension!');
    }

    const {filename, originalname: originalName, mimetype, size} = file;
    const media = new Media({filename, originalName, mimetype, size});
    await media.save();
    return media;
  }

  async delete(id: string): Promise<IMedia> {
    const media: IMedia | null = await Media.findById(id);

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    await Media.deleteOne({_id: id});

    const filePath = path.join(process.cwd(), 'uploads', media.filename);
    await fs.promises.unlink(filePath);

    return media;
  }

  async getStreamData(id: string, size: keyof typeof Size): Promise<StreamData> {
    const media = await this.getById(id);

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    let filePath = path.join(process.cwd(), 'uploads', media.filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File not found on the server');
    }

    let contentLength = media.size.toString();
    let contentType = media.mimetype;
    let stream: Sharp | ReadStream = fs.createReadStream(filePath);

    if (size && (isVideo(media.mimetype) || isImage(media.mimetype))) {
      if (!Size[size]) {
        throw new BadRequestException('Invalid size parameter');
      }

      if (isVideo(media.mimetype)) {
        filePath = await extractFirstFrameFromVideo(filePath);
        contentType = 'image/jpeg';
      }

      stream = await resizeImage(filePath, Size[size]);
      const metadata = await stream.metadata();
      contentLength = metadata.size?.toString() || '';

      if (isVideo(media.mimetype)) {
        stream.on('end', () => {
          deleteTempFile(filePath);
        });
      }
    }

    return {
      stream,
      contentType,
      contentLength,
      media,
    };
  }

  private validateFileExtension(file: Express.Multer.File) {
    console.log({ file });
    return true;
  }
}

export default MediaService;