import { Form } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'

import Upload from '@fruits-chain/upload'

import { maybeRules } from '../helpers'

import type { UploadItems } from '../interface'
import type { CommonProps } from './interface'
import type { FC } from 'react'

interface IProps extends CommonProps {}

const FileRemarkFormItem: FC<IProps> = ({
  form,
  question,
  name,
  uploadProps,
}) => {
  return (
    <Form.Item
      name={[...name, 'fileLink']}
      rules={[
        ...maybeRules(question.remarkRequired, [
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
              return Promise.reject(new Error(`${question.name}文件上传中...`))
            }
            if (val?.some(item => item.status === 'error')) {
              return Promise.reject(new Error(`${question.name}文件上传失败`))
            }
            return Promise.resolve(true)
          },
        }),
      ]}
      valuePropName="list">
      <Upload
        cropPickerMediaType="any"
        pickerType={[
          'cropPicker',
          'cropCameraPhoto',
          'cropCameraVideo',
          'visionCamera',
        ]}
        maxCount={10}
        tipText="图片/视频"
        {...uploadProps}
      />
    </Form.Item>
  )
}

export default FileRemarkFormItem
