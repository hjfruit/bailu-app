import React from 'react'
import type { FC } from 'react'
import { Text, View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'

interface IProps {
  text: string
}

const TitlePreview: FC<IProps> = ({ text }) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>{text}：</Text>
    </View>
  )
}

const styles = EStyleSheet.create({
  wrap: {
    flexDirection: 'row',
  },
  text: {
    color: '#5A6068',
    fontSize: 15,
    lineHeight: 21,
  },
})

export default TitlePreview
