import { appConfig } from '../../domain/config/appConfig';
import withPageIsNotReady from '../../views/components/hoc/withComingSoon';
import { RegisterPrivate } from '../../views/screens/RegisterVIP';

export default appConfig.ff.registration ? RegisterPrivate : withPageIsNotReady(RegisterPrivate);
