import type * as SchemaTypes from '../../generated/types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export type GetSopOrResultQueryVariables = SchemaTypes.Exact<{
  input?: SchemaTypes.InputMaybe<SchemaTypes.GetSopOrResultInput>;
}>;


export type GetSopOrResultQuery = { getSopOrResult?: { __typename?: 'SopDetailResultPayload', enabled?: SchemaTypes.EnabledEnum, enabledName?: string, sopId?: string, templateDesc?: string, templateName?: string, universal?: boolean, category?: { __typename?: 'CommodityCategoryEntity', categoryName?: string, id?: number }, sopCheckItems?: Array<{ __typename?: 'SopCheckItemResultPayload', enabled?: SchemaTypes.EnabledEnum, enabledName?: string, inputTextRule?: SchemaTypes.InputTextRule, isRemark?: boolean, name?: string, nameLocale?: any, remarkRequired?: boolean, remarks?: string, required?: boolean, snapshotId?: string, sopDetailId?: string, sopId?: string, sort?: number, type?: SchemaTypes.SopCheckItemEnum, typeName?: string, options?: Array<{ __typename?: 'SopOptionPayload', isRemark?: boolean, name?: string, nameLocale?: any, remarkRequired?: boolean, remarks?: string, sort?: number, value?: string }>, sopResult?: { __typename?: 'SopOrResultPayload', businessId?: string, cacheEnabled?: boolean, checkResult?: any, checkResultType?: SchemaTypes.SopCheckItemEnum, createTime?: number, fileLink?: any, remark?: string, sopDetailId?: string, sopId?: string, sopResultId?: string, userId?: number } }> } };

export type CacheAnswerMutationVariables = SchemaTypes.Exact<{
  input?: SchemaTypes.InputMaybe<SchemaTypes.CacheAnswerInput>;
}>;


export type CacheAnswerMutation = { cacheAnswer?: boolean };

export type UpdateSubmitAnswerMutationVariables = SchemaTypes.Exact<{
  input?: SchemaTypes.InputMaybe<SchemaTypes.UpdateSubmitAnswerInput>;
}>;


export type UpdateSubmitAnswerMutation = { updateSubmitAnswer?: boolean };

export type ServerTimeQueryVariables = SchemaTypes.Exact<{
  format?: SchemaTypes.InputMaybe<SchemaTypes.Format>;
}>;


export type ServerTimeQuery = { serverTime?: string };


export const GetSopOrResultDocument = gql`
    query getSopOrResult($input: GetSopOrResultInput) {
  getSopOrResult(input: $input) {
    category {
      categoryName
      id
    }
    enabled
    enabledName
    sopCheckItems {
      enabled
      enabledName
      inputTextRule
      isRemark
      name
      nameLocale
      options {
        isRemark
        name
        nameLocale
        remarkRequired
        remarks
        sort
        value
      }
      remarkRequired
      remarks
      required
      snapshotId
      sopDetailId
      sopId
      sopResult {
        businessId
        cacheEnabled
        checkResult
        checkResultType
        createTime
        fileLink
        remark
        sopDetailId
        sopId
        sopResultId
        userId
      }
      sort
      type
      typeName
    }
    sopId
    templateDesc
    templateName
    universal
  }
}
    `;

/**
 * __useGetSopOrResultQuery__
 *
 * To run a query within a React component, call `useGetSopOrResultQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSopOrResultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSopOrResultQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSopOrResultQuery(baseOptions?: Apollo.QueryHookOptions<GetSopOrResultQuery, GetSopOrResultQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSopOrResultQuery, GetSopOrResultQueryVariables>(GetSopOrResultDocument, options);
      }
export function useGetSopOrResultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSopOrResultQuery, GetSopOrResultQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSopOrResultQuery, GetSopOrResultQueryVariables>(GetSopOrResultDocument, options);
        }
export type GetSopOrResultQueryHookResult = ReturnType<typeof useGetSopOrResultQuery>;
export type GetSopOrResultLazyQueryHookResult = ReturnType<typeof useGetSopOrResultLazyQuery>;
export type GetSopOrResultQueryResult = Apollo.QueryResult<GetSopOrResultQuery, GetSopOrResultQueryVariables>;
export const CacheAnswerDocument = gql`
    mutation cacheAnswer($input: CacheAnswerInput) {
  cacheAnswer(input: $input)
}
    `;
export type CacheAnswerMutationFn = Apollo.MutationFunction<CacheAnswerMutation, CacheAnswerMutationVariables>;

/**
 * __useCacheAnswerMutation__
 *
 * To run a mutation, you first call `useCacheAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCacheAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cacheAnswerMutation, { data, loading, error }] = useCacheAnswerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCacheAnswerMutation(baseOptions?: Apollo.MutationHookOptions<CacheAnswerMutation, CacheAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CacheAnswerMutation, CacheAnswerMutationVariables>(CacheAnswerDocument, options);
      }
export type CacheAnswerMutationHookResult = ReturnType<typeof useCacheAnswerMutation>;
export type CacheAnswerMutationResult = Apollo.MutationResult<CacheAnswerMutation>;
export type CacheAnswerMutationOptions = Apollo.BaseMutationOptions<CacheAnswerMutation, CacheAnswerMutationVariables>;
export const UpdateSubmitAnswerDocument = gql`
    mutation updateSubmitAnswer($input: UpdateSubmitAnswerInput) {
  updateSubmitAnswer(input: $input)
}
    `;
export type UpdateSubmitAnswerMutationFn = Apollo.MutationFunction<UpdateSubmitAnswerMutation, UpdateSubmitAnswerMutationVariables>;

/**
 * __useUpdateSubmitAnswerMutation__
 *
 * To run a mutation, you first call `useUpdateSubmitAnswerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSubmitAnswerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSubmitAnswerMutation, { data, loading, error }] = useUpdateSubmitAnswerMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSubmitAnswerMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSubmitAnswerMutation, UpdateSubmitAnswerMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateSubmitAnswerMutation, UpdateSubmitAnswerMutationVariables>(UpdateSubmitAnswerDocument, options);
      }
export type UpdateSubmitAnswerMutationHookResult = ReturnType<typeof useUpdateSubmitAnswerMutation>;
export type UpdateSubmitAnswerMutationResult = Apollo.MutationResult<UpdateSubmitAnswerMutation>;
export type UpdateSubmitAnswerMutationOptions = Apollo.BaseMutationOptions<UpdateSubmitAnswerMutation, UpdateSubmitAnswerMutationVariables>;
export const ServerTimeDocument = gql`
    query serverTime($format: Format) {
  serverTime(format: $format)
}
    `;

/**
 * __useServerTimeQuery__
 *
 * To run a query within a React component, call `useServerTimeQuery` and pass it any options that fit your needs.
 * When your component renders, `useServerTimeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useServerTimeQuery({
 *   variables: {
 *      format: // value for 'format'
 *   },
 * });
 */
export function useServerTimeQuery(baseOptions?: Apollo.QueryHookOptions<ServerTimeQuery, ServerTimeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ServerTimeQuery, ServerTimeQueryVariables>(ServerTimeDocument, options);
      }
export function useServerTimeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ServerTimeQuery, ServerTimeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ServerTimeQuery, ServerTimeQueryVariables>(ServerTimeDocument, options);
        }
export type ServerTimeQueryHookResult = ReturnType<typeof useServerTimeQuery>;
export type ServerTimeLazyQueryHookResult = ReturnType<typeof useServerTimeLazyQuery>;
export type ServerTimeQueryResult = Apollo.QueryResult<ServerTimeQuery, ServerTimeQueryVariables>;