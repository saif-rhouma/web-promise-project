import { Request, Response } from 'express';
import fs from 'fs';
import AsyncRouteHandler from 'src/types/AsyncRouteHandler';
import HTTP_CODE from '../constants/httpCode';
import logger from '../../utils/logger';
import path from 'path';
class FileManagerController {
  upload: AsyncRouteHandler = async (_req: Request, res: Response) => {
    logger.info('File Uploaded Successfully..');
    res.status(HTTP_CODE.Ok).json('File Uploaded');
  };
  download: AsyncRouteHandler = async (req: Request, res: Response) => {
    const { fileName } = req.params;

    const filePath = path.join(__dirname, '../../uploads', fileName as string);

    const stat = fs.statSync(filePath);

    res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': stat.size,
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });

    const fileStream = fs.createReadStream(filePath);

    fileStream.pipe(res);

    fileStream.on('error', (err) => {
      console.error('Error during file streaming:', err);
      res.status(500).send('File streaming failed.');
    });
  };
}

export default new FileManagerController();
