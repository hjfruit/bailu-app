import { Empty } from '@fruits-chain/react-native-xiaoshu'
import React, { useImperativeHandle, forwardRef } from 'react'

import { SopPreview } from '@fruits-chain/sop'

import useSopRequest from './useSopRequest'
import type { ComponentProps } from 'react'
import type { RequestResult } from './useSopRequest'

type SopPreviewProps = ComponentProps<typeof SopPreview>

interface IProps {
  businessId: string
  sopIds: string[]
  title: string
}

export interface SopPreviewProState extends RequestResult {
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
const SopPreviewPro = forwardRef<SopPreviewProState, IProps>(
  ({ businessId, sopIds, title }, ref) => {
    const { loading, data, error, refresh } = useSopRequest(businessId, sopIds)
    useImperativeHandle(ref, () => ({ loading, data, error, refresh }))

    if (!sopIds?.length) return null
    if (error) return <Empty text={`${title}数据加载异常`} />

    return (
      <SopPreview
        loading={loading}
        data={data as unknown as SopPreviewProps['data']}
        title={title}
      />
    )
  },
)

export default SopPreviewPro
