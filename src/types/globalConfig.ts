/* eslint-disable @typescript-eslint/no-namespace */

import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: string | Record<string, any>;
    }
  }
}
