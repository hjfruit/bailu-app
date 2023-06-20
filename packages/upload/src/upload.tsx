import type { UploadItem } from '@fruits-chain/react-native-upload'
import Upload2 from '@fruits-chain/react-native-upload'
import { cloneDeep } from 'lodash'
import React, { useCallback, useEffect } from 'react'
import type { FC, ComponentProps } from 'react'

import { useBackUploadManager, getUploader } from './manager'

type UploadProps = ComponentProps<typeof Upload2>
interface IProps extends Omit<UploadProps, 'uploadAction'> {
  /** 当前上传组件所属分组id(需全局唯一) */
  groupUuid: string
  /** 当前上传组件id(需全局唯一) */
  uuid: string
}

const Upload: FC<IProps> = ({
  groupUuid,
  uuid,
  backUpload,
  onChange,
  list,
  ...uploadProps
}) => {
  const {
    finishedTask,
    jobQueue,
    enqueueJob,
    enqueueTask,
    dequeueTask,
    setFinishedTask,
  } = useBackUploadManager(state => ({
    finishedTask: state.finishedTask,
    jobQueue: state.jobQueueMap[uuid]?.queue,
    enqueueJob: state.enqueueJob,
    enqueueTask: state.enqueueTask,
    dequeueTask: state.dequeueTask,
    setFinishedTask: state.setFinishedTask,
  }))

  const handleChange: UploadProps['onChange'] = useCallback(
    uploadItems => {
      onChange(uploadItems)
      if (!backUpload) return
      const job = enqueueJob(groupUuid, uuid)
      const uploadItemsMap = uploadItems.reduce((obj, item) => {
        obj[item.filepath] = item
        return obj
      }, {} as Record<string, UploadItem>)
      const allFilepath = Array.from(
        new Set(
          job.queue
            .map(item => item.uuid)
            .concat(uploadItems.map(item => item.filepath)),
        ),
      )
      // 尚存的loading的文件需要交给上传中心上传
      // 不再存在的文件需要告知上传中心移除该任务
      allFilepath.forEach(filepath => {
        const uploadItem = uploadItemsMap[filepath]
        if (uploadItem) {
          if (uploadItem.status === 'loading') {
            enqueueTask(groupUuid, uuid, filepath, cloneDeep(uploadItem))
          }
        } else {
          dequeueTask(groupUuid, uuid, filepath)
        }
      })

      // 不再存在的文件需从已完成任务中删除
      const cachedJob = finishedTask[groupUuid]?.[uuid]
      if (cachedJob) {
        Object.keys(cachedJob).forEach(taskUuid => {
          if (!uploadItemsMap[taskUuid]) {
            setFinishedTask(groupUuid, uuid, taskUuid)
          }
        })
      }
    },
    [
      backUpload,
      dequeueTask,
      enqueueJob,
      enqueueTask,
      finishedTask,
      groupUuid,
      onChange,
      setFinishedTask,
      uuid,
    ],
  )

  // 同步数据，尚在队列的任务同步到当前组件
  useEffect(() => {
    if (!backUpload || !jobQueue?.length) return
    const listMap = list.reduce((obj, item) => {
      obj[item.filepath] = item
      return obj
    }, {} as Record<string, UploadItem>)
    let shouldUpdate = false
    const newList = [...list]
    jobQueue.forEach(item => {
      const existItem = listMap[item.file.filepath]
      if (!existItem) {
        newList.push(item.file)
        shouldUpdate = true
      } else if (existItem.status !== item.file.status) {
        existItem.status = item.file.status
        shouldUpdate = true
      }
    })
    if (shouldUpdate) {
      onChange(newList)
    }
  }, [backUpload, jobQueue, list, onChange])

  // 同步数据，将已完成的任务同步到当前组件
  useEffect(() => {
    if (!backUpload) return
    let shouldUpdate = false
    const job = cloneDeep(finishedTask[groupUuid]?.[uuid] || {})
    const cachedTasks = new Set()
    const newList =
      list?.map(item => {
        let _item = item
        const cachedTask = job[item.filepath]
        if (cachedTask) {
          cachedTasks.add(item.filepath)
          if (item.status === 'loading') {
            _item = cachedTask.file
            shouldUpdate = true
          }
        }
        return _item
      }) || []
    Object.keys(job).forEach(taskHash => {
      if (cachedTasks.has(taskHash)) return
      shouldUpdate = true
      newList.push(job[taskHash].file)
    })

    if (shouldUpdate) {
      onChange([...newList])
    }
  }, [backUpload, finishedTask, groupUuid, list, onChange, uuid])

  return (
    <Upload2
      {...uploadProps}
      backUpload={backUpload}
      list={list}
      onChange={handleChange}
      uploadAction={({ file }) => {
        const uploader = getUploader()
        return uploader(file)
      }}
    />
  )
}

export default Upload
