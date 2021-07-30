import * as Modal from '#/components/Modal'

import { CloseModal, OpenModal } from '#/actions/modals'

export interface DefaultProps {}

export interface Props extends Partial<DefaultProps>, Modal.BaseModalProps {
  openModal: typeof OpenModal
  closeModal: typeof CloseModal
  attachVideoFile: (file: File) => any
  isOpen: boolean
}

export type ActionProps = Pick<Props, 'openModal' | 'closeModal'>
export type StateProps = Pick<Props, 'isOpen' >
export type OwnProps = Pick<Props, 'attachVideoFile'>
