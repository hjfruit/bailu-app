import { useApolloClient } from '@apollo/client'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { GetSopOrResultDocument } from './graphql/operations/__generated__/common.generated'
import type { SopDetailResultPayload } from './graphql/generated/types'

import type {
  GetSopOrResultQuery,
  GetSopOrResultQueryVariables,
} from './graphql/operations/__generated__/common.generated'

export interface RequestResult {
  /** sop请求是否loading */
  loading: boolean
  /** sop请求是否失败 */
  error: boolean
  /** sop信息 */
  data: SopDetailResultPayload[]
}

/**
 * 获取SOP模板+答案hook
 */
export default (businessId: string, sopIds: string[]) => {
  const client = useApolloClient()

  const [{ loading, error, data }, setRequestResult] = useState<RequestResult>({
    loading: true,
    error: false,
    data: [],
  })

  const refresh = useCallback(() => {
    setRequestResult({
      loading: true,
      error: false,
      data: [],
    })
    const requestList = sopIds.map(sopId =>
      client.query<GetSopOrResultQuery, GetSopOrResultQueryVariables>({
        query: GetSopOrResultDocument,
        variables: {
          input: {
            businessId,
            sopId,
          },
        },
      }),
    )
    return Promise.all(requestList)
      .then(resp => {
        setRequestResult({
          loading: false,
          error: false,
          // eslint-disable-next-line max-nested-callbacks
          data:
            resp?.map(res => {
              const resItem = res.data.getSopOrResult
              return resItem
            }) || [],
        })
        return true
      })
      .catch(() => {
        setRequestResult({
          loading: false,
          error: true,
          data: [],
        })
        return false
      })
  }, [businessId, client, sopIds])
  useLayoutEffect(() => {
    if (!sopIds?.length) return
    refresh()
  }, [refresh, sopIds?.length])

  const result = useMemo(
    () => ({ loading, error, data, refresh }),
    [data, error, loading, refresh],
  )

  return result
}
