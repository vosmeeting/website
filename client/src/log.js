import config from './config';

const Log = config.env === 'dev' ? console.log.bind(console) : function () {};

// const Log = console.log.bind(console);

export default Log;