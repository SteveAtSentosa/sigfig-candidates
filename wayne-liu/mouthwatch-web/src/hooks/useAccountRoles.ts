import { useEffect, useState } from 'react'

import { Role } from '#/types'
import { getAccountRoleList } from '#/api'

export function useAccountRoles () {
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState<Error>()
  useEffect(() => {
    async function getRoles () {
      return getAccountRoleList()()
    }
    getRoles()
      .then(res => {
        const excludedRoles = ['superuser', 'patient', 'hssales', 'accountowner', 'primarybillingowner']
        setRoles(res.data.filter(a => !excludedRoles.includes(a.name)))
      })
      .catch(err => {
        setError(err)
      })
  }, [])

  return {
    roles,
    error
  }
}
