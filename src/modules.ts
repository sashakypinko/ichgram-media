import MediaController from './media/media.controller';
import MediaService from './media/media.service';
import multer from 'multer';
import allowedHeadersMiddleware from './core/middlewares/allowed-headers.middleware';

const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads',
  }),
});

export default {
  middlewares: [
    allowedHeadersMiddleware,
    upload.array('file')
  ],
  controllers: [MediaController],
  services: [MediaService],
}