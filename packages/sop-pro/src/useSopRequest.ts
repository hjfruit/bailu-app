import { useApolloClient } from '@apollo/client'
import { useLayoutEffect, useMemo, useState } from 'react'
import { SopDetailResultPayload } from './graphql/generated/types'

import type {
  GetSopOrResultQuery,
  GetSopOrResultQueryVariables,
} from './graphql/operations/__generated__/common.generated'
import { GetSopOrResultDocument } from './graphql/operations/__generated__/common.generated'

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
  useLayoutEffect(() => {
    if (!sopIds?.length) return
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
    Promise.all(requestList)
      .then(resp => {
        setRequestResult({
          loading: false,
          error: false,
          // eslint-disable-next-line max-nested-callbacks
          data: resp?.map(res => {
            const resItem = res.data.getSopOrResult
            return resItem
          }) || [],
        })
      })
      .catch(() => {
        setRequestResult({
          loading: false,
          error: true,
          data: [],
        })
      })
      .finally(() => {})
  }, [businessId, client, sopIds])

  const result = useMemo(
    () => ({ loading, error, data }),
    [data, error, loading],
  )

  return result
}
