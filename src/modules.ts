import MediaController from './media/media.controller';
import MediaService from './media/media.service';
import allowedHeadersMiddleware from './core/middlewares/allowed-headers.middleware';
import upload from './core/config/multer';


export default {
  middlewares: [
    allowedHeadersMiddleware,
    upload.array('file')
  ],
  controllers: [MediaController],
  services: [MediaService],
}