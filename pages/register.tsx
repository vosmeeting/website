import { appConfig } from '../domain/config/appConfig';
import withPageIsNotReady from '../views/components/hoc/withComingSoon';
import { Register } from '../views/screens/Register';

export default appConfig.ff.registration ? Register : withPageIsNotReady(Register);
