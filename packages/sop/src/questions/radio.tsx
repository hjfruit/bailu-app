import { Field, Form, Space } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'

import { fieldKeyMap, maybeRules } from '../helpers'

import Option from './components/option'
import Textarea from './components/textarea'
import Title from './components/title'
import FileRemarkFormItem from './file-remark'
import Tips from './components/tips'
import type { CommonProps } from './interface'
import type { FC } from 'react'

interface IProps extends CommonProps {}

const RadioFormItem: FC<IProps> = ({
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
        remarkRequired: option?.remarkRequired,
        isRemark: option?.isRemark,
        remarks: option?.remarks,
      }
    }) || []
  return (
    <Form.Item shouldUpdate>
      {({ getFieldValue }) => {
        const namePath = [...name, 'checkResult', fieldKeyMap[question.type]]
        const selectedValue = getFieldValue([...namePrefix, ...namePath])
        const selectedOption = options.find(
          item => item.value === selectedValue,
        )
        return (
          <Space gap={0} head={8} tail={12}>
            <Form.Item
              name={namePath}
              rules={maybeRules(question.required, [
                () => ({
                  required: form.strictValidation,
                  message: `请选择[${question.name}]`,
                }),
              ])}>
              <Field.Selector
                options={options.map(option => ({
                  ...option,
                  render() {
                    return <Option option={option} />
                  },
                }))}
                title={
                  <Title required={question.required} text={question.name} />
                }
                innerStyle={{
                  marginHorizontal: 0,
                  paddingHorizontal: 0,
                  alignItems: 'center',
                }}
                divider={false}
                clearable
                placeholder="请选择"
                {...restProps}
              />
            </Form.Item>
            <Space gap={12}>
              {!!question.remarks && <Tips text={question.remarks} />}
              {selectedOption?.isRemark && (
                <Form.Item
                  name={[...name, 'remark']}
                  rules={[
                    ...maybeRules(selectedOption.remarkRequired, [
                      () => ({
                        required: form.strictValidation,
                        message: `请输入[${question.name}]备注`,
                      }),
                    ]),
                  ]}>
                  <Textarea />
                </Form.Item>
              )}
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
          </Space>
        )
      }}
    </Form.Item>
  )
}

export default RadioFormItem
