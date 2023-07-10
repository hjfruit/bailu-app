import React from 'react'
import { View, Text } from 'react-native'
import type { FC } from 'react'

interface IProps {
  option: {
    label: string
    remarks: string
  }
  bg?: boolean
}

const Option: FC<IProps> = ({ option, bg = false }) => {
  const bgStyle = bg
    ? {
        marginRight: 14,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
      }
    : {}
  const wrapStyle = {
    flex: 1,
    marginVertical: 8,
    padding: 6,
    ...bgStyle,
  }

  return (
    <View style={wrapStyle}>
      <Text
        style={{
          color: '#11151A',
          fontSize: 16,
        }}>
        {option.label}
      </Text>
      {option?.remarks ? (
        <Text
          style={{
            color: '#8C9199',
            fontSize: 12,
            paddingTop: 6,
          }}>
          {option.remarks}
        </Text>
      ) : null}
    </View>
  )
}

export default Option
