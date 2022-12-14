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
      // ???????????????????????????
      const startTime = Date.now();
      // ??????????????? Web ????????????????????????????????????
      // ???????????????????????????????????????????????????????????????
      const result = await next();
      // ??????????????????????????????
      ctx.logger.info(`request handle = ${Date.now() - startTime}ms`);
      // ????????????????????????????????????
      return result;
    };
  }
}
