import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import {MediaType} from './enums/media-type.enum';
import sharp, { Sharp } from 'sharp';

export const resizeImage = async (filePath: string, width: number): Promise<Sharp> => {
  const transform = sharp(filePath);

  transform.resize({ width });
  
  return transform;
}

export const extractFirstFrameFromVideo = (videoPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const framePath = path.join(process.cwd(), 'uploads', 'temp', `${Date.now()}-frame.jpg`);

    ffmpeg(videoPath)
      .on('end', () => resolve(framePath))
      .on('error', (err) => reject(err))
      .screenshots({
        timestamps: [0],
        filename: path.basename(framePath),
        folder: path.dirname(framePath),
        size: '1920x?'
      });
  });
}

export const deleteTempFile = (filePath: string): void => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Failed to delete temp file: ${filePath}`, err);
  });
}

export const isVideo = (mimetype: string) => mimetype.startsWith(MediaType.VIDEO);

export const isImage = (mimetype: string) => mimetype.startsWith(MediaType.IMAGE);