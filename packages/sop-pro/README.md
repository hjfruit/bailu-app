# sop-pro

> SOP 业务公共组件, 相比`@fruits-chain/sop`组件, 内部对 SOP 模板、答案、暂存、等功能进行了封装, 并内置了 loading、error 等状态下的 UI

## 使用

```sh
yarn add @fruits-chain/sop-pro @fruits-chain/sop @fruits-chain/upload
```

_请确保项目安装了上述包中`peerDependencies`列出的所有三方包，并仔细检查版本。_

## API

### Form

> SOP 表单组件

**使用**

```tsx
import React from 'react'
import { Form, useSopRef } from '@fruits-chain/sop-pro'

const Demo = () => {
  const sopFormRef = useSopRef()
  return (
    <Form
      ref={sopFormRef}
      title={'每个模板的tile'} // 可以为render函数
      uuid={'全局唯一id'} // 推荐由路由+业务id+操作类型组成
      businessId={'业务id'}
      sopIds={'SOP ID组成的数组'}
    />
  )
}
```

### Preview

> SOP 预览组件

**使用**

```tsx
import React from 'react'
import { Preview } from '@fruits-chain/sop-pro'

const Demo = () => {
  return (
    <Preview
      title={'每个模板的tile'}
      businessId={'业务id'}
      sopIds={'SOP ID组成的数组'}
    />
  )
}
```

### useSopRef

> 创建`Form`组件的`ref`, 组件内部通过`ref`向外暴露了部分`API`

**form**

> 表单实例, 相较`xiaoshu`, 其多了一个属性`strictValidation`, 其值为`bool`类型, 用来控制表单是否需要严格校验, 在调用`form.validateFields`方法时, 用户应该手动设置该属性的值

**requestTempSave**

> 请求暂存, 返回一个`Promise<bool>`对象, 成功结果为`true`, 失败结果为`false`

**clear**

> 清除当前表单内后台上传存储的本地资源，比如当用户已经将数据同步到后端后，应该手动调用此方法
