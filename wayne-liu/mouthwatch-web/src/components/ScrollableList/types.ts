export interface DividerType<T> {
  divider: React.ReactNode
  condition: (item: T, array: T[]) => boolean
}

export interface DefaultProps {
  className: string
  loading: boolean
  loadMore: () => void
  renderLoading: () => React.ReactNode
  isPatient?: boolean
}

export interface Props<T> extends Partial<DefaultProps> {
  children: (item: T) => React.ReactNode
  items: T[] | [T[], T[]]
}
