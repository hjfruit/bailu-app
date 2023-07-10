import React from 'react'

import { fieldKeyMap, maybeTips } from '../helpers'

import ContentPreview from './components/content.preview'
import TitlePreview from './components/title.preview'
import type { FC } from 'react'
import type { PreviewCommonProps } from './interface'

interface IProps extends PreviewCommonProps {}

const CheckboxPreview: FC<IProps> = ({ question, namePrefix, name }) => {
  return (
    <>
      <TitlePreview text={maybeTips(question.name, question.remarks)} />
      <ContentPreview
        question={question}
        namePrefix={namePrefix}
        name={name}
        field={fieldKeyMap[question.type]}
      />
    </>
  )
}

export default CheckboxPreview
