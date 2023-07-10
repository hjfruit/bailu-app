import { fieldDefaultValueMap, fieldKeyMap } from '@fruits-chain/sop'
import { InputTextRule, SopCheckItemEnum } from './graphql/generated/types'
import type { UploadItem } from '@fruits-chain/react-native-upload'

import type { SopFormValues } from '@fruits-chain/sop'
import type { ResultReqInput } from './graphql/generated/types'

/**
 * 将upload组件的值格式化为中台入参标准格式
 * @param fileList upload组件的list
 * @returns 标准格式参数
 */
const _getFileInfo = (fileList: UploadItem[]) => {
  return {
    [fieldKeyMap[SopCheckItemEnum.FileType]]:
      fileList
        ?.map?.(file => {
          if (file.status === 'done') {
            const originInfo = file.origin
            return {
              fileId: originInfo?.fileId,
              fileUrl: originInfo?.fileUrl,
              filename: originInfo?.filename,
            }
          }
          return false
        })
        ?.filter(Boolean) || [],
  }
}

type Format = (values: SopFormValues) => ResultReqInput[]
/**
 * 将SopForm表单值格式化为中台入参标准格式
 * @param values 表单值
 * @return 标准格式参数
 */
export const format: Format = values => {
  return values?.sopList
    ?.map?.(template => ({
      sopId: template.sopId,
      resultReqs: template.sopCheckItems?.map?.(question => {
        const key = fieldKeyMap[question.type]
        let value = question.sopResult?.checkResult?.[key]
        const questionType = question.type as unknown as SopCheckItemEnum
        const inputTextRule = question.inputTextRule as unknown as InputTextRule
        // 数字输入需要转换为string传给中台
        if (
          questionType === SopCheckItemEnum.TextType &&
          inputTextRule === InputTextRule.OnlyNumber
        ) {
          value = value?.toString()
        }

        const checkResult =
          questionType === SopCheckItemEnum.FileType
            ? _getFileInfo(value)
            : {
                [key]: value ?? fieldDefaultValueMap[questionType],
              }
        return {
          sopDetailId: question.sopDetailId,
          fileLink: _getFileInfo(
            question.sopResult?.fileLink?.[
              fieldKeyMap[SopCheckItemEnum.FileType]
            ],
          ),
          remark: question.sopResult?.remark || '',
          checkResult,
        }
      }),
    }))
    ?.filter(item => item.resultReqs)
}
