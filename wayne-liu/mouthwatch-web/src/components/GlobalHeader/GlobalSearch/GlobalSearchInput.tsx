import * as React from 'react'

import { AppState } from '#/redux'
import { GlobalSearch } from '#/actions/globalSearch'
import Input from '#/components/Input'
import { connect } from 'react-redux'
import { debounce } from 'lodash'

const styles = require('./styles.scss')

interface ActionProps {
  globalSearch: typeof GlobalSearch
}

class Search extends React.Component<ActionProps> {

  search = (e) => {
    const { value } = e.target
    if (value) {
      this.props.globalSearch({ searchTerm: value })
    } else {
      // TODO: Clear search
    }
  }

  debounceSearch = debounce(this.search, 500)

  render () {
    return (
      <div className={styles.searchInput}>
        <Input
          icon={<img src='/static/images/icon_search.png'/>}
          onPressIcon={this.search}
          onChange={this.debounceSearch}
          placeholder='Enter search term ...'
        />
      </div>
    )
  }
}

export default connect<{}, ActionProps, {}, AppState>(
  null,
  {
    globalSearch: GlobalSearch
  }
)(Search)
