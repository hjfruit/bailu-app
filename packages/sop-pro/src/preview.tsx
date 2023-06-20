import { Empty } from '@fruits-chain/react-native-xiaoshu'
import type { FC } from 'react'
import React from 'react'

import { SopPreview } from '@fruits-chain/sop'

import useSopRequest from './useSopRequest'

interface IProps {
  businessId: string
  sopIds: string[]
  title: string
}

/**
 * - SopForm的二次封装，内置了获取模板+答案等API操作
 * - 若需个性化定制UI，请直接使用SopForm组件
 */
const SopPreviewPro: FC<IProps> = ({ businessId, sopIds, title }) => {
  const { loading, data, error } = useSopRequest(businessId, sopIds)

  if (!sopIds?.length) return null
  if (error) return <Empty text={`${title}数据加载异常`} />

  return <SopPreview loading={loading} data={data as any} title={title} />
}

export default SopPreviewPro
