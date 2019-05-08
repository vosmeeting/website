import config from './config';

const Log = config.env === 'dev' ? console.log.bind(console) : function () {};

export default Log;