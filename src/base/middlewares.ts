import {
  Config,
  FunctionMiddleware,
  IMiddleware,
  IMidwayApplication,
  Inject,
  Middleware,
  MidwayWebRouterService,
} from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { first } from 'lodash';

export abstract class BaseMiddleware
  implements IMiddleware<Context, NextFunction>
{
  @Inject()
  routerService: MidwayWebRouterService;

  async getTarget(url: string) {
    const list = (
      await this.routerService.getFlattenRouterTable({
        compileUrlPattern: true,
        noCache: true,
      })
    ).filter(item => {
      return item.fullUrlCompiledRegexp.test(url);
    });
    const routePriorityList = await this.routerService.getRoutePriorityList();
    const targets = list
      .map(item => {
        const target = routePriorityList.find(i => {
          return i.controllerId === item.controllerId;
        });
        if (target) {
          const targetClass = target.routerModule;
          const functionName = item.handlerName.split('.')[1];

          return {
            target: targetClass,
            functionName: functionName,
          };
        }
        return undefined;
      })
      .filter(Boolean);
    return first(targets);
  }

  abstract resolve(
    app: IMidwayApplication
  ):
    | FunctionMiddleware<Context, NextFunction>
    | Promise<FunctionMiddleware<Context, NextFunction>>;

  async asyncSome<T>(
    array: T[],
    callback: (value: T, index: number, a: T[]) => Promise<boolean>
  ): Promise<boolean> {
    for (let i = 0; i < array.length; i++) {
      const result = await callback(array[i], i, array);
      if (result) {
        return result;
      }
    }

    return false;
  }

  async asyncEvery<T>(
    array: T[],
    callback: (value: T, index: number, a: T[]) => Promise<boolean>
  ): Promise<boolean> {
    for (let i = 0; i < array.length; i++) {
      const result = await callback(array[i], i, array);
      if (!result) {
        return result;
      }
    }

    return true;
  }
}

@Middleware()
export class FormatMiddleware extends BaseMiddleware {
  @Config('koa.globalPrefix')
  prefix: string;

  @Config('pro.format.ignoreList')
  ignoreListConfig: string[];

  static getName(): string {
    return 'format';
  }

  ignoreList() {
    const list = this.ignoreListConfig ?? [];
    return list.map(item =>
      `${this.prefix}/${item}`.replace(new RegExp('//', 'g'), '/')
    );
  }

  ignore(ctx: Context) {
    const path = ctx.path;
    return this.ignoreList().some(item => path.startsWith(item));
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();

      return {
        success: true,
        statusCode: 0,
        message: 'OK',
        data: result,
      };
    };
  }
}

@Middleware()
export class ReportMiddleware extends BaseMiddleware {
  static getName(): string {
    return 'report';
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 控制器前执行的逻辑
      const startTime = Date.now();
      // 执行下一个 Web 中间件，最后执行到控制器
      // 这里可以拿到下一个中间件或者控制器的返回值
      const result = await next();
      // 控制器之后执行的逻辑
      ctx.logger.info(`request handle = ${Date.now() - startTime}ms`);
      // 返回给上一个中间件的结果
      return result;
    };
  }
}
