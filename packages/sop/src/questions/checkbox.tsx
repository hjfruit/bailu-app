import { Field, Form, Space } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'

import { fieldKeyMap, maybeRules } from '../helpers'

import Option from './components/option'
import Title from './components/title'
import FileRemarkFormItem from './file-remark'
import Tips from './components/tips'
import type { CommonProps } from './interface'
import type { FC } from 'react'

interface IProps extends CommonProps {}

const CheckboxFormItem: FC<IProps> = ({
  form,
  question,
  namePrefix,
  uploadProps,
  name,
  ...restProps
}) => {
  const options =
    question.options?.map(option => {
      return {
        label: option?.name,
        value: option?.value,
        remarks: option?.remarks,
      }
    }) || []

  return (
    <Space gap={0} head={8} tail={12}>
      <Form.Item
        name={[...name, 'checkResult', fieldKeyMap[question.type]]}
        rules={maybeRules(question.required, [
          () => ({
            type: 'array',
            required: form.strictValidation,
            message: `请选择${question.name}`,
          }),
        ])}>
        <Field.Selector
          multiple
          options={options.map(option => ({
            ...option,
            render() {
              return <Option bg option={option} />
            },
          }))}
          title={<Title required={question.required} text={question.name} />}
          innerStyle={{
            marginHorizontal: 0,
            paddingHorizontal: 0,
            alignItems: 'center',
          }}
          clearable
          placeholder="请选择"
          divider={false}
          {...restProps}
        />
      </Form.Item>
      <Space gap={12}>
        {!!question.remarks && <Tips text={question.remarks} />}
        {question.isRemark && (
          <FileRemarkFormItem
            form={form}
            question={question}
            namePrefix={namePrefix}
            name={name}
            uploadProps={uploadProps}
          />
        )}
      </Space>
    </Space>
  )
}

export default CheckboxFormItem
