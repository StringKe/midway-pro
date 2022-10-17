import {
  Body,
  Controller,
  Headers,
  Param,
  Query,
  RouterOption,
} from '@midwayjs/core';
import { ApiProperty, ApiPropertyOptions, ApiTags } from '@midwayjs/swagger';
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
