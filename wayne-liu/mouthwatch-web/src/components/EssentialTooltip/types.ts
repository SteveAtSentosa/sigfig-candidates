import { TippyProps } from '@tippyjs/react'
export type Props = {
  children: React.ReactNode
  wrapperClassName?: string
  placement?: TippyProps['placement']
  content: React.ReactNode
  enabled?: boolean
  disableClickOnChildren?: boolean
}
