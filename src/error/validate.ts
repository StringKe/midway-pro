import { MidwayValidationError } from '@midwayjs/validate';
import { API_CODE } from '../base';
import { BusinessError } from './business';

export class ValidateError extends BusinessError {
  constructor(
    public readonly parentError: MidwayValidationError,
    public readonly joiDetail?: any
  ) {
    super(API_CODE.VALIDATE, '参数校验失败', joiDetail);
  }
}
