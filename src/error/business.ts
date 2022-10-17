import { MidwayError } from '@midwayjs/core';
import { API_CODE } from '../base';

export class BusinessError extends MidwayError {
  constructor(
    public readonly code: number,
    public readonly message: string,
    public readonly data?: any
  ) {
    super(message, code.toString());
  }

  toJSON() {
    return {
      success: this.code === API_CODE.SUCCESS,
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}
