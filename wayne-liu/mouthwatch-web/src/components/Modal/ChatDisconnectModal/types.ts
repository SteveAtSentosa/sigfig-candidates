import * as Modal from '#/components/Modal'

import { Close, Connect } from '#/microservice-middleware'
import { CloseModal, OpenModal } from '#/actions/modals'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps>, Modal.BaseModalProps {
  openModal: typeof OpenModal
  closeModal: typeof CloseModal
  isOpen: boolean
  connect: typeof Connect
  disconnect: typeof Close
}

export type ActionProps = Pick<Props, 'openModal' | 'closeModal' | 'connect' | 'disconnect'>
export type StateProps = Pick<Props, 'isOpen' >
