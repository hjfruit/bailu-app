import type { ComponentProps } from 'react'
import type { SopCheckItemResultPayload } from '../graphql/generated/types'

import type { SopFormInstance } from '../form'
import type Upload from '@fruits-chain/react-native-upload'

export interface CommonProps
  extends Pick<ComponentProps<typeof Upload>, 'watermark'> {
  form: SopFormInstance
  question: SopCheckItemResultPayload
  namePrefix: (string | number)[]
  name: (string | number)[]
  formUuid: string
  uuid: string
  backUpload: boolean
}

export interface PreviewCommonProps {
  question: SopCheckItemResultPayload
  namePrefix: (string | number)[]
  name: (string | number)[]
}
