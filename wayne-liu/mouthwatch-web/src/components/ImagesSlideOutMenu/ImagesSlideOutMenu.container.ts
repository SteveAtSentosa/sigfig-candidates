import { AppState } from '#/redux'
import { connect } from 'react-redux'
import { ActionProps, StateProps } from './types'
import ImagesSlideOutMenu from './ImagesSlideOutMenu'
import { CloseSideMenu, DeSelectMedia, SelectMedia } from '#/actions/media'

export const mapState = (state: AppState): StateProps => {
  return {
    token: state.auth.data.token,
    preprocessed: state.media.menu.selected,
    media: state.media.data
  }
}

export const actions: ActionProps = {
  select: SelectMedia,
  deselect: DeSelectMedia,
  closeCollectedMediaMenu: CloseSideMenu
}

export default connect(mapState, actions)(ImagesSlideOutMenu)
