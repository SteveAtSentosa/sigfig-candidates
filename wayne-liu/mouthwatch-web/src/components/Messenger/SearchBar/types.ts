import { Filter, FilterType } from '#/actions/chat'

import { InjectedFormProps } from 'redux-form'

export interface DefaultProps {
  placeholder: string
}

export interface FormData {
  searchTerm: string
}

export interface Props extends Partial<DefaultProps>, InjectedFormProps<FormData, Props> {
  filter: typeof Filter
  form: string
  type: FilterType
}

export type ActionProps = Pick<Props, 'filter'>

export type OwnProps = Pick<Props, 'placeholder' | 'form' | 'type'>
