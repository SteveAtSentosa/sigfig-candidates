import * as React from 'react'

import { DefaultProps, Props } from './types'
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons'

import { ChatType } from '#/pages/Chat/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cn from 'classnames'
import uuid from 'uuid/v4'

const styles = require('./styles.scss')

interface IndexedT {
  id: string
  [key: string]: any
}

const Divider: React.FunctionComponent<{ type: ChatType }> = (props) => {
  const isPatient = props.type === 'patient'
  return (
    <div className={styles.divider}>
      <FontAwesomeIcon icon={isPatient ? faUsers : faUser}/>
      <p>{isPatient ? 'Patient' : 'Provider'} Chat</p>
    </div>
  )
}

export default class ScrollableList<T> extends React.Component<Props<T>> {

  static defaultProps: DefaultProps = {
    className: '',
    loading: false,
    loadMore: () => { /* noop */ },
    renderLoading: () => <>Loading...</>
  }

  listRef = React.createRef<HTMLDivElement>()
  ulRef = React.createRef<HTMLUListElement>()

  onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { offsetHeight, scrollTop, scrollHeight } = e.target as HTMLDivElement
    (Math.ceil(offsetHeight + scrollTop) >= scrollHeight) && this.props.loadMore()
  }

  componentDidUpdate () {
    if (this.listRef.current.offsetHeight === this.ulRef.current.offsetHeight && !this.props.loading) {
      this.props.loadMore && this.props.loadMore()
    }
  }

  renderList = (items: T[]) => {
    const { children: renderItem } = this.props

    return items.map((item, _i) => {
      return (
        <li key={(item as unknown as IndexedT).id}>{renderItem(item)}</li>
      )
    })
  }

  renderListChat = (items: [T[], T[]]) => {
    const { children: renderItem, isPatient } = this.props
    const [ providerChannels, patientChannels ] = items
    return (
      <>
        {!isPatient && <Divider type='provider'/>}
        {providerChannels.map((item, _i) => {
          return (
            <li key={(item as unknown as IndexedT).id}>{renderItem(item)}</li>
          )
        })}
        {!isPatient && <Divider type='patient'/>}
        {patientChannels.map((item, _i) => {
          return (
            <li key={(item as unknown as IndexedT).id}>{renderItem(item)}</li>
          )
        })}
      </>
    )
  }

  renderScrollableList = () => {
    const { items } = this.props
    if ((items[0] instanceof Array) && (items[1] instanceof Array) && items.length === 2) {
      return this.renderListChat(items as [T[], T[]])
    } else {
      return this.renderList(items as T[])
    }
  }

  render () {
    const {
      className,
      loading = false,
      renderLoading
    } = this.props

    return (
      <div className={cn(styles.list, { [className]: className })} onScroll={this.onScroll} ref={this.listRef}>
        <ul ref={this.ulRef}>
          {this.renderScrollableList()}
          {loading && <li key={uuid()}>{renderLoading()}</li>}
        </ul>
      </div>
    )
  }

}
