import * as React from 'react'

import { DefaultProps, FormData, OwnProps, Props } from './types'
import { Field as ReduxFormField, reduxForm } from 'redux-form'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import { faSearch } from '@fortawesome/pro-regular-svg-icons'
import { faTimes } from '@fortawesome/pro-light-svg-icons'

const styles = require('./styles.scss')

class SearchBar extends React.PureComponent<Props> {

  static defaultProps: DefaultProps = {
    placeholder: 'Search...'
  }

  private clearForm = () => {
    const { reset, filter, type } = this.props
    reset()
    filter({ searchTerm: '', type })
  }

  private onSubmit = (values: FormData) => {
    const { filter, type } = this.props
    const { searchTerm = '' } = values
    filter({ searchTerm, type })
  }

  private handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, filter } = this.props
    const { value: searchTerm = '' } = e.target
    filter({ searchTerm, type })
  }

  private get renderClose () {
    const { dirty } = this.props
    if (!dirty) return null

    return (
      <span onClick={this.clearForm} className={styles.clear}>
        <FontAwesomeIcon className={styles.icon} icon={faTimes} />
      </span>
    )
  }

  render () {
    const { form, handleSubmit, placeholder, type } = this.props
    const searchBarClassName = cn(styles.filter, {
      [styles.messages]: type === 'messages'
    })
    return (
    <form id={form} onSubmit={handleSubmit(this.onSubmit)} className={searchBarClassName}>
      <ReduxFormField
        type='text'
        name='searchTerm'
        component='input'
        placeholder={placeholder}
        className={styles.searchInput}
        onChange={this.handleOnChange}
        />
      {this.renderClose}
      <button type='submit' form={form} className={styles.searchButton}>
        <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
      </button>
    </form>)
  }
}

export default reduxForm<FormData, OwnProps>({})(SearchBar)
