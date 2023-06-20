import type {
  UploadAction,
  UploadItem,
} from '@fruits-chain/react-native-upload'
import AsyncStorage from '@react-native-async-storage/async-storage'
import create from 'zustand'
import { persist } from 'zustand/middleware'

type UUID = string

interface Group {
  uuid: UUID
  queue: Job[]
}

interface Job {
  uuid: UUID
  queue: Task[]
}

interface Task {
  uuid: UUID
  file: UploadItem
}

type File = Parameters<UploadAction>['0']['file']
type Uploader = (file: File) => ReturnType<UploadAction>
let _request: Uploader

/**
 * 初始化
 * @param uploader 文件上传器
 */
export const init = (uploader: Uploader) => {
  _request = uploader
}

export const getUploader = () => {
  return _request
}

interface BackUploadState {
  _groupQueueMap: Record<UUID, Group>
  _groupQueue: UUID[]
  enqueueGroup: (groupUuid: UUID) => Group
  dequeueGroup: (groupUuid: UUID) => void

  jobQueueMap: Record<UUID, Job>
  enqueueJob: (groupUuid: UUID, jobUuid: UUID) => Job
  dequeueJob: (groupUuid: UUID, jobUuid: UUID) => void

  _taskQueueMap: Record<UUID, Task>
  enqueueTask: (
    groupUuid: UUID,
    jobUuid: UUID,
    taskUuid: UUID,
    file: UploadItem,
  ) => Task
  dequeueTask: (groupUuid: UUID, jobUuid: UUID, taskUuid: UUID) => void

  finishedTask: Record<UUID, Record<UUID, Record<UUID, Task>>>
  setFinishedTask: (
    groupUuid: UUID,
    jobUuid?: UUID,
    taskUuid?: UUID,
    file?: UploadItem,
  ) => void

  run: () => Promise<void>
  clear: () => void
}

let running = false

const stateFactory: () => Pick<
  BackUploadState,
  | '_groupQueue'
  | '_groupQueueMap'
  | '_taskQueueMap'
  | 'jobQueueMap'
  | 'finishedTask'
> = () => {
  return {
    _groupQueue: [],
    _groupQueueMap: {},
    _taskQueueMap: {},
    jobQueueMap: {},
    finishedTask: {},
  }
}

export const useBackUploadManager = create<BackUploadState>(
  persist(
    (set, get) => ({
      ...stateFactory(),

      clear() {
        set(stateFactory())
      },
      async run() {
        if (!_request) {
          throw new Error('init should be called')
        }
        if (running) {
          return
        }

        running = true
        while (get()._groupQueue.length) {
          const currGroup = get()._groupQueueMap[get()._groupQueue[0]]
          while (currGroup.queue.length) {
            const currJob = get().jobQueueMap[currGroup.queue[0].uuid]
            while (currJob.queue.length) {
              const currTask = get()._taskQueueMap[currJob.queue[0].uuid]
              const currFile = currTask.file
              try {
                const res = await _request({
                  uri: currFile.sliceUri,
                  name: currFile.name,
                  type: currFile.type,
                })
                currFile.status = 'done'
                currFile.origin = res
              } catch (err) {
                currFile.status = 'error'
              }

              delete get()._taskQueueMap[currTask.uuid]
              get().dequeueTask(currGroup.uuid, currJob.uuid, currTask.uuid)
              get().setFinishedTask(
                currGroup.uuid,
                currJob.uuid,
                currTask.uuid,
                currFile,
              )
            }
            delete get().jobQueueMap[currJob.uuid]
            get().dequeueJob(currGroup.uuid, currJob.uuid)
          }
          delete get()._groupQueueMap[currGroup.uuid]
          get().dequeueGroup(currGroup.uuid)
        }
        running = false
      },
      // eslint-disable-next-line max-params
      setFinishedTask(
        groupUuid: UUID,
        jobUuid?: UUID,
        taskUuid?: UUID,
        file?: UploadItem,
      ) {
        let group = get().finishedTask[groupUuid]
        if (!group && jobUuid) {
          group = {}
          get().finishedTask[groupUuid] = group
        } else if (!jobUuid) {
          delete get().finishedTask[groupUuid]
          set({
            finishedTask: { ...get().finishedTask },
          })
          return
        }

        let job = group[jobUuid]
        if (!job && taskUuid) {
          job = {}
          group[jobUuid] = job
        } else if (!taskUuid) {
          delete group[jobUuid]
          get().finishedTask[groupUuid] = { ...get().finishedTask[groupUuid] }
          set({
            finishedTask: { ...get().finishedTask },
          })
          return
        }

        let task = job[taskUuid]
        if (!task && file) {
          task = {
            uuid: taskUuid,
            file,
          }
          job[taskUuid] = task
        } else if (!file) {
          delete job[taskUuid]
        }
        group[jobUuid] = { ...group[jobUuid] }
        get().finishedTask[groupUuid] = { ...get().finishedTask[groupUuid] }
        set({
          finishedTask: { ...get().finishedTask },
        })
      },

      enqueueGroup(groupUuid: UUID) {
        let group = get()._groupQueueMap[groupUuid]
        if (!group) {
          get()._groupQueue.push(groupUuid)
          group = {
            uuid: groupUuid,
            queue: [],
          }
          get()._groupQueueMap[groupUuid] = group
        }
        return group
      },
      dequeueGroup(groupUuid: UUID) {
        get()._groupQueue = get()._groupQueue.filter(item => item !== groupUuid)
        delete get()._groupQueueMap[groupUuid]
      },

      enqueueJob(groupUuid, jobUuid) {
        let job = get().jobQueueMap[jobUuid]
        if (!job) {
          const group = get().enqueueGroup(groupUuid)
          job = {
            uuid: jobUuid,
            queue: [],
          }
          get().jobQueueMap[jobUuid] = job
          group.queue.push(job)
        }
        return job
      },
      dequeueJob(groupUuid, jobUuid) {
        const group = get().enqueueGroup(groupUuid)
        delete get().jobQueueMap[jobUuid]
        group.queue = group.queue.filter(item => item.uuid !== jobUuid)
      },

      // eslint-disable-next-line max-params
      enqueueTask(groupUuid, jobUuid, taskUuid, file) {
        let task = get()._taskQueueMap[taskUuid]
        if (!task) {
          const job = get().enqueueJob(groupUuid, jobUuid)
          task = {
            uuid: taskUuid,
            file,
          }
          get()._taskQueueMap[taskUuid] = task
          get().setFinishedTask(groupUuid, jobUuid, taskUuid)
          job.queue = [...job.queue, task]
        }
        get().run()
        return task
      },
      dequeueTask(groupUuid, jobUuid, taskUuid) {
        const job = get().enqueueJob(groupUuid, jobUuid)
        delete get()._taskQueueMap[taskUuid]
        job.queue = job.queue.filter(item => item.uuid !== taskUuid)
      },
    }),
    {
      getStorage: () => AsyncStorage,
      name: 'back-upload',
    },
  ),
)
