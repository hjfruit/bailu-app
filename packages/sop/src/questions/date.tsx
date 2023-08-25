import { Field, Form, Space } from '@fruits-chain/react-native-xiaoshu'
import dayjs from 'dayjs'
import React from 'react'

import { fieldKeyMap, maybeRules } from '../helpers'

import Tips from './components/tips'
import Title from './components/title'
import FileRemarkFormItem from './file-remark'
import type { FC } from 'react'
import type { CommonProps } from './interface'

interface IProps extends CommonProps {}

const DateFormItem: FC<IProps> = ({
  form,
  question,
  namePrefix,
  name,
  uploadProps,
  ...restProps
}) => {
  const namePath = [...name, 'checkResult', fieldKeyMap[question.type]]
  const wholeNamePath = [...namePrefix, ...namePath]
  return (
    <>
      <Form.Item
        name={namePath}
        rules={maybeRules(question.required, [
          () => ({
            required: form.strictValidation,
            message: `请选择${question.name}`,
          }),
        ])}
      />
      <Space gap={0} head={8} tail={12}>
        <Form.Item shouldUpdate>
          {({ getFieldValue, setFieldValue }) => {
            // 格式化字符串为Date
            let value: Date = getFieldValue(wholeNamePath)
            if (value) {
              value = new Date(+dayjs(value))
            }

            return (
              <Field.Date
                title={
                  <Title required={question.required} text={question.name} />
                }
                divider={false}
                mode="Y-h"
                onChange={val => {
                  // 格式化Date为字符串
                  const finalVal = val
                    ? dayjs(val).format('YYYY-MM-DD HH')
                    : null
                  setFieldValue(wholeNamePath, finalVal)
                }}
                value={value}
                clearable
                innerStyle={{
                  marginHorizontal: 0,
                  paddingHorizontal: 0,
                  alignItems: 'center',
                }}
                placeholder="请选择"
                {...restProps}
              />
            )
          }}
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
    </>
  )
}

export default DateFormItem
