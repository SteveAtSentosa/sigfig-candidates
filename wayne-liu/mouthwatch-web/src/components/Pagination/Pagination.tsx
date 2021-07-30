import * as React from 'react'
import ReactPaginate from 'react-paginate'
import Icon from '#/components/Icon'
const styles = require('./styles.scss')

interface Props {
  pages: number
  currentPage?: number
  handleClick?: (page: number) => void
}

export default class Pagination extends React.PureComponent<Props> {

  handleClick = (currentPageObject: { selected: number }) => {
    this.props.handleClick(currentPageObject.selected + 1)
  }

  render () {
    return (
        <div className={styles.paginationContainer}>
          <div className={styles.pages}>
            <ReactPaginate
              pageCount={this.props.pages}
              pageRangeDisplayed={4}
              marginPagesDisplayed={4}
              forcePage={this.props.currentPage - 1}
              onPageChange={this.handleClick}
              previousLabel={<Icon name='keyboard_arrow_left' />}
              nextLabel={<Icon name='keyboard_arrow_right' />}
              breakLabel={'...'}
              activeLinkClassName={styles.currentPage}
              containerClassName={styles.buttonContainer}
              disabledClassName={styles.disabled}
            />
          </div>
        </div>

    )
  }

}
