import { Catch } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { BusinessError } from '../error';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    ctx.logger.error('默认错误捕获器', err);
    ctx.status = 503;
    // 所有的未分类错误会到这里
    return {
      success: false,
      statusCode: 1,
      message: '服务器暂时无法处理此请求，请稍后再试',
      data: err.name,
    };
  }
}

@Catch([BusinessError], {
  matchPrototype: true,
})
export class BusinessFilter {
  async catch(err: BusinessError, ctx: Context) {
    ctx.status = 500;
    return {
      success: false,
      statusCode: err.code,
      message: err.message,
      data: err.data,
    };
  }
}
