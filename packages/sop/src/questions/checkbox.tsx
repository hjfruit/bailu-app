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
  formUuid,
  uuid,
  backUpload,
  question,
  namePrefix,
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
    <Space head={8} tail={question.isRemark ? 12 : 8} gap={12}>
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
      {!!question.remarks && <Tips text={question.remarks} />}
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
  )
}

export default CheckboxFormItem
