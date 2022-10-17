import { MidwayValidationError } from '@midwayjs/validate';
import * as Joi from 'joi';
import { SchemaInternals, ValidationOptions } from 'joi';
import { ValidateError } from '../error/validate';

export declare type ValidateDefinition = Record<
  string,
  {
    value: any;
    rule: SchemaInternals;
  }
>;

export function ValidateRules(
  schema: ValidateDefinition = {},
  options: ValidationOptions = {}
) {
  const rules = Object.keys(schema).reduce((acc, key) => {
    acc[key] = schema[key].rule;
    return acc;
  }, {});
  const values = Object.keys(schema).reduce((acc, key) => {
    acc[key] = schema[key].value;
    return acc;
  }, {});

  const objectSchema = Joi.object(rules);
  const { error, value: result } = objectSchema.validate(values, options);
  if (error) {
    throw new ValidateError(
      new MidwayValidationError(error.message, -1, error),
      error.details
    );
  }
  return result;
}
