import * as React from 'react'

import { AppState } from '#/redux'
import { LoginResponseAccount } from '#/api/types'
import { connect } from 'react-redux'

type IncludeSynonym = string[] | string

interface OwnProps {
  of: 'role' | 'group'
  includes: IncludeSynonym
  all?: boolean
  children: any
}

interface StateProps {
  user: LoginResponseAccount
}

interface ActionProps {
}

interface State {
}

class Required extends React.Component<OwnProps & StateProps & ActionProps, State> {
  inSingle = (needle, haystack) => {
    return haystack.includes(needle)
  }

  inMultiple = (needles, haystack) => {
    const truthTransform = needles.map((v) => this.inSingle(v, haystack))
    if (this.props.all) {
      return truthTransform.every((el) => el === true)
    } else {
      return truthTransform.reduce((acc, v) => {
        if (acc) {
          return true
        }
        acc = v
        return acc
      }, false)
    }
  }

  hasRole = (required: IncludeSynonym, user) => {
    const userRoles = Array.isArray(user) ? user : user.roles
    if (this.inSingle('superuser', userRoles)) {
      return true
    }
    const curried = this.singleOrMultiple(required)
    return curried(userRoles)
  }

  hasGroup = (required: IncludeSynonym, user) => {
    const userGroups = Array.isArray(user) ? user : user.groups
    if (this.inSingle('root', userGroups)) {
      return true
    }
    const curried = this.singleOrMultiple(required)
    return curried(userGroups)
  }

  singleOrMultiple = (required: IncludeSynonym) => {
    return (groups) => {
      if (typeof required === 'string') {
        return this.inSingle(required, groups)
      } else {
        return this.inMultiple(required, groups)
      }
    }
  }

  render () {
    if (this.props.user) {
      const userRoles = this.props.user.account_roles.map((v) => (v.name))
      const userGroups = this.props.user.groups.map((v) => (v.group_type.code))
      const { of, includes } = this.props
      if (of === 'role' && !this.hasRole(includes, userRoles)) {
        return false
      }
      if (of === 'group' && !this.hasGroup(includes, userGroups)) {
        return false
      }

      return this.props.user && this.props.children
    } else {
      return false
    }
  }
}

export default connect<StateProps, ActionProps, OwnProps, AppState>(
  (state) => {
    return {
      user: state.auth.data && state.auth.data.account
    }
  },
  {
  }
)(Required)

// eventually connect this to redux with the logged in user
// export const IsYourself = (target, ownComparison?: (target,you) => boolean) => {
//   if (ownComparison) {
//     return ownComparison(target, you)
//   }
//   return target.id === you.id
// }

export const IsYourself = (target, you?, ownComparison?: (target, you) => boolean) => {

  if (you) {
    if (ownComparison) {
      return ownComparison(target, you)
    }
    return target.id === you.id
  } else {
    return false && target && ownComparison
  }

}
