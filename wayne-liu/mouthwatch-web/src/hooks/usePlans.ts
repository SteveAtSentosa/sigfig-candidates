import { useEffect, useState } from 'react'

import { Plan } from '@m***/library'
import { getTeleDentPlans } from '#/api'

export function usePlans () {
  const [plans, setPlans] = useState<Plan[]>([])
  const [error, setError] = useState<Error>()
  useEffect(() => {
    async function getPlans () {
      return getTeleDentPlans()()
    }
    getPlans()
      .then(res => {
        setPlans(res)
      })
      .catch(err => {
        setError(err)
      })
  }, [])

  return {
    plans,
    error
  }
}
