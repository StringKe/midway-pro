import { ApiBoolean, ApiNumber, ApiString } from '../swagger/decorators';

export class ApiBaseResponse {
  @ApiBoolean({
    description: '是否成功 \n 前端仅需判断次数即可进行下一步业务',
    required: true,
  })
  success: boolean;

  @ApiNumber({
    description: '状态码 \n 请求成功时总为 0',
    default: 0,
    required: true,
  })
  statusCode: number;

  @ApiString({ description: '消息', required: true })
  message: string;
}

export class ApiErrorResponse {
  @ApiBoolean({
    description: '是否成功 \n 总为 false',
    required: true,
    default: 'false',
  })
  success: boolean;

  @ApiNumber({ description: '状态码 \n 不可能为 0', required: true })
  statusCode: number;

  @ApiString({ description: '消息', required: true })
  message: string;

  @ApiString({ description: '错误信息', required: true })
  data: string;
}

export class ApiValidateErrorResponse {
  @ApiBoolean({
    description: '是否成功 \n 总为 false',
    required: true,
    default: 'false',
  })
  success: boolean;

  @ApiNumber({ description: '状态码 \n 不可能为 0', required: true })
  statusCode: number;

  @ApiString({ description: '消息', required: true })
  message: string;

  @ApiString({ description: '错误信息', required: true })
  data: string;
}
