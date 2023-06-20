import { TextInput } from '@fruits-chain/react-native-xiaoshu'
import React from 'react'
import type { FC } from 'react'

interface IProps {}

const Textarea: FC<IProps> = ({ ...restProps }) => {
  return (
    <TextInput
      type="textarea"
      bordered
      placeholder="请填写备注信息"
      {...restProps}
    />
  )
}

export default Textarea
