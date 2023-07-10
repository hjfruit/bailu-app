import { useApolloClient } from '@apollo/client'
import { useCallback } from 'react'
import { ServerTimeDocument } from './graphql/operations/__generated__/common.generated'
import { Format } from './graphql/generated/types'
import type {
  ServerTimeQuery,
  ServerTimeQueryVariables,
} from './graphql/operations/__generated__/common.generated'

export interface Watermark {
  /**
   * 水印是否必需, 如果获取失败, 则禁止上传
   * @default true
   */
  required: boolean
  /** 获取水印 */
  content?: string[] | (() => Promise<string[]>)
}

interface Options {
  watermark: Watermark
}

export default ({ watermark }: Options) => {
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
    const contentPromise = Array.isArray(watermark.content)
      ? Promise.resolve(watermark.content)
      : watermark.content?.() || Promise.resolve([])
    return Promise.all([serverTime, contentPromise])
      .then(([time, customerText]) => {
        return [...(customerText || []), time]
      })
      .catch(() => {
        if (watermark.required) {
          return Promise.reject(new Error('水印获取失败'))
        }
        return Promise.resolve([])
      })
  }, [client, watermark])
  return getWatermark
}
