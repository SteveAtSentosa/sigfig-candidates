import { Media } from '#/types'

export interface DefaultProps {
  className: string
}

export interface Props extends Partial<DefaultProps> {
  media?: Media
  file?: File
  token?: string
}

export type OwnProps = Pick<Props, 'media' | 'className' | 'token' | 'file'>
