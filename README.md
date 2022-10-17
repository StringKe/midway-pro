# midwayjs-pro

```shell
npm i @stringke/midwayjs-pro
```

```shell
yarn add @stringke/midwayjs-pro
```

```typescript
import * as pro from '@stringke/midwayjs-pro';
/// 请在 configuration 里引入
```

## 介绍

提供了一些基础的功能，可以让你快速的开发一个项目。

1. `ApiString`, `ApiNumber`, `ApiBoolean` 用于控制器上具体某个方法参数定义
2. `ApiController`,`ApiQuery`, `ApiBody`, `ApiParam`, `ApiHeader` 用于具体参数的定义
3. `DtoString`, `DtoNumber`, `DtoBoolean` , `DtoClass` 用于 dto 的基本验证，同时如果传递了 require 会自动拼接对应验证效果
4. `BaseMiddleware`, `BaseController` 控制器和中间件可以继承这两个获得更多功能
5. 已经封装了错误，你可以继承 `BusinnessError` 来自定义错误
6. `nanoid`, `getUrlId`, `getDataId` 用于生产 ID
7. `applyDecorators` 用来快速合并装饰器

### demo

```typescript
import { ApiController, ApiQuery } from "./decorators";

@ApiController('/api')
class UserController {

  @ApiGet("/user", GetUserRes)
  async getUserInfo(@ApiQuery() id: number) {
    return {
      id: 1
    }
  }
}

```
