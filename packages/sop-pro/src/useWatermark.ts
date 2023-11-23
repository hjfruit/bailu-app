import { useApolloClient } from '@apollo/client'
import { useCallback, useMemo } from 'react'
import { requestGeoPosition } from '@fruits-chain/dashu-geo'
import { ServerTimeDocument } from './graphql/operations/__generated__/common.generated'
import { Format } from './graphql/generated/types'
import type { SopForm } from '@fruits-chain/sop'
import type { ComponentProps } from 'react'
import type {
  ServerTimeQuery,
  ServerTimeQueryVariables,
} from './graphql/operations/__generated__/common.generated'

export interface Watermark {
  /**
   * 水印是否必需, 如果获取失败, 则禁止上传
   * @default true
   */
  required?: boolean
  /** 获取水印 */
  content?: string[] | (() => Promise<string[]>)
  /** 获取水印（支持富文本/图片详细见@fruits-chain/react-native-upload） */
  richContent?: ComponentProps<typeof SopForm>['uploadProps']['watermark']
}

interface Options {
  watermark: Watermark
}

export default ({ watermark: _watermark }: Options) => {
  // 设置默认值
  const watermark: Watermark = useMemo(() => {
    return {
      required: _watermark?.required ?? true,
      content: _watermark?.content ?? [],
      richContent: _watermark?.richContent ?? [],
    }
  }, [_watermark?.content, _watermark?.required, _watermark?.richContent])

  const client = useApolloClient()

  const getWatermark = useCallback(() => {
    const serverTime = client
      .query<ServerTimeQuery, ServerTimeQueryVariables>({
        query: ServerTimeDocument,
        variables: {
          format: Format.YyyyMmDdHhMmSs,
        },
      })
      .then(res => res.data.serverTime)

    const geo = requestGeoPosition()

    const contentPromise = Array.isArray(watermark.content)
      ? Promise.resolve(watermark.content)
      : watermark.content?.() || Promise.resolve([] as string[])

    return Promise.all([serverTime, geo, contentPromise])
      .then(([time, geoInfo, customerText]) => {
        // 地址限制处理约120个字符，超出的文字可能会被截断
        return [
          ...(customerText || []),
          `经度：${geoInfo.lng}`,
          `纬度：${geoInfo.lat}`,
          `地址：${geoInfo.address?.slice(0, 27)}`,
          `${geoInfo.address?.slice(27, 57) ?? ''}`,
          `${geoInfo.address?.slice(57, 87) ?? ''}`,
          `${geoInfo.address?.slice(87) ?? ''}`,
          `时间：${time}`,
        ].filter(Boolean)
      })
      .catch((err: Error) => {
        if (watermark.required) {
          return Promise.reject(
            new Error(`水印获取失败：${err.message || '未知错误'}`),
          )
        }
        return Promise.resolve('')
      })
  }, [client, watermark])

  return useMemo(() => {
    return [getWatermark, ...(watermark.richContent || [])]
  }, [getWatermark, watermark.richContent])
}
