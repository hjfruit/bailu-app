import { useRef } from 'react'

import type { SopPreviewProState } from './preview'

export default () => {
  const ref = useRef<SopPreviewProState>()

  return ref
}
