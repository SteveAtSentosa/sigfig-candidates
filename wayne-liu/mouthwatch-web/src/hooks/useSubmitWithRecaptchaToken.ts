import { RECAPTCHA_SITE_KEY } from '#/consts'

export function useSubmitWithRecaptchaToken<T> (values: T, callback: (data: T) => void) {
  (window as any).grecaptcha.ready(() => {
    (window as any).grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' }).then((token: string) => {
      const data = Object.assign({}, values, { recaptcha_token: token })
      callback(data)
    })
  })
}
