import { AccountData } from '#/microservice-middleware'

export const getNameForChat = (account: AccountData, forPatient: boolean, includeLast = false) => {
  const { display_name, first_name, last_name } = account
  if (forPatient && display_name) {
    return display_name
  }

  let name = first_name
  if (includeLast) {
    name += ' ' + last_name
  }

  return name
}
