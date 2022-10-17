import { App, Inject } from '@midwayjs/core';
import { Application, Context } from '@midwayjs/koa';
import { ValidateService } from '@midwayjs/validate';
import { SchemaInternals, ValidationOptions } from 'joi';
import { get, isObject } from 'lodash';
import * as qs from 'qs';
import { ValidateRules } from '../utils';

export class BaseController {
  @Inject()
  ctx: Context;

  @App()
  httpApp: Application;

  @Inject()
  validateService: ValidateService;

  get query() {
    return qs.parse(this.ctx.querystring);
  }

  private getValidateOptions(options: ValidationOptions = {}) {
    return {
      ...this.validate['options'],
      ...options,
    };
  }

  /**
   * 验证请求参数, 无论是 query body 还是 params
   *
   * @param definition
   * @param options
   */
  validate(
    definition: Record<string, SchemaInternals>,
    options: ValidationOptions = {}
  ) {
    const body = get(this.ctx, 'request.body', {});
    const values = {
      ...this.query,
      ...get(this.ctx, 'params', {}),
      ...(isObject(body) ? body : {}),
    };

    const mergedDefinition = Object.keys(definition).reduce((acc, key) => {
      const value = get(values, key);
      acc[key] = {
        value,
        rule: definition[key],
      };
      return acc;
    }, {});

    return ValidateRules(mergedDefinition, this.getValidateOptions(options));
  }

  validateQuery(
    key: string,
    rule: SchemaInternals,
    options: ValidationOptions = {}
  ) {
    const value = get(this.query, key);

    return ValidateRules(
      {
        [key]: {
          value,
          rule: rule,
        },
      },
      this.getValidateOptions(options)
    );
  }
}
