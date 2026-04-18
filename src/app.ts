import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import pc from 'picocolors';
import httpLogger from 'morgan';
import path from 'node:path';
import session from 'express-session';
import csrf from 'csurf';
import rateLimit from 'express-rate-limit';

import environment from './configs/environment';
import Router from './router';
import buildEtaEngine from './configs/template.config';

class App {
  app: Express;
  constructor() {
    this.app = express();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.app.use(httpLogger('dev', { skip: (_req, _res) => environment.isTest }));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(helmet());
    this.app.use(
      cors({
        credentials: true,
        origin: '*',
        methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
      })
    );

    // Session
    this.app.use(
      session({
        secret: 'super-secret-key',
        resave: false,
        saveUninitialized: false,
        // cookie: {
        //   httpOnly: true,
        //   secure: false, // TRUE in production (HTTPS)
        // },
      })
    );

    // CSRF protection
    const csrfProtection = csrf();
    this.app.use(csrfProtection);

    // Make token available in all views
    this.app.use((req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    });

    // Rate limiter (global basic)
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 min
      max: 100, // max requests per IP
    });
    this.app.use(limiter);
  }

  public start() {
    this._setupTemplateEngine();
    this._setupRoutes();
    this._listen();
  }

  private _setupRoutes() {
    Router.create(this.app);
  }

  private _setupTemplateEngine() {
    this.app.engine('eta', buildEtaEngine());
    this.app.set('view engine', 'eta');
    this.app.set('views', path.join(__dirname, 'views'));
  }

  private _listen() {
    const { PORT, NODE_ENV } = environment;
    this.app.listen(PORT, () => {
      console.log(
        pc.inverse(
          pc.cyanBright(
            `Server is Running on port : ${pc.red(PORT)}! | Execution Environment : ${pc.red(NODE_ENV.toLocaleUpperCase())}`
          )
        )
      );
    });
  }
}

export default App;
