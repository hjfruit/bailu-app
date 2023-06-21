# sop

> SOP 业务公共组件, 内部对 SOP 表单、预览进行了封装

## 使用

```sh
yarn add @fruits-chain/sop @fruits-chain/upload
```

_请确保项目安装了上述包中`peerDependencies`列出的所有三方包，并仔细检查版本。_

## API

### Form

> SOP 表单组件

**使用**

```tsx
import React from 'react'
import { SopForm, useSopForm } from '@fruits-chain/sop'

const Demo = () => {
  const form = useSopForm()
  return (
    <SopForm
      loading={false}
      uuid={'uuid'}
      form={form}
      data={[]}
      title={'title'}
    />
  )
}
```

### Preview

> SOP 预览组件

**使用**

```tsx
import React from 'react'
import { SopPreview } from '@fruits-chain/sop'

const Demo = () => {
  return <SopPreview loading={false} data={[]} title={'title'} />
}
```

### useSopForm

> 创建`SopForm`组件的`form`属性实例，相较`xiaoshu`的`form`, 其多了一个属性`strictValidation`, 其值为`bool`类型, 用来控制表单是否需要严格校验, 在调用`form.validateFields`方法时, 用户应该手动设置该属性的值
