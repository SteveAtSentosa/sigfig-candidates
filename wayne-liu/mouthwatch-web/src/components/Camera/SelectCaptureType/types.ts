import { CaptureType, SetCaptureType } from '#/actions/camera'
export interface DefaultProps {}

export interface Props extends Partial<DefaultProps> {
  setCaptureType: typeof SetCaptureType
  captureType: CaptureType
  onImport: (file: FileList) => any
}

export type StateProps = Pick<Props,'captureType'>
export type ActionProps = Pick<Props, 'setCaptureType'>
export type OwnProps = Pick<Props, 'onImport'>
