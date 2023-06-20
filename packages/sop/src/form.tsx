import {
  Form,
  Collapse,
  Divider,
  Card,
} from '@fruits-chain/react-native-xiaoshu'
import React, { Fragment, useEffect, useMemo } from 'react'
import type { FC, ReactNode } from 'react'
import { View } from 'react-native'

import { InputTextRule, SopCheckItemEnum } from './graphql/generated/types'
import type {
  SopCheckItemResultPayload,
  SopDetailResultPayload,
} from './graphql/generated/types'

import CheckboxFormItem from './questions/checkbox'
import DateFormItem from './questions/date'
import FileFormItem from './questions/file'
import NumberFormItem from './questions/number'
import RadioFormItem from './questions/radio'
import TextFormItem from './questions/text'
import { data2formValues } from './helpers'

interface IProps {
  /** 表单唯一标识（全局唯一） */
  uuid: string
  /**
   * 文件是否启用后台上传
   * @default true
   */
  backUpload?: boolean
  /** 表单数据是否加载中(加载中的表单不允许提交) */
  loading?: boolean
  /** form（通过useSopForm获取） */
  form: SopFormInstance
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

export type SopFormInstance = ReturnType<typeof useSopForm>

export interface SopFormValues {
  sopList: SopDetailResultPayload[]
}

export const useSopForm = () => {
  const [_form] = Form.useForm<SopFormValues>()
  // strictValidation为false时，部分校验规则会被关闭
  const form = useMemo(() => {
    return { ..._form, strictValidation: true }
  }, [_form])
  return form
}

/** SOP业务表单组件 */
const SopForm: FC<IProps> = ({
  uuid,
  backUpload = true,
  loading,
  form,
  title,
  data,
  wrapper,
}) => {
  useEffect(() => {
    form.setFieldsValue({
      sopList: data2formValues(data),
    })
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
            return (
              <>
                <Card loading />
                {/* 防止此时表单被提交 */}
                <Form.Item
                  name={['__validator__']}
                  rules={[
                    {
                      required: true,
                      message: '表单数据加载中...',
                    },
                  ]}
                />
              </>
            )
          }

          return templateFields.map(templateField => {
            const templateData = form.getFieldValue([
              'sopList',
              templateField.name,
            ]) as SopDetailResultPayload

            const templateContentJSX = (
              <Form.List name={[templateField.name, 'sopCheckItems']}>
                {questionFields => {
                  return questionFields.map((questionField, index) => {
                    const namePrefix = [
                      'sopList',
                      templateField.name,
                      'sopCheckItems',
                    ]
                    const questionData = form.getFieldValue([
                      ...namePrefix,
                      questionField.name,
                    ]) as SopCheckItemResultPayload
                    const isNotLastAnswer = index !== questionFields.length - 1

                    const commonProps = {
                      form,
                      formUuid: uuid,
                      uuid: `${uuid}_${questionData.sopDetailId}`,
                      question: questionData,
                      namePrefix: namePrefix,
                      name: [questionField.name, 'sopResult'],
                      backUpload,
                    }
                    const control = (() => {
                      switch (questionData.type) {
                        case SopCheckItemEnum.CheckboxType:
                          return <CheckboxFormItem {...commonProps} />
                        case SopCheckItemEnum.DateType:
                          return <DateFormItem {...commonProps} />
                        case SopCheckItemEnum.FileType:
                          return <FileFormItem {...commonProps} />
                        case SopCheckItemEnum.RadioType:
                          return <RadioFormItem {...commonProps} />
                        case SopCheckItemEnum.TextType:
                          if (
                            questionData.inputTextRule ===
                            InputTextRule.OnlyNumber
                          ) {
                            return <NumberFormItem {...commonProps} />
                          }
                          return <TextFormItem {...commonProps} />
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
                    return (
                      <Fragment key={questionField.key}>
                        {control}
                        {isNotLastAnswer && <Divider />}
                      </Fragment>
                    )
                  })
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
                lazyRender={false}
                titleTextStyle={{ fontWeight: 'bold', fontSize: 18 }}>
                <View style={{ paddingHorizontal: 12 }}>
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

export default SopForm
