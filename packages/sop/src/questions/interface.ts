import type { SopCheckItemResultPayload } from '../graphql/generated/types'

import type { SopFormInstance } from '../form'

export interface CommonProps {
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
