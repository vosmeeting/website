import ComingSoon from '../ComingSoon'

export default function withPageIsNotReady(WrappedComponent) {
  if (!WrappedComponent) {
    throw new Error('misconfigured')
  }
  return ComingSoon
}
