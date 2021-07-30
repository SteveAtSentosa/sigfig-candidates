import config from '#/config'

export default function constructLambdaURL (id: string, type: 'provider' | 'patient') {
  const endpoint = type === 'patient' ? `/patients/${id}/avatar` : `/accounts/${id}/avatar`
  return config.api.lambdaUrl + endpoint + '?' + new Date().getTime()
}
