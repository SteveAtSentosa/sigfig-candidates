import { Logout } from '#/actions/auth'
import { getGroup } from '#/api'
import { AppState } from '#/redux'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export function useSubscriptionExpiration () {
  const dispatch = useDispatch()
  const authToken = useSelector((state: AppState) => state.auth.data && state.auth.data.token)
  const { isPatient, groupId } = useSelector((state: AppState) => state.ui)
  const [fetchingGroup, setFetchingGroup] = useState(true)
  const [group, setGroup] = useState(null)

  useEffect(() => {
    setFetchingGroup(true)
    if (isPatient) {
      getGroup(authToken)(groupId).then((response) => {
        setFetchingGroup(false)
        setGroup(response.data)
      }).catch(() => {
        setFetchingGroup(false)
      })
    }

    dispatch(Logout({}))
  }, [isPatient])

  return { fetchingGroup, group }
}
