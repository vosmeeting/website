const noop = () => {}
// silence in prod
export const logger = (process.env.NODE_ENV === 'development'
  ? console
  : {
      log: noop,
      error: noop,
      info: noop,
      warn: noop,
    }) as Console
