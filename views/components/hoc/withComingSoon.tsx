import ComingSoon from '../ComingSoon';

export default function withPageIsNotReady(WrappedComponent: any) {
  if (!WrappedComponent) {
    throw new Error('misconfigured');
  }
  return ComingSoon;
}
