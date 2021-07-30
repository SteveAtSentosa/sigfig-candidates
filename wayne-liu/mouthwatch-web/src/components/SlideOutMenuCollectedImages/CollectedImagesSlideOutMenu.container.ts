import { ActionProps, StateProps } from './types'

import { AppState } from '#/redux'
import { CloseSideMenu } from '#/actions/media'
import CollectedImagesSlideOutMenu from './CollectedImagesSlideOutMenu'
import { connect } from 'react-redux'

export const mapState = (state: AppState): StateProps => {
  return {
    _isOpen: state.media.menu.isOpen
  }
}

export const mapDispatch: ActionProps = {
  _closeSideMenu: CloseSideMenu
}

export default connect(mapState, mapDispatch)(CollectedImagesSlideOutMenu)
