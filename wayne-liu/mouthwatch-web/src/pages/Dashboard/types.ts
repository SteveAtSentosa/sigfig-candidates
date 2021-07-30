import { ViewPermissions } from '#/types'

export type Props = {
  viewPerms: ViewPermissions
}

export type StateProps = Pick<Props, 'viewPerms'>
