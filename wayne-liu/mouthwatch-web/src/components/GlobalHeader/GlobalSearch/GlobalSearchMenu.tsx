import * as React from 'react'

import GlobalSearchInput from './GlobalSearchInput'
import GlobalSearchResults from './GlobalSearchResults'
import SubMenu from '#/components/GlobalHeader/SubMenu'

interface Props {
  isOpen: boolean
  hideSearch: () => void
}

export default class GlobalSearchMenu extends React.PureComponent<Props> {

  render () {
    return (
      <SubMenu closeFunction={this.props.hideSearch} isOpen={this.props.isOpen} title='Search'>
        <GlobalSearchInput />
        <GlobalSearchResults closeContainer={this.props.hideSearch} />
      </SubMenu>
    )
  }
}
