import {IMedia} from '../media.schema';
import {Sharp} from 'sharp';
import {ReadStream} from 'fs';

export interface StreamData {
  stream: Sharp | ReadStream,
  contentType: string,
  contentLength: string,
  media: IMedia,
}