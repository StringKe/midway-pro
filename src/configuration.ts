import { App, ILogger, Inject } from '@midwayjs/core';
import { Configuration } from '@midwayjs/decorator';
import { Application } from '@midwayjs/koa';
import {
  BusinessFilter,
  DefaultErrorFilter,
  FormatMiddleware,
  ReportMiddleware,
} from './base';
import * as DefaultConfig from './config/config.default';

@Configuration({
  namespace: 'book',
  importConfigs: [
    {
      default: DefaultConfig,
    },
  ],
})
export class MidwayProConfiguration {
  @Inject()
  logger: ILogger;

  @App('koa')
  app: Application;

  async onReady() {
    this.app.useMiddleware([FormatMiddleware, ReportMiddleware]);
    this.app.useFilter([BusinessFilter, DefaultErrorFilter]);

    this.logger.info('Midway-Pro: ready');
  }
}
