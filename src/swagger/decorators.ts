import {
  Body,
  Controller,
  Get as BaseGet,
  Headers,
  Param,
  Post as BasePost,
  Query,
  RouterOption,
} from '@midwayjs/core';
import {
  ApiOperation,
  ApiOperationOptions,
  ApiProperty,
  ApiPropertyOptions,
  ApiResponse,
  ApiTags,
} from '@midwayjs/swagger';
import { omit } from 'lodash';
import { ApiErrorResponse } from '../base';
import { applyDecorators } from '../utils';

export function ApiSimpleTypeProperty(type: any) {
  return (options: ApiPropertyOptions) => {
    return applyDecorators(
      ApiProperty({
        ...options,
        type: typeof type === 'string' ? type : () => type,
      })
    );
  };
}

export const ApiString = ApiSimpleTypeProperty(String);
export const ApiNumber = ApiSimpleTypeProperty(Number);
export const ApiBoolean = ApiSimpleTypeProperty(Boolean);

export function ApiController(
  prefix?: string,
  options?: RouterOption & { tags: string | string[] }
) {
  return applyDecorators(
    Controller(prefix, options),
    ApiTags(options.tags || [])
  );
}

export function ApiSimpleRequest(
  Base: (property?: string) => ParameterDecorator
) {
  return (propertyOrOptions?: string, maybeOptions?: ApiPropertyOptions) => {
    const property =
      typeof propertyOrOptions === 'string' ? propertyOrOptions : undefined;
    const options =
      typeof propertyOrOptions === 'object' ? propertyOrOptions : maybeOptions;
    return applyDecorators(Base(property), ApiProperty(options));
  };
}

export const ApiQuery = ApiSimpleRequest(Query);
export const ApiBody = ApiSimpleRequest(Body);
export const ApiParam = ApiSimpleRequest(Param);
export const ApiHeader = ApiSimpleRequest(Headers);

export const Response = (dtoClass: any): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: '成功',
      type: dtoClass,
    }),
    ApiResponse({
      status: 503,
      description: '系统错误',
      type: ApiErrorResponse,
    })
  );
};

export declare type GetOptions = Parameters<typeof BaseGet>[1];

export const Get = (
  path: string,
  options?: Partial<ApiOperationOptions & GetOptions>,
  responseDto?: any
): MethodDecorator => {
  const apiOperationOptions = omit(options, [
    'routerName',
    'middleware',
    'ignoreGlobalPrefix',
  ]);
  const getOptions = omit(options, ['summary', 'description']);
  path = path.startsWith('/') ? path.substring(1) : path;
  return applyDecorators(
    BaseGet(path, getOptions),
    ApiOperation(apiOperationOptions),
    responseDto ? Response(responseDto) : undefined
  );
};
export declare type PostOptions = Parameters<typeof BaseGet>[1];

export const Post = (
  path: string,
  options?: Partial<ApiOperationOptions & PostOptions>,
  responseDto?: any
): MethodDecorator => {
  const apiOperationOptions = omit(options, [
    'routerName',
    'middleware',
    'ignoreGlobalPrefix',
  ]);
  const getOptions = omit(options, ['summary', 'description']);
  path = path.startsWith('/') ? path.substring(1) : path;
  return applyDecorators(
    BasePost(path, getOptions),
    ApiOperation(apiOperationOptions),
    responseDto ? Response(responseDto) : undefined
  );
};
