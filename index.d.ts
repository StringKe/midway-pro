export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  import { MidwayProConfig } from './dist/interface';

  interface MidwayConfig {
    pro: MidwayProConfig;
  }
}
