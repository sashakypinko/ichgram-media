import  { Request, Response, NextFunction } from 'express';

const allowedHeadersMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length, Content-Type');
  next();
};

export default allowedHeadersMiddleware;