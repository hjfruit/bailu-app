import { Form, Space } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'

import BackUpload from '@fruits-chain/upload'

import { fieldKeyMap, maybeRules } from '../helpers'

import Tips from './components/tips'
import Title from './components/title'
import type { FC } from 'react'
import type { CommonProps } from './interface'
import type { UploadItems } from '@/interface'

interface IProps extends CommonProps {}

const FileFormItem: FC<IProps> = ({
  form,
  formUuid,
  uuid,
  backUpload,
  question,
  watermark,
  name,
}) => {
  return (
    <Space gap={8} head={16} tail={12}>
      <Title text={question.name} required={question.required} />
      {!!question.remarks && <Tips text={question.remarks} />}
      <Form.Item
        name={[...name, 'checkResult', fieldKeyMap[question.type]]}
        rules={[
          ...maybeRules(question.required, [
            () => ({
              type: 'array',
              required: form.strictValidation,
              message: `请为[${question.name}]选择文件`,
            }),
          ]),
          () => ({
            validator(_, val: UploadItems) {
              if (!form.strictValidation) return Promise.resolve(true)
              if (val?.some(item => item.status === 'loading')) {
                return Promise.reject(
                  new Error(`${question.name}文件上传中...`),
                )
              }
              if (val?.some(item => item.status === 'error')) {
                return Promise.reject(new Error(`${question.name}文件上传失败`))
              }
              return Promise.resolve(true)
            },
          }),
        ]}
        valuePropName="list">
        <BackUpload
          groupUuid={formUuid}
          uuid={uuid}
          watermark={watermark}
          cropPickerMediaType="any"
          pickerType={[
            'cropPicker',
            'cropCameraPhoto',
            'cropCameraVideo',
            'visionCamera',
          ]}
          backUpload={backUpload}
          maxCount={10}
          tipText="图片/视频"
        />
      </Form.Item>
    </Space>
  )
}

export default FileFormItem
