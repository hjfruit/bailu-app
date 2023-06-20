import { Form, Collapse, Card, Space } from '@fruits-chain/react-native-xiaoshu'
import React, { useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from 'react-native'

import { InputTextRule, SopCheckItemEnum } from './graphql/generated/types'
import type {
  SopCheckItemResultPayload,
  SopDetailResultPayload,
} from './graphql/generated/types'

import CheckboxPreview from './questions/checkbox.preview'
import DatePreview from './questions/date.preview'
import FileFormPreview from './questions/file.preview'
import NumberPreview from './questions/number.preview'
import RadioPreview from './questions/radio.preview'
import TextPreview from './questions/text.preview'
import { data2formValues } from './helpers'

interface IProps {
  /** 数据是否加载中 */
  loading?: boolean
  /** sop模板数据（带有答案，由中台接口直出） */
  data: SopDetailResultPayload[]
  /** 每个模板title，用于渲染模板名 */
  title: string | ((templateData: SopDetailResultPayload) => string)
  /** 模板内容外部的包裹层，用于自定义容器UI */
  wrapper?: (
    templateData: SopDetailResultPayload,
    templateJSX: ReactNode,
  ) => ReactNode
}

interface SopFormValues {
  sopList: SopDetailResultPayload[]
}

/** SOP业务预览组件 */
const SopPreview: FC<IProps> = ({ loading, title, data, wrapper }) => {
  const [form] = Form.useForm<SopFormValues>()
  useEffect(() => {
    form.setFieldValue('sopList', data2formValues(data, false))
  }, [data, form])

  return (
    <Form
      form={form}
      initialValues={{
        sopList: data,
      }}>
      <Form.List name="sopList">
        {templateFields => {
          if (loading) {
            return <Card loading />
          }

          return templateFields.map(templateField => {
            const templateData = form.getFieldValue([
              'sopList',
              templateField.name,
            ]) as SopDetailResultPayload

            const templateContentJSX = (
              <Form.List name={[templateField.name, 'sopCheckItems']}>
                {questionFields => {
                  return (
                    <Space gap={24}>
                      {questionFields.map(questionField => {
                        const namePrefix = [
                          'sopList',
                          templateField.name,
                          'sopCheckItems',
                        ]
                        const questionData = form.getFieldValue([
                          ...namePrefix,
                          questionField.name,
                        ]) as SopCheckItemResultPayload

                        const commonProps = {
                          question: questionData,
                          namePrefix: namePrefix,
                          name: [questionField.name, 'sopResult'],
                        }
                        const control = (() => {
                          switch (questionData.type) {
                            case SopCheckItemEnum.CheckboxType:
                              return <CheckboxPreview {...commonProps} />
                            case SopCheckItemEnum.DateType:
                              return <DatePreview {...commonProps} />
                            case SopCheckItemEnum.FileType:
                              return <FileFormPreview {...commonProps} />
                            case SopCheckItemEnum.RadioType:
                              return <RadioPreview {...commonProps} />
                            case SopCheckItemEnum.TextType:
                              if (
                                questionData.inputTextRule ===
                                InputTextRule.OnlyNumber
                              ) {
                                return <NumberPreview {...commonProps} />
                              }
                              return <TextPreview {...commonProps} />
                            case SopCheckItemEnum.Unknown:
                            case SopCheckItemEnum.Unrecognized:
                            case SopCheckItemEnum.Unspecified:
                              break
                            default: {
                              const exhaustiveCheck: never | null | undefined =
                                questionData.type
                              // eslint-disable-next-line no-console
                              console.warn(
                                `SopForm: unknown type of ${exhaustiveCheck}`,
                              )
                            }
                          }
                          return null
                        })()
                        return control
                      })}
                    </Space>
                  )
                }}
              </Form.List>
            )

            if (wrapper) {
              return wrapper(templateData, templateContentJSX)
            }
            return (
              <Collapse
                key={templateData.sopId}
                bodyPadding={false}
                title={
                  typeof title === 'function' ? title(templateData) : title
                }
                titleTextStyle={{ fontWeight: 'bold', fontSize: 18 }}>
                <View style={{ paddingHorizontal: 12, paddingVertical: 16 }}>
                  {templateContentJSX}
                </View>
              </Collapse>
            )
          })
        }}
      </Form.List>
    </Form>
  )
}

export default SopPreview
