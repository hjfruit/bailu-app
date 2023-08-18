# sop-pro

> SOP 业务公共组件, 相比`@fruits-chain/sop`组件, 内部对 SOP 模板、答案、暂存、等功能进行了封装, 并内置了 loading、error 等状态下的 UI

> 默认内置了时间水印, 可以通过 watermark 属性传递用户自定义的水印文案

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

const watermark = {
  // 改为true时, 如果获取水印文案失败(包括内部的时间获取), 则不能进行上传
  required: false,
  // 普通文本
  content: () => Promise.resolve(['第一行水印', '第二行水印']),
  // 支持富文本/图片, 详细见@fruits-chain/react-native-upload watermark配置
  richContent: [],
}

const Demo = () => {
  const sopFormRef = useSopRef()
  return (
    <Form
      ref={sopFormRef}
      title={'每个模板的title'} // 可以为render函数
      uuid={'全局唯一id'} // 推荐由路由+业务id+操作类型组成
      businessId={'业务id'}
      watermark={watermark} // 非必传, 默认{ required: false, content: () => Promise.resolve([]) }
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
      title={'每个模板的title'}
      businessId={'业务id'}
      sopIds={'SOP ID组成的数组'}
    />
  )
}
```

### useSopRef

> 创建`Form`组件的`ref`, 组件内部通过`ref`向外暴露了部分`API`

**form**

> `SopForm`表单`form`属性实例

**requestTempSave**

> 请求暂存, 返回一个`Promise<bool>`对象, 成功结果为`true`, 失败结果为`false`

**requestSave**

> 请求保存修改后的数据, 返回一个`Promise<bool>`对象, 成功结果为`true`, 失败结果为`false`

**clear**

> 清除当前表单内后台上传存储的本地资源，比如当用户已经将数据同步到后端后，应该手动调用此方法

**refresh**

> 刷新 SOP 模板及答案的数据

### usePreviewRef

**refresh**

> 刷新 SOP 模板及答案的数据

### useWatermark

> 创建一个生成水印的函数, 内置了生成时间水印/地理位置信息文案
