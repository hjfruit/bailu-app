import { formatUploadList } from '@fruits-chain/react-native-upload'
import { InputTextRule, SopCheckItemEnum } from './graphql/generated/types'
import type { SopDetailResultPayload } from './graphql/generated/types'
import type { Rule } from '@fruits-chain/react-native-xiaoshu'
import type { FileVO } from '@fruits-chain/react-native-upload'

export const maybeRules = (flag: boolean, rules: Rule[]) => {
  if (flag) return rules
  return []
}

export const maybeTips = (text: string, tips: string) => {
  if (tips) {
    return `${text}（${tips}）`
  }
  return text
}

export const fieldKeyMap: Record<SopCheckItemEnum, FieldKey> = {
  [SopCheckItemEnum.TextType]: 'TEXT_TYPE',
  [SopCheckItemEnum.RadioType]: 'RADIO_TYPE',
  [SopCheckItemEnum.FileType]: 'FILE_TYPE',
  [SopCheckItemEnum.DateType]: 'DATE_TYPE',
  [SopCheckItemEnum.CheckboxType]: 'CHECKBOX_TYPE',
  [SopCheckItemEnum.Unknown]: '',
  [SopCheckItemEnum.Unrecognized]: '',
  [SopCheckItemEnum.Unspecified]: '',
} as const

export const fieldDefaultValueMap: Record<SopCheckItemEnum, unknown> = {
  [SopCheckItemEnum.TextType]: '',
  [SopCheckItemEnum.RadioType]: '',
  [SopCheckItemEnum.FileType]: [],
  [SopCheckItemEnum.DateType]: '',
  [SopCheckItemEnum.CheckboxType]: [],
  [SopCheckItemEnum.Unknown]: '',
  [SopCheckItemEnum.Unrecognized]: '',
  [SopCheckItemEnum.Unspecified]: '',
} as const

export type FieldKey =
  | 'TEXT_TYPE'
  | 'RADIO_TYPE'
  | 'FILE_TYPE'
  | 'DATE_TYPE'
  | 'CHECKBOX_TYPE'
  | ''

const _fileList2uploadList = (files: FileVO[], conversion: boolean) => {
  return (
    files?.map?.(file => (conversion ? formatUploadList([file])[0] : file)) ||
    []
  )
}

export const data2formValues = (
  data: SopDetailResultPayload[],
  file2uploadItem = true,
) => {
  return (
    data?.map(template => ({
      ...template,
      sopCheckItems:
        template.sopCheckItems?.map(question => {
          const key = fieldKeyMap[question.type]
          let value = question.sopResult?.checkResult?.[key]
          // 数字类型：后端返回的string，需要解析为数字
          if (
            key === 'TEXT_TYPE' &&
            question.inputTextRule === InputTextRule.OnlyNumber
          ) {
            value = parseFloat(value)
            if (isNaN(value)) {
              value = null
            }
          }
          // 文件类型，需要转化为UploadItem[]类型
          if (key === 'FILE_TYPE') {
            value = _fileList2uploadList(value, file2uploadItem)
          }
          return {
            ...question,
            sopResult: {
              ...(question.sopResult || {}),
              fileLink: _fileList2uploadList(
                question.sopResult?.fileLink,
                file2uploadItem,
              ),
              checkResult: { [key]: value },
            },
          }
        }) || [],
    })) || []
  )
}
