import type { ComponentProps } from 'react'
import type { SopCheckItemResultPayload } from '../graphql/generated/types'

import type { SopFormInstance } from '../form'
import type Upload from '@fruits-chain/upload'

export interface CommonProps {
  form: SopFormInstance
  question: SopCheckItemResultPayload
  namePrefix: (string | number)[]
  name: (string | number)[]
  uploadProps: ComponentProps<typeof Upload>
}

export interface PreviewCommonProps {
  question: SopCheckItemResultPayload
  namePrefix: (string | number)[]
  name: (string | number)[]
}
