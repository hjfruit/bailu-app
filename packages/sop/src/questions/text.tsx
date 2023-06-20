import { Form, Space, TextInput } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'
import type { FC } from 'react'

import { fieldKeyMap, maybeRules } from '../helpers'

import Tips from './components/tips'
import Title from './components/title'
import FileRemarkFormItem from './file-remark'
import type { CommonProps } from './interface'

interface IProps extends CommonProps {}

const TextFormItem: FC<IProps> = ({
  form,
  formUuid,
  uuid,
  backUpload,
  question,
  namePrefix,
  name,
  ...restProps
}) => {
  return (
    <>
      <Space head={16} gap={8}>
        <Title required={question.required} text={question.name} />
        {!!question.remarks && <Tips text={question.remarks} />}
      </Space>
      <Space gap={12} head tail>
        <Form.Item
          name={[...name, 'checkResult', fieldKeyMap[question.type]]}
          rules={maybeRules(question.required, [
            () => ({
              required: form.strictValidation,
              message: `请填写[${question.name}]`,
            }),
          ])}>
          <TextInput
            type="textarea"
            placeholder="请填写"
            textAlign="left"
            bordered
            {...restProps}
          />
        </Form.Item>
        {question.isRemark && (
          <FileRemarkFormItem
            form={form}
            formUuid={formUuid}
            uuid={uuid}
            backUpload={backUpload}
            question={question}
            namePrefix={namePrefix}
            name={name}
          />
        )}
      </Space>
    </>
  )
}

export default TextFormItem
