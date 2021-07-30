import { ActionProps } from './types'
import { Filter } from '#/actions/chat'
import SearchBar from './SearchBar'
import { connect } from 'react-redux'

export const mapDispatch: ActionProps = {
  filter: Filter
}

export default connect(null, mapDispatch)(SearchBar)
