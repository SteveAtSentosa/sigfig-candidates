import { getRecaptchaScript } from '#/utils/Recaptcha'
import { useEffect } from 'react'

export function useRecaptchaScript () {
  useEffect(() => {
    const script = getRecaptchaScript()
    document.getElementsByTagName('head')[0].appendChild(script)

    return function cleanup () {
      document.getElementsByTagName('head')[0].removeChild(script)
    }
  }, [])
}
