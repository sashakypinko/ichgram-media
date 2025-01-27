import multer, {FileFilterCallback} from 'multer';
import {Request} from 'express';
import {BadRequestException} from 'light-kite';
import {FileType} from '../../media/enums/file-type.enum';
import {FileExtension} from '../../media/enums/file-extension.enum';

const allowedMimeTypes = [
  FileType.JPEG,
  FileType.PNG,
  FileType.GIF,
  FileType.SVG,
  FileType.MP4,
  FileType.MPEG,
  FileType.WEBM,
  FileType.MSV,
  FileType.PDF,
  FileType.TXT,  
  FileType.JSON,
  FileType.XLS,
  FileType.XLSX,
];

const allowedExtensions = [
  FileExtension.JPEG,
  FileExtension.JPG,
  FileExtension.PNG,
  FileExtension.GIF,
  FileExtension.SVG,
  FileExtension.MP4,
  FileExtension.MPEG,
  FileExtension.AVI,
  FileExtension.MOV,
  FileExtension.WEBM,
  FileExtension.PDF,
  FileExtension.TXT,
  FileExtension.JSON,
  FileExtension.XLS,
  FileExtension.XLSX,
];

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 20 * 1024 * 1024;

function validateExtension(fileName: string): boolean {
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.')) as FileExtension;
  return allowedExtensions.includes(extension);
}

const upload = multer({
  storage: multer.diskStorage({ destination: './uploads' }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (!allowedMimeTypes.includes(file.mimetype as FileType)) {
      return cb(new BadRequestException('Unsupported file type.'));
    }

    if (!validateExtension(file.originalname)) {
      return cb(new BadRequestException('Unsupported file extension.'));
    }

    cb(null, true);
  },
});

export default upload;
