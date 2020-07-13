export const parseName = (fullName?: string): [string, string] => {
  let firstName = ''
  let lastName = ''
  if (fullName) {
    const splitName = fullName.split(/(\s+)/)
    firstName = splitName[0] ?? ''
    lastName = splitName[2] ?? ''
  }

  return [firstName, lastName]
}
