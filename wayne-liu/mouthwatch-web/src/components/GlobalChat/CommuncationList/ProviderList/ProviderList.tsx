import * as React from 'react'

import { Props, ReduxFormProps } from './types'
import { faPlus, faSearch, faTimes } from '@fortawesome/pro-light-svg-icons'

import { Account } from '#/types'
import AccountAvatar from '#/components/AccountAvatar'
import { Field } from 'redux-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = require('./styles.scss')

class ProviderList extends React.PureComponent<ReduxFormProps & Props> {
  private get providers () {
    const { chatUsers, chatUsersIds } = this.props
    return chatUsersIds.filter(id => !chatUsers[id]._is_patient).map(id => chatUsers[id])
  }

  private handleProviderClick = (userId: string) =>
    () => this.props.startConversation({ userId })

  private renderProvider = (provider: Account) => {
    return (
      <li className={styles.provider} key={provider.id} onClick={this.handleProviderClick(provider.id)}>
        <div className={styles.accountAvatar}>
          <AccountAvatar entityId={provider.id} type='provider' showStatusIndicator height={25} width={25}/>
        </div>
        <div className={styles.name}>{`${provider.first_name} ${provider.last_name}`}</div>
        <div className={styles.archive}>
          <FontAwesomeIcon icon={faTimes} />
        </div>
      </li>
    )
  }

  private onSubmit = () => { /* no - op */ }

  private get renderClose () {
    return (
      <span className={styles.clear}>
        <FontAwesomeIcon className={styles.icon} icon={faTimes} />
      </span>
    )
  }

  private get renderProviderList () {
    return (
      <ul className={styles.providerListWrapper}>
        { this.providers.map(this.renderProvider) }
      </ul>
    )
  }

  render () {
    const { form, handleSubmit } = this.props
    return (
      <>
        <ul className={styles.providerList}>
          <li className={styles.searchWrapper}>
          <form id={form} onSubmit={handleSubmit(this.onSubmit)}>
              <Field
                component='input'
                name='searchTerm'
                placeholder='Search Providers'
                onChange={() => { /* no- op */ }}
                type='text'
                className={styles.searchInput}
                />
              {this.renderClose}
              <button type='submit' form={form} className={styles.searchButton}>
                <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
              </button>
            </form>
          </li>
          <li className={styles.newMessage}>
            <div className={styles.plusIconWrapper}>
              <div className={styles.plusIcon}>
                <FontAwesomeIcon icon={faPlus}/>
              </div>
            </div>
            <div className={styles.addNewMessage}>
              New Message
            </div>
          </li>

          {this.renderProviderList}

        </ul>
      </>
    )
  }
}
export default ProviderList
