export const stringUtils = {
  capitalize: (s: string) =>
    s
      .split(' ')
      .map(word => word.at(0)?.toUpperCase().concat(word.slice(1)))
      .join(' ')
}
