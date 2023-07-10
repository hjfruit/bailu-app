import React from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import type { FC } from 'react'

interface IProps {
  required: boolean
  text: string
}

const Title: FC<IProps> = ({ required = false, text }) => {
  return (
    <View style={styles.wrap}>
      {required && <Text style={styles.required}>*</Text>}
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = EStyleSheet.create({
  wrap: {
    flexDirection: 'row',
  },
  required: {
    marginLeft: -2,
    color: '#F92F2F',
  },
  text: {
    color: '#11151A',
    fontSize: 16,
    lineHeight: 22,
  },
})

export default Title
