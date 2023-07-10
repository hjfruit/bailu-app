import React from 'react'
import { View, Text } from 'react-native'
import type { FC } from 'react'
import type { ViewProps } from 'react-native'

interface IProps extends ViewProps {
  text: string
}

const Tips: FC<IProps> = ({ text, style, ...viewProps }) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: 8,
          paddingVertical: 8,
          borderRadius: 4,
          backgroundColor: '#F9F9F9',
        },
        style,
      ]}
      {...viewProps}>
      <Text
        style={{
          color: '#8C9199',
          fontSize: 12,
          lineHeight: 17,
        }}>
        {text}
      </Text>
    </View>
  )
}

export default Tips
