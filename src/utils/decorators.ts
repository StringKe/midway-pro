/**
 * 用来合并装饰器，会跳过空值
 * @param decorators 装饰器列表
 */
export function applyDecorators(
  ...decorators: Array<
    | ClassDecorator
    | MethodDecorator
    | PropertyDecorator
    | ParameterDecorator
    | undefined
  >
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return <TFunction extends Function, Y>(
    target: TFunction | object,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y> | number
  ) => {
    for (const decorator of decorators) {
      if (decorator) {
        if (target instanceof Function && !descriptor) {
          const handle = decorator as ClassDecorator;
          handle(target);
          continue;
        }
        if (typeof descriptor === 'number') {
          const handle = decorator as ParameterDecorator;
          handle(target, propertyKey!, descriptor);
          continue;
        }
        const handle = decorator as MethodDecorator | PropertyDecorator;
        handle(target, propertyKey, descriptor);
      }
    }
  };
}
