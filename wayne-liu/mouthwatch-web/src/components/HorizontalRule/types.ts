export interface DefaultProps {
  text: string
  width: string
}

export interface Props extends Partial<DefaultProps> {
  defaultProps?: DefaultProps
}
