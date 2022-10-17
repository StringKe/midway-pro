import { ApiProperty, ApiPropertyOptions } from '@midwayjs/swagger';
import { Rule, RuleType } from '@midwayjs/validate';
import { applyDecorators } from '../utils';

export function DtoProperty(type: any) {
  return (options: ApiPropertyOptions, rule: RuleType.Schema) => {
    if (options.required) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      rule.concat(RuleType.required());
    }

    return applyDecorators(
      ApiProperty({
        ...options,
        type: typeof type === 'string' ? type : () => type,
      }),
      Rule(rule)
    );
  };
}

export const DtoString = DtoProperty(String);
export const DtoNumber = DtoProperty(Number);
export const DtoBoolean = DtoProperty(Boolean);
export const DtoClass = (
  classType: any,
  options: ApiPropertyOptions,
  rule: RuleType.Schema
) => {
  if (options.required) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    rule.concat(RuleType.required());
  }

  return applyDecorators(
    ApiProperty({
      ...options,
      type: () => classType,
    }),
    Rule(rule)
  );
};
