# upload

> 后台上传公共组件, 相比`@fruits-chain/react-native-upload`组件, 内部增加了后台上传功能, 用户在上传图片时, 不需要等待上传完成即可退出操作界面, 下次进入该页面时, 本地数据(上传中和上传完成的图片)会自动同步到组件内部

## 使用

```sh
yarn add @fruits-chain/upload
```

```tsx
import React, { useEffect } from 'react'
import { useBackUploadManager, init } from '@fruits-chain/upload'

const App = () => {
  // 获取run方法
  const { run } = useBackUploadManager(state => ({
    run: state.run,
  }))

  // 注意: 需要用户决定init和run方法的调用时机, 下面仅作为示例
  useEffect(() => {
    // 初始化上传API, useBackUploadManager内部会执行此回调函数上传文件
    init(async file => {
      return await yourUploadAPI(file)
    })
    // 继续执行未完成的任务
    run()
  }, [run])

  return <YourAppContent />
}
```

_请确保项目安装了上述包中`peerDependencies`列出的所有三方包，并仔细检查版本。_

## API

### Upload

> 上传组件, 支持`@fruits-chain/react-native-upload`上传组件的所有属性配置, 但是目前仅支持作为`受控组件`使用

**使用**

```tsx
import React from 'react'
import Upload from '@fruits-chain/upload'

const Demo = () => {
  return <Upload groupUuid={'所属分组唯一id'} uuid={'当前上传组件的唯一id'} />
}
```

> 为什么会有`组`的概念, 主要是方便内部做资源管理, 比如按`组`清除缓存等

> uuid 的作用, 组件内部在同步缓存的数据到组件状态时, 需要通过`groupUuid`和`uuid`对资源进行匹配

### init

> 初始化后台上传, 其参数为执行上传 API 的回调函数

使用

```tsx
import { init } from '@fruits-chain/upload'

init(async file => {
  return await yourUploadAPI(file)
})
```

### useBackUploadManager

> 一个`zustand` store, 内部负责整个后台上传的调度, 也暴露了诸如`run`、`setFinishedTask`、`clear`等方法供外部使用

_由于`useBackUploadManager`是一个`React hook`, 所以他只能在组件内部使用_

#### run

> 开始处理未完成的任务

使用

```tsx
const { run } = useBackUploadManager(state => ({
  run: state.run,
}))

run()
```

#### setFinishedTask

> 清理已完成的任务

使用

```tsx
const { setFinishedTask } = useBackUploadManager(state => ({
  setFinishedTask: state.setFinishedTask,
}))

// 清除某个组已完成的任务
setFinishedTask(groupUuid)
// 清除某个组下某个上传组件已完成的任务
setFinishedTask(groupUuid, uploadUuid)
```

#### clear

> 清理所有任务

使用

```tsx
const { clear } = useBackUploadManager(state => ({
  clear: state.clear,
}))

clear()
```
