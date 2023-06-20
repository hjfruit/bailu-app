import Upload from '@fruits-chain/react-native-upload'
import { Form, Space } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'
import type { FC } from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

import type { SopCheckItemResultPayload } from '../../graphql/generated/types'
import { SopCheckItemEnum } from '../../graphql/generated/types'

import type { FieldKey } from '../../helpers'
import { maybeTips } from '../../helpers'

interface IProps {
  field: FieldKey
  name: (number | string)[]
  namePrefix: (string | number)[]
  question: SopCheckItemResultPayload
}

const ContentPreview: FC<IProps> = ({ name, namePrefix, question, field }) => {
  const namePath = [...namePrefix, ...name, 'checkResult', field]
  const remarkPath = [...namePrefix, ...name, 'remark']
  const mediaPath = [...namePrefix, ...name, 'fileLink', 'FILE_TYPE']

  return (
    <Form.Item shouldUpdate>
      {({ getFieldValue }) => {
        let result = getFieldValue(namePath)
        const remark = getFieldValue(remarkPath)
        const media = getFieldValue(mediaPath)

        // 单选需要将选项的remarks连接
        if (question.type === SopCheckItemEnum.RadioType) {
          const option = question.options.find(opt => opt.value === result)
          result = maybeTips(option?.name, option?.remarks)
        }

        if (question.type === SopCheckItemEnum.CheckboxType) {
          result = (result as number[])
            ?.map(val => {
              const option = question.options.find(opt => opt.value === val)
              return maybeTips(option.name, option.remarks)
            })
            .join('、')
        }

        return (
          <Space gap={4} head>
            {question.type !== SopCheckItemEnum.FileType && <View style={styles.wrap}>
              <Text style={styles.text}>
                {maybeTips(result || '未填写', remark)}
              </Text>
            </View>}
            {question.type === SopCheckItemEnum.FileType && !!result && <Upload.Preview list={result} />}
            {!!media && <Upload.Preview list={media} />}
          </Space>
        )
      }}
    </Form.Item>
  )
}

const styles = EStyleSheet.create({
  wrap: {
    flexDirection: 'row',
  },
  text: {
    color: '#11151A',
    fontSize: 15,
    lineHeight: 21,
  },
})

export default ContentPreview
