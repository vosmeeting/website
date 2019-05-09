import merge from 'lodash/merge';

let BASE_PATH;
if (typeof window !== 'undefined') {
  BASE_PATH = location.protocol + '//' + location.host;
  // should be http://localhost or https://vosmeeting.com
} else {
  // work out what you want to do server-side...
  BASE_PATH = 'broken://';
}

// shared configs - can include nested attributes
const base = {
  stipe: {
    currency: 'USD'
  }
};

const dev = {
  env: 'dev',
  firebase: {
    DATABASE_URL: 'https://phil-learns.firebaseio.com',
  },
  endpoints: {
    // payment: BASE_PATH + ':23145/charge'
    payment: 'https://vosmeeting.com/vosm_payment_test/charge'
    // payment: 'http://localhost:23145/charge'
  },
  stipe: {
    publishable: 'pk_test_loAPqOiMFuxDx3my2xE3b40D'
  }
};

const prod = {
  env: 'prod',
  firebase: {
    DATABASE_URL: 'https://vosm-9a086.firebaseio.com',
  },
  endpoints: {
    // payment: BASE_PATH + '/vosm_payment/charge'
    payment: 'https://vosmeeting.com/vosm_payment/charge'
  },
  stipe: {
    publishable: 'pk_live_rNrIXxEyBd9tpTLxTw0P4iiA'
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;


export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...merge({}, base, config)
};
