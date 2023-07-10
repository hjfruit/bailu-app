import { useApolloClient } from '@apollo/client'
import { Empty, Toast } from '@fruits-chain/react-native-xiaoshu'
import React, { forwardRef, useImperativeHandle } from 'react'

import { SopForm, useSopForm } from '@fruits-chain/sop'
import { useBackUploadManager } from '@fruits-chain/upload'
import {
  CacheAnswerDocument,
  UpdateSubmitAnswerDocument,
} from './graphql/operations/__generated__/common.generated'
import { format } from './helpers'
import useSopRequest from './useSopRequest'
import useWatermark from './useWatermark'
import type { Watermark } from './useWatermark'
import type {
  CacheAnswerMutation,
  CacheAnswerMutationVariables,
  UpdateSubmitAnswerMutation,
  UpdateSubmitAnswerMutationVariables,
} from './graphql/operations/__generated__/common.generated'
import type { SopFormInstance } from '@fruits-chain/sop'

import type { RequestResult } from './useSopRequest'

interface IProps {
  uuid: string
  businessId: string
  sopIds: string[]
  title: string
  watermark?: Watermark
}

export interface SopFormProState extends RequestResult {
  /** SopForm实例 */
  form: SopFormInstance
  /**
   * 向中台请求暂存
   * - true 请求成功
   * - false 请求失败
   */
  requestTempSave: () => Promise<boolean>
  /**
   * 向中台请求暂存
   * - true 请求成功
   * - false 请求失败
   */
  requestSave: () => Promise<boolean>
  /** 清除后台上传图片缓存 */
  clear: () => void
  /**
   * 刷新数据(模板+答案)
   * - true 刷新成功
   * - false 刷新失败
   */
  refresh: () => Promise<boolean>
}

/**
 * - SopForm的二次封装，内置了获取模板+答案等API操作
 * - 若需个性化定制UI，请直接使用SopForm组件
 */
const SopFormPro = forwardRef<SopFormProState, IProps>(
  (
    {
      uuid,
      businessId,
      sopIds,
      title,
      watermark = {
        required: true,
      },
    },
    ref,
  ) => {
    const client = useApolloClient()

    const form = useSopForm()
    const setFinishedTask = useBackUploadManager(state => state.setFinishedTask)
    useImperativeHandle<SopFormProState, SopFormProState>(ref, () => ({
      loading,
      error,
      data,
      refresh,
      form,
      requestTempSave() {
        const { close } = Toast.loading('暂存中...')
        form.strictValidation = false
        return form
          .validateFields()
          .then(values => {
            return client.mutate<
              CacheAnswerMutation,
              CacheAnswerMutationVariables
            >({
              mutation: CacheAnswerDocument,
              variables: {
                input: {
                  businessId,
                  result: format(values),
                },
              },
            })
          })
          .then(() => {
            setFinishedTask(uuid)
            Toast.success('暂存成功')
            return Promise.resolve(true)
          })
          .catch(() => {
            return Promise.resolve(false)
          })
          .finally(() => {
            close()
            form.strictValidation = true
          })
      },
      requestSave() {
        const { close } = Toast.loading('保存中...')
        form.strictValidation = true
        return form
          .validateFields()
          .then(values => {
            return client.mutate<
              UpdateSubmitAnswerMutation,
              UpdateSubmitAnswerMutationVariables
            >({
              mutation: UpdateSubmitAnswerDocument,
              variables: {
                input: {
                  businessId,
                  result: format(values),
                },
              },
            })
          })
          .then(() => {
            setFinishedTask(uuid)
            Toast.success('保存成功')
            return Promise.resolve(true)
          })
          .catch(() => {
            return Promise.resolve(false)
          })
          .finally(() => {
            close()
            form.strictValidation = true
          })
      },
      clear() {
        setFinishedTask(uuid)
      },
    }))

    const { loading, data, error, refresh } = useSopRequest(businessId, sopIds)
    const getWatermark = useWatermark({ watermark })

    if (!sopIds?.length) return null
    if (error) return <Empty text={`${title}数据加载异常`} />

    return (
      <SopForm
        loading={loading}
        uuid={uuid}
        form={form}
        watermark={getWatermark}
        data={data as any}
        title={title}
      />
    )
  },
)

export default SopFormPro
