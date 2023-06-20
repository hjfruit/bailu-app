import { useRef } from 'react'

import type { SopFormProState } from './form'

export default () => {
  const ref = useRef<SopFormProState>()

  return ref
}
